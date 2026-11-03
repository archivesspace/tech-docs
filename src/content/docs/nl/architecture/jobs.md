---
title: Achtergrondtaken
description: Beschrijft langlopende processen in ArchivesSpace, ook wel achtergrondtaken genoemd, en hoe deze zijn opgebouwd met typen, uitvoerders en schema's. Bevat ook aanvullende richtlijnen voor het gelijktijdig uitvoeren van taken en het toevoegen van een nieuw taaktype met een plug-in.
---

ArchivesSpace biedt een mechanisme om langlopende processen asynchroon uit te
voeren. Deze processen worden `Background Jobs` genoemd.

## Taken beheren in de medewerkersinterface

Het menu `Create` bevat de optie `Background Job` met een submenu met typen
achtergrondtaken waarvoor de huidige gebruiker toestemming heeft. (Zie
hieronder voor meer informatie over taakmachtigingen en verborgen taken.) Als
de gebruiker een van deze opties selecteert, wordt een formulier geopend om de
eventuele benodigde parameters voor de taak in te voeren en deze vervolgens aan
te maken.

Wanneer een taak wordt aangemaakt, wordt deze in de `Background Job Queue`
geplaatst. Taken in de wachtrij worden uitgevoerd in de volgorde waarin ze zijn
aangemaakt. (Zie hieronder voor meer informatie over meerdere threads en
gelijktijdige taken.)

Het menu `Browse` bevat de optie `Background Jobs`. Hiermee opent de gebruiker
een lijst met taken, ingedeeld op status. De gebruiker kan vervolgens de
details van een taak bekijken en deze annuleren als die daarvoor toestemming
heeft.

## Machtigingen

Een gebruiker moet de machtiging `create_job` hebben om een taak aan te maken.
Deze machtiging is standaard opgenomen in de groep
`repository_basic_data_entry`.

Een gebruiker moet de machtiging `cancel_job` hebben om een taak te annuleren.
Deze machtiging is standaard opgenomen in de groep `repository_managers`.

Wanneer een taakuitvoerder wordt geregistreerd, kan deze aanvullende
machtigingen voor het aanmaken en annuleren opgeven. (Zie hieronder voor meer
informatie.)

## Typen, uitvoerders en schema's

Elke taak heeft een type en elk type heeft een geregistreerde uitvoerder om
taken van dat type uit te voeren, en een JSONModel-schema waarin de parameters
worden gedefinieerd.

#### Geregistreerde taakuitvoerders

Alle taken van een type worden verwerkt door een geregistreerde `JobRunner`.
De klassen van taakuitvoerders staan hier:

```
backend/app/lib/job_runners/
```

Het is mogelijk om aanvullende taakuitvoerders te definiëren in een plug-in.
(Zie hieronder voor meer informatie over plug-ins.)

Een klasse voor taakuitvoerders moet een subklasse zijn van `JobRunner`, zich
registreren voor het uitvoeren van een of meer taaktypen en een methode
`#run` implementeren voor de taken die deze afhandelt.

Wanneer een taakuitvoerder zich registreert voor een taaktype, kan deze enkele
opties instellen:

- `:hidden`
  - Standaardwaarde: `false`
  - Als deze optie is ingesteld, wordt dit taaktype niet weergegeven in de lijst met beschikbare taaktypen.
- `:run_concurrently`
  - Standaardwaarde: `false`
  - Als deze optie is ingesteld op true, kan meer dan één taak van dit type tegelijkertijd worden uitgevoerd.
- `:create_permissions`
  - Standaardwaarde: `[]`
  - Een machtiging of lijst met machtigingen die nodig zijn naast `create_job` om taken van dit type aan te maken.
- `:cancel_permissions`
  - Standaardwaarde: `[]`
  - Een machtiging of lijst met machtigingen die nodig zijn naast `cancel_job` om taken van dit type te annuleren.

Zie de superclass `JobRunner` voor meer informatie over het definiëren van een
taakuitvoerder:

```
backend/app/lib/job_runner.rb
```

#### JSONModel-schema's

Voor een taaktype is ook een JSONModel-schema nodig dat de parameters
definieert voor het uitvoeren van een taak van dat type. De naam van het schema
moet overeenkomen met het type waarvoor de uitvoerder zich registreert.
Bijvoorbeeld:

```
common/schemas/import_job.rb
```

Dit schema voor `JSONModel(:import_job)` definieert de parameters voor het
uitvoeren van een taak van het type `import_job`.

## Gelijktijdigheid

ArchivesSpace kan zo worden geconfigureerd dat er meer dan één achtergrondtaak
tegelijk wordt uitgevoerd. Standaard zijn er twee threads beschikbaar om
achtergrondtaken uit te voeren. De configuratie ziet er als volgt uit:

```
AppConfig[:job_thread_count] = 2
```

De `BackgroundJobQueue` start dit aantal threads bij het opstarten. Deze
threads controleren vervolgens op taken in de wachtrij en voeren deze uit.

Wanneer een taakuitvoerder zich registreert, kan deze een optie met de naam
`:run_concurrently` instellen. Deze is standaard `false`. Als de optie is
ingesteld op `false`, voert een taakthread geen taak uit als er al een taak van
hetzelfde type wordt uitgevoerd. De taak blijft in de wachtrij staan en wordt
uitgevoerd zodra er geen taken van dat type meer actief zijn.

Als de optie is ingesteld op `true`, wordt een taak uitgevoerd zodra deze
vooraan in de wachtrij komt, ongeacht of er al een taak van hetzelfde type
wordt uitgevoerd.

## Plug-ins

Het is mogelijk om met een plug-in een nieuw taaktype toe te voegen. ArchivesSpace
bevat een plug-in die laat zien hoe dit werkt:

```
plugins/jobs_example
```
