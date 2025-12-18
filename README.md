# Site Hammam – Run Local

Monorepo contenant le frontend React/Vite (racine) et l'API Express/TypeScript (`backend/`) connectée à MySQL. Cette fiche décrit la procédure la plus rapide pour relancer le projet sur Windows + WAMP/phpMyAdmin.

## 1. Prérequis
- Node.js 18+ et npm 10+ installés globalement.
- WAMP (ou MySQL 8.x équivalent) démarré avec accès phpMyAdmin.
- Le fichier `backend/hammam.sql` présent dans le repo (dump complet).

## 2. Base de données (WAMP/phpMyAdmin)
1. Lancer WAMP et ouvrir phpMyAdmin sur `http://localhost/phpmyadmin`.
2. Créer une base `hammam` en `utf8mb4_general_ci`.
3. Onglet **Importer** → sélectionner `backend/hammam.sql` → Exécuter.
4. (Optionnel) Créer un utilisateur MySQL dédié et lui donner `ALL PRIVILEGES` sur `hammam`.

## 3. Backend `.env`
Créer `backend/.env` (non versionné) en adaptant les valeurs WAMP :

```ini
PORT=4000
NODE_ENV=development
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root            # ou l'utilisateur créé à l'étape 2
DB_PASSWORD=root        # idem
DB_NAME=hammam
JWT_SECRET=remplacer-par-une-longue-chaine
SESSION_TTL_HOURS=168
# Plusieurs origines possibles, séparées par une virgule
CLIENT_URL=http://localhost:5173,http://localhost:5174
```

Le serveur Express autorise n’importe quel `http://localhost:*` lorsqu’il tourne en `NODE_ENV=development`, mais la variable `CLIENT_URL` reste utile pour les autres environnements.

## 4. Frontend `.env`
Créer `./.env` à la racine :

```ini
VITE_API_URL=http://localhost:4000/api
```

Si vous déployez l’API ailleurs, adaptez simplement cette URL (le code supprime automatiquement le `/` final et retombe sur `http://localhost:4000/api` si la variable est absente).

## 5. Installation des dépendances
```powershell
# depuis la racine du projet
npm install
cd backend
npm install
```

## 6. Lancement en développement
```powershell
# Terminal 1 : API
cd backend
npm run dev      # http://localhost:4000

# Terminal 2 : Frontend
cd ..\           # revenir à la racine si besoin
npm run dev      # Vite annonce le port (5173, 5174, ...)
```

### Vérifications rapides
- `http://localhost:4000/api/health` doit retourner `{"status":"ok",...}` (curl ou navigateur).
- `http://localhost:4000/api/services` renvoie la liste des services.
- Dans Vite (`http://localhost:5173` par défaut) :
  - `/account` ou `/compte` : inscription + connexion fonctionnent (POST `/api/auth/register|login`).
  - La section “Services” charge les données API (le store retombe sur les données `fallbackServices` uniquement si l’API est off).
  - Les logs front (`POST /api/logs`) n’empêchent pas l’UI ; ils sont acceptés même sans jeton.

## 7. Dépannage éclair
- **CORS / écran blanc** : vérifier `CLIENT_URL` (plusieurs origins séparées par des virgules) et que le backend tourne bien sur le port affiché.
- **`ECONNREFUSED` dans la console front** : l’API n’est pas démarrée ou `VITE_API_URL` pointe vers une mauvaise URL.
- **Erreurs MySQL** : confirmer dans phpMyAdmin que la base `hammam` est importée et que l’utilisateur dispose des droits.
- **Ports Vite multiples** : aucun changement nécessaire, l’API accepte tous les `http://localhost:*` en développement.

## 8. Commandes utiles
- `npm run dev` (racine) → lance Vite.
- `npm run build` / `npm run preview` → build + preview frontend.
- `cd backend && npm run dev` → API en mode watch (tsx).
- `cd backend && npm run build && npm start` → build + exécution Node de l’API.

Ces étapes suffisent pour préparer la démo (création de compte, connexion, affichage des services et enregistrement des logs).
