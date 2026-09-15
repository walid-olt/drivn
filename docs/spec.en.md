# Product & Technical Specification: Unified Car Rental Marketplace (MVP)

---

## 1. Executive summary & core objectives

### 1.1 problem statement

Local car rental agencies frequently operate without a dedicated digital presence or rely on rigid, poorly optimized website templates. this fragmentation reduces market visibility for agencies and forces consumers to navigate disjointed channels to compare and reserve vehicles.

### 1.2 solution

A unified, multi-tenant b2b2c marketplace that standardizes the rental process. small and mid-sized agencies get a dedicated dashboard to manage and list their fleets, while customers gain access to a centralized portal to search, compare, and request vehicle reservations.

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

- **client tier:** single page application (spa) utilizing a role-based router layout (public, renter, agency admin).
- **application tier:** modular express API.
- **data tier:** cloud hosted mongodb instance managed via mongoose ODM.

## 3. Core functionalities

### Customer portal

- Email/password authentication.
- Email verification.
- Car search and filtering by make, model, year, price, and location.
- Reservation request submission with date and time selection.
- Reservation status tracking (pending, approved, rejected).
- Email notifications for reservation status updates.

### Agency dashboard

- Email/password authentication.
- Email verification.
- Onboarding flow for agency branding, support contact, and operating locations.
- Organization management (add/remove members).
- Fleet management (add/remove vehicles, update vehicle details).
- Reservation management (view incoming requests, approve/reject reservations).
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
