---
title: Via HTTPS aanbieden
description: ArchivesSpace zo installeren dat alle verzoeken van eindgebruikers via HTTPS worden afgehandeld.
---

In dit document wordt de aanpak beschreven voor wie ArchivesSpace zo wil installeren dat alle verzoeken van eindgebruikers (oftewel URL's) via HTTPS in plaats van HTTP worden afgehandeld. Voor deze documentatie zijn de URL's voor de medewerkersinterface en de publieke gebruikersinterface:

- `https://staff.myarchive.org` - medewerkersinterface
- `https://public.myarchive.org` - publieke gebruikersinterface

De configuratie in dit document is een mogelijke aanpak. Om het eenvoudig te houden, wordt uitgegaan van het volgende:

- ArchivesSpace draait op één Linux-server
- De server draait Apache of Nginx
- U hebt een SSL-certificaat en -sleutel verkregen van een certificaatautoriteit
- U hebt ervoor gezorgd dat de benodigde firewallpoorten zijn geopend (80 en 443).

1. [De webserver configureren](<#Step-1%3A-Configure-Web-Server-(Apache-or-Nginx)>)
   - [Apache](#Apache)
     - [SSL instellen](#Setting-up-SSL)
     - [Omleidingen instellen](#Setting-up-Redirects)
   - [Nginx](#Nginx)
2. [ArchivesSpace configureren](#Step-2%3A-Configure-ArchivesSpace)

## Stap 1: webserver configureren (Apache of Nginx)

### Apache

Informatie over het configureren van Apache voor SSL vindt u op http://httpd.apache.org/docs/current/ssl/ssl_howto.html. Lees die documentatie voordat u probeert SSL te configureren.

#### SSL instellen

Gebruik de richtlijnen `NameVirtualHost` en `VirtualHost` om verzoeken door te sturen naar de daadwerkelijke URL's van de applicatie. Hiervoor is de Apache-module `mod_proxy` nodig.

```apache
NameVirtualHost *:443

<VirtualHost *:443>
  ServerName staff.myarchive.org
  SSLEngine On
  SSLCertificateFile "/path/to/your/cert.crt"
  SSLCertificateKeyFile "/path/to/your/key.key"
  RequestHeader set X-Forwarded-Proto "https"
  ProxyPreserveHost On
  ProxyPass / http://localhost:8080/
  ProxyPassReverse / http://localhost:8080/
</VirtualHost>

<VirtualHost *:443>
  ServerName public.myarchive.org
  SSLEngine On
  SSLCertificateFile "/path/to/your/cert.crt"
  SSLCertificateKeyFile "/path/to/your/key.key"
  RequestHeader set X-Forwarded-Proto "https"
  ProxyPreserveHost On
  ProxyPass / http://localhost:8081/
  ProxyPassReverse / http://localhost:8081/
</VirtualHost>
```

U kunt desgewenst het kenmerk `Set-Cookie: Secure attribute` instellen door `Header edit Set-Cookie ^(.*)$ $1;HttpOnly;Secure` toe te voegen. Wanneer een cookie het kenmerk Secure heeft, neemt de useragent de cookie alleen op in een HTTP-verzoek als het verzoek via een beveiligd kanaal wordt verzonden.

Gebruikers zien mogelijk een waarschuwing in de browserconsole dat `Cookie “archivesspace_session” does not have a proper “SameSite” attribute value. Soon, cookies without the “SameSite” attribute or with an invalid value will be treated as “Lax”. This means that the cookie will no longer be sent in third-party contexts` (voorbeeld uit Firefox 104), of een vergelijkbare waarschuwing. Sommige browsers, zoals Chrome versie 80 en hoger, dwingen dit al af. Standaardinstallaties van ArchivesSpace zouden hier geen last van moeten hebben. Als u echter problemen ondervindt met integraties en/of aanpassingen van uw installatie, kan de volgende richtlijn nodig zijn: `Header edit Set-Cookie ^(.*)$ $1;SameSite=None;Secure`. Afhankelijk van uw functionele en/of beveiligingsvereisten kan `SameSite=Lax` (de standaardwaarde) of zelfs `SameSite=Strict` geschikter zijn. Raadpleeg https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite of andere bronnen voor meer informatie.

#### Omleidingen instellen

Wanneer een site via HTTPS wordt aangeboden, is het verstandig een omleiding in te stellen zodat verouderde HTTP-verzoeken naar de juiste URL worden doorgestuurd. Dit kan in Apache als volgt:

```apache
<VirtualHost *:80>
ServerName staff.myarchive.org
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule (.*) https://staff.myarchive.org$1 [R,L]
</VirtualHost>

<VirtualHost *:80>
ServerName public.myarchive.org
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule (.*) https://public.myarchive.org$1 [R,L]
</VirtualHost>
```

### Nginx

Informatie over het configureren van nginx voor SSL vindt u op http://nginx.org/en/docs/http/configuring_https_servers.html. Lees die documentatie voordat u probeert SSL te configureren.

```nginx

server {
	listen 80;
	listen [::]:80;
	server_name staff.myarchive.org;
	return 301 https://staff.myarchive.org;
}


server {
  listen 443 ssl;
  server_name staff.myarchive.org;
  charset utf-8;
  }

  ssl_certificate     /path/to/your/fullchain.pem;
  ssl_certificate_key /path/to/your/key.pem

  location / {
    allow 0.0.0.0/0;
    deny all;
    proxy_pass http://localhost:8081;
  }
}

server {
	listen 80;
	listen [::]:80;
	server_name public.myarchive.org;
	return 301 https://public.myarchive.org;
}


server {
  listen 443 ssl;
  server_name staff.myarchive.org;
  charset utf-8;
  }

  ssl_certificate     /path/to/your/fullchain.pem;
  ssl_certificate_key /path/to/your/key.pem

  location / {
    allow 0.0.0.0/0;
    deny all;
    proxy_pass http://localhost:8080;
  }
}

```

## Stap 2: ArchivesSpace configureren

De volgende regels moeten in het bestand config.rb worden aangepast:

```ruby
AppConfig[:frontend_proxy_url] = "https://staff.myarchive.org"
AppConfig[:public_proxy_url] = "https://public.myarchive.org"
```

Deze regels hoeven niet te worden aangepast en moeten hun standaardwaarden behouden. Bijvoorbeeld:

```ruby
AppConfig[:frontend_url] = "http://localhost:8080"
AppConfig[:public_url] = "http://localhost:8081"
AppConfig[:frontend_proxy_prefix] = proc { "#{URI(AppConfig[:frontend_proxy_url]).path}/".gsub(%r{/+$}, "/") }
AppConfig[:public_proxy_prefix] = proc { "#{URI(AppConfig[:public_proxy_url]).path}/".gsub(%r{/+$}, "/") }
```
