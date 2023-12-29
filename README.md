# symmetrical-couscous

Petit devoir à réaliser dans le cadre d'une entrevue technique avec Propulso. La présente solution permet de prétraiter des données de géolocalisation afin de visualiser certaines métriques dans un interface en __[VueJS](https://vuejs.org/)__.

Le répertoire suivant contient les différents éléments de la solution et le CI est configurer afin d'aider au développement. 

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

## Utilisation de la solution
Installer Docker

Installer les dépendances

Configurer les variables d'environnement
``` powershell
netlify env:set MONGODB_URI mongodb://localhost:27017/symmetrical-couscous
netlify env:set MONGODB_COLLECTION_GEOLOC geolocData
netlify env:set MONGODB_COLLECTION_VISIT visitData
```

Lancer la DB

Générer les visites

Updater le UI

## Développement

La section suivante détaille les différents éléments et logiques de la solution.

### Technologies
Le projet est composée d'un interface développé avec __[VueJS](https://vuejs.org/)__ et en utilisant les éléments de UI de __[PrimeVue](https://primevue.org/)__. Le backend est composé de _serverless functions_ de __[Netlify](https://www.netlify.com/)__ avec pour but de se servir de ce dernier dans l'optique d'un déploiement en production. Les données sont stockées dans une base de données __[MongoDB](https://www.mongodb.com/fr-fr)__ qui est utilisée dans le projet avec l'ODM __[Mongoose](https://mongoosejs.com/)__. Durant le développement, le tout est déployé dans __[Docker Desktop](https://www.docker.com/products/docker-desktop/)__ à l'aide de __[Docker-Compose](https://docs.docker.com/compose/)__.

### Github Actions

en exécutant le linter et les tests dans le projet. Les runners de mon organisation (splendid-kitten) sont actifs sur mon propre serveur.

### Traitement des données

Afin de pouvoir m'amuser avec les technologies, j'ai réalisé le traitement des données à l'aide d'une fonction serverless. Je suis conscient qu'il y a d'autre façons de gérer les données brutes utilisées par le système, mais  

Celle-ci récupère la collection de données correspondant aux données initiales du problème en les triant selon le temps.

Ainsi, une visite débute dès le premier ping où le delta est de 0 et se termine dès qu'un ping avec delta différent est reçu pour le même propulso_id. En effet, la personne peut avoir terminé sa visite bien avant le ping avec un delta différent, je n'ai pas des pings assez rapprochées pour avoir une meilleure précision.

S'il n'y a qu'un seul ping avec un delta de 0 et un ping suivant avec un delta de -60, la visite peut avoir durée entre 0 et 60 secondes. 

Une visite est donc composée de la façon suivante:
``` JSON 
{
  "propulso_id": <propulso_id>,
  "lat": <latitude moyenne>,
  "lng": <longitude moyenne>,
  "start_time": "hh:mm:ss",
  "end_time": "hh:mm:ss",
  "date": "yyyy-mm-dd",
  "pingCount": <Nombre de ping composant la visite>,
  "duration": <Durée en secondes>
}
```

Chaque visite est ensuite envoyé dans la base de données dans une nouvelle collection qui sera utilisée pour mettre à jour le UI.





