---
title: Authoring content
description: This page outlines best practices for updating and writing markdown files for the tech-docs repository.
---

Tech Docs content is written in [Markdown](https://en.wikipedia.org/wiki/Markdown) which is a markup language used for formatting plain text that aims to be easy to read and write.

Tech Docs uses [GitHub-flavored Markdown](https://github.github.com/gfm/), a variant of Markdown syntax, and [SmartyPants](https://daringfireball.net/projects/smartypants/), a typographic punctuation plugin. These tools provide authors niceties like generating clickable links from text, creating lists and tables, formatting for quotations and em-dashes, and more.

## Commonly-used Markdown syntax

Common use of Markdown throughout Tech Docs includes:

- [headings](#headings)
- [links](#links)
- [emphasizing text](#emphasizing-text)
- [paragraphs](#paragraphs)
- [lists](#lists)
- [code examples](#code-examples)
- [asides](#asides)
- [images](#images)

### Headings

Start a new line with between 2 and 6 `#` symbols, followed by a single space, and then the heading text.

```md
## Example second-level heading
```

The number of `#` symbols corresponds to the heading level in the document hierarchy. **The first heading level is reserved for the page title** (available in the page [frontmatter](#frontmatter)). Therefore the first _authored_ heading on every page should be a second level heading (`##`).

:::note[Second level heading requirement]
Authored headings should start at the second level (`##`) on every page, since the first level (`#`) is reserved for the page title which is machine-generated.
:::

```md
<!-- example.md -->

## Second level heading

Notice the page starts with a second level heading.

Notice the blank lines above and below each heading.

### Third level heading

This is demo text under the Third level heading section.

#### Fourth level heading

##### Fifth level heading

###### Sixth and final level heading
```

### Links

Create a link by wrapping the link text in brackets (`[ ]`) immediately followed by the external link URL, or internal link path, wrapped in parentheses (`( )`).

```md
[text](URL or path)
```

Be sure not to include any space between the wrapped text and URL.

```md
<!-- example.md -->

See the [TechDocs source code](https://github.com/archivesspace/tech-docs).
```

#### Internal links

##### Other pages

When linking to another Tech Docs page, start with a forward slash (`/`), follwed by the location of the page as found in the `src/content/docs/` directory, and omit the file extension (`.md`).

```md
✅ [Public user interface](/architecture/public)

❌ [Public user interface](architecture/public)
❌ [Public user interface](./architecture/public)
❌ [Public user interface](../architecture/public)
❌ [Public user interface](/architecture/public.md)
```

:::note[Internal link requirements]
Links to other Tech Docs pages should:

1. start with a forward slash (`/`)
2. reflect the location of the page as found in `src/content/docs/`
3. not include the file extension (`.md`)

:::

##### Within a page

Starlight provides [automatic heading anchor links](https://starlight.astro.build/guides/authoring-content/#automatic-heading-anchor-links). To link to a section within a page, use the `#` symbol followed by the HTML `id` of the relevant section heading.

```md
<!-- src/content/docs/about/authoring.md -->

See the [Internal links](#internal-links) section on this page.

See the [Public configuration options](/architecture/public#configuration).
```

:::tip
A section heading's `id` is usually the same text string as the heading itself, but in all lowercase letters and with all single spaces converted to single hyphens. See the actual HTML `id` by right clicking on the heading to "inspect" it.
:::

### Emphasizing text

Wrap text to be emphasized with `_ ` for italics, `**` for bold, and `~~` for strikethrough.

```md
<!-- example.md -->

_Italicized_ text

**Bold** text

**_Bold and italicized_** text

~~Strikethrough~~ text
```

### Paragraphs

Create paragraphs by leaving a blank line between lines of text.

```md
<!-- example.md -->

This is one paragraph.

This is another paragraph.
```

### Lists

Precede each line in a list with a dash (`-`) for a bulleted list, or a number followed by a period (`1.`) for an ordered list.

```md
<!-- example.md -->

- Resource
- Digital Object
- Accession

1. Accession
2. Digital Object
3. Resource
```

### Code examples

Wrap inline code with a single backtick (`` ` ``).

Wrap code blocks with triple backticks (` ``` `), also known as a "code fence", placed just above and below the code. Append the name of the code's language or its file extension to the first set of backticks for syntax highlighting.

````md
<!-- example.md -->

The `JSONModel` class is central to ArchivesSpace.

```ruby
def h(str)
  ERB::Util.html_escape(str)
end
```
````

### Asides

Asides are useful for highlighting secondary or marketing information.

Wrap content in a pair of triple colons (`:::`) and append one of the aside types (ie: `note`) to the first set of colons. The aside types are `note`, `tip`, `caution`, and `danger`, each of which have their own set of colors and icon. Customize the title by wrapping text in brackets (`[ ]`) placed after the note type.

```md
<!-- example.md -->

:::tip
Become an ArchivesSpace member today! 🎉
:::

:::note[Some custom title]

### Markdown is supported in asides

![Pic alt text](../../../images/example.jpg)

Lorem ipsum dolor sit amet consectetur, adipisicing elit.
:::
```

:::note
Asides are a custom Markdown feature provided by the underlying [Starlight framework](https://starlight.astro.build/guides/authoring-content/#asides) that builds the Tech Docs.
:::

:::tip[Customize the aside title]
Customize the the aside title by wrapping text in brackets (`[ ]`) after the note type, in this case `tip`.
:::

### Images

Show an image using an exclamation point (`!`), followed by the image's [alt text](https://en.wikipedia.org/wiki/Alt_attribute) (a brief description of the image) wrapped in brackets (`[ ]`), followed by the external URL, or internal path, wrapped in parentheses (`( )`).

```md
<!-- example.md -->

![A dozen Krispy Kreme donuts in a box](https://example.com/donuts.jpg)

![The ArchivesSpace logo](../../../images/logo.svg)
```

:::note[Put images in `src/images`]
All internal images belong in the `src/images` directory. The relative path to images from this file is `../../../images`.
:::

## Frontmatter

Tech Docs uses [YAML](https://yaml.org/) frontmatter as a way to add metadata to pages for dynamic purposes. Frontmatter is a block of YAML syntax used to assign variables and more, wrapped in triple dashes (`---`). Every page must have at least its `title` defined in frontmatter.

```md
---
title: New page title
---
```

:::note[Frontmatter `title` requirement]
Every page must have frontmatter that defines the page `title`.
:::

## Image files

All internal image files used in Tech Docs content should go in the `src/images` directory, located at the root of this project.

## Writing conventions

- Plugins, not plug-ins
- Titles are sentence-case ("Application monitoring with New Relic")
- Page titles prefer '-ing' verb forms ("Using MySQL", "Serving over HTTPS")
