# POUR LANCER LE PROJET

## Étapes

- Renommer tout les .env.example en .env (c'est-à-dire à la racine, dans frontend et backend)

- Faire matcher les mots de passes du .env à la racine et celui dans le dossier backend

- Créer une APP_SECRET pour le .env du backend en lançant la commande `openssl rand -base64 32` dans le terminal

- Lancer le backend avec la commande docker compose up --build -d

- Se rendre sur http://localhot:3000, s'inscrire et se connecter (créer trois comptes différents pour tester les discussions privées et les groupes)


## Bugs potentiel

### Avec Nextjs

Il se peut que l'application soit très lente en mode dev dans docker. 

Si c'est le cas:

  - Supprimez les conteneurs de l'application avec `docker compose down`

  - Commentez le service frontend dans *docker-compose.yml*

  - Relancez la stack docker

  - Dans le dossier frontend lancez la commande `sudo rm -rf node_modules ./.next`

  - Dans le dossier frontend installez les dépendances avec `npm i`

  - Dans le dossier frontend, lancez l'application front avec `npm run dev`

### Avec Nestjs

Vérifiez bien que vos .env.example soient renommés en .env et que les variables essentielles y sont et remplies correctement et que les valeurs des variables partagées entre la racine du projet et celles du backend soient les mêmes.