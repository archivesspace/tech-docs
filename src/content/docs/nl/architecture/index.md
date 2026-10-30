---
title: Architectuur en componenten
description: Beknopte beschrijving van de interactie tussen de verschillende onderdelen van ArchivesSpace, met links naar elke sectie.
---

ArchivesSpace is onderverdeeld in verschillende componenten: de backend, die
de belangrijkste werkprocessen en gegevenstypen van het systeem via een
REST API beschikbaar stelt, een medewerkersinterface, een publieke
gebruikersinterface en een zoeksysteem dat bestaat uit Solr en een
indexeerproces.

Deze componenten wisselen JSON-gegevens met elkaar uit. Het formaat van deze
gegevens wordt gedefinieerd door een klasse met de naam JSONModel.

- [Overzicht](./overview)
- [JSONModel -- een gevalideerd ArchivesSpace-record](./jsonmodel)
- [De backend van ArchivesSpace](./backend)
- [De medewerkersinterface van ArchivesSpace](./frontend)
- [Achtergrondtaken](./jobs)
- [Zoekindexering](./search)
- [De publieke gebruikersinterface van ArchivesSpace](./public)
- [OAI-PMH-interface](./oai-pmh)
- [API](./api)
- [Database](./database)
- [Mappenstructuur](./directories)
- [Afhankelijkheden](./languages)
