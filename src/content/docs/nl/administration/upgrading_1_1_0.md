---
title: Upgraden naar 1.1.0
description: Bijzondere aandachtspunten bij het upgraden vanaf ArchivesSpace 1.0.9 of ouder naar 1.1.0, inclusief de mogelijkheid om een externe Solr-instantie te gebruiken.
---

Aanvullende aandachtspunten voor deze release. Raadpleeg de [upgradedocumentatie](/administration/upgrading) voor de standaardinstructies die in alle gevallen van toepassing zijn.

## Externe Solr

---

In ArchivesSpace 1.0.9 was de standaardpoortconfiguratie:

```ruby
AppConfig[:backend_url] = "http://localhost:8089"
AppConfig[:frontend_url] = "http://localhost:8080"
AppConfig[:solr_url] = "http://localhost:8090"
AppConfig[:public_url] = "http://localhost:8081"
```

Met de introductie van de functionaliteit voor een [optionele externe Solr-instantie](/provisioning/solr) is dit bijgewerkt naar:

```ruby
AppConfig[:backend_url] = "http://localhost:8089"
AppConfig[:frontend_url] = "http://localhost:8080"
AppConfig[:solr_url] = "http://localhost:8090"
AppConfig[:indexer_url] = "http://localhost:8091" # NEW TO 1.1.0
AppConfig[:public_url] = "http://localhost:8081"
```

In de meeste gevallen sluit de standaardwaarde voor `indexer_url` naadloos aan, zodat u niets hoeft te doen. Als u de oorspronkelijke waarden in uw `config.rb`-bestand hebt gewijzigd, moet u deze mogelijk bijwerken. Voorbeelden:

**U gebruikt een andere poortreeks**

```ruby
AppConfig[:indexer_url] = "http://localhost:9091"
```

**U voert meerdere ArchivesSpace-instanties uit op één host**

In deze implementatieopzet hebt u de poortnummers voor sommige (of alle) instanties in elk `config.rb`-bestand gewijzigd. Stel daarom voor elke instantie de `indexer_url` in zoals hierboven beschreven.

**U gebruikt hostnamen**

```ruby
AppConfig[:indexer_url] = "http://yourhostname:8091"
```

## Clusterconfiguratie

---

In een geclusterde configuratie moet u mogelijk de bestanden `instance_[server hostname].rb` bewerken:

```ruby
{
  ...
  :indexer_url => "http://[localhost|yourhostname]:8091",
}
```

---
