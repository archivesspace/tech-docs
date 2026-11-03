---
title: Prestatieoptimalisatie
description: Richtlijnen voor het optimaliseren van de prestaties van de ArchivesSpace-stack.
---

ArchivesSpace bestaat uit een stack van webapplicaties die mogelijk speciale afstemming vereisen om zo effectief mogelijk te werken. Dit geldt met name voor instellingen met veel gegevens of veel gelijktijdige gebruikers die metadata bewerken.
Houd er rekening mee dat ArchivesSpace op meerdere servers kan worden gehost, hetzij in een [multi-tenantconfiguratie](/provisioning/clustering), hetzij door de verschillende applicaties (d.w.z. backend, frontend, public, solr en indexer) op afzonderlijke servers te implementeren.

## Applicatie-instellingen

De applicatie zelf kan op tal van manieren worden afgestemd. Het is een goed idee om de [configuratiedocumentatie](/customization/configuration) te lezen, omdat er veel instellingen zijn die u aan uw behoeften kunt aanpassen.

Houd er rekening mee dat het, omdat ArchivesSpace een Java-applicatie is, mogelijk is om de geheugentoewijzing voor de JVM in te stellen. Op internet zijn veel artikelen te vinden met informatie over optimale instellingen. Welke instellingen optimaal zijn, hangt sterk af van de belasting van uw server en de hardware. Het is een goed idee om de applicatie te monitoren en ervoor te zorgen dat deze niet tegen de bovengrens van de ingestelde heap aanloopt.

Deze instellingen zijn:

- ASPACE_JAVA_XMX : Maximale heapruimte (komt overeen met Java's Xmx, standaard "Xmx1024m")
- ASPACE_JAVA_XSS : Stackgrootte van threads (komt overeen met Xss, standaard "Xss2m")
- ASPACE_GC_OPTS : Opties voor de garbagecollector van Java (standaard: "-XX:+CMSClassUnloadingEnabled -XX:+UseConcMarkSweepGC -XX:NewRatio=1")

Linux-gebruikers kunnen deze instellingen wijzigen door een omgevingsvariabele te exporteren (bijvoorbeeld $ export ASPACE_JAVA_XMX="Xmx2048m") of door het opstartscript archivesspace.sh te bewerken en de standaardwaarden aan te passen.

Windows-gebruikers moeten het bestand archivesspace.bat bewerken.

Als u problemen ondervindt met fouten zoals `java.lang.OutOfMemoryError`, probeer dan de waarde van `ASPACE_JAVA_XMX` te verdubbelen. Op Linux kunt u dit doen door een omgevingsvariabele in te stellen, zoals `$ export ASPACE_JAVA_XMX="Xmx2048m"`, of door archivsspace.sh te bewerken:

```shell
if [ "$ASPACE_JAVA_XMX" = "" ]; then
    ASPACE_JAVA_XMX="-Xmx2048m"
fi
```

Voor Windows wijzigt u archivesspace.bat:

```shell
java -Darchivesspace-daemon=yes %JAVA_OPTS% -XX:+CMSClassUnloadingEnabled -XX:+UseConcMarkSweepGC -XX:NewRatio=1 -Xss2m -X
mx2048m -Dfile.encoding=UTF-8 -cp "%GEM_HOME%\gems\jruby-rack-1.1.12\lib\*;lib\*;launcher\lib\*!JRUBY!" org.jruby.Main "la
uncher/launcher.rb" > "logs/archivesspace.out" 2>&1
```

**LET OP: DE APPLICATIE GEBRUIKT HET BESCHIKBARE GEHEUGEN NIET TENZIJ U DE MAXIMALE HEAPGROOTTE INSTELT** Als uw server bijvoorbeeld 4 GB RAM heeft, maar u de ArchivesSpace-instellingen niet hebt aangepast, gebruikt u slechts 1 GB.

## MySQL

De ArchivesSpace-applicatie kan een databaseserver behoorlijk zwaar belasten, omdat het een toepassing is die veel met metadata werkt. Op internet zijn veel artikelen te vinden over het afstemmen van een MySQL-database. Een goed begin is een tool zoals [MySQL Tuner](http://mysqltuner.com/) of [Tuning Primer](https://rtcamp.com/tutorials/mysql/tuning-primer/); deze kunnen nuttige aanwijzingen geven over mogelijke aanpassingen aan de configuratie van uw MySQL-server.

Houd de hoeveelheid beschikbaar geheugen op de server en de InnoDB-bufferpool goed in de gaten.

## Solr

Op internet zijn veel suggesties te vinden voor het optimaliseren van een Solr-index. Een [externe Solr-index gebruiken](/provisioning/solr) kan de prestaties van ArchivesSpace verbeteren, omdat de index dan op een eigen server staat.
