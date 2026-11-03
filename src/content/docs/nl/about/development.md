---
title: Ontwikkeling
description: Op deze pagina wordt beschreven hoe je de tech-docs-repository instelt, de website bouwt, afhankelijkheden bijwerkt en tests uitvoert.
# This is the last page in the sidebar, so point to Home next instead of
# the Help Center which comes after this page in the sidebar
next:
  link: /
  label: Startpagina
---

Tech Docs is een [Node.js](https://nodejs.org)-applicatie, gebouwd met [Astro](https://astro.build/) en het documentatiesiteframework [Starlight](https://starlight.astro.build/). De broncode wordt gehost op [GitHub](https://github.com/archivesspace/tech-docs). De site wordt statisch gebouwd en (tijdelijk) gehost via [Cloudflare Pages](https://pages.cloudflare.com/). De content wordt geschreven in [Markdown](/about/authoring#markdown). Wanneer de broncode verandert, wordt korte tijd later een nieuwe set statische bestanden gegenereerd en gepubliceerd.

## Afhankelijkheden

Tech Docs is afhankelijk van de volgende opensourcesoftware (zie `.nvmrc` en `package.json` voor de versies):

1. [Node.js](https://nodejs.org) - JavaScript-ontwikkel- en bouwomgeving; de versie die in `.nvmrc` staat, is de standaardversie van Node.js in de build-image van Cloudflare Pages
2. [Astro](https://astro.build/) - generator voor statische sites die conceptueel is gebaseerd op 'componenten' (React, Vue, Svelte enzovoort) in plaats van 'sjablonen' (Jekyll, Handlebars, Pug enzovoort)
   1. [Starlight](https://starlight.astro.build/) - Astro-plug-in en thema voor documentatiewebsites
   2. [Sharp](https://sharp.pixelplumbing.com/) - bibliotheek voor beeldtransformatie die door Astro wordt gebruikt
3. [Cypress](https://www.cypress.io/) - framework voor end-to-endtests
4. [Stylelint](https://stylelint.io/) - CSS-linter die lokaal in teksteditors en op afstand in [CI](#cicd) wordt gebruikt om tests uit te voeren
   1. [stylelint-config-recommended](https://github.com/stylelint/stylelint-config-recommended) - basisset lintregels
   2. [postcss-html](https://github.com/ota-meshi/postcss-html) - PostCSS-syntaxis voor het parseren van HTML (en HTML-achtige bestanden, waaronder `.astro`-bestanden)
   3. [stylelint-config-html](https://github.com/ota-meshi/stylelint-config-html) - maakt het mogelijk voor Stylelint om `.astro`-bestanden te parseren
5. [Prettier](https://prettier.io/) - formatter voor broncode die lokaal in teksteditors en op afstand in [CI](#cicd) wordt gebruikt om tests uit te voeren
   1. [prettier-plugin-astro](https://github.com/withastro/prettier-plugin-astro) - maakt het mogelijk voor Prettier om `.astro`-bestanden via de opdrachtregel te parseren

## Lokaal ontwikkelen

Voer Tech Docs lokaal uit door de Tech Docs-repository te klonen, de projectafhankelijkheden te installeren en een ontwikkelserver te starten:

```sh
# Requires git and Node.js

# Clone Tech Docs and move to it
git clone https://github.com/archivesspace/tech-docs.git
cd tech-docs

# Install dependencies
npm install

# Run dev server
npm start
```

Ga nu naar [localhost:4321](http://localhost:4321) om Tech Docs lokaal in de browser te bekijken. Wijzigingen in de broncode worden direct in de browser weergegeven.

### De site bouwen

Bij het bouwen van de site wordt een set statische bestanden aangemaakt. Na de build staan deze bestanden in `dist`; ze kunnen lokaal worden aangeboden of op een server worden geïmplementeerd. Soms komen bij het bouwen van de site fouten aan het licht die niet in de ontwikkelomgeving optreden.

```sh
# Build the site and output it to dist/
npm run build
```

:::tip
Serveer de gebouwde uitvoer na een build door `npm run preview` uit te voeren.
:::

### Beschikbare `npm`-scripts

De volgende scripts zijn beschikbaar via `package.json`. Voer een script vanaf de hoofdmap van het project uit op de opdrachtregel door er het commando `npm run` voor te zetten, bijvoorbeeld `npm run start`.

- `start` -- voer de Astro-ontwikkelserver uit
- `build` -- bouw Tech Docs voor productie
- `preview` -- serveer de statische build
- `astro` -- geef Astro-help weer
- `test:dev` -- voer tests uit in de ontwikkelmodus
- `test:prod` -- voer tests uit in de productiemodus
- `test` -- voert standaard tests uit in de productiemodus
- `prettier:check` -- controleer de opmaak met Prettier
- `prettier:fix` -- herstel mogelijke opmaakfouten
- `stylelint:check` -- voer Stylelint uit op CSS
- `stylelint:fix` -- herstel mogelijke CSS-fouten

## Documentatiepagina's

Documentatiepagina's worden geïmplementeerd met de contentcollectie `docs` van Starlight. De bronbestanden staan in `src/content/docs/`; Starlight genereert de bijbehorende routes als onderdeel van de normale statische Astro-build (er is geen afzonderlijke documentatiebuildstap). De hiërarchie van de zijbalk wordt ingesteld in `src/siteNavigation.json`. Zie [YAML-frontmatter](/about/authoring#yaml-frontmatter) voor kopieerbare sjablonen en beknopte aanwijzingen voor auteurs over velden.

### Documentatiepagina's toevoegen

Een nieuwe documentatiepagina toevoegen:

1. Maak een Markdown-bestand in de toepasselijke documentatiesectiemap onder `src/content/docs/`.
2. Voeg die pagina toe aan `src/siteNavigation.json` in de juiste sectie en op de juiste plek, zodat deze in de gewenste volgorde in de zijbalk verschijnt.
3. Als de nieuwe pagina de eerste pagina in de sectie wordt, werk dan de bijbehorende hero-link op de homepage bij in `src/components/HomePage.astro`, zodat de sectielink naar de nieuwe eerste pagina verwijst.

### Verouderde `index.md`-pagina's

Sommige sectiemappen bevatten nog verouderde `index.md`-pagina's van de oude Tech Docs-site. Deze pagina's kunnen nog steeds routes krijgen (bijvoorbeeld `/architecture` en `/architecture/index`), maar ze worden niet opgenomen in de zijbalk omdat ze niet in `src/siteNavigation.json` staan.

### Documentatiecontentcollectie en -schema

In `src/content.config.ts` gebruikt de collectie `docs` `docsLoader()` en het [frontmatter-schema van Starlight](https://starlight.astro.build/reference/frontmatter/) via `docsSchema()`, uitgebreid met `issueUrl` en `issueText`. Frontmatter wordt tijdens het bouwen gevalideerd. Starlight vereist een `title`; andere sleutels zijn optioneel, tenzij de pagina een specifieke behoefte heeft.

| Veld              | Vereist | Doel                                                                                                                                                                                                                                                                             |
| ----------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`           | Ja      | Paginatitel in de lay-out, het browsertabblad en de metadata.                                                                                                                                                                                                                    |
| `description`     | Nee     | Korte samenvatting voor SEO, zoekresultaten en previews op sociale media. De meeste pagina's hebben dit veld; op enkele pagina's ontbreekt het (bijvoorbeeld [medewerkersinterface](/architecture/frontend), [404](/404)).                                                       |
| `slug`            | Nee     | Vervangt het URL-segment dat anders uit het bestandspad zou worden afgeleid.                                                                                                                                                                                                     |
| `editUrl`         | Nee     | Overschrijft de URL voor 'Pagina bewerken', of `false` om de link te verbergen (bijvoorbeeld op [404](/404)).                                                                                                                                                                    |
| `head`            | Nee     | Extra tags voor de documenthead (meta, link, aangepaste titel enzovoort).                                                                                                                                                                                                        |
| `tableOfContents` | Nee     | Inhoudsopgave: `false` om deze te verbergen, of `{ minHeadingLevel, maxHeadingLevel }` om het bereik in te stellen.                                                                                                                                                              |
| `template`        | Nee     | Lay-outsjabloon van Starlight (bijvoorbeeld `splash`).                                                                                                                                                                                                                           |
| `hero`            | Nee     | Hero-gebied voor pagina's in splash-stijl (`title`, `tagline`, optioneel `image`, `actions` enzovoort).                                                                                                                                                                          |
| `banner`          | Nee     | Optionele banner boven de pagina-inhoud.                                                                                                                                                                                                                                         |
| `lastUpdated`     | Nee     | Overschrijft de weergegeven datum van de laatste wijziging, of `false` om deze te verbergen.                                                                                                                                                                                     |
| `prev`            | Nee     | Paginering naar de vorige pagina: `false`, een label als tekenreeks of `{ link, label }`.                                                                                                                                                                                        |
| `next`            | Nee     | Paginering naar de volgende pagina: `false`, een label als tekenreeks of `{ link, label }`. Zo stelt [Ontwikkeling](/about/development) dit zo in dat 'Volgende' naar Startpagina gaat in plaats van naar de externe Help Center-vermelding die erna in de zijbalk staat.        |
| `pagefind`        | Nee     | Stel in op `false` om de pagina niet op te nemen in de Pagefind-index.                                                                                                                                                                                                           |
| `draft`           | Nee     | Wanneer dit `true` is, wordt de pagina uitgesloten van productiebuilds.                                                                                                                                                                                                          |
| `sidebar`         | Nee     | Label, volgorde, badge, `hidden` of link-`attrs` voor de pagina. De hoofdstructuur van de zijbalk wordt ingesteld in `src/siteNavigation.json`.                                                                                                                                  |
| `issueUrl`        | Nee     | URL voor de voettekstlink 'Een probleem melden', of `false` om de link te verbergen. Als dit veld ontbreekt, wordt de standaardwaarde uit `src/content.config.ts` gebruikt; auteurs kunnen deze expliciet instellen (zie [YAML-frontmatter](/about/authoring#yaml-frontmatter)). |
| `issueText`       | Nee     | Labeltekst voor die voettekstlink. Als dit veld ontbreekt, wordt de standaardwaarde uit `src/content.config.ts` gebruikt; auteurs kunnen deze expliciet instellen (zie [YAML-frontmatter](/about/authoring#yaml-frontmatter)).                                                   |

### Documentatieroutes

- URL's worden afgeleid van bestandspaden in `src/content/docs/`, tenzij `slug` is ingesteld in frontmatter.
- Paginering naar vorige/volgende pagina's wordt afgeleid van de volgorde in de zijbalk, tenzij `prev`/`next` in frontmatter is overschreven.

### UI-componenten voor documentatie

| Onderdeel                                                              | Locatie                                                                                                              |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Hiërarchie en groepering van de zijbalk                                | `src/siteNavigation.json`                                                                                            |
| Standaardweergave van de paginatitel van documentatie                  | `src/components/CustomPageTitle.astro` (valt voor niet-blogroutes terug op Starlights standaard `PageTitle`)         |
| Metagegevens/navigatie in de voettekst (bewerklink, probleemlink enz.) | `src/components/overrides/Footer.astro`, `src/components/overrides/EditLink.astro`, `src/components/IssueLink.astro` |

### Tests voor documentatie

Gedrag van documentatiepagina's wordt met Cypress getest, voornamelijk in `cypress/e2e/content-pages.cy.js` (zijbalk, inhoudsopgave, voettekstmetagegevenslinks en paginering).

## Blog

De [blog](/blog) is geïmplementeerd als een Astro-contentcollectie naast de documentatiecollectie. Bronbestanden van berichten staan in `src/content/blog/`; de routes staan in `src/pages/blog/`. Er is geen afzonderlijke blogbuildstap: blogpagina's maken deel uit van de normale statische Astro-uitvoer, en de zoekfunctie van de site ([Zoeken](#search)) indexeert ze net als andere HTML. Zie [Content schrijven](/about/authoring#where-pages-go) en [YAML-frontmatter](/about/authoring#yaml-frontmatter) voor informatie over waar bestanden moeten staan en voor voorbeelden van frontmatter.

### Blogberichten toevoegen

Maak een nieuw Markdown-bestand in `src/content/blog/` met de verplichte frontmattervelden (`title`, `metaDescription`, `pubDate` en `authors`) om een blogbericht toe te voegen.

Optionele velden (`teaser` en `updatedDate`) kunnen indien nodig ook worden toegevoegd. Voor blogberichten zijn geen wijzigingen in `src/siteNavigation.json` vereist; geldige bestanden in de collectie worden automatisch opgenomen wanneer de site wordt gebouwd.

### Blogcontentcollectie en -schema

De collectie `blog` is geregistreerd in `src/content.config.ts` met een Zod-schema. Frontmatter wordt tijdens het bouwen gevalideerd. Als je frontmattervelden toevoegt of hernoemt, moet je dat schema bijwerken, evenals alle onderdelen die `entry.data` gebruiken (blogpagina's, middleware en tests).

| Veld              | Vereist | Doel                                                                                                                                                                                                             |
| ----------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`           | Ja      | Kop van het bericht op de berichtpagina en de indexkaart. Mag HTML bevatten voor de weergave; de document-`<title>` en labels voor vorige/volgende paginering **verwijderen HTML** uit `title`.                  |
| `metaDescription` | Ja      | Korte samenvatting voor de paginametabeschrijving (SEO). Wordt gebruikt als teasertekst in de index wanneer `teaser` ontbreekt.                                                                                  |
| `teaser`          | Nee     | HTML of platte tekst voor de indexkaart van de blog (`set:html`). Gebruik dit bij voorkeur voor links of beperkte HTML in de index; platte tekst in `title` is het veiligst voor tabtitels en pagineringslabels. |
| `pubDate`         | Ja      | Publicatiedatum; berichten worden op dit veld gesorteerd, met de nieuwste bovenaan. Wordt uit frontmatter geparseerd en op de index en in de berichtkop weergegeven in **UTC**.                                  |
| `authors`         | Ja      | Lijst met weergegeven auteursnamen; op de index en de berichtpagina weergegeven, gescheiden door komma's.                                                                                                        |
| `updatedDate`     | Nee     | Optionele herzieningsdatum (`YYYY-MM-DD`). Wordt in frontmatter opgeslagen, maar **wordt momenteel niet in de UI weergegeven**; kan later worden gebruikt voor weergave of consistentie met de auteursjabloon.   |

### Blogroutes

- `src/pages/blog/index.astro` — `/blog`-index; laadt berichten, sorteert ze aflopend op `pubDate` en geeft gegevens door aan de index-UI.
- `src/pages/blog/[id].astro` — afzonderlijke berichten; `getStaticPaths` wordt gegenereerd op basis van de collectie, zodat nieuwe geldige berichten bij de volgende build verschijnen.

### Middleware voor blogroutes

`src/blogRouteData.js` is Starlight-route-middleware voor blogroutes. Het voegt `pubDate`, `authors` en `postTitle` toe voor berichtpagina's en stelt paginering naar vorige/volgende pagina's in (een ouder bericht als 'Vorige', een nieuwer bericht als 'Volgende'). Uit pagineringslabels is HTML uit titels verwijderd.

### UI-componenten voor de blog

| Onderdeel                           | Locatie                                                                       |
| ----------------------------------- | ----------------------------------------------------------------------------- |
| Indexlijst en kaarten               | `src/components/BlogIndex.astro`                                              |
| Paginatitel van de index            | `src/components/BlogIndexTitleHeader.astro`                                   |
| Titel, datum, auteurs en teruglink  | `src/components/BlogPostTitleHeader.astro`, `src/components/BackToBlog.astro` |
| Standaardtitel versus blogtitel     | `src/components/CustomPageTitle.astro`                                        |
| Link 'Blog' in de kop               | `src/components/overrides/Header.astro`                                       |
| Bloglay-out / gedrag van de zijbalk | `src/components/overrides/PageFrame.astro`                                    |

### Blogtests

End-to-enddekking staat in `cypress/e2e/blog.cy.js`. Werk deze tests bij wanneer je de blogmarkup, URL's of zichtbare werking wijzigt.

## Zoeken

Zoeken op de site is een [functie van Starlight](https://starlight.astro.build/guides/site-search/):

> Starlight-sites bevatten standaard zoeken in de volledige tekst, mogelijk gemaakt door [Pagefind](https://pagefind.app/), een snelle zoektool met een laag bandbreedtegebruik voor statische sites.
>
> Er is geen configuratie nodig om zoeken in te schakelen. Bouw en implementeer je site en gebruik daarna de zoekbalk in de sitekop om content te vinden.

:::note
Zoeken werkt alleen in productiebuilds, niet op de ontwikkelserver.
:::

## Thema aanpassen

Starlight kan op verschillende manieren worden aangepast, waaronder:

- [Instellingen](https://starlight.astro.build/guides/customization/) -- zie `astro.config.mjs`
- [CSS](https://starlight.astro.build/guides/css-and-tailwind/) -- zie `src/styles/custom.css`
- [Componenten](https://starlight.astro.build/guides/overriding-components/) -- zie `src/components`

## Statische bestanden

### Afbeeldingen

De meeste afbeeldingsbestanden horen in `src/images` te staan. Hierdoor kunnen ze door Astro worden [verwerkt](https://docs.astro.build/en/guides/images/), met onder meer prestatieoptimalisaties.

Afbeeldingen die niet door Astro moeten worden verwerkt, zoals favicons, horen in `public` te staan.

:::note[Gebruik `src/images` voor alle afbeeldingen in de content]
Plaats alle afbeeldingen die in Tech Docs-content worden gebruikt in `src/images`.
:::

### De map `public`

Bestanden in `public` worden niet door Astro verwerkt. Ze worden rechtstreeks naar de uitvoer gekopieerd en zijn beschikbaar vanaf de hoofdmap van de site. Zo is `public/favicon.svg` beschikbaar op `docs.archivesspace.org/favicon.svg` en is `public/example/slides.pdf` beschikbaar op `docs.archivesspace.org/example/slides.pdf`.

## Mermaid-diagrammen

Tech Docs ondersteunt Mermaid-diagrammen in zowel documentatie- als blogcontent (zie [Content schrijven](/about/authoring#diagrams) voor de syntaxis). Mermaid is een tool die tekst omzet in diagrammen: auteurs schrijven diagramdefinities in een code fence en Mermaid zet die tekst in de browser om in SVG-diagrammen. Dit verschilt van gewone codeblokken, die Starlight met [Expressive Code](https://expressive-code.com/) weergeeft als statische codefragmenten met syntaxisaccentuering.

### Implementatie

1. De runtime-logica staat in `src/lib/mermaid.ts`.
2. De runtime wordt geladen door de Starlight-override voor het paginaraamwerk in `src/components/overrides/PageFrame.astro`.
3. Mermaid-fences worden tijdens runtime nabewerkt en als SVG-diagrammen weergegeven.

### Gedrag van thema's

- Het Mermaid-thema wordt afgeleid van het sitethema (`data-theme` op `<html>`):
  - donkere modus => Mermaid `dark`
  - andere modi => Mermaid `default`
- Een `MutationObserver` in `src/lib/mermaid.ts` houdt wijzigingen in `data-theme` bij en rendert bestaande Mermaid-diagrammen opnieuw, zodat kleuren na het wisselen van thema worden bijgewerkt.
- De tekstkleur van Mermaid wordt expliciet ingesteld in `initializeMermaidRuntime()` voor betere toegankelijkheid dan met de standaardstijlen:
  - tekst in donkere modus: `#fff`
  - tekst in lichte modus: `#000`

### Onderhoudsnotities

- Als de markup van Starlight/Expressive Code bij een toekomstige upgrade verandert, werk dan de Mermaid-selectors en -parsing in `src/lib/mermaid.ts` bij (vooral `pre[data-language="mermaid"]` en `.ec-line .code`).
- Als het laden van scripts op lay-outniveau verandert, zorg er dan voor dat `src/components/overrides/PageFrame.astro` `src/lib/mermaid.ts` blijft laden op pagina's met Markdown-content.
- Houd de Cypress-dekking in `cypress/e2e/mermaid.cy.js` bijgewerkt wanneer het gedrag of de markup van Mermaid-weergave verandert.

## npm-afhankelijkheden bijwerken

Voer de volgende opdrachten lokaal uit om npm-afhankelijkheden bij te werken en push de wijzigingen daarna naar de upstreamrepository.

```sh
# List outdated dependencies
npm outdated

# Update dependencies
npm update
```

## Importaliassen

Astro ondersteunt [importaliassen](https://docs.astro.build/en/guides/imports/#aliases), waarmee je lange relatieve importpaden korter kunt schrijven.

```astro title="src/components/overrides/Example.astro" del="../../images" ins="@images"
---
import relativeA from '../../images/A_logo.svg' // no alias
import aliasA from '@images/A_logo.svg' // alias
---
```

## Sitemap

Starlight heeft ingebouwde [sitemapondersteuning](https://starlight.astro.build/guides/customization/#enable-sitemap), ingeschakeld via de bovenliggende sleutel `site` in `astro.config.mjs`. Deze sleutel genereert `/sitemap-index.xml` en `/sitemap-0.xml` wanneer Tech Docs wordt [gebouwd](#building-the-site), en voegt de sitemaplink toe aan de `<head>` van elke pagina. `public/robots.txt` verwijst ook naar de sitemap.

## Testen

### End-to-end

Tech Docs gebruikt [Cypress](https://www.cypress.io/) voor end-to-endtests van aanpassingen aan het onderliggende Starlight-framework en voor andere projectbehoeften. End-to-endtests staan in `cypress/e2e`.

Voer de Cypress-tests lokaal uit door eerst de site te bouwen en te serveren:

```sh
# Build the site
npm run build

# Serve the build output
npm run preview
```

Start de tests vervolgens **in een andere terminal**:

```sh
# Run the tests
npm test
```

### Codestijl

Bijna alle bestanden in de Tech Docs-codebase worden opgemaakt met [Prettier](https://prettier.io/), zodat de leesbaarheid en syntaxis consistent zijn. Voer Prettier lokaal uit om opmaakfouten te vinden en deze waar mogelijk automatisch te herstellen:

```sh
# Check formatting of .md, .css, .astro, .js, .yml, etc. files
npm run prettier:check

# Fix any errors that can be overwritten automatically
npm run prettier:fix
```

Alle CSS in `.css`- en `.astro`-bestanden wordt met [Stylelint](https://stylelint.io/) gelint om fouten te helpen voorkomen en conventies af te dwingen. Voer Stylelint lokaal uit om lintfouten te vinden en deze waar mogelijk automatisch te herstellen:

```sh
# Check all CSS
npm run stylelint:check

# Fix any errors that can be overwritten automatically
npm run stylelint:fix
```

### CI/CD

Voordat nieuwe wijzigingen worden geaccepteerd in de codebase, moeten de tests voor [end-to-end](#end-to-end) en [codestijl](#code-style) slagen. Tech Docs gebruikt [GitHub Actions](https://docs.github.com/en/actions) als platform voor continue integratie en continue levering (CI/CD), dat de test- en implementatieprocessen automatiseert. De tests zijn gedefinieerd in yaml-bestanden in `.github/workflows/` en worden automatisch uitgevoerd wanneer nieuwe wijzigingen worden voorgesteld.
