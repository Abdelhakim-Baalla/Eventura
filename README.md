# 📝 Guide de Documentation Technique : Eventura

## 1. Présentation du Projet

**Nom :** Eventura

**Objectif :** Plateforme de gestion d'événements et de réservations avec gestion des capacités en temps réel et ticketing PDF sécurisé.

**Stack Technique :**

- **Frontend :** Next.js 15 (App Router), TypeScript, Tailwind CSS.
- **Backend :** NestJS, PostgreSQL (TypeORM), JWT Auth.
- **DevOps :** Docker, Docker Compose, GitHub Actions.

## 2. Architecture Logicielle

**Structure Monorepo :** Le projet est organisé avec un dossier `/frontend` et un dossier `/backend` pour simplifier la gestion des environnements.

**Modèle de Données :** Utilisation de PostgreSQL pour garantir l'atomicité des transactions (ACID) lors des réservations concurrentes.

**Gestion des Rôles (RBAC) :** Trois niveaux d'accès : `PARTICIPANT`, `ADMIN` et `SUPER_ADMIN`.

## 3. Règles Métier Implémentées

**Cycle de vie des événements :** Seuls les événements au statut `PUBLIE` sont visibles par les participants.

**Validation des réservations :**

- Interdiction de dépasser la `capaciteMax` (Transaction SQL `SELECT FOR UPDATE`).
- Un participant ne peut réserver qu'une seule fois un même événement.

**Ticketing :** Le téléchargement du ticket PDF n'est autorisé que si la réservation est `CONFIRMEE` par un administrateur.

## 4. Guide d'Installation (Docker)

Pour lancer l'environnement complet en une commande :

1. Cloner le projet.
2. Copier le fichier `.env.example` vers `.env`.
3. Lancer les services :

```bash
docker-compose up --build -d
```

**Accès :**

- **App Frontend :** http://localhost:3000
- **API Backend :** http://localhost:3000/api
- **Adminer (BDD) :** http://localhost:8080

## 5. Pipeline CI/CD

Le projet inclut une automatisation GitHub Actions qui valide chaque commit :

**Jobs :** Linting, Tests unitaires (Jest), Build de validation.
