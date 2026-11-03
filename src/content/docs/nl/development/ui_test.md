---
title: UI-tests
description: Instructies voor het uitvoeren van geautomatiseerde browsertests met Selenium op de ArchivesSpace-interface, zowel in Firefox als in Chrome.
---

De medewerkersinterface en publieke gebruikersinterface van ArchivesSpace gebruiken [Selenium](http://docs.seleniumhq.org/) voor geautomatiseerde browsertests. Deze tests kunnen worden uitgevoerd met [Firefox via geckodriver](https://firefox-source-docs.mozilla.org/testing/geckodriver/geckodriver/index.html) en [Chrome](https://sites.google.com/a/chromium.org/chromedriver/home) (de gewone versie van Chrome of Chrome in headlessmodus).

## UI-tests met Firefox (standaard)

Firefox is de standaardbrowser in onze [CI-workflows](https://github.com/archivesspace/archivesspace/actions).

In Ubuntu Linux 22.04 en hoger is het meegeleverde Firefox-debpakket een overgangspakket dat Firefox in feite via [snap](https://snapcraft.io/) installeert. Snap heeft beveiligingsbeperkingen die zonder extra configuratie niet werken bij geautomatiseerde tests.

Verwijder het Firefox-snap-pakket en installeer Firefox opnieuw als een traditioneel deb-pakket in Ubuntu Linux:

```bash
# remove old snap firefox package (if installed)
sudo snap remove firefox

# create a keyring directory (if not existing)
sudo install -d -m 0755 /etc/apt/keyrings

# download mozilla key and add it to the keyring
wget -q https://packages.mozilla.org/apt/repo-signing-key.gpg -O- | sudo tee /etc/apt/keyrings/packages.mozilla.org.asc > /dev/null

# set high priority for the mozilla pakcages
echo "deb [signed-by=/etc/apt/keyrings/packages.mozilla.org.asc] https://packages.mozilla.org/apt mozilla main" | sudo tee -a /etc/apt/sources.list.d/mozilla.list > /dev/null
echo '
Package: *
Pin: origin packages.mozilla.org
Pin-Priority: 1000
' | sudo tee /etc/apt/preferences.d/mozilla

# install firefox
sudo apt update && sudo apt install firefox
```

Wanneer u Firefox gebruikt, moet u controleren of de versie van geckodriver die u gebruikt compatibel is met uw Firefox-versie. Raadpleeg hiervoor deze [compatibiliteitstabel](https://firefox-source-docs.mozilla.org/testing/geckodriver/Support.html). U kunt de geïnstalleerde Firefox-versie opvragen met: `firefox --version`.

Op Linux kunt u [hier](https://github.com/mozilla/geckodriver/releases) de geckodriver-versie downloaden die overeenkomt met uw Firefox-versie.

Op een Mac kunt u `brew install geckodriver` gebruiken.

## UI-tests met Chrome

Als u Chrome wilt gebruiken, moet u eerst het juiste [ChromeDriver-uitvoerbare bestand
downloaden](https://sites.google.com/a/chromium.org/chromedriver/downloads)
en dit op een locatie in het systeempad van uw besturingssysteem plaatsen. Mac-gebruikers met Homebrew kunnen dit doen met `brew cask install chromedriver`.

**Let op: om deze tests uit te voeren, moet Firefox of Chrome op uw systeem zijn geïnstalleerd. Raadpleeg de documentatie van [Firefox WebDriver](https://developer.mozilla.org/en-US/docs/Web/WebDriver)
of [ChromeDriver](https://sites.google.com/a/chromium.org/chromedriver/home)
om te controleren of uw Selenium-, driver-, browser- en besturingssysteemversies bij elkaar passen en compatibel zijn.**

## Voorbereiding:

Voer de bootstrap-buildtaak uit om JRuby en alle vereiste afhankelijkheden te configureren:

```bash
$ cd ..
$ build/run bootstrap
```

Opmerking: in alle codevoorbeelden wordt ervan uitgegaan dat u vanuit de projectmap van ArchivesSpace werkt.

## De tests uitvoeren:

```bash
#Frontend tests
./build/run frontend:selenium # Firefox, headless
FIREFOX_OPTS= ./build/run frontend:selenium # Firefox, no-opts = heady

SELENIUM_CHROME=true ./build/run frontend:selenium # Chrome, headless
SELENIUM_CHROME=true CHROME_OPTS= ./build/run frontend:selenium # Chrome, no-opts = heady

#Public tests
./build/run public:test # Firefox, headless
FIREFOX_OPTS= ./build/run public:test # Firefox, no-opts = heady

SELENIUM_CHROME=true ./build/run public:test # Chrome, headless
SELENIUM_CHROME=true CHROME_OPTS= ./build/run public:test # Chrome, no-opts = heady
```

U kunt tests beperken tot specifieke bestanden of groepen:

```bash
./build/run .. -Dspec='path/to/spec/from/spec/directory' # single file
./build/run .. -Dexample='[description from it block]' # specific block

#EXAMPLES
./build/run frontend:selenium -Dexample='Repository model'
FIREFOX_OPTS= ./build/run frontend:selenium -Dexample='Repository model'# Firefox, heady

./build/run public:test -Dspec='features/accessibility_spec.rb'
SELENIUM_CHROME=true CHROME_OPTS= ./build/run public:test -Dspec='features/accessibility_spec.rb' # Chrome, heady
```

Voor de tests moeten een backend en een frontendservice actief zijn. Om de overhead van het starten en stoppen ervan tijdens het ontwikkelen te vermijden, kunt u tests uitvoeren tegen een ontwikkelbackend:

```bash
# start mysql and solr containers:
docker-compose -f docker-compose-dev.yml up

# start services:
 supervisord -c supervisord/archivesspace.conf

# run a spec using the started backend:
ASPACE_TEST_BACKEND_URL='http://localhost:4567' ./build/run frontend:test -Dpattern="./features/events_spec.rb"

# run all examples that contain "can spawn" in their description:
./build/run frontend:test -Dpattern="./features/accessions_spec.rb" -Dexample="can spawn"
```

Sommige tests zijn echter afhankelijk van een reeks geordende stappen en kunnen mogelijk niet altijd afzonderlijk worden uitgevoerd. In dat geval kunnen er meer voorbeelden worden uitgevoerd dan het gegeven voorbeeld en/of kunnen onverwachte fouten optreden.

### Opgeslagen pagina's bij mislukte specs

Wanneer frontend-specs mislukken, worden voor elk mislukt voorbeeld een schermafbeelding en een HTML-pagina opgeslagen in `frontend/tmp/capybara`. In CI is voor elke mislukte CI-taak een zipbestand beschikbaar onder Samenvatting -> Artefacten. Om de assets te laden (en geen gewone HTML weer te geven) wanneer u de opgeslagen HTML-pagina's bekijkt, moet er lokaal een ontwikkelserver actief zijn op poort 3000. Zie [Een ontwikkelversie van ArchivesSpace uitvoeren](/development/dev).

### De testdatabase actueel houden

Wanneer u `./build/run frontend:test` uitvoert om frontend-specs uit te voeren, worden de volgende stappen uitgevoerd voordat de specs zelf starten:

- Alle tabellen van de testdatabase worden verwijderd: `./build/run db:nuke:test`
- `frontend/spec/fixtures/archivesspace-test.sql` wordt in de testdatabase geladen: `./build/run db:load:test`
- Alle migraties die nog niet zijn toegepast, worden uitgevoerd: `./build/run db:migrate:test`

#### De database-dump van de testdatabase bijwerken

Als er migraties worden toegepast wanneer u een of meer frontend-specs uitvoert, betekent dit dat de database-dump van de testdatabase `frontend/spec/fixtures/archivesspace-test.sql` verouderd is. U kunt een nieuwe database-dump van de testdatabase maken met:

```bash
./build/run db:nuke:test
./build/run db:load:test
./build/run db:migrate:test
./build/run db:dump:test
```

Er wordt een bijgewerkt bestand `frontend/spec/fixtures/archivesspace-test.sql` gemaakt dat kan worden vastgelegd en naar een pullrequest kan worden gepusht.
