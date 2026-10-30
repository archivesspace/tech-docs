---
title: Upgraden met de zip-distributie
description: Instructies voor het bijwerken van ArchivesSpace.
---

Als u ArchivesSpace hebt geïnstalleerd met het Docker-configuratiepakket, raadpleegt u [upgraden met Docker](/administration/docker/#upgrading). Als u ArchivesSpace hebt geïnstalleerd met de zip-distributie, lees dan verder. (Als u het verschil niet kent, raadpleeg dan de [pagina Aan de slag](/administration/getting_started/#two-ways-to-get-up-and-running).)

Met deze algemene instructies kunt u de meeste versies van ArchivesSpace upgraden naar een latere versie. Gewoonlijk hoeft u niet via andere versies van ArchivesSpace te upgraden om een latere versie te bereiken, tenzij er voor een specifieke versie bijzondere aandachtspunten zijn. Bijzondere aandachtspunten voor deze versies worden hier en in de releaseopmerkingen vermeld.

- **[Bijzondere aandachtspunten bij het upgraden naar v1.1.0](/administration/upgrading_1_1_0)**
- **[Bijzondere aandachtspunten bij het upgraden naar v1.1.1](/administration/upgrading_1_1_1)**
- **[Bijzondere aandachtspunten bij het upgraden van v1.4.2 naar 1.5.x (deze aandachtspunten gelden ook bij een upgrade van 1.4.2 naar elke versie tot en met 2.0.1)](/administration/upgrading_1_5_0)**
- **[Bijzondere aandachtspunten bij het upgraden naar 2.1.0](/administration/upgrading_2_1_0)**
- **[Overstappen op externe Solr bij het upgraden naar 3.2.0 of hoger](https://docs.archivesspace.org/provisioning/solr/).**

## Maak een back-up van uw ArchivesSpace-instantie

Zorg ervoor dat u een werkende back-up van uw ArchivesSpace-installatie hebt voordat u een upgrade uitvoert. Volg hiervoor de stappen in het gedeelte [Back-up en herstel](/administration/backup).

## Pak de nieuwe versie uit

Het is verstandig om een nieuwe kopie uit te pakken van de versie van ArchivesSpace waarnaar u wilt upgraden. Zo weet u zeker dat u de nieuwste versies van alle bestanden gebruikt. Vervang in de onderstaande voorbeelden de kleine letter x door het versienummer waarnaar u upgradet. Bijvoorbeeld 1.5.2 of 1.5.3.

Bijvoorbeeld op Mac OS X of Linux:

```shell
$ mkdir archivesspace-1.5.x
$ cd archivesspace-1.5.x
$ curl -LJO https://github.com/archivesspace/archivesspace/releases/download/v1.5.x/archivesspace-v1.5.x.zip
$ unzip -x archivesspace-v1.5.x.zip
```

( De stap met curl is optioneel en downloadt alleen de distributie van github. U kunt het zip-bestand ook
gewoon in uw browser downloaden en naar de map kopiëren )

Op Windows kunt u hetzelfde doen door ArchivesSpace uit te pakken naar een nieuwe map die u in Windows Verkenner aanmaakt.

## Sluit uw ArchivesSpace-instantie af

Om een consistente kopie te garanderen, moet u nu uw actieve ArchivesSpace-instantie afsluiten.

## Kopieer uw configuratie- en gegevensbestanden

U moet de volgende bestanden en mappen uit uw oorspronkelijke ArchivesSpace-installatie overzetten:

- de map `data` (zie de onderstaande **Opmerking over indexen**)
- de map `config` (zie de onderstaande **Opmerking over de configuratie**)
- uw bestand `lib/mysql-connector*.jar` (als u MySQL gebruikt)
- eventuele plug-ins en lokale aanpassingen die u in uw map `plugins` hebt geïnstalleerd

Bijvoorbeeld op Mac OS X of Linux:

```shell
$ cd archivesspace-1.5.x/archivesspace
$ cp -a /path/to/archivesspace-1.4.2/archivesspace/data/* data/
$ cp -a /path/to/archivesspace-1.4.2/archivesspace/config/* config/
$ cp -a /path/to/archivesspace-1.4.2/archivesspace/lib/mysql-connector* lib/
$ cp -a /path/to/archivesspace-1.4.2/archivesspace/plugins/local plugins/
$ cp -a /path/to/archivesspace-1.4.2/archivesspace/plugins/wonderful_plugin plugins/
```

Of op Windows:

```
$ cd archivesspace-1.5.x\archivesspace
$ xcopy \path\to\archivesspace-1.4.2\archivesspace\data\* data /i /k /h /s /e /o /x /y
$ xcopy \path\to\archivesspace-1.4.2\archivesspace\config\* config /i /k /h /s /e /o /x /y
$ xcopy \path\to\archivesspace-1.4.2\archivesspace\lib\mysql-connector* lib /i /k /h /s /e /o /x /y
$ xcopy \path\to\archivesspace-1.4.2\archivesspace\plugins\local plugins\local /i /k /h /s /e /o /x /y
$ xcopy \path\to\archivesspace-1.4.2\archivesspace\plugins\wonderful_plugin plugins\wonderful_plugin /i /k /h /s /e /o /x /y
```

Het is mogelijk dat u het logbestand (`logs/archivesspace.out`
is de standaardlocatie) van uw vorige installatie wilt bewaren, voor het geval u het later nodig hebt.

### Opmerking over de configuratie

Soms introduceert een nieuwe versie van ArchivesSpace configuratie-instellingen die niet in eerdere versies aanwezig waren.
Voordat u de distributieversie van `config/config.rb` vervangt door uw
oorspronkelijke versie, is het verstandig de distributieversie te bekijken om na te gaan of er nieuwe configuratie-instellingen zijn die voor u van belang zijn.

In upgrade-opmerkingen wordt doorgaans gewezen op configuratie-instellingen die u expliciet moet instellen, maar u weet nooit wanneer u een nieuwe, interessante functie ontdekt. In de documentatie kan ook staan dat u configuratieopties zonder commentaarmarkering moet gebruiken die niet in uw bestand staan als u uw oudere versie behoudt.

### Opmerking over indexen

Soms vereist een nieuwe versie van ArchivesSpace een VOLLEDIGE herindexering. In dat geval moet u niets uit uw map data naar uw nieuwe versie kopiëren. De map data bevat de door Solr aangemaakte indexen.
Raadpleeg de releaseopmerkingen van de nieuwe versie voor informatie over herindexering en het gedeelte [Indexen opnieuw maken](/administration/indexes/) voor instructies over het opnieuw maken van indexen.

## Zet uw locale-gegevens over

Als u wijzigingen hebt aangebracht in uw locale-bestand ( en.yml ) met aangepaste
labels, titels, knopinfo enzovoort, moet u deze overzetten naar uw nieuwe locale-bestand.

Een goede manier om dit te doen is een diff-tool te gebruiken, zoals Notepad++, TextMate of gewoon de opdracht diff van Linux:

```shell
$ diff /path/to/archivesspace-1.4.2/locales/en.yml /path/to/archivesspace-1.5.x/archivesspace/locales/en.yml
$ diff /path/to/archivesspace-1.4.2/locales/enums/en.yml /path/to/archivesspace-v1.5.x/archivesspace/locales/enums/en.yml
```

Hiermee ziet u de verschillen tussen uw huidige locale-bestanden en de nieuwe toevoegingen in de locale-bestanden van de nieuwe versie. Kopieer eenvoudig de waarden die u wilt behouden uit uw oude ArchivesSpace-locale-bestanden naar uw nieuwe ArchivesSpace locales/provisioning/solr/#copy-the-config-files files.

## Voer de databasemigraties uit

Nu alles is gekopieerd, voert u als laatste stap de databasemigraties uit. Hiermee worden de schemawijzigingen en gegevensmigraties toegepast die voor de upgrade nodig zijn. Gebruik hiervoor het script `setup-database` voor uw platform. Bijvoorbeeld op Mac OS X
of Linux:

```shell
$ cd archivesspace-1.5.x/archivesspace
$ scripts/setup-database.sh
```

Of op Windows:

```shell
$ cd archivesspace-1.5.x\archivesspace
$ scripts\setup-database.bat
```

## Updates van de Solr-configuratie

Als de versie waarnaar u upgradet updates van het Solr-schema of andere configuratiebestanden bevat (zie de releaseopmerkingen)
en u externe Solr gebruikt (verplicht vanaf versie 3.2.0), moet u het Solr-schema en de configuratiebestanden dienovereenkomstig bijwerken door de [Solr-configuratiebestanden te kopiëren](/provisioning/solr/#copy-the-config-files) uit het releasepakket naar uw externe Solr-configuratie.
Zie ook de [volledige instructies voor het gebruik van externe Solr met ArchivesSpace](/provisioning/solr).

## Als u Tomcat gebruikt

De stappen voor implementatie op Tomcat zijn in wezen hetzelfde als in
[archivesspace_tomcat](https://github.com/archivesspace-labs/archivesspace_tomcat)

Maar voordat u uw setup-tomcat-script uitvoert, moet u alle bibliotheken van de vorige ASpace-versie uit uw Tomcat-classpath verwijderen.

     1. Stop Tomcat
     2. Pak uw nieuwe versie van ArchivesSpace uit
     3. Configureer uw MySQL-database in de config.rb ( net als in de
        installatie-instructies )
     4. Controleer of al uw andere lokale configuratie-instellingen in uw
        config.rb-bestand staan ( controleer de instellingen in uw Tomcat conf/config.rb-bestand. )
     5. Controleer of uw MySQL-connector-JAR-bestand in de map lib staat
     6. Voer uw setup-database-script uit om uw database te migreren.
     7. Verwijder alle ASpace-gerelateerde JAR-bibliotheken uit de lib-map van Tomcat. Hieronder vallen de map "gems" en ook "common.jar" en enkele
        [andere](https://github.com/archivesspace/archivesspace/tree/master/common/lib).
        Zo weet u zeker dat u de juiste versie van de afhankelijke
        bibliotheken voor uw nieuwe ASpace-versie gebruikt.
        Zorg er wel voor dat u geen Apache Tomcat-bibliotheken verwijdert.
     8. Voer uw setup-tomcat-script uit ( net als in de installatie-instructies ).
        Hiermee worden alle bestanden naar Tomcat gekopieerd.
     9. Start Tomcat

## Dat is alles!

U kunt nu uw nieuwe versie van ArchivesSpace zoals gebruikelijk starten.
