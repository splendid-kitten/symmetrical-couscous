# symmetrical-couscous
Petit devoir à réaliser dans le cadre d'une entrevue technique avec Propulso.

## Objectifs

Le but est d'extraire les métriques suivantes à partir d'un jeu de donneés de déplacement:
- Le nombre de visite par jours;
- Le nombre de visiteurs par jours;
- La durée moyenne des visites;

Les données contiennent les informations suivantes:
- Un identifiant unique;
- Latitude;
- Longitude;
- Delta de temps (correspond au nombre de secondes où la personne a été vue avant/après être captée dans la zone);
    - \> 0 indique que le signal a été reçu avant que la personne ait été captée dans la zone;
    - < 0 indique que le signal a été reçu après que la personne ait été captée dans la zone;
    - 0 indique que le signal a été reçu quand la personne était dans la zone;
- Date de la visite;
- Heure de la visite.

Il faut réaliser les calcules demandés et afficher les résultats dans un projet __[VueJS](https://vuejs.org/)__. Il n'y a pas d'autre consigne autre que de laisser la créativité faire son travail.



Variables d'environnement
``` powershell
netlify env:set MONGODB_URI mongodb://localhost:27017/symmetrical-couscous
netlify env:set MONGODB_COLLECTION_GEOLOC geolocData
netlify env:set MONGODB_COLLECTION_VISIT visitData
```