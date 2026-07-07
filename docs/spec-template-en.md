# Project Specification (Cahier des Charges)

**Capstone Project — Full-Stack MERN Application**

|                          |                      |
| ------------------------ | -------------------- |
| **Project name**         | _[Application name]_ |
| **Author**               | _[Your name]_        |
| **Date written**         | _[DD/MM/YYYY]_       |
| **Version**              | 1.0                  |
| **Submission deadline**  | 25/09/2026           |
| **Presentation/defense** | starting 28/09/2026  |

---

## 1. Project Overview

### 1.1 Context

_Describe the domain of the application (FinTech, EdTech, e-commerce, management, booking, etc.) and why this topic was chosen._

### 1.2 Problem statement

_What real or simulated problem does the application solve? What business need has been identified?_

### 1.3 Objectives

_Measurable, concrete project goals, e.g.:_

- Allow the user to...
- Automate...
- Secure...

### 1.4 Target users

_Who will use the application? (individuals, professionals, administrators, etc.)_

---

## 2. Users and Use Cases

### 2.1 User types / roles

| Role    | Description | Main permissions |
| ------- | ----------- | ---------------- |
| Visitor | _..._       | _..._            |
| User    | _..._       | _..._            |
| Admin   | _..._       | _..._            |

### 2.2 Main user stories

_Format: As a [role], I want [action] so that [benefit]._

- As a _[role]_, I want _[action]_ so that _[goal]_.
- As a _[role]_, I want _[action]_ so that _[goal]_.
- As a _[role]_, I want _[action]_ so that _[goal]_.
- _(add as many user stories as needed)_

---

## 3. Features

### 3.1 Core features

1. _Authentication (sign-up, login, JWT)_
2. _Role management (user / admin)_
3. _CRUD for the main business resource_
4. _..._

### 3.2 Secondary features

1. _Search / filters_
2. _Notifications_
3. _Statistics / dashboard_
4. _..._

### 3.3 Out of scope

_What the application will NOT do in this version, to set clear expectations._

---

## 4. Architecture and Technical Choices

### 4.1 Global architecture

_Diagram or description: client (Web/Mobile) ↔ REST API ↔ Database._

### 4.2 Tech stack

**Backend**

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (authentication)
- bcrypt (password hashing)
- Joi / Express-validator (validation)
- Middlewares (auth, roles, centralized error handling)

**Frontend** _(choose one option)_

- **Option 1 – Web**: React.js, React Router, Axios/React Query, Context API or Redux Toolkit
- **Option 2 – Mobile**: React Native (Expo), Navigation (stack/tab), Axios/React Query, AsyncStorage + Context API

**DevOps / Industrialization**

- Docker + Docker Compose
- GitHub Actions (CI)
- Environment variables (.env)
- Jest + Supertest (testing)

### 4.3 Justification of technical choices

_Why these choices (and any deviations from the imposed framework)? Justify any technical deviation._

### 4.4 Code organization (modular architecture)

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
  ├── context/ (or store/)
  ├── services/ (API calls)
  └── routes/
```

---

## 5. Modeling

### 5.1 Use Case Diagram

_[Insert UML diagram]_

### 5.2 Class Diagram

_[Insert UML diagram]_

### 5.3 Data model (Mongoose schemas)

| Collection   | Main fields                  | Relationships |
| ------------ | ---------------------------- | ------------- |
| Users        | _email, password, role, ..._ | _..._         |
| _[Resource]_ | _..._                        | _..._         |

---

## 6. REST API Specification

| Method | Endpoint              | Description | Auth required | Role       |
| ------ | --------------------- | ----------- | ------------- | ---------- |
| POST   | `/api/auth/register`  | Register    | No            | -          |
| POST   | `/api/auth/login`     | Login       | No            | -          |
| GET    | `/api/[resource]`     | List        | Yes/No        | -          |
| POST   | `/api/[resource]`     | Create      | Yes           | user/admin |
| PUT    | `/api/[resource]/:id` | Update      | Yes           | user/admin |
| DELETE | `/api/[resource]/:id` | Delete      | Yes           | admin      |

---

## 7. Security

- Password hashing (bcrypt)
- JWT-based authentication (token lifetime, optional refresh token)
- Route protection based on user roles
- Input validation (Joi / express-validator)
- Centralized error handling and logging
- Sensitive variables kept out of source code (.env)

---

## 8. Testing

| Type              | Tools            | Target                           |
| ----------------- | ---------------- | -------------------------------- |
| Unit tests        | Jest             | Business logic (services, utils) |
| Integration tests | Jest + Supertest | API endpoints                    |

---

## 9. Containerization & CI/CD

- **Dockerfile** for the API
- **docker-compose.yml** (API + MongoDB)
- **GitHub Actions**: CI pipeline (lint, tests, build) triggered on push/PR
- Environment management: `dev`, `test`, `prod`

---

## 10. Deployment

| Component | Planned platform           |
| --------- | -------------------------- |
| Backend   | _Render / Railway / other_ |
| Frontend  | _Vercel / other_           |
| Database  | _MongoDB Atlas_            |

_Final deployment link: [to be completed]_

---

## 11. Deliverables

- [ ] Project specification (PDF)
- [ ] UML diagrams (Use Case + Class Diagram)
- [ ] Source code (GitHub, frontend + backend)
- [ ] Dockerfile + docker-compose.yml
- [ ] CI pipeline (GitHub Actions)
- [ ] Technical documentation (README: installation, configuration, usage, API endpoints)
- [ ] Deployment link

---

## 12. Timeline

| Phase                      | Period | Associated deliverable    |
| -------------------------- | ------ | ------------------------- |
| Design (spec, UML)         | _..._  | Specification + diagrams  |
| Backend development        | _..._  | Functional API            |
| Frontend development       | _..._  | Connected interfaces      |
| Integration & testing      | _..._  | Unit/integration tests    |
| Dockerization & CI/CD      | _..._  | Working pipeline          |
| Deployment & documentation | _..._  | Live application + README |

_Kickoff: 23/06/2026 — Build weeks: 07/09/2026 to 25/09/2026 — Submission: 25/09/2026_

---

## 13. Evaluation Criteria

- Clean, modular backend architecture
- Functional, secure REST API
- Properly managed authentication and roles (JWT)
- Quality of validation and error handling
- Smooth frontend/backend integration
- Correct use of MongoDB and Mongoose
- Functional containerization (Docker + Compose)
- Relevant unit and integration tests
- Working CI pipeline
- Deployed and accessible application
- Clear, usable documentation
