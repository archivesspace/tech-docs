# Translator notes

## 2026-10-26 — `src/content/docs/nl/authoring_nl.md`

- **Glossary:** The existing `Plugin` entry was filled in as `plug-in`, the conventional Dutch spelling; no new glossary row was added. The term is used in the source's writing conventions and in the description of SmartyPants. The English instruction prefers “plugins” without a hyphen; the Dutch version follows the Dutch spelling instead.
- **Uncertainty:** The English convention recommending `-ing` verb forms for documentation-page titles is specific to English. It is rendered as a preference for Dutch infinitives, which convey the equivalent title style without reproducing the English suffix rule.
- **English-source issues not changed:** The source says “Customize the the aside title,” with a duplicated “the”; its instruction says to use `_ ` for italics, including a space after the underscore even though the examples do not use one. The supplied source path `src/content/docs/authoring_nl.md` does not exist; the available English page is `src/content/docs/about/authoring.md`.

## 2026-10-26 — `src/content/docs/nl/development_nl.md`

- **Glossary:** Filled the existing `Staff interface` entry as `medewerkersinterface`. The ArchivesSpace locale search did not surface a Dutch UI locale file or an official Dutch label for this term, so this uses a clear, standard Dutch compound rather than claiming an official UI translation. No new glossary rows were added.
- **Uncertainty:** The source uses “Help Center” as the name of an external navigation destination, so it remains untranslated as a proper label. The source path specified in the request, `src/content/docs/development_nl.md`, does not exist; the supplied English source is `src/content/docs/about/development.md`.
- **English-source issues not changed:** The source description misspells “repository” as “repostory”; the `npm` scripts paragraph uses “ie” where “i.e.” is intended; and the Mermaid accessibility bullet says “bor” instead of “for”. These were noted rather than changed in the English source.

## 2026-10-27 — `src/content/docs/nl/backup.md`

- **Glossary:** Added the Dutch glossary entry `Database dump` → `database-dump` because this page repeatedly refers to the exported SQL snapshot produced by `mysqldump`; Dutch technical usage commonly uses that compound, and there is no ArchivesSpace-specific Dutch UI term for the concept.
- **Uncertainty:** In Dutch, I used `back-up` and `database-dump` depending on whether the sentence referred to the process or the exported artifact, since the English source alternates between those meanings. The source uses "demo database" as a production warning label; I rendered it as `demodatabase` in running prose but kept the code examples unchanged.
- **English-source issues not changed:** The source contains a typographical oddity in the warning sentence `Note: _NEVER use the demo database in production._.` with an extra period before the closing emphasis, and the Ruby example uses escaped underscores in the configuration key `AppConfig[:demo\_db\_backup\_number\_to\_keep]`; both are code or source-text quirks, so I left them untouched.

## 2026-10-27 — `src/content/docs/nl/docker.md`

- **Glossary:** Added the Dutch glossary entry `Public User Interface (PUI)` → `publieke gebruikersinterface (PUI)` because this documentation repeatedly refers to the public-facing web application as an ArchivesSpace interface name, and the Dutch UI terminology is clearer and more consistent than a literal calque.
- **Uncertainty:** The source alternates between "Docker configuration package" and "Docker package" to describe the downloaded zip bundle; I used "Docker-configuratiepakket" consistently because it best matches the product's deployment setup. I also kept the terms "medewerkersinterface" and "publieke gebruikersinterface" in Dutch even though the source uses English interface names, because the glossary prefers ArchivesSpace's own Dutch terminology when it is clear and recurring.
- **English-source issues not changed:** The English source repeats the word `locales` in the sentence describing the contents of the configuration bundle, and the prose calls the target directory `architecture` in the upgrade section even though the surrounding text uses `archivespace`; these are English-source errors and were noted rather than corrected while translating.

## 2026-10-27 — `src/content/docs/nl/getting_started.mdx`

- **Glossary:** Reused the existing `Staff interface` entry as `medewerkersinterface` and the `Public User Interface (PUI)` entry as `publieke gebruikersinterface (PUI)`. No new glossary rows were added.
- **Uncertainty:** The source uses both "public interface" and "staff interface" in browser verification text; I kept the Dutch UI terminology consistent with the glossary rather than a literal English rendering. I also treated “zip distribution” as `zip-distributie`, which is standard Dutch technical usage for this deployment format without implying a new ArchivesSpace-specific term.
- **English-source issues not changed:** The source sentence in the Java section is grammatically awkward and inconsistent in capitalization and punctuation around the note about Java 11 versus Java 17/21. The prompt refers to `src/content/docs/getting_started.mdx` at the repository root, but the actual file present in this repo is `src/content/docs/administration/getting_started.mdx`; I translated the file that exists in the repository.

## 2026-10-27 — `src/content/docs/nl/administration/index.md`

- **Glossary:** No new terms added. The page contains general administration labels rather than recurring ArchivesSpace or archival-science terms.
- **Uncertainty:** No significant terminology uncertainty. “Log rotation” is translated as `logrotatie`, a conventional Dutch IT term.
- **English-source issues not changed:** None noticed. The initially specified root-level source file `src/content/docs/index.md` is absent from this checkout; this translation uses the tagged `src/content/docs/administration/index.md` source and its corresponding locale path, as selected.

## 2026-10-30 — `src/content/docs/nl/indexes.md`

- **Glossary:** Added `Reindex` → `herindexering`, `Soft reindex` → `soft-herindexering`, and `Full reindex` → `volledige herindexering` because these recurring terms describe the page's central indexing workflows. Filled the existing `Accession` entry as `nog niet ontsloten materiaal`, `Resource` as `collectie`, and `Repository` as `collectiebeherende instelling`, following the official Dutch ArchivesSpace UI. Filled `Indexer` as `indexeerproces`; no exact Dutch UI label was found for this background process, so this uses a clear Dutch technical term.
- **Uncertainty:** The official UI's `Accession` label, `nog niet ontsloten materiaal`, describes the record's content rather than naming the record type explicitly; it is retained for consistency with the application. I used `soft-herindexering` rather than `gedeeltelijke herindexering` to preserve the distinction from a full rebuild.
- **English-source issues not changed:** The source uses lowercase `youtube` for the brand name YouTube and varies between `reindex` and `re-indexing`. The requested source path `src/content/docs/indexes.md` is absent; after clarification, the tagged `src/content/docs/administration/indexes.md` was translated to the requested destination.

## 2026-10-30 — `src/content/docs/nl/logrotate.md`

- **Glossary:** No new terms added. `Logrotatie` is a standard Dutch IT term and is already used in the Dutch translator notes.
- **Uncertainty:** The source says the configuration keeps “7 days worth” of logs. I translated this as `de logbestanden van de afgelopen 7 dagen`, following the source wording.
- **English-source issues not changed:** The explanation may overstate what `rotate 7` guarantees: it retains seven rotated log files, and with daily rotation this generally corresponds to about seven days, not necessarily exactly seven days. The source wording was preserved in the translation.

## 2026-10-30 — `src/content/docs/nl/passwords.md`

- **Glossary:** No new terms added. The text contains no recurring ArchivesSpace or archival-science term that is missing from the glossary.
- **Uncertainty:** None.
- **English-source issues not changed:** None noticed.
