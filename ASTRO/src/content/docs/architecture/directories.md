# Directory structure

ArchivesSpace is made up of several components that are kept in separate directories.

## \_yard

This directory contains the code for the documentation tool used to generate the github io pages here: http://archivesspace.github.io/archivesspace/

## backend

This directory contains the code that handles the database and the API.

## build

This directory contains the code used to build the application. It includes the commands that are used to run the development servers, the test suites, and to build the releases. ArchivesSpace is a JRuby application and Apache Ant is used to build it.

## clustering

This directory contains code that can be used when clustering an ArchivesSpace installation.

## common

This directory contains code that is used across two or more of the components. It includes configuration options, database schemas and migrations, and translation files.

## contribution_files

This directory contains the documentation and PDFs of the license agreement files.

## docs

This directory contains documentation files that are included in a release.

## frontend

This directory contains the staff interface Ruby on Rails application.

## indexer

This directory contains the indexer Sinatra application.

## jmeter

This directory contains an example that can be used to set up Apache JMeter to load test functional behavior and measure performance.

## launcher

This directory contains the code that launches (starts, restarts, and stops) an ArchivesSpace application.

## oai

This directory contains the OAI-PMH Sinatra application.

## plugins

This directory contains ArchivesSpace Program Team supported plugins.

## proxy

This directory contains the Docker proxy code.

## public

This directory contains the public interface Ruby on Rails application.

## reports

This directory contains the reports code.

## scripts

This directory contains scripts necessary for building, deploying, and other ArchivesSpace tasks.

## selenium

This directory contains the selenium tests.

## solr

This directory contains the solr code.

## stylesheets

This directory contains XSL stylesheets used by ArchivesSpace.

## supervisord

This directory contains a tool that can be used to run the development servers.
