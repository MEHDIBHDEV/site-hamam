# Hammam API

Backend Express + MySQL pour le projet Hammam. Il expose les fonctionnalités d'authentification, de réservation et de journalisation décrites par la base SQL fournie.

## Pré-requis

- Node.js 18+
- MySQL 8+ (ou compatible)
- Base importée depuis `hammam.sql`

## Configuration

1. Copier `.env.example` vers `.env`
2. Renseigner vos identifiants MySQL et un `JWT_SECRET` robuste
3. (Optionnel) Adapter `CLIENT_URL` si le frontend tourne ailleurs que `http://localhost:5173`

## Commandes

```bash
cd backend
npm install          # déjà exécuté ici
npm run dev          # démarre l'API en mode watch (http://localhost:4000)
npm run build        # compile TypeScript vers dist/
npm start            # exécute la version compilée
```

## Endpoints clés

- `POST /api/auth/register` — inscription (nom, email, mot de passe)
- `POST /api/auth/login` — connexion, renvoie un JWT
- `POST /api/auth/logout` — invalide la session courante
- `GET /api/auth/me` — infos du profil connecté
- `GET /api/services` — liste des soins actifs
- `POST /api/reservations` — crée une réservation (auth requise)
- `GET /api/reservations` — réservations de l'utilisateur
- `PATCH /api/reservations/:id/cancel` — annule une réservation
- `POST /api/logs` — stocke un événement métiers/front

Toutes les routes `/api/reservations` et `POST /api/auth/logout` nécessitent un header `Authorization: Bearer <token>`.
