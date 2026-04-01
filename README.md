# POUR LANCER LE PROJET

## Étapes

- Renommer tout les .env.example en .env (c'est-à-dire à la racine, dans frontend et backend)

- Faire matcher les mots de passes du .env à la racine et celui dans le dossier backend

- Créer une APP_SECRET pour le .env du backend en lançant la commande `openssl rand -base64 32` dans le terminal

- Lancer le backend avec la commande docker compose up --build -d

- Dans le dossier backend, lancer la commande `docker exec -it backend npx prisma migrate deploy`

- Dans le dossier frontend faire `npm install` et `npm run dev` pour le lancer (directement sur la machine et pas dans docker)

- Se rendre sur http://localhot:3000, s'inscrire et se connecter (créer trois comptes différents pour tester les discussions privées et les groupes)
