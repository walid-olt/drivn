# Product & Technical Specification: Agency Rental CRM (MVP)

---

## 1. Executive summary & core objectives

### 1.1 problem statement

Local car rental agencies frequently operate without a dedicated operational system, which creates fragmented fleet, renter, and reservation workflows.

### 1.2 solution

A unified, multi-tenant B2B CRM that standardizes rental operations. Small and mid-sized agencies get a dedicated workspace to manage fleets, locations, renter records, and reservations.

### 1.3 use cases

![use-case-diagram](./drivn-[use-case].svg)

### 1.4 MVP scope guardrails

- **no online payments:** reservations use an approval-based system. financial transactions occur offline (cash/card at counter) during car pickup.

---

## 2. system architecture & directory structure

The system uses a unified **turborepo monorepo** architecture to enforce compile-time type safety across the entire application ecosystem, allowing the client and api to share validation contracts directly.

### 2.1 workspace blueprint

```text
├── apps/
│   ├── client/               # frontend: react + vite + tailwind css + shadcn/ui
│   └── api/                  # backend: express (modular architecture) + mongoose
├── packages/
│   └── shared/               # shared types, schemas, domain rules, permissions and validation contracts
```

### 2.2 system topography

- **client tier:** single page application (SPA) with public and agency CRM routes.
- **application tier:** modular express API.
- **data tier:** cloud hosted mongodb instance managed via mongoose ODM.

## 3. Core functionalities

### Agency CRM

- Email/password authentication.
- Email verification.
- Renter records with contact details.
- Reservation creation with date and time selection.
- Reservation status tracking (pending, approved, rejected).
- Email notifications for reservation status updates.

### Agency dashboard

- Email/password authentication.
- Email verification.
- Onboarding flow for agency branding, support contact, and operating locations.
- Organization management (add/remove members).
- Fleet management (add/remove vehicles, update vehicle details).
- Reservation management (view reservations, approve/reject reservations).
- Email notifications for new reservation requests and status updates.

### 4. Technical specifications

- **Frontend:** React, Vite, Tailwind CSS, Shadcn/UI.
- **State Management:** React Query for data fetching and caching, Zustand for local state management.
- **Backend:** Express.js, Mongoose, Better-auth for authentication, Resend for email notifications.
- **Database:** MongoDB (cloud-hosted), Mongoose ODM for schema management and data validation.
- **shared package:** TypeScript interfaces, validation schemas, domain rules, and permission contracts to ensure consistency across client and server.
- **deployment:** Vercel for frontend, Render for backend, MongoDB Atlas for database hosting.
- **documentation:** Swagger for API documentation.
- **testing:**: Vitest and Supertest for unit and integration testing.
