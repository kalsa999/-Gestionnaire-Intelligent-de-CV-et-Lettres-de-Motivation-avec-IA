# Générateur de Lettres de Motivation avec IA

Application web full-stack qui génère des lettres de motivation personnalisées grâce à l'IA (OpenAI). L'utilisateur crée un profil candidat, renseigne le poste et l'entreprise visés, et reçoit une lettre rédigée automatiquement.

---

## Stack technique

| Côté | Technologies |
|------|-------------|
| Backend | Node.js, Express, Prisma, MySQL |
| Frontend | React 19, Vite, React Router, Axios |
| IA | OpenAI API |
| Base de données | MySQL 8 (via Docker) |

---

## Prérequis

- [Node.js](https://nodejs.org) v18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (pour MySQL)
- Une clé API OpenAI ([platform.openai.com](https://platform.openai.com/api-keys))

---

## Installation

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd project-lettre-de-motivation-ai
```

### 2. Configurer le backend

```bash
cd backend
cp .env.example .env
```

Modifier `.env` avec vos valeurs :

```env
DATABASE_URL="mysql://root@localhost:3306/lettre_db"
OPENAI_API_KEY=sk-...
JWT_SECRET=une_longue_chaine_aleatoire
JWT_REFRESH_SECRET=une_autre_longue_chaine_aleatoire
```

Installer les dépendances :

```bash
npm install
```

### 3. Configurer le frontend

```bash
cd ../frontend
cp .env.example .env
npm install
```

---

## Démarrage

### 1. Lancer la base de données (Docker)

```bash
cd backend
docker-compose up -d
```

### 2. Appliquer les migrations Prisma

```bash
npm run db:migrate
```

### 3. Démarrer le backend

```bash
npm run dev
# API disponible sur http://localhost:3000
```

### 4. Démarrer le frontend (dans un autre terminal)

```bash
cd frontend
npm run dev
# Interface disponible sur http://localhost:5173
```

---

## Scripts disponibles

### Backend (`/backend`)

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarre en mode développement (nodemon) |
| `npm start` | Démarre en mode production |
| `npm run db:migrate` | Applique les migrations de la base de données |
| `npm run db:studio` | Ouvre Prisma Studio (interface BDD) |
| `npm run db:generate` | Régénère le client Prisma |

### Frontend (`/frontend`)

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarre le serveur de développement Vite |
| `npm run build` | Compile pour la production |
| `npm run preview` | Prévisualise le build de production |

---

## Structure du projet

```
├── backend/
│   ├── src/
│   │   ├── controllers/   # Logique des routes
│   │   ├── services/      # Logique métier (IA, auth, lettres)
│   │   ├── routes/        # Définition des endpoints
│   │   ├── middlewares/   # Auth, validation, erreurs
│   │   └── utils/         # Helpers, logger
│   ├── prisma/            # Schéma et migrations BDD
│   └── docker-compose.yml # MySQL Docker
│
└── frontend/
    └── src/
        ├── pages/         # Pages de l'application
        ├── components/    # Composants réutilisables
        ├── api/           # Appels HTTP vers le backend
        └── context/       # Gestion de l'authentification
```

---

## Fonctionnalités

- Inscription / Connexion avec JWT
- Création et gestion de profils candidat (compétences, expérience, formation)
- Génération de lettres de motivation via OpenAI
- Historique des lettres générées
- Interface responsive

---

## Sécurité

- Ne jamais committer le fichier `.env`
- Renouveler régulièrement la clé OpenAI et les secrets JWT
- Le fichier `.env` doit être présent dans `.gitignore`

