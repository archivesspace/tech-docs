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

## 2026-10-30 — `src/content/docs/nl/unix_daemon.md`

- **Glossary:** No new terms added. `daemon`, `init script`, and `run-level` are general Unix administration terms rather than recurring ArchivesSpace or archival-science terms.
- **Uncertainty:** `Daemon` is also sometimes rendered as `achtergrondproces` in Dutch; `daemon` was retained to match the existing Dutch administration index and common Unix terminology.
- **English-source issues not changed:** The prose refers to “double greater than signs,” while the example uses `&>>`, a shell-specific operator that appends both standard output and standard error; the source does not identify the required shell. The sentence about using a Systemd unit file also lacks terminal punctuation, and the source uses both `systemd` and `Systemd`.

## 2026-10-30 — `src/content/docs/nl/upgrading_1_1_0.md`

- **Glossary:** Added `Instance` → `instantie` for a running ArchivesSpace deployment or service such as Solr. The concept recurs in this and other administration documentation; the official Dutch UI locales do not provide a label for this server/deployment meaning, so I used the standard Dutch technical term already found in the Dutch docs.
- **Uncertainty:** The source example `http://[localhost|yourhostname]:8091` appears to show alternative hostnames in brackets separated by a pipe, rather than a literal URL. I preserved the example as instructed.
- **English-source issues not changed:** “You use a different ports sequence” is grammatically awkward in English; I rendered it as `U gebruikt een andere poortreeks` without changing the intended meaning. The host/URL example could be mistaken for a literal value even though its bracket-and-pipe notation appears illustrative; it was not changed.

## 2026-10-30 — `src/content/docs/nl/upgrading_1_1_1.md`

- **Glossary:** Added `Archival Object` → `archiefonderdeel`, following the Dutch public interface's description of these records as `archiefonderdelen`; added `Digital Object` → `digitaal object`, matching the interface label; added `Digital Object Component` → `component van digitaal object`, applying the interface's term `digitaal object` where no specific component label was found; and added `Resequencing` → `volgordegegevens opnieuw opbouwen`, a descriptive rendering of the procedure, which rebuilds ordering metadata without changing the elements' order.
- **Uncertainty:** The source's “resource tree” is rendered as `collectiestructuur`, using the glossary translation of `Resource`; the term refers to the hierarchy being rebuilt, but the English does not further define its scope. The phrase “resource hit” is informal and imprecise, so it is rendered as databasebelasting.
- **English-source issues not changed:** “There is now method” is missing an article. In “This duration depends on the size of your database, which can take seconds ... to hours,” the relative clause has an unclear antecedent. The description of the resource cost of EAD exports as “a rather large resource hit” is also vague; these were translated according to the intended meaning without changing the source.

## 2026-10-30 — `src/content/docs/nl/upgrading_1_5_0.md`

- **Glossary:** Filled the existing `Top Container`, `Container Profile`, and `Location` entries with `topcontainer`, `containerprofiel`, and `locatie`. The ArchivesSpace Dutch locale uses these terms (including `Locatie` and `Containerprofiel`); its public locale labels the lower levels `Subcontainer` and `Sub-subcontainer`. Added `Child container` → `subcontainer` and `Grandchild container` → `sub-subcontainer` to match those labels, and `Extent` → `omvang`, following the Dutch public interface's extent terminology.
- **Uncertainty:** The source says “child and grandparent container records,” which is inconsistent with its subsequent references to the child and grandchild levels; I retained the source's “grandparent” meaning rather than silently changing it. The source also refers to “validation name error” without further explanation, so this is rendered literally as a validation error involving a name.
- **English-source issues not changed:** “Archivists 1.5.0” appears to mean “ArchivesSpace 1.5.0.” The phrase introducing the Instance Joiner Plugin has an unclosed parenthesis. The conversion warning has awkward capitalization and punctuation (“and THE CHANGES”), and “A quick overview of the steps are” is grammatically incorrect. These source issues were not changed.

## 2026-10-30 — `src/content/docs/nl/upgrading_2_1_0.md`

- **Glossary:** Added `Container model` → `containermodel` for the recurring ArchivesSpace model concept. Filled the existing `Rights Statement` entry as `rechtenverklaring` and `Migration` as `migratie`. The Dutch ArchivesSpace locales use `Metadata-rechtenverklaring` for a related metadata-rights label but do not provide a Dutch UI label for Rights Statement records; `rechtenverklaring` is therefore used as a clear professional translation.
- **Uncertainty:** The source refers repeatedly to the “container model” and once to “container conversion”; the latter is rendered as `conversie van het containermodel` to clarify that it means converting between the old and new models. The source description's “rights statement data migration” could refer to the migration of records or of the data model; the surrounding text describes conversion of rights-statement data to a new model, so I translated it as `gegevensmigratie van rechtenverklaringen`.
- **English-source issues not changed:** “If you are upgrading from ArchivesSpace version of 1.4.2 or lower” is grammatically awkward; it is translated according to its apparent intended meaning without changing the source. The frontmatter description awkwardly coordinates ArchivesSpace versions with Archivists' Toolkit and Archon, which are migration sources rather than upgrade versions; its grouping was preserved.

## 2026-10-30 — `src/content/docs/nl/upgrading.md`

- **Glossary:** Added `Database migration` → `databasemigratie` to distinguish schema and data changes applied during an upgrade from `Migration`, which the glossary reserves for importing data from an earlier system. Filled the existing `Locale` entry as `locale (taal-/regio-instelling)`; the page deals with Rails I18n locale files, and `locale` is already used in the Dutch documentation for this application concept.
- **Uncertainty:** “Zip distribution” is translated as `zip-distributie`, a standard technical rendering of the installation format. I retained `locale` in compounds such as `locale-bestand` to align with the application's Rails terminology and the existing Dutch docs.
- **English-source issues not changed:** The paragraph about transferring locale files contains the malformed text `ArchivesSpace locales/provisioning/solr/#copy-the-config-files files`, which appears to be an accidental link/path insertion; it has been retained and noted rather than silently corrected. The Tomcat section contains grammatical errors, including “the any libraries,” “you other local configuration settings,” “Make sure you MySQL connector jar,” and “to migration your database.” The source also spells “essentially” as “esentially” and uses lowercase “github”; these were not corrected in the source.

## 2026-10-30 — `src/content/docs/nl/windows.md`

- **Glossary:** No new terms added. The page uses general Windows and Java administration terminology rather than recurring ArchivesSpace or archival-science terms missing from the glossary.
- **Uncertainty:** The quoted procrun button label “Launch” is translated as “Starten”; the label displayed in the GUI may remain English depending on its localization. The source also calls the Java path the directory of the Java executable, while its example appears to be the Java installation directory; the translation preserves this distinction as written.
- **English-source issues not changed:** The source says “edit you %PATH% environment variable” instead of “edit your.” Its sentence about Jetty “respond to when the shutdown action is taken” is awkward, and the final batch-script sentence repeats “from.” It instructs readers to uncomment the displayed configuration lines, although the lines in the example are not commented out. These issues were not changed in the source.

## 2026-10-30 — `src/content/docs/nl/api/index.md`

- **Glossary:** Reused the existing translations for `Archival Object`, `Accession`, `Resource`, `Repository`, `Top Container`, and other glossary terms. Filled the existing `Subject` entry as `onderwerp`, following the Dutch ArchivesSpace locale's use of `Onderwerp`; no new glossary row was needed.
- **Uncertainty:** The existing translation of `Accession` (`nog niet ontsloten materiaal`) is descriptive of the material rather than a direct name for the record type. It was retained verbatim to follow the glossary. “Search this archive” is translated as `In dit archief zoeken`; the source does not clarify whether “archive” here means an ArchivesSpace repository or the institution more generally.
- **English-source issues not changed:** The pagination section contains only the note “Python example needed” and no Python example. In the long-results Python example, `len(get_repo_aos_pages.json())` counts the top-level keys in the response dictionary rather than the result rows, despite the adjacent comment saying it counts results. The first curl example's URL is missing a closing quotation mark. These issues were noted but not corrected.

## 2026-10-30 — `src/content/docs/nl/api.md`

- **Glossary:** No new terms added. Filled the existing, blank `Backend` translation as `backend`, the standard Dutch software term.
- **Uncertainty:** “CRUD-style” is rendered as `CRUD-stijl`; the acronym remains unchanged because it names the established create/read/update/delete pattern. `Sessietoken` follows Dutch compound spelling.
- **English-source issues not changed:** No issues noticed in the English source.

## 2026-10-30 — `src/content/docs/nl/backend.md`

- **Glossary:** Added `Nested record` → `genest record` because it is a recurring ArchivesSpace data-model concept in this page; no exact Dutch UI term was found in the ArchivesSpace locale files, so the standard technical Dutch term is used. Filled the existing `Agent` entry as `agent`, matching the official Dutch ArchivesSpace UI.
- **Uncertainty:** The existing `Accession` translation, `nog niet ontsloten materiaal`, describes the material rather than the record type; it was reused as required. `Optimistic concurrency control` is translated as `optimistische gelijktijdigheidscontrole`; a preferred Dutch term for this concurrency-control pattern is not evident from the source.
- **English-source issues not changed:** “those records as expressed as JSON documents” is grammatically awkward; “a HTTP request” should use “an”; and “system-level records require comparing the record” appears to mean “system-level validations.” These source issues were not changed.

## 2026-10-30 — `src/content/docs/nl/database.md`

- **Glossary:** Added `Main record` → `hoofdrecord`, `Supporting record` → `ondersteunend record`, `Relationship table` → `relatietabel`, and `Parent/child relationship` → `ouder-kindrelatie` for recurring ArchivesSpace database categories. Filled the existing `Enumeration` entry as `enumeratie`. The checked `common` and `frontend` Dutch locale files did not provide exact UI terms for these database concepts, so standard Dutch technical terminology is used. Reused the existing `Nested record` → `genest record` entry and the existing translations for `Resource`, `Repository`, `Archival Object`, `Accession`, and the interfaces.
- **Uncertainty:** `Foreign key` is translated as `vreemde sleutel`, although Dutch IT writing also commonly retains the English term. The glossary translation `Accession` → `nog niet ontsloten materiaal` describes the material rather than the record type, so the prose follows that established choice where the term is used.
- **English-source issues not changed:** The source has the grammatical error “it's mapping” (intended “its mapping”), the phrase “values that are stored a few of the supporting record tables” is missing “in,” the typo `MysQL`, and the apparent typo `digital_oject_type_id`. It also refers to a table named `enumeration_values` before using `enumeration_value` elsewhere, which may be an inconsistency. The two MySQL 8+ child-query headings have no query content, and the MySQL 5.7+ child query has an empty code block. These source issues and gaps were left unchanged.

## 2026-10-30 — `src/content/docs/nl/directories.md`

- **Glossary:** No new terms added. Reused `Staff interface` → `medewerkersinterface` and `Public User Interface (PUI)` → `publieke gebruikersinterface (PUI)`.
- **Uncertainty:** The source says “public interface”; I rendered this as `publieke gebruikersinterface`, following the existing glossary term. The official Dutch public UI locale also uses `Publieksinterface`, but the glossary's established equivalent was retained for consistency.
- **English-source issues not changed:** The source writes “github io pages,” which appears to mean GitHub Pages; this wording was translated as written without changing the technical reference.

## 2026-10-30 — `src/content/docs/nl/frontend.md`

- **Glossary:** No new terms added. Reused the existing `Staff interface` → `medewerkersinterface` entry.
- **Uncertainty:** The source’s “frontend/staff interface” treats these as equivalent; I rendered it as `frontend (medewerkersinterface)` to preserve that relationship. I translated the linked “ArchivesSpace Help Center” as `Helpcentrum van ArchivesSpace` because link text should be translated, although the destination may use “Help Center” as its official English name.
- **English-source issues not changed:** The note `Additional documentation needed` signals that more content is required; I translated it without changing or expanding the source.

## 2026-10-30 — `src/content/docs/nl/architecture/index.md`

- **Glossary:** No new terms added. Reused the existing translations for `Backend`, `Staff interface`, `Public User Interface (PUI)`, and `Indexer`.
- **Uncertainty:** The source calls the indexer an “application,” while the glossary defines `Indexer` as a background process; `indexeerproces` follows the established glossary entry.
- **English-source issues not changed:** No issues noticed in the English source.
