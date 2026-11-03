---
title: Plug-ins
description: Een overzicht van het ontwikkelen, structureren, inschakelen en configureren van plug-ins in ArchivesSpace om het gedrag, de interface, de huisstijl en de zoekfunctionaliteit van de applicatie aan te passen zonder de kerncode te wijzigen.
---

Plug-ins zijn een krachtige functie waarmee u de meeste aspecten van het gedrag
van de applicatie kunt wijzigen.

Met plug-ins kunt u ArchivesSpace aanpassen door functies te overschrijven of uit te breiden,
zonder de kerncodebase te wijzigen. Omdat plug-ins zelfstandige pakketten zijn, kunt u
aanpassingspakketten eenvoudig delen tussen ArchivesSpace-instanties.

De ArchivesSpace-distributie bevat de voorbeeldplug-in `hello_world`. Raadpleeg het [README-bestand](https://github.com/archivesspace/archivesspace/blob/master/plugins/hello_world/README.md) voor een gedetailleerde beschrijving van de opbouw en implementatie.

U vindt andere voorbeelden in de volgende repositories met plug-ins. De ArchivesSpace-plug-ins die officieel worden ondersteund en onderhouden door het ArchivesSpace Program Team staan in archivesspace-plugins (https://github.com/archivesspace-plugins). Verouderde code die niet meer wordt ondersteund maar ter referentie is bewaard, staat in archivesspace-deprecated (https://github.com/archivesspace-deprecated). Er is ook een open, niet-beheerde GitHub-repository waar communityleden hun code kunnen delen: archivesspace-labs (https://github.com/archivesspace-labs). De door de community ontwikkelde Python-bibliotheek voor interactie met de ArchivesSpace-API, ArchivesSnake, wordt beheerd in de repository archivesspace-labs.

## Plug-ins inschakelen

U schakelt plug-ins in door ze in de map `plugins` te plaatsen en ernaar te verwijzen in de
ArchivesSpace-configuratie, `config/config.rb`. Bijvoorbeeld:

```ruby
AppConfig[:plugins] = ['local', 'hello_world', 'my_plugin']
```

Deze configuratie gaat ervan uit dat de volgende mappen bestaan:

    plugins
      hello_world
      local
      my_plugin

De volgorde waarin de plug-ins in de configuratieoptie `:plugins` worden vermeld,
bepaalt de volgorde waarin de applicatie ze laadt.

## Structuur van plug-ins

De directorystructuur binnen een plug-in is vergelijkbaar met die van de kernapplicatie.
Hieronder ziet u de ondersteunde structuur van een plug-in. Bestanden in deze mappen kunnen
worden gebruikt om het gedrag van de kernapplicatie te overschrijven of uit te breiden.

    backend
      controllers ......... backend endpoints
      model ............... database mapping models
      converters .......... classes for importing data
      job_runners ......... classes for defining background jobs
      plugin_init.rb ...... if present, loaded when the backend first starts
      lib/bulk_import ..... bulk import processor
    frontend
      assets .............. static assets (such as images, javascript) in the staff interface
      controllers ......... controllers for the staff interface
      locales ............. locale translations for the staff interface
      views ............... templates for the staff interface
      plugin_init.rb ...... if present, loaded when the staff interface first starts
    public
      assets .............. static assets (such as images, javascript) in the public interface
      controllers ......... controllers for the public interface
      locales ............. locale translations for the public interface
      views ............... templates for the public interface
      plugin_init.rb ...... if present, loaded when the public interface first starts
    migrations ............ database migrations
    schemas ............... JSONModel schema definitions
    search_definitions.rb . Advanced search fields

**Let op:** `backend/lib/bulk_import` is de enige directory in `backend/lib/` die door de plug-inbeheerder wordt geladen. Andere bestanden in `backend/lib/` worden niet geladen tijdens het opstarten.

**Let op:** Om het gedrag van kernmodellen en controllers te overschrijven of uit te breiden, kunt u niet simpelweg uw vervanging met dezelfde naam in het overeenkomstige directorypad plaatsen. U kunt kernmodellen en controllers overschrijven door een `after_initialize`-blok toe te voegen aan `plugin_init.rb` (bijvoorbeeld [aspace-hvd-pui](https://github.com/harvard-library/aspace-hvd-pui/blob/master/public/plugin_init.rb#L43)).

## Gedrag overschrijven

Een algemene regel is: om gedrag te overschrijven in plaats van uit te breiden, gebruikt u het pad
naar het bestand met het gedrag dat u wilt overschrijven.

Een plug-in hoeft niet al deze mappen te bevatten. Om bijvoorbeeld een deel van een localebestand
voor de medewerkersinterface te overschrijven, kunt u deze structuur aan de lokale plug-in toevoegen:

    plugins/local/frontend/locales/en.yml

Meer informatie over het overschrijven van localebestanden vindt u in [Tekst aanpassen in ArchivesSpace](/customization/locales).

## De visuele (web)presentatie overschrijven

U kunt elk viewbestand in de kernapplicatie rechtstreeks overschrijven door op het overeenkomstige pad een erb-bestand met dezelfde naam te plaatsen.
Als u bijvoorbeeld het uiterlijk van de pagina "Welcome" [startpagina] in de publieke gebruikersinterface (PUI) wilt aanpassen, kunt u wijzigingen aanbrengen in een bestand `show.html.erb` en dat plaatsen in `plugins/my_fine_plugin/public/views/welcome/show.html.erb`. (Waar _my_fine_plugin_ de naam van uw plug-in is.)

### Een breed toegepaste stijl- of JavaScript-wijziging implementeren

Tenzij u inline stijl of JavaScript wilt schrijven (wat voor een of twee templates praktisch kan zijn), is de aanbevolen aanpak om `plugins/my_fine_plugin/public/views/layout_head.html.erb` of `plugins/my_fine_plugin/frontend/views/layout_head.html.erb` te maken. Dit bestand bevat HTML-instructies om uw JavaScript of CSS op te nemen in het element `<HEAD>` van de template. Hier volgt een voorbeeld:

- Voor de publieke interface wil ik de tekstgrootte wijzigen van alle links waar de gebruiker met de aanwijzer boven zweeft.
  - Ik maak `plugins/my_fine_plugin/public/assets/my.css`:
    ```css
    a:hover {
      font-size: 2em;
    }
    ```
  - Ik maak `plugins/my_fine_plugin/public/views/layout_head.html.erb` en voeg het volgende toe:
    ```ruby
    <%= stylesheet_link_tag "#{@base_url}/assets/my.css", media: :all %>
    ```
- Voor de publieke interface wil ik JavaScript-gedrag toevoegen waardoor er sterretjes verschijnen wanneer de gebruiker met de aanwijzer boven een lijstitem zweeft.
  - Ik maak `plugins/my_fine_plugin/public/assets/my.js`"
    ```javascript
    $(function () {
      $('li').hover(
        function () {
          $(this).append($('<span> ***</span>'))
        },
        function () {
          $(this).find('span:last').remove()
        }
      )
    })
    ```
  - Ik voeg het volgende toe aan `plugins/my_fine_plugin/public/views/layout_head.html.erb`:
    ```ruby
    <%= javascript_include_tag "#{@base_url}/assets/my.js" %>
    ```

## Uw eigen huisstijl toevoegen

U kunt bijvoorbeeld de huisstijl van de medewerkersinterface overschrijven door
uw eigen template op deze locatie toe te voegen:

    plugins/local/frontend/views/site/\_branding.html.erb

Bestanden zoals afbeeldingen, stylesheets en PDF's kunnen als statische bronnen beschikbaar worden gemaakt
door ze in een map `assets` onder een ingeschakelde plug-in te plaatsen. Bijvoorbeeld, het volgende bestand:

    plugins/local/frontend/assets/my_logo.png

is beschikbaar via de volgende URL:

    http://your.frontend.domain.and:port/assets/my_logo.png

Gebruik bijvoorbeeld in het bestand voor de aangepaste huisstijl markup zoals deze om naar het logo te verwijzen:

```erb
     <div class="container branding">
       <img src="<%= #{AppConfig[:frontend_proxy_prefix]} %>assets/my_logo.png" alt="My logo" />
     </div>
```

## Een favicon aanpassen

Een favicon is een pictogram dat bij een webpagina hoort en door browsers en besturingssystemen wordt weergegeven (bijvoorbeeld in de adresbalk of het tabblad van een browser, naast de webpaginanaam in een bladwijzerlijst enzovoort).

### Standaardafbeeldingen

De ArchivesSpace-favicons zijn opgeslagen in de map `public/` op het hoogste niveau van de frontend- en publieke applicaties.

1. `frontend/public/favicon-AS.png`
2. `frontend/public/favicon-AS.svg`
3. `public/public/favicon-AS.png`
4. `public/public/favicon-AS.svg`

### Markup

De favicon-markup staat in de partial-template voor favicons van elke applicatie:

1. `frontend/app/views/site/\_favicon.html.erb`
2. `public/app/views/shared/\_favicon.html.erb`

### Configuratie

Favicons worden standaard weergegeven via de configuratieopties in `config.rb` (of `common/config/config-defaults.rb` tijdens ontwikkeling). Stel de betreffende optie in op `false` om geen favicon weer te geven.

```rb
# config.rb
AppConfig[:pui_show_favicon] = true # whether or not to show a favicon
AppConfig[:frontend_show_favicon] = true # whether or not to show a favicon
```

### Voorbeelden van plug-ins

Vervang de standaardfavicon door uw eigen favicon via een plug-in.

:::caution[Bestandsnamen voor favicons die zijn gereserveerd]
Bestanden met aangepaste favicons moeten een andere naam hebben dan `favicon-AS.png` en `favicon-AS.svg` om de standaardfavicon te overschrijven.
:::

#### Frontend

De frontend-plug-in moet de volgende directorystructuur hebben:

```
plugins/local/frontend/
├── assets
│   ├── favicon.png
│   └── favicon.svg
└── views
    └── site
        └── _favicon.html.erb
```

De favicon-template voor de frontend ziet er ongeveer zo uit:

```erb
<!-- plugins/local/frontend/views/site/_favicon.html.erb -->
<link rel="icon" type="image/png" href="<%= AppConfig[:frontend_proxy_prefix] %>assets/favicon.png">
<link rel="icon" type="text/svg+xml" href="<%= AppConfig[:frontend_proxy_prefix] %>assets/favicon.svg">
```

#### Publieke applicatie

De plug-in voor de publieke applicatie moet de volgende directorystructuur hebben:

```
plugins/local/public/
├── assets
│   ├── favicon.png
│   └── favicon.svg
└── views
    └── shared
        └── _favicon.html.erb
```

De favicon-template voor de publieke applicatie ziet er ongeveer zo uit:

```erb
<!-- plugins/local/public/views/shared/_favicon.html.erb -->
<link rel="icon" type="image/png" href="<%= asset_path('favicon.png', skip_pipeline: true) %>">
<link rel="icon" type="image/svg+xml" href="<%= asset_path('favicon.svg', skip_pipeline: true) %>">
```

## Plug-inconfiguratie

Plug-ins kunnen optioneel een configuratiebestand bevatten op `plugins/[plugin-name]/config.yml`.
Dit configuratiebestand ondersteunt de volgende opties:

    system_menu_controller
      The name of a controller that will be accessible via a Plugins menu in the System toolbar
    repository_menu_controller
      The name of a controller that will be accessible via a Plugins menu in the Repository toolbar
    parents
      [record-type]
        name
        cardinality
      ...

`system_menu_controller` en `repository_menu_controller` geven de namen op van frontend-controllers
die respectievelijk toegankelijk zijn via de werkbalk Systeem en de werkbalk voor de collectiebeherende instelling. Als ingeschakelde plug-ins
een van deze configuratieopties hebben opgegeven, verschijnt er een vervolgkeuzemenu `Plugins` in de werkbalken. De
controllernaam volgt de gebruikelijke naamgevingsconventies, bijvoorbeeld:

```ruby
repository_menu_controller: hello_world
```

Dit verwijst naar een controllerbestand op `plugins/hello_world/frontend/controllers/hello_world_controller.rb`
waarin een controllerklasse met de naam `HelloWorldController` is geïmplementeerd. Wanneer de gebruiker het menu-item selecteert,
wordt de actie `index` op de controller aangeroepen.

De URL's voor plug-incontrollers vallen onder `plugins`. De URL voor het bovenstaande
voorbeeld is daarom:

    http://your.frontend.domain.and:port/plugins/hello_world

De vertaling van de naam van de plug-in in het vervolgkeuzemenu `Plugins` wordt ook opgegeven in een localebestand in de directory `frontend/locales` van de plug-in. In het voorbeeld `hello_world` staat bijvoorbeeld een Engels localebestand op:

    plugins/hello_world/frontend/locales/en.yml

De vertaling van de naam van de plug-in in de vervolgkeuzemenu's `Plugins` wordt opgegeven met de sleutel `label` onder de plug-in, zoals hier:

```yaml
en:
  plugins:
    hello_world:
      label: Hello World
```

Het voorbeeld-localebestand bevat ook andere sleutels voor vertalingen van tekst die deel uitmaakt van de gebruikersinterface van de plug-in. Plaats de vertalingen van uw plug-in op de aangegeven manier onder `plugins.[your_plugin_name]` om te voorkomen dat u per ongeluk vertalingen van andere interface-elementen overschrijft. In het bovenstaande voorbeeld kan de vertaling voor de sleutel `label` rechtstreeks vanuit een erb-viewbestand worden opgevraagd:

```ruby
<%= I18n.t("plugins.hello_world.label") %>
```

Elke vermelding onder `parents` specificeert een recordtype waarvoor deze plug-in een nieuw subrecord aanbiedt.
`[record-type]` is de naam van het bestaande recordtype, bijvoorbeeld `accession`. `name` is de
naam van de plug-in in de rol van subrecord van deze ouder, bijvoorbeeld `hello_worlds`.
`cardinality` specificeert de cardinaliteit van de plug-inrecords. De momenteel ondersteunde waarden zijn
`zero-to-many` en `zero-to-one`.

## Zoekgedrag wijzigen

Een plug-in kan extra velden aan de interface voor geavanceerd zoeken toevoegen door
een bestand `search_definitions.rb` op het hoogste niveau van de
plug-indirectory op te nemen. Dit bestand kan definities bevatten zoals:

```ruby
AdvancedSearch.define_field(:name => 'payment_fund_code', :type => :enum, :visibility => [:staff], :solr_field => 'payment_fund_code_u_utext')
AdvancedSearch.define_field(:name => 'payment_authorizers', :type => :text, :visibility => [:staff], :solr_field => 'payment_authorizers_u_utext')
```

Elk gedefinieerd veld verschijnt als doorzoekbaar veld in de interface voor geavanceerd zoeken.
De optie `:visibility` bepaalt of het veld wordt weergegeven in de medewerkersinterface of de publieke interface (of allebei), terwijl
de parameter `:type` bepaalt welk soort zoekopdracht wordt uitgevoerd.
Geldige waarden zijn `:text:`, `:boolean`, `:date` en `:enum`. Tot slot
bepaalt de parameter `:solr_field` welk veld uit de onderliggende index wordt gebruikt.

## Aangepaste rapporten toevoegen

U kunt aangepaste rapporten aan plug-ins toevoegen door een nieuw rapportmodel als subklasse van `AbstractReport` toe te voegen aan `plugins/[plugin-name]/backend/model/` en de vertalingen voor dat model aan `plugins/[plugin-name]/frontend/locales/[language].yml`. Raadpleeg bestaande rapporten in de subdirectory reports van de hoofdmap van ArchivesSpace voor voorbeelden van de structuur van een rapportmodel.

Er zijn verschillende beperkingen voor het toevoegen van rapporten aan plug-ins. Zo kunnen rapporten uit plug-ins alleen de generieke rapportsjabloon gebruiken. ArchivesSpace zoekt alleen naar rapportsjablonen in de subdirectory reports van de hoofdmap van ArchivesSpace, niet in plug-indirectories. Als u een aangepast rapport met een eigen sjabloon wilt implementeren, kunt u overwegen het rapport toe te voegen aan `archivesspace/reports/` in plaats van `archivesspace/plugins/[plugin-name]/backend/model/`.

## Specifieke hooks voor de frontend

Om via uw plug-in eenvoudiger nieuwe recordvelden en -secties aan recordformulieren toe te voegen, biedt de ArchivesSpace-frontend een reeks hooks via de module `frontend/config/initializers/plugin.rb`. Dit zijn:

- `Plugins.add_search_base_facets(*facets)` - voegt extra facetten toe aan de basislijst met facetten voor alle recordzoekopdrachten en lijstpagina's.

- `Plugins.add_search_facets(jsonmodel_type, *facets)` - voegt facetten toe voor een bepaald JSONModel-type, zodat ze worden opgenomen in zoekopdrachten en lijstpagina's voor dat recordtype.

- `Plugins.add_resolve_field(field_name)` - gebruik dit wanneer u een nieuw veld of een nieuwe relatie hebt toegevoegd en wilt dat deze wordt opgelost wanneer het record uit de API wordt opgehaald.

- `Plugins.register_edit_role_for_type(jsonmodel_type, role)` - registreert een nieuw JSONModel op het hoogste niveau en de bijbehorende bewerkingsrol, zodat de lijstweergave kan bepalen of de gebruiker de knop "Edit" kan zien.

- `Plugins.register_note_types_handler(proc)` waarbij proc de parameters `jsonmodel_type, note_types, context` verwerkt - hiermee kan een plug-in de notitietypen aanpassen die voor een bepaald JSONModel-type worden weergegeven. U kunt bijvoorbeeld de notitietypen filteren die niet van toepassing zijn op uw instelling.

- `Plugins.register_plugin_section(section)` - hiermee kunt u een template definiëren die als sectie wordt ingevoegd in een bepaald JSONModel-record. Een sectie is van het type `Plugins::AbstractPluginSection` en definieert de bronplug-in `plugin`, de sectienaam `name`, de `jsonmodel_types` waarvoor de sectie moet worden weergegeven en eventuele `opts` die de templates nodig hebben tijdens het weergeven. Deze nieuwe secties (toevoegingen voor alleen-lezen, bewerken en de zijbalk) worden weergegeven via de render-methoden van `PluginHelper`.

  U kunt `Plugins::AbstractPluginSection` subclassen om willekeurige HTML flexibel op te nemen. ArchivesSpace bevat twee voorbeelden:
  - `Plugins::PluginSubRecord` - gebruikt de partial `shared/subrecord` om een standaard opgemaakte ArchivesSpace-sectie weer te geven. Voor `opts` moet het JSONModel-veld zijn gedefinieerd.

  - `Plugins::PluginReadonlySearch` - gebruikt de partial `search/embedded` om een zoekresultatenlijst als sectie weer te geven. Voor `opts` moeten de aangepaste filtertermen voor deze zoekopdracht zijn gedefinieerd.

## Meer informatie

**Test uw plug-in grondig, want deze kan onvoorziene gevolgen hebben voor uw
ArchivesSpace-applicatie.**
