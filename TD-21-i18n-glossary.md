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
| Accession                   | A group of records acquired by a repository in a single transaction; a core ArchivesSpace record type.                                 | nog niet ontsloten materiaal |
| Assessment                  | An ArchivesSpace record type used to document an assessment associated with resources, accessions, or digital objects.                  | beoordeling |
| Archival Object             | A descriptive record for an archival component in a resource hierarchy; a core ArchivesSpace record type.                              | archiefonderdeel |
| Nested record               | A record that exists only within the context of another record and is stored and retrieved as part of that record.                     | genest record |
| Main record                 | A primary ArchivesSpace record type with its own persistent URI, as distinct from a supporting or nested record.                      | hoofdrecord |
| Supporting record            | A record type that supplements main records and is commonly linked to them through relationship tables.                               | ondersteunend record |
| Relationship table           | A database table that links main records and supporting records.                                                                        | relatietabel |
| Parent/child relationship    | A hierarchical relationship between a record and its immediate parent or child record.                                                 | ouder-kindrelatie |
| Resource                    | A core ArchivesSpace record type describing an arranged and described body of archival material (e.g., a finding aid).                 | collectie |
| Digital Object              | A core ArchivesSpace record type representing a digital representation of, or component related to, an archival resource.              | digitaal object |
| Digital Object Component    | A component of a digital object in its hierarchical structure.                                                                          | component van digitaal object |
| Top Container               | A physical storage unit (e.g., box, folder) holding materials described by a resource or accession.                                    | topcontainer     |
| Container Profile           | A record defining the physical dimensions of a container type, used for space and location calculations.                               | containerprofiel |
| Container model             | The ArchivesSpace model for representing containers and relationships between container records.                                        | containermodel   |
| Composite identifier        | An identifier composed of values inherited from multiple levels of an archival hierarchy.                                              | samengesteld ID-nummer |
| Element of description      | A discrete element used to describe archival materials at a particular level of description.                                           | beschrijvingselement |
| Location                    | A record representing a physical storage location that can be linked to top containers.                                                | locatie          |
| Subject                     | A controlled-vocabulary term record describing the topic, geographic area, or genre of archival materials.                             | onderwerp        |
| Agent                       | A record representing a person, family, or corporate body associated with archival materials (as creator, subject, etc.).              | agent |
| Repository                  | The top-level organizational record representing an individual archive/institution within an ArchivesSpace instance.                   | collectiebeherende instelling |
| Release                     | A packaged version of ArchivesSpace made available to users, usually tagged and published on GitHub.                               | uitgave |
| Release notes               | A summary of changes, fixes, and compatibility notes for a specific release.                                                       | release-opmerkingen |
| Report                      | A custom report generated from ArchivesSpace records and associated data.                                                               | rapport |
| Subreport                   | A report nested within a report or another subreport to provide additional detail.                                                       | subrapport |
| Classification              | A record type used to arrange accessions/resources into a hierarchical scheme independent of physical arrangement.                     | classificatie    |
| Rights Statement            | A record capturing rights and restriction information attached to resources, accessions, or digital objects.                           | rechtenverklaring |
| Access restrictions note    | A note that describes restrictions on access to archival materials.                                                                     | aantekening over openbaarheidsbeperkingen |
| Reference Code               | The archival identifier for a described unit, commonly associated with ISAD(G) and DACS.                                                | referentiecode |
| Scope and contents note      | An archival description element summarizing the scope and content of a described unit.                                                   | toelichting op inhoud |
| Language of Materials note   | A note describing the language or languages of the materials being described.                                                           | aantekening over de taal van het materiaal |
| Enumeration                 | A controlled, dynamic list of values (e.g., dropdown options) configurable via System > Manage Controlled Value Lists.                 | enumeratie |
| Controlled Value List       | A configurable list of controlled values used in ArchivesSpace, such as options in a dropdown.                                        | gecontroleerde waardelijst |
| EAD                         | Encoded Archival Description, the XML standard ArchivesSpace uses to export/import finding aids for resources.                         |                   |
| EAC-CPF                     | Encoded Archival Context — Corporate Bodies, Persons, and Families, the XML standard for exporting agent records.                      |                   |
| MARCXML                     | The XML-encoded MARC21 bibliographic format, supported as an import/export format for resource records.                                |                   |
| MODS                        | Metadata Object Description Schema, an XML export format supported for digital object records.                                         |                   |
| DACS                        | Describing Archives: A Content Standard, the descriptive standard referenced throughout ArchivesSpace's data model and field help.     |                   |
| OAI-PMH                     | Open Archives Initiative Protocol for Metadata Harvesting; ArchivesSpace's built-in interface for external systems to harvest records. |                   |
| Harvest                     | The process of retrieving records or metadata from a service using OAI-PMH.                                                              | harvesten         |
| Level of Description        | A hierarchical level used to describe archival materials and define OAI-PMH sets.                                                        | beschrijvingsniveau |
| OAI-PMH set                 | A named grouping of records exposed by an OAI-PMH service.                                                                               | set               |
| Resumption Token            | An OAI-PMH token used to continue a paginated response or harvest.                                                                        | token voor voortzetting |
| Staff interface             | The internal, authenticated web application archivists use to create and manage records (also called the staff/frontend application).  | medewerkersinterface |
| Public User Interface (PUI) | The public-facing web application that presents published records to end users and researchers.                                        | publieke gebruikersinterface (PUI) |
| Backend                     | The core ArchivesSpace application that exposes data and workflows via a REST API, consumed by the staff and public interfaces.        | backend            |
| Instance                    | A running deployment of ArchivesSpace or a service such as Solr, with its own configuration.                                            | instantie         |
| Inheritance                 | The process by which a record displays values from an ancestor in an archival hierarchy when it has no value of its own.               | overerving |
| Indexer                     | The background process that reads records from the backend and writes them into Solr for search and browse.                            | indexeerproces |
| JSONModel                   | The class/library defining the JSON data format ArchivesSpace's components use to exchange records.                                    |                   |
| Job                         | A background/batch task (e.g., an import or bulk update) tracked and reported on within the staff interface.                           | achtergrondtaak |
| Job runner                  | A registered class that executes jobs of one or more types.                                                                             | taakuitvoerder   |
| Database dump               | An exported SQL snapshot or file generated from a database (for example via `mysqldump`) as part of a backup or recovery workflow.      | database-dump     |
| Plugin                      | A self-contained package that customizes or extends ArchivesSpace behavior without modifying its core codebase.                        | plug-in           |
| Authentication handler      | A class that checks credentials and returns a user model during an authentication attempt.                                              | authenticatiehandler |
| Authentication source       | The external user directory or service against which a user authenticates.                                                             | authenticatiebron |
| Locale                      | A language/region configuration (e.g., `en`, `fr`) used by the Rails I18n system that drives the application's own UI translations.    | locale (taal-/regio-instelling) |
| Mapping                     | A table or document describing correspondences between fields or values in data formats or systems.                                  | mapping           |
| Migration                   | The process and tooling for importing data into ArchivesSpace from a prior system (e.g., Archivists' Toolkit, Archon).                 | migratie          |
| Database migration          | A migration that applies database schema changes and associated data changes during an ArchivesSpace upgrade.                         | databasemigratie  |
| Schema version              | The database schema version number associated with a given ArchivesSpace release, used to track upgrades.                              | schemaversie     |
| Reindex                     | Updating or rebuilding the Solr index for records.                                                                                      | herindexering |
| Soft reindex                | Updating existing Solr documents without rebuilding the index files.                                                                    | soft-herindexering |
| Full reindex                | Rebuilding the Solr index from the database.                                                                                             | volledige herindexering |
| Resequencing                | Rebuilding the technical metadata used to establish the ordering of archival object and digital object component trees.                 | volgordegegevens opnieuw opbouwen |
| Child container             | A container nested within a top container, corresponding to the first level below it in the container hierarchy.                       | subcontainer |
| Grandchild container        | A container nested within a child container, corresponding to the second level below a top container.                                   | sub-subcontainer |
| Extent                      | A description of the quantity or physical extent of archival materials.                                                                  | omvang |
| Theme                       | A set of visual styles and layout choices that determine the appearance of an ArchivesSpace interface.                                    | thema |
| Rails asset pipeline        | Rails tooling that processes and compiles assets such as stylesheets and images for an application.                                       | assetpipeline van Rails |

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
| Schema version              | The database schema version number associated with a given ArchivesSpace release, used to track upgrades.                              |                       |

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
