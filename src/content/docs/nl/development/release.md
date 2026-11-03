---
title: Een uitgave bouwen
description: Hoe je een ArchivesSpace-uitgave bouwt.
---

- [Voor de uitgave](#pre-release-steps)
- [Documentatie bouwen](#build-and-publish-the-api-and-yard-docs)
- [De uitgave bouwen](#building-a-release-yourself)
- [De uitgave plaatsen met release-opmerkingen](#create-the-release-with-notes)
- [Updates na publicatie](#post-release-updates)

## Kloon de Git-repository

Bij het bouwen van een uitgave is het belangrijk om vanuit een schone repository te beginnen.
De veiligste manier om dit te garanderen is door de repository te klonen:

```shell
git clone https://github.com/archivesspace/archivesspace.git
```

## Controleer de release-branch uit en maak de release-tag aan

Als u een grote of kleine versie bouwt (zie [https://semver.org](https://semver.org)),
start u door een branch voor de uitgave en alle toekomstige patchversies aan te maken:

```shell
git checkout -b release-v1.0.x
git tag v1.0.0
```

Als u een patchversie bouwt, controleert u gewoon de bestaande branch uit en gaat u hieronder verder:

```shell
git checkout release-v1.0.x
```

Patchversies ontstaan meestal omdat er sinds de laatste grote of kleine versie een regressie
of een kritieke bug is ontstaan. We proberen ervoor te zorgen dat de "hotfix" zowel in de
master- als in de release-branch wordt samengevoegd zonder dat er commits van de ene naar de
andere branch hoeven te worden gecherry-picked. De reden is dat cherry-picking een nieuwe
commit (met een nieuwe commit-id) creëert die identieke wijzigingen bevat, wat niet optimaal is
voor de repositorygeschiedenis.

Het is daarom preferabel om vanuit de release-branch te starten bij het maken van een "hotfix"
waaraan zowel de release-branch als master moeten worden samengevoegd. De pull request moet
dan ook gebaseerd zijn op de release-branch. Nadat die pull request door code review,
QA en merge is gegaan, moet een tweede pull request worden gemaakt om de bijgewerkte
release-branch naar master te mergen.

Beschouw het volgende scenario. De huidige productie-uitgave is v1.0.0 en een kritieke
bug is ontdekt. In de tijd sinds v1.0.0 is uitgebracht, zijn er nieuwe functies
aan de master-branch toegevoegd, bedoeld voor uitgave in v1.1.0:

```shell
git checkout -b oh-no-some-migration-corrupts-some-data origin/release-v1.0.0
( fixes problem )
git commit -m "fix bad migration and add a migration to repair corrupted data"
gh pr create -B release-v1.0.x --web
( PR is reviewed and merged to the release branch)
git checkout release-v1.0.x
git pull
git tag v1.0.1
gh pr create -B master --web
( PR is reviewed and merged to the master branch)
```

## Voor de uitgave

### Voer de rake-taken van ArchivesSpace uit om problemen te controleren

Voordat u verdergaat, is het een goed idee om te controleren of er ontbrekende
vertalingen of meerdere gem-versies zijn.

1.  Bootstrap uw huidige ontwikkelomgeving op de nieuwste master-branch
    door alle afhankelijkheden te downloaden--JRuby, Gems, Solr, enz.

    ```shell
    build/run bootstrap
    ```

2.  Voer de volgende controles uit (aanbevolen):

    ```shell
    build/run rake -Dtask=check:multiple_gem_versions
    ```

3.  Als er meerdere gem-versies worden gemeld, moet dat worden aangepakt voordat u verdergaat.

## Documentatie bouwen en publiceren

API-documentatie wordt gemaakt met behulp van de submodule in `docs/slate` en Docker.
YARD-documentatie wordt gemaakt met behulp van de YARD-gem. Op dit moment behandelt het slechts
een klein percentage van de code en is het niet bijzonder nuttig.

### API-documentatie bouwen

1.  API-documentatie hangt af van de [archivesspace/slate](https://github.com/archivesspace/slate)-submodule
    en van Docker. Slate kan niet op JRuby draaien.

    ```shell
    git submodule init
    git submodule update
    ```

2.  Voer de `doc:api`-taak uit om Slate API- en YARD-documentatie te genereren. (Opmerking: de
    API-generatie vereist een databaseverbinding met standaard enumeratiewaarden.)

    ```shell
    ARCHIVESSPACE_VERSION=X.Y.Z APPCONFIG_DB_URL=$APPCONFIG_DB_URL build/run doc:api
    ```

    Dit genereert `docs/slate/source/index.html.md` (Slate-brondocument).

3.  (Optioneel) Start een docker-container om de API-documentatie te bekijken.

    ```shell
    docker-compose -f docker-compose-docs.yml up
    ```

    Bezoek `http://localhost:4568` om de API-documentatie te bekijken.

4.  Bouw de statische API-bestanden. Het API-markdown-document zou al in `docs/slate/source` aanwezig moeten zijn (stap 2 hierboven).
    Het API-markdown wordt naar HTML gerenderd en verplaatst naar `docs/build/api`.
    ```shell
    docker run --rm --name slate -v $(pwd)/docs/build/api:/srv/slate/build -v $(pwd)/docs/slate/source:/srv/slate/source slatedocs/slate build
    ```

### YARD-documentatie bouwen

1.  Bouw de YARD-documentatie in de `docs/build/doc`-directory:

    ```shell
    ./build/run doc:yardoc
    ```

### Bouw de documenten en zet ze in GitHub Pages

1.  Controleer nogmaals of u zich op een release-branch bevindt (we hebben dit niet nodig in master). Commit de nieuw gebouwde documentatie en zet deze alleen in de `gh-pages`-branch:

    ```shell
    git add docs/build
    git commit -m "release-vx.y.z api and yard documentation"
    ```

    Gebruik `git subtree` om de documentatie naar de `gh-pages`-branch te pushen:

    ```shell
    git subtree push --prefix docs/build origin gh-pages
    ```

    Gepubliceerde documenten zouden een korte tijd later verschijnen op:
    [http://archivesspace.github.io/archivesspace/api](http://archivesspace.github.io/archivesspace/api)
    [http://archivesspace.github.io/archivesspace/doc](http://archivesspace.github.io/archivesspace/doc)

    Opmerking: als de push-opdracht mislukt, moet u mogelijk `gh-pages` in de externe repository verwijderen:

    ```shell
    git push origin :gh-pages
    ```

    **Opmerking:** push de map `docs/build` niet naar de release-branch, omdat deze alleen bedoeld is om in de `gh-pages`-branch te worden onderhouden.

## De uitgave zelf bouwen

1.  Het bouwen van de daadwerkelijke uitgave is erg eenvoudig. Voer het volgende uit:

    ```shell
    ./scripts/build_release vX.X.X
    ```

    Vervang X.X.X door het versienummer. Hierdoor wordt een uitgave gebouwd en verpakt
    in een zip-bestand.

## De uitgave bouwen op GitHub

1.  Het is niet nodig om de uitgave zelf te bouwen. Push gewoon uw tag naar GitHub
    en trigger de `release`-workflow:
    ```shell
    git push vX.X.X
    ```
    Vervang X.X.X door het versienummer. De uitgave wordt gemaakt als een **concept**, deze wordt niet automatisch gepubliceerd.

## De uitgave met release-opmerkingen aanmaken

### Bouw de release-opmerkingen

**Vanaf v3.4.0 is het niet langer nodig om release-opmerkingen handmatig te bouwen.**

Om release-opmerkingen handmatig te genereren:

Maak een deploy-token aan op uw [GitHub-ontwikkelaarsinstellingen](https://github.com/settings/tokens).

```shell
export GITHUB_TOKEN={YOUR DEPLOYMENT TOKEN ON GITHUB}
./build/run doc:release_notes -Dcurrent_tag=v3.4.0 -Doutfile=RELEASE_NOTES.md -Dtoken=$GITHUB_TOKEN
```

#### Releasepagina indien nodig bewerken

Als er speciale overwegingen zijn, voeg deze dan handmatig toe aan de releasepagina. Speciale overwegingen
kunnen onder meer wijzigingen omvatten die vereisen dat derdepartijplug-ins moeten worden bijgewerkt of dat
een volledige herindexering vereist is.

Voorbeeldinhoud:

```md
This release requires a **full reindex** of ArchivesSpace for all functionality to work
correctly. Please follow the [instructions for reindexing](/administration/indexes)
before starting ArchivesSpace with the new version.
```

## Updates na publicatie

Nadat een uitgave is vrijgegeven, is het tijd voor onderhoud voordat de volgende
ontwikkelingscyclus weer op volle toeren draait. Houd rekening met het volgende, afhankelijk van
het huidige teamconsensus:

### Branches

Verwijder samengevoegde en verouderde branches in GitHub, zoals passend.

### Milestones

Sluit de zojuist vrijgegeven milestone, met als vervaldatum de datum van vandaag. Maak een
nieuwe milestone voor de verwachte volgende uitgave (dit kan later worden gewijzigd als de
versienummering om welke reden dan ook wordt gewijzigd).

### Testservers

Bekijk bestaande testservers en vraag om verwijdering van servers die niet langer nodig zijn
(bijvoorbeeld feature-branches die al zijn samengevoegd voor de uitgave).

### GitHub-issues

Controleer bestaande openstaande GH-issues en sluit alle issues die door de
nieuwe uitgave zijn opgelost (bij voorkeur met een specifieke PR). Voor de overige open
issues, controleer of ze nog steeds een probleem zijn, voeg labels toe, koppel ze aan bekende JIRA
issues en voeg indien nodig relevante opmerkingen toe.

### Toegankelijkheidscontrole

Voer toegankelijkheidscontroles uit voor zowel de openbare als de medewerkerswebsite en maak een ticket
aan voor nieuwe en voortdurende toegankelijkheidsfouten.

### PR-toewijzingen

Begin met het toewijzen van in de wachtrij geplaatste PR's aan leden van de Core Committers-groep,
met inachtneming van de juiste milestone voor de verwachte volgende uitgave.

### Afhankelijkheden

#### Gems

Kijk naar alle Gemfile.lock-bestanden (in backend, frontend, public,
enz.) en controleer de gem-versies. Besteed bijzondere aandacht aan de Rails & Friends
(ActiveSupport, ActionPack, enz.), Rack en Sinatra-versies en controleer of er geen
beveiligingspatchversies zijn. Dat komt meestal voor, vooral omdat Rails relatief vaak
oplossingen voor beveiligingsproblemen uitbrengt.

Om de gems bij te werken, werkt u de versie in Gemfile bij, verwijdert u Gemfile.lock en
roept u `./build/run bootstrap` aan om alles te downloaden. Controleer daarna of uw test
suite slaagt.

Zodra alles is gelukt, commit uw Gemfiles en Gemfile.lock-bestanden.
