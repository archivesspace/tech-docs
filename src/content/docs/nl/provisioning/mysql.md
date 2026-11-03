---
title: MySQL gebruiken
description: Instructies voor het instellen van MySQL met ArchivesSpace.
---

Standaard draait de ArchivesSpace-distributie op een ingebouwde
database, maar deze is alleen geschikt voor demonstratiedoeleinden.
Wanneer u ArchivesSpace met echte gebruikers en gegevens gaat gebruiken,
moet u overstappen op MySQL. MySQL biedt aanzienlijk betere prestaties
wanneer meerdere personen het systeem gebruiken, en zorgt ervoor dat uw
gegevens veilig blijven.

ArchivesSpace kan momenteel worden uitgevoerd met MySQL-versie 5.x en 8.x.

## De MySQL-connector downloaden

ArchivesSpace vereist de
[MySQL Connector for Java](http://dev.mysql.com/downloads/connector/j/),
die vanwege de licentieovereenkomst afzonderlijk moet worden gedownload.
Download de Connector en plaats deze op een locatie waar ArchivesSpace deze
op zijn classpath kan vinden:

```shell
$ cd lib
$ curl -Oq https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/9.1.0/mysql-connector-j-9.1.0.jar
```

Houd er rekening mee dat de versie van de MySQL-connector anders kan zijn
tegen de tijd dat u dit leest.

## Uw MySQL-database instellen

Maak vervolgens een lege database in MySQL en verleen toegang aan een
specifieke ArchivesSpace-gebruiker. In het volgende voorbeeld worden de
gebruikersnaam `as` en het wachtwoord `as123` gebruikt.

**OPMERKING: BIJ HET AANMAKEN VAN DE DATABASE MOET U DE STANDAARDTEKENCODERING
VAN DE DATABASE INSTELLEN OP `utf8`.** Dit is vooral belangrijk
als u een MySQL-client gebruikt om de database aan te maken (bijv. Navicat, MySQL
Workbench, phpMyAdmin enz.).

<!-- This is also true of MySQL 8 in general... -->

**OPMERKING: Als u AWS RDS MySQL-databases gebruikt, is binaire logboekregistratie niet standaard ingeschakeld en mislukken updates.** Om binaire logboekregistratie in te schakelen, moet u een aangepaste db-parametergroep voor de database aanmaken en `log_bin_trust_function_creators = 1` instellen. Zie [Werken met DB-parametergroepen](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithParamGroups.html) voor informatie over RDS-parametergroepen. U kunt in een MySQL-sessie ook `SET GLOBAL log_bin_trust_function_creators = 1;` proberen.

```shell
$ mysql -uroot -p

mysql> create database archivesspace default character set utf8mb4;
Query OK, 1 row affected (0.08 sec)
```

Bij gebruik van MySQL 5.7 of ouder:

```sql
mysql> grant all on archivesspace.* to 'as'@'localhost' identified by 'as123';
Query OK, 0 rows affected (0.21 sec)
```

Bij gebruik van MySQL 8 of hoger:

```sql
mysql> create user 'as'@'localhost' identified by 'as123';
Query OK, 0 rows affected (0.08 sec)

mysql> grant all privileges on archivesspace.* to 'as'@'localhost';
Query OK, 0 rows affected (0.21 sec)
```

Pas vervolgens uw bestand `config/config.rb` aan zodat het naar uw MySQL-database
verwijst. Zorg er bij het aanpassen van uw configuratiebestand **voor dat u
opgeeft dat de tekencodering van de database `UTF-8` moet zijn**, zoals
hieronder wordt getoond:

```ruby
AppConfig[:db_url] = "jdbc:mysql://localhost:3306/archivesspace?user=as&password=as123&useUnicode=true&characterEncoding=UTF-8"
```

Er is een databasescript dat alle tabellen aanmaakt die ArchivesSpace nodig
heeft. Voer dit uit met:

```shell
scripts/setup-database.sh  # or setup-database.bat under Windows
```

U kunt nu de instructies in het gedeelte ‘Aan de slag’ volgen om uw
ArchivesSpace-toepassing te starten.

\*\*OPMERKING: Voor MySQL 8. MySQL 8 gebruikt standaard een nieuwe methode (caching_sha2_password) als authenticatieplug-in in plaats van de oude mysql_native_password die MySQL 5.7 en ouder gebruikten. Mogelijk moet u een MySQL 8-server starten met de optie `--default-authentication-plugin=mysql_native_password`. U kunt het authenticatiemechanisme mogelijk ook per gebruiker wijzigen door u aan te melden bij mysql en `ALTER USER 'as'@'localhost' IDENTIFIED WITH mysql_native_password BY 'as123';` uit te voeren. Zorg er ook voor dat u de nieuwste [MySQL Connector for Java](http://dev.mysql.com/downloads/connector/j/) van MySQL in uw /lib/ directory hebt staan voor ArchivesSpace.
