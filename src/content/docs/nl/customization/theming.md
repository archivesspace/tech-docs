---
title: Thema's aanpassen
description: Een handleiding voor het aanpassen van het uiterlijk van ArchivesSpace met plug-ins of een volledige herbouw van het thema, inclusief instructies voor het wijzigen van logo's, CSS en lay-outelementen in zowel de publieke als de medewerkersinterface.
---

## Kleine aanpassingen

Voor kleine wijzigingen aan het thema van uw site kunt u het best een plug-in gebruiken. Met een plug-in kunnen we standaardweergaven, controllers, modellen enzovoort overschrijven zonder de broncode volledig opnieuw op te bouwen. Verwijder het `#` aan het begin van elke regel die u wilt aanpassen. Regels die met een `#` beginnen, worden genegeerd.

Stel dat we het logo voor de publieke gebruikersinterface willen wijzigen. Dat kan eenvoudig in uw `config.rb`-bestand:

```ruby
AppConfig[:pui_branding_img]
```

Deze instelling wordt gebruikt door het bestand `public/app/views/shared/_header.html.erb` om het logo voor de PUI weer te geven. U hoeft dat bestand niet aan te passen; alleen de instelling in uw `config.rb`-bestand.

U kunt de afbeelding opslaan in `plugins/local/public/assets/images/logo.png`. Waarschijnlijk moet u een of meer mappen aanmaken.

De instelling `AppConfig[:pui_branding_img]` ziet er ongeveer zo uit:

```ruby
AppConfig[:pui_branding_img] = '/assets/images/logo.png'
```

U kunt en moet ook alternatieve tekst voor de PUI-logoafbeelding opgeven via:

```ruby
AppConfig[:pui_branding_img_alt_text] = 'My alt text'
```

Verwijder het `#` aan het begin van elke regel die u wilt aanpassen. Regels die met een `#` beginnen, worden genegeerd.

Als u wilt dat de afbeelding in de PUI naar een andere locatie linkt, moet u het bestand `public/app/views/shared/_header.html.erb` aanpassen. Aan de regel die het logo aanmaakt, hoeft alleen een `a href` te worden toegevoegd. U moet ook `AppConfig[:pui_branding_img_alt_text]` aanpassen, zodat duidelijk is dat de afbeelding ook als link werkt (bijvoorbeeld `AppConfig[:pui_branding_img_alt_text] = 'Back to Example College Home'`). Het resultaat ziet er ongeveer zo uit:

```erb
<div class="col-sm-3 hidden-xs"><a href="https://example.com"><img class="logo" src="<%= asset_path(AppConfig[:pui_branding_img]) %>" alt="<%= AppConfig[:pui_branding_img_alt_text] %>" /></a></div>
```

Voor het logo van de medewerkersinterface is een klein plug-inbestand nodig; dit kan niet worden ingesteld in uw `config.rb`-bestand. U moet dit wijzigen in het bestand `plugins/local/frontend/views/site/_branding.html.erb`. Waarschijnlijk moet u een of meer mappen aanmaken. Maak vervolgens het bestand `_branding.html.erb` aan en plak de volgende code erin:

```erb
<div class="container-fluid navbar-branding">
  <%= image_tag "archivesspace/archivesspace.small.png", :class=>"img-responsive", :alt=>"My image alt text" %>
</div>
```

Wijzig `"archivesspace/archivesspace.small.png"` in het pad naar uw afbeelding `/assets/images/logo.png` en plaats uw logo in de map `plugins/local/frontend/assets/images/`. Waarschijnlijk moet u een of meer mappen aanmaken.

**Opmerking:** Omdat bestanden die we aan de plug-inmap toevoegen niet worden voorgecompileerd door de assetpipeline van Rails, kunnen we sommige taghelpers (zoals img_tag ) niet gebruiken: die gaan ervan uit dat de asset door de assetpipeline wordt beheerd.

Start de applicatie opnieuw; daarna zou uw logo in de standaardweergave zichtbaar moeten zijn.

## CSS-regels toevoegen

U kunt CSS ook aanpassen via het plug-insysteem. Als u geen volledig nieuwe plug-in wilt maken, kunt u het eenvoudigst de plug-in 'local' aanpassen die met ArchivesSpace wordt meegeleverd (deze is bedoeld voor dit soort sitespecifieke wijzigingen). Zolang 'local' nog in de lijst AppConfig[:plugins] staat, worden uw wijzigingen toegepast.

Maak daarvoor het bestand
`archivesspace/plugins/local/frontend/views/layout_head.html.erb` voor de medewerkersinterface of `archivesspace/plugins/local/public/views/layout_head.html.erb` voor de publieke interface aan. Voeg vervolgens de regel toe waarmee de CSS op de site wordt ingeladen:

```erb
<%= stylesheet_link_tag "#{@base_url}/assets/custom.css" %>
```

Plaats uw CSS vervolgens in het bestand:

     staff side:
     archivesspace/plugins/local/frontend/assets/custom.css
     or public side:
     archivesspace/plugins/local/public/assets/custom.css

De CSS wordt dan op elke pagina geladen.

U kunt ook wijzigingen willen aanbrengen aan de hoofdpagina, de koptekst of de voettekst. Voor de publieke interface van uw site plaatst u die overschrijvingen op de volgende locaties:

    archivesspace/plugins/local/public/views/welcome/show.html.erb
    archivesspace/plugins/local/public/views/shared/_header.html.erb
    archivesspace/plugins/local/public/views/shared/_footer.html.erb

## Ingrijpende wijzigingen aan het thema

Als u het uiterlijk van uw site ingrijpend wilt aanpassen, kunt u dat met een plug-in doen, met de hierboven beschreven overschrijvingsmethoden. Dit heeft echter enkele belangrijke nadelen. Ten eerste worden assets niet gecompileerd door de assetpipeline van Rails. Bovendien kunt u geen gebruikmaken van de variabelen en mixins die Bootstrap en Less als framework bieden; die helpen uw assets overzichtelijk te houden.

Een betere aanpak is een kopie van de ArchivesSpace-code op te halen en een nieuw thema op te bouwen. [Deze video](https://www.youtube.com/watch?v=Uny736mZVnk) is een goede informatiebron hiervoor. Deze video behandelt de gebruikersinterface van de medewerkersapplicatie, maar u kunt dezelfde stappen toepassen op de publieke interface.

Maak uzelf ook enigszins vertrouwd met de [instructies voor het buildsysteem ](/development/dev)

Haal eerst met git een nieuwe kopie van ArchivesSpace op en zorg ervoor dat u een tag uitcheckt die overeenkomt met de versie die u gebruikt of wilt gebruiken.

```shell
$ git clone https://github.com/archivesspace/archivesspace.git
$ git checkout v2.5.2
```

U kunt de ontwikkelserver van de applicatie starten met:

```shell
$ ./build/run bootstrap
$ ./build/run backend:devserver
$ ./build/run frontend:devserver
$ ./build/run public:devserver
```

**Opmerking:** U hoeft deze opdrachten niet steeds allemaal uit te voeren. De opdracht bootstrap hoeft alleen de eerste keer te worden uitgevoerd nadat u de code hebt opgehaald; dit kan ook even duren. U hoeft frontend of public niet te starten als u niet aan die interfaces werkt. Backend moet wel worden gestart om de publieke interface of de frontend te laten werken. )

Volg de instructies in de video om een nieuw thema te maken. U kunt het bestaande standaardthema het best naar een nieuwe map kopiëren en daar uw wijzigingen aanbrengen. Maak gebruik van de bestaande variabelen in de Less-bestanden om uw assets overzichtelijk te organiseren.

Wanneer u uw thema hebt bijgewerkt en het naar behoren werkt, kunt u uw applicatie verpakken. U kunt ./scripts/build_release gebruiken om een volledig nieuwe AS-distributie te bouwen, maar dat is niet nodig als u alleen kleine wijzigingen aan de gebruikersinterface hebt aangebracht. Gebruik in plaats daarvan "./build/run public:war " om uw assets te compileren en een WAR-bestand te verpakken. U kunt dit bestand public.war vervolgens gebruiken om het WAR-bestand in uw ASpace-distributie te vervangen.

Werk de thema-instelling in het bestand config.rb bij en start ASpace opnieuw.
