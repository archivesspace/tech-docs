# TD-21 i18n Project

We want to enable Starlight's internationalization feature for the TechDocs site. See the appendix section below for the contents of the current Starlight i18n documentation.

## i18n languages

1. Dutch
2. French
3. German
4. Japanese
5. Spanish
6. Ukranian

## Implementation (migration guide)

Starlight i18n is enabled. English is the root locale (served at `/` with no `/en/` prefix); every other language lives behind its own path prefix (`/nl/`, `/fr/`, `/de/`, `/ja/`, `/es/`, `/uk/`). Until a page is translated, its localized URL serves the English content with a "not yet translated" notice in the reader's language.

### What changed in the codebase

- `astro.config.mjs`: added `defaultLocale: 'root'` and a `locales` map (root + nl, fr, de, ja, es, uk). Each non-root locale sets `lang` to a value matching a built-in Starlight UI dictionary, so UI strings (search, table of contents, language picker, etc.) localize automatically.
- `src/content.config.ts`: added an `i18n` content collection (`i18nLoader()` + `i18nSchema()`) for future custom UI string overrides. No JSON files are required to start.
- `src/content/docs/{nl,fr,de,ja,es,uk}/`: empty directories created as the home for translated content.
- No changes to `src/siteNavigation.json` (the shared sidebar is localized per locale automatically), the component overrides (`Header.astro` already renders Starlight's `<LanguageSelect />`), or the blog (intentionally English-only).

### Locale config reference

| Prefix | `lang` | Picker label | UI strings |
| ------ | ------ | ------------ | ---------- |
| (root) | `en`   | English      | built-in   |
| `/nl/` | `nl`   | Nederlands   | built-in   |
| `/fr/` | `fr`   | Français     | built-in   |
| `/de/` | `de`   | Deutsch      | built-in   |
| `/ja/` | `ja`   | 日本語       | built-in   |
| `/es/` | `es`   | Español      | built-in   |
| `/uk/` | `uk`   | Українська   | built-in   |

### Adding page translations

To translate a page, follow the collaborator prompt below and save the output at `src/content/docs/{LOCALE_CODE}/{RELATIVE_PATH}` (same relative path as the English original). Once a translated file exists, Starlight stops serving the English fallback for that route and serves the translated page instead. The custom `issueUrl`/`issueText` frontmatter fields are optional and default to the project constants.

### Notes

- English content stays at `src/content/docs/` (root locale) — do not move it into an `en/` folder.
- The blog collection under `src/content/blog/` is out of scope and remains English-only.
- Translating Starlight's built-in UI strings (search, table of contents, language picker, etc. via `src/content/i18n/<lang>.json`) is out of scope for this project. This project only translates page content under `src/content/docs/`.
- Translated site titles are not configured yet; `title` is a single string. To localize it, change `title` in `astro.config.mjs` to an object keyed by `lang`.
- `npm run build` produces 480 pages across all locales with a per-locale Pagefind search index and sitemap.
- Translator-notes logs live at `i18n-notes/{LOCALE_CODE}.md` (repo root), one running, append-only file per target language. They are not part of any Starlight content collection and are never published to the site — they exist purely to give PR reviewers context on each translated page's glossary additions, uncertainties, and flagged English-source issues.

## Prompt for collaborators to create translations

Volunteer collaborators translate Tech Docs pages using an agentic tool with read/write access to this repo, then open a PR so the draft can be reviewed before it's merged. The prompt below is the **canonical prompt every collaborator should use** so translations stay consistent across languages, pages, and contributors, regardless of which agentic tool they run it in.

### How to use this prompt

1. Pick a source file under `src/content/docs/` and a target language.
2. Fill in the `{TARGET_LANGUAGE}`, `{LOCALE_CODE}`, and `{RELATIVE_PATH}` placeholders (locale codes: `nl` Dutch, `fr` French, `de` German, `ja` Japanese, `es` Spanish, `uk` Ukrainian).
3. Give the whole prompt to your agentic tool (e.g. Cursor) with access to this repo. It reads the source file and the glossary itself — no need to paste file contents.
4. The agent writes the translated file to `src/content/docs/{LOCALE_CODE}/{RELATIVE_PATH}`, adds any new glossary terms directly to [TD-21-i18n-glossary.md](TD-21-i18n-glossary.md), and appends a dated entry to `i18n-notes/{LOCALE_CODE}.md` documenting its choices and uncertainties.
5. Open a PR with these changes. **The output is always a draft**, never a final, merge-ready translation — since none of the collaborators doing this initial translation work are fluent in a language beyond English, review happens on the PR (ideally by a fluent-speaking reviewer) rather than before it's opened.

### The prompt

````md
You are assisting the ArchivesSpace Tech Docs project with translating technical documentation from English into another language, for a human volunteer to review before it is merged.

Context:

- Source: the ArchivesSpace Tech Docs site (which uses the Starlight/Astro.js framework), documenting ArchivesSpace, the open-source archives management software used by archives, libraries, and museums.
- Audience: a mix of archivists/records managers (administrators, non-developers) and developers/sysadmins who install, configure, extend, and operate ArchivesSpace.
- Output is a DRAFT. Prioritize accuracy and flag uncertainty in "Translator notes" rather than guessing silently.

Task: Translate the file below from English into {TARGET_LANGUAGE} ({LOCALE_CODE}), for use as `src/content/docs/{LOCALE_CODE}/{RELATIVE_PATH}`.

Before translating:

1. Read the {TARGET_LANGUAGE} section of `TD-21-i18n-glossary.md` in this repo. Reuse existing entries verbatim.
2. If you encounter a recurring ArchivesSpace/archival-science term not yet in the glossary, prefer the term ArchivesSpace's own application already uses in its official {LOCALE_CODE} UI translation (see locale files at github.com/archivesspace/archivesspace under `frontend/config/locales`, `public/config/locales`, `common/locales`; background in `/customization/locales`) so the docs match the software. Otherwise use the most standard professional archival-science translation for {TARGET_LANGUAGE}, not a literal/invented one. Add every such new term to the glossary and note your reasoning in the translator-notes log (see "Output" below).

Translation rules:

- Translate: headings, paragraphs, list items, table text, aside/admonition content, image alt text, and link text.
- Do NOT translate: code blocks/inline code, shell commands, file paths, YAML/JSON keys, config option names, environment variable names, class/method names, and URLs.
- Do NOT translate product/technology proper nouns (ArchivesSpace, MySQL, Solr, Docker, JRuby, GitHub, npm, etc.); follow {TARGET_LANGUAGE}'s normal convention for inflecting/declining them if needed.
- In YAML frontmatter, translate only human-facing values (`title`, `description`, and similar `label`/`tagline` fields). Leave keys and non-text values (booleans, dates, slugs) unchanged.
- Leave internal link paths (e.g. `/architecture/public`) byte-for-byte as-is; translate only the visible link text. The site automatically rewrites these to the correct locale-prefixed path at build time — do not add a locale prefix yourself.
- Preserve all Markdown/MDX syntax exactly: heading levels, code fence language/meta strings, `:::` aside types, `<Steps>`/`<FileTree>` tags and props, table structure, and Mermaid syntax (translate only quoted labels inside `mermaid` blocks, never the diagram syntax).
- Follow {TARGET_LANGUAGE}'s own grammar/capitalization/punctuation conventions rather than mirroring English (see `/about/authoring#writing-conventions` for the English baseline this content follows).
- Use a formal, neutral, precise technical register; avoid regional slang.
- Do not add, remove, reorder, or "fix" content. If you spot an English error, note it instead of silently changing meaning.

Source file: read `src/content/docs/{RELATIVE_PATH}` directly from this repo.

Output — perform these actions directly in this repo; do not just print results in chat:

1. Write the full translated file (frontmatter included) to `src/content/docs/{LOCALE_CODE}/{RELATIVE_PATH}`.
2. If you proposed any new glossary terms, add them as new rows to the {TARGET_LANGUAGE} table in `TD-21-i18n-glossary.md`.
3. Append a new section to `i18n-notes/{LOCALE_CODE}.md` (create the file with a top-level heading if it doesn't exist yet) titled with today's date and the relative path you just translated, listing: (a) any new glossary terms you added and why, (b) terms/sentences you were unsure about and why, (c) issues noticed in the English source but not changed.
````

### Growing the glossary

The glossary in [TD-21-i18n-glossary.md](TD-21-i18n-glossary.md) is seeded with terms that already recur across the docs, but it will always be incomplete — new pages introduce new terms. The feedback loop:

1. While translating, the agent checks the glossary first and reuses existing entries verbatim.
2. When it hits a recurring term that isn't in the glossary yet, it adds a new row directly to that language's table in `TD-21-i18n-glossary.md` and records its reasoning in the corresponding entry it appends to `i18n-notes/{LOCALE_CODE}.md`.
3. A human reviewer checks the proposed glossary row during PR review (ideally more than one set of eyes for less common languages) and can request changes before merge, so every later translation of that term — on any page, by any collaborator — stays consistent.

## Apendix

### Starlight i18n documentation

NOTE: The following is the raw markdown file for the documentation from the source code on GitHub.

---

title: Internationalization (i18n)
description: Learn how to configure your Starlight site to support multiple languages.

---

import { FileTree, Steps } from '@astrojs/starlight/components';

Starlight provides built-in support for multilingual sites, including routing, fallback content, and full right-to-left (RTL) language support.

## Configure i18n

<Steps>

1. Tell Starlight about the languages you support by passing [`locales`](/reference/configuration/#locales) and [`defaultLocale`](/reference/configuration/#defaultlocale) to the Starlight integration:

   ```js {9-26}
   // astro.config.mjs
   import { defineConfig } from 'astro/config'
   import starlight from '@astrojs/starlight'

   export default defineConfig({
     integrations: [
       starlight({
         title: 'My Docs',
         // Set English as the default language for this site.
         defaultLocale: 'en',
         locales: {
           // English docs in `src/content/docs/en/`
           en: {
             label: 'English'
           },
           // Simplified Chinese docs in `src/content/docs/zh-cn/`
           'zh-cn': {
             label: '简体中文',
             lang: 'zh-CN'
           },
           // Arabic docs in `src/content/docs/ar/`
           ar: {
             label: 'العربية',
             dir: 'rtl'
           }
         }
       })
     ]
   })
   ```

   Your `defaultLocale` will be used for fallback content and UI labels, so choose the language you are most likely to start writing content in, or already have content for.

2. Create a directory for each language in `src/content/docs/`.
   For example, for the configuration shown above, create the following folders:

   <FileTree>
   - src/
     - content/
       - docs/
         - ar/
         - en/
         - zh-cn/

   </FileTree>

3. You can now add content files in your language directories. Use the same file name to associate pages across languages and take advantage of Starlight’s full set of i18n features, including fallback content, translation notices, and more.

   For example, create `ar/index.md` and `en/index.md` to represent the homepage for Arabic and English respectively.

</Steps>

For more advanced i18n scenarios, Starlight also supports configuring internationalization using the [Astro’s `i18n` config](https://docs.astro.build/en/guides/internationalization/#configure-i18n-routing) option.

### Use a root locale

You can use a “root” locale to serve a language without any i18n prefix in its path. For example, if English is your root locale, an English page path would look like `/about` instead of `/en/about`.

To set a root locale, use the `root` key in your `locales` config. If the root locale is also the default locale for your content, remove `defaultLocale` or set it to `'root'`.

```js {9,11-14}
// astro.config.mjs
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

export default defineConfig({
  integrations: [
    starlight({
      title: 'My Docs',
      defaultLocale: 'root', // optional
      locales: {
        root: {
          label: 'English',
          lang: 'en' // lang is required for root locales
        },
        'zh-cn': {
          label: '简体中文',
          lang: 'zh-CN'
        }
      }
    })
  ]
})
```

When using a `root` locale, keep pages for that language directly in `src/content/docs/` instead of in a dedicated language folder. For example, here are the home page files for English and Chinese when using the config above:

<FileTree>

- src/
  - content/
    - docs/
      - **index.md**
      - zh-cn/
        - **index.md**

</FileTree>

#### Monolingual sites

By default, Starlight is a monolingual (English) site. To create a single language site in another language, set it as the `root` in your `locales` config:

```diff lang="js" {10-13}
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	integrations: [
		starlight({
			title: 'My Docs',
			locales: {
				root: {
					label: '简体中文',
					lang: 'zh-CN',
				},
			},
		}),
	],
});
```

This allows you to override Starlight’s default language without enabling other internationalization features for multi-language sites, such as the language picker.

## Fallback content

Starlight expects you to create equivalent pages in all your languages. For example, if you have an `en/about.md` file, create an `about.md` for each other language you support. This allows Starlight to provide automatic fallback content for pages that have not yet been translated.

If a translation is not yet available for a language, Starlight will show readers the content for that page in the default language (set via `defaultLocale`). For example, if you have not yet created a French version of your About page and your default language is English, visitors to `/fr/about` will see the English content from `/en/about` with a notice that this page has not yet been translated. This helps you add content in your default language and then progressively translate it when your translators have time.

## Translate the site title

By default, Starlight will use the same site title for all languages.
If you need to customize the title for each locale, you can pass an object to [`title`](/reference/configuration/#title-required) in Starlight’s options:

```diff lang="js"
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	integrations: [
		starlight({
-			title: 'My Docs',
+			title: {
+				en: 'My Docs',
+				'zh-CN': '我的文档',
+			},
			defaultLocale: 'en',
			locales: {
				en: { label: 'English' },
				'zh-cn': { label: '简体中文', lang: 'zh-CN' },
			},
		}),
	],
});
```

## Translate Starlight's UI

import LanguagesList from '~~/components/languages-list.astro';
import UIStringsList from '~~/components/ui-strings-list.astro';

In addition to hosting translated content files, Starlight allows you to translate the default UI strings (e.g. the "On this page" heading in the table of contents) so that your readers can experience your site entirely in the selected language.

<LanguagesList startsSentence /> translated UI strings are provided out of the
box, and we welcome [contributions to add more default
languages](https://github.com/withastro/starlight/blob/main/CONTRIBUTING.md).

You can provide translations for additional languages you support — or override our default labels — via the `i18n` data collection.

<Steps>

1. Configure the `i18n` data collection in `src/content.config.ts` if it isn’t configured already:

   ```diff lang="js" ins=/, (i18nLoader|i18nSchema)/
   // src/content.config.ts
   import { defineCollection } from 'astro:content';
   import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
   import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

   export const collections = {
   	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
   +	i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
   };
   ```

2. Create a JSON file in `src/content/i18n/` for each additional locale you want to provide UI translation strings for.
   For example, this would add translation files for Arabic and Simplified Chinese:

   <FileTree>
   - src/
     - content/
       - i18n/
         - ar.json
         - zh-CN.json

   </FileTree>

3. Add translations for the keys you want to translate to the JSON files. Translate only the values, leaving the keys in English (e.g. `"search.label": "Buscar"`).

   These are the English defaults of the existing strings Starlight ships with:

   <UIStringsList />

   Starlight’s code blocks are powered by the [Expressive Code](https://expressive-code.com/) library.
   You can set translations for its UI strings in the same JSON file using `expressiveCode` keys:

   ```json
   {
     "expressiveCode.copyButtonCopied": "Copied!",
     "expressiveCode.copyButtonTooltip": "Copy to clipboard",
     "expressiveCode.terminalWindowFallbackTitle": "Terminal window"
   }
   ```

   Starlight’s search modal is powered by the [Pagefind](https://pagefind.app/) library.
   You can set translations for Pagefind’s UI in the same JSON file using `pagefind` keys:

   ```json
   {
     "pagefind.clear_search": "Clear",
     "pagefind.load_more": "Load more results",
     "pagefind.search_label": "Search this site",
     "pagefind.filters_label": "Filters",
     "pagefind.zero_results": "No results for [SEARCH_TERM]",
     "pagefind.many_results": "[COUNT] results for [SEARCH_TERM]",
     "pagefind.one_result": "[COUNT] result for [SEARCH_TERM]",
     "pagefind.alt_search": "No results for [SEARCH_TERM]. Showing results for [DIFFERENT_TERM] instead",
     "pagefind.search_suggestion": "No results for [SEARCH_TERM]. Try one of the following searches:",
     "pagefind.searching": "Searching for [SEARCH_TERM]..."
   }
   ```

 </Steps>

### Extend translation schema

Add custom keys to your site’s translation dictionaries by setting `extend` in the `i18nSchema()` options.
In the following example, a new, optional `custom.label` key is added to the default keys:

```diff lang="js"
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
	i18n: defineCollection({
		loader: i18nLoader(),
		schema: i18nSchema({
+			extend: z.object({
+				'custom.label': z.string().optional(),
+			}),
		}),
	}),
};
```

Learn more about content collection schemas in [“Defining a collection schema”](https://docs.astro.build/en/guides/content-collections/#defining-the-collection-schema) in the Astro docs.

## Using UI translations

You can access Starlight’s [built-in UI strings](/guides/i18n/#translate-starlights-ui) as well as [user-defined](/guides/i18n/#extend-translation-schema), and [plugin-provided](/reference/plugins/#injecttranslations) UI strings through a unified API powered by [i18next](https://www.i18next.com/).
This includes support for features like [interpolation](https://www.i18next.com/translation-function/interpolation) and [pluralization](https://www.i18next.com/translation-function/plurals).

In Astro components, this API is available as part of the [global `Astro` object](https://docs.astro.build/en/reference/api-reference/#locals) as `Astro.locals.t`:

```astro title="example.astro"
<p dir={Astro.locals.t.dir()}>
  {Astro.locals.t('404.text')}
</p>
```

You can also use the API in [endpoints](https://docs.astro.build/en/guides/endpoints/), where the `locals` object is available as part of the [endpoint context](https://docs.astro.build/en/reference/api-reference/#locals):

```ts title="src/pages/404.ts"
export const GET = (context) => {
  return new Response(context.locals.t('404.text'))
}
```

In the context of a Starlight plugin, you can use the [`useTranslations()`](/reference/plugins/#usetranslations) helper to access this API for a specific language.
See the [plugins reference](/reference/plugins/) for more information.

### Rendering a UI string

Render UI strings using the `locals.t()` function.
This is an instance of i18next’s `t()` function, which takes a UI string key as its first argument and returns the corresponding translation for the current language.

For example, given a custom translation file with the following content:

```json title="src/content/i18n/en.json"
{
  "link.astro": "Astro documentation",
  "link.astro.custom": "Astro documentation for {{feature}}"
}
```

The first UI string can be rendered by passing `'link.astro'` to the `t()` function:

```astro {3}
<!-- src/components/Example.astro -->
<a href="https://docs.astro.build/">
  {Astro.locals.t('link.astro')}
</a>
<!-- Renders: <a href="...">Astro documentation</a> -->
```

The second UI string uses i18next’s [interpolation syntax](https://www.i18next.com/translation-function/interpolation) for the `{{feature}}` placeholder.
The value for `feature` must be set in an options object passed as the second argument to `t()`:

```astro {3}
<!-- src/components/Example.astro -->
<a href="https://docs.astro.build/en/guides/astro-db/">
  {Astro.locals.t('link.astro.custom', { feature: 'Astro DB' })}
</a>
<!-- Renders: <a href="...">Astro documentation for Astro DB</a> -->
```

See the [i18next documentation](https://www.i18next.com/overview/api#t) for more information on how to use the `t()` function with interpolation, formatting, and more.

### Advanced APIs

#### `t.all()`

The `locals.t.all()` function returns an object containing all UI strings available for the current locale.

```astro
---
// src/components/Example.astro
const allStrings = Astro.locals.t.all()
//    ^
//    {
//      "skipLink.label": "Skip to content",
//      "search.label": "Search",
//      …
//    }
---
```

#### `t.exists()`

To check if a translation key exists, use the `locals.t.exists()` function with the translation key as first argument.
Pass an optional second argument if you need to check if a translation exists for a specific locale.

```astro
---
// src/components/Example.astro
const keyExists = Astro.locals.t.exists('a.key')
//    ^ true
const keyExistsInFrench = Astro.locals.t.exists('other.key', { lngs: ['fr'] })
//    ^ false
---
```

See the [`exists()` reference in the i18next documentation](https://www.i18next.com/overview/api#exists) for more information.

#### `t.dir()`

The `locals.t.dir()` function returns the text direction of the current or a specific locale.

```astro
---
// src/components/Example.astro
const currentDirection = Astro.locals.t.dir()
//    ^
//    'ltr'
const arabicDirection = Astro.locals.t.dir('ar')
//    ^
//    'rtl'
---
```

See the [`dir()` reference in the i18next documentation](https://www.i18next.com/overview/api#dir) for more information.

## Accessing the current locale

You can use [`Astro.currentLocale`](https://docs.astro.build/en/reference/api-reference/#currentlocale) to read the current locale in `.astro` components.

The following example reads the current locale and uses it with the [`getRelativeLocaleUrl()`](https://docs.astro.build/en/reference/modules/astro-i18n/#getrelativelocaleurl) helper to generate a link to an about page in the current language:

```astro
---
// src/components/AboutLink.astro
import { getRelativeLocaleUrl } from 'astro:i18n'
---

<a href={getRelativeLocaleUrl(Astro.currentLocale ?? 'en', 'about')}>About</a>
```
