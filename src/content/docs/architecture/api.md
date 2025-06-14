---
title: API
description: Instructions for how to authenticate when trying to connect to a backend session, such as through the API, along with examples of common requests for getting and posting data.
---

:::note
See the [API section](/api/index) for more detailed documentation.
:::

## Authentication

Most actions against the backend require you to be logged in as a user
with the appropriate permissions. By sending a request like:

```
POST /users/admin/login?password=login
```

your authentication request will be validated, and a session token
will be returned in the JSON response for your request. To remain
authenticated, provide this token with subsequent requests in the
`X-ArchivesSpace-Session` header. For example:

```
X-ArchivesSpace-Session: 8e921ac9bbe9a4a947eee8a7c5fa8b4c81c51729935860c1adfed60a5e4202cb
```

## CRUD

The ArchivesSpace API provides CRUD-style interactions for a number of
different "top-level" record types. Working with records follows a
fairly standard pattern:

```
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
```
