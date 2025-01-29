---
title: Running with Docker
---

## Docker images

Starting with v4.0.0 ArchivesSpace officially supports using [Docker](https://www.docker.com/) as the easiest way to get up and running. Docker eases installing, upgrading, starting and stopping ArchivesSpace. It also makes it easy to setup ArchivesSpace as a system service that starts automatically on every reboot.

If you prefer not to use Docker, another (more involved) way to get ArchivesSpace up and running is installing the latest [distribution `.zip` file](/getting_started/zip_distribution).

ArchivesSpace Docker images are available on the [Docker hub](https://hub.docker.com/u/archivesspace).

- main application images are built from [this Dockerfile](https://github.com/archivesspace/archivesspace/blob/master/Dockerfile)
- solr images are built from [this Dockerfile](https://github.com/archivesspace/archivesspace/blob/master/solr/Dockerfile)

## Installing

### System requirements

See [System Requirements](/administration/getting_started/#system-requirements).

### Software Dependencies

When using Docker, the only software dependency is [Docker](https://www.docker.com/) itself. Follow the [instructions](https://docs.docker.com/get-started/get-docker/) to install the Docker engine.
Optionally installing [Docker Desktop](https://www.docker.com/products/docker-desktop/) provides a graphical way to manage, start and stop your docker containers, easily review the container logs etc.

### Downloading the configuration package

To run ArchivesSpace with Docker, first download the ArchivesSpace docker configuration package of the latest release from [github](https://github.com/archivesspace/archivesspace/releases) (scroll down to the "Assets" section of the latest release page).

The downloaded configuration package contains a simple yet configurable and production ready docker-based setup intended to run on a single computer.

Unzipping the downloaded file will create an `archivesspace` directory with the following contents:

```

.
├── backups
├── config
│   └── config.rb
├── plugins
├── proxy-config
│   └── default.conf
├── sql
├── docker-compose.yml
└── .env
```

- The `backups` directory is first created once you start the application and it will contain the automatically performed backups of the database. See [Automated Backups section](#automated-database-backups).
- `config/config.rb` file contains the [main configuration](/customization/configuration/) of ArchivesSpace.
- The `plugins` directory is there to accommodate additional ArchivesSpace [plugins](/customization/plugins/)
- `proxy-config/default.conf` contains the configuration of the bundled `nginx` see also [proxy configuration](#proxy-configuration).
- In the `sql` directory you can put your `.sql` database dump file to initialize the new database, see [next section](migrating-from-the-zip-distribution-to-docker).
- `docker-compose.yml` contains all the information required by Docker to build and run ArchivesSpace.
- `.env` contains configuration of the docker containers including:
  - Credentials used by archivespace to access its MySQL database. It is recommended to change the default root and user passwords to something safer.
  - The database connection URI which should also be [updated accordingly](/customization/configuration/#database-config) after the database user password is updated in the step above.

## Migrating from the zip distribution to docker

If you are currently running ArchivesSpace using the zip file distribution, you can start using Docker instead.

### Create a backup of your ArchivesSpace instance database

Use `mysqldump` to create a dump of your MySQL database:

```
mysqldump -uroot -p123456 -h 127.0.0.1 archivesspace > /tmp/db.$(date +%F.%H%M%S).sql
```

Follow the steps under the [Backup and recovery](/administration/backup/) section if you need more instructions on how create backups of your MySQL database.

### Initialize and migrate the database on Docker

Copy your `.sql` database dump file created above in the `sql` directory of your unzipped Docker configuration package. Make sure the filename includes the `.sql` extension. The file should be in plain text format (not zipped).
Docker will pick it up when it starts for the first time and restore the dump to your new database.

If you created the dump on an earlier ArchivesSpace version, the system will apply any pending database migrations to upgrade your database to the ArchivesSpace version you are currently running on Docker.

## Running

### Start

Open a terminal, change to the `archivespace` directory that contains the `docker-compose.yml` file and run:

```
docker compose up --detach
```

The first time you start ArchivesSpace with Docker, the container images will be downloaded and configuration steps such as database setup and solr index initialization will be performed automatically.
It is expected that the whole process takes up to ten or even more minutes depending on the power of your machine and internet connection speed. **Note** if you are migrating from using the zip distribution to Docker and have already copied a dump of your database in the `sql` directory, initialization of the database and indexing it in solr can take a long time depending on the size of your data.

Starting with the `--detach` option allows closing the terminal without stopping ArchivesSpace. Viewing the logs of running ArchivesSpace containers is possible in [Docker Desktop](https://www.docker.com/products/docker-desktop/) or in a terminal with:

```
docker compose logs --follow
```

Watch the logs for the welcome message:

```
2024-12-04 18:42:17 archivesspace  | ************************************************************
2024-12-04 18:42:17 archivesspace  |   Welcome to ArchivesSpace!
2024-12-04 18:42:17 archivesspace  |   You can now point your browser to http://localhost:8080
2024-12-04 18:42:17 archivesspace  | ************************************************************
```

Using the default proxy configuration, the Public User interface becomes available at http://localhost/ and the Staff User Interface at: http://localhost/staff/ (default login with: admin / admin)

If you have also [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed, you can use it to start, stop and manage the ArchivesSpace containers after they have been created for the first time. At the time of writing this, there is no way to call `docker compose` using Docker Desktop, it has to be called on a terminal as described above.

### Stop

The following commands need to run from `archivespace` directory that contains the `docker-compose.yml` file. You can stop running containers (without deleting) them with the command:

```
docker compose stop
```

They can be started again with:

```
docker compose up --detach
```

## Automated database backups

The Docker configuration package includes a mechanism that will perform periodic backups of your MySQL database, using: [databacker/mysql-backup](https://github.com/databacker/mysql-backup). It is by default configured to perform a dump every two hours. See [configuration](https://github.com/databacker/mysql-backup/blob/master/docs/configuration.md) for more options.

## Proxy Configuration

The Docker configuraiton package includes an `nginx` based proxy that is by default binding on port 80 of the host machine (see `NGINX_PORT` variable in `.env` file). See `proxy-config/default.conf` and the [nginx docker page](https://hub.docker.com/_/nginx) for more configuration options.
