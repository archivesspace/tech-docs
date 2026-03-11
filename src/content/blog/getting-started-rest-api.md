---
title: Getting Started with the ArchivesSpace REST API
metaDescription: The ArchivesSpace REST API opens up powerful automation possibilities. In this post we walk through authentication, basic CRUD operations, and common patterns for integrating with external systems.
pubDate: 2026-01-28
authors:
  - Marcus Oyelaran
---

The ArchivesSpace REST API lets you create, read, update, and delete records programmatically. This makes it possible to automate repetitive tasks, sync data with other systems, and build custom tools on top of ArchivesSpace.

## Authentication

All API requests require authentication. ArchivesSpace supports session-based auth and API keys. For automation and scripts, API keys are usually the better choice—they don't expire like sessions and can be scoped to specific permissions.

To create an API key, log in to the staff interface and go to **Manage** → **Users** → select your user → **Generate API Key**.

## Basic CRUD operations

The API follows REST conventions. Resources live at paths like `/repositories/:repo_id/archival_objects` and support standard HTTP methods:

- **GET** — Retrieve a record or list records
- **POST** — Create a new record
- **PUT** — Update an existing record
- **DELETE** — Delete a record

Requests and responses use JSON. The [API reference](https://archivesspace.github.io/archivesspace/api/) documents every endpoint in detail.

## Common patterns

**Bulk updates.** Use the API to update many records at once. Be mindful of rate limits and consider batching requests.

**External sync.** Pull data from a CMS or cataloging tool and push it into ArchivesSpace. Map fields carefully and validate before importing.

**Reporting.** Query the API to build custom reports or dashboards that aren't available in the staff interface.

For more details, see the [API documentation](/api) in this site.
