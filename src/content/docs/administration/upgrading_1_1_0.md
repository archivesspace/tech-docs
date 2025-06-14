---
title: Upgrading to 1.1.0
description: Special considerations when upgrading from ArchivesSpace 1.0.9 or less to 1.1.0, including the option for an external Solr instance.
---

Additional upgrade considerations specific to this release. Refer to the [upgrade documentation](/administration/upgrading) for the standard instructions that apply in all cases.

## External Solr

---

In ArchivesSpace 1.0.9 the default ports configuration was:

```ruby
AppConfig[:backend_url] = "http://localhost:8089"
AppConfig[:frontend_url] = "http://localhost:8080"
AppConfig[:solr_url] = "http://localhost:8090"
AppConfig[:public_url] = "http://localhost:8081"
```

With the introduction of the [optional external Solr instance](/provisioning/solr) functionality this has been updated to:

```ruby
AppConfig[:backend_url] = "http://localhost:8089"
AppConfig[:frontend_url] = "http://localhost:8080"
AppConfig[:solr_url] = "http://localhost:8090"
AppConfig[:indexer_url] = "http://localhost:8091" # NEW TO 1.1.0
AppConfig[:public_url] = "http://localhost:8081"
```

In most cases the default value for `indexer_url` will blend in seamlessly without you needing to take any action. However, if you modified the original values in your `config.rb` file you may need to update it. Examples:

**You use a different ports sequence**

```ruby
AppConfig[:indexer_url] = "http://localhost:9091"
```

**You run multiple ArchivesSpace instances on a single host**

Under this deployment scenario you would have changed port numbers for some (or all) instances in each `config.rb` file, so set the `indexer_url` for each instance as described above.

**You include hostnames**

```ruby
AppConfig[:indexer_url] = "http://yourhostname:8091"
```

## Clustering

---

In a clustered configuration you may need to edit `instance_[server hostname].rb` files:

```ruby
{
  ...
  :indexer_url => "http://[localhost|yourhostname]:8091",
}
```

---
