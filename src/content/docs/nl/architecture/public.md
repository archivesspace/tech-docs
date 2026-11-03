---
title: Publieke gebruikersinterface
description: Informatie over configuratieopties voor de publieke gebruikersinterface (PUI) van ArchivesSpace en over de overerving van gegevens in records.
---

De publieke gebruikersinterface (PUI) van ArchivesSpace biedt een publieke
interface voor uw ArchivesSpace-collecties. Bij een standaardinstallatie van
ArchivesSpace draait deze op poort `:8081`.

## Configuratie

De PUI wordt geconfigureerd met het standaardbestand `config.rb` van
ArchivesSpace. De relevante configuratieopties hebben het voorvoegsel
`:pui_`.

Zie het bestand
[`https://github.com/archivesspace/archivesspace/blob/master/common/config/config-defaults.rb`](https://github.com/archivesspace/archivesspace/blob/master/common/config/config-defaults.rb)
voor de volledige lijst met beschikbare opties.

### Privacy van bezoekers

De sleutel **:block_referrer** in het configuratiebestand (standaard:
**true**) bepaalt of de volledige verwijzende URL wordt verzonden wanneer een
gebruiker op een link klikt naar een website buiten het webdomein van uw
ArchivesSpace-instantie. Dit beschermt uw bezoekers tegen tracking door die
website.

### Hoofdnavigatiemenu

U kunt ervoor kiezen een of meer links in het hoofdmenu (horizontale
navigatie) niet weer te geven, globaal of per collectiebeherende instelling
als u meer dan één collectiebeherende instelling hebt. U beheert dit met de
opties `:pui_hide` in het bestand `config/config.rb`.

### Aanpassing van collectiebeherende instellingen

#### Weergave van "badges" op de pagina van de collectiebeherende instelling

U kunt globaal of per collectiebeherende instelling configureren welke
badges op de pagina van de collectiebeherende instelling worden weergegeven.
Hiervoor kunt u ook de configuratieopties `:pui_hide` gebruiken.

### Activering van de knop "Aanvragen" op pagina's van archiefobjecten

U kunt globaal of per collectiebeherende instelling configureren of de knop
"Aanvragen" actief is op pagina's van archiefobjecten zonder bijbehorende
topcontainer. U kunt dit aanpassen met de configuratieoptie
`:pui_requests_permitted_for_containers_only`.

### I18n

U kunt de tekst en labels van de PUI wijzigen door de locale-bestanden in de
map `locales/public` van uw ArchivesSpace-distributie te bewerken.

### Een "inleidende alinea" toevoegen

U kunt ook de hierboven beschreven aangepaste `.yml`-bestanden gebruiken om
een aangepaste "inleidende alinea" (inclusief HTML-markup) toe te voegen aan
een of meer van uw collectiebeherende instellingen. Gebruik hiervoor de code
van de collectiebeherende instelling als sleutel.

Als uw collectiebeherende instelling `My Wonderful Repository` bijvoorbeeld
de code `MWR` heeft, ziet u mogelijk het volgende in het aangepaste bestand
`en.yml`:

```yaml
en:
  repos:
    mwr:
      lead_graph: This <strong>amazing</strong> repository has so much to offer you!
```

## Ontwikkeling

Voor een ontwikkelserver volgt de PUI hetzelfde patroon als de rest van
ArchivesSpace. Ga vanuit uw checkout van ArchivesSpace als volgt te werk:

```shell
     # Prepare all dependencies
     build/run bootstrap

     # Run the backend development server (and Solr)
     build/run backend:devserver

     # Run the indexer
     build/run indexer

     # Finally, run the PUI itself
     build/run public:devserver
```

## Overerving

### Drie opties voor overerving:

- Een veldwaarde rechtstreeks overerven – het record heeft geen waarde voor
  het veld en u wilt dat de veldwaarde wordt weergegeven alsof deze bij het
  record zelf hoort [verwijder de commentaarmarkering bij het
  overervingsgedeelte in de configuratie en stel het gewenste veld
  (property) in op inherit_directly => true]
- Een veldwaarde indirect overerven – het record heeft geen waarde voor het
  veld en u wilt de waarde van een hoger niveau weergeven, voorafgegaan door
  een aantekening die aangeeft dat de waarde van dat hogere niveau afkomstig
  is, zoals "Uit de collectie" [verwijder de commentaarmarkering bij het
  overervingsgedeelte in de configuratie en stel het gewenste veld
  (property) in op inherit_directly => false]
- Het veld helemaal niet weergeven – het record heeft zelf geen waarde voor
  het veld en u wilt het helemaal niet weergeven [verwijder de
  commentaarmarkering bij het overervingsgedeelte in de configuratie en
  verwijder de regels voor het gewenste veld (property)]

### Overerving van beschrijvingselementen

Met de nieuwe versie van de publieke interface kunnen alle
beschrijvingselementen worden overgeërfd. Dit is vooral belangrijk omdat de
PUI elk beschrijvingsniveau op een eigen webpagina weergeeft.

Elk beschrijvingselement kan rechtstreeks of indirect worden overgeërfd. Als
een element rechtstreeks wordt overgeërfd, wordt het weergegeven alsof het
element in de medewerkersinterface rechtstreeks aan dat archiefobject is
gekoppeld. Als een element indirect wordt overgeërfd, wordt het op een lager
beschrijvingsniveau in de publieke interface weergegeven, voorafgegaan door
een aantekening met het niveau van de voorouder waarvan het element is
overgeërfd (bijvoorbeeld "Uit de collectie" of "Uit de subserie"). In beide
gevallen wordt het element alleen overgeërfd als het ontbreekt in het
archiefobject. Bovendien wordt het beschrijvingselement alleen overgeërfd
van de dichtstbijzijnde voorouder. Als een collectierecord op het hoogste
niveau bijvoorbeeld een aantekening over openbaarheidsbeperkingen heeft en een
reeksrecord op een lager niveau ook een aantekening over openbaarheidsbeperkingen
heeft, maar het onderliggende subserierecord geen aantekening over
openbaarheidsbeperkingen heeft, erft het subserierecord alleen de aantekening
over openbaarheidsbeperkingen van het bovenliggende reeksrecord.

Daarnaast kan het ID-nummer in ArchivesSpace, dat in ISAD-G en DACS beter
bekendstaat als de referentiecode, op samengestelde wijze worden
overgeërfd. Bij samengestelde overerving worden de overgeërfde onderdelen
achter elkaar geplaatst. Een ID-nummer op itemniveau kan er bijvoorbeeld zo
uitzien: MSS 1. Reeks A. Item 1. Hoewel het archiefobject het ID-nummer
"Item 1" heeft, wordt een samengesteld ID-nummer weergegeven omdat het
reeksrecord waartoe het item behoort het ID-nummer "Reeks A" heeft, en die
reeks op haar beurt behoort tot een collectierecord met het ID-nummer "MSS
1".

Standaard zijn de volgende elementen ingesteld voor overerving:

- Titel (rechtstreekse overerving)
- ID-nummer (indirecte overerving); standaard wordt het ID-nummer alleen
  overgeërfd van bovenliggende archiefobjecten en NIET van het ID-nummer van
  de collectie.

Daarnaast wordt aanbevolen dit element op samengestelde wijze over te erven,
nadat is bepaald of het beschrijvingsniveau wel of niet als onderdeel van het
ID-nummer moet worden weergegeven. Dit hangt af van de lokale
gegevensinvoerpraktijken.

- Taalcode (rechtstreekse overerving, maar deze wordt momenteel nergens in
  de interface weergegeven; mogelijk kan deze later worden gebruikt voor
  facetten)
- Datums (rechtstreekse overerving)
- Omvang (indirecte overerving)
- Archiefvormer (indirecte overerving)
- Aantekening over openbaarheidsbeperkingen (rechtstreekse overerving)
- Toelichting op inhoud (indirecte overerving)
- Aantekening over de taal van het materiaal (indirecte overerving; er lijkt
  momenteel echter een fout te zijn waardoor deze aantekeningen altijd als
  rechtstreeks overgeërfd worden weergegeven. Zie AR-XXXX.)

Zie https://github.com/archivesspace/archivesspace/blob/master/common/config/config-defaults.rb#L296-L396 voor meer informatie en voorbeelden.

Een video-overzicht van deze functie, opgenomen voordat de ontwikkeling was
afgerond, is ook online beschikbaar:
https://vimeo.com/195457286

Samengestelde overerving van ID-nummers

Als u de volgende drie regels aan uw configuratiebestand toevoegt,
ArchivesSpace opnieuw start en vervolgens het indexeerproces uw records opnieuw
laat indexeren, kunt u samengestelde ID-nummers gebruiken:

```ruby
AppConfig[:record_inheritance][:archival_object][:composite_identifiers] = {
:include_level => true,
:identifier_delimiter => '. '
}
```

Voeg de volgende configuratie toe om extra velden, zoals onderwerpen, toe te
voegen:

```ruby
inherited_fields_extras = [
 {
   code: 'subjects',
   property: 'subjects',
   inherit_if: proc { |json| json.select { |j| true } },
   inherit_directly: false,
 },
]
```

Als u `include_level` instelt op `true`, wordt het niveau van het
archiefobject opgenomen in het ID-nummer, zodat u die informatie niet hoeft
te herhalen. Als het beschrijvingsniveau bijvoorbeeld "Reeks" is, het
ID-nummer van het archiefobject "1" is en het ID-nummer van de bovenliggende
collectie "MSS 1" is, wordt het samengestelde ID-nummer op het niveau van
reeks 1 en bij alle onderliggende records weergegeven als "MSS 1. Reeks 1".
Als u `include_level` instelt op `false`, wordt het weergegeven als "MSS 1.
1".

### Licentie

ArchivesSpace wordt uitgebracht onder de [Educational Community License,
version 2.0](http://opensource.org/licenses/ecl2.php). Zie het bestand
[COPYING](https://github.com/archivesspace/archivesspace/blob/master/COPYING)
voor meer informatie.
