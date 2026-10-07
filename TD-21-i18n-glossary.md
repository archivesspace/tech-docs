# TD-21 i18n Glossary

A shared, living reference for translating recurring ArchivesSpace/archival-science and technical terms consistently across languages, translators, and pages. See [TD-21-i18n_project.md](TD-21-i18n_project.md) for the overall i18n project and the canonical translation prompt that references this file.

## How this glossary works

- **Terms come from the docs, not a generic word list.** Every seed row below is a term that actually recurs in `src/content/docs/**`, not a general archival-science glossary imported from elsewhere.
- **One section per target language.** Find your language's section and work only within it.
- **Translation column starts blank.** Fill it in the first time you translate a page that uses that term.
- **Prefer ArchivesSpace's own UI translation when one exists.** Before inventing a translation, check whether the ArchivesSpace application already ships an official translation for that term in your language (locale files at `frontend/config/locales`, `public/config/locales`, and `common/locales` in the [archivesspace/archivesspace](https://github.com/archivesspace/archivesspace) repo; background in [Customizing text](/customization/locales)). Reusing it keeps the docs consistent with the software readers are using.
- **Growing the glossary:** when the canonical translation prompt (see `TD-21-i18n_project.md`) produces a "Translator notes" section proposing a new term, a human reviewer confirms the proposed translation and adds it as a new row in the relevant language section below, so future translations can reuse it verbatim.
- **Don't change another translator's existing entry** without discussion — these are shared, canonical choices other pages already depend on.

## Dutch (nl)

| English term                | Context                                                                                                                                | Dutch translation |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| Accession                   | A group of records acquired by a repository in a single transaction; a core ArchivesSpace record type.                                 |                   |
| Resource                    | A core ArchivesSpace record type describing an arranged and described body of archival material (e.g., a finding aid).                 |                   |
| Digital Object              | A core ArchivesSpace record type representing a digital representation of, or component related to, an archival resource.              |                   |
| Top Container               | A physical storage unit (e.g., box, folder) holding materials described by a resource or accession.                                    |                   |
| Container Profile           | A record defining the physical dimensions of a container type, used for space and location calculations.                               |                   |
| Location                    | A record representing a physical storage location that can be linked to top containers.                                                |                   |
| Subject                     | A controlled-vocabulary term record describing the topic, geographic area, or genre of archival materials.                             |                   |
| Agent                       | A record representing a person, family, or corporate body associated with archival materials (as creator, subject, etc.).              |                   |
| Repository                  | The top-level organizational record representing an individual archive/institution within an ArchivesSpace instance.                   |                   |
| Classification              | A record type used to arrange accessions/resources into a hierarchical scheme independent of physical arrangement.                     |                   |
| Rights Statement            | A record capturing rights and restriction information attached to resources, accessions, or digital objects.                           |                   |
| Enumeration                 | A controlled, dynamic list of values (e.g., dropdown options) configurable via System > Manage Controlled Value Lists.                 |                   |
| EAD                         | Encoded Archival Description, the XML standard ArchivesSpace uses to export/import finding aids for resources.                         |                   |
| EAC-CPF                     | Encoded Archival Context — Corporate Bodies, Persons, and Families, the XML standard for exporting agent records.                      |                   |
| MARCXML                     | The XML-encoded MARC21 bibliographic format, supported as an import/export format for resource records.                                |                   |
| MODS                        | Metadata Object Description Schema, an XML export format supported for digital object records.                                         |                   |
| DACS                        | Describing Archives: A Content Standard, the descriptive standard referenced throughout ArchivesSpace's data model and field help.     |                   |
| OAI-PMH                     | Open Archives Initiative Protocol for Metadata Harvesting; ArchivesSpace's built-in interface for external systems to harvest records. |                   |
| Staff interface             | The internal, authenticated web application archivists use to create and manage records (also called the staff/frontend application).  |                   |
| Public User Interface (PUI) | The public-facing web application that presents published records to end users and researchers.                                        |                   |
| Backend                     | The core ArchivesSpace application that exposes data and workflows via a REST API, consumed by the staff and public interfaces.        |                   |
| Indexer                     | The background process that reads records from the backend and writes them into Solr for search and browse.                            |                   |
| JSONModel                   | The class/library defining the JSON data format ArchivesSpace's components use to exchange records.                                    |                   |
| Job                         | A background/batch task (e.g., an import or bulk update) tracked and reported on within the staff interface.                           |                   |
| Plugin                      | A self-contained package that customizes or extends ArchivesSpace behavior without modifying its core codebase.                        |                   |
| Locale                      | A language/region configuration (e.g., `en`, `fr`) used by the Rails I18n system that drives the application's own UI translations.    |                   |
| Migration                   | The process and tooling for importing data into ArchivesSpace from a prior system (e.g., Archivists' Toolkit, Archon).                 |                   |
| Schema version              | The database schema version number associated with a given ArchivesSpace release, used to track upgrades.                              |                   |

## French (fr)

| English term                | Context                                                                                                                                | French translation |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| Accession                   | A group of records acquired by a repository in a single transaction; a core ArchivesSpace record type.                                 |                    |
| Resource                    | A core ArchivesSpace record type describing an arranged and described body of archival material (e.g., a finding aid).                 |                    |
| Digital Object              | A core ArchivesSpace record type representing a digital representation of, or component related to, an archival resource.              |                    |
| Top Container               | A physical storage unit (e.g., box, folder) holding materials described by a resource or accession.                                    |                    |
| Container Profile           | A record defining the physical dimensions of a container type, used for space and location calculations.                               |                    |
| Location                    | A record representing a physical storage location that can be linked to top containers.                                                |                    |
| Subject                     | A controlled-vocabulary term record describing the topic, geographic area, or genre of archival materials.                             |                    |
| Agent                       | A record representing a person, family, or corporate body associated with archival materials (as creator, subject, etc.).              |                    |
| Repository                  | The top-level organizational record representing an individual archive/institution within an ArchivesSpace instance.                   |                    |
| Classification              | A record type used to arrange accessions/resources into a hierarchical scheme independent of physical arrangement.                     |                    |
| Rights Statement            | A record capturing rights and restriction information attached to resources, accessions, or digital objects.                           |                    |
| Enumeration                 | A controlled, dynamic list of values (e.g., dropdown options) configurable via System > Manage Controlled Value Lists.                 |                    |
| EAD                         | Encoded Archival Description, the XML standard ArchivesSpace uses to export/import finding aids for resources.                         |                    |
| EAC-CPF                     | Encoded Archival Context — Corporate Bodies, Persons, and Families, the XML standard for exporting agent records.                      |                    |
| MARCXML                     | The XML-encoded MARC21 bibliographic format, supported as an import/export format for resource records.                                |                    |
| MODS                        | Metadata Object Description Schema, an XML export format supported for digital object records.                                         |                    |
| DACS                        | Describing Archives: A Content Standard, the descriptive standard referenced throughout ArchivesSpace's data model and field help.     |                    |
| OAI-PMH                     | Open Archives Initiative Protocol for Metadata Harvesting; ArchivesSpace's built-in interface for external systems to harvest records. |                    |
| Staff interface             | The internal, authenticated web application archivists use to create and manage records (also called the staff/frontend application).  |                    |
| Public User Interface (PUI) | The public-facing web application that presents published records to end users and researchers.                                        |                    |
| Backend                     | The core ArchivesSpace application that exposes data and workflows via a REST API, consumed by the staff and public interfaces.        |                    |
| Indexer                     | The background process that reads records from the backend and writes them into Solr for search and browse.                            |                    |
| JSONModel                   | The class/library defining the JSON data format ArchivesSpace's components use to exchange records.                                    |                    |
| Job                         | A background/batch task (e.g., an import or bulk update) tracked and reported on within the staff interface.                           |                    |
| Plugin                      | A self-contained package that customizes or extends ArchivesSpace behavior without modifying its core codebase.                        |                    |
| Locale                      | A language/region configuration (e.g., `en`, `fr`) used by the Rails I18n system that drives the application's own UI translations.    |                    |
| Migration                   | The process and tooling for importing data into ArchivesSpace from a prior system (e.g., Archivists' Toolkit, Archon).                 |                    |
| Schema version              | The database schema version number associated with a given ArchivesSpace release, used to track upgrades.                              |                    |

## German (de)

| English term                | Context                                                                                                                                | German translation |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| Accession                   | A group of records acquired by a repository in a single transaction; a core ArchivesSpace record type.                                 |                    |
| Resource                    | A core ArchivesSpace record type describing an arranged and described body of archival material (e.g., a finding aid).                 |                    |
| Digital Object              | A core ArchivesSpace record type representing a digital representation of, or component related to, an archival resource.              |                    |
| Top Container               | A physical storage unit (e.g., box, folder) holding materials described by a resource or accession.                                    |                    |
| Container Profile           | A record defining the physical dimensions of a container type, used for space and location calculations.                               |                    |
| Location                    | A record representing a physical storage location that can be linked to top containers.                                                |                    |
| Subject                     | A controlled-vocabulary term record describing the topic, geographic area, or genre of archival materials.                             |                    |
| Agent                       | A record representing a person, family, or corporate body associated with archival materials (as creator, subject, etc.).              |                    |
| Repository                  | The top-level organizational record representing an individual archive/institution within an ArchivesSpace instance.                   |                    |
| Classification              | A record type used to arrange accessions/resources into a hierarchical scheme independent of physical arrangement.                     |                    |
| Rights Statement            | A record capturing rights and restriction information attached to resources, accessions, or digital objects.                           |                    |
| Enumeration                 | A controlled, dynamic list of values (e.g., dropdown options) configurable via System > Manage Controlled Value Lists.                 |                    |
| EAD                         | Encoded Archival Description, the XML standard ArchivesSpace uses to export/import finding aids for resources.                         |                    |
| EAC-CPF                     | Encoded Archival Context — Corporate Bodies, Persons, and Families, the XML standard for exporting agent records.                      |                    |
| MARCXML                     | The XML-encoded MARC21 bibliographic format, supported as an import/export format for resource records.                                |                    |
| MODS                        | Metadata Object Description Schema, an XML export format supported for digital object records.                                         |                    |
| DACS                        | Describing Archives: A Content Standard, the descriptive standard referenced throughout ArchivesSpace's data model and field help.     |                    |
| OAI-PMH                     | Open Archives Initiative Protocol for Metadata Harvesting; ArchivesSpace's built-in interface for external systems to harvest records. |                    |
| Staff interface             | The internal, authenticated web application archivists use to create and manage records (also called the staff/frontend application).  |                    |
| Public User Interface (PUI) | The public-facing web application that presents published records to end users and researchers.                                        |                    |
| Backend                     | The core ArchivesSpace application that exposes data and workflows via a REST API, consumed by the staff and public interfaces.        |                    |
| Indexer                     | The background process that reads records from the backend and writes them into Solr for search and browse.                            |                    |
| JSONModel                   | The class/library defining the JSON data format ArchivesSpace's components use to exchange records.                                    |                    |
| Job                         | A background/batch task (e.g., an import or bulk update) tracked and reported on within the staff interface.                           |                    |
| Plugin                      | A self-contained package that customizes or extends ArchivesSpace behavior without modifying its core codebase.                        |                    |
| Locale                      | A language/region configuration (e.g., `en`, `fr`) used by the Rails I18n system that drives the application's own UI translations.    |                    |
| Migration                   | The process and tooling for importing data into ArchivesSpace from a prior system (e.g., Archivists' Toolkit, Archon).                 |                    |
| Schema version              | The database schema version number associated with a given ArchivesSpace release, used to track upgrades.                              |                    |

## Japanese (ja)

| English term                | Context                                                                                                                                | Japanese translation |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| Accession                   | A group of records acquired by a repository in a single transaction; a core ArchivesSpace record type.                                 |                      |
| Resource                    | A core ArchivesSpace record type describing an arranged and described body of archival material (e.g., a finding aid).                 |                      |
| Digital Object              | A core ArchivesSpace record type representing a digital representation of, or component related to, an archival resource.              |                      |
| Top Container               | A physical storage unit (e.g., box, folder) holding materials described by a resource or accession.                                    |                      |
| Container Profile           | A record defining the physical dimensions of a container type, used for space and location calculations.                               |                      |
| Location                    | A record representing a physical storage location that can be linked to top containers.                                                |                      |
| Subject                     | A controlled-vocabulary term record describing the topic, geographic area, or genre of archival materials.                             |                      |
| Agent                       | A record representing a person, family, or corporate body associated with archival materials (as creator, subject, etc.).              |                      |
| Repository                  | The top-level organizational record representing an individual archive/institution within an ArchivesSpace instance.                   |                      |
| Classification              | A record type used to arrange accessions/resources into a hierarchical scheme independent of physical arrangement.                     |                      |
| Rights Statement            | A record capturing rights and restriction information attached to resources, accessions, or digital objects.                           |                      |
| Enumeration                 | A controlled, dynamic list of values (e.g., dropdown options) configurable via System > Manage Controlled Value Lists.                 |                      |
| EAD                         | Encoded Archival Description, the XML standard ArchivesSpace uses to export/import finding aids for resources.                         |                      |
| EAC-CPF                     | Encoded Archival Context — Corporate Bodies, Persons, and Families, the XML standard for exporting agent records.                      |                      |
| MARCXML                     | The XML-encoded MARC21 bibliographic format, supported as an import/export format for resource records.                                |                      |
| MODS                        | Metadata Object Description Schema, an XML export format supported for digital object records.                                         |                      |
| DACS                        | Describing Archives: A Content Standard, the descriptive standard referenced throughout ArchivesSpace's data model and field help.     |                      |
| OAI-PMH                     | Open Archives Initiative Protocol for Metadata Harvesting; ArchivesSpace's built-in interface for external systems to harvest records. |                      |
| Staff interface             | The internal, authenticated web application archivists use to create and manage records (also called the staff/frontend application).  |                      |
| Public User Interface (PUI) | The public-facing web application that presents published records to end users and researchers.                                        |                      |
| Backend                     | The core ArchivesSpace application that exposes data and workflows via a REST API, consumed by the staff and public interfaces.        |                      |
| Indexer                     | The background process that reads records from the backend and writes them into Solr for search and browse.                            |                      |
| JSONModel                   | The class/library defining the JSON data format ArchivesSpace's components use to exchange records.                                    |                      |
| Job                         | A background/batch task (e.g., an import or bulk update) tracked and reported on within the staff interface.                           |                      |
| Plugin                      | A self-contained package that customizes or extends ArchivesSpace behavior without modifying its core codebase.                        |                      |
| Locale                      | A language/region configuration (e.g., `en`, `fr`) used by the Rails I18n system that drives the application's own UI translations.    |                      |
| Migration                   | The process and tooling for importing data into ArchivesSpace from a prior system (e.g., Archivists' Toolkit, Archon).                 |                      |
| Schema version              | The database schema version number associated with a given ArchivesSpace release, used to track upgrades.                              |                      |

## Spanish (es)

| English term                | Context                                                                                                                                | Spanish translation |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| Accession                   | A group of records acquired by a repository in a single transaction; a core ArchivesSpace record type.                                 |                     |
| Resource                    | A core ArchivesSpace record type describing an arranged and described body of archival material (e.g., a finding aid).                 |                     |
| Digital Object              | A core ArchivesSpace record type representing a digital representation of, or component related to, an archival resource.              |                     |
| Top Container               | A physical storage unit (e.g., box, folder) holding materials described by a resource or accession.                                    |                     |
| Container Profile           | A record defining the physical dimensions of a container type, used for space and location calculations.                               |                     |
| Location                    | A record representing a physical storage location that can be linked to top containers.                                                |                     |
| Subject                     | A controlled-vocabulary term record describing the topic, geographic area, or genre of archival materials.                             |                     |
| Agent                       | A record representing a person, family, or corporate body associated with archival materials (as creator, subject, etc.).              |                     |
| Repository                  | The top-level organizational record representing an individual archive/institution within an ArchivesSpace instance.                   |                     |
| Classification              | A record type used to arrange accessions/resources into a hierarchical scheme independent of physical arrangement.                     |                     |
| Rights Statement            | A record capturing rights and restriction information attached to resources, accessions, or digital objects.                           |                     |
| Enumeration                 | A controlled, dynamic list of values (e.g., dropdown options) configurable via System > Manage Controlled Value Lists.                 |                     |
| EAD                         | Encoded Archival Description, the XML standard ArchivesSpace uses to export/import finding aids for resources.                         |                     |
| EAC-CPF                     | Encoded Archival Context — Corporate Bodies, Persons, and Families, the XML standard for exporting agent records.                      |                     |
| MARCXML                     | The XML-encoded MARC21 bibliographic format, supported as an import/export format for resource records.                                |                     |
| MODS                        | Metadata Object Description Schema, an XML export format supported for digital object records.                                         |                     |
| DACS                        | Describing Archives: A Content Standard, the descriptive standard referenced throughout ArchivesSpace's data model and field help.     |                     |
| OAI-PMH                     | Open Archives Initiative Protocol for Metadata Harvesting; ArchivesSpace's built-in interface for external systems to harvest records. |                     |
| Staff interface             | The internal, authenticated web application archivists use to create and manage records (also called the staff/frontend application).  |                     |
| Public User Interface (PUI) | The public-facing web application that presents published records to end users and researchers.                                        |                     |
| Backend                     | The core ArchivesSpace application that exposes data and workflows via a REST API, consumed by the staff and public interfaces.        |                     |
| Indexer                     | The background process that reads records from the backend and writes them into Solr for search and browse.                            |                     |
| JSONModel                   | The class/library defining the JSON data format ArchivesSpace's components use to exchange records.                                    |                     |
| Job                         | A background/batch task (e.g., an import or bulk update) tracked and reported on within the staff interface.                           |                     |
| Plugin                      | A self-contained package that customizes or extends ArchivesSpace behavior without modifying its core codebase.                        |                     |
| Locale                      | A language/region configuration (e.g., `en`, `fr`) used by the Rails I18n system that drives the application's own UI translations.    |                     |
| Migration                   | The process and tooling for importing data into ArchivesSpace from a prior system (e.g., Archivists' Toolkit, Archon).                 |                     |
| Schema version              | The database schema version number associated with a given ArchivesSpace release, used to track upgrades.                              |                     |

## Ukrainian (uk)

| English term                | Context                                                                                                                                | Ukrainian translation |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| Accession                   | A group of records acquired by a repository in a single transaction; a core ArchivesSpace record type.                                 |                       |
| Resource                    | A core ArchivesSpace record type describing an arranged and described body of archival material (e.g., a finding aid).                 |                       |
| Digital Object              | A core ArchivesSpace record type representing a digital representation of, or component related to, an archival resource.              |                       |
| Top Container               | A physical storage unit (e.g., box, folder) holding materials described by a resource or accession.                                    |                       |
| Container Profile           | A record defining the physical dimensions of a container type, used for space and location calculations.                               |                       |
| Location                    | A record representing a physical storage location that can be linked to top containers.                                                |                       |
| Subject                     | A controlled-vocabulary term record describing the topic, geographic area, or genre of archival materials.                             |                       |
| Agent                       | A record representing a person, family, or corporate body associated with archival materials (as creator, subject, etc.).              |                       |
| Repository                  | The top-level organizational record representing an individual archive/institution within an ArchivesSpace instance.                   |                       |
| Classification              | A record type used to arrange accessions/resources into a hierarchical scheme independent of physical arrangement.                     |                       |
| Rights Statement            | A record capturing rights and restriction information attached to resources, accessions, or digital objects.                           |                       |
| Enumeration                 | A controlled, dynamic list of values (e.g., dropdown options) configurable via System > Manage Controlled Value Lists.                 |                       |
| EAD                         | Encoded Archival Description, the XML standard ArchivesSpace uses to export/import finding aids for resources.                         |                       |
| EAC-CPF                     | Encoded Archival Context — Corporate Bodies, Persons, and Families, the XML standard for exporting agent records.                      |                       |
| MARCXML                     | The XML-encoded MARC21 bibliographic format, supported as an import/export format for resource records.                                |                       |
| MODS                        | Metadata Object Description Schema, an XML export format supported for digital object records.                                         |                       |
| DACS                        | Describing Archives: A Content Standard, the descriptive standard referenced throughout ArchivesSpace's data model and field help.     |                       |
| OAI-PMH                     | Open Archives Initiative Protocol for Metadata Harvesting; ArchivesSpace's built-in interface for external systems to harvest records. |                       |
| Staff interface             | The internal, authenticated web application archivists use to create and manage records (also called the staff/frontend application).  |                       |
| Public User Interface (PUI) | The public-facing web application that presents published records to end users and researchers.                                        |                       |
| Backend                     | The core ArchivesSpace application that exposes data and workflows via a REST API, consumed by the staff and public interfaces.        |                       |
| Indexer                     | The background process that reads records from the backend and writes them into Solr for search and browse.                            |                       |
| JSONModel                   | The class/library defining the JSON data format ArchivesSpace's components use to exchange records.                                    |                       |
| Job                         | A background/batch task (e.g., an import or bulk update) tracked and reported on within the staff interface.                           |                       |
| Plugin                      | A self-contained package that customizes or extends ArchivesSpace behavior without modifying its core codebase.                        |                       |
| Locale                      | A language/region configuration (e.g., `en`, `fr`) used by the Rails I18n system that drives the application's own UI translations.    |                       |
| Migration                   | The process and tooling for importing data into ArchivesSpace from a prior system (e.g., Archivists' Toolkit, Archon).                 |                       |
| Schema version              | The database schema version number associated with a given ArchivesSpace release, used to track upgrades.                              |                       |
