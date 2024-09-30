# Run the Cypress end-to-end test suite

Running the Cypress tests depends on:

- Ruby for building and serving the site
- Node.js for running Cypress while the site is being served

This documentation assumes your machine has git installed and GitHub credentials configured. See the git [Downloads page](https://git-scm.com/downloads) for help installing git, and [Connecting to GitHub with SSH](https://docs.github.com/en/authentication/connecting-to-github-with-ssh) for help configuring shell access to GitHub.

## Clone this repo

First clone this repository to your machine then move into it:

```sh
git clone git@github.com:archivesspace/tech-docs.git

cd tech-docs
```

**All of the remaining commands within this document should be run from the tech-docs root directory.**

## Setup the Ruby environment

The currently required Ruby version for this project is listed in the [.ruby-version](./.ruby-version) file.

It is strongly recommended to use a Ruby version manager to be able to switch to any version that a given project uses.

The most popular version manager available for macOS and Linux is `rbenv`. You can find the installation guide here [https://github.com/rbenv/rbenv#readme](https://github.com/rbenv/rbenv#readme).

For Windows, a separate `rbenv` installer exists here: [https://github.com/RubyMetric/rbenv-for-windows#readme](https://github.com/RubyMetric/rbenv-for-windows#readme).

If you wish to use a different manager or installation method, you can choose one of the following: [https://www.ruby-lang.org/en/documentation/installation/](https://www.ruby-lang.org/en/documentation/installation/)

### Install Ruby

Install Ruby using `rbenv`:

```sh
rbenv install
```

### Install Ruby gems

Install the project specific Ruby dependencies listed in [Gemfile](./Gemfile) which are used for building and serving the site.

```sh
bundle install
```

## Set up the Node.js environment

The currently required Node.js version for this project is listed in [.nvmrc](./.nvmrc) and under the `engines.node` key in [package.json](./package.json).

It is strongly recommended to use a Node.js version manager to be able to switch to any version that a given project uses.

The most popular version manager available for macOS and Linux is `nvm`. You can find the installation guide here [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm).

A popular version manager for Windows is `nvm-windows`. See the installation guide here [https://github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows).

### Install Node.js

Install Node.js using `nvm`:

```sh
nvm install
```

### Install Node modules

Install the project specific Node dependencies listed in [package.json](./package.json) which are used for running the tests:

```sh
npm install
```

## Run the tests locally

Run the tests localy by first serving the site:

```sh
npm start
```

Then **in a different terminal** initiate the tests:

```sh
npm test
```
