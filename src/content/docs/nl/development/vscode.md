---
title: De VS Code-editor gebruiken
description: Instructies voor het gebruik van de VS Code-editor met ArchivesSpace, inclusief vereisten en configuratie.
---

ArchivesSpace biedt een [instellingenbestand voor VS Code](https://github.com/archivesspace/archivesspace/blob/master/.vscode/settings.json) waarmee bijdragers die VS Code gebruiken eenvoudig de codestijl van het project kunnen volgen en met de end-to-endtests kunnen werken. Met deze toolchain in uw editor kunt u fouten in de codeopmaak en linterfouten oplossen _voordat_ u bestanden commit of tests uitvoert. In veel gevallen worden dergelijke fouten automatisch opgelost wanneer het bestand waaraan u werkt, wordt opgeslagen. Fouten die niet automatisch kunnen worden opgelost, worden gemarkeerd met golvende lijnen. Als u de aanwijzer boven deze lijnen houdt, wordt een beschrijving van de fout weergegeven die u helpt een oplossing te vinden.

## Vereisten

1. [Node.js](https://nodejs.org)
2. [Ruby](https://www.ruby-lang.org/)
3. [VS Code](https://code.visualstudio.com/)

## VS Code instellen

### Systeemafhankelijkheden toevoegen

1. [ESLint](https://eslint.org/)
2. [Prettier](https://prettier.io/)
3. [Rubocop](https://rubocop.org/)
4. [Stylelint](https://stylelint.io/)

#### Rubocop

```bash
gem install rubocop
```

Zie https://docs.rubocop.org/rubocop/installation.html voor meer informatie, onder andere over het gebruik van Bundler.

#### ESLint, Prettier, Stylelint

Voer de volgende opdracht uit vanuit de hoofdmap van ArchivesSpace.

```bash
npm install
```

Zie [package.json](https://github.com/archivesspace/archivesspace/blob/master/package.json) voor meer informatie over hoe deze tools in ArchivesSpace worden gebruikt.

### VS Code-extensies toevoegen

Voeg de volgende extensies toe via het opdrachtpalet van VS Code of het deelvenster Extensies. (Zie deze [documentatie over het installeren en beheren van extensies](https://code.visualstudio.com/learn/get-started/extensions)).

1. [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) (dbaeumer.vscode-eslint)
2. [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) (esbenp.prettier-vscode)
3. [Ruby Rubocop Revised](https://marketplace.visualstudio.com/items?itemName=LoranKloeze.ruby-rubocop-revived) (LoranKloeze.ruby-rubocop-revived)
4. [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) (stylelint.vscode-stylelint)

Optioneel — voor betere ondersteuning bij het werken met de end-to-endtests:

5. [Cucumber](https://marketplace.visualstudio.com/items?itemName=CucumberOpen.cucumber-official) (CucumberOpen.cucumber-official) — zie [Integratie van end-to-endtests](#integratie-van-end-to-endtests), met name de navigatie naar stapdefinities.

Het is belangrijk om te weten dat deze extensies samenwerken met het [instellingenbestand voor VS Code](https://github.com/archivesspace/archivesspace/blob/master/.vscode/settings.json). Deze instellingen zijn daarom alleen van invloed op uw ArchivesSpace-werkruimte in VS Code, niet op uw algemene gebruikersinstellingen voor VS Code.

De extensies zouden nu direct moeten werken: ze geven foutmeldingen en corrigeren fouten die kunnen worden opgelost automatisch wanneer u een bestand opslaat!

### Integratie van end-to-endtests

De ArchivesSpace-repository bevat een optionele VS Code-werkruimteconfiguratie die de Cucumber-end-to-endtestsuite met de editor integreert. De bestanden [`.vscode/example.tasks.json`](https://github.com/archivesspace/archivesspace/blob/master/.vscode/example.tasks.json) en [`.vscode/example.settings.json`](https://github.com/archivesspace/archivesspace/blob/master/.vscode/example.settings.json) zijn standaard niet ingeschakeld, zodat ze uw persoonlijke editorconfiguratie niet overschrijven.

**De taken inschakelen**

Kopieer het voorbeeldbestand met taken naar `.vscode/tasks.json`. Hiermee voegt u een taak toe die de e2e-testsuite uitvoert met de juiste werkmap, Ruby-omgeving en omgevingsvariabelen. Voer de taak uit via **Terminal → Run Task… → Cucumber: Run e2e-test** (dezelfde opdracht als in de [documentatie voor e2e-tests](/development/e2e_tests)). U kunt desgewenst een pad naar een featurebestand opgeven, `file.feature:line`.

**Naar stapdefinities navigeren**

Voeg de inhoud van `example.settings.json` samen met uw bestaande `.vscode/settings.json` (vervang het bestaande bestand niet, maar voeg de Cucumber-gerelateerde instellingen samen als u deze wilt gebruiken, zodat uw huidige werkruimte-instellingen behouden blijven).

Hiermee configureert u de Cucumber-extensie voor `e2e-tests/**/*.feature` en gedeelde Ruby-stapdefinities, zodat u naar definities kunt navigeren, ongedefinieerde stappen kunt detecteren en gedeelde stappen kunt vinden. Dit maakt het eenvoudiger om nieuwe end-to-endtests bij te dragen.
