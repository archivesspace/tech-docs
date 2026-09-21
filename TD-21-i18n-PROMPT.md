# Prompt

You are assisting the ArchivesSpace Tech Docs project with translating technical documentation from English into another language, for a human volunteer to review before it is merged.

## Context

- Source: the ArchivesSpace Tech Docs site (this repo, which uses the Starlight/Astro.js framework), documenting ArchivesSpace, the open-source archives management software used by archives, libraries, and museums.
- Audience: a mix of archivists/records managers (administrators, non-developers) and developers/sysadmins who install, configure, extend, and operate ArchivesSpace.
- Output is a DRAFT. Prioritize accuracy and flag uncertainty in "Translator notes" rather than guessing silently.

## Task

Translate the file listed below in the 'Source file' section from English into {TARGET_LANGUAGE} ({LOCALE_CODE}), for use as `src/content/docs/{LOCALE_CODE}/{RELATIVE_FILE_NAME}`.

Before translating:

1. Read the {TARGET_LANGUAGE} section of `TD-21-i18n-glossary.md` in this repo. Reuse existing entries verbatim.
2. If you encounter a recurring ArchivesSpace/archival-science term not yet in the glossary, prefer the term ArchivesSpace's own application already uses in its official {LOCALE_CODE} UI translation (see locale files at github.com/archivesspace/archivesspace under `frontend/config/locales`, `public/config/locales`, `common/locales`; background in `/customization/locales`) so the docs match the software. Otherwise use the most standard professional archival-science translation for {TARGET_LANGUAGE}, not a literal/invented one. Add every such new term to the glossary and note your reasoning in the translator-notes log (see "Output" below).

### Translation rules

- Translate: headings, paragraphs, list items, table text, aside/admonition content, image alt text, and link text.
- Do NOT translate: code blocks/inline code, shell commands, file paths, YAML/JSON keys, config option names, environment variable names, class/method names, and URLs.
- Do NOT translate product/technology proper nouns (ArchivesSpace, MySQL, Solr, Docker, JRuby, GitHub, npm, etc.); follow {TARGET_LANGUAGE}'s normal convention for inflecting/declining them if needed.
- In YAML frontmatter, translate only human-facing values (`title`, `description`, and similar `label`/`tagline` fields). Leave keys and non-text values (booleans, dates, slugs) unchanged.
- Leave internal link paths (e.g. `/architecture/public`) byte-for-byte as-is; translate only the visible link text. The site automatically rewrites these to the correct locale-prefixed path at build time — do not add a locale prefix yourself.
- Preserve all Markdown/MDX syntax exactly: heading levels, code fence language/meta strings, `:::` aside types, `<Steps>`/`<FileTree>` tags and props, table structure, and Mermaid syntax (translate only quoted labels inside `mermaid` blocks, never the diagram syntax).
- Follow {TARGET_LANGUAGE}'s own grammar/capitalization/punctuation conventions rather than mirroring English (see `/about/authoring#writing-conventions` for the English baseline this content follows).
- Use a formal, neutral, precise technical register; avoid regional slang.
- Do not add, remove, reorder, or "fix" content. If you spot an English error, note it instead of silently changing meaning.

### Source file

Read `src/content/docs/{RELATIVE_FILE_NAME}` directly from this repo. `{RELATIVE_FILE_NAME}` must match the English original exactly (same filename and directory segments); do not translate or rename the path.

### Output

Perform these actions directly in this repo; do not just print results in chat:

1. Write the full translated file (frontmatter included) to `src/content/docs/{LOCALE_CODE}/{RELATIVE_FILE_NAME}`.
2. If you proposed any new glossary terms, add them as new rows to the {TARGET_LANGUAGE} table in `TD-21-i18n-glossary.md`.
3. Append a new section to `i18n-notes/{LOCALE_CODE}.md` (create the file with a top-level heading if it doesn't exist yet) titled with today's date and the relative path you just translated, listing: (a) any new glossary terms you added and why, (b) terms/sentences you were unsure about and why, (c) issues noticed in the English source but not changed.
