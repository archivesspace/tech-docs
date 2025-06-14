---
title: Backend
description: Describes the architecture behind the backend of ArchivesSpace, including the main.rb and rest.rb files for initiating ArchivesSpace and defining API mechanisms, controllers, models, nested records, relationships, agents, validation, optimistic concurrency control, and the permissions model.
---

The backend is responsible for implementing the ArchivesSpace API, and
supports the sort of access patterns shown in the previous section.
We've seen that the backend must support CRUD operations against a
number of different record types, and those records as expressed as
JSON documents produced from instances of JSONModel classes.

The following sections describe how the backend fits together.

## main.rb -- load and initialize the system

The `main.rb` program is responsible for starting the ArchivesSpace
system: loading all controllers and models, creating
users/groups/permissions as needed, and preparing the system to handle
requests.

When the system starts up, the `main.rb` program performs the
following actions:

- Initializes JSONModel--triggering it to load all record schemas
  from the filesystem and generate the classes that represent each
  record type.
- Connects to the database
- Loads all backend models--the system's domain objects and
  persistence layer
- Loads all controllers--defining the system's REST endpoints
- Starts the job scheduler--handling scheduled tasks such as backups
  of the demo database (if used)
- Runs the "bootstrap ACLs" process--creates the admin user and
  group if they don't already exist; creates the hidden global
  repository; creates system users and groups.
- Fires the "backend started" notification to any registered
  observers.

In addition to handling the system startup, `main.rb` also provides
the following facilities:

- Session handling--tracks authenticated backend sessions using the
  token extracted from the `X-ArchivesSpace-Session` request header.
- Helper methods for accessing the current user and current session
  of each request.

## rest.rb -- Request and response handling for REST endpoints

The `rest.rb` module provides the mechanism used to define the API's
REST endpoints. Each endpoint definition includes:

- The URI and HTTP request method used to access the endpoint
- A list of typed parameters for that endpoint
- Documentation for the endpoint, each parameter, and each possible
  response that may be returned
- Permission checks--predicates that the current user must satisfy
  to be able to use the endpoint

Each controller in the system consists of one or more of these
endpoint definitions. By using the endpoint syntax provided by
`rest.rb`, the controllers can declare the interface they provide, and
are freed of having to perform the sort of boilerplate associated
with request handling--check parameter types, coerce values from
strings into other types, and so on.

The `main.rb` and `rest.rb` components work together to insulate the
controllers from much of the complexity of request handling. By the
time a request reaches the body of an endpoint:

- It can be sure that all required parameters are present and of the
  correct types.
- The body of the request has been fetched, parsed into the
  appropriate type (usually a JSONModel instance--see below) and
  made available as a request parameter.
- Any parameters provided by the client that weren't present in the
  endpoint definition have been dropped.
- The user's session has been retrieved, and any defined access
  control checks have been carried out.
- A connection to the database has been assigned to the request, and
  a transaction has been opened. If the controller throws an
  exception, the transaction will be automatically rolled back.

## Controllers

As touched upon in the previous section, controllers implement the
functionality of the ArchivesSpace API by registering one or more
endpoints. Each endpoint accepts a HTTP request for a given URI,
carries out the request and returns a JSON response (if successful) or
throws an exception (if something goes wrong).

Each controller lives in its own file, and these can be found in the
`backend/app/controllers` directory. Since most of the request
handling logic is captured by the `rest.rb` module, controllers
generally don't do much more than coordinate the classes from the
model layer and send a response back to the client.

### crud_helpers.rb -- capturing common CRUD controller actions

Even though controllers are quite thin, there's still a lot of overlap
in their behaviour. Each record type in the system supports the same
set of CRUD operations, and from the controller's point of view
there's not much difference between an update request for an accession
and an update request for a digital object (for example).

The `crud_helpers.rb` module pulls this commonality into a set of
helper methods that are invoked by each controller, providing methods
for the standard operations of the system.

## Models

The backend's model layer is where the action is. The model layer's
role is to bridge the gap between the high-level JSONModel objects
(complete with their properties, nested records, references to other
records, etc.) and the underlying relational database (via the Sequel
database toolkit). As such, the model layer is mainly concerned with
mapping JSONModel instances to database tables in a way that preserves
everything and allows them to be queried efficiently.

Each record type has a corresponding model class, but the individual
model definitions are often quite sparse. This is because the
different record types differ in the following ways:

- The set of properties they allow (and their types, valid values,
  etc.)
- The types of nested records they may contain
- The types of relationships they may have with other record types

The first of these--the set of allowable properties--is already
captured by the JSONModel schema definitions, so the model layer
doesn't have to enforce these restrictions. Each model can simply
take the values supplied by the JSONModel object it is passed and
assume that everything that needs to be there is there, and that
validation has already happened.

The remaining two aspects _are_ enforced by the model layer, but
generally don't pertain to just a single record type. For example, an
accession may be linked to zero or more subjects, but so can several
other record types, so it doesn't make sense for the `Accession` model
to contain the logic for handling subjects.

In practice we tend to see very little functionality that belongs
exclusively to a single record type, and as a result there's not much
to put in each corresponding model. Instead, models are generally
constructed by combining a number of mix-ins (Ruby modules) to satisfy
the requirements of the given record type. Features à la carte!

### ASModel and other mix-ins

At a minimum, every model includes the `ASModel` mix-in, which provides
base versions of the following methods:

- `Model.create_from_json` -- Take a JSONModel instance and create a
  model instance (a subclass of Sequel::Model) from it. Returns the
  instance.
- `model.update_from_json` -- Update the target model instance with
  the values from a given JSONModel instance.
- `Model.sequel_to_json` -- Return a JSONModel instance of the appropriate
  type whose values are taken from the target model instance.
  Model classes are declared to correspond to a particular JSONModel
  instance when created, so this method can automatically return a
  JSONModel instance of the appropriate type.

These methods comprise the primary interface of the model layer:
virtually every mix-in in the model layer overrides one or all of
these to add behaviour in a modular way.

For example, the 'notes' mix-in adds support for multiple notes to be
added to a record type--by mixing this module into a model class, that
class will automatically accept a JSONModel property called 'notes'
that will be stored and retrieved to and from the database as needed.
This works by overriding the three methods as follows:

- `Model.create_from_json` -- Call 'super' to delegate the creation to
  the next mix-in in the chain. When it returns the newly created
  object, extract the notes from the JSONModel instance and attach
  them to the model instance (saving them in the database).
- `model.update_from_json` -- Call 'super' to save the other updates
  to the database, then replace any existing notes entries for the
  record with the ones provided by the JSONModel.
- `Model.sequel_to_json` -- Call 'super' to have the next mix-in in
  the chain create a JSONModel instance, then pull the stored notes
  from the database and poke them into it.

All of the mix-ins follow this pattern: call 'super' to delegate the
call to the next mix-in in the chain (eventually reaching ASModel),
then manipulate the result to implement the desired behaviour.

### Nested records

Some record types, like accessions, digital objects, and subjects, are
_top-level records_, in the sense that they are created independently
of any other record and are addressable via their own URI. However,
there are a number of records that can't exist in isolation, and only
exist in the context of another record. When one record can contain
instances of another record, we call them _nested records_.

To give an example, the `date` record type is nested within an
`accession` record (among others). When the model layer is asked to
save a JSONModel instance containing nested records, it must pluck out
those records, save them in the appropriate database table, and ensure
that linkages are created within the database to allow them to be
retrieved later.

This happens often enough that it would be tedious to write code for
each model to handle its nested records, so the ASModel mix-in
provides a declaration to handle this automatically. For example, the
`accession` model uses a definition like:

```ruby
base.def_nested_record(:the_property => :dates,
                      :contains_records_of_type => :date,
                      :corresponding_to_association  => :date)
```

When creating an accession, this declaration instructs the `Accession`
model to create a database record for each date listed in the "dates"
property of the incoming record. Each of these date records will be
automatically linked to the created accession.

### Relationships

A relationship is a link between two top-level records, where the link
is a separate, dynamically generated, model with zero or more
properties of its own.

For example, the `Event` model can be related to several different
types of records:

```ruby
define_relationship(:name => :event_link,
                    :json_property => 'linked_records',
                    :contains_references_to_types => proc {[Accession, Resource, ArchivalObject]})
```

This declaration generates a custom class that models the relationship
between events and the other record types. The corresponding JSON
schema declaration for the `linked_records` property looks like this:

```ruby
"linked_records" => {
  "type" => "array",
  "ifmissing" => "error",
  "minItems" => 1,
  "items" => {
    "type" => "object",
    "subtype" => "ref",
    "properties" => {
      "role" => {
        "type" => "string",
        "dynamic_enum" => "linked_event_archival_record_roles",
        "ifmissing" => "error",
      },
      "ref" => {
        "type" => [{"type" => "JSONModel(:accession) uri"},
                    {"type" => "JSONModel(:resource) uri"},
                    {"type" => "JSONModel(:archival_object) uri"},
                    ...],
        "ifmissing" => "error"
      },
    ...
```

That is, the property includes URI references to other records, plus
an additional "role" property to indicate the nature of the
relationship. The corresponding JSON might then be:

```ruby
linked_records: [{ref: '/repositories/123/accessions/456', role: 'authorizer'}, ...]
```

The `define_relationship` definition automatically makes use of the
appropriate join tables in the database to store this relationship and
retrieve it later as needed.

### Agents and `agent_manager.rb`

Agents present a bit of a representational challenge. There are four
types of agents (person, family, corporate entity, software), and at a
high-level they are structured in the same way: each type can contain
one or more name records, zero or more contact records, and a number
of properties. Records that link to agents (via a relationship, for
example) can link to any of the four types so, in some sense, each
agent type implements a common `Agent` interface.

However, the agent types differ in their details. Agents contain name
records, but the types of those name records correspond to the type of
the agent: a person agent contains a person name record, for example.
So, in spite of their similarities, the different agents need to be
modelled as separate record types.

The `agent_manager` module captures the high-level similarities
between agents. Each agent model includes the agent manager mix-in:

```ruby
include AgentManager::Mixin
```

and then defines itself declaratively by the provided class method:

```ruby
register_agent_type(:jsonmodel => :agent_person,
                    :name_type => :name_person,
                    :name_model => NamePerson)
```

This definition sets up the properties of that agent. It creates:

- a one_to_many relationship with the corresponding name
  type of the agent.
- a one_to_many relationship with the agent_contact table.
- nested record definition which defines the names list of the agent
  (so the list of names for the agent are automatically stored in
  and retrieved from the database)
- a nested record definition for contact list of the agent.

## Validations

As records are added to and updated within the ArchivesSpace system,
they are validated against a number of rules to make sure they are
well-formed and don't conflict with other records. There are two
types of record validation:

- Record-level validations check that a record is self-consistent:
  that it contains all required fields, that its values are of the
  appropriate type and format, and that its fields don't contradict
  one another.
- System-level validations check that a record makes sense in a
  broader context: that it doesn't share a unique identifier with
  another record, and that any record it references actually exists.

Record-level validations can be performed in isolation, while
system-level records require comparing the record to others in the
database.

System-level validations need to be implemented in the database itself
(as integrity constraints), but record-level validations are often too
complex to be expressed this way. As a result, validations in
ArchivesSpace can appear in one or both of the following layers:

- At the JSONModel level, validations are captured by JSON schema
  documents. Where more flexibility is needed, custom validations
  are added to the `common/validations.rb` file, allowing validation
  logic to be expressed using arbitrary Ruby code.
- At the database level, validations are captured using database
  constraints. Since the error messages yielded by these
  constraints generally aren't useful for users, database
  constraints are also replicated in the backend's model layer using
  Sequel validations, which give more targeted error messages.

As a general rule, record-level validations are handled by the
JSONModel validations (either through the JSON schema or custom
validations), while system-level validations are handled by the model
and the database schema.

## Optimistic concurrency control

Updating a record using the ArchivesSpace API is a two part process:

```ruby
# Perform a `GET` against the desired record to fetch its JSON
# representation:

GET /repositories/5/accessions/2

# Manipulate the JSON representation as required, and then `POST`
# it back to replace the original:

POST /repositories/5/accessions/2
```

If two people do this simultaneously, there's a risk that one person
would silently overwrite the changes made by the other. To prevent
this, every record is marked with a version number that it carries in
the `lock_version` property. When the system receives the updated
copy of a record, it checks that the version it carries is still
current; if the version number doesn't match the one stored in the
database, the update request is rejected and the user must re-fetch
the latest version before applying their update.

## The ArchivesSpace permissions model

The ArchivesSpace backend enforces access control, defining which
users are allowed to create, read, update, suppress and delete the
records in the system. The major actors in the permissions model are:

- Repositories -- The main mechanism for partitioning the
  ArchivesSpace system. For example, an instance might contain one
  repository for each section of an organisation, or one repository
  for each major collection.
- Users -- An entity that uses the system--often a person, but
  perhaps a consumer of the ArchivesSpace API. The set of users is
  global to the system, and a single user may have access to
  multiple repositories.
- Records -- A unit of information in the system. Some records are
  global (existing outside of any given repository), while some are
  repository-scoped (belonging to a single repository).
- Groups -- A set of users _within_ a repository. Each group is
  assigned zero or more permissions, which it confers upon its
  members.
- Permissions -- An action that a user can perform. For example, A
  user with the `update_accession_record` permission is allowed to
  update accessions for a repository.

To summarize, a user can perform an action within a repository if they
are a member of a group that has been assigned permission to perform
that action.

### Conceptual trickery

Since they're repository-scoped, groups govern access to repositories.
However, there are several record types that exist at the top-level of
the system (such as the repositories themselves, subjects and agents),
and the permissions model must be able to accommodate these.

To get around this, we invent a concept: the "global" repository
conceptually contains the whole ArchivesSpace universe. As with other
repositories, the global repository contains groups, and users can be
made members of these groups to grant them permissions across the
entire system. One example of this is the "admin" user, which is
granted all permissions by the "administrators" group of the global
repository; another is the "search indexer" user, which can read (but
not update or delete) any record in the system.
