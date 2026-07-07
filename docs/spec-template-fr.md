# Cahier des Charges

**Projet Fil Rouge — Application Full-Stack MERN**

|                        |                          |
| ---------------------- | ------------------------ |
| **Nom du projet**      | _[Nom de l'application]_ |
| **Auteur**             | _[Votre nom]_            |
| **Date de rédaction**  | _[JJ/MM/AAAA]_           |
| **Version**            | 1.0                      |
| **Date de soumission** | 25/09/2026               |
| **Soutenance**         | à partir du 28/09/2026   |

---

## 1. Présentation du projet

### 1.1 Contexte

_Décrivez le domaine d'application (FinTech, EdTech, e-commerce, gestion, réservation, etc.) et pourquoi ce sujet a été choisi._

### 1.2 Problématique

_Quel problème réel ou simulé l'application résout-elle ? Quel est le besoin métier identifié ?_

### 1.3 Objectifs

_Objectifs mesurables et concrets du projet, ex :_

- Permettre à l'utilisateur de...
- Automatiser...
- Sécuriser...

### 1.4 Public cible

_Qui utilisera l'application ? (particuliers, professionnels, administrateurs, etc.)_

---

## 2. Utilisateurs et cas d'usage

### 2.1 Types d'utilisateurs / rôles

| Rôle                   | Description | Permissions principales |
| ---------------------- | ----------- | ----------------------- |
| Visiteur               | _..._       | _..._                   |
| Utilisateur (user)     | _..._       | _..._                   |
| Administrateur (admin) | _..._       | _..._                   |

### 2.2 User stories principales

_Format : En tant que [rôle], je veux [action] afin de [bénéfice]._

- En tant que _[rôle]_, je veux _[action]_ afin de _[objectif]_.
- En tant que _[rôle]_, je veux _[action]_ afin de _[objectif]_.
- En tant que _[rôle]_, je veux _[action]_ afin de _[objectif]_.
- _(ajouter autant de user stories que nécessaire)_

---

## 3. Fonctionnalités

### 3.1 Fonctionnalités principales

1. _Authentification (inscription, connexion, JWT)_
2. _Gestion des rôles (user / admin)_
3. _CRUD principal de la ressource métier_
4. _..._

### 3.2 Fonctionnalités secondaires

1. _Recherche / filtres_
2. _Notifications_
3. _Statistiques / tableau de bord_
4. _..._

### 3.3 Hors périmètre (out of scope)

_Ce que l'application ne fera pas dans cette version, pour cadrer les attentes._

---

## 4. Architecture et choix techniques

### 4.1 Architecture globale

_Schéma ou description : client (Web/Mobile) ↔ API REST ↔ Base de données._

### 4.2 Stack technique

**Backend**

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (authentification)
- bcrypt (hachage des mots de passe)
- Joi / Express-validator (validation)
- Middlewares (auth, roles, gestion d'erreurs centralisée)

**Frontend** _(choisir une option)_

- **Option 1 – Web** : React.js, React Router, Axios/React Query, Context API ou Redux Toolkit
- **Option 2 – Mobile** : React Native (Expo), Navigation (stack/tab), Axios/React Query, AsyncStorage + Context API

**DevOps / Industrialisation**

- Docker + Docker Compose
- GitHub Actions (CI)
- Variables d'environnement (.env)
- Jest + Supertest (tests)

### 4.3 Justification des choix techniques

_Pourquoi ces choix (et éventuels écarts par rapport au cadre imposé) ? Justifiez toute déviation technique._

### 4.4 Organisation du code (architecture modulaire)

```
backend/
  ├── routes/
  ├── controllers/
  ├── services/
  ├── models/
  ├── middlewares/
  └── config/

frontend/
  ├── components/
  ├── pages/
  ├── context/ (ou store/)
  ├── services/ (appels API)
  └── routes/
```

---

## 5. Modélisation

### 5.1 Diagramme de cas d'utilisation (Use Case)

_[Insérer le diagramme UML]_

### 5.2 Diagramme de classes

_[Insérer le diagramme UML]_

### 5.3 Modèle de données (schémas Mongoose)

| Collection    | Champs principaux            | Relations |
| ------------- | ---------------------------- | --------- |
| Users         | _email, password, role, ..._ | _..._     |
| _[Ressource]_ | _..._                        | _..._     |

---

## 6. Spécification de l'API REST

| Méthode | Endpoint               | Description | Auth requise | Rôle       |
| ------- | ---------------------- | ----------- | ------------ | ---------- |
| POST    | `/api/auth/register`   | Inscription | Non          | -          |
| POST    | `/api/auth/login`      | Connexion   | Non          | -          |
| GET     | `/api/[ressource]`     | Lister      | Oui/Non      | -          |
| POST    | `/api/[ressource]`     | Créer       | Oui          | user/admin |
| PUT     | `/api/[ressource]/:id` | Modifier    | Oui          | user/admin |
| DELETE  | `/api/[ressource]/:id` | Supprimer   | Oui          | admin      |

---

## 7. Sécurité

- Hachage des mots de passe (bcrypt)
- Authentification par JWT (durée de vie, refresh token éventuel)
- Protection des routes selon les rôles
- Validation des données entrantes (Joi / express-validator)
- Gestion centralisée des erreurs et des logs
- Variables sensibles hors du code source (.env)

---

## 8. Tests

| Type                | Outils           | Cible                            |
| ------------------- | ---------------- | -------------------------------- |
| Tests unitaires     | Jest             | Logique métier (services, utils) |
| Tests d'intégration | Jest + Supertest | Endpoints API                    |

---

## 9. Conteneurisation & CI/CD

- **Dockerfile** pour l'API
- **docker-compose.yml** (API + MongoDB)
- **GitHub Actions** : pipeline CI (lint, tests, build) déclenché sur push/PR
- Gestion des environnements : `dev`, `test`, `prod`

---

## 10. Déploiement

| Élément         | Plateforme envisagée       |
| --------------- | -------------------------- |
| Backend         | _Render / Railway / autre_ |
| Frontend        | _Vercel / autre_           |
| Base de données | _MongoDB Atlas_            |

_Lien de déploiement final : [à compléter]_

---

## 11. Livrables

- [ ] Cahier des charges (PDF)
- [ ] Diagrammes UML (Use Case + Diagramme de classes)
- [ ] Code source (GitHub, frontend + backend)
- [ ] Dockerfile + docker-compose.yml
- [ ] Pipeline CI (GitHub Actions)
- [ ] Documentation technique (README : installation, configuration, utilisation, endpoints API)
- [ ] Lien de déploiement

---

## 12. Planning prévisionnel

| Phase                                | Période | Livrable associé                |
| ------------------------------------ | ------- | ------------------------------- |
| Conception (cahier des charges, UML) | _..._   | Cahier des charges + diagrammes |
| Développement Backend                | _..._   | API fonctionnelle               |
| Développement Frontend               | _..._   | Interfaces connectées           |
| Intégration & tests                  | _..._   | Tests unitaires/intégration     |
| Dockerisation & CI/CD                | _..._   | Pipeline fonctionnel            |
| Déploiement & documentation          | _..._   | Application en ligne + README   |

_Lancement : 23/06/2026 — Semaines de réalisation : 07/09/2026 au 25/09/2026 — Soumission : 25/09/2026_

---

## 13. Critères de performance / évaluation

- Architecture backend propre et modulaire
- API REST fonctionnelle et sécurisée
- Authentification et rôles correctement gérés (JWT)
- Qualité des validations et gestion des erreurs
- Intégration frontend/backend fluide
- Utilisation correcte de MongoDB et Mongoose
- Conteneurisation fonctionnelle (Docker + Compose)
- Tests unitaires et d'intégration pertinents
- Pipeline CI fonctionnel
- Application déployée et accessible
- Documentation claire et exploitable
