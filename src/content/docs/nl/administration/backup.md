---
title: Back-up en herstel
description: Stappen, opdrachten en advies voor het instellen van uw ArchivesSpace MySQL-database en Solr-index. Back-ups zorgen voor herstel in geval van fouten of storingen.
---

## De Docker-configuratiepakketten gebruiken

### Back-ups van de database

Het [Docker-configuratiepakket](/administration/docker) bevat een mechanisme dat periodieke back-ups van uw MySQL-database uitvoert,
met behulp van: [databacker/mysql-backup](https://github.com/databacker/mysql-backup). Het is standaard ingesteld om
een dump elke twee uur uit te voeren. Zie [configuratie](https://github.com/databacker/mysql-backup/blob/master/docs/configuration.md) voor meer opties.

De automatisch aangemaakte back-ups bevinden zich in de [`backups` directory](/administration/docker/) van het Docker-configuratiepakket.

#### Bij gebruik van Docker

U kunt expliciet een dump van uw gedockeriseerde database aanmaken terwijl de Docker-containers draaien met behulp van de opdracht in uw host-systeem shell:

```shell
docker exec mysql mysqldump -u root -p123456 archivesspace | gzip > /tmp/db.$(date +%F.%H%M%S).sql.gz
```

#### Bij gebruik van Docker Desktop

U kunt expliciet een dump van uw gedockeriseerde database aanmaken terwijl de Docker-containers draaien met behulp van het tabblad "Exec" van uw mysql-container:

```shell
docker exec mysql mysqldump -u root -p123456 archivesspace | gzip > /tmp/db.$(date +%F.%H%M%S).sql.gz
```

U kunt de aangemaakte databasedump vervolgens exporteren vanuit de `/tmp`-map van uw mysql-container met behulp van het tabblad "Bestanden".

## Uw eigen back-ups beheren

Het regelmatig maken van back-ups van uw MySQL-database is cruciaal. ArchivesSpace slaat
al uw recordsgegevens op in de database, zodat u, zolang u back-ups van uw database heeft, altijd kunt herstellen van fouten en storingen.

Als u MySQL gebruikt, kan het hulpprogramma `mysqldump` de databasestructuur en gegevens dumpen naar een bestand. Het is een goed idee om dit uit te voeren met de optie
`--single-transaction` om te voorkomen dat uw databasetabellen worden geblokkeerd terwijl uw back-ups draaien. Het is ook essentieel om de vlag
`--routines` te gebruiken, waarmee functies en opgeslagen procedures in de back-up worden opgenomen.
Het hulpprogramma `mysqldump` wordt veel gebruikt, en er zijn veel tutorials beschikbaar. Als voorbeeld zou iets als dit in uw `crontab` de
database twee keer per dag back-uppen:

```shell
# Dump archivesspace database 6am and 6pm
30 06,18 * * * mysqldump -u as -pas123 archivesspace | gzip > ~/backups/db.$(date +%F.%H%M%S).sql.gz
```

U moet back-ups opslaan op een veilige locatie.

Als u met de demodatabase werkt (gebruik de demodatabase NOOIT in productie),
kunt u periodieke databasesnapshots maken met de volgende configuratie-instellingen:

```ruby
# In this example, we create a snapshot at 4am each day and keep
# 7 days' worth of backups
#
# Database snapshots are written to 'data/demo_db_backups' by
# default.
AppConfig[:demo_db_backup_schedule] = "0 4 \* \* \*"
AppConfig[:demo\_db\_backup\_number\_to\_keep] = 7
```

Solr-indexen kunnen altijd worden [opnieuw gemaakt](administration/indexes/) vanuit de inhoud van de
database. Voor grote sites, waar het opnieuw opbouwen van de indexen te lang zou duren, is het mogelijk om [Solr-indexen back-uppen en herstellen](https://solr.apache.org/guide/solr/latest/deployment-guide/backup-restore.html).
In dat geval moet u ook de bestanden back-uppen en herstellen die door de indexers worden gebruikt om te markeren welk deel van de gegevens al is geïndexeerd:

```
docker cp archivesspace:/archivesspace/data/indexer_state /tmp/indexer_state
docker cp archivesspace:/archivesspace/data/indexer_pui_state /tmp/indexer_pui_state
```

## Back-ups van uw database maken met het meegeleverde script

ArchivesSpace biedt eenvoudige scripts voor Windows en Unix-achtige systemen om de database naar een `.zip`-bestand te back-uppen.

### Bij gebruik van de ingebouwde demodatabase

Opmerking: _Gebruik de demodatabase NOOIT in productie._ U kunt:

```shell
scripts/backup.sh --output /path/to/backup-yyyymmdd.zip
```

uitvoeren en het script zal een bestand genereren met een snapshot van de demodatabase.

### Bij gebruik van MySQL

Als u tegen MySQL draait en `mysqldump` hebt geïnstalleerd,
kunt u de optie `--mysqldump` opgeven. Hiermee wordt de
configuratie uit uw configuratiebestand gelezen en wordt een dump van uw MySQL-database toegevoegd aan het resulterende `.zip`-bestand.

```shell
scripts/backup.sh --mysqldump --output ~/backups/backup-yyyymmdd.zip
```

## Herstellen vanuit back-up

Bij het herstellen van een ArchivesSpace-installatie vanuit een back-up, moet u uw database herstellen (ofwel de demodatabase of MySQL).

Na het herstellen van uw database, wordt aanbevolen om uw [Solr-indexen opnieuw te maken](administration/indexes/)

### Uw database herstellen

#### Bij het beheren van uw eigen MySQL

Als u MySQL gebruikt, vereist het herstellen van uw database alleen het laden van uw `mysqldump`-back-up in een lege database. Als u het script `scripts/backup.sh` gebruikt (zoals hierboven beschreven), is dit dumpbestand `mysqldump.sql` in uw back-up `.zip`-bestand.

Om een MySQL-dumpbestand te laden, volg de instructies in _Uw MySQL-database instellen_
om een lege database aan te maken met de juiste
machtigingen. Vul daarna de database met uw back-upbestand met behulp van de MySQL-client:

```sql
`mysql -uas -p archivesspace < mysqldump.sql`, where
     `as` is the user name
     `archivesspace` is the database name
     `mysqldump.sql` is the mysqldump filename
```

U wordt gevraagd om het wachtwoord van de gebruiker in te voeren.

#### Bij gebruik van de demodatabase

Als u de demodatabase gebruikt, bevat uw back-up `.zip`-bestand een map met de naam `demo_db_backups`. Elke submap van `demo_db_backups` bevat een back-up van de demodatabase. Om
terug te herstellen vanuit een back-up, kopieer de map `archivesspace_demo_db` terug naar uw ArchivesSpace-datamap. Bijvoorbeeld:

```shell
cp -a /unpacked/zip/demo_db_backups/demo_db_backup_1373323208_25926/archivesspace_demo_db \
/path/to/archivesspace/data/
```

#### Bij gebruik van Docker

Als u de Docker-configuratiepakketten gebruikt om ArchivesSpace uit te voeren, kunt u een databasedump terugzetten op uw `archivesspace` MySQL-database met de volgende opdracht in uw host-systeem shell:

```shell
docker exec mysql mysql -uas -pas123 archivesspace < /tmp/db.2025-02-26.164907.sql
```

##### Bij gebruik van Docker Desktop

Op Docker Desktop kunt u uw sql-bestand importeren in de `/tmp/`-directory met behulp van het tabblad "Bestanden" van uw mysql-container. Daarna voert u op het tabblad "Exec" de opdracht uit:

```shell
gunzip -c /tmp/db.2026-02-17.155254.sql.gz | mysql -u as -pas123 archivesspace
```
