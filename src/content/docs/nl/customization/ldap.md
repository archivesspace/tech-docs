---
title: LDAP-authenticatie
description: Instructies voor het beheren van authenticatie via een of meer LDAP-directory's.
---

ArchivesSpace kan zijn eigen gebruikersdirectory beheren, maar kan ook worden
geconfigureerd om gebruikers te authenticeren via een of meer LDAP-directory's
door deze op te geven in het configuratiebestand van de applicatie. Wanneer
een gebruiker probeert in te loggen, wordt elke authenticatiebron geprobeerd
totdat er een overeenkomt.

Een minimale LDAP-configuratie ziet er als volgt uit:

```ruby
AppConfig[:authentication_sources] = [{
                                        :model => 'LDAPAuth',
                                        :hostname => 'ldap.example.com',
                                        :port => 389,
                                        :base_dn => 'ou=people,dc=example,dc=com',
                                        :username_attribute => 'uid',
                                        :attribute_map => {:cn => :name},
}]
```

Met deze configuratie authenticeert ArchivesSpace door verbinding te maken
met `ldap://ldap.example.com:389/`, een anonieme bind uit te voeren en in de
boom `ou=people,dc=example,dc=com` te zoeken naar `uid = <username>`.

Als de gebruiker wordt gevonden, authenticeert ArchivesSpace deze door een
bind uit te voeren met het opgegeven wachtwoord. Tot slot geeft de
`:attribute_map`-vermelding aan hoe LDAP-attributen moeten worden gekoppeld
aan gebruikersattributen van ArchivesSpace (in het bovenstaande voorbeeld
wordt LDAP's `cn` gekoppeld aan ArchivesSpace' `name`).

Veel LDAP-directory's ondersteunen geen anonieme bind. Om met zo'n directory
te integreren, moet u de gebruikersnaam en het wachtwoord opgeven van een
gebruiker die toestemming heeft om verbinding te maken met de directory en
andere gebruikers te zoeken. Als u de vorige configuratie voor dit geval aanpast, ziet deze er als volgt
uit:

```ruby
AppConfig[:authentication_sources] = [{
                                        :model => 'LDAPAuth',
                                        :hostname => 'ldap.example.com',
                                        :port => 389,
                                        :base_dn => 'ou=people,dc=example,dc=com',
                                        :username_attribute => 'uid',
                                        :attribute_map => {:cn => :name},
                                        :bind_dn => 'uid=archivesspace_auth,ou=system,dc=example,dc=com',
                                        :bind_password => 'secretsquirrel',
}]
```

Tot slot vereisen sommige LDAP-directory's dat SSL-versleuteling wordt
gebruikt. Om ArchivesSpace te configureren voor verbinding via LDAPS, wijzigt
u de poort indien nodig en geeft u de optie `encryption` op:

```ruby
AppConfig[:authentication_sources] = [{
                                        :model => 'LDAPAuth',
                                        :hostname => 'ldap.example.com',
                                        :port => 636,
                                        :base_dn => 'ou=people,dc=example,dc=com',
                                        :username_attribute => 'uid',
                                        :attribute_map => {:cn => :name},
                                        :bind_dn => 'uid=archivesspace_auth,ou=system,dc=example,dc=com',
                                        :bind_password => 'secretsquirrel',
                                        :encryption => :simple_tls,
}]
```
