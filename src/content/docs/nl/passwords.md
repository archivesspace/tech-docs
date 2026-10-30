---
title: Wachtwoorden opnieuw instellen
description: Een script uitvoeren om het wachtwoord van een gebruiker in ArchivesSpace opnieuw in te stellen.
---

In de map `scripts` vindt u een script waarmee u het wachtwoord van een
gebruiker opnieuw kunt instellen. U kunt het als volgt uitvoeren:

```
scripts/password-reset.sh theusername newpassword  # or password-reset.bat under Windows
```

Als u MySQL gebruikt, kunt u deze opdracht gebruiken om een wachtwoord in te stellen terwijl het systeem actief is. Als u de
demodatabase gebruikt, moet u ArchivesSpace afsluiten voordat u dit script
uitvoert.
