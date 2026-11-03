---
title: Sjabloon voor een JMeter-testgroep
description: Instructies voor het maken van een JMeter-testgroep.
---

## Een testgroep maken:

Laad het bestand 'example_test_plan.jmx' in JMeter en zorg ervoor dat aan de volgende voorwaarden wordt voldaan om het voorbeeld correct uit te voeren:

- De backend draait op localhost-poort 4567
- Er is ten minste één collectiebeherende instelling, met als URL /repositories/2

Het voorbeeld meldt zich aan bij de backend, slaat de sessiesleutel op als JMeter-variabele en voert twee eenvoudige verzoeken uit, waarvan er één een sessiesleutel vereist.
