---
title: Zoekindexering
description: Uitleg over hoe ArchivesSpace Solr gebruikt om toegevoegde, bijgewerkte en verwijderde records te indexeren en over de verschillen tussen periodieke en realtime-indexering van records.
---

ArchivesSpace gebruikt Solr om de volledige tekst te doorzoeken. Wanneer de
backend records toevoegt, bijwerkt of verwijdert, worden de overeenkomstige
wijzigingen ook in de Solr-index aangebracht, zodat beide (ongeveer)
gesynchroniseerd blijven.

Het indexeerproces zorgt ervoor dat de backend en Solr synchroon blijven. Dit
afzonderlijke proces draait op de achtergrond en houdt wijzigingen in records
in de gaten. Het indexeerproces werkt gelijktijdig in twee modi:

- De periodieke modus vraagt de backend op om een lijst op te halen van records
  die sinds de vorige controle zijn toegevoegd, gewijzigd of verwijderd. Deze
  wijzigingen worden doorgevoerd in de Solr-index. Dit gebeurt doorgaans elke
  30 tot 60 seconden en is instelbaar.
- De realtime-modus reageert op wijzigingen zodra die plaatsvinden en voert
  wijzigingen in Solr door zodra ze in de backend zijn doorgevoerd. Deze modus
  is bedoeld om wijzigingen binnen milliseconden of seconden in de zoekindexen
  zichtbaar te maken.

De twee modi overlappen elkaar enigszins, maar dienen verschillende doelen. De
periodieke modus zorgt ervoor dat records niet verloren gaan door tijdelijke
storingen en brengt de indexen weer bij tot de actuele stand, zelfs als het
indexeerproces lange tijd niet heeft gedraaid. Zo nodig maakt deze modus de
indexen zelfs helemaal opnieuw aan. Deze modus wordt ook gebruikt voor
wijzigingen die door bulkimportprocessen worden aangebracht en voor andere
wijzigingen die niet onmiddellijk in de indexen zichtbaar hoeven te zijn.

De realtime-modus van het indexeerproces probeert wijzigingen veel sneller in
de index door te voeren. In plaats van de backend periodiek op te vragen, doet
het indexeerproces een `GET`-verzoek aan het `/update-feed`-endpoint van de
backend. Dit endpoint retourneert alle records die zijn bijgewerkt sinds het
endpoint voor het laatst is aangeroepen en, nog belangrijker, houdt het verzoek
open als er geen records zijn gewijzigd.

Door dit endpoint in een lus aan te roepen, wacht het realtime-indexeerproces
het grootste deel van de tijd op een gebeurtenis. Zodra een record wordt
bijgewerkt, retourneert het al openstaande verzoek aan het `/update-feed`-
endpoint het bijgewerkte record. Dit wordt naar Solr verzonden en meteen
geïndexeerd. Zo worden de vertragingen van periodiek opvragen vermeden en blijft
de indexeringsvertraging laag waar dat van belang is. Nieuwe records moeten
bijvoorbeeld in de lijst met records die gebruikers kunnen doorbladeren staan
wanneer een gebruiker deze bekijkt.
