---
title: Upgraden naar 2.1.0
description: Instructies voor het upgraden naar ArchivesSpace 2.1.0 vanaf versie 1.4.2 of lager, Archivists' Toolkit of Archon, of bij gebruik van een externe Solr-server, met daarnaast opmerkingen over de gegevensmigratie van rechtenverklaringen.
---

Aanvullende aandachtspunten voor het upgraden die specifiek zijn voor deze release. Raadpleeg de [upgraddocumentatie](/administration/upgrading) voor de standaardinstructies die in alle gevallen gelden.

:::note
Deze aandachtspunten gelden ook bij een upgrade vanaf een versie vóór 2.1.0 naar een versie na 2.1.0.
:::

## Voor wie een upgrade uitvoert vanaf 1.4.2 of lager

Na de samenvoeging van de Container Management Plugin in 1.5.0 behield ArchivesSpace nog steeds het oude containermodel en waren er diverse afhankelijkheden van dit model. Dit zorgde voor onnodige complexiteit en enige prestatievermindering in het systeem.

In deze release zijn alle verwijzingen naar het oude containermodel verwijderd en zijn de onderdelen van de applicatie die ervan afhankelijk waren (bijvoorbeeld Importeren en exporteren) geherstructureerd om het nieuwe containermodel te gebruiken.

Een gevolg van deze wijziging is dat u, als u een upgrade uitvoert vanaf ArchivesSpace versie 1.4.2 of lager, eerst moet upgraden naar een versie tussen 1.5.0 en 2.0.1 om de conversie van het containermodel uit te voeren. Daarna kunt u upgraden naar 2.1.0. Als u al een versie van ArchivesSpace tussen 1.5.0 en 2.0.1 gebruikt, kunt u rechtstreeks upgraden naar 2.1.0.

## Voor wie gegevens migreert vanuit Archivists' Toolkit of Archon met de migratietools

De migratietools worden momenteel alleen ondersteund tot en met versie 1.4.2. Als u gegevens met een van deze tools naar ArchivesSpace wilt migreren, moet u deze naar versie 1.4.2 migreren. Daarna kunt u de instructies volgen voor wie een upgrade uitvoert vanaf 1.4.2 of lager.

## Gegevensmigraties in deze release

Het gegevensmodel voor rechtenverklaringen is gewijzigd in 2.1.0. Als u momenteel rechtenverklaringen gebruikt, worden uw gegevens tijdens de stap `setup-database` van het upgradeproces naar het nieuwe model geconverteerd. We raden u nadrukkelijk aan een back-up van uw database te maken en ten minste één testupgrade uit te voeren voordat u 2.1.0 in productie neemt.

## Voor wie een externe Solr-server gebruikt

Het indexschema is gewijzigd in 2.1.0. Als u een externe Solr-server gebruikt, moet u [schema.xml](https://github.com/archivesspace/archivesspace/blob/master/solr/schema.xml) bijwerken naar de nieuwere versie. Als u de standaard Solr-index gebruikt die met ArchivesSpace wordt meegeleverd, hoeft u niets te doen.
