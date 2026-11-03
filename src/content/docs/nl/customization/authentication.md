---
title: Aanvullende authenticatie
description: Instructies voor het installeren en configureren van een aangepaste authenticatiehandler via een plug-in.
---

ArchivesSpace ondersteunt standaard authenticatie op basis van LDAP, maar u kunt
gebruikers authenticeren via andere gebruikersdirectory's die met wachtwoorden
werken door uw eigen authenticatiehandler te definiëren, een plug-in te maken
en uw ArchivesSpace-instantie zo te configureren dat deze de handler gebruikt.
Als u liever geen eigen handler maakt, is er een
[plug-in](https://github.com/lyrasis/aspace-oauth) beschikbaar die OAUTH-gebruikersauthenticatie gebruikt en die u aan uw ArchivesSpace-installatie kunt toevoegen.

## Een nieuwe authenticatiehandlerklasse maken voor gebruik in een plug-in

Een authenticatiehandler is een klasse die een paar belangrijke methoden
implementeert:

- `initialize(opts)` -- Een objectconstructor die het configuratieblok ontvangt
  dat in de systeemconfiguratie is opgegeven.
- `name` -- Een methode zonder argumenten die een tekenreeks retourneert
  waarmee de instantie van uw handler wordt geïdentificeerd. De indeling van
  deze tekenreeks is niet van belang: deze wordt alleen opgeslagen als een
  gebruikerskenmerk (in de ArchivesSpace-database), zodat kan worden vastgesteld
  via welke authenticatiebron een gebruiker zich het laatst met succes heeft
  geauthenticeerd.
- `authenticate(username, password)` -- een methode die controleert of
  `password` het juiste wachtwoord is voor `username`. Als het wachtwoord juist
  is, retourneert de methode een instantie van `JSONModel(:user)`. Anders
  retourneert de methode `nil`.

Voor elke inlogpoging wordt een nieuwe instantie van uw handler gemaakt, dus u
hoeft in uw implementatie geen rekening te houden met gelijktijdigheid.

Uw methode `authenticate` mag alles doen wat nodig is om te controleren of het
opgegeven wachtwoord juist is. De enige beperking is dat de methode `nil` of
een instantie van `JSONModel(:user)` moet retourneren.

De klasse `JSONModel(:user)` (waarvan het JSON-schema is gedefinieerd in
`common/schemas/user.rb`) beschrijft de eigenschappen die het systeem voor een
gebruiker nodig heeft. Wanneer u een object van `JSONModel(:user)` retourneert,
worden de waarden ervan gebruikt om een ArchivesSpace-gebruiker aan te maken
(als er nog geen gebruiker met die naam bestaat) of om de bestaande gebruiker
bij te werken (als deze al bekend was).

**Opmerking**: De klasse `The JSONModel(:user)` valideert de waarden die u opgeeft
aan de hand van het JSON-schema en genereert een
`JSONModel::ValidationException` als er iets niet klopt. Als dit binnen uw
handler gebeurt, wordt de uitzondering vastgelegd in het logboek en mislukt het
authenticatieverzoek.

### Een basisskelet

Stel dat u al een database hebt met een tabel met gebruikers die bij
ArchivesSpace moeten kunnen inloggen. Hieronder staat een schets van een
authenticatiehandler die verbinding maakt met deze database en deze gebruikt
voor authenticatie.

```ruby
# For this example we'll use the Sequel database toolkit.  Note that
# this isn't necessary--you could use whatever database library you
# like here.
require 'sequel'

class MyDatabaseAuth

  # For easy access to the JSONModel(:user) class
  include JSONModel


  def initialize(definition)
    # Store the database connection details for use at
    # authentication time.
    @db_url = definition[:db_url] or raise "Need a value for :db_url"
  end


  # Just for informational purposes.  Return a string containing our
  # database URL.
  def name
    "MyDatabaseAuth - #{@db_url}"
  end


  def authenticate(username, password)
    # Open a connection to the database
    Sequel.connect(@db_url) do |db|

      # Check whether we have an entry for the given username
      # and password in our database's "users" table
      user = db[:users].filter(:username => username,
                                :password => password).
                        first

      if !user
        # The user couldn't be found, or their password was wrong.
        # Authentication failed.
        return nil
      end

      # Build and return a JSONModel(:user) instance from fields in the database
      JSONModel(:user).from_hash(:username => username,
                                  :name => user[:user_full_name])

    end
  end

end
```

Om uw nieuwe authenticatiehandler te gebruiken, moet u deze toevoegen aan de
plug-inarchitectuur van ArchivesSpace en inschakelen. Maak een nieuwe map aan
in de plug-inmap van uw ArchivesSpace-installatie, bijvoorbeeld our_auth.
Maak in die map de mappenstructuur `backend/model/` aan en plaats het nieuwe
klassebestand daarin. Configureer vervolgens de nieuwe handler.

## Uw configuratie aanpassen

Als u wilt dat ArchivesSpace uw nieuwe authenticatiehandler aanroept, voegt u
een item toe aan het configuratieblok `:authentication_sources` in het bestand
`config/config.rb`.

Een configuratie voor het bovenstaande voorbeeld kan er als volgt uitzien:

```ruby
AppConfig[:authentication_sources] = [{
                                        :model => 'MyDatabaseAuth',
                                        :db_url => 'jdbc:mysql://localhost:3306/somedb?user=myuser&password=mypassword',
                                      }]
```

## De plug-in toevoegen aan de lijst met al ingeschakelde plug-ins

Zoek in het bestand `config/config.rb` de instelling AppConfig[:plugins] en
voeg daar een verwijzing naar de nieuwe plug-in toe. Als u deze bijvoorbeeld
our_auth hebt genoemd, kan de instelling AppConfig[:plugins] er ongeveer
als volgt uitzien:

AppConfig[:plugins] = ['local', 'hello_world', 'our_auth']

Start uw ArchivesSpace-installatie opnieuw. Daarna zouden authenticatieverzoeken
bij uw nieuwe handler moeten binnenkomen.
