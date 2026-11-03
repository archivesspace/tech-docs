---
title: Backend
description: Beschrijft de architectuur van de backend van ArchivesSpace, waaronder de bestanden main.rb en rest.rb voor het starten van ArchivesSpace en het definiëren van API-mechanismen, controllers, modellen, geneste records, relaties, agents, validatie, optimistische gelijktijdigheidscontrole en het machtigingenmodel.
---

De backend is verantwoordelijk voor de implementatie van de ArchivesSpace-API
en ondersteunt de soorten toegangspatronen die in het vorige gedeelte zijn
weergegeven. We hebben gezien dat de backend CRUD-bewerkingen voor een aantal
verschillende recordtypen moet ondersteunen, en dat deze records worden
weergegeven als JSON-documenten die zijn gemaakt op basis van instanties van
JSONModel-klassen.

In de volgende gedeelten wordt beschreven hoe de onderdelen van de backend
met elkaar samenhangen.

## main.rb -- het systeem laden en initialiseren

Het programma `main.rb` is verantwoordelijk voor het starten van het
ArchivesSpace-systeem: het laden van alle controllers en modellen, het
aanmaken van gebruikers, groepen en machtigingen waar nodig, en het
voorbereiden van het systeem op het afhandelen van verzoeken.

Wanneer het systeem wordt gestart, voert het programma `main.rb` de volgende
acties uit:

- Initialiseert JSONModel, waardoor alle recordschema's uit het bestandssysteem
  worden geladen en de klassen voor elk recordtype worden gegenereerd.
- Maakt verbinding met de database.
- Laadt alle backendmodellen: de domeinobjecten en persistentielaag van het
  systeem.
- Laadt alle controllers: hiermee worden de REST-eindpunten van het systeem
  gedefinieerd.
- Start de taakplanner, die geplande taken afhandelt, zoals back-ups van de
  demodatabase (indien gebruikt).
- Voert het proces voor de 'bootstrap ACLs' uit: maakt de beheerder en diens
  groep aan als deze nog niet bestaan; maakt de verborgen globale
  collectiebeherende instelling aan; en maakt systeemgebruikers en -groepen
  aan.
- Verstuurt de melding 'backend started' naar alle geregistreerde waarnemers.

Naast het starten van het systeem biedt `main.rb` ook de volgende functies:

- Sessiebeheer: houdt geauthenticeerde backendsessies bij met het token dat
  wordt opgehaald uit de aanvraagheader `X-ArchivesSpace-Session`.
- Hulpmethoden voor toegang tot de huidige gebruiker en de huidige sessie van
  elk verzoek.

## rest.rb -- verzoeken en antwoorden voor REST-eindpunten afhandelen

De module `rest.rb` biedt het mechanisme waarmee de REST-eindpunten van de API
worden gedefinieerd. Elke definitie van een eindpunt omvat:

- De URI en HTTP-aanvraagmethode waarmee het eindpunt wordt benaderd.
- Een lijst met getypeerde parameters voor dat eindpunt.
- Documentatie voor het eindpunt, elke parameter en elk mogelijk antwoord.
- Machtigingscontroles: voorwaarden waaraan de huidige gebruiker moet voldoen
  om het eindpunt te mogen gebruiken.

Elke controller in het systeem bestaat uit een of meer van deze definities van
eindpunten. Met de syntaxis voor eindpunten die `rest.rb` biedt, kunnen
controllers hun interface declareren. Daardoor hoeven ze de gebruikelijke
standaardcode voor verzoekafhandeling niet zelf uit te voeren, zoals
parametertypen controleren, waarden van tekenreeksen naar andere typen
omzetten, enzovoort.

De onderdelen `main.rb` en `rest.rb` werken samen om controllers af te
schermen van een groot deel van de complexiteit van verzoekafhandeling.
Wanneer een verzoek de hoofdtekst van een eindpunt bereikt:

- Kan ervan worden uitgegaan dat alle vereiste parameters aanwezig zijn en
  het juiste type hebben.
- Is de hoofdtekst van het verzoek opgehaald, geparseerd naar het juiste type
  (doorgaans een JSONModel-instantie; zie hieronder) en beschikbaar gemaakt
  als verzoekparameter.
- Zijn eventuele parameters die de client heeft opgegeven maar die niet in de
  definitie van het eindpunt voorkwamen, verwijderd.
- Is de sessie van de gebruiker opgehaald en zijn alle gedefinieerde
  toegangscontroles uitgevoerd.
- Is een databaseverbinding aan het verzoek toegewezen en is een transactie
  gestart. Als de controller een uitzondering veroorzaakt, wordt de
  transactie automatisch teruggedraaid.

## Controllers

Zoals in het vorige gedeelte is besproken, implementeren controllers de
functionaliteit van de ArchivesSpace-API door een of meer eindpunten te
registreren. Elk eindpunt accepteert een HTTP-verzoek voor een bepaalde URI,
handelt het verzoek af en retourneert een JSON-antwoord (bij succes) of
veroorzaakt een uitzondering (als er iets misgaat).

Elke controller staat in een eigen bestand; deze bestanden zijn te vinden in
de map `backend/app/controllers`. Omdat de module `rest.rb` het grootste deel
van de verzoekafhandelingslogica bevat, doen controllers doorgaans niet meer
dan de klassen uit de modellagen coördineren en een antwoord naar de client
terugsturen.

### crud_helpers.rb -- veelvoorkomende CRUD-controlleracties vastleggen

Hoewel controllers vrij beperkt zijn, is er veel overlap in hun gedrag. Elk
recordtype in het systeem ondersteunt dezelfde CRUD-bewerkingen en vanuit het
perspectief van de controller verschilt een bijwerkverzoek voor nog niet
ontsloten materiaal niet veel van een bijwerkverzoek voor een digitaal object
(bijvoorbeeld).

De module `crud_helpers.rb` bundelt deze gemeenschappelijke functionaliteit in
een reeks hulpmethoden die door elke controller worden aangeroepen. Deze
methoden bieden de standaardbewerkingen van het systeem.

## Modellen

De modellagen van de backend vormen het hart van de werking. De rol van deze
laag is de kloof te overbruggen tussen de JSONModel-objecten op hoog niveau
(met hun eigenschappen, geneste records, verwijzingen naar andere records
enzovoort) en de onderliggende relationele database (via de Sequel-databasetoolkit).
De modellagen richten zich daarom voornamelijk op het omzetten van
JSONModel-instanties naar databasetabellen op een manier die alle gegevens
behoudt en efficiënte zoekopdrachten mogelijk maakt.

Elk recordtype heeft een bijbehorende modelklasse, maar de afzonderlijke
modeldefinities zijn vaak vrij beperkt. Dat komt doordat de verschillende
recordtypen op de volgende punten van elkaar verschillen:

- De reeks eigenschappen die ze toestaan (en de typen, geldige waarden
  enzovoort daarvan).
- De typen geneste records die ze kunnen bevatten.
- De typen relaties die ze met andere recordtypen kunnen hebben.

Het eerste punt, de reeks toegestane eigenschappen, is al vastgelegd in de
JSONModel-schemadefinities. De modellagen hoeven deze beperkingen dus niet af
te dwingen. Elk model kan eenvoudig de waarden overnemen die het aangeleverde
JSONModel-object bevat en ervan uitgaan dat alles wat aanwezig moet zijn er
ook is, en dat de validatie al heeft plaatsgevonden.

De overige twee aspecten worden wel door de modellagen afgedwongen, maar
hebben doorgaans niet alleen betrekking op één recordtype. Een registratie
van nog niet ontsloten materiaal kan bijvoorbeeld aan nul of meer onderwerpen
zijn gekoppeld, maar dat geldt ook voor verschillende andere recordtypen. Het
heeft dus geen zin om de logica voor het afhandelen van onderwerpen in het
model `Accession` op te nemen.

In de praktijk zien we heel weinig functionaliteit die uitsluitend bij één
recordtype hoort. Daarom hoeft er niet veel in elk bijbehorend model te staan.
In plaats daarvan worden modellen doorgaans samengesteld door een aantal
mix-ins (Ruby-modules) te combineren die voldoen aan de vereisten van het
betreffende recordtype. Functionaliteit op maat!

### ASModel en andere mix-ins

Elk model bevat ten minste de mix-in `ASModel`, die basisversies van de
volgende methoden biedt:

- `Model.create_from_json` -- Neem een JSONModel-instantie en maak daarvan een
  modelinstantie (een subklasse van Sequel::Model). Retourneert de instantie.
- `model.update_from_json` -- Werk de doelmodelinstantie bij met de waarden
  uit een gegeven JSONModel-instantie.
- `Model.sequel_to_json` -- Retourneer een JSONModel-instantie van het juiste
  type, met waarden die zijn overgenomen van de doelmodelinstantie.
  Modelklassen worden bij het aanmaken gekoppeld aan een bepaalde
  JSONModel-instantie, zodat deze methode automatisch een JSONModel-instantie
  van het juiste type kan retourneren.

Deze methoden vormen de belangrijkste interface van de modellagen: vrijwel
elke mix-in in de modellagen overschrijft een of meer van deze methoden om op
modulaire wijze gedrag toe te voegen.

De mix-in 'notes' voegt bijvoorbeeld ondersteuning toe voor meerdere notities
bij een recordtype. Door deze module in een modelklasse te mengen, accepteert
die klasse automatisch een JSONModel-eigenschap met de naam 'notes', die
indien nodig in de database wordt opgeslagen en daaruit wordt opgehaald. Dit
werkt door de drie methoden als volgt te overschrijven:

- `Model.create_from_json` -- Roep 'super' aan om het aanmaken aan de volgende
  mix-in in de keten over te dragen. Wanneer deze een nieuw aangemaakt object
  retourneert, haalt u de notities uit de JSONModel-instantie en koppelt u ze
  aan de modelinstantie (waarbij ze in de database worden opgeslagen).
- `model.update_from_json` -- Roep 'super' aan om de overige wijzigingen in
  de database op te slaan en vervang vervolgens alle bestaande notities voor
  het record door de notities uit de JSONModel.
- `Model.sequel_to_json` -- Roep 'super' aan om de volgende mix-in in de keten
  een JSONModel-instantie te laten maken. Haal vervolgens de opgeslagen
  notities uit de database en voeg ze eraan toe.

Alle mix-ins volgen dit patroon: roep 'super' aan om de aanroep aan de
volgende mix-in in de keten over te dragen (uiteindelijk bij ASModel) en
pas vervolgens het resultaat aan om het gewenste gedrag te implementeren.

### Geneste records

Sommige recordtypen, zoals registraties van nog niet ontsloten materiaal,
digitale objecten en onderwerpen, zijn _records op het hoogste niveau_: ze
worden onafhankelijk van andere records aangemaakt en zijn bereikbaar via
hun eigen URI. Er zijn echter ook records die niet zelfstandig kunnen bestaan
en alleen in de context van een ander record voorkomen. Wanneer een record
instanties van een ander record kan bevatten, noemen we deze _geneste
records_.

Het recordtype `date` is bijvoorbeeld onder meer genest in een
`accession`-record. Wanneer de modellagen een JSONModel-instantie
met geneste records moeten opslaan, moeten ze die records eruit halen, ze in
de juiste databasetabel opslaan en ervoor zorgen dat er in de database
koppelingen worden gemaakt, zodat ze later kunnen worden opgehaald.

Dit komt vaak genoeg voor dat het omslachtig zou zijn om voor elk model code
te schrijven voor de afhandeling van geneste records. Daarom biedt de mix-in
ASModel een declaratie om dit automatisch af te handelen. Het model
`accession` gebruikt bijvoorbeeld een definitie zoals:

```ruby
base.def_nested_record(:the_property => :dates,
                      :contains_records_of_type => :date,
                      :corresponding_to_association  => :date)
```

Wanneer een registratie van nog niet ontsloten materiaal wordt aangemaakt,
geeft deze declaratie het model `Accession` de opdracht om een databaserecord
aan te maken voor elke datum die in de eigenschap "dates" van het
binnenkomende record staat. Elk van deze datumrecords wordt automatisch
gekoppeld aan de aangemaakte registratie van nog niet ontsloten materiaal.

### Relaties

Een relatie is een koppeling tussen twee records op het hoogste niveau,
waarbij de koppeling een afzonderlijk, dynamisch gegenereerd model is met
nul of meer eigen eigenschappen.

Het model `Event` kan bijvoorbeeld aan verschillende recordtypen zijn
gerelateerd:

```ruby
define_relationship(:name => :event_link,
                    :json_property => 'linked_records',
                    :contains_references_to_types => proc {[Accession, Resource, ArchivalObject]})
```

Deze declaratie genereert een aangepaste klasse die de relatie tussen
gebeurtenissen en de andere recordtypen modelleert. De bijbehorende
JSON-schemadeclaratie voor de eigenschap `linked_records` ziet er als volgt
uit:

```ruby
"linked_records" => {
  "type" => "array",
  "ifmissing" => "error",
  "minItems" => 1,
  "items" => {
    "type" => "object",
    "subtype" => "ref",
    "properties" => {
      "role" => {
        "type" => "string",
        "dynamic_enum" => "linked_event_archival_record_roles",
        "ifmissing" => "error",
      },
      "ref" => {
        "type" => [{"type" => "JSONModel(:accession) uri"},
                    {"type" => "JSONModel(:resource) uri"},
                    {"type" => "JSONModel(:archival_object) uri"},
                    ...],
        "ifmissing" => "error"
      },
    ...
```

De eigenschap bevat dus URI-verwijzingen naar andere records en daarnaast
een eigenschap 'role' om de aard van de relatie aan te geven. De bijbehorende
JSON kan er dan als volgt uitzien:

```ruby
linked_records: [{ref: '/repositories/123/accessions/456', role: 'authorizer'}, ...]
```

De definitie `define_relationship` maakt automatisch gebruik van de juiste
koppeltabellen in de database om deze relatie op te slaan en indien nodig
later weer op te halen.

### Agents en `agent_manager.rb`

Agents vormen een uitdaging voor de representatie. Er zijn vier typen agents
(persoon, familie, organisatie, software) en op hoog niveau zijn ze op
dezelfde manier gestructureerd: elk type kan een of meer naamrecords, nul of
meer contactrecords en een aantal eigenschappen bevatten. Records die aan
agents zijn gekoppeld (bijvoorbeeld via een relatie), kunnen aan elk van de
vier typen worden gekoppeld. In zekere zin implementeert elk agenttype dus
een gemeenschappelijke `Agent`-interface.

De agenttypen verschillen echter in details. Agents bevatten naamrecords,
maar de typen van die naamrecords komen overeen met het type agent: een
persoonagent bevat bijvoorbeeld een persoonsnaamrecord. Ondanks hun
overeenkomsten moeten de verschillende agents dus als afzonderlijke
recordtypen worden gemodelleerd.

De module `agent_manager` legt de overeenkomsten op hoog niveau tussen
agents vast. Elk agentmodel bevat de mix-in voor agentbeheer:

```ruby
include AgentManager::Mixin
```

en definieert zichzelf vervolgens declaratief met de aangeboden klassenmethode:

```ruby
register_agent_type(:jsonmodel => :agent_person,
                    :name_type => :name_person,
                    :name_model => NamePerson)
```

Deze definitie stelt de eigenschappen van die agent in. Ze maakt het volgende
aan:

- een one_to_many-relatie met het bijbehorende naamtype van de agent.
- een one_to_many-relatie met de tabel agent_contact.
- een definitie van geneste records voor de namenlijst van de agent (zodat
  deze lijst automatisch in de database wordt opgeslagen en eruit wordt
  opgehaald).
- een definitie van geneste records voor de contactpersonenlijst van de agent.

## Validaties

Wanneer records aan het ArchivesSpace-systeem worden toegevoegd of erin
worden bijgewerkt, worden ze aan een aantal regels getoetst om te controleren
of ze goed zijn gevormd en niet conflicteren met andere records. Er zijn twee
typen recordvalidatie:

- Validaties op recordniveau controleren of een record intern consistent is:
  het bevat alle verplichte velden, de waarden hebben het juiste type en
  formaat en de velden spreken elkaar niet tegen.
- Validaties op systeemniveau controleren of een record in een bredere
  context klopt: het deelt geen unieke identificatie met een ander record en
  de records waarnaar het verwijst bestaan daadwerkelijk.

Validaties op recordniveau kunnen geïsoleerd worden uitgevoerd, terwijl voor
validaties op systeemniveau records met andere records in de database moeten
worden vergeleken.

Validaties op systeemniveau moeten in de database zelf worden geïmplementeerd
(als integriteitsbeperkingen), maar validaties op recordniveau zijn vaak te
complex om op deze manier uit te drukken. Daarom kunnen validaties in
ArchivesSpace op een of beide van de volgende lagen voorkomen:

- Op JSONModel-niveau worden validaties vastgelegd in JSON-schemadocumenten.
  Wanneer meer flexibiliteit nodig is, worden aangepaste validaties
  toegevoegd aan het bestand `common/validations.rb`, zodat de
  validatielogica met willekeurige Ruby-code kan worden uitgedrukt.
- Op databaseniveau worden validaties vastgelegd met databasebeperkingen.
  Omdat de foutmeldingen van deze beperkingen doorgaans niet nuttig zijn voor
  gebruikers, worden databasebeperkingen ook in de modellagen van de backend
  herhaald met Sequel-validaties, die gerichtere foutmeldingen opleveren.

In het algemeen worden validaties op recordniveau afgehandeld met
JSONModel-validaties (via het JSON-schema of aangepaste validaties), terwijl
validaties op systeemniveau worden afgehandeld door het model en het
databaseschema.

## Optimistische gelijktijdigheidscontrole

Een record bijwerken met de ArchivesSpace-API is een proces in twee stappen:

```ruby
# Perform a `GET` against the desired record to fetch its JSON
# representation:

GET /repositories/5/accessions/2

# Manipulate the JSON representation as required, and then `POST`
# it back to replace the original:

POST /repositories/5/accessions/2
```

Als twee personen dit tegelijkertijd doen, bestaat het risico dat de ene
persoon de wijzigingen van de andere ongemerkt overschrijft. Om dit te
voorkomen, krijgt elk record een versienummer in de eigenschap `lock_version`.
Wanneer het systeem een bijgewerkte kopie van een record ontvangt, controleert
het of de versie ervan nog actueel is. Als het versienummer niet overeenkomt
met het nummer in de database, wordt het bijwerkverzoek afgewezen en moet de
gebruiker eerst de nieuwste versie opnieuw ophalen voordat de wijzigingen
worden toegepast.

## Het machtigingenmodel van ArchivesSpace

De backend van ArchivesSpace dwingt toegangscontrole af en bepaalt welke
gebruikers records in het systeem mogen aanmaken, lezen, bijwerken,
onderdrukken en verwijderen. De belangrijkste actoren in het machtigingenmodel
zijn:

- Collectiebeherende instellingen -- Het belangrijkste mechanisme om het
  ArchivesSpace-systeem op te delen. Een instantie kan bijvoorbeeld één
  collectiebeherende instelling bevatten voor elke afdeling van een
  organisatie of één voor elke grote collectie.
- Gebruikers -- Entiteiten die het systeem gebruiken, vaak personen maar
  mogelijk ook gebruikers van de ArchivesSpace-API. Gebruikers zijn
  systeembreed gedefinieerd en één gebruiker kan toegang hebben tot meerdere
  collectiebeherende instellingen.
- Records -- Een informatie-eenheid in het systeem. Sommige records zijn
  globaal (ze bestaan buiten een bepaalde collectiebeherende instelling),
  terwijl andere aan één collectiebeherende instelling zijn gekoppeld.
- Groepen -- Een verzameling gebruikers _binnen_ een collectiebeherende
  instelling. Aan elke groep worden nul of meer machtigingen toegekend, die
  gelden voor de leden van die groep.
- Machtigingen -- Handelingen die een gebruiker mag uitvoeren. Een gebruiker
  met de machtiging `update_accession_record` mag bijvoorbeeld registraties
  van nog niet ontsloten materiaal van een collectiebeherende instelling
  bijwerken.

Samengevat kan een gebruiker een handeling binnen een collectiebeherende
instelling uitvoeren als die gebruiker lid is van een groep waaraan de
machtiging voor die handeling is toegekend.

### Conceptuele kunstgreep

Omdat groepen aan een collectiebeherende instelling zijn gekoppeld, regelen
ze de toegang tot die instellingen. Sommige recordtypen bestaan echter op
het hoogste niveau van het systeem (zoals de collectiebeherende instellingen
zelf, onderwerpen en agents), en het machtigingenmodel moet hiermee rekening
houden.

Om dit op te lossen, introduceren we een concept: de 'globale'
collectiebeherende instelling bevat conceptueel het volledige ArchivesSpace-
universum. Net als andere collectiebeherende instellingen bevat de globale
instelling groepen. Gebruikers kunnen lid worden van deze groepen om
machtigingen voor het hele systeem te krijgen. Een voorbeeld hiervan is de
gebruiker 'admin', die via de groep 'administrators' van de globale
collectiebeherende instelling alle machtigingen krijgt. Een ander voorbeeld
is de gebruiker 'search indexer', die elk record in het systeem mag lezen,
maar niet mag bijwerken of verwijderen.
