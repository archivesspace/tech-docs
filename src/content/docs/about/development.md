---
title: Development
description: This page describes how to set up the tech-docs repostory, build the website, update dependencies, and run tests
# This is the last page in the sidebar, so point to Home next instead of
# the Help Center which comes after this page in the sidebar
next:
  link: /
  label: Home
---

Tech Docs is a [Node.js](https://nodejs.org) application, built with [Astro](https://astro.build/) and its [Starlight](https://starlight.astro.build/) documentation site framework. The source code is hosted on [GitHub](https://github.com/archivesspace/tech-docs). The site is statically built and (temporarily) hosted via [Cloudflare Pages](https://pages.cloudflare.com/). Content is written in [Markdown](/about/authoring#markdown). When the source code changes, a new set of static files are generated and published shortly after.

## Dependencies

Tech Docs depends on the following open source software (see `.nvmrc` and `package.json` for versions):

1. [Node.js](https://nodejs.org) - JavaScript development and build environment; the version noted in `.nvmrc` reflects the default version of Node.js in the Cloudflare Pages build image
2. [Astro](https://astro.build/) - Static site generator conceptually based on "components" (React, Vue, Svelte, etc.) rather than "templates" (Jekyll, Handlebars, Pug, etc.)
   1. [Starlight](https://starlight.astro.build/) - Astro plugin and theme for documentation websites
   2. [Sharp](https://sharp.pixelplumbing.com/) - Image transformation library used by Astro
3. [Cypress](https://www.cypress.io/) - End-to-end testing framework
4. [Stylelint](https://stylelint.io/) - CSS linter used locally in text editors and remotely in [CI](#cicd) for testing
   1. [stylelint-config-recommended](https://github.com/stylelint/stylelint-config-recommended) - Base set of lint rules
   2. [postcss-html](https://github.com/ota-meshi/postcss-html) - PostCSS syntax for parsing HTML (and HTML-like including .astro files)
   3. [stylelint-config-html](https://github.com/ota-meshi/stylelint-config-html) - Allows Stylelint to parse .astro files
5. [Prettier](https://prettier.io/) - Source code formatter used locally in text editors and remotely in [CI](#cicd) for testing
   1. [prettier-plugin-astro](https://github.com/withastro/prettier-plugin-astro) - Allows Prettier to parse .astro files via the command line

## Local development

Run Tech Docs locally by cloning the Tech Docs repository, installing project dependencies, and spinning up a development server:

```sh
# Requires git and Node.js

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

Building the site creates a set of static files, found in `dist` after build, that can be served locally or deployed to a server. Sometimes building the site surfaces errors not found in the development environment.

```sh
# Build the site and output it to dist/
npm run build
```

:::tip
Serve the built output by running `npm run preview` after a build.
:::

### Available `npm` scripts

The following scripts are made available via `package.json`. Invoke any script on the command line from the project root by prepending it with the `npm run` command, ie: `npm run start`.

- `start` -- run Astro dev server
- `build` -- build Tech Docs for production
- `preview` -- serve the static build
- `astro` -- get Astro help
- `test:dev` -- run tests in development mode
- `test:prod` -- run tests in production mode
- `test` -- defaults to run tests in production mode
- `prettier:check` -- check formatting with Prettier
- `prettier:fix` -- fix possible format errors with Prettier
- `stylelint:check` -- lint CSS with Stylelint
- `stylelint:fix` -- fix possible CSS lint errors with Stylelint

## Search

Site search is a [Starlight feature](https://starlight.astro.build/guides/site-search/):

> By default, Starlight sites include full-text search powered by [Pagefind](https://pagefind.app/), which is a fast and low-bandwidth search tool for static sites.
>
> No configuration is required to enable search. Build and deploy your site, then use the search bar in the site header to find content.

:::note
Search only runs in production builds not in the dev server.
:::

## YAML frontmatter and content schemas

Frontmatter for both documentation pages and blog posts is validated at build time through `src/content.config.ts`. For copy-paste templates and a short description of each field authors should set, see [YAML frontmatter](/about/authoring#yaml-frontmatter). The sections below cover the full Starlight field set for docs, what is required versus optional, and how blog metadata is rendered in the UI.

### Documentation pages

Documentation pages use [Starlight’s frontmatter schema](https://starlight.astro.build/reference/frontmatter/) extended with `issueUrl` and `issueText` in `src/content.config.ts`. Starlight requires a `title`; other keys are optional unless your page has a specific need.

| Field             | Required | Purpose                                                                                                                                                                                                                 |
| ----------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`           | Yes      | Page title in the layout, browser tab, and metadata.                                                                                                                                                                    |
| `description`     | No       | Short summary for SEO, search, and social previews. Most pages set this; it is omitted on a few pages (for example [Staff interface](/architecture/frontend), [404](/404)).                                             |
| `slug`            | No       | Overrides the URL segment instead of deriving it from the file path.                                                                                                                                                    |
| `editUrl`         | No       | Overrides the “Edit page” URL, or `false` to hide the link (for example on [404](/404)).                                                                                                                                |
| `head`            | No       | Extra tags for the document head (meta, link, custom title, etc.).                                                                                                                                                      |
| `tableOfContents` | No       | Table of contents: `false` to hide, or `{ minHeadingLevel, maxHeadingLevel }` to tune range.                                                                                                                            |
| `template`        | No       | Starlight layout template (for example `splash`).                                                                                                                                                                       |
| `hero`            | No       | Hero area for splash-style pages (`title`, `tagline`, optional `image`, `actions`, etc.).                                                                                                                               |
| `banner`          | No       | Optional banner above the page content.                                                                                                                                                                                 |
| `lastUpdated`     | No       | Override the displayed last-updated date, or `false` to hide it.                                                                                                                                                        |
| `prev`            | No       | Previous pagination link: `false`, a string label, or `{ link, label }`.                                                                                                                                                |
| `next`            | No       | Next pagination link: `false`, a string label, or `{ link, label }`. For example, [Development](/about/development) sets this so “next” goes to Home instead of the external Help Center entry after it in the sidebar. |
| `pagefind`        | No       | Set `false` to omit the page from the Pagefind index.                                                                                                                                                                   |
| `draft`           | No       | When `true`, exclude the page from production builds.                                                                                                                                                                   |
| `sidebar`         | No       | Per-page sidebar label, order, badge, `hidden`, or link `attrs`. The main sidebar structure is configured in `src/siteNavigation.json`.                                                                                 |
| `issueUrl`        | No       | URL for the footer “report an issue” link, or `false` to hide it. Defaults in `src/content.config.ts` when omitted; authors may set explicitly (see [YAML frontmatter](/about/authoring#yaml-frontmatter)).             |
| `issueText`       | No       | Label text for that footer link. Defaults in `src/content.config.ts` when omitted; authors may set explicitly (see [YAML frontmatter](/about/authoring#yaml-frontmatter)).                                              |

### Blog posts

The `blog` collection uses a Zod schema defined in `src/content.config.ts`.

| Field             | Required | Purpose                                                                                                                                                                            |
| ----------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`           | Yes      | Post headline on the post page and index card. May include HTML for display; the document `<title>` and prev/next pagination labels **strip HTML** from `title`.                   |
| `metaDescription` | Yes      | Short summary for page meta description (SEO). Used as the index teaser text when `teaser` is omitted.                                                                             |
| `teaser`          | No       | HTML or plain text for the blog index card (`set:html`). Prefer this for links or light HTML on the index; plain text in `title` is safest where tab titles and pagination matter. |
| `pubDate`         | Yes      | Publication date; posts are sorted by this field, newest first. Parsed from frontmatter and formatted for display in **UTC** on the index and post header.                         |
| `authors`         | Yes      | Array of author display names; shown comma-separated on the index and post page.                                                                                                   |
| `updatedDate`     | No       | Optional revision date (`YYYY-MM-DD`). Stored in frontmatter but **not shown in the UI** today; useful for future display or consistency with the authoring template.              |

## Blog

The [blog](/blog) is implemented as an Astro content collection alongside the docs collection. Post source files are in `src/content/blog/`; routes live under `src/pages/blog/`. There is no separate blog build step—blog pages are part of the normal Astro static output, and site search ([Search](#search)) indexes them like other HTML. For where to put files and example frontmatter, see [Authoring content](/about/authoring#where-pages-go) and [YAML frontmatter](/about/authoring#yaml-frontmatter). For schema, validation, and HTML behavior, see [YAML frontmatter and content schemas](#yaml-frontmatter-and-content-schemas) above.

### Blog content collection

The `blog` collection is registered in `src/content.config.ts` with a Zod schema. Adding or renaming frontmatter fields requires updating that schema and every consumer of `entry.data` (blog pages, middleware, and tests).

### Blog routes

- `src/pages/blog/index.astro` — `/blog` index; loads posts, sorts by `pubDate` descending, passes data to the index UI.
- `src/pages/blog/[id].astro` — individual posts; `getStaticPaths` comes from the collection, so new valid posts appear on the next build.

### Blog route middleware

`src/blogRouteData.js` is Starlight route middleware for blog routes. It injects `pubDate`, `authors`, and `postTitle` for post pages and sets prev/next pagination (older post as “Previous,” newer as “Next”). Pagination labels use titles with HTML stripped.

### Blog UI components

| Area                                 | Location                                                                      |
| ------------------------------------ | ----------------------------------------------------------------------------- |
| Index list and cards                 | `src/components/BlogIndex.astro`                                              |
| Index page title                     | `src/components/BlogIndexTitleHeader.astro`                                   |
| Post title, date, authors, back link | `src/components/BlogPostTitleHeader.astro`, `src/components/BackToBlog.astro` |
| Default vs blog title                | `src/components/CustomPageTitle.astro`                                        |
| Header “Blog” link                   | `src/components/overrides/Header.astro`                                       |
| Blog layout / sidebar behavior       | `src/components/overrides/PageFrame.astro`                                    |

### Blog tests

End-to-end coverage is in `cypress/e2e/blog.cy.js`. Update these tests when you change blog markup, URLs, or visible behavior.

## Adding new pages

Adding a new page depends on whether the content is part of the docs collection or the blog collection.

### Documentation pages

Add a new documentation page by following this workflow:

1. Create a Markdown file in the appropriate docs section directory under `src/content/docs/`.
2. Add that page to `src/siteNavigation.json` in the correct section and in the correct order so it appears in the sidebar navigation.
3. If the new page becomes the first page in its section, update the corresponding homepage hero link in `src/components/HomePage.astro` so the section link points to the new first page.

Some section directories still contain legacy `index.md` pages from the old Tech Docs site. Those pages can still be routed (for example `/architecture` and `/architecture/index`), but they are not included in the sidebar since they are note listed in `src/siteNavigation.json`.

### Blog posts

Add a new blog post by creating a new Markdown file in `src/content/blog/` with the required frontmatter fields (`title`, `metaDescription`, `pubDate`, and `authors`).

Optional fields (`teaser` and `updatedDate`) can also be added as needed. No `src/siteNavigation.json` changes are required for blog posts; valid files in the collection are included automatically when the site builds.

## Theme customization

Starlight can be customized in various ways, including:

- [Settings](https://starlight.astro.build/guides/customization/) -- see `astro.config.mjs`
- [CSS](https://starlight.astro.build/guides/css-and-tailwind/) -- see `src/styles/custom.css`
- [Components](https://starlight.astro.build/guides/overriding-components/) -- see `src/components`

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
import relativeA from '../../images/A_logo.svg' // no alias
import aliasA from '@images/A_logo.svg' // alias
---
```

## Sitemap

Starlight has built-in [sitemap support](https://starlight.astro.build/guides/customization/#enable-sitemap) which is enabled via the top-level `site` key in `astro.config.mjs`. This key generates `/sitemap-index.xml` and `/sitemap-0.xml` when Tech Docs is [built](#building-the-site), and adds the sitemap link to the `<head>` of every page. `public/robots.txt` also points to the sitemap.

## Testing

### End-to-end

Tech Docs uses [Cypress](https://www.cypress.io/) for end-to-end testing customizations made to the underlying Starlight framework and other project needs. End-to-end tests are located in `cypress/e2e`.

Run the Cypress tests locally by first building and serving the site:

```sh
# Build the site
npm run build

# Serve the build output
npm run preview
```

Then **in a different terminal** initiate the tests:

```sh
# Run the tests
npm test
```

### Code style

Nearly all files in the Tech Docs code base get formatted by [Prettier](https://prettier.io/) to ensure consistent readability and syntax. Run Prettier locally to find format errors and automatically fix them when possible:

```sh
# Check formatting of .md, .css, .astro, .js, .yml, etc. files
npm run prettier:check

# Fix any errors that can be overwritten automatically
npm run prettier:fix
```

All CSS in .css and .astro files are linted by [Stylelint](https://stylelint.io/) to help avoid errors and enforce conventions. Run Stylelint locally to find lint errors and automatically fix them when possible:

```sh
# Check all CSS
npm run stylelint:check

# Fix any errors that can be overwritten automatically
npm run stylelint:fix
```

### CI/CD

Before new changes are accepted into the code base, the [end-to-end](#end-to-end) and [code style](#code-style) tests need to pass. Tech Docs uses [GitHub Actions](https://docs.github.com/en/actions) for its continuous integration and continuous delivery (CI/CD) platform, which automates the testing and deployment processes. The tests are defined in yaml files found in `.github/workflows/` and are run automatically when new changes are proposed.
