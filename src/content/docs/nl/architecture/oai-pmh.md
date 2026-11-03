---
title: OAI-PMH-interface
description: Beschrijft hoe OAI-PMH is ingesteld in ArchivesSpace en hoe u gegevens met OAI-PMH kunt harvesten, met voorbeeldlinks en aanvullende informatie.
---

Met de OAI-PMH-responder van ArchivesSpace kunnen andere systemen records
harvesten op basis van uw instellingen.

Standaard draait de OAI-PMH-interface op poort 8082. Een voorbeeldpagina voor
verzoeken is beschikbaar op http://localhost:8082/sample. (Zorg ervoor dat u
AppConfig[:oai_proxy_url] correct hebt ingesteld om deze pagina te openen.)

Het systeem reageert op een aantal standaard OAI-PMH-verzoeken,
waaronder GetRecord, Identify, ListIdentifiers, ListMetadataFormats,
ListRecords en ListSets. Niet-gepubliceerde en onderdrukte records en elementen
worden niet opgenomen in OAI-PMH-reacties.

Voor sommige reacties is de URL-parameter metadataPrefix vereist. Er zijn vijf
verschillende metadataformaten beschikbaar:

- EAD -- oai_ead (collecties in EAD)
- Dublin Core -- oai_dc (archiefonderdelen en collecties in Dublin Core)
- uitgebreide DCMI Terms -- oai_dcterms (archiefonderdelen en collecties in DCMI Metadata Terms-formaat)
- MARC -- oai_marc (archiefonderdelen en collecties in MARC)
- MODS -- oai_mods (archiefonderdelen en collecties in MODS)

De EAD-reactie voor collecties en de MARC-reactie voor collecties en
archiefonderdelen gebruiken de toewijzingen uit de ingebouwde exportfunctie
voor collecties. U kunt de EAD-opties voor OAI configureren in
`AppConfig[:oai_ead_options]`. De DC-, DCMI Terms- en MODS-reacties voor
collecties en archiefonderdelen gebruiken door de gemeenschap voorgestelde
toewijzingen.

OAI-opties worden ingesteld in [`AppConfig`](https://docs.archivesspace.org/customization/configuration/#oai-configuration-options) en via de medewerkersinterface (menu Systeem > OAI-PMH-instellingen beheren).

Hier volgen enkele voorbeeld-URL's en andere informatie over deze verzoeken:

**GetRecord** – vereist een record-ID en metadataPrefix
Tot en met ArchivesSpace v3.5.1 hebben OAI-identificatoren deze indeling:

`http://localhost:8082/oai?verb=GetRecord&identifier=oai:archivesspace//repositories/2/resources/138&metadataPrefix=oai_ead`

Vanaf ArchivesSpace v4.0.0 hebben OAI-identificatoren de nieuwe indeling (let
op de dubbele punt na het naamruimtegedeelte `oai:archivesspace` van de
identificator):

`http://localhost:8082/oai?verb=GetRecord&identifier=oai:archivesspace:/repositories/2/resources/138&metadataPrefix=oai_ead`

Zie ook: https://github.com/code4lib/ruby-oai/releases/tag/v1.0.0

**Identify**

`http://localhost:8082/oai?verb=Identify`

**ListIdentifiers** – vereist een metadataPrefix

`http://localhost:8082/oai?verb=ListIdentifiers&metadataPrefix=oai_dc`

**ListMetadataFormats**

`http://localhost:8082/oai?verb=ListMetadataFormats`

**ListRecords** – vereist een metadataPrefix

`http://localhost:8082/oai?verb=ListRecords&metadataPrefix=oai_dcterms`

**ListSets**

`http://localhost:8082/oai?verb=ListSets`

Als u de OAI-PMH-server van ArchivesSpace harvest zonder een set op te geven,
levert dit alle gepubliceerde records uit alle collectiebeherende instellingen
op.

U kunt vooraf gedefinieerde sets openen met de parameter set. Als u records uit
sets wilt ophalen, neemt u een set-parameter en de DC-metadataPrefix op in de
URL, bijvoorbeeld "&set=collection&metadataPrefix=oai_dc". Deze sets kunnen
afkomstig zijn van geconfigureerde sets zoals hierboven beschreven, of van de
volgende beschrijvingsniveaus:

- Klasse -- class
- Collectie -- collection
- Verzamelbeschrijving -- file
- Archief -- fonds
- Aanvraagbare eenheid -- item
- Ander niveau -- otherlevel
- Recordgroep -- recordgrp
- Rubriek -- series
- Deelarchief -- subfonds
- Subgroep -- subgrp
- Subrubriek -- subseries

Naast sets op basis van beschrijvingsniveau kunt u sets definiëren op basis van
codes van collectiebeherende instellingen en/of sponsors. Deze instellingen
zijn beschikbaar in de applicatie, in het onderdeel OAI-PMH-instellingen
beheren.

De interface implementeert tokens voor voortzetting om resultaten te pagineren.
Als voorbeeld gebruikt u de volgende URL-indeling om de resultaten van een
ListRecords-verzoek over meerdere pagina's op te halen:

`http://localhost:8082/oai?verb=ListRecords&metadataPrefix=oai_ead`

met het token voor voortzetting:

`http://localhost:8082/oai?verb=ListRecords&resumptionToken=eyJtZXRhZGF0YV9wcmVmaXgiOiJvYWlfZWFkIiwiZnJvbSI6IjE5NzAtMDEtMDEgMDA6MDA6MDAgVVRDIiwidW50aWwiOiIyMDE3LTA3LTA2IDE3OjEwOjQxIFVUQyIsInN0YXRlIjoicHJvZHVjaW5nX3JlY29yZHMiLCJsYXN0X2RlbGV0ZV9pZCI6MCwicmVtYWluaW5nX3R5cGVzIjp7IlJlc291cmNlIjoxfSwiaXNzdWVfdGltZSI6MTQ5OTM2MTA0Mjc0OX0=`

Opmerking: gebruik metadataPrefix niet wanneer u een resumptionToken gebruikt.

De OAI-PMH-server van ArchivesSpace ondersteunt blijvende
verwijderingsmeldingen. Harvesters ontvangen daardoor bericht over records die
zijn verwijderd sinds hun vorige opvraging.

Gemengde inhoud wordt verwijderd uit de velduitvoer van Dublin Core, dcterms,
MARC en MODS in de OAI-PMH-reactie (bijvoorbeeld: een notitie over omvang en
inhoud die is toegewezen aan een DC-beschrijvingsveld bevat geen `<p>`,
`<abbr>`, `<address>`, `<archref>`, `<bibref>`, `<blockquote>`, `<chronlist>`,
`<corpname>`, `<date>`, `<emph>`, `<expan>`, `<extptr>`, `<extref>`,
`<famname>`, `<function>`, `<genreform>`, `<geogname>`, `<lb>`, `<linkgrp>`,
`<list>`, `<name>`, `<note>`, `<num>`, `<occupation>`, `<origination>`,
`<persname>`, `<ptr>`, `<ref>`, `<repository>`, `<subject>`, `<table>`,
`<title>`, `<unitdate>` of `<unittitle>`).

Records op het niveau van archiefonderdelen bevatten overgenomen gegevens van
hogere niveaus in de hiërarchische structuur van de archieftoegang. De
overerving van elementen wordt bepaald door de systeemconfiguratie van de
instelling (aanpasbaar in het bestand `config/config.rb`), zoals
geïmplementeerd voor de publieke gebruikersinterface.

Vanaf 2.7.0 is het mogelijk om interne of externe Archival Resource Keys (ARK's)
te gebruiken in exports of bij het harvesten via OAI-PMH voor collecties en
archiefonderdelen.
