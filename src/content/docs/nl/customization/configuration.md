---
title: Configuratie
description: Een overzicht van alle beschikbare configuratieopties in het bestand config/config.rb, met configuratienamen, waarden en suggesties voor de configuratie.
---

De belangrijkste configuratie van ArchivesSpace staat in het bestand config/config.rb.
Standaard bevat dit bestand de standaardinstellingen. Deze zijn herkenbaar aan
regels die als commentaar zijn gemarkeerd (in het bestand aangeduid met "#").
U kunt deze instellingen aanpassen door nieuwe regels toe te voegen die de
standaardwaarden wijzigen en ArchivesSpace opnieuw te starten. Zorg ervoor dat
uw nieuwe instellingen niet als commentaar zijn gemarkeerd (begin dus NIET met
"#"), anders worden ze niet toegepast.

## Veel gewijzigde instellingen

### Databaseconfiguratie

#### :db_url

Stel de naam en inloggegevens van uw database in. De standaardwaarde geeft aan dat
de ingebouwde database moet worden gebruikt.
Het wordt aanbevolen een MySQL-database te gebruiken in plaats van de ingebouwde database.
Zie [MySQL gebruiken](../provisioning/mysql) voor meer informatie.

Dit is een voorbeeld van het opgeven van MySQL-referenties:

`AppConfig[:db_url] = "jdbc:mysql://127.0.0.1:3306/aspace?useUnicode=true&characterEncoding=UTF-8&user=as&password=as123"`

#### :db_max_connections

Stel het maximumaantal databaseverbindingen in dat de applicatie gebruikt.
De standaardwaarde is afgeleid van het aantal threads van het indexeerproces.

`AppConfig[:db_max_connections] = proc { 20 + (AppConfig[:indexer_thread_count] * 2) }`

### URL's voor ArchivesSpace-componenten

Stel de poort van de ArchivesSpace-backend in. De backend luistert standaard op poort 8089.

`AppConfig[:backend_url] = "http://localhost:8089"`

Stel de poort van de ArchivesSpace-medewerkersinterface (frontend) in. De medewerkersinterface luistert standaard op poort 8080.

`AppConfig[:frontend_url] = "http://localhost:8080"`

Stel de poort van de ArchivesSpace-publieke interface in. De publieke interface luistert standaard op poort 8081.

`AppConfig[:public_url] = "http://localhost:8081"`

Stel de poort van de ArchivesSpace OAI-server in. De OAI-server luistert standaard op poort 8082.

`AppConfig[:oai_url] = "http://localhost:8082"`

Stel de poort van de ArchivesSpace Solr-index in. De Solr-server luistert standaard op poort 8090.

`AppConfig[:solr_url] = "http://localhost:8090"`

Stel de poort van het ArchivesSpace-indexeerproces in. Het indexeerproces luistert standaard op poort 8091.

`AppConfig[:indexer_url] = "http://localhost:8091"`

Stel de poort van de ArchivesSpace-API-documentatie in. De API-documentatie luistert standaard op poort 8888.

`AppConfig[:docs_url] = "http://localhost:8888"`

### ArchivesSpace-componenten inschakelen

Schakel specifieke componenten in of uit door de volgende instellingen op true of false te zetten (standaard is true):

```ruby
AppConfig[:enable_backend] = true
AppConfig[:enable_frontend] = true
AppConfig[:enable_public] = true
AppConfig[:enable_solr] = true
AppConfig[:enable_indexer] = true
AppConfig[:enable_docs] = true
AppConfig[:enable_oai] = true
```

### Applicatielogging

Standaard wordt alle loguitvoer op het scherm weergegeven terwijl de opdracht
archivesspace wordt uitgevoerd. Wanneer de applicatie als daemon/service draait,
wordt deze uitvoer opgeslagen in `logs/archivesspace.out`. U kunt de loguitvoer
voor elke component naar een ander bestand sturen door de logwaarde te wijzigen
in een bestandspad waarnaar archivesspace schrijfrechten heeft.

U kunt ook het logniveau voor elke component instellen. Geldige waarden zijn:

- `debug` (everything)
- `info`
- `warn`
- `error`
- `fatal` (severe only)

#### `AppConfig[:frontend_log]`

Bestand voor loguitvoer van de frontend (medewerkersinterface). Stel dit in op
"default" om de loguitvoer naar archivesspace.out te sturen.

#### `#AppConfig[:frontend_log_level]`

Logniveau voor de frontend.

#### `AppConfig[:backend_log]`

Bestand voor loguitvoer van de backend. Stel dit in op "default" om de
loguitvoer naar archivesspace.out te sturen.

#### `#AppConfig[:backend_log_level]`

Logniveau voor de backend.

#### `AppConfig[:pui_log]`

Bestand voor loguitvoer van de publieke interface. Stel dit in op "default" om
de loguitvoer naar archivesspace.out te sturen.

#### `#AppConfig[:pui_log_level]`

Logniveau voor de publieke interface.

#### `AppConfig[:indexer_log]`

Bestand voor loguitvoer van het indexeerproces. Stel dit in op "default" om de
loguitvoer naar archivesspace.out te sturen.

#### `#AppConfig[:indexer_log_level]`

Logniveau voor het indexeerproces.

### Databaselogging

#### `AppConfig[:db_debug_log]`

Stel in op true om alle SQL-instructies te loggen.
Houd er rekening mee dat dit de prestaties kan beïnvloeden!

`AppConfig[:db_debug_log] = false`

#### `AppConfig[:mysql_binlog]`

Stel in op true als u MySQL-binaire logging hebt ingeschakeld.

`AppConfig[:mysql_binlog] = false`

### Solr-back-ups

#### `AppConfig[:solr_backup_schedule]`

Stel het schema voor Solr-back-ups in. Standaard worden de Solr-back-ups om
middernacht uitgevoerd. Zie https://crontab.guru/ voor informatie over de
syntaxis van het schema.

`AppConfig[:solr_backup_schedule] = "0 * * * *"`

#### `AppConfig[:solr_backup_number_to_keep]`

Het aantal Solr-back-ups dat moet worden bewaard (standaard = 1)

`AppConfig[:solr_backup_number_to_keep] = 1`

#### `AppConfig[:solr_backup_directory]`

Map waarin Solr-back-ups worden opgeslagen.

`AppConfig[:solr_backup_directory] = proc { File.join(AppConfig[:data_directory], "solr_backups") }`

### Standaard Solr-parameters

#### `AppConfig[:solr_params]`

Voeg standaard Solr-parameters toe.

Een eenvoudig voorbeeld: gebruik AND voor zoekopdrachten:

`AppConfig[:solr_params] = { "q.op" => "AND" }`

Een uitgebreider voorbeeld: stel de waarde van de boost query (bq) in om de
relevantie van de zoekopdracht in de titel te verhogen, stel de parameter voor
frasevelden (pf) in om de relevantie van de titel te verhogen wanneer de
zoektermen dicht bij elkaar staan, en stel de parameter phrase slop (ps) voor
de parameter pf in om aan te geven hoe dicht de termen bij elkaar moeten staan:

```ruby
AppConfig[:solr_params] = {
  "bq" => proc { "title:\"#{@query_string}\"*" },
  "pf" => 'title^10',
  "ps" => 0,
}
```

### Taal

#### `AppConfig[:locale]`

Stel de taal van de applicatie in (zie de .yml-bestanden in
https://github.com/archivesspace/archivesspace/tree/master/common/locales
voor een lijst met beschikbare localecodes). De standaardtaal is Engels (:en):

`AppConfig[:locale] = :en`

### Plug-ins registreren

#### `AppConfig[:plugins]`

De plug-ins die moeten worden geladen. Ze worden geladen in de opgegeven volgorde.

`AppConfig[:plugins] = ['local',  'lcnaf']`

### Aantal threads

#### `AppConfig[:job_thread_count]`

Het aantal gelijktijdige threads dat beschikbaar is voor achtergrondtaken.
Deze instelling is toegevoegd omdat langlopende taken de wachtrij blokkeerden.
Stel dit aantal niet te hoog in.

`AppConfig[:job_thread_count] = 2`

### OAI-configuratieopties

#### `AppConfig[:oai_ead_options]`

`AppConfig[:oai_ead_options] = { :include_daos => true, :use_numbered_c_tags => true, :include_uris => false }`

**LET OP: Vanaf versie 2.5.2 zijn de volgende parameters (`oai_repository_name`, `oai_record_prefix`, `oai_admin_email` en `oai_sets`) verouderd. Stel deze in via de medewerkersinterface. Kies daarvoor in de medewerkersinterface het menu System en selecteer vervolgens Manage OAI-PMH Settings. Deze drie instellingen staan bovenaan de pagina in het gedeelte General Settings. In versie 2.6.0 zijn deze instellingen uit het configuratiebestand verwijderd.**

#### `AppConfig[:oai_repository_name]`

`AppConfig[:oai_repository_name] = 'ArchivesSpace OAI Provider'`

#### `AppConfig[:oai_record_prefix]`

`AppConfig[:oai_record_prefix] = 'oai:archivesspace'`

#### `AppConfig[:oai_admin_email]`

`AppConfig[:oai_admin_email] = 'admin@example.com'`

#### `AppConfig[:oai_sets]`

Naast sets op basis van beschrijvingsniveau kunt u als volgt OAI-sets
definiëren op basis van instellingscodes en/of sponsors:

```ruby
AppConfig[:oai_sets] = {
  'repository_set' => {
    :repo_codes => ['hello626'],
    :description => "A set of one or more repositories",
  },

  'sponsor_set' => {
    :sponsors => ['The_Sponsor'],
    :description => "A set of one or more sponsors",
  },
}
```

## Andere, minder vaak gewijzigde instellingen

### Standaardwachtwoord voor de beheerder

#### `AppConfig[:default_admin_password]`

Stel het standaardwachtwoord voor de beheerder in. Het standaardwachtwoord is "admin".

`#AppConfig[:default_admin_password] = "admin"`

### Datamappen

#### `AppConfig[:data_directory]`

Als u ArchivesSpace uitvoert met de standaardscripts (archivesspace.sh of
archivesspace.bat) of als Windows-service gebruikt, wordt de waarde van :data_directory
automatically ingesteld op de map "data" van uw ArchivesSpace-distributie.
U hoeft deze waarde niet te wijzigen, tenzij u wilt dat ArchivesSpace de
gegevensbestanden ergens anders opslaat.

`AppConfig[:data_directory] = File.join(Dir.home, "ArchivesSpace")`

#### `AppConfig[:backup_directory]`

Map voor geautomatiseerde back-ups bij gebruik van de ingebouwde demodatabase (Apache Derby in plaats van MySQL). Standaard is dit `demo_db_backups` in de map `data`.

`AppConfig[:backup_directory] = proc { File.join(AppConfig[:data_directory], "demo_db_backups") }`

### Solr-standaardwaarden

#### `AppConfig[:solr_indexing_frequency_seconds]`

Het aantal seconden tussen elke uitvoering van de SUI- en PUI-indexeerprocessen. De indexeerprocessen voeren elke ingestelde periode een indexeringscyclus uit.

`AppConfig[:solr_indexing_frequency_seconds] = 30`

#### `AppConfig[:solr_facet_limit]`

Het maximumaantal verschillende facetwaarden dat Solr in het antwoord voor een bepaald veld opneemt.

`AppConfig[:solr_facet_limit] = 100`

#### `AppConfig[:default_page_size]`

Het aantal records op elke pagina in alle gepagineerde backend-API-antwoorden.
`AppConfig[:default_page_size] = 10`

#### `AppConfig[:max_page_size]`

Aanvragen aan de backend-API kunnen een aangepaste page_size-parameter opgeven. Dit is de maximaal toegestane paginagrootte.
`AppConfig[:max_page_size] = 250`

### Cookieprefix

#### `AppConfig[:cookie_prefix]`

Een voorvoegsel dat wordt toegevoegd aan cookies die de applicatie gebruikt.
Wijzig dit als u meerdere instanties van ArchivesSpace op dezelfde hostnaam
uitvoert (bijvoorbeeld meerdere instanties op verschillende poorten).
De standaardwaarde is "archivesspace".

`AppConfig[:cookie_prefix] = "archivesspace"`

### Instellingen van het SUI-indexeerproces

De grootte van elke batch records die naar elke workerthread van het indexeerproces wordt gestuurd om te verwerken en naar Solr te verzenden.
Het periodieke indexeerproces kan meerdere threads gebruiken om meerdere CPU-kernen
te benutten. Met deze twee opties bepaalt u hoeveel CPU-kernen worden gebruikt
en hoeveel geheugen het indexeringsproces verbruikt (meer kernen en/of meer
records per thread betekent meer geheugengebruik).

#### `AppConfig[:indexer_records_per_thread]`

De grootte van elke batch records die naar elke workerthread van het indexeerproces wordt gestuurd om te verwerken en naar Solr te verzenden. Meer records per thread betekent dat het indexeerproces meer geheugen gebruikt.
`AppConfig[:indexer_records_per_thread] = 25`

#### `AppConfig[:indexer_thread_count]`

Het aantal workerthreads dat het SUI-indexeerproces gebruikt. Meer workerthreads betekent dat meer CPU-kernen worden gebruikt.
`AppConfig[:indexer_thread_count] = 4`

#### `AppConfig[:indexer_solr_timeout_seconds]`

Het indexeerproces stuurt aanvragen naar Solr om bijgewerkte records naar de Solr-index te verzenden. Dit is het maximumaantal seconden dat het indexeerproces op een antwoord van Solr wacht.

`AppConfig[:indexer_solr_timeout_seconds] = 300`

### Instellingen van het PUI-indexeerproces

#### `AppConfig[:pui_indexer_enabled]`

Als dit op false staat, wordt er geen PUI-indexeerproces gestart. Stel dit in op false als u de PUI helemaal niet gebruikt.
`AppConfig[:pui_indexer_enabled] = true`

#### `AppConfig[:pui_indexing_frequency_seconds]`

Het aantal seconden tussen elke uitvoering van het PUI-indexeerproces. Het indexeerproces voert elke ingestelde periode een indexeringscyclus uit.
`AppConfig[:pui_indexing_frequency_seconds] = 30`

#### `AppConfig[:pui_indexer_records_per_thread]`

De grootte van elke batch records die naar elke workerthread van het indexeerproces wordt gestuurd om te verwerken en naar Solr te verzenden.
Het PUI-indexeerproces kan meerdere threads gebruiken om meerdere CPU-kernen
te benutten. Met deze twee opties bepaalt u hoeveel CPU-kernen worden gebruikt
en hoeveel geheugen het indexeringsproces verbruikt (meer kernen en/of meer
records per thread betekent meer geheugengebruik).

`AppConfig[:pui_indexer_records_per_thread] = 25`

#### `AppConfig[:pui_indexer_thread_count]`

Het aantal workerthreads dat het PUI-indexeerproces gebruikt. Meer workerthreads betekent dat meer CPU-kernen worden gebruikt.
`AppConfig[:pui_indexer_thread_count] = 1`

### Indexstatus

#### `AppConfig[:index_state_class]`

Het indexeerproces heeft een locatie nodig om de status op te slaan (bij te
houden welke records al zijn geïndexeerd).
Stel in op 'IndexState' (standaard) om de status op te slaan in de lokale map `data`.
Stel in op 'IndexStateS3' (optioneel) om de status op te slaan in een AWS S3-bucket in de Amazon Cloud.

`AppConfig[:index_state_class] = 'IndexState'`

#### `AppConfig[:index_state_s3]` - Alleen relevant bij gebruik van S3-opslag voor de status van het indexeerproces

Als u S3-opslag gebruikt voor de status van het indexeerproces in Amazon S3 (optioneel), moet u de toegang tot S3 configureren.

LET OP: S3 brengt kosten in rekening voor lees- en updateaanvragen. Omdat het
PUI-indexeerproces voortdurend statusbestanden bijwerkt, kunt u overwegen
`pui_indexing_frequency_seconds` en `solr_indexing_frequency_seconds` te verhogen.

##### S3-toegang configureren met omgevingsvariabelen (standaard)

Standaard wordt de S3-configuratie opgehaald uit de volgende shellomgevingsvariabelen:

- `AWS_REGION`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_ASPACE_BUCKET`

De configuratie gebruikt de instelling `:cookie_prefix` als voorvoegsel voor de statusbestanden in de bucket. Dit is handig wanneer dezelfde bucket wordt gebruikt om de indexeerstatus van meerdere ArchivesSpace-instanties op te slaan.

##### S3-toegang configureren met een AppConfig-variabele in het bestand `config.rb`

```ruby
AppConfig[:index_state_s3] = {
  region: "us-east-1",
  aws_access_key_id: "ASIAXXXXEXAMPLEID",
  aws_secret_access_key: "xXxxXXxxXX/XXXXXX/XXXXXXXEXAMPLEKEY",
  bucket: ENV.fetch("my-as-test-bucket"),
  prefix: proc { "#{AppConfig[:cookie_prefix]}_" },
}
```

U kunt `prefix: "some random string"` gebruiken in plaats van de bovenstaande code die de AppConfig-variabele `:cookie_prefix` gebruikt.

### Overige databaseopties

#### `AppConfig[:allow_other_unmapped]`

Sta toe dat de speciale enumeratiewaarde `other_unmapped` wordt toegewezen aan
velden met een dynamische enumeratie (gecontroleerde waarden). Als dit is
ingesteld op `true`, wordt `other_unmapped` beschouwd als een geldige waarde
voor alle velden met enumeraties (gecontroleerde waarden). De waarde
`other_unmapped` wordt toegevoegd als mogelijke waarde aan alle lijsten met
gecontroleerde waarden.
Deze functie is bedoeld voor niet-toegewezen of onbekende enumeratiewaarden en
kan van pas komen bij datamigraties wanneer brongegevens waarden bevatten die
nog niet in lijsten met gecontroleerde waarden zijn gedefinieerd, of bij het
importeren van externe gegevens met waarden die nog niet in zo'n lijst staan.

`AppConfig[:allow_other_unmapped] = false`

#### `AppConfig[:db_url_redacted]`

Hiermee bepaalt u hoe de database-URL (met de databasegebruikersnaam en het
wachtwoord) in de logboeken wordt weergegeven. Standaard worden de
gebruikersnaam en het wachtwoord vervangen door `REDACTED`, zodat:
`"user=john&password=secret123"`
wordt:
`"user=[REDACTED]&password=[REDACTED]"`

`AppConfig[:db_url_redacted] = proc { AppConfig[:db_url].gsub(/(user|password)=(.*?)(&|$)/, '\1=[REDACTED]\3') }`

#### `AppConfig[:demo_db_backup_schedule]`

Bij gebruik van de ingebouwde demodatabase (Apache Derby in plaats van MySQL)
bepaalt dit het schema van de geautomatiseerde back-ups in cron-indeling.
Standaard worden deze elke dag om 4.00 uur uitgevoerd.

`AppConfig[:demo_db_backup_schedule] = "0 4 * * *"`

#### `AppConfig[:demo_db_backup_number_to_keep] = 7`

Het aantal back-ups dat beschikbaar blijft bij gebruik van de ingebouwde demodatabase.

`AppConfig[:demo_db_backup_number_to_keep] = 7`

#### `AppConfig[:allow_unsupported_database]`

Stel dit in op true als u beslist een andere database te gebruiken dan MySQL of de op Apache Derby gebaseerde ingebouwde demodatabase (niet aanbevolen!).

`AppConfig[:allow_unsupported_database] = false`

#### `AppConfig[:allow_non_utf8_mysql_database]`

Stel dit in op true om de standaardcontrole over te slaan die nagaat of de tekencodering van MySQL-tabellen is ingesteld op UTF8 (niet aanbevolen!).

`AppConfig[:allow_non_utf8_mysql_database] = false`

### Proxy-URL's

Als u gebruikersgerichte applicaties via een proxy aanbiedt
(bijvoorbeeld via een ander domein of een andere poort, via https of met een
voorvoegsel), wordt aanbevolen deze URL's in uw configuratie op te nemen.

#### `AppConfig[:frontend_proxy_url] = proc { AppConfig[:frontend_url] }`

Proxy-URL voor de frontend (medewerkersinterface)

`AppConfig[:frontend_proxy_url] = proc { AppConfig[:frontend_url] }`

#### `AppConfig[:public_proxy_url]`

Proxy-URL voor de publieke interface

`AppConfig[:public_proxy_url] = proc { AppConfig[:public_url] }`

#### `AppConfig[:oai_proxy_url]`

Proxy-URL voor de OAI-service (indien openbaar gemaakt; zie het OAI-gedeelte)

`AppConfig[:oai_proxy_url] = 'http://your-public-oai-url.example.com'`

#### `AppConfig[:frontend_proxy_prefix]`

Overschrijf deze instelling alleen als u weet wat u doet.

`AppConfig[:frontend_proxy_prefix] = proc { "#{URI(AppConfig[:frontend_proxy_url]).path}/".gsub(%r{/+$}, "/") }`

#### `AppConfig[:public_proxy_prefix]`

Overschrijf deze instelling alleen als u weet wat u doet.

`AppConfig[:public_proxy_prefix] = proc { "#{URI(AppConfig[:public_proxy_url]).path}/".gsub(%r{/+$}, "/") }`

### Componentapplicaties inschakelen

Als u een van deze instellingen op false zet, wordt de bijbehorende applicatie
niet gestart. Het tijdelijk uitschakelen van de frontend en de publieke
interfaces en/of het indexeerproces kan helpen bij geheugenproblemen tijdens
een migratie.

#### `AppConfig[:enable_backend]`

`AppConfig[:enable_backend] = true`

#### `AppConfig[:enable_frontend]`

`AppConfig[:enable_frontend] = true`

#### `AppConfig[:enable_public]`

`AppConfig[:enable_public] = true`

#### `AppConfig[:enable_solr]`

`AppConfig[:enable_solr] = true`

#### `AppConfig[:enable_indexer]`

`AppConfig[:enable_indexer] = true`

#### `AppConfig[:enable_docs]`

`AppConfig[:enable_docs] = true`

#### `AppConfig[:enable_oai]`

`AppConfig[:enable_oai] = true`

### Jetty afsluiten

In sommige situaties is het nodig de Jetty-service te kunnen afsluiten met
Jetty's ShutdownHandler. Hiermee kan een POST-aanvraag naar een specifieke URI
worden gestuurd om aan te geven dat de server moet worden afgesloten. Het
voorvoegsel voor dit URI-pad is ingesteld op `/xkcd` om de kans op een conflict
met een ander pad in de configuratie te verkleinen. Het volledige pad is dus:

`/xkcd/shutdown?token={randomly generated password}`

De launcher maakt hiervoor een wachtwoord aan en slaat dit op in de datamap.
Deze functie is standaard niet ingeschakeld.

#### `AppConfig[:use_jetty_shutdown_handler]`

`AppConfig[:use_jetty_shutdown_handler] = false`

#### `AppConfig[:jetty_shutdown_path]`

`AppConfig[:jetty_shutdown_path] = "/xkcd"`

### Meerdere backendinstanties beheren

Als u meerdere instanties van de backend achter een load balancer uitvoert,
vermeldt u hier de URL van elke backendinstantie. Deze instelling wordt
gebruikt voor realtime indexering, die rechtstreeks verbinding moet maken met
elke actieve instantie.

Standaard gaan we ervan uit dat u geen load balancer gebruikt. In dat geval
maken we alleen verbinding met de gewone backend-URL.

#### `AppConfig[:backend_instance_urls]`

`AppConfig[:backend_instance_urls] = proc { [AppConfig[:backend_url]] }`

### Thema

Zie https://docs.archivesspace.org/customization/theming/ voor aanpassingen aan thema's.

#### `AppConfig[:frontend_theme]`

Naam van het thema voor de medewerkersinterface

`AppConfig[:frontend_theme] = "default"`

#### `AppConfig[:public_theme]`

Naam van het thema voor de publieke interface

`AppConfig[:public_theme] = "default"`

### Sessie-expiratie

#### `AppConfig[:session_expire_after_seconds]`

Sessies waarvoor expiratie is ingeschakeld, verlopen na dit aantal seconden inactiviteit.

`AppConfig[:session_expire_after_seconds] = 3600`

#### `AppConfig[:session_nonexpirable_force_expire_after_seconds]`

Ook sessies waarvoor expiratie is uitgeschakeld, verlopen uiteindelijk, maar pas na een langere periode.

`AppConfig[:session_nonexpirable_force_expire_after_seconds] = 604800`

### Systeemgebruikersnamen

Er worden automatisch verborgen systeemgebruikers aangemaakt (niet zichtbaar
in Gebruikersbeheer van de medewerkersinterface) die het indexeerproces, de
PUI en de medewerkersinterface gebruiken om toegang te krijgen tot de backend-API.

#### `AppConfig[:search_username]`

De gebruikersnaam van de verborgen systeemgebruiker die het indexeerproces gebruikt om toegang te krijgen tot de backend-API.
`AppConfig[:search_username] = "search_indexer"`

#### `AppConfig[:public_username]`

De gebruikersnaam van de verborgen systeemgebruiker die de PUI gebruikt om toegang te krijgen tot de backend-API.

`AppConfig[:public_username] = "public_anonymous"`

#### `AppConfig[:staff_username]`

De gebruikersnaam van de verborgen systeemgebruiker die de medewerkersinterface gebruikt om toegang te krijgen tot de backend-API.

`AppConfig[:staff_username] = "staff_system"`

### Authenticatiebronnen

ArchivesSpace heeft eigen functionaliteit voor gebruikersbeheer, maar kan ook
worden geconfigureerd om gebruikers te authenticeren aan de hand van een of
meer [LDAP-directory's](../customization/ldap). OAuth-authenticatie is mogelijk
met de [aspace-oauth-plug-in](https://github.com/lyrasis/aspace-oauth).

`AppConfig[:authentication_sources] = []`

### Overige instellingen voor achterstand en momentopnamen

#### `AppConfig[:realtime_index_backlog_ms]`

> TODO - Meer documentatie nodig

`AppConfig[:realtime_index_backlog_ms] = 60000`

### Meldingen configureren

Een intern meldingssysteem houdt gebruikersvoorkeuren, enumeratiewaarden
(waarden uit gecontroleerde waardelijsten), informatie over collectiebeherende
instellingen enzovoort actueel in de interface en beperkt tegelijkertijd het
aantal aanvragen aan de backend-API.

#### `AppConfig[:notifications_backlog_ms]`

Meldingen die ouder zijn dan dit aantal milliseconden, worden als verlopen beschouwd en niet meer weergegeven.

`AppConfig[:notifications_backlog_ms] = 60000`

#### `AppConfig[:notifications_poll_frequency_ms]`

Hoe vaak meldingen moeten worden weergegeven.

`AppConfig[:notifications_poll_frequency_ms] = 1000`

#### `AppConfig[:max_usernames_per_source]`

> TODO - Meer documentatie nodig

`AppConfig[:max_usernames_per_source] = 50`

#### `AppConfig[:demodb_snapshot_flag]`

> TODO - Meer documentatie nodig

`AppConfig[:demodb_snapshot_flag] = proc { File.join(AppConfig[:data_directory], "create_demodb_snapshot.txt") }`

### Rapporten configureren

#### `AppConfig[:report_page_layout]`

Gebruikt geldige waarden voor de eigenschap size van de CSS3-richtlijn @page:
http://www.w3.org/TR/css3-page/#page-size-prop

`AppConfig[:report_page_layout] = "letter"`

#### `AppConfig[:report_pdf_font_paths]`

> TODO - Meer documentatie nodig

`AppConfig[:report_pdf_font_paths] = proc { ["#{AppConfig[:backend_url]}/reports/static/fonts/dejavu/DejaVuSans.ttf"] }`

#### `AppConfig[:report_pdf_font_family]`

> TODO - Meer documentatie nodig

`AppConfig[:report_pdf_font_family] = "\"DejaVu Sans\", sans-serif"`

### Plug-inmap

#### `AppConfig[:plugins_directory]`

Standaard staat de plug-inmap in de hoofdmap van ASpace.
Als u dit wilt wijzigen, geeft u hier een absoluut pad op.

`AppConfig[:plugins_directory] = "plugins"`

### Feedback

#### `AppConfig[:feedback_url]`

URL waarnaar de feedbacklink verwijst.
U kunt deze link uit de voettekst verwijderen door de waarde leeg te laten.

`AppConfig[:feedback_url] = "http://archivesspace.org/contact"`

### Gebruikersregistratie

#### `AppConfig[:allow_user_registration]`

Sta niet-geauthenticeerde gebruikers toe een account aan te maken.

`AppConfig[:allow_user_registration] = true`

### Help configureren

#### `AppConfig[:help_enabled]`

> TODO - Meer documentatie nodig

`AppConfig[:help_enabled] = true`

#### `AppConfig[:help_url]`

> TODO - Meer documentatie nodig

`AppConfig[:help_url] = "https://archivesspace.atlassian.net/wiki/spaces/ArchivesSpaceUserManual/overview"``

#### `AppConfig[:help_topic_base_url]`

> TODO - Meer documentatie nodig

`AppConfig[:help_topic_base_url] = "https://archivesspace.atlassian.net/wiki/spaces/ArchivesSpaceUserManual/pages/"``

### Gedeelde opslag

#### `AppConfig[:shared_storage]`

`AppConfig[:shared_storage] = proc { File.join(AppConfig[:data_directory], "shared") }`

### Achtergrondtaken

#### `AppConfig[:job_file_path]`

Voorheen bekend als :import_job_path

> TODO - Meer documentatie nodig

`AppConfig[:job_file_path] = proc { AppConfig.has_key?(:import_job_path) ? AppConfig[:import_job_path] : File.join(AppConfig[:shared_storage], "job_files") }`

#### `AppConfig[:job_poll_seconds]`

> TODO - Meer documentatie nodig

`AppConfig[:job_poll_seconds] = proc { AppConfig.has_key?(:import_poll_seconds) ? AppConfig[:import_poll_seconds] : 5 }`

#### `AppConfig[:job_timeout_seconds]`

> TODO - Meer documentatie nodig

`AppConfig[:job_timeout_seconds] = proc { AppConfig.has_key?(:import_timeout_seconds) ? AppConfig[:import_timeout_seconds] : 300 }`

#### `AppConfig[:jobs_cancelable]`

Sta standaard alleen toe dat taken worden geannuleerd wanneer MySQL wordt gebruikt (omdat we wijzigingen kunnen terugdraaien).

`AppConfig[:jobs_cancelable] = proc { (AppConfig[:db_url] != AppConfig.demo_db_url).to_s }`

### Locaties

#### `AppConfig[:max_location_range]`

> TODO - Meer documentatie nodig

`AppConfig[:max_location_range] = 1000`

### Controle van Schema Info

#### `AppConfig[:ignore_schema_info_check]`

De ASpace-backend start niet als de versie van schema_info in de database niet
correct is ingesteld voor deze versie van ASPACE. Dit zorgt ervoor dat alle
migraties zijn uitgevoerd en voltooid voordat de applicatie start. U kunt deze
controle hier overslaan, maar doet dit op eigen risico.

`AppConfig[:ignore_schema_info_check] = false`

### Demogegevens

#### `AppConfig[:demo_data_url]`

Dit is een URL naar demogegevens die kunnen worden gebruikt voor tests,
onderwijs enzovoort. Stel om deze gegevens te gebruiken de OS-omgevingsvariabele ASPACE_DEMO = true in.

`AppConfig[:demo_data_url] = "https://s3-us-west-2.amazonaws.com/archivesspacedemo/latest-demo-data.zip"`

### Externe ID's

#### `AppConfig[:show_external_ids]`

Toon externe ID's in de frontend.

`AppConfig[:show_external_ids] = false`

### Jetty-aanvraag-/antwoordbuffer

Stel de toegestane grootte in van de aanvraag-/antwoordheader die Jetty
accepteert (grotere headers leiden tot een 403-fout). Als u deze limiet wilt
verhogen, moet u ook Nginx/Apache configureren als u die gebruikt.

#### `AppConfig[:jetty_response_buffer_size_bytes]`

`AppConfig[:jetty_response_buffer_size_bytes] = 64 * 1024`

#### `AppConfig[:jetty_request_buffer_size_bytes]`

`AppConfig[:jetty_request_buffer_size_bytes] = 64 * 1024`

### Configuratievelden voor containerbeheer

#### `AppConfig[:container_management_barcode_length]`

Definieert globale en instellingsspecifieke validatie van barcodes (alleen op
lengte). Barcodes zonder waarde of met een waarde tussen :min en :max worden
bij het opslaan goedgekeurd.
Stel globale beperkingen in via :system_default en gebruik de waarde repo_code
voor beperkingen op instellingsniveau.
De waarden van :system_default worden waar mogelijk altijd overgenomen op lagere niveaus.

`AppConfig[:container_management_barcode_length] = {:system_default => {:min => 5, :max => 10}, 'repo' => {:min => 9, :max => 12}, 'other_repo' => {:min => 9, :max => 9} }`

#### `AppConfig[:container_management_extent_calculator]`

Definieert het gedrag van de omvangcalculator voor het hele systeem.
Gebruik :report_volume (true/false) om aan te geven of de ruimte in kubieke
of lineaire maten moet worden weergegeven.
Gebruik :unit (:feet, :inches, :meters, :centimeters) om de eenheid te bepalen
waarin de calculator de omvang weergeeft.
Gebruik :decimal_places om het aantal decimalen in te stellen dat de calculator teruggeeft.

Voorbeeld:

`AppConfig[:container_management_extent_calculator] = { :report_volume => true, :unit => :feet, :decimal_places => 3 }`

### Recordovererving in de publieke interface

#### `AppConfig[:record_inheritance]`

Definieer de velden die een recordtype overneemt van bovenliggende records
wanneer deze velden geen waarde hebben in het record zelf.
Deze instelling wordt gebruikt in common/record_inheritance.rb en is
ontwikkeld ter ondersteuning van de nieuwe publieke interface.
Let op: wijzigingen aan de configuratie van record_inheritance worden pas van
kracht nadat de PUI-records opnieuw zijn geïndexeerd. Verwijder hiervoor de
bestanden uit indexer_pui_state.

```ruby
AppConfig[:record_inheritance] = {
  :archival_object => {
    :inherited_fields => [
      {
        :property => 'title',
        :inherit_directly => true
      },
      {
        :property => 'component_id',
        :inherit_directly => false
      },
      {
        :property => 'language',
        :inherit_directly => true
      },
      {
        :property => 'dates',
        :inherit_directly => true
      },
      {
        :property => 'extents',
        :inherit_directly => false
      },
      {
        :property => 'linked_agents',
        :inherit_if => proc {|json| json.select {|j| j['role'] == 'creator'} },
        :inherit_directly => false
      },
      {
        :property => 'notes',
        :inherit_if => proc {|json| json.select {|j| j['type'] == 'accessrestrict'} },
        :inherit_directly => true
      },
      {
        :property => 'notes',
        :inherit_if => proc {|json| json.select {|j| j['type'] == 'scopecontent'} },
        :inherit_directly => false
      },
      {
        :property => 'notes',
        :inherit_if => proc {|json| json.select {|j| j['type'] == 'langmaterial'} },
        :inherit_directly => false
      },
    ]
  }
}
```

Samengestelde identificaties inschakelen; deze worden als eigenschap aan het
samengevoegde record toegevoegd:
`\_composite_identifier`

De hier weergegeven waarden voor `:include_level` en `:identifier_delimiter` zijn de standaardwaarden.

Als `:include_level` is ingesteld op true, worden niveauwaarden (bijvoorbeeld Series) opgenomen in `\_composite_identifier`.

De `:identifier_delimiter` wordt gebruikt om de vierdelige identificatie van collecties samen te voegen.

```ruby
AppConfig[:record_inheritance][:archival_object][:composite_identifiers] = {
  :include_level => false,
  :identifier_delimiter => ' '
}
```

Gebruik dit patroon in uw configuratie om aanvullende elementen te laten overerven.

```ruby
AppConfig[:record_inheritance][:archival_object][:inherited_fields] <<
  {
    :property => 'linked_agents',
    :inherit_if => proc {|json| json.select {|j| j['role'] == 'subject'} },
    :inherit_directly => true
  }
```

... of gebruik dit patroon om meerdere nieuwe elementen tegelijk toe te voegen.

```ruby
AppConfig[:record_inheritance][:archival_object][:inherited_fields].concat(
  [
    {
      :property => 'subjects',
      :inherit_if => proc {|json|
        json.select {|j|
          ! j['_resolved']['terms'].select { |t| t['term_type'] == 'topical'}.empty? }
        },
      :inherit_directly => true
    },
    {
      :property => 'external_documents',
      :inherit_directly => false
    },
    {
      :property => 'rights_statements',
      :inherit_directly => false
    },
    {
      :property => 'instances',
      :inherit_directly => false
    },
  ])
```

Als u een van de standaardregels wilt wijzigen, kunt u het beste de volledige
standaardconfiguratie van record_inheritance uit commentaar halen en uw
wijzigingen aanbrengen.
Als u bijvoorbeeld wilt voorkomen dat scopecontent-aantekeningen worden
overgenomen in records van het type file of item, haalt u de volledige
standaardconfiguratie van record_inheritance hierboven uit commentaar en voegt
u een skip_if-clausule toe aan de scopecontent-regel, zoals hier:

```ruby
  {
    :property => 'notes',
    :skip_if => proc {|json| ['file', 'item'].include?(json['level']) },
    :inherit_if => proc {|json| json.select {|j| j['type'] == 'scopecontent'} },
    :inherit_directly => false
  },
```

### PUI-configuraties

#### `AppConfig[:pui_search_results_page_size]`

`AppConfig[:pui_search_results_page_size] = 10`

#### `AppConfig[:pui_branding_img]`

`AppConfig[:pui_branding_img] = 'archivesspace.small.png'`

#### `AppConfig[:pui_block_referrer]`

`AppConfig[:pui_block_referrer] = true # patron privacy; blocks full 'referer' when going outside the domain`

#### `AppConfig[:pui_max_concurrent_pdfs]`

Het aantal PDF's dat we tegelijkertijd (op de achtergrond) genereren.

Het genereren van PDF's kan bij grote collecties veel geheugen verbruiken. Daarom
is deze waarde standaard vrij laag ingesteld.

`AppConfig[:pui_max_concurrent_pdfs] = 2`

#### `AppConfig[:pui_pdf_timeout]`

U kunt dit instellen op nil of nul om een time-out te voorkomen.

`AppConfig[:pui_pdf_timeout] = 600`

#### `AppConfig[:pui_hide]`

`AppConfig[:pui_hide] = {}`

De volgende instellingen bepalen welke 'tabbladen' in het hoofdmenu staan:

```ruby
AppConfig[:pui_hide][:repositories] = false
AppConfig[:pui_hide][:resources] = false
AppConfig[:pui_hide][:digital_objects] = false
AppConfig[:pui_hide][:accessions] = false
AppConfig[:pui_hide][:subjects] = false
AppConfig[:pui_hide][:agents] = false
AppConfig[:pui_hide][:classifications] = false
AppConfig[:pui_hide][:search_tab] = false
```

De volgende instellingen bepalen globaal of de verschillende 'badges' op de
pagina van de collectiebeherende instelling worden weergegeven. U kunt ze
hieronder per instelling overschrijven (bijvoorbeeld:
`AppConfig[:repos][{repo_code}][:hide][:counts] = true`

```ruby
AppConfig[:pui_hide][:resource_badge] = false
AppConfig[:pui_hide][:record_badge] = true # hide by default
AppConfig[:pui_hide][:digital_object_badge] = false
AppConfig[:pui_hide][:accession_badge] = false
AppConfig[:pui_hide][:subject_badge] = false
AppConfig[:pui_hide][:agent_badge] = false
AppConfig[:pui_hide][:classification_badge] = false
AppConfig[:pui_hide][:counts] = false
```

De volgende instelling bepaalt globaal of het navigatietabblad/-element
'containerinventaris' wordt verborgen op de collectiepagina.

```
AppConfig[:pui_hide][:container_inventory] = false
```

#### `AppConfig[:pui_requests_permitted_for_types]`

Bepaal wanneer de aanvraagknop wordt weergegeven.

`AppConfig[:pui_requests_permitted_for_types] = [:resource, :archival_object, :accession, :digital_object, :digital_object_component]`

#### `AppConfig[:pui_requests_permitted_for_containers_only]`

Stel in op 'true' als u aanvragen wilt uitschakelen wanneer er geen topcontainer is.

`AppConfig[:pui_requests_permitted_for_containers_only] = false`

#### `AppConfig[:pui_repos]`

Voorbeelden voor een specifieke collectiebeherende instelling. Vervang
{repo_code} door de code van uw instelling, bijvoorbeeld 'foo' (let op: gebruik
kleine letters).

`AppConfig[:pui_repos] = {}`

Voorbeelden:

Schakel aanvragen voor een bepaalde collectiebeherende instelling alleen in
voor bepaalde recordtypen (let op: deze configuratie overschrijft voor die
instelling AppConfig[:pui_requests_permitted_for_types]).

```ruby
AppConfig[:pui_repos]['foo'][:requests_permitted_for_types] = [:resource, :archival_object, :accession, :digital_object, :digital_object_component]
```

Schakel aanvragen voor een bepaalde collectiebeherende instelling uit.

```ruby
AppConfig[:pui_repos]['foo'][:requests_permitted_for_containers_only] = true
```

Stel het e-mailadres in waarnaar aanvragen voor de collectiebeherende instelling worden verstuurd:

```ruby
AppConfig[:pui_repos]['foo'][:request_email] = {email address}
```

> TODO - Meer documentatie hierover nodig

```ruby
AppConfig[:pui_repos]['foo'][:hide] = {}
AppConfig[:pui_repos]['foo'][:hide][:counts] = true
```

#### `AppConfig[:pui_display_deaccessions]`

> TODO - Meer documentatie nodig

`AppConfig[:pui_display_deaccessions] = true`

#### `AppConfig[:pui_page_actions_cite]`

Schakel de actie 'citeren' in of uit op de PUI-pagina van een collectie of archiefonderdeel.

`AppConfig[:pui_page_actions_cite] = true`

#### `AppConfig[:pui_page_actions_bookmark]`

Schakel de actie 'bladwijzer' in of uit op de PUI-pagina van een collectie of archiefonderdeel.

`AppConfig[:pui_page_actions_bookmark] = true`

#### `AppConfig[:pui_page_actions_request]`

Schakel de actie 'aanvragen' in of uit op de PUI-pagina van een collectie of archiefonderdeel.

`AppConfig[:pui_page_actions_request] = true`

#### `AppConfig[:pui_page_actions_print]`

Schakel de actie 'afdrukken' in of uit op de PUI-pagina van een collectie of archiefonderdeel.

`AppConfig[:pui_page_actions_print] = true`

#### `AppConfig[:pui_enable_staff_link]`

Voeg voor geauthenticeerde gebruikers vanuit het opgegeven record een link naar de medewerkersinterface toe.

`AppConfig[:pui_enable_staff_link] = true`

#### `AppConfig[:pui_staff_link_mode]`

Standaard opent de link het record in de medewerkersinterface in de bewerkingsmodus.
Wijzig dit in 'readonly' om het record in de alleen-lezenmodus te openen.

`AppConfig[:pui_staff_link_mode] = 'edit'`

#### `AppConfig[:pui_page_custom_actions]`

Voeg pagina-acties toe via de configuratie.

`AppConfig[:pui_page_custom_actions] = []`

Voorbeeld van een JavaScript-actie:

```ruby
AppConfig[:pui_page_custom_actions] << {
  'record_type' => ['resource', 'archival_object'], # the jsonmodel type to show for
  'label' => 'actions.do_something', # the I18n path for the action button
  'icon' => 'fa-paw', # the font-awesome icon CSS class
  'onclick_javascript' => 'alert("do something grand");',
}
```

Voorbeeld van een hyperlinkactie:

```ruby
AppConfig[:pui_page_custom_actions] << {
  'record_type' => ['resource', 'archival_object'], # the jsonmodel type to show for
  'label' => 'actions.do_something', # the I18n path for the action button
  'icon' => 'fa-paw', # the font-awesome icon CSS class
  'url_proc' => proc {|record| 'http://example.com/aspace?uri='+record.uri},
}
```

Voorbeeld van een formulieractie via POST:

```ruby
AppConfig[:pui_page_custom_actions] << {
  'record_type' => ['resource', 'archival_object'], # the jsonmodel type to show for
  'label' => 'actions.do_something', # the I18n path for the action button
  'icon' => 'fa-paw', # the font-awesome icon CSS class
  # 'post_params_proc' returns a hash of params which populates a form with hidden inputs ('name' => 'value')
  'post_params_proc' => proc {|record| {'uri' => record.uri, 'display_string' => record.display_string} },
  # 'url_proc' returns the URL for the form to POST to
  'url_proc' => proc {|record| 'http://example.com/aspace?uri='+record.uri},
  # 'form_id' as string to be used as the form's ID
  'form_id' => 'my_grand_action',
}
```

Voorbeeld van een ERB-actie:

```ruby
AppConfig[:pui_page_custom_actions] << {
  'record_type' => ['resource', 'archival_object'],
  # the jsonmodel type to show for
  # 'erb_partial' returns the path to an erb template from which the action will be rendered
  'erb_partial' => 'shared/my_special_action',
}
```

#### `AppConfig[:pui_email_enabled]`

E-mailinstellingen voor de PUI (e-mails worden gelogd als deze instelling is uitgeschakeld)

`AppConfig[:pui_email_enabled] = false`

#### `AppConfig[:pui_email_override]`

Zie hierboven AppConfig[:pui_repos][{repo_code}][:request_email] voor het
instellen van e-mailadressen per collectiebeherende instelling. Gebruik
'pui_email_override' voor tests; dit e-mailadres is het adres van alle verzonden e-mails.

`AppConfig[:pui_email_override] = 'testing@example.com'`

#### `AppConfig[:pui_request_email_fallback_to_address]`

Het 'aan'-e-mailadres voor collectiebeherende instellingen die geen eigen e-mailadres hebben ingesteld.

`AppConfig[:pui_request_email_fallback_to_address] = 'testing@example.com'`

#### `AppConfig[:pui_request_email_fallback_from_address]`

Het 'van'-e-mailadres voor collectiebeherende instellingen die geen eigen e-mailadres hebben ingesteld.

`AppConfig[:pui_request_email_fallback_from_address] = 'testing@example.com'`

#### `AppConfig[:pui_request_use_repo_email]`

Gebruik voor aanvragen het e-mailadres uit het record van de collectiebeherende instelling (overschrijft het configuratie-e-mailadres).

`AppConfig[:pui_request_use_repo_email] = false`

#### `AppConfig[:pui_email_delivery_method]`

`AppConfig[:pui_email_delivery_method] = :sendmail`

#### `AppConfig[:pui_email_sendmail_settings]`

```ruby
AppConfig[:pui_email_sendmail_settings] = {
  location: '/usr/sbin/sendmail',
  arguments: '-i'
}
```

#### `AppConfig[:pui_email_smtp_settings]`

Van toepassing wanneer `AppConfig[:pui_email_delivery_method]` is ingesteld op `:smtp`.

Voorbeeld van een SMTP-configuratie:

```ruby
AppConfig[:pui_email_smtp_settings] = {
  address: 'smtp.gmail.com',
  port: 587,
  domain: 'gmail.com',
  user_name: '<username>',
  password: '<password>',
  authentication: 'plain',
  enable_starttls_auto: true,
}
```

#### `AppConfig[:pui_email_perform_deliveries]`

`AppConfig[:pui_email_perform_deliveries] = true`

#### `AppConfig[:pui_email_raise_delivery_errors]`

`AppConfig[:pui_email_raise_delivery_errors] = true`

#### `AppConfig[:pui_readmore_max_characters]`

Het aantal tekens waarna aantekeningen worden afgebroken en de link 'Meer lezen' wordt weergegeven.

`AppConfig[:pui_readmore_max_characters] = 450`

#### `AppConfig[:pui_expand_all]`

Of standaard alle blokken met aanvullende informatie onderaan recordpagina's moeten worden uitgevouwen. Met `true` worden alle blokken uitgevouwen; met `false` worden ze ingeklapt.

`AppConfig[:pui_expand_all] = false`

#### `AppConfig[:max_search_columns]`

Gebruik dit om het maximumaantal kolommen op te geven dat wordt weergegeven bij zoeken of bladeren.

`AppConfig[:max_search_columns] = 7`
