---
title: Beschikbaar stellen via subdomeinen
description: Hoe u ArchivesSpace en uw webserver configureert om de applicatie via subdomeinen beschikbaar te stellen.
---

In dit document wordt beschreven hoe u ArchivesSpace en uw webserver configureert om de applicatie via subdomeinen beschikbaar te stellen (bijv. `http://staff.myarchive.org/` en `http://public.myarchive.org/`), wat de aanbevolen werkwijze is. Er is afzonderlijke documentatie beschikbaar als u [ArchivesSpace onder een prefix wilt aanbieden](/provisioning/prefix) (bijv. `http://aspace.myarchive.org/staff` en
`http://aspace.myarchive.org/public`).

1. [Uw firewall configureren](#Step-1%3A-Configuring-Your-Firewall)
2. [Uw webserver configureren](#Step-2%3A-Configuring-Your-Web-Server)
   - [Apache](#Apache)
   - [Nginx](#Nginx)
3. [ArchivesSpace configureren](#Step-3%3A-Configuring-ArchivesSpace)

## Stap 1: Uw firewall configureren

Omdat subdomeinen ervoor zorgen dat gebruikers de applicatie niet rechtstreeks via poorten 8080 en 8081 hoeven te benaderen, moeten deze poorten alleen toegankelijk zijn vanaf localhost. Op een Linux-server kan dit met iptables:

```shell
iptables -A INPUT -p tcp -s localhost --dport 8080 -j ACCEPT
iptables -A INPUT -p tcp --dport 8080 -j DROP
iptables -A INPUT -p tcp -s localhost --dport 8081 -j ACCEPT
iptables -A INPUT -p tcp --dport 8081 -j DROP
```

## Stap 2: Uw webserver configureren

### Apache

De [module mod_proxy](https://httpd.apache.org/docs/2.4/mod/mod_proxy.html) is nodig om Apache het openbare webverkeer te laten doorsturen naar de poorten van ArchivesSpace, zoals opgegeven in uw `config.rb`-bestand (standaard poort 8080 en 8081).

U kunt dit als volgt instellen als reverse proxy in de Apache-configuratie:

```apache
<VirtualHost *:80>
ServerName public.myarchive.org
ProxyPass / http://localhost:8081/
ProxyPassReverse / http://localhost:8081/
</VirtualHost>

<VirtualHost *:80>
ServerName staff.myarchive.org
ProxyPass / http://localhost:8080/
ProxyPassReverse / http://localhost:8080/
</VirtualHost>
```

ProxyPass leidt _inkomend_ verkeer op de openbare URL (public.myarchive.org) door naar poort 8081 van uw server, waar de publieke gebruikersinterface van ArchivesSpace beschikbaar is. ProxyPassReverse onderschept _uitgaand_ verkeer en herschrijft de header zodat die overeenkomt met de URL die de browser verwacht (public.myarchive.org).

### nginx

Als u nginx als reverse proxy gebruikt, hebt u een configuratiebestand nodig zoals hieronder:

```nginx
server {
listen 80;
listen [::]:80;
server_name staff.myarchive.org;
location / {
      proxy_pass http://localhost:8080/;
      }
}
      server {
listen 80;
listen [::]:80;
server_name public.myarchive.org;
location / {
      proxy_pass http://localhost:8081/;
      }
}
```

## Stap 3: ArchivesSpace configureren

De enige configuratie die u in ArchivesSpace hoeft uit te voeren, is uw domeinnamen toe te voegen aan de volgende regels in config.rb:

```ruby
AppConfig[:frontend_proxy_url] = 'http://staff.myarchive.org'
AppConfig[:public_proxy_url] = 'http://public.myarchive.org'
```

Met deze configuratie kunnen bewerkingslinks voor medewerkers op de openbare website worden weergegeven aan gebruikers die zijn aangemeld bij de medewerkersinterface.

Wijzig `AppConfig[:public_url]` of `AppConfig[:frontend_url]` **niet**; deze moeten hun poortnummers behouden om de applicatie te laten werken.
