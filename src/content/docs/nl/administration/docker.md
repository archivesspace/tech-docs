---
title: Uitvoeren met Docker
description: Instructies voor het instellen, uitvoeren en beheren van een ArchivesSpace-installatie met Docker.
---

## Docker-afbeeldingen

Vanaf v4.0.0 ondersteunt ArchivesSpace officieel het gebruik van [Docker](https://www.docker.com/) als de eenvoudigste manier om snel een werkende installatie te krijgen. Docker vereenvoudigt het installeren, upgraden, starten en stoppen van ArchivesSpace. Het maakt het ook eenvoudig om ArchivesSpace als systeemservice in te stellen die bij elke herstart automatisch start.

Als u Docker niet wilt gebruiken, is een andere (meer omvattende) manier om ArchivesSpace operationeel te krijgen het installeren van het nieuwste [ZIP-distributiebestand](/getting_started/zip_distribution).

ArchivesSpace Docker-afbeeldingen zijn beschikbaar op [Docker Hub](https://hub.docker.com/u/archivesspace).

- de afbeeldingen van de hoofdtoepassing zijn gemaakt vanuit [dit Dockerfile](https://github.com/archivesspace/archivesspace/blob/master/Dockerfile)
- solr-afbeeldingen zijn gebouwd vanuit [dit Dockerfile](https://github.com/archivesspace/archivesspace/blob/master/solr/Dockerfile)

## Installeren

### Systeemvereisten

ArchivesSpace op Docker is getest op Ubuntu Linux, macOS en Windows. Er is minimaal 1024 MB RAM vereist. We raden minimaal 2 GB aan voor optimale prestaties.

### Software-afhankelijkheden

Wanneer u Docker gebruikt, is [Docker](https://www.docker.com/) de enige software-afhankelijkheid. Volg de [instructies](https://docs.docker.com/get-started/get-docker/) om de Docker-engine te installeren.
Optioneel kan [Docker Desktop](https://www.docker.com/products/docker-desktop/) worden geïnstalleerd; dit biedt een grafische manier om uw Docker-containers te beheren, te starten en te stoppen, containerlogs te bekijken, enz.

### Downloaden van het configuratiepakket

Om ArchivesSpace met Docker uit te voeren, downloadt u eerst het ArchivesSpace Docker-configuratiepakket van de nieuwste release van [GitHub](https://github.com/archivesspace/archivesspace/releases) (scroll naar beneden naar het gedeelte "Assets" op de pagina van de nieuwste release en zoek naar het ZIP-bestand met de naam `archivesspace-docker-${VERSION}.zip`).

Het gedownloade configuratiepakket bevat een eenvoudige maar configureerbare en productieklaar gemaakte Docker-opzet die bedoeld is om op één computer te draaien.

### Inhoud van het configuratiepakket

Het uitpakken van het gedownloade bestand maakt een `archivesspace`-map met de volgende inhoud:

```
.
├── backups
├── config
│   └── config.rb
├── locales
├── plugins
├── proxy-config
│   └── default.conf
├── sql
├── docker-compose.yml
├── stylesheets
└── .env
```

- De map `backups` wordt pas aangemaakt nadat u de toepassing hebt gestart en bevat de automatisch uitgevoerde back-ups van de database. Zie [sectie automatische back-ups](#automated-database-backups).
- Het bestand `config/config.rb` bevat de [hoofdsconfiguratie](/customization/configuration/) van ArchivesSpace.
- De map `locales` maakt [aanpassing van de interface-teksten](/customization/locales/) mogelijk.
- De map `plugins` is bedoeld om extra ArchivesSpace-[plug-ins](/customization/plugins/) op te nemen. Standaard bevat deze de [`local`](/customization/plugins/#adding-your-own-branding)- en [`lcnaf`](https://github.com/archivesspace-plugins/lcnaf)-plug-ins.
- `proxy-config/default.conf` bevat de configuratie van de meegeleverde `nginx`; zie ook [proxyconfiguratie](#proxy-configuration).
- In de map `sql` kunt u uw `.sql`-database-dumpbestand plaatsen om de nieuwe database te initialiseren; zie [volgende sectie](migrating-from-the-zip-distribution-to-docker).
- De map `stylesheets` bevat de bestanden die worden gebruikt voor het maken van PDF's en andere bestanden.
- Het bestand `docker-compose.yml` bevat alle informatie die Docker nodig heeft om ArchivesSpace te bouwen en uit te voeren.
- Het bestand `.env` bevat de configuratie van de Docker-containers, waaronder:
  - Gebruikersnaam- en wachtwoordgegevens waarmee ArchivesSpace toegang krijgt tot de MySQL-database. Het wordt aanbevolen om het standaardroot- en gebruikerswachtwoord te wijzigen in een veiliger wachtwoord.
  - De databaseverbindings-URI die ook [dienovereenkomstig moet worden bijgewerkt](/customization/configuration/#database-config) nadat het databasegebruikerswachtwoord hierboven is gewijzigd.

## Migreren van de zip-distributie naar Docker

Als u ArchivesSpace momenteel gebruikt met het ZIP-distributiebestand, kunt u beginnen met het gebruik van Docker.

### Maak een back-up van de database van uw ArchivesSpace-installatie

Gebruik `mysqldump` om een dump van uw MySQL-database te maken:

```shell
mysqldump -uroot -p123456 -h 127.0.0.1 archivesspace > /tmp/db.$(date +%F.%H%M%S).sql
```

Volg de stappen in de sectie [Back-up en herstel](/administration/backup/) als u meer instructies nodig heeft over het maken van back-ups van uw MySQL-database.

### Initialiseren en migreren van de database in Docker

Kopieer uw hierboven gemaakte `.sql`-database-dumpbestand naar de map `sql` van uw uitgepakte Docker-configuratiepakket. Zorg ervoor dat de bestandsnaam de extensie `.sql` bevat. Het bestand moet in platte tekstvorm zijn (geen zip-bestand).
Docker haalt het op wanneer het voor de eerste keer start en herstelt de dump in uw nieuwe database.

Als u de dump op een eerdere ArchivesSpace-versie hebt gemaakt, past het systeem eventuele openstaande databasemigraties toe om uw database te upgraden naar de ArchivesSpace-versie die u momenteel op Docker draait.

Na de eerste run wilt u dat `.sql`-bestand waarschijnlijk verwijderen uit de map `sql` van uw uitgepakte Docker-configuratiepakket.

Het Docker-configuratiepakket bevat al een configureerbare database-back-upmechanisme voor MySQL. Lees daar meer over in de [sectie Back-up en herstel](/administration/backup/#using-the-docker-configuration-package).

## Uitvoeren

### Resource-limieten

We raden aan om minimaal 2 GB per container toe te wijzen voor optimale prestaties. Als de hostmachine volledig is gewijd aan het uitvoeren van ArchivesSpace, is het verstandig om geen geheugengrens te configureren voor Docker-containers.

Bij gebruik van Docker Desktop is standaard een geheugengrens ingesteld op 50% van het geheugen van uw hostmachine. Om het RAM-geheugen en andere resource-limieten te verhogen bij gebruik van Docker Desktop, zie [de documentatie](https://docs.docker.com/desktop/settings-and-maintenance/settings/#resources).

Bij gebruik van Docker zonder Docker Desktop wordt standaard geen geheugengrens ingesteld. Zie [de Docker-documentatie](https://docs.docker.com/engine/containers/resource_constraints/) als u de limieten voor de resources die door ArchivesSpace-containers worden gebruikt, wilt instellen.

### Opmerking bij het migreren vanuit de zip-distributie

Als u migreert van de zip-distributie naar Docker, draait u waarschijnlijk nog met lokale MySQL- en Solr-instanties. Als u ArchivesSpace met Docker start, worden de Docker-gebaseerde MySQL- en Solr-instanties gestart. Om poortconflicten te vermijden, moet u ervoor zorgen dat u de lokale MySQL- en Solr-instanties stopzet voordat u doorgaat.

### Starten

Open een terminal, ga naar de map `archivespace` die het bestand `docker-compose.yml` bevat en voer het volgende uit:

```shell
docker compose up --detach
```

De eerste keer dat u ArchivesSpace met Docker start, worden de containerafbeeldingen gedownload en worden configuratiestappen zoals database-initialisatie en Solr-indexinitialisatie automatisch uitgevoerd.
Het wordt verwacht dat het volledige proces tot tien of zelfs meer minuten duurt, afhankelijk van de kracht van uw machine en de snelheid van uw internetverbinding. **Opmerking**: als u migreert vanuit de zip-distributie naar Docker en u al een dump van uw database hebt gekopieerd naar de map `sql`, kan initialisatie van de database en indexering in Solr lang duren, afhankelijk van de grootte van uw gegevens.

Als u de optie `--detach` gebruikt, kunt u de terminal sluiten zonder ArchivesSpace te stoppen. Het bekijken van de logs van draaiende ArchivesSpace-containers is mogelijk in [Docker Desktop](https://www.docker.com/products/docker-desktop/) of in een terminal met:

```shell
docker compose logs --follow
```

Kijk naar de logs voor het welkomstbericht:

```
2024-12-04 18:42:17 archivesspace  | ************************************************************
2024-12-04 18:42:17 archivesspace  |   Welcome to ArchivesSpace!
2024-12-04 18:42:17 archivesspace  |   You can now point your browser to http://localhost:8080
2024-12-04 18:42:17 archivesspace  | ************************************************************
```

Met de standaard proxyconfiguratie is de publieke gebruikersinterface beschikbaar op http://localhost/ en de medewerkersinterface op: http://localhost/staff/ (standaardlogin met: admin / admin)

U kunt de status van uw draaiende containers bekijken met:

```
docker ps
```

Welke een lijst geeft als deze:

```
CONTAINER ID   IMAGE                               COMMAND                  CREATED        STATUS                    PORTS                                                  NAMES
6cd7114c1796   nginx:1.21                          "/docker-entrypoint.…"   26 hours ago   Up 29 minutes             0.0.0.0:80->80/tcp, :::80->80/tcp                      proxy
9ed453c46a9f   archivesspace/archivesspace:4.0.0   "/archivesspace/star…"   26 hours ago   Up 29 minutes (healthy)   8080-8081/tcp, 8089-8090/tcp, 8092/tcp                 archivesspace
ec71dd3030b7   databack/mysql-backup:latest        "/entrypoint dump"       26 hours ago   Up 29 minutes                                                                    db-backup
8b74aa374ec8   archivesspace/solr:4.0.0            "docker-entrypoint.s…"   26 hours ago   Up 29 minutes             0.0.0.0:8983->8983/tcp, :::8983->8983/tcp              solr
d2cf634744fe   mysql:8                             "docker-entrypoint.s…"   26 hours ago   Up 29 minutes             0.0.0.0:3306->3306/tcp, :::3306->3306/tcp, 33060/tcp   mysql
```

Als u ook [Docker Desktop](https://www.docker.com/products/docker-desktop/) hebt geïnstalleerd, kunt u deze gebruiken om de ArchivesSpace-containers te starten, stoppen en beheren nadat ze voor de eerste keer zijn gemaakt. Docker Desktop heeft een ingebouwde terminalvenster dat kan worden gebruikt om Docker-opdrachten uit te voeren.

### Stoppen

De volgende opdrachten moeten worden uitgevoerd vanuit de map `archivespace` die het bestand `docker-compose.yml` bevat. U kunt draaiende containers (zonder ze te verwijderen) stoppen met de opdracht:

```shell
docker compose stop
```

Ze kunnen opnieuw worden gestart met:

```shell
docker compose up --detach
```

### Een shell binnen een container starten om de meegeleverde scripts uit te voeren

U kunt een `bash`-shell openen op de container die de ArchivesSpace-toepassing uitvoert en vervolgens een van de scripts in de map `scripts` uitvoeren met:

```shell
$ docker exec -it archivesspace bash
archivesspace@9ed453c46a9f:/$ cd archivesspace/scripts/
archivesspace@9ed453c46a9f:/archivesspace/scripts$ ls
backup.bat  backup.sh  ead_export.bat  ead_export.sh  find-base.sh  initialize-plugin.bat  initialize-plugin.sh  password-reset.bat  password-reset.sh  rb  setup-database.bat  setup-database.sh
archivesspace@9ed453c46a9f:/archivesspace/scripts$ ./setup-database.sh
NOTE: Picked up JDK_JAVA_OPTIONS: --add-opens java.base/sun.nio.ch=ALL-UNNAMED --add-opens java.base/java.io=ALL-UNNAMED
Loading ArchivesSpace configuration file from path: /archivesspace/config/config.rb
Loading ArchivesSpace configuration file from path: /archivesspace/config/config.rb
Loading ArchivesSpace configuration file from path: /archivesspace/config/config.rb
Detected MySQL connector 8+
Running migrations against jdbc:mysql://db:3306/archivesspace?useUnicode=true&characterEncoding=UTF-8&user=[REDACTED]&******
All done.
```

### Bestanden kopiëren van en naar uw gegevensmap

De `data`-map van ArchivesSpace is niet zichtbaar in het Docker-configuratiepakket (zoals `locales`, `config` en `locales` wel zichtbaar zijn). Dit komt door problemen die we op Windows hebben gehad bij het blootstellen van de `data`-map in plaats van een Docker-volume te gebruiken.

Als u bestanden uit de `data`-map of een andere map van de ArchivesSpace-installatie wilt kopiëren of naar die map wilt kopiëren, kunt u `docker cp`-opdrachten gebruiken, bijvoorbeeld:

```shell
docker cp archivesspace:/archivesspace/data/indexer_state /tmp/indexer_state
docker cp ~/Desktop/test.png archivesspace:/archivesspace/data
```

## Automatische database-back-ups

Het Docker-configuratiepakket bevat een mechanisme dat periodieke back-ups van uw MySQL-database uitvoert; zie [Back-up en herstel](/administration/backup/#backups-when-using-the-docker-configuration-package) voor meer informatie.

## Proxyconfiguratie

Het Docker-configuratiepakket bevat een op `nginx` gebaseerde proxy die standaard gebonden is aan poort 80 van de hostmachine (zie variabele `NGINX_PORT` in het bestand `.env`). Zie `proxy-config/default.conf` en de [nginx Docker-pagina](https://hub.docker.com/_/nginx) voor meer configuratieopties.

## Upgraden

Als u al het Docker-configuratiepakket gebruikt en upgraden naar een nieuwere ArchivesSpace-versie, [download en pak](#downloading-the-configuration-package) het nieuwste Docker-configuratiepakket uit.

### Met Solr-configuratie-/schemawijzigingen

Als de ArchivesSpace-versie waarnaar u upgradet Solr-configuratie- of schemawijzigingen bevat (zie de [release notes](https://github.com/archivesspace/archivesspace/releases)), moet u uw Solr-core opnieuw maken en opnieuw indexeren. Ga naar de map `archivespace` waar u het nieuw gedownloade Docker-configuratiepakket hebt uitgepakt en voer het volgende uit:

```shell
docker compose down solr app
docker volume rm archivesspace_app-data archivesspace_solr-data
docker compose pull
docker compose up -d --build --force-recreate
```

### Zonder Solr-configuratie-/schemawijzigingen

Als er geen Solr-configuratie- of schemawijzigingen zijn opgenomen, gaat u naar de uitgepakte map `architecture` en voert u het volgende uit:

```shell
docker compose pull
docker compose up -d --build --force-recreate
```
