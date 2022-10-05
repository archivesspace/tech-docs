# Installing, configuring and maintaining an ArchivesSpace instance

This documentation will provide implementers and administrators with the information needed to install, configure and maintain an ArchivesSpase instance. Additional documentation is available [for developers](./readme_develop.md) and to provide [a technical overview of ArchivesSpace](./readme_evaluate.md) for evaluating technical requirements and capabilities.

> If you discover errors in the documentation, or would like to suggest or contribute additional documentation, please submit an [issue](https://github.com/archivesspace/tech-docs/issues) or [pull request](https://github.com/archivesspace/tech-docs/pulls) as appropriate.

## Installation and configuration
##security-considerations
  * [Getting started](./administration/getting_started.md)
  * [Running ArchivesSpace as a Unix daemon](./administration/unix_daemon.md)
  * [Running ArchivesSpace as a Windows service](./administration/windows.md)
  * [Configuring ArchivesSpace](./customization/configuration.md)
  * [Adding support for additional username/password-based authentication backends](./customization/authentication.md)
  * [Configuring LDAP authentication](./customization/ldap.md)
  * [Running ArchivesSpace against MySQL](./provisioning/mysql.md)
  * [Security considerations](./administration/security.md)

  
## Customization and theming
  * [ArchivesSpace Plug-ins](./customization/plugins.md)
  * [Customizing text in ArchivesSpace](./customization/locales.md)
  * [Theming ArchivesSpace](./customization/theming.md)
  * [Managing frontend assets with Bower](./customization/bower.md)
  * [Creating Custom Reports](./customization/reports.md)
  * [ArchivesSpace XSL stylesheets](./import_export/xsl_stylesheets.md)
  
## Maintenance
  * [Re-creating indexes](./administration/indexes.md)
  * [Resetting passwords](./administration/passwords.md)
  * [Upgrading](./administration/upgrading.md)
  * [Backup and recovery](./administration/backup.md)
  * [ArchivesSpace releases and database versions](./development/release_schema_versions.md)

## Advanced configuration
  * [Tuning ArchivesSpace](./provisioning/tuning.md)
  * [Running ArchivesSpace with load balancing and multiple tenants](./provisioning/clustering.md)
  * [Serving ArchivesSpace over subdomains](./provisioning/domains.md)
  * [Serving ArchivesSpace user-facing applications over HTTPS](./provisioning/https.md)
  * [Application monitoring with New Relic](./provisioning/newrelic.md)
  * [Running ArchivesSpace under a prefix](./provisioning/prefix.md)
  * [JMeter Test Group Template](./provisioning/jmeter.md)

## Migrating data from Archivists' Toolkit and Archon
  * [Archivists' Toolkit migration tool instructions](./migrations/migrate_from_archivists_toolkit.md)
  * [Archon migration tool instructions](./migrations/migrate_from_archon.md)

## Other migration resources
  * [Migration tools and data mapping](./migrations/migration_tools.md)
