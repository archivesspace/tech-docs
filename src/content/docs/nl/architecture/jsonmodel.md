---
title: JSONModel
description: Beschrijft de regels en structuur achter de JSONModel-klasse, die de regels voor verschillende typen archiefrecords uitdrukt. JSONModel-instanties zijn het primaire mechanisme voor gegevensuitwisseling van ArchivesSpace.
---

Het ArchivesSpace-systeem beheert verschillende typen archiefrecords. Elk record kan worden uitgedrukt als een reeks geneste sleutel-waardeparen. Bij elk recordtype hoort een aantal regels die bepalen wanneer een record van dat type geldig is:

- sommige velden zijn verplicht, andere optioneel
- sommige velden kunnen alleen bepaalde gegevenstypen bevatten
- sommige velden kunnen alleen waarden uit een beperkte verzameling bevatten
- sommige velden zijn afhankelijk van andere velden
- sommige recordtypen kunnen binnen andere recordtypen worden genest
- sommige recordtypen kunnen door middel van een hiërarchie aan andere recordtypen zijn gerelateerd
- sommige recordtypen vormen samen met andere recordtypen een relatiegraaf

De klasse JSONModel biedt een gemeenschappelijke taal om deze regels uit te drukken, die alle onderdelen van de applicatie kunnen delen. Voor elk recordtype in het systeem bestaat er een exemplaar van de klasse JSONModel, dus:

```ruby
JSONModel(:digital_object)
```

is een klasse die weet hoe ze een hash met eigenschappen moet verwerken en controleren of die eigenschappen voldoen aan de specificatie van een digitaal object:

```ruby
JSONModel(:digital_object).from_hash(myhash)
```

Als de validatie slaagt, wordt een nieuw exemplaar van JSONModel(:digital_object) geretourneerd. Dit exemplaar biedt toegangsmethoden om de waarden op te vragen en mogelijkheden om heen en weer om te zetten tussen JSON-documenten en gewone Ruby-hashes:

```ruby
obj = JSONModel(:digital_object).from_hash(myhash)

obj.title  # or obj['title']
obj.title = 'a new title'  # or obj['title'] = 'a new title'

obj.\_exceptions  # Validates the object and reports any issues

obj.to_hash  # Turn the JSONModel object back into a regular hash
obj.to_json  # Serialize the JSONModel object into JSON
```

Een groot deel van de validatie die JSONModel uitvoert, wordt verzorgd door de JSON-schemadefinities in de map `common/schemas`. JSON-schema's bieden een standaardmanier om vast te leggen welke eigenschappen een record wel en niet mag bevatten, evenals de typen en andere beperkingen daarvan. ArchivesSpace gebruikt deze schema's om de validatieregels voor elk recordtype op een declaratieve en relatief zelfdocumenterende manier vast te leggen.

JSONModel-instanties zijn het primaire mechanisme voor gegevensuitwisseling van het ArchivesSpace-systeem: de API gebruikt en genereert JSONModel-instanties (in JSON-indeling), en een groot deel van het werk van de gebruikersinterface bestaat uit het omzetten van formulieren naar JSONModel-instanties en deze naar de backend versturen.

## JSONModel::Client -- Een API op hoog niveau voor interactie met de ArchivesSpace-backend

Om veel werk met HTTP-verzoeken te besparen, bevat ArchivesSpace een module met de naam JSONModel::Client die veelgebruikte CRUD-bewerkingen vereenvoudigt. U hoeft deze module alleen op te nemen door bij het initialiseren van JSONModel een extra parameter mee te geven:

```ruby
JSONModel::init(:client_mode => true, :url => @backend_url)
include JSONModel
```

Als u met één collectiebeherende instelling werkt, is het handig om deze als standaard in te stellen voor volgende acties:

```ruby
JSONModel.set_repository(123)
```

Daarna zijn er verschillende extra JSONModel-methoden beschikbaar:

```ruby
# As before, get a paginated list of accessions (GET)
JSONModel(:accession).all(:page => 1)

# Create a new accession (POST)
obj = JSONModel(:accession).from_hash(:title => "A new accession", ...)
obj.save

# Get a single accession by ID (GET)
obj = JSONModel(:accession).find(123)

# Update an existing accession (POST)
obj = JSONModel(:accession).find(123)
obj.title = "Updated title"
obj.save
```
