# Drivn — Product Backlog

Plain-language backlog for Drivn feature work, derived from `docs/spec.en.md` and the current state of the codebase. Each item below maps to a GitHub issue (`#N`); the issue board is the live tracker, this file is the editable source of truth.

No priorities or sizes — items are ordered roughly by theme importance.

---

## Roles

| Role | Description |
|------|-------------|
| `customer` | End user who browses, compares, and reserves cars. |
| `agency_admin` | Organization member who manages fleet, locations, reservations, and their team. |

Core domain: **Agency** (public brand), **Organization** (internal team/tenant), **Car**, **Location** (pickup points), **Reservation** (approval-based — no online payments, transactions happen at pickup).

## Conventions

- Domain language matches the code: **car** (not vehicle), **reservation** (not booking), **CustomerProfile**.
- Work items are plain GitHub issues; parent issues track sub-tasks natively.
- When an item lands, close the issue and move its bullet to **Done** here.

---

## Done

- Turborepo monorepo: `apps/client` (React + React Router + Tailwind + shadcn/ui), `apps/api` (Express + Mongoose), `packages/shared` (Zod schemas + types).
- Shared schemas & types: `customerProfileSchema`, `agencySchema`, `carSchema`, `locationSchema`, `reservationSchema`, phone validation.
- Auth: email/password sign-up (customer & agency intents), sign in/out, sessions, email verification (better-auth).
- Organizations: create / list / switch / delete, invitations, roles (owner > admin > member) — covered by tests.
- Client auth journeys: login, register (customer/agency), email verification pages, protected routes with guards, agency onboarding (create agency), invite acceptance.
- Mongoose models: Profile, Agency, Car, Location, Reservation.
- Background email service (Resend-based provider, test provider for dev/test).
- CI: lint → test → build on every PR (GitHub Actions + Turbo).

## Todo

### Reservations core
- Reservation request + availability collision check (#38)
- Approve / reject requests (#39) · cancel (#40)
- Car handover → active (#41) · return & inspect → completed (#42)
- Shared reservation state machine guard (#43)
- Customer "my reservations" page (#44) · agency reservation board UI (#45)

### Fleet & locations
- Car schema validation tests (#30)
- Add a car (#31) · list & manage fleet (#32) · update/archive/delete car (#33)
- Car photos & media (#34) · fleet management UI (#35)
- Location CRUD (#36) · locations management UI (#37)

### Discovery
- Search cars with filters + availability (#46)
- Car detail page (#47) · compare prices across agencies (#48) · featured/recent listings (#49)

### Agency & profiles
- Create agency profile (#26) · public agency page (#28)
- Customer profile read-only view (#23)
- Org switcher + agency workspace shell (#24) · team management UI (#25)
- Role-based layouts & nav (#51) · active-org client state (#52)

### Platform
- Email notifications on reservation changes (#50)
- Swagger + Bruno API docs (#55)
- Deployment & environment management (#56)
- Logging middleware + rate limiting (#57)
- Dev seed script (#58)
- E2E test harness (#59)
- App permissions with CASL js (#152)

## Dropped (out of scope)

- Updating customer / agency profiles after creation (read/create only).
- Agency settings & branding management.
- Online payments.
