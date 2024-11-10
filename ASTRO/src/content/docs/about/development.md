---
title: Development and maintenance

# This is the last page in the sidebar, so point to Home next instead of
# the Help Center which comes after this page in the sidebar
next:
  link: /
  label: Home
---

Tech Docs is a [Node.js](https://nodejs.org) application, built with [Astro](https://astro.build/) and its [Starlight](https://starlight.astro.build/) documentation site framework. The source code is hosted on [GitHub](https://github.com/archivesspace/tech-docs). The site is statically built and hosted via [Cloudflare Pages](https://pages.cloudflare.com/). Content is written in [Markdown](./authoring#commonly-used-markdown-syntax). When the source code changes, a new set of static files are generated and published shortly after.

## Dependencies

Tech Docs depends on the following open source software (see [package.json](https://github.com/archivesspace/tech-docs/blob/master/package.json) for current version information):

1. [Node.js](https://nodejs.org) - JavaScript development and build environment
2. [Astro](https://astro.build/) - Static site generator conceptually based on "components" (React, Vue, Svelte, etc.) rather than "templates" (Handlebars, Pug, Haml, etc.)
3. [Starlight](https://starlight.astro.build/) - Astro plugin and theme for documentation websites
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

## Search

Site search is a [Starlight feature](https://starlight.astro.build/guides/site-search/):

> By default, Starlight sites include full-text search powered by [Pagefind](https://pagefind.app/), which is a fast and low-bandwidth search tool for static sites.
>
> No configuration is required to enable search. Build and deploy your site, then use the search bar in the site header to find content.

:::note
Tech Docs search does not run in local development.
:::

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

## Update npm dependencies

Run the following commands locally to update the npm dependencies, then push the changes upstream.

```sh
# List outdated dependencies
npm outdated

# Update dependencies
npm update
```

## Import aliases

Astro supports [import aliases](https://docs.astro.build/en/guides/imports/#aliases) which provide shortcuts to writing long relative import paths.

```astro title="src/components/overrides/Example.astro" del="../../images" ins="@images"
---
import relativeA from '../../images/A_logo.svg'; // no alias
import aliasA from '@images/A_logo.svg' // alias
---
```

## Sitemap

Starlight has built-in [sitemap support](https://starlight.astro.build/guides/customization/#enable-sitemap) which is enabled via the top-level `site` key in `astro.config.mjs`. This key generates `/sitemap-index.xml` and `/sitemap-0.xml` when Tech Docs is [built](#building-the-site), and adds the sitemap link to the `<head>` of every page. `public/robots.txt` also points to the sitemap.
