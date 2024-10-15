---
title: Working with the API
---

This documentation provides general information on working with the API. For detailed documentation of specific endpoints, see the [API reference](http://archivesspace.github.io/archivesspace/api/), which is maintained separately.

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

```
curl -s -F password="admin" "http://localhost:8089/users/admin/login"
```

This will return a JSON response that includes something like the following:

```
{
   "session":"9528190655b979f00817a5d38f9daf07d1686fed99a1d53dd2c9ff2d852a0c6e",
   ....
}
```

It’s a good idea to save the session key as an environment variable to use for later requests:

```
#Mac/Unix terminal
export SESSION="9528190655b979f00817a5d38f9daf07d1686fed99a1d53dd2c9ff2d852a0c6e"

#Windows Command Prompt
set SESSION="9528190655b979f00817a5d38f9daf07d1686fed99a1d53dd2c9ff2d852a0c6e"

#Windows PowerShell
$env:SESSION="9528190655b979f00817a5d38f9daf07d1686fed99a1d53dd2c9ff2d852a0c6e"
```

Now you can make requests like this:

```
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

> Additional documentation is needed for these sections - please consider contributing documentation via a pull request to this repo

### GET requests

#### Resolving associated records

> Additional documentation needed

#### Requests for paginated results

> Additional documentation needed

#### Working with long results sets

> Additional documentation needed

#### Search requests

> Additional documentation needed

### POST requests

#### Updating existing records

> Additional documentation needed

#### Creating new records

> Additional documentation needed

### DELETE requests

> Additional documentation needed
