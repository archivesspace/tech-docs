---
title: Using the VS Code editor
description: Instructions for using the VS Code editor with ArchiveSpace, including prerequisites and setup.
---

ArchivesSpace provides a [VS Code settings file](https://github.com/archivesspace/archivesspace/blob/master/.vscode/settings.json) that makes it easy for contributors using VS Code to follow the code style of the project and work with the end-to-end tests. Using this tool chain in your editor helps fix code format and lint errors _before_ committing files or running tests. In many cases such errors will be fixed automatically when the file being worked on is saved. Errors that can't be fixed automatically will be highlighted with squiggly lines. Hovering your cursor over these lines will display a description of the error to help reach a solution.

## Prerequisites

1. [Node.js](https://nodejs.org)
2. [Ruby](https://www.ruby-lang.org/)
3. [VS Code](https://code.visualstudio.com/)

## Set up VS Code

### Add system dependencies

1. [ESLint](https://eslint.org/)
2. [Prettier](https://prettier.io/)
3. [Rubocop](https://rubocop.org/)
4. [Stylelint](https://stylelint.io/)

#### Rubocop

```bash
gem install rubocop
```

See https://docs.rubocop.org/rubocop/installation.html for further information, including using Bundler.

#### ESLint, Prettier, Stylelint

Run the following command from the ArchivesSpace root directory.

```bash
npm install
```

See [package.json](https://github.com/archivesspace/archivesspace/blob/master/package.json) for further details on how these tools are used in ArchivesSpace.

### Add VS Code extensions

Add the following extensions via the VS Code command palette or the Extensions panel. (See this [documentation for installing and managing extensions](https://code.visualstudio.com/learn/get-started/extensions)).

1. [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) (dbaeumer.vscode-eslint)
2. [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) (esbenp.prettier-vscode)
3. [Ruby Rubocop Revised](https://marketplace.visualstudio.com/items?itemName=LoranKloeze.ruby-rubocop-revived) (LoranKloeze.ruby-rubocop-revived)
4. [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) (stylelint.vscode-stylelint)

Optional — for enhancing work with the end-to-end tests:

5. [Cucumber](https://marketplace.visualstudio.com/items?itemName=CucumberOpen.cucumber-official) (CucumberOpen.cucumber-official) — see [End-to-end test integration](#end-to-end-test-integration), especially step-definition navigation.

It's important to note that since these extensions work in tandem with the [VS Code settings file](https://github.com/archivesspace/archivesspace/blob/master/.vscode/settings.json), these settings only impact your ArchivesSpace VS Code Workspace, not your global VS Code User settings.

The extensions should now work out of the box at this point providing error messages and autocorrecting fixable errors on file save!

### End-to-end test integration

The ArchivesSpace repository includes optional VS Code workspace configuration that integrates the Cucumber end-to-end test suite with the editor. The files [`.vscode/example.tasks.json`](https://github.com/archivesspace/archivesspace/blob/master/.vscode/example.tasks.json) and [`.vscode/example.settings.json`](https://github.com/archivesspace/archivesspace/blob/master/.vscode/example.settings.json) are not enabled by default, so they do not override your personal editor configuration.

**Enable the tasks**

Copy the example tasks file to `.vscode/tasks.json`. This adds a task that runs the e2e test suite with the correct working directory, Ruby environment, and environment variables. Run it via **Terminal → Run Task… → Cucumber: Run e2e-test** (the same command as in the [e2e test documentation](/development/e2e_tests)). You may optionally supply a feature file path, `file.feature:line`.

**Step-definition navigation**

Integrate the contents of `example.settings.json` into your existing `.vscode/settings.json` (do not replace the existing file, but merge the Cucumber-related settings if you desire to use them so your current workspace settings are preserved).

This configures the Cucumber extension for `e2e-tests/**/*.feature` and shared Ruby step definitions, enabling jump-to-definition, undefined-step detection, and discovery of shared steps. This simplifies contributing new end-to-end tests.
