---
title: Introducing the New Tech Docs Site
description: New site!
excerpt: We've launched a completely redesigned technical documentation site built with Astro and Starlight. Learn about what's new, what's changed, and how to find what you need faster.
pubDate: 2026-03-01
authors:
  - Brian Zelip
  - Thimios Dimopulos
  - Zeff Morgan
  - Lora Woodford
---

After several years on our previous documentation platform, we're excited to announce that the ArchivesSpace technical docs have a new home—built on [Astro](https://astro.build) with the [Starlight](https://starlight.astro.build) docs theme. The new site is faster, more accessible, and much easier for contributors to maintain.

## A new foundation

The previous docs site served us well, but it had accumulated years of structural debt: inconsistent navigation, slow page loads, and a contribution workflow that required a lot of local tooling to get right. We evaluated several options and landed on Astro + Starlight for a few reasons:

- **Static output.** Every page is pre-rendered HTML. There's no server-side rendering at request time, which means fast loads and simple hosting.
- **MDX and Markdown support.** Contributors can write in plain Markdown or reach for MDX when richer components are needed—without switching tools entirely.
- **Built-in accessibility.** Starlight ships with keyboard navigation, skip links, and ARIA roles out of the box, so we're not starting from zero on accessibility.
- **A design system we can extend.** Starlight's CSS custom properties made it straightforward to apply ArchivesSpace brand colors across the entire site.

## What's new

Beyond the technology swap, we took the migration as an opportunity to improve several things that had been on the backlog:

**Full-text search.** The new site uses [Pagefind](https://pagefind.app) for client-side search. It indexes all content at build time, so search works without any backend—and returns results instantly.

**Dark mode.** System-level dark mode preference is respected automatically, and there's a toggle in the header if you want to switch manually. Both themes use ArchivesSpace's brand palette.

**Release badges.** Pages tied to a specific ArchivesSpace release now display a version badge at the top so it's immediately clear which release the content applies to.

**Improved sidebar.** The left navigation has been reorganized to better reflect how people actually use the docs—administration, customization, development, and migrations each have their own section.

## A note on URLs

We've preserved the URL structure from the previous site wherever possible. If you have bookmarks or links pointing to the old docs, they should continue to work. If you run into a broken link, please [open an issue](https://github.com/archivesspace/tech-docs/issues) and we'll get it sorted.

:::note
The API reference and Yard docs are still hosted separately at their existing URLs. Links to both can be found in the "Other resources" section of the home page.
:::

## Contributing

One of our goals with this migration was to lower the barrier to contributions. The new site uses standard Markdown files in a GitHub repository—no special tooling required beyond a text editor and a GitHub account.

To suggest a change, you can:

1. Click **Edit page** at the bottom of any docs page to open the file directly in GitHub's editor.
2. Fork the repository, make your changes locally, and open a pull request.
3. [Open an issue](https://github.com/archivesspace/tech-docs/issues) describing the problem or gap and let the team handle it.

## What's next

This launch is the beginning, not the end. A few things already in progress:

- **A blog** (you're reading it). We'll use this space for release announcements, migration guides, and longer technical write-ups that don't belong in the reference docs.
- **More migration content.** We're expanding the migration guides to cover more edge cases and institution-specific scenarios.
- **Better versioning.** We're exploring how to surface content that applies specifically to supported releases versus older versions.

We're glad you're here. If you have feedback on the new site, reach out on the [ArchivesSpace Community Forum](https://archivesspace.atlassian.net/wiki/spaces/ADC/overview) or open an issue on GitHub.
