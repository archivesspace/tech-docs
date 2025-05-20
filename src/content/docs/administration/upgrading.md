---
title: Upgrading when using the zip distribution
---

If you have installed ArchivesSpace using the Docker Configuration Package, refer to [upgrading with Docker](/administration/docker/#upgrading). If you have installed ArchivesSpace using the zip distribution, read on! (In case you do not know what the difference is, see the [getting started page](/administration/getting_started/#two-ways-to-get-up-and-running)).

You can upgrade most versions of ArchivesSpace to a later version using these general instructions. Typically you do not need to progress through other versions of ArchivesSpace to get to a later one, unless there are special considerations for a specific version. Special considerations for these versions are noted here and in release notes.

- **[Special considerations when upgrading to v1.1.0](/administration/upgrading_1_1_0)**
- **[Special considerations when upgrading to v1.1.1](/administration/upgrading_1_1_1)**
- **[Special considerations when upgrading from v1.4.2 to 1.5.x (these considerations also apply when upgrading from 1.4.2 to any version through 2.0.1)](/administration/upgrading_1_5_0)**
- **[Special considerations when upgrading to 2.1.0](/administration/upgrading_2_1_0)**
- **[Changing to external Solr when upgrading to 3.2.0 or later versions](https://docs.archivesspace.org/provisioning/solr/).**

## Create a backup of your ArchivesSpace instance

You should make sure you have a working backup of your ArchivesSpace
installation before attempting an upgrade. Follow the steps
under the [Backup and recovery section](/administration/backup) to do this.

## Unpack the new version

It's a good idea to unpack a fresh copy of the version of
ArchivesSpace you are upgrading to. This will ensure that you are
running the latest versions of all files. In the examples below,
replace the lower case x with the version number updating to. For example,
1.5.2 or 1.5.3.

For example, on Mac OS X or Linux:
```shell
$ mkdir archivesspace-1.5.x
$ cd archivesspace-1.5.x
$ curl -LJO https://github.com/archivesspace/archivesspace/releases/download/v1.5.x/archivesspace-v1.5.x.zip
$ unzip -x archivesspace-v1.5.x.zip
```
( The curl step is optional and simply downloads the distribution from github. You can also
simply download the zip file in your browser and copy it to the directory )

On Windows, you can do the same by extracting ArchivesSpace into a new
folder you create in Windows Explorer.

## Shut down your ArchivesSpace instance

To ensure you get a consistent copy, you will need to shut down your
running ArchivesSpace instance now.

## Copy your configuration and data files

You will need to bring across the following files and directories from
your original ArchivesSpace installation:

- the `data` directory (see **Indexes note** below)
- the `config` directory (see **Configuration note** below)
- your `lib/mysql-connector*.jar` file (if using MySQL)
- any plugins and local modifications you have installed in your `plugins` directory

For example, on Mac OS X or Linux:
```shell
$ cd archivesspace-1.5.x/archivesspace
$ cp -a /path/to/archivesspace-1.4.2/archivesspace/data/* data/
$ cp -a /path/to/archivesspace-1.4.2/archivesspace/config/* config/
$ cp -a /path/to/archivesspace-1.4.2/archivesspace/lib/mysql-connector* lib/
$ cp -a /path/to/archivesspace-1.4.2/archivesspace/plugins/local plugins/
$ cp -a /path/to/archivesspace-1.4.2/archivesspace/plugins/wonderful_plugin plugins/
```
Or on Windows:
```
$ cd archivesspace-1.5.x\archivesspace
$ xcopy \path\to\archivesspace-1.4.2\archivesspace\data\* data /i /k /h /s /e /o /x /y
$ xcopy \path\to\archivesspace-1.4.2\archivesspace\config\* config /i /k /h /s /e /o /x /y
$ xcopy \path\to\archivesspace-1.4.2\archivesspace\lib\mysql-connector* lib /i /k /h /s /e /o /x /y
$ xcopy \path\to\archivesspace-1.4.2\archivesspace\plugins\local plugins\local /i /k /h /s /e /o /x /y
$ xcopy \path\to\archivesspace-1.4.2\archivesspace\plugins\wonderful_plugin plugins\wonderful_plugin /i /k /h /s /e /o /x /y
```
Note that you may want to preserve the logs file (`logs/archivesspace.out`
by default) from your previous installation--just in case you need to
refer to it later.

### Configuration note

Sometimes a new release of ArchivesSpace will introduce new
configuration settings that weren't present in previous releases.
Before you replace the distribution `config/config.rb` with your
original version, it's a good idea to review the distribution version
to see if there are any new configuration settings of interest.

Upgrade notes will generally draw attention to any configuration
settings you need to set explicitly, but you never know when you'll
discover a new, exciting feature! Documentation might also refer to
uncommenting configuration options that won't be in your file if you
keep your older version.

### Indexes note

Sometimes a new release of ArchivesSpace will require a FULL reindex
which means you do not want to copy over anything from your data directory
to your new release. The data directory contains the indexes created by Solr.
Check the release notes of the new version for any details about reindexing and
the [recreating indexes section](/administration/indexes/) for instructions on recreating indexes.

## Transfer your locales data

If you've made modifications to you locales file ( en.yml ) with customized
labels, titles, tooltips, etc., you'll need to transfer those to your new
locale file.

A good way to do this is to use a Diff tool, like Notepad++, TextMate, or just
Linux diff command:
```shell
$ diff /path/to/archivesspace-1.4.2/locales/en.yml /path/to/archivesspace-1.5.x/archivesspace/locales/en.yml
$ diff /path/to/archivesspace-1.4.2/locales/enums/en.yml /path/to/archivesspace-v1.5.x/archivesspace/locales/enums/en.yml
```
This will show you the differences in your current locales files, as well as the
new additions in the new version locales files. Simply copy the values you wish
to keep from your old ArchivesSpace locales to your new ArchivesSpace locales/provisioning/solr/#copy-the-config-files
files.

## Run the database migrations

With everything copied, the final step is to run the database
migrations. This will apply any schema changes and data migrations
that need to happen as a part of the upgrade. To do this, use the
`setup-database` script for your platform. For example, on Mac OS X
or Linux:
```shell
$ cd archivesspace-1.5.x/archivesspace
$ scripts/setup-database.sh
```
Or on Windows:
```shell
$ cd archivesspace-1.5.x\archivesspace
$ scripts\setup-database.bat
```
## Solr configuration updates

If the release you are upgrading to includes updates in the solr schema or other configuration files (see the release notes)
and you're using external Solr (required beginning with version 3.2.0), you will need to update the solr schema and configuration files
accordingly, by [copying the solr configuration files](/provisioning/solr/#copy-the-config-files) from the release package to your external solr configuration.
See also the [Full instructions for using external Solr with ArchivesSpace](/provisioning/solr).

## If you've deployed to Tomcat

The steps to deploy to Tomcat are esentially the same as in the
[archivesspace_tomcat](https://github.com/archivesspace-labs/archivesspace_tomcat)

But, prior to running your setup-tomcat script, you'll need to be sure to clean out the
any libraries from the previous ASpace version from your Tomcat classpath.

     1. Stop Tomcat
     2. Unpack your new version of ArchivesSpace
     3. Configure your MySQL database in the config.rb ( just like in the
        install instructions )
     4. Make sure all you other local configuration settings are in your
        config.rb file ( check your Tomcat conf/config.rb file for your current
        settings. )
     5. Make sure you MySQL connector jar in the lib directory
     6. Run your setup-database script to migration your database.
     7. Delete all ASpace related jar libraries in your Tomcat's lib directory. These
        will include the "gems" folder, as well as "common.jar" and some
        [others](https://github.com/archivesspace/archivesspace/tree/master/common/lib).
        This will make sure your running the correct version of the dependent
        libraries for your new ASpace version.
        Just be sure not to delete any of the Apache Tomcat libraries.
     8. Run your setup-tomcat script ( just like in the install instructions ).
        This will copy all the files over to Tomcat.
     9. Start Tomcat

## That's it!

You can now start your new ArchivesSpace version as normal.
