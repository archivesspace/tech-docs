---
title: Logrotatie
description: Voorbeeld van het instellen van logrotatie, zodat het logbestand van ArchivesSpace niet buitensporig groot wordt.
---

Om te voorkomen dat het logbestand van ArchivesSpace buitensporig groot wordt, kunt u logrotatie instellen. De manier waarop u logrotatie instelt, verschilt per instelling. Hieronder staat een voorbeeld van een logrotate-configuratiebestand, met uitleg over de werking ervan.

`/etc/logrotate.d/`

```
  /<install location>/archivesspace/logs/archivesspace.out {
          daily
          rotate 7
          compress
          notifempty
          missingok
          copytruncate
   }
```

Dit voorbeeldconfiguratiebestand:

- roteert de logbestanden dagelijks
- bewaart de logbestanden van de afgelopen 7 dagen
- comprimeert de logbestanden zodat ze minder ruimte innemen
- negeert lege logbestanden
- meldt geen fouten als het logbestand ontbreekt
- maakt een kopie van het oorspronkelijke logbestand voor rotatie voordat de inhoud van het oorspronkelijke bestand wordt afgekapt
