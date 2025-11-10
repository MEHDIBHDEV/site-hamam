# Hammam – Frontend & Backend

Ce dépôt contient désormais :

- **Frontend** React/Vite (dossier racine) pour l’expérience client.
- **Backend** Node/Express (dossier `backend/`) connecté à MySQL en suivant le schéma `hammam.sql`.

## Mise en route

### 1. Base de données

1. Importer `hammam.sql` dans votre serveur MySQL.
2. Créer un utilisateur avec droits d’écriture sur la base `hammam`.

### 2. Backend

```bash
cd backend
cp .env.example .env        # adapter DB_HOST, DB_USER, etc.
npm install                 # déjà effectué ici, à refaire si nécessaire
npm run dev                 # lance l’API sur http://localhost:4000
```

Variables importantes :

- `DB_*` : connexion MySQL
- `JWT_SECRET` : clé de signature des tokens
- `CLIENT_URL` : origine autorisée pour le CORS (ex: http://localhost:5173)

### 3. Frontend

Créer un fichier `.env` à la racine avec :

```
VITE_API_URL=http://localhost:4000/api
```

Puis :

```bash
npm install        # si ce n’est pas déjà fait
npm run dev        # http://localhost:5173
```

Le frontend consomme automatiquement les services exposés par l’API (auth, réservations, services, logs).

## Endpoints principaux

- `POST /api/auth/register | login | logout | me`
- `GET /api/services`
- `GET/POST/PATCH /api/reservations`
- `POST /api/logs` (télémétrie depuis le frontend)

Les mots de passe sont hachés (bcrypt), les sessions stockées en base et exposées via un JWT. Les réservations appliquent les contraintes du schéma (`services`, `reservations`, `sessions`, `log_events`).
