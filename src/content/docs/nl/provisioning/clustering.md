---
title: Loadbalancing en meerdere tenants
description: Richtlijnen voor het uitvoeren van ArchivesSpace in een clusteromgeving voor loadbalancing en voor ondersteuning van meerdere tenants.
---

Dit document beschrijft twee aspecten van het uitvoeren van ArchivesSpace in
een clusteromgeving: loadbalancing en ondersteuning van meerdere tenants
(geïsoleerde installaties van het systeem in een gedeelde implementatieomgeving).

De configuratie die in dit document wordt beschreven, is een mogelijke aanpak,
maar is niet bedoeld als voorschrift: de applicatielaag van ArchivesSpace is
stateless, dus elk mechanisme dat u voor loadbalancing tussen webapplicaties
kiest, zou net zo goed moeten werken als het mechanisme dat hier wordt
beschreven.

Tenzij anders vermeld, gaan we ervan uit dat u root-toegang hebt op uw machines
en dat alle opdrachten als root moeten worden uitgevoerd (of met sudo).

## Architectuuroverzicht

Dit document gaat uit van een architectuur met de volgende componenten:

- Een loadbalancermachine waarop de Nginx-webserver draait
- Twee applicatieservers, waarop elk een volledige ArchivesSpace-applicatiestack draait
- Een MySQL-server
- Een gedeeld NFS-volume dat op elke machine onder `/aspace` is gekoppeld

## Overzicht van bestanden

De map `files` in deze repository (in dezelfde map als deze `README.md`)
bevat de bestanden die samen de inhoud van de map `/aspace` vormen, die door
alle servers wordt gedeeld. De map heeft de volgende indeling:

     /aspace
     ├── archivesspace
     │   ├── config
     │   │   ├── config.rb
     │   │   └── tenant.rb
     │   ├── software
     │   └── tenants
     │       └── \_template
     │           └── archivesspace
     │               ├── config
     │               │   ├── config.rb
     │               │   └── instance_hostname.rb.example
     │               └── init_tenant.sh
     └── nginx
         └── conf
             ├── common
             │   └── server.conf
             └── tenants
                 └── \_template.conf.example

De belangrijkste onderdelen:

- `/aspace/archivesspace/config/config.rb` -- Een globaal configuratiebestand voor alle ArchivesSpace-instanties. Alle configuratieopties die u aan dit bestand toevoegt, worden toegepast op alle tenants op alle machines.
- `/aspace/archivesspace/software/` -- In deze map staan de hoofdkopieën van de distributie `archivesspace.zip`. Elke tenant verwijst naar een van de versies van de ArchivesSpace-software in deze map.
- `/aspace/archivesspace/tenants/` -- Elke tenant krijgt hier een submap op basis van de meegeleverde map `_template`. Hierin staan de configuratiebestanden voor elke tenant.
- `/aspace/archivesspace/tenants/[tenant name]/config/config.rb` -- Het globale configuratiebestand voor [tenant name]. Dit bevat tenantspecifieke opties die voor alle ArchivesSpace-instanties van de tenant moeten gelden (zoals de databaseverbindingsinstellingen).
- `/aspace/archivesspace/tenants/[tenant name]/config/instance_[hostname].rb` -- Het configuratiebestand voor de ArchivesSpace-instantie van een tenant die op een bepaalde machine draait. Hiermee kunnen configuratieopties per machine worden ingesteld (bijvoorbeeld verschillende poorten voor verschillende applicatieservers).
- `/aspace/nginx/conf/common/server.conf` -- Globale Nginx-configuratie-instellingen (van toepassing op alle tenants)
- `/aspace/nginx/conf/tenants/[tenant name].conf` -- Een tenantspecifiek Nginx-configuratiebestand. Dit bestand wordt gebruikt om de URL's van de ArchivesSpace-instanties van elke tenant in te stellen.

## Aan de slag

We gaan ervan uit dat u het volgende al klaar hebt staan:

- Drie pas geïnstalleerde machines met RedHat (of CentOS) Linux (we noemen ze `loadbalancer`, `apps1` en `apps2`).
- Een MySQL-server.
- Een NFS-volume dat op elke machine als `/aspace` is gekoppeld. Alle machines moeten volledige lees- en schrijftoegang tot deze map hebben.
- Een map onder `/aspace.local` voor instantiespecifieke bestanden (zoals logbestanden en Solr-indexen). Idealiter is dit een map op een lokale schijf.
- Java 1.6 (of hoger) geïnstalleerd op elke machine.

### De map /aspace/ vullen

Kopieer eerst de mapstructuur uit `files/` naar uw `/aspace`-volume. Deze
bevat alle configuratiebestanden die door de servers worden gedeeld:

```shell
mkdir /var/tmp/aspace/
cd /var/tmp/aspace/
unzip -x /path/to/archivesspace.zip
cp -av archivesspace/clustering/files/* /aspace/
```

U kunt dit doen op elke machine die toegang heeft tot het gedeelde volume
`/aspace/`.

### Het initialisatiescript voor het cluster installeren

Op uw applicatieservers (`apps1` en `apps2`) moet u het meegeleverde
initialisatiescript installeren:

```shell
cp -a /aspace/aspace-cluster.init /etc/init.d/aspace-cluster
chkconfig --add aspace-cluster
```

Hiermee worden bij het opstarten van het systeem alle geconfigureerde
instanties gestart. Het script kan ook worden gebruikt om afzonderlijke
instanties te starten en te stoppen.

### Nginx installeren en configureren

U moet Nginx installeren op uw `loadbalancer`-machine. Dat kan volgens de
instructies op http://nginx.org/en/download.html. U kunt hiervoor de
voorgebouwde pakketten voor uw platform gebruiken. Op het moment van schrijven
zijn de stappen voor CentOS als volgt:

```shell
wget http://nginx.org/packages/centos/6/noarch/RPMS/nginx-release-centos-6-0.el6.ngx.noarch.rpm
rpm -i nginx-release-centos-6-0.el6.ngx.noarch.rpm
yum install nginx
```

Nginx plaatst de configuratiebestanden onder `/etc/nginx/`. Voor nu hoeven we
alleen Nginx zo in te stellen dat het de configuratiebestanden van onze tenants
laadt. Bewerk hiervoor `/etc/nginx/conf.d/default.conf` en voeg de volgende
regel toe:

```
include /aspace/nginx/conf/tenants/\*.conf;
```

_Opmerking:_ de locatie van het hoofdconfiguratiebestand van Nginx kan per
systeem verschillen. Een andere waarschijnlijke locatie is
`/etc/nginx/nginx.conf`.

### De ArchivesSpace-distributie downloaden

In plaats van elke tenant een eigen kopie van de ArchivesSpace-software te
laten beheren, plaatsen we een gedeelde kopie onder
`/aspace/archivesspace/software/` en laten we elke tenantinstantie daarnaar
verwijzen. Voer hiervoor de volgende opdrachten uit op een van de servers:

```shell
cd /aspace/archivesspace/software/
unzip -x /path/to/downloaded/archivesspace-x.y.z.zip
mv archivesspace archivesspace-x.y.z
ln -s archivesspace-x.y.z stable
```

De distributie wordt uitgepakt in een map met het versienummer. Vervolgens
geven we die versie de symbolische naam "stable". Zo kunnen we eenvoudig naar
specifieke versies van de software verwijzen. We gebruiken dit later bij het
instellen van de tenant.

We gebruiken MySQL. Daarom moet de MySQL-connectorbibliotheek beschikbaar
worden gemaakt. Plaats deze hiervoor in de map `lib/` van het
ArchivesSpace-pakket:

```shell
cd /aspace/archivesspace/software/stable/lib
wget https://repo1.maven.org/maven2/mysql/mysql-connector-java/5.1.24/mysql-connector-java-5.1.24.jar
```

## Een nieuwe tenant definiëren

Nu de servers zijn ingesteld, kunnen we onze eerste tenant definiëren. Zoals
hierboven in _Overzicht van bestanden_ is aangegeven, heeft elke tenant een
eigen map onder `/aspace/archivesspace/tenants/` met alle configuratiebestanden.
Bij het definiëren van onze nieuwe tenant zullen we:

- Een Unix-account voor de tenant aanmaken
- Een database voor de tenant aanmaken
- Een nieuwe set ArchivesSpace-configuratiebestanden voor de tenant aanmaken
- De database instellen

De nieuw gedefinieerde tenant heeft aanvankelijk nog geen instanties van
ArchivesSpace; die stellen we later in.

Voor de rest van dit proces hebt u een aantal gegevens nodig. U moet met name
het volgende weten:

- De identificatie die u voor de tenant wilt gebruiken. In dit voorbeeld gebruiken we `exampletenant`.
- Welke poortnummers u gebruikt voor de backend van de applicatie, de Solr-instantie, de medewerkersinterface en de publieke gebruikersinterface (PUI). Deze poorten moeten vrij zijn op uw applicatieservers.
- Als elke tenant onder een afzonderlijk Unix-account draait, de UID en GID die u daarvoor gebruikt (deze moeten op elke server beschikbaar zijn).
- De openbare URL's van de nieuwe tenant. We gebruiken `staff.example.com` voor de medewerkersinterface en `public.example.com` voor de publieke gebruikersinterface.

### Een Unix-account aanmaken

Hoewel dit niet strikt noodzakelijk is, is het voor de beveiliging en het
eenvoudiger controleren van het systeem een goed idee om elke tenantinstantie
onder een eigen Unix-account te laten draaien.

We noemen onze nieuwe tenant `exampletenant`. Maak nu een gebruiker en groep
voor deze tenant aan. Voer deze opdrachten uit op _beide_ applicatieservers
(`apps1` en `apps2`):

```shell
groupadd --gid 2000 exampletenant
useradd --uid 2000 --gid 2000 exampletenant
```

We geven de UID en GID expliciet op, zodat ze op beide machines overeenkomen.

### De database aanmaken

ArchivesSpace gaat ervan uit dat elke tenant een eigen MySQL-database heeft.
U kunt deze aanmaken vanuit de MySQL-shell:

```sql
create database exampletenant default character set utf8;
grant all on exampletenant.* to 'example'@'%' identified by 'example123';
```

In dit voorbeeld hebben we een MySQL-database met de naam `exampletenant` en
geven we de gebruiker `example` volledige toegang met het wachtwoord
`example123`. Als onze databaseserver `db.example.com` is, hoort daar de
database-URL bij:

```
jdbc:mysql://db.example.com:3306/exampletenant?user=example&password=example123&useUnicode=true&characterEncoding=UTF-8
```

We gebruiken deze URL in de volgende sectie.

### De tenant configureren

Elke tenant heeft een eigen set bestanden in de map
`/aspace/archivesspace/tenants/`. We definiëren onze nieuwe tenant (met de naam
`exampletenant`) door de configuratiesjabloon te kopiëren en het script
`init_tenant.sh` uit te voeren om de configuratie in te stellen. Dit kan op
`apps1` of `apps2`; het hoeft maar één keer te gebeuren:

```shell
cd /aspace/archivesspace/tenants
cp -a \_template exampletenant
```

We hebben de tenant `exampletenant` genoemd, zodat de naam overeenkomt met het
Unix-account waaronder deze draait. Later gebruikt het opstartscript dit om
elke instantie als de juiste gebruiker uit te voeren.

Voor nu bewerken we alleen het configuratiebestand voor deze tenant, in
`exampletenant/archivesspace/config/config.rb`. Wanneer u dit bestand opent,
ziet u twee tijdelijke aanduidingen die u moet invullen: één voor de
database-URL, in ons geval:

```
jdbc:mysql://db.example.com:3306/exampletenant?user=example&password=example123&useUnicode=true&characterEncoding=UTF-8
```

en één voor de geheimen van de zoekfunctie, de medewerkersinterface en de
publieke gebruikersinterface van deze tenant. Deze moeten willekeurige,
moeilijk te raden wachtwoorden zijn.

## Tenantinstanties toevoegen

Om de instanties van onze tenant toe te voegen, hoeven we ze alleen op elk van
onze servers te initialiseren. Voer op zowel `apps1` als `apps2` het volgende
uit:

```shell
cd /aspace/archivesspace/tenants/exampletenant/archivesspace
./init_tenant.sh stable
```

Als u de map nu weergeeft, ziet u dat het script `init_tenant.sh` een aantal
symbolische koppelingen heeft aangemaakt. De meeste verwijzen naar de eerder
uitgepakte versie `stable` van de ArchivesSpace-software. Sommige verwijzen
naar de mappen `data` en `logs` onder `/aspace.local`.

Elke server heeft een eigen configuratiebestand dat aangeeft op welke poorten
de ArchivesSpace-applicatie moet luisteren. Maak hiervoor twee kopieën van het
voorbeeldconfiguratiebestand. Voer de volgende opdracht eerst op `apps1` en
vervolgens op `apps2` uit:

```shell
cd /aspace/archivesspace/tenants/exampletenant/archivesspace
cp config/instance_hostname.rb.example config/instance_`hostname`.rb
```

Bewerk vervolgens elk bestand om de URL's in te stellen die de instantie moet
gebruiken. Dit is ons bestand `config/instance_apps1.example.com.rb`:

```ruby
{
     :backend_url => "http://apps1.example.com:8089",
     :frontend_url => "http://apps1.example.com:8080",
     :solr_url => "http://apps1.example.com:8090",
     :indexer_url => "http://apps1.example.com:8091",
     :public_url => "http://apps1.example.com:8081",
}
```

De bestandsnaam is hierbij belangrijk: deze moet als volgt zijn:

```
instance_[server hostname].rb
```

Deze URL's bepalen op welke poorten de applicatie luistert wanneer deze wordt
gestart. Het indexeersysteem van ArchivesSpace gebruikt ze ook om updates in
het cluster bij te houden.

### Opstarten

Eenmalig moeten we de database van deze tenant vullen met de standaardset
tabellen. U kunt dit doen door het script `setup-database.sh` uit te voeren op
`apps1` of `apps2`:

```shell
cd /aspace/archivesspace/tenants/exampletenant/archivesspace
scripts/setup-database.sh
```

Nu de twee instanties zijn geconfigureerd, kunt u het initialisatiescript
gebruiken om ze op elke server te starten:

```shell
/etc/init.d/aspace-cluster start-tenant exampletenant
```

U kunt de logbestanden van elke instantie volgen in
`/aspace.local/tenants/exampletenant/logs/`. Nadat de instanties zijn gestart,
moet u vanuit uw webbrowser verbinding kunnen maken met elke instantie via de
geconfigureerde URL's.

## De load balancer configureren

Als laatste configureren we Nginx om verzoeken voor de medewerkersinterface en
de publieke gebruikersinterface te accepteren en door te sturen naar de
geschikte applicatie-instantie. Maak op de machine `loadbalancer` een nieuw
configuratiebestand voor onze tenant:

```shell
cd /aspace/nginx/conf/tenants
cp -a \_template.conf.example exampletenant.conf
```

Open nu `/aspace/nginx/conf/tenants/exampletenant.conf` in een editor. U moet:

- `<tenantname>` overal vervangen door `exampletenant`.
- De URL's van `server` aanpassen aan de hostnamen en poorten die u voor elke instantie hebt geconfigureerd.
- De hostnamen van de tenant invullen bij elke vermelding van `server_name`. In ons geval zijn dit `public.example.com` voor de publieke gebruikersinterface en `staff.example.com` voor de medewerkersinterface.

Nadat u de configuratie hebt opgeslagen, kunt u deze testen met:

     /usr/sbin/nginx -t

Als Nginx meldt dat alles in orde is, laadt u de configuratie opnieuw:

     /usr/sbin/nginx -s reload

Ga ten slotte naar `http://public.example.com/` om te controleren of Nginx nu
verzoeken accepteert en doorstuurt naar uw applicatieservers. Daarmee zijn we
klaar!
