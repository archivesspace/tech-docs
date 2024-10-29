---
title: Development and maintenance

# This is the last page in the sidebar, so point to Home next instead of
# the Help Center which comes after this page in the sidebar
next:
  link: /
  label: Home
---

Tech Docs is a [Node.js](https://nodejs.org) application, built with [Astro](https://astro.build/) and its [Starlight](https://starlight.astro.build/) documentation site framework. The source code is hosted on [GitHub](https://github.com/archivesspace/tech-docs). The site is statically built and hosted via [Cloudflare Pages](https://pages.cloudflare.com/) with the custom domain [docs.archivesspace.org](docs.archivesspace.org). Content is written in [Markdown](./authoring#commonly-used-markdown-syntax). When the source code changes, a new set of static files are generated and published shortly after.

## Dependencies

Tech Docs depends on the following open source software (see [package.json](../../../../package.json) for version information):

1. [Node.js](https://nodejs.org) - JavaScript development platform and build tool chain
2. [Astro](https://astro.build/) - Static site generator
3. [Starlight](https://starlight.astro.build/) - Documentation site toolkit
4. [Sharp](https://sharp.pixelplumbing.com/) - Image transformation library
5. [Prettier](https://prettier.io/) - Source code formatter

## Local development

Run Tech Docs locally by cloning the repository, installing project dependencies, and spinning up a development server.

```sh
# Clone Tech Docs and move to it
git clone https://github.com/archivesspace/tech-docs.git
cd tech-docs

# Install dependencies
npm install

# Run dev server
npm start
```

Now go to [localhost:4321](http://localhost:4321) to see Tech Docs running locally.

### Build the site locally

Sometimes building the site surfaces errors not found in the development environment.

```sh
# Build the site and output it to src/dist
npm run build
```

## Update dependencies

Run the following commands locally to update dependencies, then push the changes upstream.

```sh
# List outdated dependencies
npm outdated

# Update dependencies
npm update
```
