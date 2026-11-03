---
title: Frontend-assets beheren met Bower
description: Instructies voor het toevoegen van statische bestanden aan het coreproject.
---

Dit is bedoeld voor ontwikkelaars en is alleen van toepassing op de toepassing `frontend`.

Als u statische bestanden aan het coreproject wilt toevoegen (zoals JavaScript-, CSS- en LESS-bestanden), gebruik dan `bower` om ze toe te voegen en te installeren. Zo blijft duidelijk welke bestanden zijn toegevoegd en wanneer ze moeten worden bijgewerkt.

Als u ArchivesSpace wilt helpen, kunt u de herkomst achterhalen van leveranciersbestanden die niet in bower.json zijn opgenomen en ervoor zorgen dat deze volgens dit protocol worden bijgewerkt en geïnstalleerd.

## Algemene configuratie

### Stap 1: npm installeren

Op macOS bijvoorbeeld:

```shell
brew install npm
```

### Stap 2: Bower installeren

```shell
npm install bower -g
```

### Stap 3: componenten installeren

```shell
bower install
```

## Een statisch bestand toevoegen aan de ASpace-frontend (medewerkersinterface)

### Stap 1: de component toevoegen

```shell
bower install <PACKAGE NAME> --save
```

### Stap 2: Bower aan Rails koppelen

    Edit the bower.json file to map the assets you want from bower_components
    to assets. See examples in bower.json
    This is kind of a hack to workaround:
    https://github.com/blittle/bower-installer/issues/75

### Stap 3: bestanden installeren

```shell
alias npm-exec='PATH=$(npm bin):$PATH'
npm-exec bower-installer
```

### Stap 4: bestanden in Git opnemen

Neem de geïnstalleerde bestanden op in Git. We beheren bower.json en de
geïnstalleerde bestanden met versiebeheer, maar niet de map bower_components.

## Productie!

Vergeet niet: als u bestanden toevoegt die geen extensie .js hebben, moet u
deze toevoegen aan frontend/config/environments/production.rb.
