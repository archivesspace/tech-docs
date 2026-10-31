---
title: Externe Solr
description: Instructies voor het installeren en gebruiken van externe Solr met ArchivesSpace.
---

:::note
Vanaf ArchivesSpace > 3.1.1 is externe Solr **vereist**. Voor eerdere versies is dit optioneel.
:::

## Ondersteunde Solr-versies

Zie de [opmerkingen over Solr-vereisten](/administration/getting_started#solr)

## Solr installeren

Raadpleeg de [Solr-documentatie](https://solr.apache.org/guide/solr/latest/) voor instructies over het instellen van Solr op uw server.

U downloadt het Solr-pakket en pakt het uit in een map naar keuze. Start Solr pas nadat u de ArchivesSpace-configuratiebestanden hebt toegevoegd.

**We raden ten zeerste aan Solr in de zelfstandige modus te installeren. Er wordt geen ondersteuning geboden voor Solr Cloud-implementaties in het bijzonder (we kunnen u bijvoorbeeld niet helpen bij het oplossen van problemen met Zookeeper).**

## Een configset maken

Voordat u Solr uitvoert, moet u een [configuratieset](https://solr.apache.org/guide/8_10/config-sets.html#configsets-in-standalone-mode) instellen.

### Een nieuwe map maken

#### Linux

Gebruik de opdrachtregel:

```shell
mkdir -p /$path/$to/$solr/server/solr/configsets/archivesspace/conf
```

Vervang `/$path/$to/$solr` door de daadwerkelijke locatie van Solr, bijvoorbeeld:

```shell
mkdir -p /opt/solr/server/solr/configsets/archivesspace/conf
```

#### Windows

Klik met de rechtermuisknop op uw Solr-map en open deze in Windows Terminal (Powershell).

```
mkdir -p .\server\solr\configsets\archivesspace\conf
```

U zou ongeveer het volgende als uitvoer moeten zien:

```
Directory: C:\Users\archivesspace\Projects\solr-8.10.1\server\solr\configsets\archivesspace
Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        10/25/2021  12:15 PM                conf
```

### De configuratiebestanden kopiëren

Kopieer de configuratiebestanden voor ArchivesSpace Solr uit de map `solr` in het zipbestand van de release naar de map `$SOLR_HOME/server/solr/configsets/archivesspace/conf`.

Er moeten vier bestanden zijn:

- schema.xml
- solrconfig.xml
- stopwords.txt
- synonyms.txt

```shell
ls .\server\solr\configsets\archivesspace\conf\

Directory: C:\Users\archivesspace\Projects\solr-8.10.1\server\solr\configsets\archivesspace\conf

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a----        10/25/2021  12:18 PM          18291 schema.xml
-a----        10/25/2021  12:18 PM           3046 solrconfig.xml
-a----        10/25/2021  12:18 PM              0 stopwords.txt
-a----        10/25/2021  12:18 PM              0 synonyms.txt
```

_Opmerking: uw uitvoer kan er iets anders uitzien._

## De omgeving instellen

Bij gebruik van Solr v9 of hoger zijn [Solr-modules](https://solr.apache.org/guide/solr/latest/configuration-guide/solr-modules.html) vereist.
We raden aan de omgevingsvariabele te gebruiken om op te geven welke modules moeten worden gebruikt:

```shell
SOLR_MODULES=analysis-extras
```

Deze omgevingsvariabele moet tijdens runtime beschikbaar zijn voor de Solr-instantie.

Hieronder staan enkele aanbevolen artikelen met instructies voor het instellen van een omgevingsvariabele:

- Bij gebruik van [Linux](https://www.freecodecamp.org/news/how-to-set-an-environment-variable-in-linux)
- Bij gebruik van een [Mac](https://phoenixnap.com/kb/set-environment-variable-mac)
- Bij gebruik van [Windows](https://docs.oracle.com/cd/E83411_01/OREAD/creating-and-modifying-environment-variables-on-windows.htm#OREAD158). Let op: in Windows moet de variabelenaam `SOLR_MODULES` zijn en de variabelewaarde `analysis-extras`.

## Een Solr-core instellen

Voer de opdracht uit om een ArchivesSpace-core te maken zodra de `configset` is ingesteld:

```bash
bin/solr start
```

Wacht tot Solr is gestart (uitgevoerd als niet-beheerdersgebruiker):

```shell
.\bin\solr start
"java version info is 11.0.12"
"Extracted major version is 11"
OpenJDK 64-Bit Server VM warning: JVM cannot use large page memory because it does not have enough privilege to lock pages in memory.
Waiting up to 30 to see Solr running on port 8983
Started Solr server on port 8983. Happy searching!
```

U kunt controleren of Solr actief is via [http://localhost:8983](http://localhost:8983).

Maak nu de core:

```shell
bin/solr create -c archivesspace -d archivesspace
```

U zou een bevestiging moeten zien:

```shell
"java version info is 11.0.12"
"Extracted major version is 11"

Created new core 'archivesspace'
```

In de browser zou u toegang moeten hebben tot het [ArchivesSpace-schema](http://localhost:8983/solr/#/archivesspace/files?file=schema.xml).

## De ingebouwde Solr-serverinstantie uitschakelen (optioneel, alleen voor versies <= 3.1.1)

Bewerk het ArchivesSpace-config.rb-bestand:

```ruby
AppConfig[:enable_solr] = false
```

Houd er rekening mee dat u Solr dan handmatig moet back-uppen.

## De Solr-URL instellen in uw config.rb-bestand

Deze configuratie-instelling moet verwijzen naar uw Solr-instantie:

```ruby
AppConfig[:solr_url] = "http://localhost:8983/solr/archivesspace"
```

Als ArchivesSpace en Solr niet op dezelfde server draaien, vervangt u `localhost` door het adres van Solr.

Standaard controleert ArchivesSpace bij het opstarten of de Solr-configuratie correct lijkt te zijn en wordt er een fout gegenereerd als dat niet zo is. U kunt deze controle uitschakelen door `AppConfig[:solr_verify_checksums] = false` in `config.rb` in te stellen.

Let op: als u een bestaande ArchivesSpace-installatie bijwerkt om externe Solr te gebruiken, moet u een volledige herindexering uitvoeren.
Zie [Indexen](/administration/indexes) voor meer informatie.

---

U kunt nu de instructies in het gedeelte [Aan de slag](/administration/getting_started) volgen om uw ArchivesSpace-applicatie te starten.

---

## Solr upgraden

Als u een oudere versie van Solr gebruikt dan aanbevolen, moet u deze mogelijk upgraden (als dit in de release-opmerkingen wordt vermeld) of wilt u dat misschien doen. Voordat u een upgrade uitvoert, wordt aanbevolen het volgende te raadplegen:

- [Opmerkingen over Solr-upgrades](https://solr.apache.org/guide/solr/latest/upgrade-notes/solr-upgrade-notes.html)
- [Release-opmerkingen van ArchivesSpace](https://github.com/archivesspace/archivesspace/releases)

U moet ook dit document raadplegen, omdat de installatiestappen instructies kunnen bevatten die voorheen niet nodig waren. Sinds Solr v9 is het bijvoorbeeld verplicht Solr-modules te gebruiken, met instructies om deze modules via omgevingsvariabelen te configureren.

Het belangrijkste is dat wordt gecontroleerd of het schema van ArchivesSpace wordt gebruikt voor de ArchivesSpace-Solr-index. Met de configuratie-instelling `AppConfig[:solr_verify_checksums] = true` wordt bij het opstarten gecontroleerd of dit het geval is. Als dat niet zo is, kan ArchivesSpace niet worden gestart.

Vanaf ArchivesSpace 3.5+ controleert `AppConfig[:solr_verify_checksums]` het bestand `solrconfig.xml` niet. U kunt dit bestand daarom wijzigen zonder dat ArchivesSpace bij het opstarten een fout geeft. Bij een upgrade moet u echter ten minste het ArchivesSpace-`solrconfig.xml`-bestand vergelijken met het bestand dat in gebruik is, voor het geval er wijzigingen nodig zijn om met de bijgewerkte Solr-versie te werken. Zo werkt het ArchivesSpace Solr v8-`solrconfig.xml`-bestand niet zonder aanpassingen met Solr v9.

Na het upgraden van Solr moet u een volledige herindexering uitvoeren. De instructies hiervoor vindt u in [Indexen](/administration/indexes).
