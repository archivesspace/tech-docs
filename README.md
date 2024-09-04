# Porting tech-docs from Jekyll to 11ty

## On the value, or role, of this branch

So far, its main value lies in the ./docs dir, everything else is just 11ty implementation details. This branch should likely not be the basis for newer more official work, rather, it should be used as a reference point that provides the docs and boilerplate to manually copy, while altering newly changed files and factoring in the tests from recent PRs.

## Going forward

There is a need to add markdown linting to ensure that internal links follow the rules described herein elsewhere.

### On markdownlint

See the following libs:

- https://github.com/DavidAnson/markdownlint
- https://www.npmjs.com/package/markdownlint-rule-relative-links

## Rules for internal links to other docs pages

Interal LINKS MUST be relative and start with './' or '../', and end in '.md'

### types of classes

1. links from root level /

the ./ in all cases, ultimately is listed in a file in a dir/index.html, but

there is the html file that is linking (src) and there is the linked html file (link)

if src file name == index.md, then all links that start with ./ are ok
if src file name != index.md, then all links that start with ./ need to be changed to ../

source file name index or not
relative_path or parent_directory specifier
link is to index page

|                  | src == index.md     | src != index.md | link to index.md |
| ---------------- | --------------------| ----------------|
| relative path    | rm file extension |  ./ --> ../     |
| parent directory |  rm file extension       |              |

## Business rules

1. Navigating from page to page via GitHub.com should not be hindered by broken links, so the source files need to be written in the following manner regarding links:

```md
[ArchivesSpace technical overview](./readme_evaluate.md) ✅

[ArchivesSpace technical overview](/readme_evaluate.md) ❌
[ArchivesSpace technical overview](./readme_evaluate) ❌
[ArchivesSpace technical overview](/readme_evaluate) ❌
```

Link to the actual file when creating an internal link, even the associated README, so:

```md
[Working with the ArchivesSpace API](./api/README.md) ✅
[Languages, platforms, and included open source projects](./architecture/languages.md)

[Working with the ArchivesSpace API](./api) ❌
[Working with the ArchivesSpace API](./api) ❌
[Languages, platforms, and included open source projects](./architecture/languages.html)
```

Linking to a subdirectory in a different parent

```md
[Full instructions for using external Solr with ArchivesSpace](provisioning/solr.md) ❌
```

Ommitting the initial `./` is ok for links to files in the same dir as the link, so:

```md
# An example via docs/provisioning/tuning.md

[multitenant setup](clustering.md) ✅
```

Images are linked absolutely from the root, not relatively, so:

```md
![AT migrator](/images/at_migrator.jpg) ✅

![AT migrator](../images/at_migrator.jpg) ❌
```

1. Prioritize ease of use by non-developers
   1. remove system artifacts in the content as much as possible
      1. Keep markdown files freem from frontmatter if possible
      2. make it be viewable on github as well as its own website
   2. The mantra is, "keep the docs as clean and simple as possible", the docs should focus on content only, not the system that publishes it. It should be easy for folks to get in and get out, to grok it and be able to contribute instantly.
2. Prioritize being framework agnostic
3. Prioritize the platform
4. The docs first and foremost link to other markdown files; abstractions above the markdown source files should be updated programatically via some system.

## OLD NOTES

```md
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
```
