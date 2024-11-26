---
title: Running with Docker
---

## Installing

The easiest way to get ArchivesSpace up and running is using [Docker](https://www.docker.com/). Docker eases installing, upgrading, starting and stopping ArchivesSpace. It also makes it easy to setup ArchivesSpace as a system service that starts automatically on every reboot.

If you prefer not to use Docker, another (more involved) way to get ArchivesSpace up and running is installing the latest [distribution `.zip` file](/getting_started/zip_distribution).

### System requirements

See [System Requirements](/getting_started/system_requirements).

### Software Dependencies

When using Docker, the only software dependency is [Docker](https://www.docker.com/) itself.

Follow the [instructions](https://docs.docker.com/get-started/get-docker/) to install the Docker engine.
Optionally installing [Docker Desktop](https://www.docker.com/products/docker-desktop/) provides a graphical way to manage, start and stop your docker containers.

### Downloading the configuration package

To run ArchivesSpace with Docker, first download the ArchivesSpace docker configuration package of the latest release from [github](https://github.com/archivesspace/archivesspace/releases) (scroll down to the "Assets" section of the latest release page).

Unzipping the downloaded file will create an `archivespace-docker-vX.X.X` directory with the following contents:

```
.
├── config
│   └── config.rb
├── docker-compose.yml
├── .env.docker.db
├── .env.docker.prod
└── plugins
```

- The `config.rb` file contains the main configuration of ArchivesSpace.
- `docker-compose.yml` contains all the information required by Docker to build and run ArchivesSpace
- `.env.docker.db` contains the credentials used by archivespace to access its MySQL database. It is recommended to default root and user passwords to something safer.
- `.env.docker.prod` contains the database connection URI which should also be updated accordingly after the database user password is updated.
- The `plugins` directory is there to accommodate any [plugins](/customization/plugins/) you wish to install.

## Running

### Start

Open a terminal, change to the `archivespace-docker-vX.X.X` directory that contains the `docker-compose.yml` file and run:

```
docker compose up --detach
```

The first time you start ArchivesSpace with Docker, the container images will be downloaded and configuration steps such as database setup and solr index initialization will be performed automatically.
It is expected that the whole process takes up to ten minutes or even more depending on the power of your machine and internet connection speed.

Starting with the `--detach` option allows closing the terminal without stoping ArchivesSpace. Viewing the logs of running ArchivesSpace containers is possible in [Docker Desktop](https://www.docker.com/products/docker-desktop/) or in a terminal with:

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

You can then [login and verify](/getting_started/first_steps) that it is running correctly.

If you have also [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed, you can use it to start, stop and manage the ArchivesSpace containers after they have been created for the first time. At the time of writing this, there is no way to call `docker compose` using Docker Desktop.

### Stop

You can stop running containers without removing them with the command:

```
docker compose stop
```

They can be started again with:

```
docker compose start
```
