---
title: End-to-endtestsuite van ArchivesSpace
description: Instructies voor het uitvoeren van de end-to-endtestsuite.
---

Zie voor meer informatie over de [end-to-endtestsuite](https://github.com/archivesspace/archivesspace/tree/master/e2e-tests) en het bijdragen van tests onze [wikipagina](https://archivesspace.atlassian.net/wiki/spaces/ADC/pages/4606590990/How+to+contribute+End+to+End+test+scenarios).

## Aanbevolen inrichting

### Een versiebeheerder gebruiken

De vereiste Ruby-versie voor de e2e-testapplicatie staat vermeld in `[./.ruby-version](./.ruby-version)`.

Het wordt sterk aanbevolen een versiebeheerder (zoals [mise](https://mise.jdx.dev/)) te gebruiken, zodat u kunt overschakelen naar elke versie die een project vereist.

#### mise

We raden aan [mise](https://mise.jdx.dev/) te gebruiken om Ruby (en andere runtimes) te beheren. Installatie-instructies vindt u bij [Aan de slag](https://mise.jdx.dev/getting-started.html).

#### Alternatieven voor `mise`

Als u een andere Ruby-beheerder of installatiemethode wilt gebruiken, raadpleeg dan de [installatiedocumentatie van Ruby](https://www.ruby-lang.org/en/documentation/installation/).

### Installatie

Navigeer vanuit de hoofdmap van ArchivesSpace naar de e2e-testapplicatie en installeer vervolgens Ruby, Bundler en de afhankelijkheden van de applicatie:

```sh
# 1. Navigate to e2e-tests directory
cd e2e-tests

# 2. Install Ruby at the version specified in ./.tool-versions
mise install

# 3. Install the Bundler dependency manager
gem install bundler

# 4. Install project dependencies
bundle install
```

## Tests lokaal uitvoeren

### Alleen aan de e2e-tests werken met Docker

Als u alleen aan e2e-tests werkt en niets aan de ArchivesSpace-applicatie wijzigt, kunt u de tests lokaal met Docker uitvoeren tegen de meest recente build van de `master`-branch van ArchivesSpace.

#### Docker Desktop installeren

[Docker Desktop](https://www.docker.com/get-started/) is een applicatie die met één klik kan worden geïnstalleerd voor Linux, Mac en Windows. De applicatie biedt toegang tot Docker via zowel de terminal als een grafische interface. Download en installeer via de bovenstaande link de juiste versie voor uw besturingssysteem. U kunt ook alternatieve software gebruiken om Docker-containers uit te voeren, zoals [OrbStack](https://orbstack.dev/) voor macOS.

#### De meest recente Docker-image van ArchivesSpace uitvoeren

```sh
# Get the latest ArchivesSpace `master` branch build
docker compose pull

# Start ArchivesSpace servers
docker compose up
```

Controleer of de servers actief zijn door [http://localhost:8080](http://localhost:8080) in een browser te openen.

### Werken met een ontwikkelomgeving voor ArchivesSpace

U kunt de e2e-testsuite uitvoeren tegen uw lokale ArchivesSpace-ontwikkelomgeving. Houd er echter rekening mee dat u uw database, Solr-index en eventuele configuratiewijzigingen moet terugzetten.

#### Uw database en Solr-index terugzetten

Zorg ervoor dat uw ArchivesSpace-instantie een [lege database](https://docs.archivesspace.org/development/dev/#loading-data-fixtures-into-dev-database) en een [lege Solr-index](https://docs.archivesspace.org/development/dev/#clear-out-existing-solr-state) heeft.

#### De standaardconfiguratieopties herstellen (behalve `AppConfig[:db_url]`)

Zorg ervoor dat u eventuele lokale wijzigingen in de standaardconfiguratieopties (via ../common/config/config.rb) ongedaan maakt door ze van commentaar te voorzien of te verwijderen, behalve `AppConfig[:db_url]` (die nodig is om de MySQL-database te gebruiken).

#### De ontwikkelserver voor de medewerkersinterface starten

Start `frontend:devserver` zoals [hier](https://docs.archivesspace.org/development/dev/#run-the-development-servers) beschreven. Controleer of deze actief is door [http://localhost:3000/](http://localhost:3000/) in uw browser te openen.

#### De ontwikkelserver voor de publieke gebruikersinterface starten

Start `public:devserver` zoals [hier](https://docs.archivesspace.org/development/dev/#run-the-development-servers) beschreven. Controleer of deze actief is door [http://localhost:3001/](http://localhost:3001/) in uw browser te openen.

#### De omgevingsvariabele `STAFF_URL` instellen

Stel de omgevingsvariabele `STAFF_URL` zo in dat de e2e-tests naar de lokale ontwikkelserver verwijzen:

```sh
export STAFF_URL='http://localhost:3000'
```

#### De omgevingsvariabele `PUBLIC_URL` instellen

Stel de omgevingsvariabele `PUBLIC_URL` zo in dat de e2e-tests naar de lokale publieke gebruikersinterface verwijzen:

```sh
export PUBLIC_URL='http://localhost:3001'
```

## Tests uitvoeren

Nadat u de juiste omgevingsvariabelen `STAFF_URL` en `PUBLIC_URL` hebt ingesteld zoals hierboven beschreven, voert u de gewenste tests uit met de volgende opdrachten.

### Alle testbestanden tegelijk

```sh
bundle exec cucumber staff_features/
```

### Alle scenario's in een specifiek bestand

```sh
bundle exec cucumber staff_features/assessments/assessment_create.feature
```

### Een specifiek scenario in een specifiek bestand

```sh
bundle exec cucumber staff_features/assessments/assessment_create.feature --name 'Assessment is created'
```

## Foutopsporing

Voeg een `byebug`-instructie toe in een willekeurig `.rb`-bestand om tijdens het uitvoeren een breekpunt in te stellen en in de console een foutopsporingssessie te starten. Zie voor meer informatie [hier](https://github.com/deivid-rodriguez/byebug). Vergeet niet eventuele `byebug`-instructies te verwijderen voordat u `git push` uitvoert...

Als u tijdens het uitvoeren en debuggen van een testscenario de browser wilt zien, voegt u het argument `HEADLESS=''` toe, bijvoorbeeld:

```sh
bundle exec cucumber HEADLESS='' staff_features/
```

## Linters

Deze testsuite gebruikt twee linters, [`cuke_linter`](https://github.com/enkessler/cuke_linter) en [`rubocop`](https://rubocop.org/), om de codekwaliteit te bewaken.

```sh
# Lints Cucumber .feature files
bundle exec cuke_linter

# Lints Ruby .rb files
bundle exec rubocop
```

## Integratie met de editor (optioneel)

ArchivesSpace biedt optionele VS Code-werkruimtetaken waarmee u de end-to-endtestsuite kunt uitvoeren zonder handmatig omgevingsvariabelen in te stellen of van map te wisselen.

Deze taken voeren dezelfde cucumber-opdrachten uit als hierboven beschreven en zijn slechts een handige aanvulling op de beschreven workflow via de opdrachtregel.

De installatie-instructies staan in de **VS Code-handleiding** [hier](https://docs.archivesspace.org/development/vscode/).

Bijdragers die VS Code niet gebruiken, kunnen dit onderdeel overslaan en de tests rechtstreeks vanaf de opdrachtregel uitvoeren.
