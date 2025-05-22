---
title: External Solr
description: Instructions for installing and using external Solr with ArchivesSpace.
---

:::note
For ArchivesSpace > 3.1.1, external Solr is **required**. For previous versions it is optional.
:::

## Supported Solr Versions

See the [Solr requirement notes](/administration/getting_started#solr)

## Install Solr

Refer to the [Solr documentation](https://solr.apache.org/guide/solr/latest/) for instructions on setting up Solr on your server.

You will download the Solr package and extract it to a folder of your choosing. Do not start Solr
until you have added the ArchivesSpace configuration files.

**We strongly recommend a standalone mode installation. No support will be provided for Solr
Cloud deployments specifically (i.e. we cannot help troubleshoot Zookeeper).**

## Create a configset

Before running Solr you will need to
setup a [configset](https://solr.apache.org/guide/8_10/config-sets.html#configsets-in-standalone-mode).

### Create a new directory

#### Linux

Using the command line:

```
mkdir -p /$path/$to/$solr/server/solr/configsets/archivesspace/conf
```

Be sure to replace `/$path/$to/$solr` with your actual Solr location, which might be something like:

```
mkdir -p /opt/solr/server/solr/configsets/archivesspace/conf
```

#### Windows

Right click on your Solr directory and open in Windows Terminal (Powershell).

```
mkdir -p .\server\solr\configsets\archivesspace\conf
```

You should see something like this in response:

```
Directory: C:\Users\archivesspace\Projects\solr-8.10.1\server\solr\configsets\archivesspace
Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        10/25/2021  12:15 PM                conf
```

### Copy the config files

Copy the ArchivesSpace Solr configuration files from the `solr` directory included
in the zip file release into the `$SOLR_HOME/server/solr/configsets/archivesspace/conf` directory.

There should be four files:

- schema.xml
- solrconfig.xml
- stopwords.txt
- synonyms.txt

```
ls .\server\solr\configsets\archivesspace\conf\

Directory: C:\Users\archivesspace\Projects\solr-8.10.1\server\solr\configsets\archivesspace\conf

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a----        10/25/2021  12:18 PM          18291 schema.xml
-a----        10/25/2021  12:18 PM           3046 solrconfig.xml
-a----        10/25/2021  12:18 PM              0 stopwords.txt
-a----        10/25/2021  12:18 PM              0 synonyms.txt
```

_Note: your exact output may be slightly different._

## Setup the environment

When using Solr v9 or later, the use of [Solr modules](https://solr.apache.org/guide/solr/latest/configuration-guide/solr-modules.html) is required.
We recommend using the environment variable option to specify the modules to use:

```
SOLR_MODULES=analysis-extras
```

This environment variable needs to be available to the Solr instance at runtime.

For instructions on how set an environment variable here are some recommended articles:

- When using [linux](https://www.freecodecamp.org/news/how-to-set-an-environment-variable-in-linux)
- When using a [mac](https://phoenixnap.com/kb/set-environment-variable-mac)
- When using [windows](https://docs.oracle.com/cd/E83411_01/OREAD/creating-and-modifying-environment-variables-on-windows.htm#OREAD158). Note that on windows, the variable name should be: `SOLR_MODULES` and the variable value: `analysis-extras`

## Setup a Solr core

With the `configset` in place run the command to create an ArchivesSpace core:

```bash
bin/solr start
```

Wait for Solr to start (running as a non-admin user):

```
.\bin\solr start
"java version info is 11.0.12"
"Extracted major version is 11"
OpenJDK 64-Bit Server VM warning: JVM cannot use large page memory because it does not have enough privilege to lock pages in memory.
Waiting up to 30 to see Solr running on port 8983
Started Solr server on port 8983. Happy searching!
```

You can check that Solr is running on [http://localhost:8983](http://localhost:8983).

Now create the core:

```
bin/solr create -c archivesspace -d archivesspace
```

You should see confirmation:

```
"java version info is 11.0.12"
"Extracted major version is 11"

Created new core 'archivesspace'
```

In the browser you should be able to access the [ArchivesSpace schema](http://localhost:8983/solr/#/archivesspace/files?file=schema.xml).

## Disable the embedded server Solr instance (optional <= 3.1.1 only)

Edit the ArchivesSpace config.rb file:

```
AppConfig[:enable_solr] = false
```

Note that doing this means that you will have to backup Solr manually.

## Set the Solr url in your config.rb file

This config setting should point to your Solr instance:

```
AppConfig[:solr_url] = "http://localhost:8983/solr/archivesspace"
```

If you are not running ArchivesSpace and Solr on the same server, update
`localhost` to your Solr address.

By default, on startup, ArchivesSpace will check that the Solr configuration
appears to be correct and will raise an error if not. You can disable this check
by setting `AppConfig[:solr_verify_checksums] = false` in `config.rb`.

Please note: if you're upgrading an existing installation of ArchivesSpace to use an external Solr, you will need to trigger a full re-index.
See [Indexes](/administration/indexes) for more details.

---

You can now follow the instructions in the [Getting started](/administration/getting_started) section to start
your ArchivesSpace application.

---

## Upgrading Solr

If you are using an older version of Solr than is recommended you may need (if called out
in release notes) or want to upgrade. Before performing an upgrade it is recommended that you review:

- [Solr upgrade notes](https://solr.apache.org/guide/solr/latest/upgrade-notes/solr-upgrade-notes.html)
- [ArchivesSpace's release notes](https://github.com/archivesspace/archivesspace/releases)

You should also review this document as the installation steps may include
instructions that were not present in the past. For example, from Solr v9 there is a
requirement to use Solr modules with instructions to configure the modules using environment
variables.

The crucial part will be ensuring that ArchivesSpace's schema is being used for the
ArchivesSpace Solr index. The config setting `AppConfig[:solr_verify_checksums] = true`
will perform a check on startup that confirms this is the case, otherwise ArchivesSpace
will not be able to start up.

From ArchivesSpace 3.5+ `AppConfig[:solr_verify_checksums]` does not check the
`solrconfig.xml` file. Therefore you can make changes to it without ArchivesSpace failing
on startup. However, for an upgrade you will want to at least compare the ArchivesSpace
`solrconfig.xml` to the one that is in use in case there are changes that need to be made to
work with the upgraded-to version of Solr. For example the ArchivesSpace Solr v8 `solrconfig.xml`
will not work as is with Solr v9.

After upgrading Solr you should trigger a full re-index. Instructions for this are in
[Indexes](/administration/indexes).
