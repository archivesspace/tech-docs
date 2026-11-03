---
title: Mappenstructuur
description: Korte beschrijvingen van de verschillende mappen in de codebase van ArchivesSpace.
---

ArchivesSpace bestaat uit verschillende componenten die in afzonderlijke mappen zijn ondergebracht.

## \_yard

Deze map bevat de code voor het documentatiehulpmiddel dat wordt gebruikt om de GitHub.io-pagina's hier te genereren: http://archivesspace.github.io/archivesspace/

## backend

Deze map bevat de code voor de database en de API.

## build

Deze map bevat de code voor het bouwen van de applicatie. De map bevat de opdrachten voor het uitvoeren van de ontwikkelservers en testsuites en voor het bouwen van de releases. ArchivesSpace is een JRuby-applicatie en voor het bouwen ervan wordt Apache Ant gebruikt.

## clustering

Deze map bevat code die kan worden gebruikt bij het clusteren van een ArchivesSpace-installatie.

## common

Deze map bevat code die in twee of meer componenten wordt gebruikt. De map bevat configuratieopties, databaseschema's en migraties, en vertaalbestanden.

## contribution_files

Deze map bevat de documentatie en pdf-bestanden van de licentieovereenkomsten.

## docs

Deze map bevat documentatiebestanden die in een release worden opgenomen.

## frontend

Deze map bevat de Ruby on Rails-applicatie voor de medewerkersinterface.

## indexer

Deze map bevat de Sinatra-applicatie voor het indexeerproces.

## jmeter

Deze map bevat een voorbeeld dat kan worden gebruikt om Apache JMeter in te stellen voor het uitvoeren van belastingtests op de functionele werking en het meten van prestaties.

## launcher

Deze map bevat de code die een ArchivesSpace-applicatie start, herstart en stopt.

## oai

Deze map bevat de OAI-PMH Sinatra-applicatie.

## plugins

Deze map bevat plug-ins die worden ondersteund door het ArchivesSpace Program Team.

## proxy

Deze map bevat de Docker-proxycode.

## public

Deze map bevat de Ruby on Rails-applicatie voor de publieke gebruikersinterface.

## reports

Deze map bevat de rapportagecode.

## scripts

Deze map bevat scripts die nodig zijn voor het bouwen, implementeren en voor andere taken in ArchivesSpace.

## selenium

Deze map bevat de Selenium-tests.

## solr

Deze map bevat de Solr-code.

## stylesheets

Deze map bevat XSL-stylesheets die door ArchivesSpace worden gebruikt.

## supervisord

Deze map bevat een hulpmiddel dat kan worden gebruikt om de ontwikkelservers uit te voeren.
