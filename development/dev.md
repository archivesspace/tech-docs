# Running a development version of ArchivesSpace

## Running the build system

To run the build system, use the `build/run` script from your
ArchivesSpace project directory.  This will display a list of all
available build tasks.  This document describes a few of the important
ones.

## Bootstrapping

The bootstrap task:

     build/run bootstrap

Will bootstrap your development environment by downloading all
dependencies--JRuby, Gems, Solr, etc..

This is the starting point for all ArchivesSpace development. You may need
to re-run this command after fetching updates, or when making changes to
Gemfiles or other dependencies such as those in the `./build/build.xml` file.

## Running components individually

To run a development instance of all ArchivesSpace components:

     build/run backend:devserver
     build/run frontend:devserver
     build/run public:devserver
     build/run indexer

These should be run in different terminal sessions and do not need to be run
in a specific order or are all required.

## Running components all at once

Use Supervisord for a simpler way of running the development servers with output
for all servers sent to a single terminal window.

[Supervisord](http://supervisord.org/) can simultaneously launch the ArchivesSpace
development servers. This is entirely optional and just for developer convenience.

From within the ArchivesSpace source directory:

```bash
./build/run bootstrap # if needed, as usual

[sudo] pip install supervisor supervisor-stdout

#run all of the services
supervisord -c supervisord/archivesspace.conf

#run in api mode (backend + indexer / solr only)
supervisord -c supervisord/api.conf

#run just the backend (useful for trying out endpoints that don't require Solr)
supervisord -c supervisord/backend.conf

To stop supervisord: `Ctrl-c`.
```

ArchivesSpace is started with the staff interface running on http://localhost:3000/ and the PUI on http://localhost:3001/

## Running with a MySQL backend

To override configuration defaults create the file `common/config/config.rb`
and set values as needed (restart the development servers). To use MySQL
for development you can set the `db_url` in `common/config/config.rb` or set
the `aspace.config.db_url` property of `JAVA_OPTS`:

```
export JAVA_OPTS="-Daspace.config.db_url=jdbc:mysql://127.0.0.1:3306/archivesspace?useUnicode=true&characterEncoding=UTF-8&user=as&password=as123"
```

See the [setup instructions](../provisioning/mysql.md) for initializing the database.
The MySQL connector should be downloaded to `common/lib`. If you restore a
database to use in development it may not play well with the tests.

After setting up and creating the database you can run the migrations with:

     build/run db:migrate

You can also clear your database and search indexes with:

     build/run db:nuke

## Running the tests

ArchivesSpace uses a combination of RSpec, integration and Selenium
tests.  You will need to have Firefox on your path.  Then, to run all
tests:

     build/run travis:test

It's also useful to be able to run the backend unit tests separately.
To do this, run:

     build/run backend:test

You can also run a single spec file with:

     build/run backend:test -Dspec="myfile_spec.rb"

or a single example with:

     build/run backend:test -Dexample="does something important"

There are specific instructions and requirements for the [UI tests](ui_test.md) to work.

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
