---
title: Running the zip distribution
---

If you prefer not to [use Docker](/getting_started/docker.md), another way to get ArchivesSpace up and running is to download the latest distribution `.zip`
file and use your own-managed Database and Solr services. This requires more effort to get all requirements in place, as explained below.

## System requirements

See [System Requirements](/getting_started/system_requirements)

## Software Dependencies

When using the zip distribution of ArchivesSpace, the following software dependencies are required:

### Java Runtime Environment

You will need to have Java installed on your machine. You can check your Java version by running the command:

     java -version

We recommend using [OpenJDK](https://openjdk.org/projects/jdk/). The following table lists the supported Java versions for each version of ArchivesSpace:

| ArchivesSpace version | OpenJDK version |
| --------------------- | --------------- |
| ≤ v3.5.1              | 8 or 11         |
| ≥ v4.0.0              | 11 or 17        |

If you are running an earlier version of java upgrade to one of the supported ones (not the newest one). If you are running a newer version of Java you should revert back to or force your machine to use a supported version.

### Solr

Up to ArchivesSpace v3.1.1, the zip file distribution includes an embedded Solr v4 instance, which is deprecated and not supported anymore.

ArchivesSpace v3.2.0 or above requires an external Solr instance. The table below summarizes the supported Solr versions for each ArchivesSpace version:

| ArchivesSpace version | External Solr version     |
| --------------------- | ------------------------- |
| ≤ v3.1.1              | no external solr required |
| v3.1.1 up to v3.5.1   | 8 (8.11)                  |
| ≥ v4.0.0              | 9 (9.4.1)                 |

Each ArchivesSpace version is tested for compatibility with the corresponding Solr version listed in the table above, both during development and automated testing.

It may be possible to use ArchivesSpace with an older version of Solr. However in that case it is important to check the [release notes](https://github.com/archivesspace/archivesspace/releases)
for any potential version compatibility issues.

**Note: the ArchivesSpace Program Team can only provide support for Solr deployments using the "officially" supported version with the standard configuration provided by
the application. Everything else will be treated as "best effort" community-led support.**

See [Running with external Solr](/provisioning/solr) for more information on installing and upgrading Solr.

### Database

While the ArchivesSpace zip distribution does include an embedded database for demonstration purposes, MySQL is required for production use. (While not officially supported by ArchivesSpace, some community members use MariaDB so there is some community support for version 10.4.10 only.)

**The embedded database is for testing purposes only. You should use MySQL or MariaDB for any data intended for production, including data in a test instance that you intend to move over to
a production instance.**

All ArchivesSpace versions can run on MySQL version 5.x or 8.x. See [MySQL](/provisioning/mysql) for detailed instructions on setting up MySQL for ArchivesSpace.

## Downloading and Installing

Once you have Java, MySQL and Solr in place, you are ready to download and install ArchivesSpace. **Do not proceed until MySQL and Solr are running.** The latest version of the ArchivesSpace zip distribution (and all older ones) are available at: [https://github.com/archivesspace/archivesspace/releases](https://github.com/archivesspace/archivesspace/releases)

When you extract the `.zip` file, it will create a directory called `archivesspace`.

It is now time to download and install the [JDBC driver for MySQL](https://docs.archivesspace.org/provisioning/mysql/#download-mysql-connector).

### Start ArchivesSpace

To run the system, just execute the appropriate startup script for your platform. On Linux and OSX:

     cd /path/to/archivesspace
     ./archivesspace.sh

and for Windows:

     cd \path\to\archivesspace
     archivesspace.bat

This will start ArchivesSpace running in foreground mode (so it will shut down when you close your terminal window). Log output will be written to the file `logs/archivesspace.out` (by default).

**Note:** If you're running Windows and you get an error message like `unable to resolve type 'size_t'` or `no such file to load -- bundler`,make sure that there are no spaces in any part of the
path name in which the ArchivesSpace directory is located.

The first time it starts, the system will take a minute or so to start up. You can then [login and verify](/getting_started/first_steps) that it is running correctly.
