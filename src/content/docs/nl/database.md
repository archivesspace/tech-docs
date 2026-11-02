---
title: Database
description: Beschrijft de structuur van de ArchivesSpace-database, met een overzicht van de hoofdrecordtabellen, tabellen met ondersteunende en geneste records, relatietabellen, enumeratietabellen, tabellen voor gebruikers, instellingen en rechten, taaktabellen en systeemtabellen. Ook worden de specifieke velden in de verschillende tabellen beschreven.
---

De ArchivesSpace-database slaat alle gegevens op die binnen een ArchivesSpace-instantie worden aangemaakt. Zoals in andere delen van deze documentatie wordt beschreven, gebruikt de backendcode — met name de model-laag en het bestand `ASModel_crud.rb` — de databasetoolkit `Sequel` om de onderliggende gegevens te verbinden met de JSON-objecten die door de andere onderdelen van het systeem worden uitgewisseld.

Vaak is de database rechtstreeks doorzoeken de efficiëntste en krachtigste manier om gegevens uit ArchivesSpace op te halen. U kunt ook SQL-query's gebruiken om aangepaste rapporten te maken die gebruikers in de medewerkersinterface kunnen uitvoeren. Raadpleeg het onderdeel [Aangepaste rapporten](/customization/reports) van deze documentatie voor meer informatie over het maken van aangepaste rapporten.

<!-- .See this [plugin](link-to-plugin) for an example. Also  -->

Voor productie wordt aanbevolen ArchivesSpace met MySQL te gebruiken en niet met de meegeleverde demodatabase. Instructies voor het configureren van ArchivesSpace voor gebruik met MySQL vindt u [hier](/provisioning/mysql).

De voorbeelden in dit onderdeel zijn geschreven voor MySQL. Op internet zijn veel gratis tutorials beschikbaar die uitleg bieden aan lezers die niet vertrouwd zijn met de querysyntaxis van MySQL en de functies van deze taal.

**OPMERKING**: de onderstaande documentatie is bijgewerkt tot en met databaseschemaversie 129 en applicatieversie 2.7.1.

## Databaseoverzicht

Het databaseschema van ArchivesSpace en de toewijzing ervan aan de JSONModel-objecten die door de andere onderdelen van het systeem worden gebruikt, worden gedefinieerd in de bestanden in de mappen `common/schemas` en `backend/models`. De database zelf wordt aangemaakt met het script `setup-database` in de map `scripts`. Dit script voert de migraties uit in de map `common/db/migrations`.

De tabellen in de ArchivesSpace-database kunnen in verschillende algemene categorieën worden ingedeeld:

- [Databaseoverzicht](#database-overview)
- [Hoofdrecordtabellen](#main-record-tables)
- [Tabellen met ondersteunende records](#supporting-record-tables)
- [Tabellen met geneste records](#subrecord-tables)
- [Relatietabellen](#relationship-tables)
- [Enumeraties](#enumerations)
- [Tabellen voor gebruikers, instellingen en rechten](#user-setting-and-permission-tables)
- [Taaktabellen](#job-tables)
- [Systeemtabellen](#system-tables)
- [Ouder-kindrelaties en volgorde](#parent-child-relationships-and-sequencing)
  - [Aan een collectiebeherende instelling gekoppelde records](#repository-scoped-records)
  - [Ouder-kindrelaties](#parentchild-relationships)
  - [Volgorde](#sequencing)
- [Booleaanse velden](#boolean-fields)
- [Alleen-lezenvelden](#read-only-fields)

U kunt een overzicht van alle tabellen en kolommen in uw ArchivesSpace-instantie opvragen door de volgende query in een MySQL-client uit te voeren:

```sql
SELECT TABLE_SCHEMA
	, TABLE_NAME
	, COLUMN_NAME
	, ORDINAL_POSITION
	, IS_NULLABLE
	, COLUMN_TYPE
	, COLUMN_KEY
FROM INFORMATION_SCHEMA.COLUMNS
#change the following value to whatever your database is named
WHERE TABLE_SCHEMA Like 'archivesspace'
```

Daarnaast hebben leden van het ArchivesSpace-ontwikkelingsteam en het Reports-team van de ArchivesSpace User Advisory Council een BÈTA-versie van een [gegevenswoordenboek voor ArchivesSpace](https://github.com/archivesspace/data-dictionary-initial) gemaakt.

## Hoofdrecordtabellen

Deze tabellen bevatten gegevens over de primaire recordtypen in ArchivesSpace. Hoofdrecordtypen onderscheiden zich van geneste records doordat ze een eigen blijvende URI hebben — overeenkomend met hun database-ID/primaire sleutel — die kan worden opgezocht via de medewerkersinterface, de publieke gebruikersinterface en de API. Ze onderscheiden zich van ondersteunende records doordat het de primaire beschrijvende recordtypen zijn waarmee gebruikers in het systeem werken.

Al deze records kunnen onafhankelijk van andere records worden aangemaakt, behalve archiefonderdelen. Records van archiefonderdelen vertegenwoordigen componenten van een grotere entiteit en moeten daarom een collectie als hoofdrecord hebben. Zie het onderdeel [ouder-kindrelaties](#parent-child-relationships-and-sequencing) voor meer informatie over de weergave van hiërarchische relaties in de database.

Een aantal veelvoorkomende velden komt in verschillende hoofdrecordtabellen voor. Deze overeenkomstige velden zijn gedefinieerd in de bovenliggende schema's in de map `common/schemas`:

| Kolomnaam                                       | Tabellen                                                                                 |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `title`                                         | `accession`, `archival_object`, `digital_object`, `digital_object_component`, `resource` |
| `identifier`/`component_id`/`digital_object_id` | `accession`, `resource`/`archival_object`, `digital_object_component`/`digital_object`   |
| `other_level`                                   | `archival_object`, `resource`                                                            |
| `repository_processing_note`                    | `archival_object`, `resource`                                                            |

<!-- Booleans -->

Alle hoofdrecords hebben velden die booleaanse waarden (`0` of `1`) opslaan. Deze geven aan of records zijn gepubliceerd in de publieke gebruikersinterface, zijn onderdrukt in de medewerkersinterface of onder een bepaalde beperking vallen. De tabel `repository` vormt hierop een uitzondering: deze heeft geen booleaans veld voor beperkingen, maar wel een booleaans veld `hidden`. De tabel `accession` bevat meerdere booleaanse velden die verband houden met beperkingen. Zie het onderstaande onderdeel voor meer informatie over booleaanse velden.

Vanaf versie 2.6.0 bevatten de hoofdrecordtabellen (en enkele ondersteunende records; zie hieronder) ook velden met gegevens over Archival Resource Keys (ARK's) en leesbare URL's (slugs):

| Kolomnaam          | Tabellen                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------ |
| `slug`             | `accession`, `archival_object`, `digital_object`, `digital_object_component`, `repository`, `resource` |
| `external_ark_url` | `archival_object`, `resource`                                                                          |

In deze en alle andere tabellen worden ook enumeratiewaarden opgeslagen. Dit zijn vreemde sleutels die overeenkomen met database-ID's in de tabel `enumeration_value`, waarin gecontroleerde waarden worden opgeslagen. Zie het onderstaande onderdeel over enumeraties voor meer informatie.

Alle typen geneste gegevens — zoals datums, omvang en instanties — die betrekking hebben op een hoofdrecord of ondersteunend record, worden in eigen tabellen opgeslagen en via verwijzingen met vreemde sleutels in de tabellen met geneste records aan die records gekoppeld. Zie het onderstaande onderdeel over geneste records voor meer informatie.

De overige gegevens in de hoofdrecordtabellen zijn tekst en zijn uniek voor elke tabel:

| TABLE_NAME                 | COLUMN_NAME                     | IS_NULLABLE | COLUMN_TYPE  | COLUMN_KEY |
| -------------------------- | ------------------------------- | ----------- | ------------ | ---------- |
| `accession`                | `content_description`           | YES         | text         |            |
| `accession`                | `condition_description`         | YES         | text         |            |
| `accession`                | `disposition`                   | YES         | text         |            |
| `accession`                | `inventory`                     | YES         | text         |            |
| `accession`                | `provenance`                    | YES         | text         |            |
| `accession`                | `general_note`                  | YES         | text         |            |
| `accession`                | `accession_date`                | YES         | date         |            |
| `accession`                | `retention_rule`                | YES         | text         |            |
| `accession`                | `access_restrictions_note`      | YES         | text         |            |
| `accession`                | `use_restrictions_note`         | YES         | text         |            |
| `archival_object`          | `ref_id`                        | NO          | varchar(255) | MUL        |
| `digital_object_component` | `label`                         | YES         | varchar(255) |            |
| `repository`               | `repo_code`                     | NO          | varchar(255) | UNI        |
| `repository`               | `name`                          | NO          | varchar(255) |            |
| `repository`               | `org_code`                      | YES         | varchar(255) |            |
| `repository`               | `parent_institution_name`       | YES         | varchar(255) |            |
| `repository`               | `url`                           | YES         | varchar(255) |            |
| `repository`               | `image_url`                     | YES         | varchar(255) |            |
| `repository`               | `contact_persons`               | YES         | text         |            |
| `repository`               | `description`                   | YES         | text         |            |
| `repository`               | `oai_is_disabled`               | YES         | int          |            |
| `repository`               | `oai_sets_available`            | YES         | text         |            |
| `resource`                 | `ead_id`                        | YES         | varchar(255) |            |
| `resource`                 | `ead_location`                  | YES         | varchar(255) |            |
| `resource`                 | `finding_aid_title`             | YES         | text         |            |
| `resource`                 | `finding_aid_filing_title`      | YES         | text         |            |
| `resource`                 | `finding_aid_date`              | YES         | varchar(255) |            |
| `resource`                 | `finding_aid_author`            | YES         | text         |            |
| `resource`                 | `finding_aid_language_note`     | YES         | varchar(255) |            |
| `resource`                 | `finding_aid_sponsor`           | YES         | text         |            |
| `resource`                 | `finding_aid_edition_statement` | YES         | text         |            |
| `resource`                 | `finding_aid_series_statement`  | YES         | text         |            |
| `resource`                 | `finding_aid_note`              | YES         | text         |            |
| `resource`                 | `finding_aid_subtitle`          | YES         | text         |            |

<!-- arguably top contsainers should be here, or digital objects should be in the supporting records -->

## Tabellen met ondersteunende records

Net als de hierboven genoemde hoofdrecordtypen kunnen ondersteunende records onafhankelijk van andere records worden aangemaakt. Ze zijn via hun eigen URI bereikbaar in de medewerkersinterface en de API. Hun betekenis komt echter vooral voort uit hun veel-op-veelrelaties met hoofdrecordtypen en soms met andere ondersteunende recordtypen. Deze records bieden doorgaans aanvullende informatie over de primaire recordtypen of verrijken deze op een andere manier. Enkele ondersteunende recordtypen — bijvoorbeeld die in de tabel `term` — worden gebruikt om andere ondersteunende recordtypen aan te vullen.

| Tabellen van ondersteunende modules | Gekoppeld aan                                       |
| ----------------------------------- | --------------------------------------------------- |
| `agent_corporate_entity`            |
| `agent_family`                      |
| `agent_person`                      |
| `agent_software`                    |
| `assessment`                        |
| `classification`                    | `accession`, `resource`                             |
| `classification_term`               | `classification`, `accession`, `resource`           |
| `container_profile`                 | `top_container`                                     |
| `event`                             |
| `location`                          |
| `location_profile`                  | `location`                                          |
| `subject`                           | `resource`, `archival_object`                       |
| `term`                              | `subject`                                           |
| `top_container`                     |
| `vocabulary`                        | `subject`, `term`                                   |
| `assessment_attribute_definition`   | `assessment_attribute`, `assessment_attribute_note` |

<!-- is this the appropriate place for the assessment attribute def? Vocabulary? -->

## Tabellen met geneste records

<!-- link to ### Nested records section of the backend readme -->

Geneste records moeten bij een hoofdrecord of ondersteunend record horen; ze kunnen niet onafhankelijk worden aangemaakt. Daarom hebben ze geen eigen URI en zijn ze via de API alleen toegankelijk door het bovenliggende record op te halen waartoe ze behoren. In de medewerkersinterface zijn deze records opgenomen in de weergaven van hoofdrecords of ondersteunende records. In de API staan gegevens van geneste records in arrays binnen hoofdrecords of ondersteunende records.

De verschillende typen geneste records hebben wel hun eigen databasetabellen. Naast gegevens die specifiek zijn voor het type genest record, bevatten de tabellen ook kolommen met vreemde sleutels die de database-ID's van hoofdrecords of ondersteunende records bevatten. Een tabel met geneste records moet een waarde bevatten in een van de velden met vreemde sleutels. Sommige geneste records kunnen zelf een ander genest record als bovenliggend record hebben; zo heeft het geneste record `sub_container` de kolom met vreemde sleutel `instance_id`.

Geneste records hebben een één-op-veelrelatie met hun bovenliggende records. Daarom kan de `id` van een record meerdere keren voorkomen in een tabel met geneste records, bijvoorbeeld wanneer er twee datums aan een collectie zijn gekoppeld.

Houd er rekening mee dat geneste records bij elke opslag van het hoofdrecord of ondersteunende record waartoe ze behoren, worden verwijderd en opnieuw aangemaakt, ongeacht of het geneste record zelf is gewijzigd. Dit betekent dat de database-ID bij elke opslag wordt verwijderd en opnieuw toegewezen.

| Tabellen met geneste records | Vreemde sleutels                                                                                                                                                                                                                                                                                                                             |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `agent_contact`              | `agent_person_id`, `agent_family_id`, `agent_corporate_entity_id`, `agent_software_id`                                                                                                                                                                                                                                                       |
| `date`                       | `accession_id`, `deaccession_id`, `archival_object_id`, `resource_id`, `event_id`, `digital_object_id`, `digital_object_component_id`, `related_agents_rlshp_id`, `agent_person_id`, `agent_family_id`, `agent_corporate_entity_id`, `agent_software_id`, `name_person_id`, `name_family_id`, `name_corporate_entity_id`, `name_software_id` |
| `extent`                     | `accession_id`, `deaccession_id`, `archival_object_id`, `resource_id`, `digital_object_id`, `digital_object_component_id`                                                                                                                                                                                                                    |
| `external_document`          | `accession_id`, `archival_object_id`, `resource_id`, `subject_id`, `agent_person_id`, `agent_family_id`, `agent_corporate_entity_id`, `agent_software_id`, `rights_statement_id`, `digital_object_id`, `digital_object_component_id`, `event_id`                                                                                             |
| `external_id`                | `subject_id`, `accession_id`, `archival_object_id`, `collection_management_id`, `digital_object_id`, `digital_object_component_id`, `event_id`, `location_id`, `resource_id`                                                                                                                                                                 |
| `file_version`               | `digital_object_id`, `digital_object_component_id`                                                                                                                                                                                                                                                                                           |
| `instance`                   | `resource_id`, `archival_object_id`, `accession_id`                                                                                                                                                                                                                                                                                          |
| `name_authority_id`          | `name_person_id`, `name_family_id`, `name_software_id`, `name_corporate_entity_id`                                                                                                                                                                                                                                                           |
| `name_corporate_entity`      | `agent_corporate_entity_id`                                                                                                                                                                                                                                                                                                                  |
| `name_family`                | `agent_family_id`                                                                                                                                                                                                                                                                                                                            |
| `name_person`                | `agent_person_id`                                                                                                                                                                                                                                                                                                                            |
| `name_software`              | `agent_software_id`                                                                                                                                                                                                                                                                                                                          |
| `note`                       | `resource_id`, `archival_object_id`, `digital_object_id`, `digital_object_component_id`, `agent_person_id`, `agent_corporate_entity_id`, `agent_family_id`, `agent_software_id`, `rights_statement_act_id`, `rights_statement_id`                                                                                                            |
| `note_persistent_id`         | `note_id`, `parent_id`                                                                                                                                                                                                                                                                                                                       |
| `revision_statement`         | `resource_id`                                                                                                                                                                                                                                                                                                                                |
| `rights_restriction`         | `resource_id`, `archival_object_id`                                                                                                                                                                                                                                                                                                          |
| `rights_restriction_type`    | `rights_restriction_id`                                                                                                                                                                                                                                                                                                                      |
| `rights_statement`           | `accession_id`, `archival_object_id`, `resource_id`, `digital_object_id`, `digital_object_component_id`, `repo_id`                                                                                                                                                                                                                           |
| `rights_statement_act`       | `rights_statement_id`                                                                                                                                                                                                                                                                                                                        |
| `sub_container`              | `instance_id`                                                                                                                                                                                                                                                                                                                                |
| `telephone`                  | `agent_contact_id`                                                                                                                                                                                                                                                                                                                           |
| `user_defined`               | `accession_id`, `resource_id`, `digital_object_id`                                                                                                                                                                                                                                                                                           |
| `ark_name`                   | `archival_object_id`, `resource_id`                                                                                                                                                                                                                                                                                                          |
| `assessment_attribute_note`  | `assessment_id`                                                                                                                                                                                                                                                                                                                              |
| `assessment_attribute`       | `assessment_id`                                                                                                                                                                                                                                                                                                                              |
| `lang_material`              | `archival_object_id`, `resource_id`, `digital_object_id`, `digital_object_component_id`                                                                                                                                                                                                                                                      |
| `language_and_script`        | `lang_material_id`                                                                                                                                                                                                                                                                                                                           |
| `collection_management`      | `accession_id`, `resource_id`, `digital_object_id`                                                                                                                                                                                                                                                                                           |
| `location_function`          | `location_id`                                                                                                                                                                                                                                                                                                                                |

<!-- appropriate place for collection management and deaccession stuff? what about location function? all the rights statement stuff? Is there a specific thing that defines a subrecord as a subrecord? -->

## Relatietabellen

Deze tabellen maken koppelingen tussen hoofdrecords en ondersteunende records mogelijk. Relatietabellen zijn nodig omdat tabellen met ondersteunende records, anders dan tabellen met geneste records, geen vreemde sleutels bevatten die ze aan de hoofdrecordtabellen koppelen.

De meeste relatietabellen hebben het achtervoegsel `_rlshp` in hun naam. Gewoonlijk bevatten ze alleen de primaire sleutels van de tabellen die aan elkaar worden gekoppeld, maar enkele tabellen bevatten ook velden die specifiek zijn voor de relatie tussen de twee recordtypen.

| Relatie-/koppeltabellen             | Gekoppelde tabellen                                                                                                                                                                                                                                                                                                                                                               |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `assessment_reviewer_rlshp`         | `assessment` gekoppeld aan `agent_person`                                                                                                                                                                                                                                                                                                                                         |
| `assessment_rlshp`                  | `assessment` gekoppeld aan `accession`, `archival_object`, `resource` of `digital_object`                                                                                                                                                                                                                                                                                         |
| `classification_creator_rlshp`      | `classification` gekoppeld aan `agent_person`, `agent_family`, `agent_corporate_entity` of `agent_software`                                                                                                                                                                                                                                                                       |
| `classification_rlshp`              | `classification` of `classification_term` gekoppeld aan `resource` of `accession`                                                                                                                                                                                                                                                                                                 |
| `classification_term_creator_rlshp` | `classification_term` gekoppeld aan `agent_person`, `agent_family`, `agent_corporate_entity` of `agent_software`                                                                                                                                                                                                                                                                  |
| `event_link_rlshp`                  | `event` gekoppeld aan `accession`, `resource`, `archival_object`, `digital_object`, `digital_object_component`, `agent_person`, `agent_family`, `agent_corporate_entity`, `agent_software` of `top_container`. Bevat ook de tabel `role_id`, die met de tabel `enumeration_value` kan worden samengevoegd om de gebeurtenisrol (bron, uitkomst, overdracht, context) op te halen. |
| `instance_do_link_rlshp`            | `digital_object` gekoppeld aan `instance`                                                                                                                                                                                                                                                                                                                                         |
| `linked_agents_rlshp`               | `agent_person`, `agent_software`, `agent_family` of `agent_corporate_entity` gekoppeld aan `accession`, `archival_object`, `digital_object`, `digital_object_component`, `event` of `resource`. Bevat ook de tabellen `role_id` en `relator_id`, die met de tabel `enumeration_value` kunnen worden samengevoegd.                                                                 |
| `location_profile_rlshp`            | `location` gekoppeld aan `location_profile`                                                                                                                                                                                                                                                                                                                                       |
| `owner_repo_rlshp`                  | `location` gekoppeld aan `repository`                                                                                                                                                                                                                                                                                                                                             |
| `related_accession_rlshp`           | Koppelt een rij in de tabel `accession` aan een andere rij in die tabel. Bevat ook velden voor `relator` en het relatietype.                                                                                                                                                                                                                                                      |
| `related_agents_rlshp`              | `agent_person`, `agent_corporate_entity`, `agent_software` of `agent_family` gekoppeld aan andere agenttabellen, of twee rijen in dezelfde agenttabel. Bevat ook velden voor `relator`, `description` en het relatietype.                                                                                                                                                         |
| `spawned_rlshp`                     | `accession` gekoppeld aan `resource`. Bevat alle gekoppelde gegevens over het nog niet ontsloten materiaal, zelfs als de collectie niet vanuit het bijbehorende record is voortgekomen.                                                                                                                                                                                           |
| `subject_rlshp`                     | `subject` gekoppeld aan `accession`, `archival_object`, `resource`, `digital_object` of `digital_object_component`                                                                                                                                                                                                                                                                |
| `surveyed_by_rlshp`                 | `assessment` gekoppeld aan `agent_person`                                                                                                                                                                                                                                                                                                                                         |
| `top_container_housed_at_rlshp`     | `top_container` gekoppeld aan `location`. Bevat ook velden voor `start_date`, `end_date`, `status` en een vrije-tekstnotitie `note`.                                                                                                                                                                                                                                              |
| `top_container_link_rlshp`          | `top_container` gekoppeld aan `sub_container`                                                                                                                                                                                                                                                                                                                                     |
| `top_container_profile_rlshp`       | `top_container` gekoppeld aan `container_profile`                                                                                                                                                                                                                                                                                                                                 |
| `subject_term`                      | `subject` gekoppeld aan `term`                                                                                                                                                                                                                                                                                                                                                    |
| `linked_agent_term`                 | `linked_agents_rlshp` gekoppeld aan `term`                                                                                                                                                                                                                                                                                                                                        |

<!-- is the assessment definition thing a linking table - it pretty much only has foreign keys

Same question about one of the rights restriction tables - can't remember which one right now.
 -->

Het is niet altijd duidelijk welke relatietabellen de gewenste resultaten opleveren. Voer bijvoorbeeld de volgende query in een MySQL-editor in om een dozenlijst voor een bepaalde collectie op te halen:

```sql
SELECT DISTINCT 	CONCAT('/repositories/', resource.repo_id, '/resources/', resource.id) as resource_uri
	, resource.identifier
	, resource.title
	, tc.barcode as barcode
	, tc.indicator as box_number
FROM sub_container sc
JOIN top_container_link_rlshp tclr on tclr.sub_container_id = sc.id
JOIN top_container tc on tclr.top_container_id = tc.id
JOIN instance on sc.instance_id = instance.id
JOIN archival_object ao on instance.archival_object_id = ao.id
JOIN resource on ao.root_record_id = resource.id
#change to your desired resource id
WHERE resource.id = 4556
```

Soms moeten meerdere relatietabellen worden samengevoegd om de gewenste resultaten op te halen. Voer bijvoorbeeld de volgende query in een MySQL-editor in om alle dozen en mappen voor een bepaalde collectie op te halen, inclusief eventuele containerprofielen en locaties:

```sql
SELECT CONCAT('/repositories/', tc.repo_id, '/top_containers/', tc.id) as tc_uri
	, CONCAT('/repositories/', resource.repo_id, '/resources/', resource.id) as resource_uri
	, CONCAT('/repositories/', resource.repo_id) as repo_uri
	, CONCAT('/repositories/', ao.repo_id, '/archival_objects/', ao.id) as ao_uri
	, resource.identifier AS resource_identifier
	, resource.title AS resource_title
  , ao.display_string AS ao_title
  , ev2.value AS level
  , tc.barcode AS barcode
	, cp.name AS container_profile
	, tc.indicator AS container_num
  , ev.value AS sc_type
  , sc.indicator_2 AS sc_num
from sub_container sc
JOIN top_container_link_rlshp tclr on tclr.sub_container_id = sc.id
JOIN top_container tc on tclr.top_container_id = tc.id
LEFT JOIN top_container_profile_rlshp tcpr on tcpr.top_container_id = tc.id
LEFT JOIN container_profile cp on cp.id = tcpr.container_profile_id
LEFT JOIN top_container_housed_at_rlshp tchar on tchar.top_container_id = tc.id
JOIN instance on sc.instance_id = instance.id
JOIN archival_object ao on instance.archival_object_id = ao.id
JOIN resource on ao.root_record_id = resource.id
LEFT JOIN enumeration_value ev on ev.id = sc.type_2_id
LEFT JOIN enumeration_value ev2 on ev2.id = ao.level_id
#change to your desired resource id
WHERE resource.id = 4223

```

 <!-- Mention the CONCAT function for creating URIs -->

## Enumeraties

Alle gecontroleerde waarden die de applicatie gebruikt — met uitzondering van knopinfo, weergavewaarden voor de frontend/publieke interface en waarden die in enkele tabellen met ondersteunende records zijn opgeslagen (zie hieronder) — staan in een tabel met de naam `enumeration_values`. Gecontroleerde waarden zijn ingedeeld in verschillende bovenliggende enumeraties (vergelijkbaar met afzonderlijke lijsten met gecontroleerde waarden) die door verschillende recordtypen en typen geneste records worden gebruikt. Gegevens over bovenliggende enumeraties staan in de tabel `enumeration` en worden via een vreemde sleutel in het veld `enumeration_id` aan de tabel `enumeration_value` gekoppeld. In de recordtabellen en tabellen met geneste records staan enumeratiewaarden als vreemde sleutels in verschillende kolommen met vreemde sleutels, die doorgaans eindigen op `_id`.

ArchivesSpace wordt geleverd met een standaardset gecontroleerde waarden, maar eindgebruikers kunnen de meeste daarvan aanpassen via de medewerkersinterface en de API. Sommige waarden in de tabel `enumeration_value` zijn echter alleen-lezen. Deze waarden bepalen de terminologie en gegevenstypen die in verschillende delen van de applicatie worden gebruikt, zoals de diverse notitietypen.

Enumeratie-ID's komen als vreemde sleutels voor in verschillende databasetabellen:

| table_name                 | column_name                        | enumeration_name                                   |
| -------------------------- | ---------------------------------- | -------------------------------------------------- |
| `accession`                | `acquisition_type_id`              | accession_acquisition_type                         |
| `accession`                | `resource_type_id`                 | accession_resource_type                            |
| `agent_contact`            | `salutation_id`                    | agent_contact_salutation                           |
| `archival_object`          | `level_id`                         | archival_record_level                              |
| `collection_management`    | `processing_priority_id`           | collection_management_processing_priority          |
| `collection_management`    | `processing_status_id`             | collection_management_processing_status            |
| `collection_management`    | `processing_total_extent_type_id`  | extent_extent_type_id                              |
| `container_profile`        | `dimension_units_id`               | dimension_units                                    |
| `date`                     | `calendar_id`                      | date_calendar                                      |
| `date`                     | `certainty_id`                     | date_certainty                                     |
| `date`                     | `date_type_id`                     | date_type                                          |
| `date`                     | `era_id`                           | date_era                                           |
| `date`                     | `label_id`                         | date_label                                         |
| `deaccession`              | `scope_id`                         | deaccession_scope                                  |
| `digital_object`           | `digital_oject_type_id`            | digital_object_digital_object_type                 |
| `digital_object`           | `level_id`                         | digital_object_level                               |
| `event`                    | `event_type_id`                    | event_event_type                                   |
| `event`                    | `outcome_id`                       | event_outcome                                      |
| `extent`                   | `extent_type_id`                   | extent_extent_type                                 |
| `extent`                   | `portion_id`                       | extent_portion                                     |
| `external_document`        | `identifier_type_id`               | rights_statement_external_document_identifier_type |
| `file_version`             | `checksum_method_id`               | file_version_checksum_methods                      |
| `file_version`             | `file_format_name_id`              | file_version_file_format_name                      |
| `file_version`             | `use_statement_id`                 | file_version_use_statement                         |
| `file_version`             | `xlink_actuate_attribute_id`       | file_version_xlink_actuate_attribute               |
| `file_version`             | `xlink_show_attribute_id`          | file_version_xlink_show_attribute                  |
| `instance`                 | `instance_type_id`                 | instance_instance_type                             |
| `language_and_script`      | `language_id`                      |
| `language_and_script`      | `script_id`                        |
| `location`                 | `temporary_id`                     | location_temporary                                 |
| `location_function`        | `location_function_type_id`        | location_function_type                             |
| `location_profile`         | `dimension_units_id`               | dimension_units                                    |
| `name_corporate_entity`    | `rules_id`                         | name_rule                                          |
| `name_corporate_entity`    | `source_id`                        | name_source                                        |
| `name_family`              | `rules_id`                         | name_rule                                          |
| `name_family`              | `source_id`                        | name_source                                        |
| `name_person`              | `name_order_id`                    | name_person_name_order                             |
| `name_person`              | `rules_id`                         | name_rule                                          |
| `name_person`              | `source_id`                        | name_source                                        |
| `name_software`            | `rules_id`                         | name_rule                                          |
| `name_software`            | `source_id`                        | name_source                                        |
| `repository`               | `country_id`                       | country_iso_3166                                   |
| `resource`                 | `finding_aid_description_rules_id` | resource_finding_aid_description_rules             |
| `resource`                 | `finding_aid_language_id`          |
| `resource`                 | `finding_aid_script_id`            |
| `resource`                 | `finding_aid_status_id`            | resource_finding_aid_status                        |
| `resource`                 | `level_id`                         | archival_record_level                              |
| `resource`                 | `resource_type_id`                 | resource_resource_type                             |
| `rights_restriction_type`  | `restriction_type_id`              | restriction_type                                   |
| `rights_statement`         | `jurisdiction_id`                  |
| `rights_statement`         | `other_rights_basis_id`            | rights_statement_other_rights_basis                |
| `rights_statement`         | `rights_type_id`                   | rights_statement_rights_type                       |
| `rights_statement`         | `status_id`                        |
| `rights_statement_act`     | `act_type_id`                      | rights_statement_act_type                          |
| `rights_statement_act`     | `restriction_id`                   | rights_statement_act_restriction                   |
| `rights_statement_pre_088` | `ip_status_id`                     | rights_statement_ip_status                         |
| `rights_statement_pre_088` | `jurisdiction_id`                  |
| `rights_statement_pre_088` | `rights_type_id`                   | rights_statement_rights_type                       |
| `sub_container`            | `type_2_id`                        | container_type                                     |
| `sub_container`            | `type_3_id`                        | container_type                                     |
| `subject`                  | `source_id`                        | subject_source                                     |
| `telephone`                | `number_type_id`                   | telephone_number_type                              |
| `term`                     | `term_type_id`                     | subject_term_type                                  |
| `top_container`            | `type_id`                          | container_type                                     |

<!-- need to add some rlshp tables which have enums -->

Om de enumeratie-ID in de recordtabellen en tabellen met geneste records te vertalen, voegt u de tabel `enumeration_value` samen. Als u meerdere waarden wilt vertalen, kunt u de tabel meerdere keren samenvoegen, maar moet u voor elke tabel een alias gebruiken. Bijvoorbeeld:

```sql
SELECT CONCAT('/repositories/', ao.repo_id, '/archival_objects/', ao.id) as ao_uri
  , ao.display_string as ao_title
  , date.begin
  , date.end
  , ev.value as date_label
  , ev2.value as date_type
  , ev3.value as date_calendar
FROM archival_object ao
LEFT JOIN date on date.archival_object_id = ao.id
LEFT JOIN enumeration_value ev on ev.id = date.label_id
LEFT JOIN enumeration_value ev2 on ev2.id = date.date_type_id
LEFT JOIN enumeration_value ev3 on ev3.id = date.calendar_id
```

**OPMERKING**: records in `container_profile`, `location_profile` en `assessment_attribute_definition` zijn vergelijkbaar met records in de tabel `enumeration_value`, omdat ze gecontroleerde waarden opslaan waarnaar andere onderdelen van het systeem verwijzen. Ze verschillen er echter van doordat ze eigen tabellen hebben en via hun eigen URI bereikbaar zijn.

## Tabellen voor gebruikers, instellingen en rechten

Deze tabellen bevatten gebruikers- en rechtengegevens, gebruikers-, collectiebeherende-instelling- en algemene voorkeuren, en sjablonen voor RDE en aangepaste rapporten.

| Tabelnaam                | Beschrijving                                                                     |
| ------------------------ | -------------------------------------------------------------------------------- |
| `custom_report_template` | Sjablonen voor aangepaste rapporten                                              |
| `default_values`         | Instellingen voor standaardwaarden                                               |
| `group`                  | Gegevens over door elke collectiebeherende instelling aangemaakte rechtengroepen |
| `group_permission`       | Koppelt de rechtentabel aan de groeptabel                                        |
| `group_user`             | Koppelt de groeptabel aan de gebruikerstabel                                     |
| `oai_config`             | Configuratiegegevens voor het harvesten via OAI-PMH                              |
| `permission`             | Alle typen rechten die aan gebruikers kunnen worden toegekend                    |
| `preference`             | Gebruikersvoorkeuren                                                             |
| `rde_template`           | RDE-sjablonen                                                                    |
| `required_fields`        | Bevat door de collectiebeherende instelling bepaalde verplichte velden           |
| `user`                   | Gebruikersgegevens                                                               |

## Taaktabellen

Deze tabellen bevatten gegevens over achtergrondtaken, waaronder imports.

| Tabelnaam             | Beschrijving                                                         |
| --------------------- | -------------------------------------------------------------------- |
| `job`                 | Alle taken die in een ArchivesSpace-instantie zijn uitgevoerd        |
| `job_created_record`  | Records die via achtergrondtaken zijn aangemaakt                     |
| `job_input_file`      | Gegevens over invoerbestanden die bij achtergrondtaken zijn gebruikt |
| `job_modified_record` | Gegevens over records die via achtergrondtaken zijn gewijzigd        |

## Systeemtabellen

Deze tabellen houden acties op de database bij (zoals bewerkingen en verwijderingen), evenals systeemgebeurtenissen, sessie- en autorisatiegegevens en databasegegevens. Gewoonlijk wordt vanuit geen enkele andere tabel naar deze tabellen verwezen.

| Tabelnaam         | Beschrijving                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| `active_edit`     | Records die momenteel door een gebruiker worden bewerkt. Alleen-lezen-systeemtabel                     |
| `auth_db`         | Authenticatiegegevens voor gebruikers. Alleen-lezen-systeemtabel                                       |
| `deleted_records` | Records die in de afgelopen 24 uur zijn verwijderd. Alleen-lezen-systeemtabel                          |
| `notification`    | Meldingenstroom. Alleen-lezen-systeemtabel                                                             |
| `schema_info`     | Bevat de versie van het databaseschema. Alleen-lezen-systeemtabel.                                     |
| `sequence`        | De waarde komt overeen met het aantal onderliggende archiefonderdelen min 1. Alleen-lezen-systeemtabel |
| `session`         | Recente sessiegegevens. Alleen-lezen-systeemtabel                                                      |
| `system_event`    | Systeemgebeurtenisgegevens. Alleen-lezen-systeemtabel                                                  |

<!--  these are subrecords -->
<!-- | subnote_metadata |
| rights_statement_pre_088  | -->

## Ouder-kindrelaties en volgorde

### Aan een collectiebeherende instelling gekoppelde records

Veel hoofdrecords en ondersteunende records zijn gekoppeld aan een specifieke collectiebeherende instelling. In deze tabellen wordt de bovenliggende collectiebeherende instelling aangeduid met een vreemde sleutel die overeenkomt met de database-ID in de tabel `repository`:

| Kolomnaam | Beschrijving                                                      | Voorbeeld | Komt voor in                                                                                                                                                                                                                                                                                                                  |
| --------- | ----------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `repo_id` | De database-ID van de bovenliggende collectiebeherende instelling | `12`      | `accession`, `archival_object`, `assessment`, `assessment_attribute_definition`, `classification`, `classification_term`, `custom_report_template`, `default_values`, `digital_object`, `digital_object_component`, `event`, `group`, `job`, `preference`, `required_fields`, `resource`, `rights_statement`, `top_container` |

### Ouder-kindrelaties

Hiërarchische relaties tussen andere records worden ook met vreemde sleutels vastgelegd:

| Kolomnaam        | Beschrijving                                                                                                                                                                                                                                                                                   | Voorbeeld                                                 | Tabellen met primaire sleutel                                                                                        | Komt voor in                                                                               |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `root_record_id` | De database-ID van het bovenliggende hoofdrecord                                                                                                                                                                                                                                               | `4566`                                                    | `resource`, `digital_object`, `classification`                                                                       | `archival_object`, `digital_object_component`, `classification_term`                       |
| `parent_id`      | De database-ID van het directe bovenliggende record. Deze wordt gebruikt om bovenliggende records van hetzelfde type als het onderliggende record te identificeren (bijvoorbeeld twee records van archiefonderdelen). De waarde is NULL als het enige bovenliggende record het hoofdrecord is. | `1748121`                                                 | `archival_object`, `classification_term`, `digital_object_component`                                                 | `archival_object`, `classification_term`, `digital_object_component`, `note_persistent_id` |
| `parent_name`    | De database-ID of URI en het recordtype van het directe bovenliggende record                                                                                                                                                                                                                   | `144@archival_object`, `root@/repositories/2/resources/2` | `resource`, `archival_object`, `classification`, `classification_term`, `digital_object`, `digital_object_component` | `archival_object`, `classification_term`, `digital_object_component`                       |

Vanaf MySQL 8 kunt u met de volgende query recursief alle bovenliggende records van een archiefonderdeel ophalen (of alle archiefonderdelen die aan een collectie zijn gekoppeld):

```sql
WITH RECURSIVE ao_path AS
  (SELECT ao1.id
    , ao1.display_string
    , ao1.component_id
    , ao1.parent_id
    , ev.value as `ao_level`
    , 1 as level
   FROM archival_object ao1
   LEFT JOIN enumeration_value ev on ev.id = ao1.level_id
   WHERE ao1.id = <your ao id>
   <!-- to get all trees for a resource change to: WHERE ao1.root_record_id = <your root_record_id> -->
   UNION ALL
   SELECT ao2.id
    , ao2.display_string
    , ao2.component_id
    , ao2.parent_id
    , ev.value as `ao_level`
    , ao_path.level + 1 as level
   FROM ao_path
   JOIN archival_object ao2 on ao_path.parent_id = ao2.id
   LEFT JOIN enumeration_value ev on ev.id = ao2.level_id)
   SELECT GROUP_CONCAT(CONCAT(display_string, ' ', ' (', CONCAT(UPPER(SUBSTRING(ao_level,1,1)),LOWER(SUBSTRING(ao_level,2))), ' ', IF(component_id is not NULL, CAST(component_id as CHAR), "N/A"), ')') ORDER BY level DESC SEPARATOR ' > ') as tree
   FROM ao_path;

```

Alle onderliggende records ophalen (MySQL 8+):

Zowel bovenliggende als onderliggende records ophalen (MySQL 8+):

Voer de volgende query uit om alle bovenliggende records van een record op te halen in MySQL 5.7 en ouder:

```sql
SELECT (SELECT GROUP_CONCAT(CONCAT(display_string, ' (', ao_level, ')') SEPARATOR ' < ') as parent_path
		FROM (SELECT T2.display_string as display_string
					, ev.value as ao_level
			  FROM (SELECT @r AS _id
						, @p := @r AS previous
						, (SELECT @r := parent_id FROM archival_object WHERE id = _id) AS parent_id
						, @l := @l + 1 AS lvl
      				FROM ((SELECT @r := 1749840, @p := 0, @l := 0) AS vars,
           					archival_object h)
      					   WHERE @r <> 0 AND @r <> @p) AS T1
			  JOIN archival_object T2 ON T1._id = T2.id
			  LEFT JOIN enumeration_value ev on ev.id = T2.level_id
			  WHERE T2.id != 1749840
			  ORDER BY T1.lvl DESC) as all_parents) as p_path
	 , ao.display_string
	 , CONCAT('/repositories/', ao.repo_id, '/archival_objects/', ao.id) as uri
FROM archival_object ao
WHERE ao.id = 1749840
```

Alle onderliggende records van een record ophalen (MysQL 5.7 en ouder):

```sql

```

### Volgorde

De volgorde van records in een `resource`-, `classification`- of `digital_object`-boom wordt bepaald door het veld `position`. Dit veld wordt ook gebruikt om waarden te ordenen in de tabellen `enumeration_value` en `assessment_attribute_definition`:

| Kolomnaam  | Beschrijving                                                               | Voorbeeld | Komt voor in                                                                                                                 |
| ---------- | -------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `position` | De positie van het archiefonderdeel onder het directe bovenliggende record | `168000`  | `enumeration_value`, `assessment_attribute_definition`, `classification_term`, `digital_object_component`, `archival_object` |

## Booleaanse velden

Veel records en geneste records bevatten velden met gehele getallen (`0` of `1`) die overeenkomen met booleaanse waarden.

| Booleaanse velden    | Beschrijving | Komt voor in                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| -------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `publish`            |              | `subnote_metadata`, `file_version`, `external_document`, `accession`, `classification`, `agent_person`, `agent_family`, `agent_software`, `agent_corporate_entity`, `classification_term`, `revision_statement`, `repository`, `note`, `digital_object`, `digital_object_component`, `archival_object`, `resource`                                                                                                                                                                                                                                                                                                    |
| `suppressed`         |              | `accession`, `archival_object`, `assessment_reviewer_rlshp`, `assessment_rlshp`, `classification`, `classification_creator_rlshp`, `classification_rlshp`, `classification_term`, `classification_term_creator_rlshp`, `digital_object`, `digital_object_component`, `enumeration_value`, `event`, `event_link_rlshp`, `instance_do_link_rlshp`, `linked_agents_rlshp`, `location_profile_rlshp`, `owner_repo_rlshp`, `related_accession_rlshp`, `related_agents_rlshp`, `resource`, `spawned_rlshp`, `surveyed_by_rlshp`, `top_container_housed_at_rlshp`, `top_container_link_rlshp`, `top_container_profile_rlshp` |
| `restrictions_apply` |              | `accession`, `archival_object`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

<!-- NEED TO ADD the restriction field here - the resource and dig ob recs have it -->
<!-- also add the hidden field in repo and the multiple restrictions in accession -->
<!-- I think this is good to mention because these are editable via the API but also have their own endpoints. So they are a little different. Should also mention that they are bools in the API docs. -->

## Alleen-lezenvelden

In veel tabellen komen verschillende door het systeem gegenereerde, alleen-lezenvelden voor. Hiertoe behoren database-ID's, tijdstempels die het aanmaken en wijzigen van records bijhouden, en velden met de gebruikersnaam van de gebruiker die elk record heeft aangemaakt en voor het laatst heeft gewijzigd.

| Meest voorkomende alleen-lezenvelden | Beschrijving                                                                                                                                                                               |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id` (primary key)                   | Database-ID voor elk record                                                                                                                                                                |
| `system_mtime`                       | Het laatste tijdstip waarop het record door het systeem is gewijzigd                                                                                                                       |
| `created_by`                         | De gebruiker die een record heeft aangemaakt                                                                                                                                               |
| `last_modified_by`                   | De gebruiker die een record voor het laatst heeft gewijzigd                                                                                                                                |
| `user_mtime`                         | Het tijdstip waarop een gebruiker een record voor het laatst heeft gewijzigd                                                                                                               |
| `create_time`                        | Het tijdstip waarop een record is aangemaakt                                                                                                                                               |
| `lock_version`                       | Dit veld wordt telkens verhoogd wanneer een record wordt bijgewerkt. Zo kunnen updates worden bijgehouden en bijna gelijktijdige bewerkingen door verschillende gebruikers worden beheerd. |
| `json_schema_version`                | De versie van het JSON-schema                                                                                                                                                              |
| `aspace_relationship_position`       | De positie van een gekoppeld record in een lijst met andere gekoppelde records                                                                                                             |
| `is_slug_auto`                       | Een booleaanse waarde die aangeeft of een slug automatisch is gegenereerd                                                                                                                  |
| `system_generated`                   | Een booleaanse waarde die aangeeft of een veld door het systeem is gegenereerd                                                                                                             |
| `display_string`                     | Een door het systeem gegenereerd veld dat de titel- en datumvelden van een record van een archiefonderdeel samenvoegt                                                                      |

**OPMERKING**: in tabellen met geneste records kunnen deze velden onverwachte gegevens bevatten. Omdat geneste records bij elke opslag van een hoofdrecord of ondersteunend record worden verwijderd en opnieuw aangemaakt, worden ook hun aanmaak- en wijzigingstijdstippen opnieuw ingesteld. Deze geven dus niet de oorspronkelijke aanmaakdatum van het geneste record zelf weer. Voor collecties registreert de tijdstempel alleen wanneer de collectie zelf is gewijzigd, niet wanneer een van de componenten voor het laatst is gewijzigd.

<!-- ## Querying the ArchivesSpace Database -->
