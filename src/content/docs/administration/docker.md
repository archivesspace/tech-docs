---
title: Running with Docker
description: Instructions on setting up, running, and managing an ArchivesSpace installation using Docker.
---

## Docker images

Starting with v4.0.0 ArchivesSpace officially supports using [Docker](https://www.docker.com/) as the easiest way to get up and running. Docker eases installing, upgrading, starting and stopping ArchivesSpace. It also makes it easy to setup ArchivesSpace as a system service that starts automatically on every reboot.

If you prefer not to use Docker, another (more involved) way to get ArchivesSpace up and running is installing the latest [distribution `.zip` file](/getting_started/zip_distribution).

ArchivesSpace Docker images are available on the [Docker hub](https://hub.docker.com/u/archivesspace).

- main application images are built from [this Dockerfile](https://github.com/archivesspace/archivesspace/blob/master/Dockerfile)
- solr images are built from [this Dockerfile](https://github.com/archivesspace/archivesspace/blob/master/solr/Dockerfile)

## Installing

### System requirements

ArchivesSpace on Docker has been tested on Ubuntu Linux, Mac OS X, and Windows. At least 1024 MB RAM are required. We recommend using at least 2 GB for optimal performance.

### Software Dependencies

When using Docker, the only software dependency is [Docker](https://www.docker.com/) itself. Follow the [instructions](https://docs.docker.com/get-started/get-docker/) to install the Docker engine.
Optionally installing [Docker Desktop](https://www.docker.com/products/docker-desktop/) provides a graphical way to manage, start and stop your docker containers, easily review the container logs etc.

### Downloading the configuration package

To run ArchivesSpace with Docker, first download the ArchivesSpace docker configuration package of the latest release from [github](https://github.com/archivesspace/archivesspace/releases) (scroll down to the "Assets" section of the latest release page and look for the zip file named `archivesspace-docker-${VERSION}.zip`).

The downloaded configuration package contains a simple yet configurable and production ready docker-based setup intended to run on a single computer.

### Contents of the configuration package

Unzipping the downloaded file will create an `archivesspace` directory with the following contents:

```
.
├── backups
├── config
│   └── config.rb
├── locales
├── plugins
├── proxy-config
│   └── default.conf
├── proxy-config-https
│   └── default.conf
├── sql
├── docker-compose.yml
├── docker-compose-https.yml
├── stylesheets
└── .env
```

- The `backups` directory is first created once you start the application and it will contain the automatically performed backups of the database. See [Automated Backups section](#automated-database-backups).
- `config/config.rb` file contains the [main configuration](/customization/configuration/) of ArchivesSpace.
- The `locales` directory allows [customization of the UI text](/customization/locales/).
- The `plugins` directory is there to accommodate additional ArchivesSpace [plugins](/customization/plugins/). By default, it contains the [`local`](/customization/plugins/#adding-your-own-branding) and [`lcnaf`](https://github.com/archivesspace-plugins/lcnaf) plugins.
- `proxy-config/default.conf` contains the configuration of the bundled `nginx` see also [proxy configuration](#proxy-configuration).
- `proxy-config-https/default.conf` contains the `nginx` configuration that is used in place of `proxy-config/default.conf` when [HTTPS is turned on](#https-on-a-public-server).
- In the `sql` directory you can put your `.sql` database dump file to initialize the new database, see [next section](migrating-from-the-zip-distribution-to-docker).
- The `stylesheets` directory contain the files that are used to create PDFs and other files.
- `docker-compose.yml` contains all the information required by Docker to build and run ArchivesSpace.
- `docker-compose-https.yml` adds optional HTTPS with free, automatically renewed certificates from Let's Encrypt. It is not used unless you turn it on, see [HTTPS on a public server](#https-on-a-public-server).
- `.env` contains configuration of the docker containers including:
  - Credentials used by archivespace to access its MySQL database. It is recommended to change the default root and user passwords to something safer.
  - The database connection URI which should also be [updated accordingly](/customization/configuration/#database-config) after the database user password is updated in the step above.

## Migrating from the zip distribution to docker

If you are currently running ArchivesSpace using the zip file distribution, you can start using Docker instead.

### Create a backup of your ArchivesSpace instance database

Use `mysqldump` to create a dump of your MySQL database:

```shell
mysqldump -uroot -p123456 -h 127.0.0.1 archivesspace > /tmp/db.$(date +%F.%H%M%S).sql
```

Follow the steps under the [Backup and recovery](/administration/backup/) section if you need more instructions on how create backups of your MySQL database.

### Initialize and migrate the database on Docker

Copy your `.sql` database dump file created above in the `sql` directory of your unzipped Docker configuration package. Make sure the filename includes the `.sql` extension. The file should be in plain text format (not zipped).
Docker will pick it up when it starts for the first time and restore the dump to your new database.

If you created the dump on an earlier ArchivesSpace version, the system will apply any pending database migrations to upgrade your database to the ArchivesSpace version you are currently running on Docker.

After the initial run you will want to remove that `.sql` file from the `sql` directory of your unzipped Docker configuration package.

The docker configuration package already includes a configurable database backup mechanism for MySQL. Read more about it in the [backup and recovery section](/administration/backup/#using-the-docker-configuration-package).

## Running

### Resource limits

We recommend allocating at least 2GB per container for optimal performance. If the host instance is devoted to running ArchivesSpace, it is advisable to configure no memory limit for Docker containers.

When using Docker Desktop, a default memory limit is set to 50% of your host's memory. To increase the RAM and other resource limits when using Docker Desktop, see [the documentation](https://docs.docker.com/desktop/settings-and-maintenance/settings/#resources).

When using Docker without Docker Desktop, no memory limit is set by default. See [Docker documenentation](https://docs.docker.com/engine/containers/resource_constraints/) if you need to set limits to the resources used by ArchivesSpace containers.

### Note on migrating from the zip distribution

If migrating from the zip distribution to Docker, you most probably have local MySQL and Solr instances running. Starting ArchivesSpace with Docker will start Docker-based MySQL and Solr instances. In order to avoid port binding conflicts, make sure that you stop your local MySQL and Solr instances before proceeding.

### Start

Open a terminal, change to the `archivespace` directory that contains the `docker-compose.yml` file and run:

```shell
docker compose up --detach
```

The first time you start ArchivesSpace with Docker, the container images will be downloaded and configuration steps such as database setup and solr index initialization will be performed automatically.
It is expected that the whole process takes up to ten or even more minutes depending on the power of your machine and internet connection speed. **Note** if you are migrating from using the zip distribution to Docker and have already copied a dump of your database in the `sql` directory, initialization of the database and indexing it in solr can take a long time depending on the size of your data.

Starting with the `--detach` option allows closing the terminal without stopping ArchivesSpace. Viewing the logs of running ArchivesSpace containers is possible in [Docker Desktop](https://www.docker.com/products/docker-desktop/) or in a terminal with:

```shell
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

You can see the status of your running containers with:

```
docker ps
```

Which will give a listing like this:

```
CONTAINER ID   IMAGE                               COMMAND                  CREATED              STATUS                        PORTS                                    NAMES
9892976d3db8   nginx:1.30-alpine                   "/docker-entrypoint.…"   About a minute ago   Up About a minute             0.0.0.0:80->80/tcp, [::]:80->80/tcp      proxy
19db83268a59   archivesspace/archivesspace:4.2.1   "/archivesspace/star…"   About a minute ago   Up About a minute (healthy)   8080-8081/tcp, 8089-8090/tcp, 8092/tcp   archivesspace
d817f4919947   databack/mysql-backup:1.5.0         "/entrypoint dump"       About a minute ago   Up About a minute                                                      db-backup
7a700955e112   archivesspace/solr:4.2.1            "docker-entrypoint.s…"   About a minute ago   Up About a minute             127.0.0.1:8983->8983/tcp                 solr
3ea323c8ad17   mysql:8.4                           "docker-entrypoint.s…"   About a minute ago   Up About a minute             127.0.0.1:3306->3306/tcp, 33060/tcp      mysql
```

If you turned on [HTTPS](#https-on-a-public-server), the list also includes a `certbot` container, and the `proxy` container also uses port 443.

If you have also [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed, you can use it to start, stop and manage the ArchivesSpace containers after they have been created for the first time. Docker Desktop does have a built in terminal window that can be used to run Docker commands.

### Stop

The following commands need to run from `archivespace` directory that contains the `docker-compose.yml` file. You can stop running containers (without deleting) them with the command:

```shell
docker compose stop
```

They can be started again with:

```shell
docker compose up --detach
```

### Start a shell within a container to run the provided scripts

You can get a `bash` shell on the container running the archivespace application and run the any of the scripts in the scripts directory with:

```shell
$ docker exec -it archivesspace bash
archivesspace@9ed453c46a9f:/$ cd archivesspace/scripts/
archivesspace@9ed453c46a9f:/archivesspace/scripts$ ls
backup.bat  backup.sh  ead_export.bat  ead_export.sh  find-base.sh  initialize-plugin.bat  initialize-plugin.sh  password-reset.bat  password-reset.sh  rb  setup-database.bat  setup-database.sh
archivesspace@9ed453c46a9f:/archivesspace/scripts$ ./setup-database.sh
NOTE: Picked up JDK_JAVA_OPTIONS: --add-opens java.base/sun.nio.ch=ALL-UNNAMED --add-opens java.base/java.io=ALL-UNNAMED
Loading ArchivesSpace configuration file from path: /archivesspace/config/config.rb
Loading ArchivesSpace configuration file from path: /archivesspace/config/config.rb
Loading ArchivesSpace configuration file from path: /archivesspace/config/config.rb
Detected MySQL connector 8+
Running migrations against jdbc:mysql://db:3306/archivesspace?useUnicode=true&characterEncoding=UTF-8&user=[REDACTED]&password=[REDACTED]&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
All done.
```

### Copy files from and to your data directory

The archivespace `data` directory is not exposed in the Docker Configuration package (as are `locales`, `config`, and `locales` making them easily accessible). This is due to issues we have had on Windows when exposing
the `data` directory instead of using a Docker volume for it.

If you need to copy files from/to the `data` directory, or any other directory of the archivesspace installation, you can use [`docker cp`](https://docs.docker.com/reference/cli/docker/container/cp/) commands, such as:

```shell
docker cp archivesspace:/archivesspace/data/indexer_state /tmp/indexer_state
docker cp ~/Desktop/test.png archivesspace:/archivesspace/data
```

## Automated database backups

The Docker configuration package includes a mechanism that will perform periodic backups of your MySQL database, see the [Backup and Recovery](/administration/backup/#backups-when-using-the-docker-configuration-package) for more information.

## Proxy Configuration

The Docker configuration package includes an `nginx` based proxy that is by default binding on port 80 of the host machine (see `NGINX_PORT` variable in `.env` file). See `proxy-config/default.conf` and the [nginx docker page](https://hub.docker.com/_/nginx) for more configuration options.

If you turned on [HTTPS](#https-on-a-public-server), `nginx` uses `proxy-config-https/default.conf` in place of `proxy-config/default.conf`. If you change the proxy configuration (for example to enable `/oai`), make the change in `proxy-config-https/default.conf`.

### Database and Solr ports

The MySQL (3306) and Solr (8983) ports are available only from the computer that runs Docker (`127.0.0.1`). This prevents access to them from the internet. Tools on the same computer, for example a MySQL client, can still connect to `127.0.0.1:3306`.

## HTTPS on a public server

If ArchivesSpace runs on a server that people reach on the internet with a domain name (for example `archives.example.org`), you can turn on HTTPS. The configuration package then gets a free certificate from [Let's Encrypt](https://letsencrypt.org/) and renews it automatically.

You do not need this if you run ArchivesSpace on your own computer.

### Requirements

- A domain name that points (DNS `A` record) to your server. If the domain also has an IPv6 (`AAAA`) record, IPv6 must work on the server.
- Ports 80 and 443 on the server open to the internet. Let's Encrypt checks your domain on port 80, so keep `NGINX_PORT=80` in `.env`.

The certificate is for one name only. For example, a certificate for `archives.example.org` does not include `www.archives.example.org`.

### Turn on HTTPS

1. Open the `.env` file and find the `# HTTPS (optional)` section at the end.
2. Remove the `#` from the start of these 2 lines, and set your domain:

   ```
   COMPOSE_FILE=docker-compose.yml:docker-compose-https.yml
   DOMAIN=archives.example.org
   ```

   Use the same lines on Windows, macOS and Linux. Do not change the `COMPOSE_PATH_SEPARATOR=:` line above them.

   `EMAIL` is optional. Let's Encrypt does not send expiry warnings by email. If you set an address, Let's Encrypt adds it to its general mailing list. Renewal is automatic, so you do not need it.

3. Start ArchivesSpace as usual:

   ```shell
   docker compose up --detach
   ```

   All containers restart one time when you turn HTTPS on or off.

The first certificate usually arrives within a few minutes. Until then, the site uses a temporary certificate, and browsers show a security warning. To see the progress, run:

```shell
docker compose logs --follow certbot
```

When the certificate is ready, the log shows:

```
Certificate for archives.example.org is in place. Next check in 12 hours.
```

The Public User Interface is then available at `https://archives.example.org/` and the Staff User Interface at `https://archives.example.org/staff/`. Requests to `http://` are sent to `https://`.

ArchivesSpace sets the public, staff and OAI proxy URLs to your `DOMAIN` automatically. These values replace the proxy URL settings in `config/config.rb`.

### Troubleshooting

**`docker compose up` says `container certbot is unhealthy`**

The `DOMAIN` value in `.env` is not correct. Run `docker compose logs certbot` to see the reason. `DOMAIN` must be only the name, for example `archives.example.org`. Do not include `https://`, a `/` at the end, or a port number. The site does not start until you correct `DOMAIN` and run `docker compose up --detach` again.

**The log shows `Could not get a certificate for ...`**

The log also shows the reason from Let's Encrypt. The site continues to use the temporary certificate, and the request is tried again every 12 hours. Usually the cause is one of these:

- The domain does not point to this server yet (DNS changes can take some time).
- Port 80 is blocked by a firewall, or `NGINX_PORT` is not `80`. If `NGINX_PORT` is not `80`, the log also shows a warning.
- The `DOMAIN` in `.env` has a spelling error.

After you correct the problem, try again immediately with:

```shell
docker compose up --detach
docker compose restart certbot
```

Let's Encrypt allows only a small number of failed requests per hour, so correct the problem before you try again many times.

### Renewal

Certificates are checked every 12 hours and renewed automatically before they expire. `nginx` loads the renewed certificate without a restart. To see your certificate and its expiry date, run:

```shell
docker compose exec certbot certbot certificates
```

The certificate is kept in a Docker volume. `docker compose down --volumes` deletes it, and a new one is then requested. Let's Encrypt allows only a small number of new certificates for the same name each week, so do not delete the volumes often.

### Change the domain

Change `DOMAIN` in `.env` and run `docker compose up --detach`. A certificate for the new domain is requested automatically.

### Turn off HTTPS

Put the `#` back at the start of the `COMPOSE_FILE` line in `.env`, then run:

```shell
docker compose up --detach --remove-orphans
```

The certificate is kept, so you can turn HTTPS on again later.

## Upgrading

If you are already using the Docker configuration package and upgrading to a newer ArchivesSpace version, [download and extract](#downloading-the-configuration-package) the latest version of the Docker configuration package.

**Note:** the new configuration package has a new `.env` file. Before you start, copy your changes from your old `.env` file to the new one. If you turned on [HTTPS](#https-on-a-public-server), this includes the `COMPOSE_FILE` and `DOMAIN` lines (and `EMAIL`, if you set it). Your certificate is kept and used again, if you extract the new package into the same folder.

### With solr configuration / schema changes

If the ArchivesSpace version you are upgrading to includes solr configuration or schema changes (see the [release notes](https://github.com/archivesspace/archivesspace/releases)), then you need to recreate your solr core and re-index. Change to the `archivespace` directory where you extraced the fresh downloaded Docker configuration package and run:

```shell
docker compose down solr app
docker volume rm archivesspace_app-data archivesspace_solr-data
docker compose pull
docker compose up -d --build --force-recreate
```

### Without solr configuration / schema changes

If no solr configuration or schema changes are included, change to the extracted `architecture` directory and run:

```shell
docker compose pull
docker compose up -d --build --force-recreate
```
