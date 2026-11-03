---
title: Rapporten
description: Instructies voor het maken van aangepaste rapporten en subrapporten in ArchivesSpace, inclusief de vereiste structuur, SQL-gebruik, vertalingen, optionele aanpassingsmethoden en integratie met het rapportageframework.
---

Een rapport toevoegen is bedoeld als een vrij eenvoudig proces. Hieronder worden de vereisten voor het maken van een rapport beschreven.

## Een rapport toevoegen

### Vereist

- Maak een klasse voor uw rapport die een subklasse is van AbstractReport.
- Roep register_report aan. Als uw rapport parameters heeft, geeft u die hier op.
- Implementeer query_string
  - Dit moet een onbewerkte SQL-tekenreeks zijn.
  - Om SQL-injectie te voorkomen, gebruikt u db.literal voor alle gebruikersinvoer; gebruik bijvoorbeeld `"select * from table where column = #{db.literal(value)}" ` in plaats van `"select * from table where column = '#{value}'"`
- Geef vertalingen op voor de kolomkoppen en de titel van uw rapport.
  - Deze moeten in yml-bestanden staan onder _language_.reports._report name_
  - De vertaling van title mag de naam van het rapport zijn die u zelf kiest.
  - Als de gewenste vertaling al voorkomt in _language_.reports.translation_defaults (te vinden in de map static), hoeft u deze niet op te geven.
  - Vertalingen die specifiek zijn voor het afzonderlijke rapport krijgen voorrang op standaardvertalingen.

### Optioneel

- Implementeer uw eigen initialisatiemethode als uw rapport parameters heeft.
- Implementeer fix_row om gegevens op te schonen en subrapporten toe te voegen.
  - Elk resultaat wordt als een hash aan fix_row doorgegeven.
  - ReportUtils biedt verschillende klassenmethoden om het opschonen van gegevens te vereenvoudigen.
  - U kunt hier ook subrapporten toevoegen met iets als `row[:subreport_name] = SubreportClassName.new(self, row[:id]).get_content`, waarbij row het resultaat is in de vorm van een hash die als parameter aan fix_row is doorgegeven. Zie [Een subrapport toevoegen](#adding-a-subreport) voor meer informatie over het toevoegen van subrapporten.
  - Soms wilt u iets uit het resultaat verwijderen dat u nodig had om een subrapport te genereren, maar dat niet in het uiteindelijke rapport moet worden weergegeven (zoals id). Gebruik hiervoor `row.delete(:id)`.
- Speciale implementatie van query: de standaardimplementatie is simpelweg `db.fetch(query_string)`, maar door deze zelf te implementeren kunt u meer flexibiliteit krijgen. Uiteindelijk moet deze een resultaatset retourneren.
- Er is een hash met de naam info die bepaalt wat er in de koptekst bovenaan het rapport wordt weergegeven. Voorbeelden zijn het totale aantal records, de totale omvang of parameters die de gebruiker voor uw rapport heeft opgegeven. Voeg alles wat u in de rapportkoptekst wilt weergeven toe aan info. De naam van de collectiebeherende instelling wordt automatisch opgenomen. Zorg dat u vertalingen opgeeft voor de sleutels die u aan info toevoegt.
- after_tasks wordt uitgevoerd nadat fix_row op alle resultaten is uitgevoerd. Implementeer dit als u nog iets moet doen voordat het rapport wordt weergegeven.
- Geef identifier_field op als u voor elk afzonderlijk record een kop wilt toevoegen. Voor een rapport over nog niet ontsloten materiaal zou identifier_field bijvoorbeeld `:accession_number` kunnen zijn.
- Implementeer page_break zo dat deze false is als u geen pagina-einde na elk record in de PDF van het rapport wilt.
- Implementeer special_translation als u iets op een speciale manier wilt vertalen (d.w.z. als dit niet met het yml-bestand kan worden bereikt).

## Een subrapport toevoegen

### Vereist

- Maak een klasse voor uw subrapport die een subklasse is van AbstractSubreport.
- Maak een initialisatiemethode die het bovenliggende rapport/subrapport en alle parameters ontvangt die nodig zijn om het subrapport uit te voeren (meestal is dit alleen een id uit het resultaat van het bovenliggende rapport/subrapport). De initialisatiemethode moet `super(parent_report)` aanroepen.
- Implementeer query_string. Dit werkt net als bij rapporten.
- Geef de benodigde vertalingen op.

### Optioneel

- Speciale implementatie van query
- fix_row werkt net als bij rapporten.
  - Houd er rekening mee dat u geneste subrapporten kunt toevoegen.
