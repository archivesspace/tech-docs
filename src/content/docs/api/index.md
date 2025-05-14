---
title: Working with the API
description: General information about working with the API, including authentication, get, and post requests with examples.
---

:::tip
This documentation provides general information on working with the API. For detailed documentation of specific endpoints, see the [API reference](http://archivesspace.github.io/archivesspace/api/), which is maintained separately.
:::

## Authentication

Most actions against the backend require you to be logged in as a user
with the appropriate permissions. By sending a request like:

     POST /users/admin/login?password=login

your authentication request will be validated, and a session token
will be returned in the JSON response for your request. To remain
authenticated, provide this token with subsequent requests in the
`X-ArchivesSpace-Session` header. For example:

     X-ArchivesSpace-Session: 8e921ac9bbe9a4a947eee8a7c5fa8b4c81c51729935860c1adfed60a5e4202cb

Since not all backend/API end points require authentication, it is best to restrict access to port 8089 to only IP addresses you trust. Your firewall should be used to specify a range of IP addresses that are allowed to call your ArchivesSpace API endpoint. This is commonly called whitelisting or allowlisting.

### Example requests using CURL

Send request to authenticate:

```shell
curl -s -F password="admin" "http://localhost:8089/users/admin/login"
```

This will return a JSON response that includes something like the following:

```json
{
   "session":"9528190655b979f00817a5d38f9daf07d1686fed99a1d53dd2c9ff2d852a0c6e",
   ....
}
```

It’s a good idea to save the session key as an environment variable to use for later requests:

```shell
#Mac/Unix terminal
export SESSION="9528190655b979f00817a5d38f9daf07d1686fed99a1d53dd2c9ff2d852a0c6e"

#Windows Command Prompt
set SESSION="9528190655b979f00817a5d38f9daf07d1686fed99a1d53dd2c9ff2d852a0c6e"

#Windows PowerShell
$env:SESSION="9528190655b979f00817a5d38f9daf07d1686fed99a1d53dd2c9ff2d852a0c6e"
```

Now you can make requests like this:

```shell
curl -H "X-ArchivesSpace-Session: $SESSION" "http://localhost:8089/repositories/2/resources/1
```

## CRUD

The ArchivesSpace API provides CRUD-style interactions for a number of
different "top-level" record types. Working with records follows a
fairly standard pattern:

     # Get a paginated list of accessions from repository '123'
     GET /repositories/123/accessions?page=1

     # Create a new accession, returning the ID of the new record
     POST /repositories/123/accessions
     {... a JSON document satisfying JSONModel(:accession) here ...}

     # Get a single accession (returned as a JSONModel(:accession) instance) using the ID returned by the previous request
     GET /repositories/123/accessions/456

     # Update an existing accession
     POST /repositories/123/accessions/456
     {... a JSON document satisfying JSONModel(:accession) here ...}

## Performing API requests

### GET requests

#### Resolving associated records

The :resolve parameter is a way to tell ArchivesSpace to attach the full object to these refs; it is passed in as an
array of keys to "prefetch" in the returned JSON. The object is included in the ref under a \_resolved key.

For example, to find an archival object by a ref_id and return the found archival object, you can attach
`resolve[]: "archival_objects"` within your request.

##### Shell Example

> ```shell
> curl -s -F password="admin" "http://localhost:8089/users/admin/login"
> # Replace "admin" with your password and "http://localhost:8089/users/admin/login" with your ASpace API URL
> # followed by "/users/{your_username}/login"
>
> set SESSION="session_id"
> # If using a unix-like shell, replace set with export
>
> curl -H "X-ArchivesSpace-Session: $SESSION" //
> "http://localhost:8089/repositories/:repo_id:/find_by_id/archival_objects?ref_id[]=hello_im_a_ref_id;resolve[]=archival_objects"
> # Replace "http://localhost:8089" with your ASpace API URL, :repo_id: with the repository ID,
> # "hello_im_a_ref_id" with the ref ID you are searching for, and only add
> # "resolve[]=archival_objects" if you want the JSON for the returned record - otherwise, it will return the
> # record URI only
> ```

##### Python Example

> ```python
> from asnake.client import ASnakeClient  # import the ArchivesSnake client
>
> client = ASnakeClient(baseurl="http://localhost:8089", username="admin", password="admin")
> # Replace "http://localhost:8089" with your ArchivesSpace API URL and "admin" for your username and password
>
> client.authorize()  # authorizes the client
>
> find_ao_refid = client.get("repositories/:repo_id:/find_by_id/archival_objects",
>                            params={"ref_id[]": "hello_im_a_ref_id",
>                            "resolve[]": "archival_objects"})
> # Replace :repo_id: with the repository ID, "hello_im_a_ref_id" with the ref ID you are searching for, and only add
> # "resolve[]": "archival_objects" if you want the JSON for the returned record - otherwise, it will return the
> # record URI only
>
> print(find_ao_refid.json())
> # Output (dict): {'archival_objects': [{'ref': '/repositories/2/archival_objects/708425', '_resolved':...}]}
> ```

#### Requests for paginated results

Endpoints that represent groups of objects, rather than single objects, tend to be paginated. Paginated endpoints are called out in the documentation as special, with some version of the following content appearing:
This endpoint is paginated. :page, :id_set, or :all_ids is required

    Integer page – The page set to be returned
    Integer page_size – The size of the set to be returned ( Optional. default set in AppConfig )
    Comma separated list id_set – A list of ids to request resolved objects ( Must be smaller than default page_size )
    Boolean all_ids – Return a list of all object ids

These endpoints support some or all of the following:

    paged access to objects (via :page)
    listing all matching ids (via :all_ids)
    fetching specific known objects via their database ids (via :id_set)

##### Shell Example

> ```shell
> curl -s -F password="admin" "http://localhost:8089/users/admin/login"
> # Replace "admin" with your password and "http://localhost:8089/users/admin/login" with your ASpace API URL
> # followed by "/users/{your_username}/login"
>
> set SESSION="session_id"
> # If using a unix-like shell, replace set with export
>
> # For all archival objects, use all_ids
> curl -H "X-ArchivesSpace-Session: $SESSION" //
> "http://localhost:8089/repositories/2/archival_objects?all_ids=true"
>
> # For a set of archival objects, use id_set
> curl -H "X-ArchivesSpace-Session: $SESSION" //
> "http://localhost:8089/repositories/2/archival_objects?id_set=707458&id_set=707460&id_set=707461"
>
> # For a page of archival objects, use page and page_size
> "http://localhost:8089/repositories/2/archival_objects?page=1&page_size=10"
> ```

> Python example needed

#### Working with long results sets

When working with search results using page and page_size parameters, many results can be returned and managing those
results can be difficult. See the Python example below for demonstrating how to take a large result set and iterating
through it to search for archival objects from a paginated result.

##### Python Example

> ```python
> from asnake.client import ASnakeClient  # import the ArchivesSnake client
>
> client = ASnakeClient(baseurl="http://localhost:8089", username="admin", password="admin")
> # Replace http://localhost:8089 with your ArchivesSpace API URL and admin for your username and password
>
> client.authorize()  # authorizes the client
>
> # To get a page of archival objects with a set page size, use "page" and "page_size" parameters
> get_repo_aos_pages = client.get("repositories/2/archival_objects", params={"page": 1, "page_size": 10})
> # Replace 2 for your repository ID. Find this in the URI of your archival object on the bottom right of the
> # Basic Information section in the staff interface
>
> print(get_repo_aos_pages.json())
> # Output (dictionary): {'first_page': 1, 'last_page': 26949, 'this_page': 1, 'total': 269488,
> # 'results': [{'lock_version': 1, 'position': 0,...]...}
>
> result_count = len(get_repo_aos_pages.json())  # Get us the count of results back
> for result in get_repo_aos_pages.json():
>     json_info = json.loads(result["json"])
>     for key, value in json_info.items():
>         id_match = id_field_regex.match(key)
> ```

#### Search requests

A number of routes in the ArchivesSpace API are designed to search for content across all or part of the records in the
application. These routes make use of Solr, a component bundled with ArchivesSpace and used to provide full text search
over records.

The search routes present in the application as of this time are:

- Search this archive
- Search across repositories
- Search this repository
- Search across subjects
- Search for top containers
- Search across location profiles

Search routes take quite a few different parameters, most of which correspond directly to Solr query parameters. The
most important parameter to understand is q, which is the query sent to Solr. This query is made in Lucene query
syntax. The relevant docs are in the Solr Ref Guide's [The Standard Query Parser](https://solr.apache.org/guide/6_6/the-standard-query-parser.html#the-standard-query-parser) webpage.

To limit a search to records of a particular type or set of types, you can use the 'type' parameter. This is only
relevant for search endpoints that aren't limited to specific types. Note that type is expected to be a list of types,
even if there is only one type you care about.

##### Notes on search routes and results

ArchivesSpace represents records as JSONModel Objects - this is what you get from and send to the system.

SOLR takes these records, and stores "documents" BASED ON these JSONModel objects in a searchable index.

Search routes query these documents, NOT the records themselves as stored in the database and represented by JSONModel.

JSONModel objects and SOLR documents are similar in some ways:

- Both SOLR documents and JSONModel Objects are expressed in JSON
- In general, documents will always contain some subset of the JSONModel object they represent

But they also differ in quite a few important ways:

- SOLR documents don't necessarily have all fields from a JSONModel object
- SOLR documents do not automatically contain nested JSONModel Objects
- SOLR documents can have fields defined that are arbitrary "search representations" of fields in associated records,
  or combinations of fields in a record
- SOLR documents don't have a jsonmodel_type field - the jsonmodel_type of the record is stored as primary_type in SOLR

How do I get the actual JSONModel from a search document?

In ArchivesSpace, SOLR documents all have a field json, which contains the JSONModel Object the document represents as
a string. You can use a JSON library to parse this string from the field, for example the json library in Python.

##### Shell Example

> ```shell
>
> # auto-generated example
> curl -H "X-ArchivesSpace-Session: $SESSION" \
>   "http://localhost:8089/search/repositories?q=&aq=%7B%22jsonmodel_type%22%3D%3E%22advanced_query%22%2C+%22query%22%3D%3E%7B%22jsonmodel_type%22%3D%3E%22boolean_query%22%2C+%22op%22%3D%3E%22AND%22%2C+%22subqueries%22%3D%3E%5B%7B%22jsonmodel_type%22%3D%3E%22date_field_query%22%2C+%22negated%22%3D%3Efalse%2C+%22comparator%22%3D%3E%22empty%22%2C+%22field%22%3D%3E%22QSUC205%22%2C+%22value%22%3D%3E%222018-03-26%22%7D%5D%7D%7D&type%5B%5D=&sort=&facet%5B%5D=&facet_mincount=1&filter=%7B%22jsonmodel_type%22%3D%3E%22advanced_query%22%2C+%22query%22%3D%3E%7B%22jsonmodel_type%22%3D%3E%22boolean_query%22%2C+%22op%22%3D%3E%22AND%22%2C+%22subqueries%22%3D%3E%5B%7B%22jsonmodel_type%22%3D%3E%22date_field_query%22%2C+%22negated%22%3D%3Efalse%2C+%22comparator%22%3D%3E%22empty%22%2C+%22field%22%3D%3E%22QSUC205%22%2C+%22value%22%3D%3E%222018-03-26%22%7D%5D%7D%7D&filter_query%5B%5D=&exclude%5B%5D=&hl=BooleanParam&root_record=&dt=&fields%5B%5D="
>
> # auto-generated example
> curl -H 'Content-Type: text/json' -H "X-ArchivesSpace-Session: $SESSION" \
>   "http://localhost:8089/search/repositories" \
>   -d '{
>   "aq": {
>     "jsonmodel_type": "advanced_query",
>     "query": {
>       "jsonmodel_type": "boolean_query",
>       "op": "AND",
>       "subqueries": [
>         {
>           "jsonmodel_type": "date_field_query",
>           "negated": false,
>           "comparator": "empty",
>           "field": "QSUC205",
>           "value": "2018-03-26"
>         }
>       ]
>     }
>   },
>   "facet_mincount": "1",
>   "filter": {
>     "jsonmodel_type": "advanced_query",
>     "query": {
>       "jsonmodel_type": "boolean_query",
>       "op": "AND",
>       "subqueries": [
>         {
>           "jsonmodel_type": "date_field_query",
>           "negated": false,
>           "comparator": "empty",
>           "field": "QSUC205",
>           "value": "2018-03-26"
>         }
>       ]
>     }
>   },
>   "hl": "BooleanParam"
> }'
> ```

### POST requests

#### Updating existing records

For updating existing records, it's recommended to first do a GET request for the record you want to update. This
ensures that the data you are updating is the most accurate and reduces the chance of inadvertently removing data that
was there previously but may be lost if the data is not included in the subsequent update. After getting the original
record data, you can update it as needed and then do a POST request with the updated data. Make sure that the updated
data is JSON formatted and is passed either through the `-d` or `--data` parameter or `json` parameter if using
ArchivesSnake.

##### Shell Example

> ```shell
> curl -s -F password="admin" "http://localhost:8089/users/admin/login"
> # Replace "admin" with your password and "http://localhost:8089" with your ASpace API URL followed by
> # "/users/{your_username}/login"
>
> set SESSION="session_id"
> # If using a unix-like shell, replace set with export
>
> curl -H 'Content-Type: text/json' -H "X-ArchivesSpace-Session: $SESSION" \\
> "http://localhost:8089/repositories/:repo_id:/groups/:group_id:" \\
> -d '{"group_code": "test-group_managers",
>        "lock_version": 4,
>        "description": "Test group managers of the Manuscripts repository",
>        "jsonmodel_type": "group",
>        "member_usernames": [
>            "manager", "advance"]}'
> # Replace http://localhost:8089 with your ArchivesSpace API URL, :repo_id: with the repository ID number,
> # :group_id: with the group ID number you want to update, and the data found after -d with the data you want
> # updating the group. Be sure to include "lock_version" and the most recent number for it. You can find the
> # most recent lock_version by submitting a get request, like so: curl -H "X-ArchivesSpace-Session: $SESSION" \
> # "http://localhost:8089/repositories/:repo_id:/groups/:group_id:"
>
> # Output:
> # {"status":"Updated","id":23,"lock_version":5,"stale":null,"uri":"/repositories/2/groups/23","warnings":[]}
> ```

##### Python Example

> ```python
> from asnake.client import ASnakeClient  # import the ArchivesSnake client
> client = ASnakeClient(baseurl="http://localhost:8089", username="admin", password="admin")
> # replace http://localhost:8089 with your ArchivesSpace API URL and admin for your username and password
>
> client.authorize()  # authorizes the client
>
> get_user_group = client.get("repositories/:repo_id:/groups/:group_id:").json()
> # Retrieve the data from the group you are trying to update. Replace :repo_id: with the repository ID number and
> # :group_id: with the group ID number you want to update
>
> get_user_group["member_usernames"].append("advance")
> # An example of how to modify a group record. For a list of all the fields you can update,
> # print(get_user_group). Here we append a new user 'advance' to the list of users associated with this group.
>
> update_user_group = get_user_group
> # Assign the newly updated get_user_group to update_user_group - to help make it clearer to see.
>
> update_status = client.post("repositories/:repo_id:/groups/:group_id:", json=update_user_group)
> # Replace :repo_id: with the repository ID number and :group_id: with the group ID number you want to update
>
> print(update_status.json())
> # Output:
> # {'status': 'Updated', 'id': 48, 'lock_version': 1, 'stale': None, 'uri': '/repositories/2/groups/48',
> # 'warnings': []}
> ```

#### Creating new records

When creating new records, it's recommended to do a GET request on the type of record you are wanting to create. This
example record is useful for seeing what fields are included for that specific record. Not all fields are required, for
example, the `created` and `modified` fields are not necessary when creating a new record, since those fields are
handled automatically. Others, such as `title` and `jsonmodel_type` are required.

After examining an existing record for reference, craft your JSON-formatted data and make a POST request. Make sure
that the new record is passed either through the `-d` or `--data` parameter or `json` parameter if using ArchivesSnake.

##### Shell Example

> ```shell
> # Create a new user group within the SHELL
> curl -s -F password="admin" "http://localhost:8089/users/admin/login"
> # Replace "admin" with your password and "http://localhost:8089" with your ASpace API URL followed by
> # "/users/{your_username}/login"
>
> set SESSION="session_id"
> # If using a unix-like shell, replace set with export
>
> curl -H "X-ArchivesSpace-Session: $SESSION" "http://localhost:8089/repositories/:repo_id:/groups/" \\
> -d '{"group_code": "test-group_managers",
>      "description": "Test group managers of the Manuscripts repository",
>      "jsonmodel_type": "group"}'
> # Replace "http://localhost:8089" with your ASpace API URL, :repo_id: with the repository ID, and
> # the data found in -d with the metadata you want to create the new user group.
>
> # Output
> # {"status":"Created","id":24,"lock_version":0,"stale":null,"uri":"/repositories/2/groups/24","warnings":[]}
> ```

##### Python Example

> ```python
> # Create a new user group using Python and ArchivesSnake
> from asnake.client import ASnakeClient  # import the ArchivesSnake client
>
> client = ASnakeClient(baseurl="http://localhost:8089", username="admin", password="admin")
> # replace http://localhost:8089 with your ArchivesSpace API URL and admin for your username and password
>
> client.authorize()  # authorizes the client
>
> new_group = {
>   "group_code": "test-group_managers",
>   "description": "Test group managers of the Manuscripts repository",
>   "jsonmodel_type": "group",
>   "member_usernames": [
>     "manager"
>   ],
>   "grants_permissions": [
>     "cancel_job",
>     "manage_enumeration_record"]
> }
> # This is a sample user group that exceeds the minimum requirements. The minimum requirements are:
> # jsonmodel_type, description, and group_code. grants_permissions is optional, these values can be looked up in
> # the ASpace database within the permissions table
>
> post_user_group = client.post("repositories/:repo_id:/groups", json=new_group)
> # Replace :repo_id: with the ArchivesSpace repository ID and new_group with the json data to create a new user
> # group
>
> print(post_user_group.json())
> # Output:
> # {'status': 'Created', 'id': 23, 'lock_version': 0, 'stale': None, 'uri': '/repositories/2/groups/23',
> # 'warnings': []}
> ```

### DELETE requests

Delete requests using the API permanently deletes any record, just like within the staff interface. Be careful! Make
sure you want to delete the entire record before doing so. If you want to delete parts of a record, for example some
notes or other fields, see [Updating existing records](####Updating existing records).

To delete a record, retrieve the record's ArchivesSpace generated ID and use the `DELETE` command for SHELL or
`client.delete`if using the ArchivesSnake Python library.

##### Shell Example

> ```shell
> # Delete a user group within the SHELL
> curl -s -F password="admin" "http://localhost:8089/users/admin/login"
> # Replace "admin" with your password and "http://localhost:8089" with your ASpace API URL followed by
> # "/users/{your_username}/login"
>
> set SESSION="session_id"
> # If using a unix-like shell, replace set with export
>
> curl -H "X-ArchivesSpace-Session: $SESSION" \\
> -X DELETE "http://localhost:8089/repositories/:repo_id:/groups/:group_id:"
> # Replace "http://localhost:8089" with your ASpace API URL, :repo_id: with the repository ID, and
> # :group_id: with the ID of the group you want to delete (usually found in the URL of the user group when
> # viewing in the staff interface). Deleting is permanent so make sure to test this first!
>
> # Output: {"status":"Deleted","id":47}
> ```

##### Python Example

> ```python
> # Delete a user group from a repository using Python and ArchivesSnake
> from asnake.client import ASnakeClient  # import the ArchivesSnake client
>
> client = ASnakeClient(baseurl="http://localhost:8089", username="admin", password="admin")
> # replace http://localhost:8089 with your ArchivesSpace API URL and admin for your username and password
>
> client.authorize()  # authorizes the client
>
> delete_user_group = client.delete("repositories/:repo_id:/groups/:group_id:")
> # Replace :repo_id: with the ArchivesSpace repository ID and :group_id: with the ArchivesSpace ID of the
> # user group you want to delete. Deleting is permanent so make sure to test this first!
>
> print(delete_user_group.json())
> # Output: {'status': 'Deleted', 'id': 23}
> ```
