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

#### Running Tests and Linting with Docker

From the project directory, run this command:

```console
docker-compose up --build --abort-on-container-exit

```
This will:

- Build the necessary Docker images if they aren't already there.
- Start up the server container to serve the site.
- Launch the tester container, which waits for the server to be ready and then runs all of our tests and linters.
- Automatically shut down both containers once the tests are finished.

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

Contributions are welcome! Please feel free to submit a Pull Request.

## 📖 Additional Resources

- [ArchivesSpace Help Center](https://archivesspace.atlassian.net/wiki/spaces/ADC/pages/917045261/ArchivesSpace+Help+Center) (requires member login)
- [ArchivesSpace API Documentation](https://archivesspace.github.io/archivesspace/api/)
- [ArchivesSpace Website](https://archivesspace.org)

## 📄 License

This project is licensed under the ECL-2.0 License.
