---
title: Upgraden naar 1.1.1
description: Instructies voor het opnieuw opbouwen van volgordegegevens voor archiefonderdelen en componenten van digitale objecten binnen de collectiestructuur, en informatie over een plug-in waarmee PDF's beschikbaar worden gemaakt in de publieke gebruikersinterface.
---

Aanvullende aandachtspunten voor deze release. Raadpleeg de [upgradedocumentatie](/administration/upgrading) voor de standaardinstructies die in alle gevallen van toepassing zijn.

## Volgordegegevens van structuren met archiefonderdelen en componenten van digitale objecten opnieuw opbouwen

---

In sommige gevallen raken archiefonderdelen en componenten van digitale objecten gegevens kwijt die worden gebruikt om hun hiërarchie te ordenen. Dit kan problemen veroorzaken bij het aanmaken, bewerken of verplaatsen van items in de structuur, omdat databasebeperkingen de uniciteit van bepaalde metadata-elementen waarborgen.

Om de gegevensintegriteit te waarborgen, is er nu een methode om de volgordegegevens van de structuren opnieuw op te bouwen. Deze methode wijzigt of herordent de elementen niet, maar bouwt alleen alle technische metadata opnieuw op die wordt gebruikt om de volgorde vast te leggen.

Om het proces voor het opnieuw opbouwen van de volgordegegevens uit te voeren, bewerkt u het bestand config/config.rb en voegt u deze regel toe:

```ruby
AppConfig[:resequence_on_startup] = true
```

Start ArchivesSpace vervolgens opnieuw. Hiermee wordt een proces gestart dat de volgordegegevens opnieuw opbouwt nadat de applicatie is gestart. Het is raadzaam dit proces volledig te laten uitvoeren voordat u records bewerkt. De duur hangt af van de grootte van uw database: bij databases met weinig archiefonderdelen en digitale objecten kan dit enkele seconden duren, terwijl dit bij databases met honderdduizenden records uren kan duren. Controleer het logbestand om te zien hoe het proces verloopt. Wanneer het is voltooid, hoort de applicatie weer normaal te functioneren; doorgaans worden dan alleen updates van het indexeerproces in het logbestand geregistreerd.

Nadat u ArchivesSpace hebt gestart, moet u de instelling :resequence_on_startup in het bestand config.rb op "false" zetten, omdat u dit proces niet bij elke herstart hoeft uit te voeren.

## PDF's exporteren in de publieke gebruikersinterface

---

Er is vaak verzocht om in de publieke applicatie een PDF-versie van de EAD te kunnen exporteren. Dit leverde enige problemen op, omdat het exporteren van EAD de database aanzienlijk belast; het extra proces voor het maken van PDF's vergroot die belasting verder. We herzien momenteel een deel van de ArchivesSpace-backend om het maken van PDF's gebruiksvriendelijker te maken door een wachtrijsysteem voor exports in te voeren.

In de tussentijd heeft Mark Cooper van Lyrasis een [ plug-in Public Metadata Formats ](https://github.com/archivesspace-deprecated/aspace-public-formats) gemaakt, waarmee bepaalde metadataformaten en PDF's beschikbaar worden gemaakt in de publieke gebruikersinterface. Deze plug-in is opgenomen in deze release, maar u moet deze configureren om aan te geven welke formaten beschikbaar moeten zijn. Raadpleeg de documentatie van de plug-in voor informatie over de configuratie.

LET OP:
Het exporteren van grote EAD-collecties met deze plug-in veroorzaakt waarschijnlijk problemen. Langlopende verzoeken lopen een time-out op, omdat de server geen resources wil verspillen aan langlopende processen. Bovendien kunnen veel verzoeken om PDF's de server zwaarder belasten. Houd rekening met deze problemen en beperkingen van de plug-in voordat u deze inschakelt.

---
