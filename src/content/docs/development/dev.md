---
title: Development environment
description: Guidance for setting up a development environment or ArchivesSpace, including system requirements, supported development platforms, a quickstart guide, and step-by-step instructions.
---

System requirements:

- Java 17
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) is optional but makes running MySQL and Solr more convenient
- [Supervisord](http://supervisord.org/) is optional but makes running the development servers more convenient
- [mysql-client](https://www.bytebase.com/reference/mysql/how-to/how-to-install-mysql-client-on-mac-ubuntu-centos-windows/) is required in order to load demo data or other sql dumps onto the database

Currently supported platforms for development:

- Linux (although generally only Ubuntu is actually used / tested)
- macOS on Intel (x86_64)
- macOS on Apple silicon (ARM64) _since v4.0.0_

:::note[Apple silicon and ArchivesSpace before v4.0.0]
To install versions of ArchivesSpace prior to v4.0.0 with macOS on Apple silicon, see [https://teaspoon-consulting.com/articles/archivesspace-on-the-m1.html](https://teaspoon-consulting.com/articles/archivesspace-on-the-m1.html).
:::

:::danger[Windows development not supported]
Windows is not supported because of issues building gems with C extensions (such as sassc).
:::

When installing Java, [OpenJDK](https://openjdk.org/) is strongly recommended. Other vendors may work, but OpenJDK is most extensively used and tested. It is highly recommended that you use a version manager such as [mise](https://mise.jdx.dev/lang/java.html) to install Java (OpenJDK). This has proven to be a reliable way of resolving cross platform issues that have occured via other means of installing Java.

Installing OpenJDK with mise will look something like:

```bash
mise use -g java@openjdk-21
```

On Linux/Ubuntu it is generally fine to install from system packages:

```bash
sudo apt install openjdk-$VERSION-jdk-headless
# example: install 17
sudo apt install openjdk-17-jdk-headless
# update-java-alternatives can be used to switch between versions
sudo update-java-alternatives --list
sudo update-java-alternatives --set $version
```

For [Homebrew](https://brew.sh/) users (macOS, Linux), the OpenJDK distribution from Azul has been reported to work:

```bash
# install Java v21 for example
brew install --cask zulu@21
```

If using Docker & Docker Compose install them following the official documentation:

- [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)
- [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)

_Do not use system packages or any other unofficial source as these have been found to be inconsistent with standard Docker._

The recommended way of developing ArchivesSpace is to fork the repository and clone it locally.

_Note: all commands in the following instructions assume you are in the root directory of your local fork
unless otherwise specified._

**Quickstart**

This is an abridged reference for getting started with a limited explanation of the steps:

```bash
# Build images (required one time only for most use cases)
docker-compose -f docker-compose-dev.yml build
# Run MySQL and Solr in the background
docker-compose -f docker-compose-dev.yml up --detach
# Download the MySQL connector
cd ./common/lib && wget https://repo1.maven.org/maven2/mysql/mysql-connector-java/8.0.30/mysql-connector-java-8.0.30.jar && cd -
# Download all application dependencies
./build/run bootstrap
# OPTIONAL: load dev database
gzip -dc ./build/mysql_db_fixtures/demo.sql.gz | mysql --host=127.0.0.1 --port=3306  -u root -p123456 archivesspace
# Setup the development database
./build/run db:migrate
# Clear out any existing Solr state (only needed after a database setup / restore after previous development)
./build/run solr:reset
# Run the development servers
supervisord -c supervisord/archivesspace.conf
# OPTIONAL: Run a backend (api) test (for checking setup is correct)
./build/run backend:test -Dexample="User model"
```

## Step by Step explanation

### Run MySQL and Solr

ArchivesSpace development requires MySQL and Solr to be running. The easiest and
recommended way to run them is using the Docker Compose configuration provided by ArchivesSpace.

Start by building the images. This creates a custom Solr image that includes ArchivesSpace's configuration:

```bash
docker-compose -f docker-compose-dev.yml build
```

_Note: you only need to run the above command once. You would only need to rerun this command if a)
you delete the image and therefore need to recreate it, or b) you make a change to ArchivesSpace's Solr
configuration and therefore need to rebuild the image to include the updated configuration._

Run MySQL and Solr in the background:

```bash
docker-compose -f docker-compose-dev.yml up --detach
```

By using Docker Compose to run MySQL and Solr you are guaranteed to have the correct connection settings
and don't otherwise need to define connection settings for MySQL or Solr.

Verify that MySQL & Solr are running: `docker ps`. It should list the running containers:

```txt
CONTAINER ID   IMAGE                       COMMAND                  CREATED       STATUS       PORTS                               NAMES
ec76bd09d73b   mysql:8.0                   "docker-entrypoint.s…"   8 hours ago   Up 8 hours   33060/tcp, 0.0.0.0:3307->3306/tcp   as_test_db
30574171530f   archivesspace/solr:latest   "docker-entrypoint.s…"   8 hours ago   Up 8 hours   0.0.0.0:8984->8983/tcp              as_test_solr
d84a6a183bb0   archivesspace/solr:latest   "docker-entrypoint.s…"   8 hours ago   Up 8 hours   0.0.0.0:8983->8983/tcp              as_dev_solr
7df930293875   mysql:8.0                   "docker-entrypoint.s…"   8 hours ago   Up 8 hours   0.0.0.0:3306->3306/tcp, 33060/tcp   as_dev_db
```

To check the servers are online:

- MYSQL: `mysql -h 127.0.0.1 -u as -pas123 archivesspace`
- SOLR: `curl http://localhost:8983/solr/admin/cores`

To stop and / or remove the servers:

```bash
docker-compose -f docker-compose-dev.yml stop # shutdowns the servers (data will be preserved)
docker-compose -f docker-compose-dev.yml rm # deletes the containers (all data will be removed)
```

**Advanced: running MySQL and Solr outside of Docker**

You are not required to use Docker for MySQL and Solr. If you run them another way the default
requirements are:

- dev MySQL, localhost:3306 create db: archivesspace, username: as, password: as123
- test MySQL, localhost:3307 create db: archivesspace, username: as, password: as123
- dev Solr, localhost:8983 create archivesspace core using ArchivesSpace configuration
- test Solr, localhost:8984, create archivesspace core using ArchivesSpace configuration

The defaults can be changed using [environment variables](https://github.com/archivesspace/archivesspace/blob/master/build/build.xml#L43-L46) located in the build file.

### Download the MySQL connector

For licensing reasons the MySQL connector must be downloaded separately:

```bash
cd ./common/lib
wget https://repo1.maven.org/maven2/mysql/mysql-connector-java/8.0.30/mysql-connector-java-8.0.30.jar
cd -
```

### Run bootstrap

The bootstrap task:

     ./build/run bootstrap

Will bootstrap your development environment by downloading all
dependencies--JRuby, Gems, etc. This one command creates a fully
self-contained development environment where everything is downloaded
within the ArchivesSpace project `build` directory.

_It is not necessary and generally incorrect to manually install JRuby
& bundler etc. for ArchivesSpace (whether with a version manager or
otherwise)._

_The self-contained ArchivesSpace development environment typically does
not interact with other J/Ruby environments you may have on your system
(such as those managed by rbenv or similar)._

This is the starting point for all ArchivesSpace development. You may need
to re-run this command after fetching updates, or when making changes to
Gemfiles or other dependencies such as those in the `./build/build.xml` file.

**Errors running bootstrap**

```txt
     [java] INFO: jetty-9.4.44.v20210927; built: 2021-09-27T23:02:44.612Z; git: 8da83308eeca865e495e53ef315a249d63ba9332; jvm 11+28
     [java] Exiting
     [java] LoadError: no such file to load -- rails/commands
     [java]   require at org/jruby/RubyKernel.java:974
     [java]    <main> at script/rails:8
```

     ./build/run backend:devserver
     ./build/run frontend:devserver
     ./build/run public:devserver
     ./build/run indexer

There have been various forms of the same `LoadError`. It's a transient error
that is resolved by rerunning bootstrap.

```txt
     [java] org.jruby.Main -I uri:classloader://META-INF/jruby.home/lib/ruby/stdlib -r
     [java] ./siteconf20220407-5224-13f6qi7.rb extconf.rb
     [java] sh: /Library/Internet: No such file or directory
     [java] sh: line 0: exec: /Library/Internet: cannot execute: No such file or directory
     [java]
     [java] extconf failed, exit code 126
```

This has been seen on Mac platforms resulting from the installation method
for Java. Installing the OpenJDK via Jabba has been effective in resolving
this error.

**Advanced: bootstrap & the build directory**

Running bootstrap will download jars to the build directory, including:

- jetty-runner
- jruby
- jruby-rack

Gems will be downloaded to: `./build/gems/jruby/$version/gems/`.

### Setup the development database

The migrate task:

```bash
./build/run db:migrate
```

Will setup the development database, creating all of the tables etc.
required by the application.

There is a task for resetting the database:

```bash
./build/run db:nuke
```

Which will first delete then migrate the database.

### Loading data fixtures into dev database

When loading a database into the development MySQL instance always ensure that ArchivesSpace
is **not** running. Stop ArchivesSpace if it is running. Run `./build/run solr:reset` to
clear indexer state (a more thorough explanation of this step is described below).

If you are loading a database and MySQL has already been used for development you'll want to
drop and create an empty database first.

```bash
mysql -h 127.0.0.1 -u as -pas123 -e "DROP DATABASE archivesspace"
mysql -h 127.0.0.1 -u as -pas123 -e "CREATE DATABASE IF NOT EXISTS archivesspace DEFAULT CHARACTER SET utf8mb4"
```

_Note: you can skip the above step if MySQL was just started for the first time or any time you
have an empty ArchivesSpace (one where `db:migrate` has not been run)._

Assuming you have MySQL running and an empty `archivesspace` database available you can proceed
to restore:

```bash
gzip -dc ./build/mysql_db_fixtures/blank.sql.gz | mysql --host=127.0.0.1 --port=3306  -u root -p123456 archivesspace
./build/run db:migrate
```

_Note: The above instructions should work out-of-the-box. If you want to use your own database
and / or have configured MySQL differently then adjust the commands as needed._

After the restore `./build/run db:migrate` is run to catch any migration updates. You can now
proceed to run the application dev servers, as described below, with data already
populated in ArchivesSpace.

### Clear out existing Solr state

The Solr reset task:

```bash
./build/run solr:reset
```

Will wipe out any existing Solr state. This is not required when setting
up for the first time, but is often required after a database reset (such as
after running the `./build/run db:nuke` task).

_More specifically what this does is submit a delete all request to Solr and empty
out the contents of the `./build/dev/indexer*_state` directories, which is described
below._

### Run the development servers

Use [Supervisord](http://supervisord.org/) for a simpler way of running the development servers with output
for all servers sent to a single terminal window:

```bash
# run all of the services
supervisord -c supervisord/archivesspace.conf

# run in api mode (backend + indexer only)
supervisord -c supervisord/api.conf

# run just the backend (useful for trying out endpoints that don't require Solr)
supervisord -c supervisord/backend.conf
```

ArchivesSpace is started with:

- the staff interface on [http://localhost:3000/](http://localhost:3000/)
- the PUI on [http://localhost:3001/](http://localhost:3001/)
- the API on [http://localhost:4567/](http://localhost:4567/)

To stop supervisord: `Ctrl-c`.

#### Advanced: running the development servers directly

Supervisord is not required, or ideal for every situation. You can run the development
servers directly via build tasks:

```bash
./build/run backend:devserver # This is the REST API
./build/run frontend:devserver # This is the staff user interface
./build/run public:devserver # This is the public user interface
./build/run indexer # This is the indexer (converts ASpace records to Solr Docs and ships to Solr)
```

These should be run in different terminal sessions and do not need to be run
in a specific order or are all required.

_An example use case for running a server directly is to use the pry debugger._

#### Advanced: debugging with pry

To debug with pry you cannot use supervisord to run the application devserver,
however you can mix and match:

```bash
# run the backend and indexer with supervisord
supervisord -c supervisord/api.conf

# in a separate terminal run the frontend directly
./build/run frontend:devserver
```

Add `require 'pry-debugger-jruby'; binding.pry` to set breakpoints in the code. This can also be used in views:
`<% require 'pry-debugger-jruby'; binding.pry %>`. Using pry you can easily inspect the `request`, `params` and
in scope instance variables that are available. Typical debugger commands are available:

- `step`: Step execution into the next line or method. Takes an optional numeric argument to step multiple times.
- `next`: Step over to the next line within the same frame. Takes an optional numeric argument to step multiple times. Differs from step in that it always stays within the same frame (e.g. does not go into other method calls).
- `finish`: Execute until current stack frame returns.
- `continue`: Continue program execution and end the Pry session.

See also [pry-debugger-jruby docs](https://gitlab.com/ivoanjo/pry-debugger-jruby).

#### Advanced: development servers and the build directory

     ./build/run db:migrate

Running the developments servers will create directories in `./build/dev`:

- indexer_pui_state: latest timestamps for PUI indexer activity
- indexer_state: latest timestamps for (SUI) indexer activity
- shared: background job files

  ./build/run db:nuke

_Note: the folders will be created as they are needed, so they may not all be present
at all times._

#### Accessing development servers from other devices on the local network

You can access the ArchivesSpace development servers from other devices on your local network. This is especially useful for testing on mobile operating systems.

##### Prerequisites

1. Your development machine and the other device must be on the same WiFi network
2. The ArchivesSpace development servers must be running on the development machine

##### Steps

1. Get your development machine's local IP address

   On macOS:

   ```bash
   ipconfig getifaddr en0
   ```

   On Linux:

   ```bash
   hostname -I | awk '{print $1}'
   ```

   This returns something like `134.192.0.47`.

2. Start the [development servers](#run-the-development-servers)

   The development servers bind to `0.0.0.0` by default, making them accessible from other devices on the network (see the [frontend binding example](https://github.com/archivesspace/archivesspace/blob/f77dec627cd1feac77e4b67f9242d617efe80e94/build/build.xml#L899)).

3. **Access from another device**

   On the other device, open a web browser and navigate to your development machine's IP address with the appropriate port, ie: `http://<your-local-ip>:<port>/`.

   So for IP address `134.192.0.47`:

   - Staff interface: `http://134.192.0.47:3000/`
   - Public interface: `http://134.192.0.47:3001/`
   - API: `http://134.192.0.47:4567/`

## Running the tests

### Backend tests

_By default the tests are configured to run using a separate MySQL & Solr from the
development servers. This means that the development and test environments will not
interfere with each other._

```bash
# run the backend / api tests
./build/run backend:test
```

You can also run a single spec file with:

```bash
./build/run backend:test -Dspec="myfile_spec.rb"
```

Or a single example with:

```bash
./build/run backend:test -Dexample="does something important"
```

Or by file line with:

```bash
./build/run backend:test -Dspec="myfile_spec.rb:123"
```

There are specific instructions and requirements for the [UI tests](/development/ui_test) to work.

**Advanced: tests and the build directory**

Running the tests may create directories in `./build/test`. These will be
the same as for the development servers as described above.

## Coverage reports

You can run the coverage reports using:

     ./build/run coverage

This runs all of the above tests in coverage mode and, when the run
finishes, produces a set of HTML reports within the `coverage`
directory in your ArchivesSpace project directory.

## Linting and formatting with Rubocop

If you are editing or adding source files that you intend to contribute via a pull request,
you should make sure your changes conform to the layout and style rules by running:

    ./build/run rubocop

Most errors can be auto-corrected by running:

    ./build/run rubocop -Dcorrect=true

## Submitting a Pull Request

When you have code ready to be reviewed, open a pull request to ask for it to be
merged into the codebase.

To help make the review go smoothly, here are some general guidelines:

- **Your pull request should address a single issue.**
  It's better to split large or complicated PRs into discrete steps if possible. This
  makes review more manageable and reduces the risk of conflicts with other changes.
- **Give your pull request a brief title, referencing any JIRA or Github issues resolved
  by the pull request.**
  Including JIRA numbers (e.g. 'ANW-123') explicitly in your pull request title ensures the
  PR will be linked to the original issue in JIRA. Similarly, referencing GitHub issue numbers
  (e.g. 'Fixes #123') will automatically close that issue when the PR is merged.
- **Fill out as much of the Pull Request template as is possible/relevant.**
  This makes it easier to understand the full context of your PR, including any discussions or supporting documentation that went into developing the functionality or resolving the bug.

## Building a distribution

See: [Building an Archivesspace Release](/development/release) for information on building a distribution.

## Generating API documentation

See: [Building an Archivesspace Release](/development/release) for information on building the documentation.
