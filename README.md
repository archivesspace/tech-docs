# ArchivesSpace technical documentation

This repository contains the content and source code for the [ArchivesSpace TechDocs site](https://docs.archivesspace.org/).

## Content

The documentation content is found in `src/content/docs/` with the following structure:

- **Architecture** - System architecture and components overview
- **Administration** - Running and maintaining ArchivesSpace
- **Provisioning** - Deployment and scaling
- **Migrations** - Data migration guides
- **Customization** - Configuration and customization options
- **Development** - Local development and contributing
- **API** - API documentation and usage
- **About** - About the TechDocs repository

## Source code

TechDocs is a [Node.js](https://nodejs.org) application, built with [Astro](https://astro.build/) and its [Starlight](https://starlight.astro.build/) documentation site framework. Content is written in Markdown. Automated testing is done with [Cypress](https://www.cypress.io/). The source code is hosted on [GitHub](https://github.com/archivesspace/tech-docs). The site is statically built and hosted via [Cloudflare Pages](https://pages.cloudflare.com/). When the source code changes, a new set of static files are generated and published shortly after.

### Requirements

1. [Node.js](https://nodejs.org) v18.17.1 or v20.3.0, v22.0.0 or higher (v19 and v21 are not supported) - this is an [Astro requirement](https://docs.astro.build/en/install-and-setup/#prerequisites)

### Running TechDocs locally

```sh
# First clone the repository and install its dependencies

git clone https://github.com/archivesspace/tech-docs.git

cd tech-docs

npm install

# Next, either run the dev server at http://localhost:4321/ which instantly reflects changes to the source code,
npm run dev

# or build the static site for production
npm run build

# and optionally serve the static build to http://localhost:4321/
npm run preview
```

### Testing

Running the tests requires either the dev server or the production build to be running at http://localhost:4321/, ie:

```sh
# Build and serve the production build in one terminal,
npm run build

npm run preview

# then run the tests from another terminal
npm run test
```

### Scripts

The following scripts are made available via [package.json](./package.json):

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test:dev` - Run tests in development mode
- `npm run test:prod` - Run tests in production mode
- `npm run test` - Run tests in production mode by default
- `npm run prettier:check` - Check code formatting
- `npm run prettier:fix` - Fix code formatting
- `npm run stylelint:check` - Check styles
- `npm run stylelint:fix` - Fix style issues

## Contributing

### Reporting an Issue

Issues for ArchivesSpace's technical documentation are [tracked in Jira.](https://archivesspace.atlassian.net/jira/software/projects/TD/boards/57) If there isn't a ticket in this system, go ahead and make one. Be
sure to include a **title and clear description** with as much relevant
information as possible.

### Creating a Pull Request

#### Fork & create a branch

When you are ready to start working on an issue, please assign it to yourself
as an indication that you are working on it. Then [fork TechDocs][https://github.com/archivesspace/tech-docs/fork] and
create a branch with a descriptive name.

A good branch name would include the ticket number in it. For example, if you
are working on JIRA ticket TD-123:

```sh
git checkout -b TD-123-descriptive-short-title
```

#### Get the test suite running

Before running any tests, you will need to set up your environment. See [Running TechDocs locally](#running-techdocs-locally).

#### Implement your fix, enhancement or new feature

At this point, you're ready to make your changes! Feel free to ask for help;
remember everyone is a beginner at first

- ArchivesSpace Program Team - ArchivesSpaceHome@lyrasis.org

#### Run tests and style code

Before making a pull request, make sure tests run successfully and code adheres to style rules. See [Testing](#testing) for running tests. To apply style rules automatically:

```console
npm run prettier:fix
npm run stylelint:fix
```

#### Make a Pull Request

At this point, you should switch back to your main branch and make sure it's
up to date with ArchivesSpace's main branch:

```sh
git remote add upstream git@github.com:archivesspace/tech-docs.git
git checkout main
git pull upstream main
```

Then update your feature branch from your local copy of main, and push it!

```sh
git checkout TD-123-descriptive-short-title
git rebase main
git push --set-upstream origin TD-123-descriptive-short-title
```

Finally, go to GitHub and [make a Pull Request][https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request] :D

Our CI process will run all test suites against the pushed branch. We care about
quality, so your Pull Request won't be merged until all test suites pass. If any linting checks fail, the PR reviewer can fix those issues.

##### What happens after you submit a Pull Request?

All Pull Requests are reviewed by at least one member of the ArchivesSpace [Core Committer's Group](https://archivesspace.atlassian.net/wiki/spaces/ADC/pages/102893918/Core+Committers+Group).

A core committer reviews the issue/ticket associated with the Pull Request to make
sure they understand what the code changes are supposed to do. Next, they review
the code changes to see the proposed solution. Then they checkout the branch to
test the solution in a running instance of ArchivesSpace.

During the review, the core committer may have comments or ask questions in the
Pull Request. Once the comment/questions have been answered/resolved, a Pull
Request can only be accepted and merged into the core code base by a core
committer if:

- All test suites are passing.
- It is up-to-date with current main.

## 📖 Additional Resources

- [ArchivesSpace Help Center](https://archivesspace.atlassian.net/wiki/spaces/ADC/pages/917045261/ArchivesSpace+Help+Center) (requires member login)
- [ArchivesSpace API Documentation](https://archivesspace.github.io/archivesspace/api/)
- [ArchivesSpace Website](https://archivesspace.org)

## 📄 License

This project is licensed under the ECL-2.0 License.
