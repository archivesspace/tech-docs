---
title: Uitvoeren als Unix-daemon
description: Stappen voor het op de achtergrond uitvoeren van ArchivesSpace als daemon met behulp van het opstartscript, en aanvullende informatie over het configureren van opstart-/init-instellingen.
---

Het opstartscript `archivesspace.sh` doet ook dienst als init-script. Als
u het volgende uitvoert:

```
archivesspace.sh start
```

wordt ArchivesSpace op de achtergrond als daemon uitgevoerd (standaard, zoals
voorheen, met logboekregistratie naar `logs/archivesspace.out`). U kunt het
afsluiten met:

```
archivesspace.sh stop
```

U kunt het zelfs als systeembreed init-script installeren door een
symbolische koppeling te maken:

```
cd /etc/init.d
ln -s /path/to/your/archivesspace/archivesspace.sh archivesspace
```

Opmerking: standaard overschrijft ArchivesSpace het logbestand wanneer het
opnieuw wordt gestart. U kunt dit aanpassen door `archivesspace.sh` te wijzigen
en `$startup_cmd` zo aan te passen dat deze twee groter-dan-tekens bevat:

```
$startup_cmd &>> \"$ARCHIVESSPACE_LOGS\" &
```

Gebruik vervolgens het geschikte hulpmiddel voor uw distributie om de
symbolische koppelingen voor runlevels in te stellen (zoals `chkconfig` voor
RedHat of `update-rc.d` voor op Debian gebaseerde distributies).

U kunt archivesspace.sh eventueel aanpassen om het account in te stellen
waaronder het systeem wordt uitgevoerd, JVM-opties enzovoort.

Voor systemen die systemd gebruiken, kunt u overwegen een Systemd-unitbestand
voor ArchivesSpace te gebruiken

Iets vergelijkbaars zou moeten werken:

```
[Unit]
Description=ArchivesSpace Application
After=syslog.target network.target
[Service]
Type=forking
ExecStart=/path/to/your/archivesspace/archivesspace.sh start
ExecStop=/path/to/your/archivesspace/archivesspace.sh stop
PIDFile=/path/to/your/archivesspace/archivesspace.pid
User=archivesspace
Group=archivesspace
[Install]
WantedBy=multi-user.target
```
