---
title: Docker
description: Een gids voor het gebruik van de Docker-configuratie met ArchivesSpace.
---

De [Docker](https://www.docker.com/)-configuratie wordt gebruikt om [automatische builds](https://hub.docker.com/r/archivesspace/archivesspace/) op Docker Hub te maken, die worden gedeployed naar [de nieuwste versie](http://test.archivesspace.org) wanneer de build is voltooid.

## Aangepaste builds

Voer ArchivesSpace uit met MySQL, externe Solr en een Web Proxy. Schakel over naar de branch die je wilt bouwen:

```bash
#if you already have running containers and want to clear them out
docker-compose stop
docker-compose rm

#build the local image
docker-compose build # needed whenever the branch is changed and ready to test
docker-compose up

#running specific containers
docker-compose up -d db solr # in background
docker-compose up app web # in foreground
>to access running container
docker exec -it archivesspace_app_1 bash
```

## Een image delen

Om de build-image op de eenvoudigste manier te delen, maak je het gemakkelijkst een account aan op [Docker Hub](https://hub.docker.com/). Herlabel daarna de image en push deze naar het Docker Hub-account:

```bash
DOCKER_ID_USER=example
TAG=awesome-updates
docker tag archivesspace_app:latest $DOCKER_ID_USER/archivesspace:$TAG
docker push $DOCKER_ID_USER/archivesspace:$TAG
```

Om de image te downloaden: `docker pull example/archivesspace:awesome-updates`.

---
