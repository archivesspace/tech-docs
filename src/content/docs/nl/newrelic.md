---
title: Applicaties bewaken met New Relic
description: Instructies voor het instellen van New Relic voor het bewaken van ArchivesSpace-applicaties.
---

[New Relic](http://newrelic.com/) is onder meer een hulpmiddel voor het bewaken van applicatieprestaties.

**Voor gebruik met ArchivesSpace moet u:**

- Een account aanmaken bij New Relic (er is een gratis versie en er zijn betaalde abonnementen)
- config.rb aanpassen om:
  - de `newrelic`-plugin te activeren
  - de New Relic-licentiesleutel toe te voegen
  - een applicatienaam toe te voegen waarmee u de ArchivesSpace-instantie in het New Relic-dashboard kunt herkennen

Bijvoorbeeld, in config.rb:

```ruby
## You may have other plugins
AppConfig[:plugins] = ['local', 'newrelic']

AppConfig[:newrelic_key] = "enteryourkeyhere"
AppConfig[:newrelic_app_name] = "ArchivesSpace"
```

- Installeer de New Relic-agentbibliotheek door de plugin te initialiseren:

```shell
## For Linux/OSX
$ scripts/initialize-plugin.sh newrelic

## For Windows
% scripts\initialize-plugin.bat newrelic
```

- Start of herstart ArchivesSpace zodat de configuratie wordt toegepast.

Binnen enkele minuten zou de applicatie zichtbaar moeten zijn in het New Relic-dashboard en zouden er gegevens moeten worden verzameld.

---
