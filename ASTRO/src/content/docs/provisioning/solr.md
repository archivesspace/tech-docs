---
title: Running ArchivesSpace with external Solr
---

For ArchivesSpace > 3.1.1 this is **required**. For previous versions it is optional.

## Supported Solr Versions

\*\*Note: ArchivesSpace does NOT currently support Solr 9. Using the latest version of Solr 8 is recommended at this time.

ArchivesSpace "officially" supports the version indicated in
[solrconfig.xml](https://github.com/archivesspace/archivesspace/blob/master/solr/solrconfig.xml#L7).
That refers to a version that is used for development and tested between release cycles.

If you are already running Solr externally using a configuration derived from a 3.1.1 or
earlier ArchivesSpace then it should continue to work, as for the transition from embedded
to external Solr the configuration files have only been updated to resolve deprecations.
To support a custom set of Solr configuration files (i.e. not the exact files provided
with an ArchivesSpace release), however, you must set `AppConfig[:solr_verify_checksums] = false` in `config.rb`.
Alternatively if you would like to use the verify checksums feature you can place a copy of your
schema and solrconfig xml files in the ArchivesSpace release `solr` directory, overwriting those
provided by ArchivesSpace.

**Note: the ArchivesSpace Program Team can only provide support for Solr deployments
using the "officially" supported version with the standard configuration provided by
the application. Everything else will be treated as "best effort" community-led support.**

## Install Solr

Refer to the [Solr documentation](https://solr.apache.org/guide/8_11/installing-solr.html)
for instructions on setting up Solr on your server.

You will download the Solr package and extract it to a folder of your choosing. Do not start Solr
until you have added the ArchivesSpace configuration files.

**We strongly recommend a standalone mode installation. No support will be provided for Solr
Cloud deployments specifically (i.e. we cannot help troubleshoot Zookeeper).**

## Create a configset

Before running Solr you will need to
setup a [configset](https://solr.apache.org/guide/8_10/config-sets.html#configsets-in-standalone-mode).

### Linux

Using the command line:

```
mkdir -p /$path/$to/$solr/server/solr/configsets/archivesspace/conf
```

Be sure to replace `/$path/$to/$solr` with your actual Solr location, which might be something like:

```
mkdir -p /opt/solr/server/solr/configsets/archivesspace/conf
```

### Windows

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

---

Copy the ArchivesSpace Solr configuration files from the `solr` directory included
with the release into the `$SOLR_HOME/server/solr/configsets/archivesspace/conf` directory.

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

Please note: if you're upgrading an existing installation of ArchivesSpace to use an external Solr, you will need to trigger a full re-index. Instructions for this are in
[Indexes](../administration/indexes.html) .

---

You can now follow the instructions in the [Getting started](../administration/getting_started.html) section to start
your ArchivesSpace application.

---
