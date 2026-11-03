---
title: API
description: Instructies voor authenticatie bij het verbinden met een sessie op de backend, bijvoorbeeld via de API, met voorbeelden van veelvoorkomende verzoeken voor het ophalen en versturen van gegevens.
---

:::note
Zie het [API-gedeelte](/api/index) voor uitgebreidere documentatie.
:::

## Authenticatie

Voor de meeste handelingen via de backend moet u zijn aangemeld als gebruiker
met de juiste machtigingen. Wanneer u een verzoek zoals dit verstuurt:

```
POST /users/admin/login?password=login
```

wordt uw authenticatieverzoek gevalideerd en ontvangt u een sessietoken in het
JSON-antwoord op uw verzoek. Om aangemeld te blijven, voegt u dit token toe aan
volgende verzoeken in de header
`X-ArchivesSpace-Session`. Bijvoorbeeld:

```
X-ArchivesSpace-Session: 8e921ac9bbe9a4a947eee8a7c5fa8b4c81c51729935860c1adfed60a5e4202cb
```

## CRUD

De ArchivesSpace-API biedt interacties in CRUD-stijl voor een aantal
verschillende typen records op het hoogste niveau. Bij het werken met records
volgt u doorgaans een vrij standaard patroon:

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
