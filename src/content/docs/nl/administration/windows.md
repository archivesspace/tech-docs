---
title: Uitvoeren als Windows-service
description: Instructies voor het instellen van ArchivesSpace als Windows-service.
---

Voor het uitvoeren van ArchivesSpace als Windows-service is enige aanvullende configuratie vereist.

U kunt Apache [procrun](http://commons.apache.org/proper/commons-daemon/procrun.html) gebruiken om ArchivesSpace zo te configureren dat het als Windows-service wordt uitgevoerd. We hebben een script service.bat geleverd dat procrun voor u probeert te configureren (in `launcher\service.bat`).

Om dit script uit te voeren, moet u eerst [procrun downloaden](http://www.apache.org/dist/commons/daemon/binaries/windows/).
Pak de bestanden uit en kopieer prunsrv.exe en prunmgr.exe naar uw ArchivesSpace-map.

U vindt het pad naar Java via "Start" > "Configuratiescherm" > "Java". Selecteer het tabblad "Java". Daar ziet u het pad. Dit ziet er ongeveer zo uit: `C:\Program Files (x86)\Java`

U moet er ook voor zorgen dat Java in het systeempad staat en dat u `JAVA_HOME` als globale omgevingsvariabele aanmaakt.
Als u Java aan uw pad wilt toevoegen, bewerkt u de omgevingsvariabele %PATH% zodat deze de map met het Java-uitvoerbare bestand bevat (dit is bijvoorbeeld `C:\Program Files (x86)\Java`). Als u `JAVA_HOME` wilt toevoegen, maakt u een nieuwe systeemvariabele aan en geeft u de map op waarin Java is geïnstalleerd (bijvoorbeeld `C:\Program Files (x86)\Java`).

U vindt de omgevingsvariabelen via "Start" > "Configuratiescherm". Zoek naar omgevingsvariabelen. Klik op "Systeemomgevingsvariabelen bewerken". Zoek in het gedeelte "Systeemvariabelen" de omgevingsvariabele `PATH` en selecteer deze. Klik op Bewerken. Als de omgevingsvariabele `PATH` niet bestaat, klikt u op Nieuw. Geef in het venster Systeemvariabele bewerken (of Nieuwe systeemvariabele) de waarde van de omgevingsvariabele `PATH` op. Klik op OK. Sluit alle overige vensters door op OK te klikken. Doe hetzelfde voor `JAVA_HOME`.

Voordat u de ArchivesSpace-service instelt, moet u ArchivesSpace ook [configureren voor gebruik met MySQL](/provisioning/mysql).
Zorg ervoor dat het MySQL-connector-JAR-bestand in de map lib staat, zodat
het servicescript dit aan het classpath van de toepassing kan toevoegen.

Tot slot moet u, zodat de service correct kan worden afgesloten, de volgende regels in
config/config.rb uitcommentariëren en wijzigen:

```ruby
AppConfig[:use_jetty_shutdown_handler] = true
AppConfig[:jetty_shutdown_path] = "/xkcd"
```

Hiermee wordt een shutdown-hook ingeschakeld, zodat Jetty kan reageren wanneer de afsluitactie wordt uitgevoerd.

U kunt het batchscript nu vanaf de hoofdmap van ArchivesSpace uitvoeren via de opdrachtregel met `launcher\service.bat`. Hiermee wordt de service geconfigureerd en worden twee uitvoerbare bestanden aangemaakt: `ArchivesSpaceService.exe` (de service) en `ArchivesSpaceServicew.exe` (een GUI-monitor).

U kunt de service op verschillende manieren starten. De eenvoudigste manier is om de GUI-monitor te openen en op "Starten" te klikken.

U kunt ook de GUI-monitor starten en deze minimaliseren naar het systeemvak met:

```shell
ArchivesSpaceServicew.exe //MS//
```

U kunt de service vanaf de opdrachtregel uitvoeren met:

```shell
ArchivesSpaceService.exe //ES//
```

De loguitvoer wordt opgeslagen in de logmap van ArchivesSpace.

Raadpleeg de [documentatie van
procrun](http://commons.apache.org/proper/commons-daemon/procrun.html)
voor meer informatie.
