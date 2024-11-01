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

Tech Docs depends on the following open source software (see [package.json](https://github.com/archivesspace/tech-docs/blob/master/package.json) for current version information):

1. [Node.js](https://nodejs.org) - JavaScript development platform and build tool chain
2. [Astro](https://astro.build/) - Static site generator and JavaScript framework
3. [Starlight](https://starlight.astro.build/) - Astro plugin for building a documentation website
4. [Sharp](https://sharp.pixelplumbing.com/) - Image transformation library used by Astro
5. [Prettier](https://prettier.io/) - Source code formatter used locally in text editors and in CI for testing and build purposes

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

Now go to [localhost:4321](http://localhost:4321) to see Tech Docs running locally. Changes to the source code will be immediately reflected in the browser.

### Building the site

Building the site creates a set of static files, found in `src/dist` after build, that can be served locally or deployed to a server. Sometimes building the site surfaces errors not found in the development environment.

```sh
# Build the site and output it to src/dist
npm run build
```

## Theme customization

Starlight can be customized in various ways, including:

- [Settings](https://starlight.astro.build/guides/customization/) -- see `astro.config.mjs`
- [CSS](https://starlight.astro.build/guides/css-and-tailwind/) -- see `src/styles/custom.css`
- [UI components](https://starlight.astro.build/guides/customization/) -- see `src/components`

## Static assets

### Images

Most image files should be stored in `src/images`. This allows for [processing by Astro](https://docs.astro.build/en/guides/images/) which includes performance optimizations.

Images that should not be processed by Astro, like favicons, should be stored in `public`.

:::note[Use `src/images` for all content images]
Put all images used in Tech Docs content in `src/images`.
:::

### The `public` directory

Files placed in `public` are not processed by Astro. They are copied directly to the output and made available from the root of the site, so `public/favicon.svg` becomes available at `docs.archivesspace.org/favicon.svg`, while `public/example/slides.pdf` becomes available at `docs.archivesspace.org/example/slides.pdf`.

## Update dependencies

Run the following commands locally to update dependencies, then push the changes upstream.

```sh
# List outdated dependencies
npm outdated

# Update dependencies
npm update
```
