# Tech-Docs Site Refactor

Winter 2022-23

## The Problem

The Tech-Docs site uses a Jekyll theme built into GitHub pages. The theme is outdated and inefficient for a modern day documentation site:

- navigation isn't very intuitive
- page whitespace is used very inefficiently
- Jekyll is not leveraged at all, instead the site relies on GH Pages-provided Jekyll theme and builds; this means navigation and other site-authoring features are handled manually instead of leaning into Jekyll's feature set -- this causes unnecessary duplication and errors/inconsistencies

## The Big Idea

Let's re-write the site to:

- use a new theme better suited for documentation
- prioritize local development vs relying only on GH Pages
- abstract site features into `_config.yml`
