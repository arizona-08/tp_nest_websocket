# POUR LANCER LE PROJET

## Étapes

- Renommer tout les .env.example en .env (c'est-à-dire à la racine, dans frontend et backend)

- Faire matcher les mots de passes du .env à la racine et celui dans le dossier backend

- Créer une APP_SECRET pour le .env du backend en lançant la commande `openssl rand -base64 32` dans le terminal

- Lancer le backend avec la commande docker compose up --build -d

- Se rendre sur http://localhot:3000, s'inscrire et se connecter (créer trois comptes différents pour tester les discussions privées et les groupes)


## Bugs potentiel

### Avec nextjs

Il se peut que le frontend charge indéfiniement au lancement de l'application. Si ça arrive, supprimez les dossiers .next et node_modules, relancez la commande npm install dans le dossier frontend et enfin relancez la commande npm run dev. si rien de tout ça marche, redémarrez votre ordinateur et refaites les étapes précédentes.


### Avec nestjs

Vérifiez bien que vos .env.example soient renommés en .env et que les variables essentielles y sont et remplies correctement et que les valeurs des variables partagées entre la racine du projet et celles du backend soient les mêmes.