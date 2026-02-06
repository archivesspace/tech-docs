---
title: Getting started
description: Detailed hardware and software requirements for running ArchivesSpace, including instructions on setting up and running an ArchivesSpace instance using the latest distribution .zip file.
---

## Two ways to get up and running

### Installing on Docker

Starting with ArchivesSpace v4.0.0, the easiest - and recommended way to get up and running is [using Docker](/administration/docker/). Docker eases installing, upgrading, starting and stopping ArchivesSpace. It also makes it easy to setup ArchivesSpace as a system service that starts automatically on every reboot.

### Installing the zip distribution

The older (more involved) way to get ArchivesSpace up and running is installing the latest distribution `.zip` file. If you prefer this way, read on!

# Using the zip distribution

## System requirements

### Operating system

ArchivesSpace has been tested on Ubuntu Linux, Mac OS X, and Windows.

### Memory

At least 1024 MB RAM allocated to the application are required. We recommend using at least 2 GB for optimal performance.

## Software Requirements

### Java Runtime Environment

We recommend using [OpenJDK](https://openjdk.org/projects/jdk/). The following table lists the supported Java versions for each version of ArchivesSpace:

| ArchivesSpace version | OpenJDK version |
| --------------------- | --------------- |
| ≤ v3.5.1              | 8 or 11         |
| ≥ v4.0.0              | 11 or 17        |

### Solr

Up to ArchivesSpace v3.1.1, the zip file distribution includes an embedded Solr v4 instance, which is deprecated and not supported anymore.

ArchivesSpace v3.2.0 or above requires an external Solr instance. The table below summarizes the supported Solr versions for each ArchivesSpace version:

| ArchivesSpace version | External Solr version     |
| --------------------- | ------------------------- |
| ≤ v3.1.1              | no external solr required |
| v3.1.1 up to v3.5.1   | 8 (8.11)                  |
| ≥ v4.0.0              | 9 (9.4.1)                 |

Each ArchivesSpace version is tested for compatibility with the corresponding Solr version listed in the table above.
That version is being used during development and the ArchivesSpace automated tests run with that version. It is therefore recommended that you use that version of Solr in production.

It may be possible to use ArchivesSpace with an older version of Solr. However in that case it
is important to check the [release notes](https://github.com/archivesspace/archivesspace/releases)
for any potential version compatibility issues.

**Note: the ArchivesSpace Program Team can only provide support for Solr deployments
using the "officially" supported version with the standard configuration provided by
the application. Everything else will be treated as "best effort" community-led support.**

See [Running with external Solr](/provisioning/solr) for more information on installing and upgrading Solr.

### Database

While ArchivesSpace does include an embedded database, MySQL is required for production use.

(While not officially supported by ArchivesSpace, some community members use MariaDB so there is some community support for version 10.4.10 only.)

**The embedded database is for testing purposes only. You should use MySQL or MariaDB for any data intended for production, including data in a test instance that you intend to move over to a production instance.**

All ArchivesSpace versions can run on MySQL version 5.x or 8.x.

## Getting started

[//]: # 'This should probably be re-written for new instructions using docker'

The quickest way to get ArchivesSpace up and running is to download
the latest distribution `.zip` file from the following URL:

[https://github.com/archivesspace/archivesspace/releases](https://github.com/archivesspace/archivesspace/releases)

You will need to have Java installed on your machine. You can check your Java version by running the command:

```
java -version
```

See [above](#java-runtime-environment) for the Java version needed. If you are running an earlier version of java upgrade to one of the supported ones (not the newest one). If you are running a newer version of Java you should revert back to or force your machine to use a supported version.

When you extract the `.zip` file, it will create a directory called
`archivesspace`. Next, follow the instructions for setting up:

- [MySQL](/provisioning/mysql)
- mysql jdbc driver, see [Download MySQL Connector](/provisioning/mysql/#download-mysql-connector)
- for version 3.2 and above, [Solr](/provisioning/solr) is also required. Earlier versions provided an embedded Solr v4 instance, which is now unsupported.

**Do not proceed until MySQL and Solr are running.**

To run the system, just execute the appropriate
startup script for your platform. On Linux and OSX:

```shell
cd /path/to/archivesspace
./archivesspace.sh
```

and for Windows:

```shell
cd \path\to\archivesspace
archivesspace.bat
```

This will start ArchivesSpace running in foreground mode (so it will
shut down when you close your terminal window). Log output will be
written to the file `logs/archivesspace.out` (by default).

**Note:** If you're running Windows and you get an error message like
`unable to resolve type 'size_t'` or `no such file to load -- bundler`,
make sure that there are no spaces in any part of the path name in which the
ArchivesSpace directory is located.

### Start ArchivesSpace

The first time it starts, the system will take a minute or so to start
up. Once it is ready, confirm that ArchivesSpace is running correctly by
accessing the following URLs in your browser:

- http://localhost:8089/ -- the backend
- http://localhost:8080/ -- the staff interface
- http://localhost:8081/ -- the public interface
- http://localhost:8082/ -- the OAI-PMH server
- http://localhost:8090/ -- the Solr admin console

To start using the Staff interface application, log in using the adminstrator
account:

- Username: `admin`
- Password: `admin`

Then, you can create a new repository by selecting "System" -> "Manage
repositories" at the top right hand side of the screen. From the
"System" menu, you can perform a variety of administrative tasks, such
as creating and modifying user accounts. **Be sure to change the
"admin" user's password at this time.**
