---
title: robots.txt
description: Instructies voor het toevoegen van een robots.txt aan uw ArchivesSpace-site.
---

De eenvoudigste manier om een `robots.txt`-bestand aan uw site toe te voegen, is door er gewoon een aan te maken in de map `/config/`. Dit bestand wordt als een standaardbestand `robots.txt` aangeboden wanneer u uw site start.

Als dat niet mogelijk is, kunt u een apart bestand en uw proxy gebruiken.

Voor Apache ziet de configuratie er als volgt uit:

```apache
<Location "/robots.txt">
 SetHandler None
 Require all granted
</Location>
Alias /robots.txt /var/www/robots.txt
```

Voor nginx bijvoorbeeld:

```nginx
location /robots.txt {
  alias /var/www/robots.txt;
}
```

U kunt ook robots-metatags toevoegen aan uw `layout_head.html.erb`, zodat deze in de header van uw site worden opgenomen.

Voorbeeld:

`<meta name="robots" content="noindex, nofollow">`

Een goed uitgangspunt voor een `robots.txt`-bestand ziet er bijvoorbeeld als volgt uit:

```
Disallow: /search*
Disallow: /inventory/*
Disallow: /collection_organization/*
Disallow: /repositories/*/top_containers/*
Disallow: /check_session*
Disallow: /repositories/*/resources/*/tree/*
```
