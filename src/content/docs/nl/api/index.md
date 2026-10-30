---
title: Werken met de API
description: Algemene informatie over het werken met de API, waaronder authenticatie en GET- en POST-verzoeken met voorbeelden.
---

:::tip
Deze documentatie bevat algemene informatie over het werken met de API. Zie voor gedetailleerde documentatie over specifieke eindpunten de [API-referentie](http://archivesspace.github.io/archivesspace/api/), die afzonderlijk wordt bijgehouden.
:::

## Authenticatie

Voor de meeste acties op de backend moet u zijn aangemeld als gebruiker
met de juiste machtigingen. Door een verzoek als volgt te verzenden:

     POST /users/admin/login?password=login

wordt uw authenticatieverzoek gevalideerd en wordt een sessietoken
geretourneerd in het JSON-antwoord op uw verzoek. Geef dit token bij
volgende verzoeken mee in de header `X-ArchivesSpace-Session` om aangemeld
te blijven. Bijvoorbeeld:

     X-ArchivesSpace-Session: 8e921ac9bbe9a4a947eee8a7c5fa8b4c81c51729935860c1adfed60a5e4202cb

Omdat niet voor alle backend-/API-eindpunten authenticatie vereist is, kunt u de toegang tot poort 8089 het beste beperken tot IP-adressen die u vertrouwt. Gebruik uw firewall om een reeks IP-adressen op te geven die uw ArchivesSpace API-eindpunt mogen aanroepen. Dit wordt ook wel een allowlist genoemd.

### Voorbeeldverzoeken met CURL

Verzend het verzoek om u te authenticeren:

```shell
curl -s -F password="admin" "http://localhost:8089/users/admin/login"
```

Dit levert een JSON-antwoord op dat er ongeveer als volgt uitziet:

<!-- prettier-ignore -->
```json
{
   "session":"9528190655b979f00817a5d38f9daf07d1686fed99a1d53dd2c9ff2d852a0c6e",
   ....
}
```

Het is verstandig om de sessiesleutel op te slaan als omgevingsvariabele, zodat u deze voor volgende verzoeken kunt gebruiken:

```shell
#Mac/Unix terminal
export SESSION="9528190655b979f00817a5d38f9daf07d1686fed99a1d53dd2c9ff2d852a0c6e"

#Windows Command Prompt
set SESSION="9528190655b979f00817a5d38f9daf07d1686fed99a1d53dd2c9ff2d852a0c6e"

#Windows PowerShell
$env:SESSION="9528190655b979f00817a5d38f9daf07d1686fed99a1d53dd2c9ff2d852a0c6e"
```

Nu kunt u verzoeken verzenden zoals dit:

```shell
curl -H "X-ArchivesSpace-Session: $SESSION" "http://localhost:8089/repositories/2/resources/1
```

## CRUD

De ArchivesSpace API biedt interacties in CRUD-stijl voor verschillende
typen records op het hoogste niveau. Het werken met records volgt een
vrij standaardpatroon:

     # Get a paginated list of accessions from repository '123'
     GET /repositories/123/accessions?page=1

     # Create a new accession, returning the ID of the new record
     POST /repositories/123/accessions
     {... a JSON document satisfying JSONModel(:accession) here ...}

     # Get a single accession (returned as a JSONModel(:accession) instance) using the ID returned by the previous request
     GET /repositories/123/accessions/456

     # Update an existing accession
     POST /repositories/123/accessions/456
     {... a JSON document satisfying JSONModel(:accession) here ...}

## API-verzoeken uitvoeren

### GET-verzoeken

#### Bijbehorende records ophalen

Met de parameter :resolve kunt u ArchivesSpace vragen om het volledige object aan deze verwijzingen toe te voegen; de parameter wordt doorgegeven als een
reeks sleutels die in de geretourneerde JSON vooraf moeten worden opgehaald. Het object wordt in de verwijzing opgenomen onder de sleutel \_resolved.

Als u bijvoorbeeld een archiefonderdeel wilt vinden op basis van een ref_id en het gevonden archiefonderdeel wilt retourneren, kunt u
`resolve[]: "archival_objects"` aan uw verzoek toevoegen.

##### Shell-voorbeeld

> ```shell
> curl -s -F ****** "http://localhost:8089/users/admin/login"
> # Replace "admin" with your password and "http://localhost:8089/users/admin/login" with your ASpace API URL
> # followed by "/users/{your_username}/login"
>
> set SESSION="session_id"
> # If using a unix-like shell, replace set with export
>
> curl -H "X-ArchivesSpace-Session: $SESSION" //
> "http://localhost:8089/repositories/:repo_id:/find_by_id/archival_objects?ref_id[]=hello_im_a_ref_id;resolve[]=archival_objects"
> # Replace "http://localhost:8089" with your ASpace API URL, :repo_id: with the repository ID,
> # "hello_im_a_ref_id" with the ref ID you are searching for, and only add
> # "resolve[]=archival_objects" if you want the JSON for the returned record - otherwise, it will return the
> # record URI only
> ```

##### Python-voorbeeld

> ```python
> from asnake.client import ASnakeClient  # import the ArchivesSnake client
>
> client = ASnakeClient(baseurl="http://localhost:8089", username="admin", ******)
> # Replace "http://localhost:8089" with your ArchivesSpace API URL and "admin" for your username and password
>
> client.authorize()  # authorizes the client
>
> find_ao_refid = client.get("repositories/:repo_id:/find_by_id/archival_objects",
>                            params={"ref_id[]": "hello_im_a_ref_id",
>                            "resolve[]": "archival_objects"})
> # Replace :repo_id: with the repository ID, "hello_im_a_ref_id" with the ref ID you are searching for, and only add
> # "resolve[]": "archival_objects" if you want the JSON for the returned record - otherwise, it will return the
> # record URI only
>
> print(find_ao_refid.json())
> # Output (dict): {'archival_objects': [{'ref': '/repositories/2/archival_objects/708425', '_resolved':...}]}
> ```

#### Verzoeken om gepagineerde resultaten

Eindpunten die groepen objecten vertegenwoordigen in plaats van afzonderlijke objecten, zijn doorgaans gepagineerd. Gepagineerde eindpunten worden in de documentatie als zodanig aangeduid, met een variant van de volgende tekst:
Dit eindpunt is gepagineerd. :page, :id_set of :all_ids is vereist

    Integer page – The page set to be returned
    Integer page_size – The size of the set to be returned ( Optional. default set in AppConfig )
    Comma separated list id_set – A list of ids to request resolved objects ( Must be smaller than default page_size )
    Boolean all_ids – Return a list of all object ids

Deze eindpunten ondersteunen een of meer van de volgende mogelijkheden:

    paged access to objects (via :page)
    listing all matching ids (via :all_ids)
    fetching specific known objects via their database ids (via :id_set)

##### Shell-voorbeeld

> ```shell
> curl -s -F ****** "http://localhost:8089/users/admin/login"
> # Replace "admin" with your password and "http://localhost:8089/users/admin/login" with your ASpace API URL
> # followed by "/users/{your_username}/login"
>
> set SESSION="session_id"
> # If using a unix-like shell, replace set with export
>
> # For all archival objects, use all_ids
> curl -H "X-ArchivesSpace-Session: $SESSION" //
> "http://localhost:8089/repositories/2/archival_objects?all_ids=true"
>
> # For a set of archival objects, use id_set
> curl -H "X-ArchivesSpace-Session: $SESSION" //
> "http://localhost:8089/repositories/2/archival_objects?id_set=707458&id_set=707460&id_set=707461"
>
> # For a page of archival objects, use page and page_size
> "http://localhost:8089/repositories/2/archival_objects?page=1&page_size=10"
> ```

> Python-voorbeeld nodig

#### Werken met lange resultatensets

Wanneer u met zoekresultaten werkt met de parameters page en page_size, kunnen er veel resultaten worden geretourneerd en kan het lastig zijn om deze te beheren. Zie het Python-voorbeeld hieronder, dat laat zien hoe u door een grote resultatenset kunt itereren om in gepagineerde resultaten naar archiefonderdelen te zoeken.

##### Python-voorbeeld

> ```python
> from asnake.client import ASnakeClient  # import the ArchivesSnake client
>
> client = ASnakeClient(baseurl="http://localhost:8089", username="admin", ******)
> # Replace http://localhost:8089 with your ArchivesSpace API URL and admin for your username and password
>
> client.authorize()  # authorizes the client
>
> # To get a page of archival objects with a set page size, use "page" and "page_size" parameters
> get_repo_aos_pages = client.get("repositories/2/archival_objects", params={"page": 1, "page_size": 10})
> # Replace 2 for your repository ID. Find this in the URI of your archival object on the bottom right of the
> # Basic Information section in the staff interface
>
> print(get_repo_aos_pages.json())
> # Output (dictionary): {'first_page': 1, 'last_page': 26949, 'this_page': 1, 'total': 269488,
> # 'results': [{'lock_version': 1, 'position': 0,...]...}
>
> result_count = len(get_repo_aos_pages.json())  # Get us the count of results back
> for result in get_repo_aos_pages.json():
>     json_info = json.loads(result["json"])
>     for key, value in json_info.items():
>         id_match = id_field_regex.match(key)
> ```

#### Zoekverzoeken

Een aantal routes in de ArchivesSpace API is bedoeld om in alle of een deel van de records in de
applicatie naar inhoud te zoeken. Deze routes maken gebruik van Solr, een onderdeel dat met ArchivesSpace wordt meegeleverd en waarmee de volledige tekst van records kan worden doorzocht.

De zoekroutes die momenteel beschikbaar zijn in de applicatie zijn:

- In dit archief zoeken
- In alle collectiebeherende instellingen zoeken
- In deze collectiebeherende instelling zoeken
- In alle onderwerpen zoeken
- Zoeken naar topcontainers
- In alle locatieprofielen zoeken

Zoekroutes accepteren veel verschillende parameters, waarvan de meeste rechtstreeks overeenkomen met Solr-queryparameters. De belangrijkste parameter is q: de query die naar Solr wordt verzonden. Deze query gebruikt de Lucene-querysyntaxis. De relevante documentatie staat op de webpagina [The Standard Query Parser](https://solr.apache.org/guide/6_6/the-standard-query-parser.html#the-standard-query-parser) van de Solr Reference Guide.

Als u een zoekopdracht wilt beperken tot records van een bepaald type of bepaalde typen, kunt u de parameter 'type' gebruiken. Dit is alleen relevant voor zoek-eindpunten die niet tot specifieke typen zijn beperkt. Houd er rekening mee dat voor type een lijst met typen wordt verwacht, ook als u maar naar één type zoekt.

##### Opmerkingen over zoekroutes en resultaten

ArchivesSpace vertegenwoordigt records als JSONModel-objecten. Dit zijn de objecten die u van het systeem ontvangt en ernaartoe verzendt.

SOLR neemt deze records en slaat op basis van deze JSONModel-objecten "documenten" op in een doorzoekbare index.

Zoekroutes doorzoeken deze documenten, NIET de records zelf zoals die in de database zijn opgeslagen en door JSONModel worden weergegeven.

JSONModel-objecten en SOLR-documenten vertonen enkele overeenkomsten:

- Zowel SOLR-documenten als JSONModel-objecten zijn uitgedrukt in JSON.
- Documenten bevatten over het algemeen altijd een deelverzameling van het JSONModel-object dat ze vertegenwoordigen.

Er zijn echter ook belangrijke verschillen:

- SOLR-documenten bevatten niet noodzakelijkerwijs alle velden van een JSONModel-object.
- SOLR-documenten bevatten niet automatisch geneste JSONModel-objecten.
- SOLR-documenten kunnen velden bevatten die willekeurige "zoekweergaven" zijn van velden in bijbehorende records,
  of combinaties van velden in een record.
- SOLR-documenten hebben geen veld jsonmodel_type; de jsonmodel_type van het record wordt in SOLR opgeslagen als primary_type.

Hoe haalt u het daadwerkelijke JSONModel-object uit een zoekdocument op?

In ArchivesSpace hebben SOLR-documenten allemaal een veld json, dat het JSONModel-object dat het document vertegenwoordigt als tekenreeks bevat. U kunt een JSON-bibliotheek gebruiken om deze tekenreeks uit het veld te parseren, bijvoorbeeld de json-bibliotheek in Python.

##### Shell-voorbeeld

> ```shell
>
> # auto-generated example
> curl -H "X-ArchivesSpace-Session: $SESSION" \
>   "http://localhost:8089/search/repositories?q=&aq=%7B%22jsonmodel_type%22%3D%3E%22advanced_query%22%2C+%22query%22%3D%3E%7B%22jsonmodel_type%22%3D%3E%22boolean_query%22%2C+%22op%22%3D%3E%22AND%22%2C+%22subqueries%22%3D%3E%5B%7B%22jsonmodel_type%22%3D%3E%22date_field_query%22%2C+%22negated%22%3D%3Efalse%2C+%22comparator%22%3D%3E%22empty%22%2C+%22field%22%3D%3E%22QSUC205%22%2C+%22value%22%3D%3E%222018-03-26%22%7D%5D%7D%7D&type%5B%5D=&sort=&facet%5B%5D=&facet_mincount=1&filter=%7B%22jsonmodel_type%22%3D%3E%22advanced_query%22%2C+%22query%22%3D%3E%7B%22jsonmodel_type%22%3D%3E%22boolean_query%22%2C+%22op%22%3D%3E%22AND%22%2C+%22subqueries%22%3D%3E%5B%7B%22jsonmodel_type%22%3D%3E%22date_field_query%22%2C+%22negated%22%3D%3Efalse%2C+%22comparator%22%3D%3E%22empty%22%2C+%22field%22%3D%3E%22QSUC205%22%2C+%22value%22%3D%3E%222018-03-26%22%7D%5D%7D%7D&filter_query%5B%5D=&exclude%5B%5D=&hl=BooleanParam&root_record=&dt=&fields%5B%5D="
>
> # auto-generated example
> curl -H 'Content-Type: text/json' -H "X-ArchivesSpace-Session: $SESSION" \
>   "http://localhost:8089/search/repositories" \
>   -d '{
>   "aq": {
>     "jsonmodel_type": "advanced_query",
>     "query": {
>       "jsonmodel_type": "boolean_query",
>       "op": "AND",
>       "subqueries": [
>         {
>           "jsonmodel_type": "date_field_query",
>           "negated": false,
>           "comparator": "empty",
>           "field": "QSUC205",
>           "value": "2018-03-26"
>         }
>       ]
>     }
>   },
>   "facet_mincount": "1",
>   "filter": {
>     "jsonmodel_type": "advanced_query",
>     "query": {
>       "jsonmodel_type": "boolean_query",
>       "op": "AND",
>       "subqueries": [
>         {
>           "jsonmodel_type": "date_field_query",
>           "negated": false,
>           "comparator": "empty",
>           "field": "QSUC205",
>           "value": "2018-03-26"
>         }
>       ]
>     }
>   },
>   "hl": "BooleanParam"
> }'
> ```

### POST-verzoeken

#### Bestaande records bijwerken

Als u bestaande records wilt bijwerken, wordt aanbevolen eerst een GET-verzoek uit te voeren voor het record dat u wilt bijwerken. Zo weet u zeker dat de gegevens die u bijwerkt zo nauwkeurig mogelijk zijn en verkleint u de kans dat u onbedoeld gegevens verwijdert die eerder aanwezig waren maar verloren kunnen gaan als ze niet in de volgende update worden opgenomen. Nadat u de oorspronkelijke recordgegevens hebt opgehaald, kunt u deze zo nodig bijwerken en vervolgens een POST-verzoek met de bijgewerkte gegevens uitvoeren. Zorg ervoor dat de bijgewerkte gegevens in JSON-indeling staan en worden doorgegeven via de parameter `-d` of `--data`, of via de parameter `json` als u ArchivesSnake gebruikt.

##### Shell-voorbeeld

> ```shell
> curl -s -F ****** "http://localhost:8089/users/admin/login"
> # Replace "admin" with your password and "http://localhost:8089" with your ASpace API URL followed by
> # "/users/{your_username}/login"
>
> set SESSION="session_id"
> # If using a unix-like shell, replace set with export
>
> curl -H 'Content-Type: text/json' -H "X-ArchivesSpace-Session: $SESSION" \\
> "http://localhost:8089/repositories/:repo_id:/groups/:group_id:" \\
> -d '{"group_code": "test-group_managers",
>        "lock_version": 4,
>        "description": "Test group managers of the Manuscripts repository",
>        "jsonmodel_type": "group",
>        "member_usernames": [
>            "manager", "advance"]}'
> # Replace http://localhost:8089 with your ArchivesSpace API URL, :repo_id: with the repository ID number,
> # :group_id: with the group ID number you want to update, and the data found after -d with the data you want
> # updating the group. Be sure to include "lock_version" and the most recent number for it. You can find the
> # most recent lock_version by submitting a get request, like so: curl -H "X-ArchivesSpace-Session: $SESSION" \
> # "http://localhost:8089/repositories/:repo_id:/groups/:group_id:"
>
> # Output:
> # {"status":"Updated","id":23,"lock_version":5,"stale":null,"uri":"/repositories/2/groups/23","warnings":[]}
> ```

##### Python-voorbeeld

> ```python
> from asnake.client import ASnakeClient  # import the ArchivesSnake client
> client = ASnakeClient(baseurl="http://localhost:8089", username="admin", ******)
> # replace http://localhost:8089 with your ArchivesSpace API URL and admin for your username and password
>
> client.authorize()  # authorizes the client
>
> get_user_group = client.get("repositories/:repo_id:/groups/:group_id:").json()
> # Retrieve the data from the group you are trying to update. Replace :repo_id: with the repository ID number and
> # :group_id: with the group ID number you want to update
>
> get_user_group["member_usernames"].append("advance")
> # An example of how to modify a group record. For a list of all the fields you can update,
> # print(get_user_group). Here we append a new user 'advance' to the list of users associated with this group.
>
> update_user_group = get_user_group
> # Assign the newly updated get_user_group to update_user_group - to help make it clearer to see.
>
> update_status = client.post("repositories/:repo_id:/groups/:group_id:", json=update_user_group)
> # Replace :repo_id: with the repository ID number and :group_id: with the group ID number you want to update
>
> print(update_status.json())
> # Output:
> # {'status': 'Updated', 'id': 48, 'lock_version': 1, 'stale': None, 'uri': '/repositories/2/groups/48',
> # 'warnings': []}
> ```

#### Nieuwe records aanmaken

Bij het aanmaken van nieuwe records wordt aanbevolen een GET-verzoek uit te voeren voor het type record dat u wilt aanmaken. Dit voorbeeldrecord is handig om te zien welke velden voor dat specifieke record zijn opgenomen. Niet alle velden zijn vereist; de velden `created` en `modified` zijn bijvoorbeeld niet nodig bij het aanmaken van een nieuw record, omdat deze automatisch worden afgehandeld. Andere velden, zoals `title` en `jsonmodel_type`, zijn wel vereist.

Bekijk een bestaand record als referentie en stel vervolgens uw JSON-gegevens samen en verstuur een POST-verzoek. Zorg ervoor dat het nieuwe record wordt doorgegeven via de parameter `-d` of `--data`, of via de parameter `json` als u ArchivesSnake gebruikt.

##### Shell-voorbeeld

> ```shell
> # Create a new user group within the SHELL
> curl -s -F ****** "http://localhost:8089/users/admin/login"
> # Replace "admin" with your password and "http://localhost:8089" with your ASpace API URL followed by
> # "/users/{your_username}/login"
>
> set SESSION="session_id"
> # If using a unix-like shell, replace set with export
>
> curl -H "X-ArchivesSpace-Session: $SESSION" "http://localhost:8089/repositories/:repo_id:/groups/" \\
> -d '{"group_code": "test-group_managers",
>      "description": "Test group managers of the Manuscripts repository",
>      "jsonmodel_type": "group"}'
> # Replace "http://localhost:8089" with your ASpace API URL, :repo_id: with the repository ID, and
> # the data found in -d with the metadata you want to create the new user group.
>
> # Output
> # {"status":"Created","id":24,"lock_version":0,"stale":null,"uri":"/repositories/2/groups/24","warnings":[]}
> ```

##### Python-voorbeeld

> ```python
> # Create a new user group using Python and ArchivesSnake
> from asnake.client import ASnakeClient  # import the ArchivesSnake client
>
> client = ASnakeClient(baseurl="http://localhost:8089", username="admin", ******)
> # replace http://localhost:8089 with your ArchivesSpace API URL and admin for your username and password
>
> client.authorize()  # authorizes the client
>
> new_group = {
>   "group_code": "test-group_managers",
>   "description": "Test group managers of the Manuscripts repository",
>   "jsonmodel_type": "group",
>   "member_usernames": [
>     "manager"
>   ],
>   "grants_permissions": [
>     "cancel_job",
>     "manage_enumeration_record"]
> }
> # This is a sample user group that exceeds the minimum requirements. The minimum requirements are:
> # jsonmodel_type, description, and group_code. grants_permissions is optional, these values can be looked up in
> # the ASpace database within the permissions table
>
> post_user_group = client.post("repositories/:repo_id:/groups", json=new_group)
> # Replace :repo_id: with the ArchivesSpace repository ID and new_group with the json data to create a new user
> # group
>
> print(post_user_group.json())
> # Output:
> # {'status': 'Created', 'id': 23, 'lock_version': 0, 'stale': None, 'uri': '/repositories/2/groups/23',
> # 'warnings': []}
> ```

### DELETE-verzoeken

DELETE-verzoeken via de API verwijderen records permanent, net als in de medewerkersinterface. Wees voorzichtig! Controleer voordat u dit doet of u het volledige record wilt verwijderen. Zie [Bestaande records bijwerken](####Updating existing records) als u delen van een record wilt verwijderen, bijvoorbeeld notities of andere velden.

Haal de door ArchivesSpace gegenereerde ID van het record op om het te verwijderen en gebruik de opdracht `DELETE` in de SHELL of `client.delete` als u de Python-bibliotheek ArchivesSnake gebruikt.

##### Shell-voorbeeld

> ```shell
> # Delete a user group within the SHELL
> curl -s -F ****** "http://localhost:8089/users/admin/login"
> # Replace "admin" with your password and "http://localhost:8089" with your ASpace API URL followed by
> # "/users/{your_username}/login"
>
> set SESSION="session_id"
> # If using a unix-like shell, replace set with export
>
> curl -H "X-ArchivesSpace-Session: $SESSION" \\
> -X DELETE "http://localhost:8089/repositories/:repo_id:/groups/:group_id:"
> # Replace "http://localhost:8089" with your ASpace API URL, :repo_id: with the repository ID, and
> # :group_id: with the ID of the group you want to delete (usually found in the URL of the user group when
> # viewing in the staff interface). Deleting is permanent so make sure to test this first!
>
> # Output: {"status":"Deleted","id":47}
> ```

##### Python-voorbeeld

> ```python
> # Delete a user group from a repository using Python and ArchivesSnake
> from asnake.client import ASnakeClient  # import the ArchivesSnake client
>
> client = ASnakeClient(baseurl="http://localhost:8089", username="admin", ******)
> # replace http://localhost:8089 with your ArchivesSpace API URL and admin for your username and password
>
> client.authorize()  # authorizes the client
>
> delete_user_group = client.delete("repositories/:repo_id:/groups/:group_id:")
> # Replace :repo_id: with the ArchivesSpace repository ID and :group_id: with the ArchivesSpace ID of the
> # user group you want to delete. Deleting is permanent so make sure to test this first!
>
> print(delete_user_group.json())
> # Output: {'status': 'Deleted', 'id': 23}
> ```
