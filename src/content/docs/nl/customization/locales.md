---
title: Tekst aanpassen
description: Instructies voor het aanpassen van tekst in ArchivesSpace met locale-bestanden, waaronder het overschrijven van labels, berichten, knopinfo en tijdelijke aanduidingen via de Rails I18n-API.
---

ArchivesSpace heeft alle labels, berichten en knopinfo uit de applicatie ondergebracht in de locale-bestanden, die deel uitmaken van de
[Rails Internationalization (I18n)](http://guides.rubyonrails.org/i18n.html)-API.
De locales in deze map vormen de basis voor vertalingen die door alle
ArchivesSpace-applicaties worden gebruikt. Elke applicatie kan deze waarden
vervolgens aanvullen of overschrijven met eigen locale-bestanden.

Raadpleeg voor een handleiding over het beheren van deze "i18n"-bestanden http://guides.rubyonrails.org/i18n.html

U vindt de bronbestanden voor zowel de [medewerkersinterface](https://github.com/archivesspace/archivesspace/tree/master/frontend/config/locales) als de
[publieke applicatie](https://github.com/archivesspace/archivesspace/tree/master/public/config/locales). Er is ook een [gemeenschappelijk locale-bestand](https://github.com/archivesspace/archivesspace/blob/master/common/locales/en.yml) voor enkele waarden die in de ArchivesSpace-applicaties worden gebruikt.

De basisvertalingen zijn als volgt onderverdeeld:

- Het bovenste bestand "en.yml" bevat de Engelse vertalingen van alle recordlabels, berichten en knopinfo
- "enums/en.yml" bevat de waarden voor de dynamische enumeratiecodes — voeg uw vertalingen aan dit bestand toe nadat u uw enumeratiecodes hebt geïmporteerd

Deze waarden worden in de weergaven opgehaald met de methode I18n.t(), zoals I18n.t("brand.welcome_message").

Als de waarde die u wilt overschrijven in het gemeenschappelijke locale-bestand staat (zoals bijvoorbeeld het veldlabel "titel digitaal object"), kunt u dit wijzigen door het bestand locales/en.yml in de distributiemap van ArchivesSpace eenvoudig aan te passen. U moet ArchivesSpace opnieuw starten om de wijzigingen toe te passen.

Als de waarde die u wilt wijzigen in het specifieke bestand en.yml voor de publieke applicatie of de medewerkersinterface staat, kunt u deze waarden overschrijven met behulp van de map plugins. Als u bijvoorbeeld het welkomstbericht op de publieke frontend wilt wijzigen, maakt u in uw ArchivesSpace-distributie een bestand met de naam 'plugins/local/public/locales/en.yml' en voegt u de volgende waarden toe:

```yaml
en:
  brand:
  title: My Archive
  home: Home

welcome_message: HEY HEY HEY!!
```

Start ArchivesSpace opnieuw om deze waarden toe te passen.

Als u een nieuwe waarde toevoegt, moet u deze ook aan de medewerkersinterface toevoegen door in het vervolgkeuzemenu Systeem de optie Gecontroleerde waardelijsten beheren te kiezen. Selecteer de lijst en voeg de waarde toe. Start ArchivesSpace opnieuw; de vertaling die u in het yml-bestand hebt ingesteld, wordt dan weergegeven.

Als u een andere taal gebruikt, vervangt u en.yml door een ander bestand (zoals fr.yml) en werkt u de locale-instelling in het bestand config.rb bij (bijvoorbeeld: AppConfig[:locale] = :fr).

## Knopinfo

U voegt knopinfo aan een recordlabel toe door een nieuwe vermelding te maken met "\_tooltip" achter de code van het label. Voorbeeld: knopinfo toevoegen aan het veld Titel van een record voor nog niet ontsloten materiaal:

```yaml
en:
  accession:
    title: Title
    title_tooltip: |
      <p>The title assigned to an accession or resource. The accession title
      need not be the same as the resource title. Moreover, a title need not
      be expressed for the accession record, as it can be implicitly
      inherited from the resource record to which the accession is
      linked.</p>
```

## Tijdelijke aanduidingen

Voor tekstvelden of tekstgebieden kunt u tijdelijke aanduidingstekst instellen die wordt weergegeven wanneer het veld leeg is (zie voor meer informatie
http://www.w3.org/html/wg/drafts/html/master/forms.html#the-placeholder-attribute).
Houd er rekening mee dat hoewel de meeste moderne browserversies deze functie ondersteunen,
oudere versies dat niet doen.

U voegt een tijdelijke aanduiding aan een tekstveld van een record toe door een nieuwe vermelding te maken met "\_placeholder" achter de code van het label. Bijvoorbeeld:

```yaml
en:
  accession:
    title: Title
    title_placeholder: See DACS 2.3.18-2.3.22
```
