---
title: Proxy-prefix
description: Instructies voor het aanbieden van elke voor gebruikers zichtbare ArchivesSpace-toepassing onder een prefix in plaats van als eigen subdomein.
---

**Belangrijke opmerking: prefixes werken niet goed in versies tussen 2.0.1 en 2.2.2**

Dit document beschrijft een eenvoudige aanpak voor degenen die willen afwijken van de aanbevolen
praktijk om elke voor gebruikers zichtbare ArchivesSpace-toepassing op een eigen subdomein te draaien,
en in plaats daarvan elke toepassing onder een prefix aan te bieden, bijvoorbeeld:

```
http://aspace.myarchive.org/staff
http://aspace.myarchive.org/public
```

Deze configuratie die in dit document wordt beschreven, is één mogelijke aanpak,
en om het eenvoudig te houden, wordt ervan uitgegaan dat het volgende geldt:

- ArchivesSpace draait op één Linux-server
- De server draait op de Apache 2.2+-webserver

Tenzij anders vermeld, wordt ervan uitgegaan dat u root-toegang heeft op
uw machines, en dat alle opdrachten als root moeten worden uitgevoerd (of met sudo).

## Stap 1: Zet proxies op in uw Apache-configuratie

De volgende wijzigingen kunnen worden aangebracht in het bestand httpd.conf zelf, of in een inbegrepen bestand:

```apache
ProxyPass /staff http://localhost:8080/staff
ProxyPassReverse /staff http://localhost:8080/
ProxyPass /public http://localhost:8081/public
ProxyPassReverse /public http://localhost:8081/
```

Start Apache nu opnieuw.

## Stap 2: Installeer en configureer ArchivesSpace

Volg de instructies in de hoofd-README om ArchivesSpace te downloaden en te installeren.

Open het bestand `archivesspace/config/config.rb` en voeg de volgende regels toe:

```ruby
AppConfig[:frontend_proxy_url] = 'http://aspace.myarchive.org/staff'
AppConfig[:public_proxy_url] = 'http://aspace.myarchive.org/public'
```

(Opmerking: Deze regels mogen niet beginnen met een '#' teken.)

Start ArchivesSpace.

## Stap 3: (optioneel) Sluit poorten 8080 en 8081 af

Standaard zijn de medewerkers- en publieke toepassingen toegankelijk via de poorten 8080 en 8081

```
http://aspace.myarchive.org:8080
http://aspace.myarchive.org:8081
```

Aangezien dit niet de URL's zijn waarop gebruikers toegang moeten hebben tot de toepassing, wilt u deze
waarschijnlijk afsluiten. Zie README_HTTPS voor meer informatie over het afsluiten van poorten met iptables.
