---
title: Ontwikkelingsomgeving
description: Instructies voor het opzetten van een ontwikkelomgeving voor ArchivesSpace, inclusief systeemeisen, ondersteunde ontwikkelplatforms, een snelle start en stapsgewijze instructies.
---

Systeemeisen:

- Java 17
- [Docker](https://www.docker.com/) en [Docker Compose](https://docs.docker.com/compose/) zijn optioneel, maar maken het draaien van MySQL en Solr handiger
- [Supervisord](http://supervisord.org/) is optioneel, maar maakt het draaien van de ontwikkelservers handiger
- [mysql-client](https://www.bytebase.com/reference/mysql/how-to/how-to-install-mysql-client-on-mac-ubuntu-centos-windows/) is vereist om demo-gegevens of andere SQL-dumps in de database te laden

Op dit moment ondersteunde platforms voor ontwikkeling:

- Linux (hoewel in de praktijk meestal alleen Ubuntu daadwerkelijk wordt gebruikt / getest)
- macOS op Intel (x86_64)
- macOS op Apple silicon (ARM64) _sinds v4.0.0_

:::note[Apple silicon en ArchivesSpace vóór v4.0.0]
Voor het installeren van versies van ArchivesSpace vóór v4.0.0 op macOS met Apple silicon, zie [https://teaspoon-consulting.com/articles/archivesspace-on-the-m1.html](https://teaspoon-consulting.com/articles/archivesspace-on-the-m1.html).
:::

:::danger[Ontwikkelen op Windows niet ondersteund]
Windows wordt niet ondersteund vanwege problemen bij het bouwen van gems met C-extensies (zoals sassc).
:::

Bij het installeren van Java wordt [OpenJDK](https://openjdk.org/) sterk aanbevolen. Andere leveranciers kunnen werken, maar OpenJDK wordt het meest uitgebreid gebruikt en getest. Het wordt sterk aanbevolen om een versiebeheerder te gebruiken, zoals [mise](https://mise.jdx.dev/lang/java.html), om Java (OpenJDK) te installeren. Dit heeft zich als een betrouwbare manier bewezen om problemen met platformoverstijgende compatibiliteit op te lossen die via andere installatiemethoden zijn ontstaan.

Het installeren van OpenJDK met mise ziet er ongeveer zo uit:

```bash
mise use -g java@openjdk-17
```

Op Linux/Ubuntu is het doorgaans prima om vanuit systeempackages te installeren:

```bash
sudo apt install openjdk-$VERSION-jdk-headless
# voorbeeld: installeer 17
sudo apt install openjdk-17-jdk-headless
# update-java-alternatives kan worden gebruikt om tussen versies te schakelen
sudo update-java-alternatives --list
sudo update-java-alternatives --set $version
```

Voor [Homebrew](https://brew.sh/)-gebruikers (macOS, Linux) is de OpenJDK-distributie van Azul gerapporteerd als werkend:

```bash
# installeer Java v17 bijvoorbeeld
brew install --cask zulu@17
```

Als je Docker en Docker Compose gebruikt, installeer deze dan volgens de officiële documentatie:

- [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)
- [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)

_Gebruik geen systeempackages of andere niet-officiële bronnen, omdat deze inconsistent zijn gebleken met standaard Docker._

_De aanbevolen manier om ArchivesSpace te ontwikkelen is om de repository te forken en lokaal te klonen._

_Noot: alle opdrachten in de volgende instructies gaan ervan uit dat je je in de hoofdmap van je lokale fork bevindt, tenzij anders vermeld._

**Snelle start**

Dit is een beknopte referentie voor het starten, met een beperkte uitleg van de stappen:

```bash
# Bouw de images (eenmalig vereist voor de meeste gebruikssituaties)
docker-compose -f docker-compose-dev.yml build
# Start MySQL en Solr op de achtergrond
docker-compose -f docker-compose-dev.yml up --detach
# Download de MySQL-connector
cd ./common/lib && wget https://repo1.maven.org/maven2/mysql/mysql-connector-java/8.0.30/mysql-connector-java-8.0.30.jar && cd -
# Download alle applicatie-afhankelijkheden
./build/run bootstrap
# OPTIONAL: laad dev-database
gzip -dc ./build/mysql_db_fixtures/demo.sql.gz | mysql --host=127.0.0.1 --port=3306  -u root -p123456 archivesspace
# Stel de ontwikkeldatabase in
./build/run db:migrate
# Wis eventuele bestaande Solr-status (alleen nodig na een database-instelling / herstel na eerdere ontwikkeling)
./build/run solr:reset
# Start de ontwikkelservers
supervisord -c supervisord/archivesspace.conf
# OPTIONAL: voer een backend (api)-test uit (voor controle van de installatie)
./build/run backend:test -Dexample="User model"
```

## Stap voor stap uitgelegd

### MySQL en Solr uitvoeren

Voor de ontwikkeling van ArchivesSpace moeten MySQL en Solr draaien. De gemakkelijkste en aanbevolen manier om ze te starten is via de Docker Compose-configuratie die door ArchivesSpace wordt geleverd.

Begin met het bouwen van de images. Hiermee wordt een aangepaste Solr-image gemaakt die ArchivesSpace's configuratie bevat:

```bash
docker-compose -f docker-compose-dev.yml build
```

_Noot: je hoeft bovenstaande opdracht slechts één keer uit te voeren. Je hoeft deze opdracht alleen opnieuw uit te voeren als a) je de image hebt verwijderd en deze daarom opnieuw moet aanmaken, of b) je een wijziging hebt gemaakt in de Solr-configuratie van ArchivesSpace en de image daarom opnieuw moet bouwen om de bijgewerkte configuratie op te nemen._

Start MySQL en Solr op de achtergrond:

```bash
docker-compose -f docker-compose-dev.yml up --detach
```

Door Docker Compose te gebruiken om MySQL en Solr uit te voeren, heb je gegarandeerd de juiste verbindingsinstellingen en hoef je anders geen verbindingsinstellingen voor MySQL of Solr te definiëren.

Controleer of MySQL en Solr draaien: `docker ps`. Het zou de draaiende containers moeten vermelden:

```txt
CONTAINER ID   IMAGE                       COMMAND                  CREATED       STATUS       PORTS                               NAMES
ec76bd09d73b   mysql:8.0                   "docker-entrypoint.s…"   8 hours ago   Up 8 hours   33060/tcp, 0.0.0.0:3307->3306/tcp   as_test_db
30574171530f   archivesspace/solr:latest   "docker-entrypoint.s…"   8 hours ago   Up 8 hours   0.0.0.0:8984->8983/tcp              as_test_solr
d84a6a183bb0   archivesspace/solr:latest   "docker-entrypoint.s…"   8 hours ago   Up 8 hours   0.0.0.0:8983->8983/tcp              as_dev_solr
7df930293875   mysql:8.0                   "docker-entrypoint.s…"   8 hours ago   Up 8 hours   0.0.0.0:3306->3306/tcp, 33060/tcp   as_dev_db
```

Om te controleren of de servers online zijn:

- MYSQL: `mysql -h 127.0.0.1 -u as -pas123 archivesspace`
- SOLR: `curl http://localhost:8983/solr/admin/cores`

Om de servers te stoppen en/of te verwijderen:

```bash
docker-compose -f docker-compose-dev.yml stop # stopt de servers (gegevens worden bewaard)
docker-compose -f docker-compose-dev.yml rm # verwijdert de containers (alle gegevens worden verwijderd)
```

**Geavanceerd: MySQL en Solr buiten Docker uitvoeren**

Je bent niet verplicht om Docker te gebruiken voor MySQL en Solr. Als je ze op een andere manier uitvoert, zijn de standaardvereisten:

- dev MySQL, localhost:3306, database aanmaken: archivesspace, gebruikersnaam: as, wachtwoord: as123
- test MySQL, localhost:3307, database aanmaken: archivesspace, gebruikersnaam: as, wachtwoord: as123
- dev Solr, localhost:8983, core `archivesspace` aanmaken met de ArchivesSpace-configuratie
- test Solr, localhost:8984, core `archivesspace` aanmaken met de ArchivesSpace-configuratie

De standaardinstellingen kunnen worden gewijzigd met [omgevingsvariabelen](https://github.com/archivesspace/archivesspace/blob/master/build/build.xml#L43-L46) in het buildbestand.

### Download de MySQL-connector

Om licentie redenen moet de MySQL-connector afzonderlijk worden gedownload:

```bash
cd ./common/lib
wget https://repo1.maven.org/maven2/mysql/mysql-connector-java/8.0.30/mysql-connector-java-8.0.30.jar
cd -
```

### Bootstrap uitvoeren

De bootstrap-taak:

     ./build/run bootstrap

Zal je ontwikkelomgeving bootstrappen door alle
afhankelijkheden te downloaden--JRuby, Gems, enz. Met één opdracht wordt een volledig
zelfvoorzienende ontwikkelomgeving aangemaakt waarin alles binnen de `build`-map van het ArchivesSpace-project wordt gedownload.

_Het is niet nodig en over het algemeen onjuist om JRuby
& bundler etc. handmatig te installeren voor ArchivesSpace (zowel met een versiebeheerder als anderszins)._ 

_De zelfvoorzienende ontwikkelomgeving van ArchivesSpace werkt normaal gesproken niet samen met andere J/Ruby-omgevingen die je op je systeem hebt (zoals die worden beheerd door rbenv of vergelijkbare tools)._ 

Dit is het startpunt voor alle ArchivesSpace-ontwikkeling. Je moet deze opdracht mogelijk opnieuw uitvoeren nadat je updates hebt opgehaald, of wanneer je wijzigingen aanbrengt in Gemfiles of andere afhankelijkheden zoals die in het `./build/build.xml`-bestand.

**Fouten bij het uitvoeren van bootstrap**

```txt
     [java] INFO: jetty-9.4.44.v20210927; built: 2021-09-27T23:02:44.612Z; git: 8da83308eeca865e495e53ef315a249d63ba9332; jvm 11+28
     [java] Exiting
     [java] LoadError: no such file to load -- rails/commands
     [java]   require at org/jruby/RubyKernel.java:974
     [java]    <main> at script/rails:8
```

     ./build/run backend:devserver
     ./build/run frontend:devserver
     ./build/run public:devserver
     ./build/run indexer

Er zijn verschillende vormen van dezelfde `LoadError` geweest. Het is een tijdelijke fout
 die wordt opgelost door bootstrap opnieuw uit te voeren.

```txt
     [java] org.jruby.Main -I uri:classloader://META-INF/jruby.home/lib/ruby/stdlib -r
     [java] ./siteconf20220407-5224-13f6qi7.rb extconf.rb
     [java] sh: /Library/Internet: No such file or directory
     [java] sh: line 0: exec: /Library/Internet: cannot execute: No such file or directory
     [java]
     [java] extconf failed, exit code 126
```

Dit is gezien op Mac-platforms als gevolg van de installatiewijze van Java. Het installeren van OpenJDK via Jabba heeft deze fout effectief opgelost.

**Geavanceerd: bootstrap en de build-map**

Bij het uitvoeren van bootstrap worden jars gedownload naar de build-map, waaronder:

- jetty-runner
- jruby
- jruby-rack

Gems worden gedownload naar: `./build/gems/jruby/$version/gems/`.

### De ontwikkeldatabase instellen

De migratie-taak:

```bash
./build/run db:migrate
```

Stelt de ontwikkeldatabase in en maakt de tabellen enz. aan die
voor de toepassing vereist zijn.

Er is een taak om de database opnieuw in te stellen:

```bash
./build/run db:nuke
```

Welke eerst de database verwijdert en daarna opnieuw migreert.

### Gegevensfixtures in de dev-database laden

Bij het laden van een database in de ontwikkel-MySQL-instantie moet je er altijd voor zorgen dat ArchivesSpace
**niet** actief is. Stop ArchivesSpace als het draait. Voer `./build/run solr:reset` uit om
 de indexeerstatus te wissen (een grondigere uitleg van deze stap staat hieronder).

Als je een database laadt en MySQL is al voor ontwikkeling gebruikt, wil je waarschijnlijk eerst een lege database verwijderen en opnieuw aanmaken.

```bash
mysql -h 127.0.0.1 -u as -pas123 -e "DROP DATABASE archivesspace"
mysql -h 127.0.0.1 -u as -pas123 -e "CREATE DATABASE IF NOT EXISTS archivesspace DEFAULT CHARACTER SET utf8mb4"
```

_Noot: je kunt bovenstaande stap overslaan als MySQL net voor de eerste keer is gestart of als je een lege ArchivesSpace hebt (een instantie waarin `db:migrate` nog niet is uitgevoerd)._ 

Uitgaande van een draaiende MySQL en een lege `archivesspace`-database kun je doorgaan met herstellen:

```bash
gzip -dc ./build/mysql_db_fixtures/blank.sql.gz | mysql --host=127.0.0.1 --port=3306  -u root -p123456 archivesspace
./build/run db:migrate
```

_Noot: de bovenstaande instructies zouden out-of-the-box moeten werken. Als je je eigen database wilt gebruiken en/of MySQL anders hebt geconfigureerd, pas de opdrachten dan naar behoefte aan._

Na het herstellen wordt `./build/run db:migrate` uitgevoerd om migratie-updates op te vangen. Je kunt nu
 doorgaan met het starten van de ontwikkelservers, zoals hieronder beschreven, met data die al in ArchivesSpace is geladen.

### Bestaande Solr-status wissen

De Solr-resettaak:

```bash
./build/run solr:reset
```

Wist alle bestaande Solr-status. Dit is niet nodig bij de eerste installatie, maar is vaak nodig na een database-reset (bijvoorbeeld
na het uitvoeren van de taak `./build/run db:nuke`).

_Meer specifiek: hiermee wordt een `delete all`-verzoek aan Solr verzonden en wordt de inhoud van de `./build/dev/indexer*_state`-mappen geleegd, zoals hieronder wordt beschreven._

### De ontwikkelservers starten

Gebruik [Supervisord](http://supervisord.org/) voor een eenvoudigere manier om de ontwikkelservers uit te voeren met output
voor alle servers in één terminalvenster:

```bash
# voer alle services uit
supervisord -c supervisord/archivesspace.conf

# voer in api-modus uit (backend + indexer)
supervisord -c supervisord/api.conf

# voer alleen de backend uit (handig om endpoints uit te proberen die geen Solr nodig hebben)
supervisord -c supervisord/backend.conf
```

ArchivesSpace wordt gestart met:

- de medewerkersinterface op [http://localhost:3000/](http://localhost:3000/)
- de PUI op [http://localhost:3001/](http://localhost:3001/)
- de API op [http://localhost:4567/](http://localhost:4567/)

Om supervisord te stoppen: `Ctrl-c`.

#### Geavanceerd: de ontwikkelservers direct uitvoeren

Supervisord is niet vereist, of ideaal voor elke situatie. Je kunt de ontwikkelservers direct uitvoeren via build-taken:

```bash
./build/run backend:devserver # Dit is de REST API
./build/run frontend:devserver # Dit is de medewerkersinterface
./build/run public:devserver # Dit is de publieke gebruikersinterface
./build/run indexer # Dit is de indexeerder (zet ASpace-records om in Solr-docs en stuurt ze naar Solr)
```

Deze moeten in verschillende terminalsessies worden uitgevoerd en hoeven niet in een specifieke volgorde te worden uitgevoerd of allemaal vereist te zijn.

_Een voorbeeld van een gebruikssituatie voor het direct starten van een server is het gebruik van de pry-debugger._

#### Geavanceerd: debuggen met pry

Om te debuggen met pry kun je Supervisord niet gebruiken om de devserver van de toepassing te starten,
maar je kunt wel combineren:

```bash
# start de backend en indexeerder met supervisord
supervisord -c supervisord/api.conf

# in een apart terminalvenster start je de frontend direct
./build/run frontend:devserver
```

Voeg `require 'pry-debugger-jruby'; binding.pry` toe om breakpoints in de code in te stellen. Dit kan ook in views worden gebruikt:
`<% require 'pry-debugger-jruby'; binding.pry %>`. Met pry kun je gemakkelijk de `request`, `params` en
in-scope variabelen inspecteren die beschikbaar zijn. Typische debugger-opdrachten zijn beschikbaar:

- `step`: Stap uitvoering naar de volgende regel of methode. Accepteert een optioneel numeriek argument om meerdere stappen te zetten.
- `next`: Stap over naar de volgende regel in hetzelfde frame. Accepteert een optioneel numeriek argument om meerdere stappen te zetten. Verschilt van `step` doordat het altijd binnen hetzelfde frame blijft (bijv. gaat niet naar andere method calls).
- `finish`: Voer uit totdat het huidige stack frame terugkeert.
- `continue`: Ga door en beëindig de Pry-sessie.
- `puts caller.join("\n")`: Haal de huidige stacktrace op.

Zie ook de [pry-debugger-jruby docs](https://gitlab.com/ivoanjo/pry-debugger-jruby).

#### Geavanceerd: ontwikkelservers en de build-map

     ./build/run db:migrate

Het draaien van de ontwikkelservers maakt mappen aan in `./build/dev`:

- indexer_pui_state: nieuwste tijdstempels voor PUI-indexeeractiviteit
- indexer_state: nieuwste tijdstempels voor (SUI)-indexeeractiviteit
- shared: bestanden voor achtergrondtaken

  ./build/run db:nuke

_Noot: de mappen worden aangemaakt zodra ze nodig zijn, dus ze zijn mogelijk niet allemaal tegelijk aanwezig._

#### Toegang tot ontwikkelservers vanaf andere apparaten op hetzelfde lokale netwerk

Je kunt toegang krijgen tot de ArchivesSpace-ontwikkelservers vanaf andere apparaten op hetzelfde lokale netwerk. Dit is vooral handig voor testen op mobiele besturingssystemen.

##### Vereisten

1. Je ontwikkelmachine en het andere apparaat moeten op hetzelfde WiFi-netwerk zitten
2. De ArchivesSpace-ontwikkelservers moeten op de ontwikkelmachine actief zijn

##### Stappen

1. Verkrijg het lokale IP-adres van je ontwikkelmachine

   Op macOS:

   ```bash
   ipconfig getifaddr en0
   ```

   Op Linux:

   ```bash
   hostname -I | awk '{print $1}'
   ```

   Dit levert iets dergelijks op als `134.192.0.47`.

2. Start de [ontwikkelservers](#de-ontwikkelservers-starten)

   De ontwikkelservers binden standaard aan `0.0.0.0`, waardoor ze vanaf andere apparaten op het netwerk toegankelijk zijn (zie het [voorbeeld van de binding van de frontend](https://github.com/archivesspace/archivesspace/blob/f77dec627cd1feac77e4b67f9242d617efe80e94/build/build.xml#L899)).

3. **Toegang vanaf een ander apparaat**

   Op het andere apparaat open je een webbrowser en ga je naar het IP-adres van je ontwikkelmachine met de juiste poort, d.w.z.: `http://<your-local-ip>:<port>/`.

   Dus voor IP-adres `134.192.0.47`:
   - Medewerkersinterface: `http://134.192.0.47:3000/`
   - Publieke gebruikersinterface: `http://134.192.0.47:3001/`
   - API: `http://134.192.0.47:4567/`

## Tests uitvoeren

### Backend-tests

_Standaard zijn de tests geconfigureerd om uit te voeren met een aparte MySQL en Solr dan de
developelservers. Dit betekent dat de ontwikkel- en testomgevingen elkaar niet
in de weg zitten._

```bash
# voer de backend-/api-tests uit
./build/run backend:test
```

Je kunt ook één spec-bestand uitvoeren met:

```bash
./build/run backend:test -Dspec="myfile_spec.rb"
```

Of één voorbeeld met:

```bash
./build/run backend:test -Dexample="does something important"
```

Of per regel met:

```bash
./build/run backend:test -Dspec="myfile_spec.rb:123"
```

Er zijn specifieke instructies en vereisten voor het laten werken van de [UI tests](/development/ui_test).

**Geavanceerd: tests en de build-map**

Het uitvoeren van de tests kan mappen aanmaken in `./build/test`. Deze zullen
hetzelfde zijn als voor de ontwikkelservers, zoals hierboven beschreven.

## Coverage-rapporten

Je kunt de coverage-rapporten uitvoeren met:

     ./build/run coverage

Dit voert alle bovenstaande tests uit in coverage-modus en, wanneer de run
is voltooid, genereert het een set HTML-rapporten binnen de `coverage`
-map in je ArchivesSpace-projectmap.

## Linting en formattering met Rubocop

Als je bronbestanden bewerkt of toevoegt die je via een pull request wilt bijdragen,
moet je ervoor zorgen dat je wijzigingen voldoen aan de lay-out- en stijlregels door het volgende uit te voeren:

    ./build/run rubocop

De meeste fouten kunnen automatisch worden gecorrigeerd door het volgende uit te voeren:

    ./build/run rubocop -Dcorrect=true

## Een pull request indienen

Wanneer je code klaar is voor review, open je een pull request om te vragen om deze
in de codebase te laten samenvoegen.

Om de review soepel te laten verlopen, volgen hier enkele algemene richtlijnen:

- **Je pull request moet één issue behandelen.**
  Het is beter om grote of ingewikkelde PR's te splitsen in discrete stappen als dat mogelijk is. Dit
  maakt review beter hanteerbaar en verkleint het risico op conflicten met andere wijzigingen.
- **Geef je pull request een korte titel, met verwijzing naar eventuele JIRA- of GitHub-issues die door de pull request worden opgelost.**
  Het expliciet opnemen van JIRA-nummers (bijv. 'ANW-123') in de titel van je pull request zorgt ervoor dat
  de PR wordt gekoppeld aan het oorspronkelijke issue in JIRA. Op dezelfde manier zorgt het verwijzen naar GitHub-issue-nummers
  (bijv. 'Fixes #123') ervoor dat het issue automatisch wordt gesloten wanneer de PR wordt samengevoegd.
- **Vul zoveel mogelijk van het Pull Request-sjabloon in.**
  Dit maakt het gemakkelijker om de volledige context te begrijpen, inclusief eventuele discussies of ondersteunende documentatie die bij de ontwikkeling van de functionaliteit of het oplossen van de bug zijn gebruikt.

## Een distributie bouwen

Zie: [Bouwen van een ArchivesSpace-release](/development/release) voor informatie over het bouwen van een distributie.

## API-documentatie genereren

Zie: [Bouwen van een ArchivesSpace-release](/development/release) voor informatie over het bouwen van de documentatie.
