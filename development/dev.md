# Running a development version of ArchivesSpace

System requirements:

- Java 8 or 11 (11 recommended)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) is optional but makes running MySQL and Solr more convenient
- [Supervisord](http://supervisord.org/) is optional but makes running the development servers more convenient

If using Docker & Docker Compose install them following the official documentation:

- https://docs.docker.com/get-docker/
- https://docs.docker.com/compose/install/

_Do not use system packages or any other unofficial source as these have been found to be inconsistent with standard Docker._

The recommended way of developing ArchivesSpace is to fork the repository and clone it locally.

_Note: all commands in the following instructions assume you are in the root directory of your local fork
unless otherwise specified._

__Quickstart__

This is an abridged reference for getting started with a limited explanation of the steps:

```bash
# Build images (required one time only for most use cases)
docker-compose -f docker-compose-dev.yml build
# Run MySQL and Solr in the background
docker-compose -f docker-compose-dev.yml up --detach
# Download the MySQL connector
cd ./common/lib && wget https://repo1.maven.org/maven2/mysql/mysql-connector-java/8.0.23/mysql-connector-java-8.0.23.jar && cd -
# Download all application dependencies
./build/run bootstrap
# Setup the development database
./build/run db:migrate
# Clear out any existing Solr state (only needed after a database setup / restore after previous development)
./build/run solr:reset
# Run the development servers
supervisord -c supervisord/archivesspace.conf
# Run a backend (api) test (for checking setup is correct)
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

__Advanced: running MySQL and Solr outside of Docker__

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
wget https://repo1.maven.org/maven2/mysql/mysql-connector-java/8.0.23/mysql-connector-java-8.0.23.jar
cd -
```

### Run bootstrap

The bootstrap task:

```bash
./build/run bootstrap
```

Will bootstrap your development environment by downloading all
dependencies--JRuby, Gems, etc. This one command creates a fully
self-contained development environment where everything is downloaded
within the ArchivesSpace project `build` directory.

_It is not necessary and generally incorrect to manually install JRuby
& bundler etc. for ArchivesSpace (whether with a version manager or
otherwise)._

_The self contained ArchivesSpace development environment typically does
not interact with other J/Ruby environments you may have on your system
(such as those managed by rbenv or similar)._

This is the starting point for all ArchivesSpace development. You may need
to re-run this command after fetching updates, or when making changes to
Gemfiles or other dependencies such as those in the `./build/build.xml` file.

__Advanced: bootstrap & the build directory__

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

- the staff interface on http://localhost:3000/
- the PUI on http://localhost:3001/
- the API on http://localhost:4567/

To stop supervisord: `Ctrl-c`.

__Advanced: running the development servers directly__

Supervisord is not required, or ideal for every situation. You can run the development
servers directly via build tasks:

```bash
./build/run backend:devserver
./build/run frontend:devserver
./build/run public:devserver
./build/run indexer
```

These should be run in different terminal sessions and do not need to be run
in a specific order or are all required.

_An example use case for running a server directly is to use the pry debugger._

__Advanced: debugging with pry__

To debug with pry you cannot use supervisord to run the application devserver,
however you can mix and match:

```bash
# run the backend and indexer with supervisord
supervisord -c supervisord/api.conf

# in a separate terminal run the frontend directly
./build/run frontend:devserver
```

Add `binding.pry` to set breakpoints in the code. This can also be used in views:
`<% binding.pry %>`. Using pry you can easily inspect the `request`, `params` and
in scope instance variables that are available.

__Advanced: development servers and the build directory__


Running the developments servers will create directories in `./build/dev`:

- indexer_pui_state: latest timestamps for PUI indexer activity
- indexer_state: latest timestamps for (SUI) indexer activity
- shared: background job files

_Note: the folders will be created as they are needed, so they may not all be present
at all times._

## Loading data fixtures into dev database

To populate the `as_dev_db` container with real data, do the following. This assumes that `as_dev_db` has previously been
built and is running (along wiith the other containers defined in `docker-compose-dev.yml`):

    docker stop as_dev_db
    docker rm as_dev_db
    docker-compose -f docker-compose-dev.yml up -d --build db1
    gzip -dc ./build/mysql_db_fixtures/accessibility.sql.gz | mysql --host=127.0.0.1 --port=3306  -u root archivesspace
    # enter password 123456 when prompted
    # Now migrate the database to catch any migration updates
    ./build/run db:migrate
    # Now run the indexer to populate Solr
    ./build/run indexer

## Running the tests

ArchivesSpace uses a combination of RSpec, integration and Selenium
tests.

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

There are specific instructions and requirements for the [UI tests](ui_test.md) to work.

__Advanced: tests and the build directory__

Running the tests may create directories in `./build/test`. These will be
the same as for the development servers as described above.

## Coverage reports

You can run the coverage reports using:

     build/run coverage

This runs all of the above tests in coverage mode and, when the run
finishes, produces a set of HTML reports within the `coverage`
directory in your ArchivesSpace project directory.

## Linting and formatting with Rubocop

If you are editing or adding source files that you intend to contribute via a pull request,
you should make sure your changes conform to the layout and style rules by running:

    build/run rubocop

Most errors can be auto-corrected by running:

    build/run rubocop -Dcorrect=true

## Submitting a Pull Request

When you have code ready to be reviewed, open a pull request to ask for it to be
merged into the codebase.

To help make the review go smoothly, here are some general guidelines:

* __Your pull request should address a single issue.__
  It's better to split large or complicated PRs into discrete steps if possible. This
  makes review more manageable and reduces the risk of conflicts with other changes.
* __Give your pull request a brief title, referencing any JIRA or Github issues resolved
by the pull request.__
  Including JIRA numbers (e.g. 'ANW-123') explicitly in your pull request title ensures the
  PR will be linked to the original issue in JIRA. Similarly, referencing GitHub issue numbers
  (e.g. 'Fixes #123') will automatically close that issue when the PR is merged.
* __Fill out as much of the Pull Request template as is possible/relevant.__
  This makes it easier to understand the full context of your PR, including any discussions or supporting documentation that went into developing the functionality or resolving the bug.

## Building a distribution

See: [Building an Archivesspace Release](release.md) for information on building a distribution.

## Generating API documentation

See: [Building an Archivesspace Release](release.md) for information on building the documentation.
