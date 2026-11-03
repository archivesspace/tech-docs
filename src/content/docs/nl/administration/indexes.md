---
title: Indexen opnieuw opbouwen
description: Stappen voor het uitvoeren van soft-herindexeringen en volledige herindexeringen van Solr, waaronder interne en externe Solr-installaties.
---

Er zijn twee strategieën voor het herindexeren van ArchivesSpace:

- soft-herindexering
- volledige herindexering

## Soft-herindexering

Een soft-herindexering werkt de bestaande documenten in Solr bij zonder de
daadwerkelijke indexdocumenten op het bestandssysteem rechtstreeks aan te
raken. Dit kan terwijl het systeem actief is en is geschikt voor de meeste
toepassingen.

Er zijn twee gangbare manieren om een soft-herindexering uit te voeren:

1. Statusbestanden van het indexeerproces verwijderen

ArchivesSpace houdt bij wat is geïndexeerd met behulp van de bestanden in
`data/indexer_state` en `data/indexer_pui_state` (voor de PUI).

Als deze bestanden ontbreken, gaat het indexeerproces ervan uit dat er niets
is geïndexeerd en wordt alles opnieuw geïndexeerd. Als u ArchivesSpace wilt
dwingen alle records opnieuw te indexeren, verwijdert u de bestanden in
`/path/to/archivesspace/data/indexer_state` en
`/path/to/archivesspace/data/indexer_pui_state`.

U kunt dit ook selectief doen per recordtype. Als u bijvoorbeeld het nog niet
ontsloten materiaal in collectiebeherende instelling 2 opnieuw wilt indexeren,
verwijdert u het bestand `2_accession.dat`.

2. `system_mtime`-waarden in de database verhogen

Als u de `system_mtime`-waarde van een record bijwerkt, komt het in aanmerking
om opnieuw te worden geïndexeerd.

```sql
#reindex all resources
UPDATE resource SET system_mtime = NOW();
#reindex resource 1
UPDATE resource SET system_mtime = NOW() WHERE id = 1;
```

## Volledige herindexering

Een volledige herindexering is een volledige heropbouw van de index op basis
van de database. Dit kan nodig zijn bij problemen met het indexeerproces, bij
een beschadigde index of wanneer een upgrade dit vereist vanwege wijzigingen
in de Solr-configuratie van ArchivesSpace.

Voer de volgende stappen uit voor een volledige herindexering:

### ArchivesSpace <= 3.1.0 (ingebouwde Solr)

- ArchivesSpace afsluiten
- Deze mappen verwijderen:
  - `rm -rf /path/to/archivesspace/data/indexer_state/`
  - `rm -rf /path/to/archivesspace/data/indexer_pui_state/`
  - `rm -rf /path/to/archivesspace/data/solr_index/`
- ArchivesSpace opnieuw starten

### ArchivesSpace > 3.1.0 (externe Solr)

Voor externe Solr is er een plug-in die alle herindexeringsstappen kan
uitvoeren: [aspace-reindexer](https://github.com/lyrasis/aspace-reindexer)

Handmatige stappen:

- ArchivesSpace afsluiten
- Deze mappen verwijderen:
  - `rm -rf /path/to/archivesspace/data/indexer_state/`
  - `rm -rf /path/to/archivesspace/data/indexer_pui_state/`
- Een Solr-query uitvoeren om alles te verwijderen:
  - `curl -X POST -H 'Content-Type: application/json' --data-binary '{"delete":{"query":"*:*" }}' http://${solrUrl}:${solrPort}/solr/archivesspace/update?commit=true`
  - Windows PowerShell:
    ```
    Invoke-RestMethod -Uri "http://localhost:8983/solr/archivesspace/update?commit=true"
    -Method Post
    -ContentType "application/json"
    -Body '{"delete":{"query":"*:*"}}'
    ```
- ArchivesSpace opnieuw starten

---

U kunt de video [Tips voor het indexeren van ArchivesSpace](https://www.youtube.com/watch?v=yFJ6yAaPa3A) bekijken om te zien hoe deze stappen worden uitgevoerd.

---
