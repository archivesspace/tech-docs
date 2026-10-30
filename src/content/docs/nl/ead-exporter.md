---
title: EAD-export van een collectiebeherende instelling
description: Een handleiding voor het exporteren van de EAD-bestanden van alle gepubliceerde collecties binnen een opgegeven collectiebeherende instelling naar één ziparchief.
---

Exporteert alle EAD-XML-bestanden van gepubliceerde collecties die bij één
collectiebeherende instelling horen naar een ziparchief. Dit zipbestand wordt
opgeslagen in de datamap van ArchivesSpace (zoals gedefinieerd in `config.rb`).
De bestandsnaam bevat de ID van de collectiebeherende instelling.

## Gebruik

```sh
./scripts/ead_export.sh user password repository_id
```

Een goede werkwijze is om het wachtwoord in een verborgen bestand te plaatsen,
bijvoorbeeld:

```sh
touch ~/.aspace_password
chmod 0600 ~/.aspace_password
vi ~/.aspace_password # enter your password
```

Voer het script vervolgens als volgt uit:

```sh
./scripts/ead_export.sh user $(cat /home/user/.aspace_password) repository_id
```

Zo voorkomt u dat u het wachtwoord rechtstreeks via de opdrachtregel, in crontab
enzovoort blootstelt.
