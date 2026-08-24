# Drivn — Product Backlog

Single source of truth for Drivn feature work. Derives from `docs/spec.en.md`, the ER diagram (`docs/entity-relationship.er`), the README roadmap, and the current state of the codebase.

Status legend:
- **Done** — implemented and covered by tests (verify against `apps/api/test/`).
- **Todo** — not started; ordered by Priority (P0 = MVP must-have, P1 = should, P2 = nice-to-have).

---

## 1. Roles & vocabulary

| Role | Description |
|------|-------------|
| `customer` | End user who browses, compares, and reserves cars. Also "renter" / guest before sign-in. |
| `agency_admin` | Organization member who manages fleet, bookings, locations, and agency profile. |

Core domain: **Agency** (public brand), **Organization** (internal team/tenant), **Vehicle**, **Location** (pickup points), **Booking** (approval-based reservation, no online payments).

## 2. How to edit / extend this backlog

- Each work item has a stable **ID** (`DRVN-N` for stories, `DRVN-N.M` for their tasks). Keep IDs unique.
- To add a feature: copy an existing story block, pick the next free ID, and reuse the **task templates** in section 3.
- To add a task: add a checkbox line `- [ ] DRVN-N.M …` under the story; keep tasks atomic (one deliverable each) and reusable.
- When a task lands, check the box and move the story's `Status` to `Done` once all acceptance criteria are met.
- Work items land on the board as **GitHub Issues** (see section 4); this file stays the editable source of truth.

## 3. Task templates (generic)

Reuse these building blocks so tasks stay consistent and easy to extend.

**Template A — API + shared feature**
1. Extend/define Zod schema + shared types in `packages/shared` and export from `src/index.ts`.
2. Add/update the Mongoose model + indexes in `apps/api/src/module/<area>/models/`.
3. Implement routes in `apps/api/src/module/<area>/` using the `handler` wrapper and `HttpException`s.
4. Enforce authentication + role/ownership checks (better-auth session + organization member roles).
5. Add integration tests in `apps/api/test/<area>/` (Vitest + Supertest + in-memory Mongo).
6. Document the endpoints (Swagger / Bruno collection).
7. Wire the client API layer + page/component.
8. Add loading / empty / error states and inline validation feedback in the UI.

**Template B — client-only feature**
1. Add route + role-based route guard.
2. Build the page/component with shadcn/ui + Tailwind.
3. Connect to the API via the client API layer.
4. Add loading / empty / error states.
5. Add tests (component or integration) and verify with `pnpm lint`.

**Template C — shared-only**
1. Add/extend the schema or constant in `packages/shared`.
2. Export it from `src/index.ts`.
3. Add validation tests.

**Template D — infra / platform**
1. Set up the tooling/config.
2. Wire into turbo/pnpm scripts and `.env.*` files.
3. Add CI step or script.
4. Document in the relevant `README.md`.

## 4. Adding to the task board (GitHub Issues)

The board is fed from repo issues — each story/task becomes an issue in this repo and flows onto the GitHub Project board automatically.

1. **Create an issue per work item.** Title: `<ID> — <short title>` (e.g. `DRVN-23.1 — Define booking schema + status enum in shared`). Body: copy the relevant story statement, acceptance criteria, and/or task description from this file. Use labels for area (`api`, `client`, `shared`, `auth`, `booking`, …) and `P0`/`P1`/`P2` for priority.
2. **Ensure auto-add to the project board.** In the GitHub Project, add the **"Add items from the repository"** automation or a **project workflow** (Menu → Workflows) that adds issues with matching labels to the board.
3. **Track status on the board.** Move issues through the board statuses as they progress; check off the matching tasks in this file when done.
4. **Keep this file in sync.** The markdown is the editable source of truth; the issues are the live, board-tracked mirror.

> Tip: if you later want parent/child (epic → story → task) grouping on the board, use GitHub sub-issues: create the story issue first, then create task issues with the story as parent.

---

## EPIC E1 — Accounts & Authentication

### DRVN-1 — Sign up with email + password
**Area:** `api` · **Priority:** P0 · **Size:** M · **Status:** Done · **Iteration:** — · **Labels:** `auth`, `api`

**As a** visitor, **I want** to create an account with email and password, **so that** I can request reservations and manage my profile.

**Acceptance criteria:**
- [x] Sign-up endpoint validates input (email, password length ≥ 8, name).
- [x] Invalid input returns `VALIDATION_ERROR` (400).
- [x] A user record + session are created; `emailVerified = false` initially.
- [x] Tested in `apps/api/test/auth/email-password.test.ts`.

**Tasks:**
- [x] DRVN-1.1 Configure better-auth email/password strategy (Template C, `src/lib/auth.ts`).
- [x] DRVN-1.2 Wire `/api/auth/sign-up/email` route (Template A).
- [x] DRVN-1.3 Add sign-up integration tests (Template A).

### DRVN-2 — Sign in / sign out / session
**Area:** `api` · **Priority:** P0 · **Size:** M · **Status:** Done · **Iteration:** — · **Labels:** `auth`, `api`

**As a** registered user, **I want** to sign in and sign out, **so that** my session is managed securely.

**Acceptance criteria:**
- [x] Valid credentials issue a `better-auth.session_token` cookie.
- [x] Invalid credentials return 401 `AUTH_INVALID_CREDENTIALS`.
- [x] Sign-out clears the session cookie.
- [x] Tested in `apps/api/test/auth/email-password.test.ts`.

**Tasks:**
- [x] DRVN-2.1 Expose sign-in/sign-out endpoints (Template A).
- [x] DRVN-2.2 Add sign-in/sign-out integration tests (Template A).

### DRVN-3 — Email verification & password reset
**Area:** `api` · `shared` · **Priority:** P1 · **Size:** M · **Status:** Todo · **Iteration:** — · **Labels:** `auth`, `api`

**As a** user, **I want** to verify my email and reset my password, **so that** my account is secure and recoverable.

**Acceptance criteria:**
- [ ] `requireEmailVerification` can be enabled without breaking existing flows.
- [ ] Verification email with a token is sent; token has expiry.
- [ ] Password reset flow (request → email → set new password).
- [ ] Tests for token expiry and invalid-token handling.

**Tasks:**
- [ ] DRVN-3.1 Enable/configure email verification in better-auth (Template C).
- [ ] DRVN-3.2 Implement password reset endpoints (Template A).
- [ ] DRVN-3.3 Add email-sending hook (depends on EPIC E9) (Template D).
- [ ] DRVN-3.4 Add tests (Template A).

### DRVN-4 — Client auth pages (login / signup / logout)
**Area:** `client` · **Priority:** P0 · **Size:** M · **Status:** Todo · **Iteration:** — · **Labels:** `auth`, `client`, `ui`

**As a** visitor, **I want** login, signup, and logout screens, **so that** I can access my account from the web app.

**Acceptance criteria:**
- [ ] Signup and login forms with inline validation and error display.
- [ ] Successful login redirects to the caller (or dashboard); logout returns to home.
- [ ] Auth state (session) reflected in the nav bar (Template B).

**Tasks:**
- [ ] DRVN-4.1 Add `/login` and `/signup` routes + forms (Template B).
- [ ] DRVN-4.2 Add logout control in the header (Template B).
- [ ] DRVN-4.3 Persist auth state with Zustand + better-auth client (Template B).

### DRVN-5 — Client session wiring & protected routes
**Area:** `client` · **Priority:** P0 · **Size:** S · **Status:** Todo · **Iteration:** — · **Labels:** `auth`, `client`

**As a** signed-in user, **I want** protected routes that redirect guests to login, **so that** my data stays private.

**Acceptance criteria:**
- [ ] Route guard checks session on navigation.
- [ ] Unauthenticated access to protected routes redirects to `/login`.

**Tasks:**
- [ ] DRVN-5.1 Implement a `RequireAuth`/role guard wrapper (Template B).
- [ ] DRVN-5.2 Apply guards to renter and agency routes (depends on EPIC E10).

---

## EPIC E2 — Customer Profile

### DRVN-6 — Customer profile (read / update)
**Area:** `api` · `shared` · **Priority:** P0 · **Size:** M · **Status:** Todo · **Iteration:** — · **Labels:** `api`, `profile`, `shared`

**As a** signed-in user, **I want** to view and edit my profile (first/last name, birth date, phone, country), **so that** agencies can reach and identify me for bookings.

**Acceptance criteria:**
- [ ] `customerProfileSchema` (exists in `packages/shared`) is wired to a `profile` collection + model.
- [ ] `GET /profile` and `PUT /profile` endpoints scoped to the authenticated user.
- [ ] Phone validated with `libphonenumber-js`; birth date cannot be in the future.
- [ ] Tests for create-on-first-read and update flows.

**Tasks:**
- [ ] DRVN-6.1 Add Mongoose `Profile` model (Template A).
- [ ] DRVN-6.2 Implement profile routes + ownership checks (Template A).
- [ ] DRVN-6.3 Add profile integration tests (Template A).
- [ ] DRVN-6.4 Build the profile form UI (Template B).

---

## EPIC E3 — Organization & Team (agency workspace)

### DRVN-7 — Organization CRUD & switching
**Area:** `api` · **Priority:** P0 · **Size:** M · **Status:** Done · **Iteration:** — · **Labels:** `api`, `organization`

**As a** user, **I want** to create, list, switch between, and delete organizations, **so that** I can manage multiple agency workspaces.

**Acceptance criteria:**
- [x] Create organization makes creator `owner`.
- [x] List organizations the user belongs to; set-active switches the current one.
- [x] Delete removes the organization.
- [x] Tested in `apps/api/test/auth/organization.test.ts`.

**Tasks:**
- [x] DRVN-7.1 Enable better-auth organization plugin (Template C).
- [x] DRVN-7.2 Cover create/list/get-full/set-active/delete endpoints (Template A).
- [x] DRVN-7.3 Add organization integration tests (Template A).

### DRVN-8 — Team invitations & roles
**Area:** `api` · **Priority:** P0 · **Size:** M · **Status:** Done · **Iteration:** — · **Labels:** `api`, `organization`

**As an** organization owner/admin, **I want** to invite members and manage roles, **so that** my team can collaborate in the agency workspace.

**Acceptance criteria:**
- [x] Invite by email with a role; invitation is `pending` until accepted.
- [x] Accept/decline invitation; list members; update role; remove member; leave org.
- [x] Role permissions enforced (owner > admin > member).
- [x] Tested in `apps/api/test/auth/organization.test.ts`.

**Tasks:**
- [x] DRVN-8.1 Implement invite/accept/role/member endpoints (Template A).
- [x] DRVN-8.2 Add invitation & member management tests (Template A).

### DRVN-9 — Agency workspace & org switcher UI
**Area:** `client` · **Priority:** P0 · **Size:** L · **Status:** Todo · **Iteration:** — · **Labels:** `client`, `organization`, `ui`

**As an** organization member, **I want** an agency workspace with an organization switcher, **so that** I can work in the right agency context.

**Acceptance criteria:**
- [ ] `/dashboard` area reserved for organization members.
- [ ] Org switcher lists my organizations and persists the active one (Zustand).
- [ ] Active org drives which agency's data is shown.

**Tasks:**
- [ ] DRVN-9.1 Add org switcher component + active-org store (Template B).
- [ ] DRVN-9.2 Add agency dashboard layout shell (Template B, depends on EPIC E10).

### DRVN-10 — Team management UI
**Area:** `client` · **Priority:** P1 · **Size:** M · **Status:** Todo · **Iteration:** — · **Labels:** `client`, `organization`, `ui`

**As an** organization owner/admin, **I want** a team screen to invite and manage members, **so that** I can administer access without API calls.

**Acceptance criteria:**
- [ ] Members list with roles; invite by email.
- [ ] Change role / remove member / leave org actions with confirmation.

**Tasks:**
- [ ] DRVN-10.1 Build team management page (Template B).
- [ ] DRVN-10.2 Wire invite/role/remove actions to the API (Template B).

---

## EPIC E4 — Agency

### DRVN-11 — Create agency profile (linked to organization)
**Area:** `api` · `shared` · **Priority:** P0 · **Size:** M · **Status:** Todo · **Iteration:** — · **Labels:** `agency`, `api`, `shared`

**As an** organization owner, **I want** to create an agency profile (name, slug, support contact, address), **so that** customers can find and trust my business.

**Acceptance criteria:**
- [ ] `agencySchema` + `Agency` model (exist) exposed via `POST /agencies`.
- [ ] One agency per organization; creator must be org owner.
- [ ] Slug uniqueness + format validated (`/^[a-z0-9]+(?:-[a-z0-9]+)*$/`).
- [ ] Tests for creation, duplicate-slug conflict, and ownership.

**Tasks:**
- [ ] DRVN-11.1 Implement agency create route (Template A).
- [ ] DRVN-11.2 Add agency creation tests (Template A).
- [ ] DRVN-11.3 Build the "create your agency" wizard UI (Template B).

### DRVN-12 — Update agency profile
**Area:** `api` · **Priority:** P0 · **Size:** M · **Status:** Todo · **Iteration:** — · **Labels:** `agency`, `api`

**As an** organization member, **I want** to edit my agency's public profile, **so that** my info stays accurate.

**Acceptance criteria:**
- [ ] `PUT /agencies/:slug` (or by org scope) allows editing name, logo, banner, summary, support contact, address.
- [ ] Only org members (role ≥ admin for sensitive fields) can update.
- [ ] Slug change preserved/handled.

**Tasks:**
- [ ] DRVN-12.1 Implement agency update route (Template A).
- [ ] DRVN-12.2 Add update tests (Template A).
- [ ] DRVN-12.3 Build agency settings form UI (Template B).

### DRVN-13 — Public agency page
**Area:** `client` · **Priority:** P0 · **Size:** M · **Status:** Todo · **Iteration:** — · **Labels:** `agency`, `client`, `ui`

**As a** customer, **I want** to view an agency's public page, **so that** I can learn about the company and browse its fleet.

**Acceptance criteria:**
- [ ] `GET /agencies/:slug` returns public profile (+ active locations, vehicles).
- [ ] Public route `/agencies/:slug` renders brand, summary, contact, fleet preview.

**Tasks:**
- [ ] DRVN-13.1 Implement public agency lookup endpoint (Template A).
- [ ] DRVN-13.2 Build agency public page (Template B).

### DRVN-14 — Agency settings & branding UI
**Area:** `client` · **Priority:** P1 · **Size:** M · **Status:** Todo · **Iteration:** — · **Labels:** `agency`, `client`, `ui`

**As an** organization member, **I want** a settings area to manage branding and support info, **so that** I can maintain a professional storefront.

**Acceptance criteria:**
- [ ] Logo/banner upload (or URL) with preview.
- [ ] Summary, support email/phone, and address editing.

**Tasks:**
- [ ] DRVN-14.1 Build settings page sections (Template B).
- [ ] DRVN-14.2 Add image upload handling if required (Template D).

---

## EPIC E5 — Fleet (Vehicles)

### DRVN-15 — Vehicle domain model & shared schema
**Area:** `shared` · **Priority:** P0 · **Size:** M · **Status:** Todo · **Iteration:** — · **Labels:** `fleet`, `shared`

**As a** developer, **I want** a validated `Vehicle` schema/type shared by API and client, **so that** contracts stay in sync.

**Acceptance criteria:**
- [ ] Schema covers: make/model, year, category (e.g. city, sedan, suv, van), transmission, seats, doors, fuel, fuel consumption, daily rate, security deposit, license plate, status, photos, agencyId, description.
- [ ] Daily rate as currency + amount; optional deposit.
- [ ] `zod` validation exported from `packages/shared/src/index.ts`.

**Tasks:**
- [ ] DRVN-15.1 Define `vehicleSchema` + DTOs + `Vehicle` types (Template C).
- [ ] DRVN-15.2 Add validation tests (Template C).

### DRVN-16 — Add a vehicle
**Area:** `api` · **Priority:** P0 · **Size:** M · **Status:** Todo · **Iteration:** — · **Labels:** `fleet`, `api`

**As an** agency admin, **I want** to add a car to my fleet, **so that** customers can book it.

**Acceptance criteria:**
- [ ] `POST /agencies/:slug/vehicles` (or `/vehicles`) scoped to the active organization.
- [ ] Duplicate license plate rejected (409 `CONFLICT`).
- [ ] New vehicles default to `available`.
- [ ] Tests for creation, validation, and ownership.

**Tasks:**
- [ ] DRVN-16.1 Add `Vehicle` Mongoose model (Template A).
- [ ] DRVN-16.2 Implement vehicle create route (Template A).
- [ ] DRVN-16.3 Add vehicle creation tests (Template A).

### DRVN-17 — List & manage fleet (admin)
**Area:** `api` · **Priority:** P0 · **Size:** M · **Status:** Todo · **Iteration:** — · **Labels:** `fleet`, `api`

**As an** agency admin, **I want** to see my fleet with availability, **so that** I can manage inventory.

**Acceptance criteria:**
- [ ] `GET /agencies/:slug/vehicles` returns the org's vehicles with booking status per day (or availability flags).
- [ ] Pagination + basic filters (category, status).

**Tasks:**
- [ ] DRVN-17.1 Implement fleet list endpoint (Template A).
- [ ] DRVN-17.2 Add fleet list tests (Template A).

### DRVN-18 — Update / archive / delete vehicle
**Area:** `api` · **Priority:** P1 · **Size:** M · **Status:** Todo · **Iteration:** — · **Labels:** `fleet`, `api`

**As an** agency admin, **I want** to edit or retire a vehicle, **so that** my inventory stays accurate.

**Acceptance criteria:**
- [ ] `PATCH /vehicles/:id` for details/price/status; archive (soft) instead of hard delete once bookings exist.
- [ ] Cannot edit a vehicle with an active booking (409).
- [ ] Tests for each transition.

**Tasks:**
- [ ] DRVN-18.1 Implement update/archive endpoints (Template A).
- [ ] DRVN-18.2 Add update/archive tests (Template A).

### DRVN-19 — Vehicle photos & media
**Area:** `api` · `client` · **Priority:** P1 · **Size:** M · **Status:** Todo · **Iteration:** — · **Labels:** `fleet`

**As an** agency admin, **I want** to attach photos to a car, **so that** customers can see what they rent.

**Acceptance criteria:**
- [ ] Photo URLs validated as URLs; uploads (if any) go to configured storage.
- [ ] Primary photo selection; gallery order preserved.

**Tasks:**
- [ ] DRVN-19.1 Extend schema/model with photos array (Template A).
- [ ] DRVN-19.2 Add upload endpoint or URL field handling (Template D).
- [ ] DRVN-19.3 Build photo management UI (Template B).

### DRVN-20 — Fleet management UI
**Area:** `client` · **Priority:** P0 · **Size:** L · **Status:** Todo · **Iteration:** — · **Labels:** `fleet`, `client`, `ui`

**As an** agency admin, **I want** a fleet dashboard to add/edit/list vehicles, **so that** I can manage inventory from the browser.

**Acceptance criteria:**
- [ ] Fleet table with status + availability; add/edit forms (reuse DRVN-16/18 APIs).
- [ ] Inline validation and loading/empty/error states.

**Tasks:**
- [ ] DRVN-20.1 Build fleet list + create/edit pages (Template B).
- [ ] DRVN-20.2 Connect vehicle API + state (Template B).

---

## EPIC E6 — Locations

### DRVN-21 — Location CRUD
**Area:** `api` · `shared` · **Priority:** P1 · **Size:** M · **Status:** Todo · **Iteration:** — · **Labels:** `api`, `location`, `shared`

**As an** agency admin, **I want** to manage pickup/drop-off locations, **so that** customers know where to collect cars.

**Acceptance criteria:**
- [ ] `locationSchema` (exists) exposed via CRUD scoped to the organization.
- [ ] Location types: office, airport, hotel, train_station, port, other.
- [ ] `isActive` toggle controls visibility to customers.
- [ ] Tests for CRUD + ownership.

**Tasks:**
- [ ] DRVN-21.1 Add `Location` Mongoose model (Template A).
- [ ] DRVN-21.2 Implement location CRUD routes (Template A).
- [ ] DRVN-21.3 Add location tests (Template A).

### DRVN-22 — Locations management UI
**Area:** `client` · **Priority:** P2 · **Size:** M · **Status:** Todo · **Iteration:** — · **Labels:** `client`, `location`, `ui`

**As an** agency admin, **I want** a locations screen, **so that** I can manage pickup points visually.

**Acceptance criteria:**
- [ ] Locations list with type badges + active toggle; add/edit form.

**Tasks:**
- [ ] DRVN-22.1 Build locations page (Template B).

---

## EPIC E7 — Booking & Reservation Lifecycle

> The lifecycle is fully manual and agency-governed (spec §3.1):
> `none → pending → confirmed | rejected`, `confirmed → cancelled | active`, `active → completed`.

### DRVN-23 — Submit reservation request (customer) + availability check
**Area:** `api` · `shared` · **Priority:** P0 · **Size:** L · **Status:** Todo · **Iteration:** — · **Labels:** `booking`, `api`, `shared`

**As a** signed-in customer, **I want** to request a car for specific dates, **so that** the agency can review it.

**Acceptance criteria:**
- [ ] `POST /vehicles/:id/bookings` requires a signed-in customer (not a member of the vehicle's agency).
- [ ] Validates dates (start < end, start ≥ today, max duration) and pickup/drop-off location.
- [ ] Rejects overlapping pending/confirmed/active bookings for the same vehicle (availability collision).
- [ ] New booking is `pending`; holds the time window.
- [ ] Tests for success, collision, and validation.

**Tasks:**
- [ ] DRVN-23.1 Define `bookingSchema` + status enum in shared (Template C).
- [ ] DRVN-23.2 Add `Booking` Mongoose model + date-overlap query/indexes (Template A).
- [ ] DRVN-23.3 Implement booking creation + collision check (Template A).
- [ ] DRVN-23.4 Add booking creation tests (Template A).

### DRVN-24 — Approve / reject pending request
**Area:** `api` · **Priority:** P0 · **Size:** M · **Status:** Todo · **Iteration:** — · **Labels:** `booking`, `api`

**As an** agency admin, **I want** to approve or reject reservation requests, **so that** I control my car's schedule.

**Acceptance criteria:**
- [ ] `POST /bookings/:id/approve` → `confirmed` (hard-locks time block); `POST /bookings/:id/reject` → `rejected` (releases window).
- [ ] Only agency members (role ≥ admin) of the vehicle's agency can act.
- [ ] Only `pending` bookings can transition; invalid transitions return 409.
- [ ] Tests for happy path + unauthorized + invalid transition.

**Tasks:**
- [ ] DRVN-24.1 Implement approve/reject endpoints with a state-transition guard (Template A).
- [ ] DRVN-24.2 Add approve/reject tests (Template A).

### DRVN-25 — Cancel booking
**Area:** `api` · **Priority:** P0 · **Size:** M · **Status:** Todo · **Iteration:** — · **Labels:** `booking`, `api`

**As a** customer or agency admin, **I want** to cancel a confirmed booking, **so that** the car can be released for others.

**Acceptance criteria:**
- [ ] `POST /bookings/:id/cancel` allowed by the booking customer or the agency (owner/admin).
- [ ] Only `confirmed` (and optionally `pending`) can be cancelled → `cancelled`, releasing the time window.
- [ ] Tests for both actor paths and invalid transitions.

**Tasks:**
- [ ] DRVN-25.1 Implement cancel endpoint (Template A).
- [ ] DRVN-25.2 Add cancel tests (Template A).

### DRVN-26 — Vehicle handover → active
**Area:** `api` · **Priority:** P0 · **Size:** S · **Status:** Todo · **Iteration:** — · **Labels:** `booking`, `api`

**As an** agency admin, **I want** to mark a confirmed booking as "car handed over / on trip", **so that** I track the open contract.

**Acceptance criteria:**
- [ ] `POST /bookings/:id/start` → `confirmed` → `active`.
- [ ] Agency-only; the time block stays locked while active.

**Tasks:**
- [ ] DRVN-26.1 Implement start (handover) transition (Template A).
- [ ] DRVN-26.2 Add transition tests (Template A).

### DRVN-27 — Return & inspect → completed
**Area:** `api` · **Priority:** P0 · **Size:** S · **Status:** Todo · **Iteration:** — · **Labels:** `booking`, `api`

**As an** agency admin, **I want** to complete a booking on vehicle return, **so that** the car is immediately available again.

**Acceptance criteria:**
- [ ] `POST /bookings/:id/complete` → `active` → `completed`; asset marked available immediately.
- [ ] Optional return notes/fuel/condition fields (backlog-friendly: keep optional).
- [ ] Tests for completion + availability release.

**Tasks:**
- [ ] DRVN-27.1 Implement complete transition (Template A).
- [ ] DRVN-27.2 Add completion tests (Template A).

### DRVN-28 — Booking state machine enforcement
**Area:** `api` · `shared` · **Priority:** P0 · **Size:** M · **Status:** Todo · **Iteration:** — · **Labels:** `booking`, `api`, `shared`

**As a** developer, **I want** a single, reusable transition guard, **so that** invalid lifecycle moves are impossible.

**Acceptance criteria:**
- [ ] Transition map in `packages/shared` mirrors spec §3.1 (actor + allowed transitions per state).
- [ ] All booking endpoints use the guard; out-of-state actions return 409 `CONFLICT`.
- [ ] Booking queries for availability only count `pending | confirmed | active`.

**Tasks:**
- [ ] DRVN-28.1 Add booking status/transition constants + guard helper in shared (Template C).
- [ ] DRVN-28.2 Refactor DRVN-24/25/26/27 to use the guard (Template A).

### DRVN-29 — Customer reservations (list / cancel)
**Area:** `client` · `api` · **Priority:** P0 · **Size:** M · **Status:** Todo · **Iteration:** — · **Labels:** `booking`, `client`, `ui`

**As a** customer, **I want** to see my reservations and cancel ones I can, **so that** I can manage my trips.

**Acceptance criteria:**
- [ ] `GET /me/bookings` returns my bookings (any status) with vehicle + agency info.
- [ ] Customer reservations page with status badges; cancel action where allowed.

**Tasks:**
- [ ] DRVN-29.1 Implement "my bookings" endpoint (Template A).
- [ ] DRVN-29.2 Build customer reservations page (Template B).

### DRVN-30 — Agency booking management UI
**Area:** `client` · **Priority:** P0 · **Size:** L · **Status:** Todo · **Iteration:** — · **Labels:** `booking`, `client`, `ui`

**As an** agency admin, **I want** a booking board filtered by status, **so that** I can process the full lifecycle.

**Acceptance criteria:**
- [ ] `GET /agencies/:slug/bookings` with status/date filters + pagination.
- [ ] Actions per status: approve, reject, cancel, start (handover), complete — with confirmation dialogs.
- [ ] Calendar/timeline view of vehicle availability (stretch).

**Tasks:**
- [ ] DRVN-30.1 Implement agency bookings endpoint (Template A).
- [ ] DRVN-30.2 Build booking board + action flows (Template B).

---

## EPIC E8 — Customer Search & Discovery

### DRVN-31 — Browse/search cars with filters
**Area:** `api` · `client` · **Priority:** P0 · **Size:** L · **Status:** Todo · **Iteration:** — · **Labels:** `discovery`, `api`, `client`

**As a** customer, **I want** to search available cars by city, dates, category, and price, **so that** I can find a suitable vehicle.

**Acceptance criteria:**
- [ ] `GET /search/vehicles` accepts city (or location), date range, category, transmission, max price, sort.
- [ ] Results exclude vehicles with any conflicting booking and archived/unavailable ones.
- [ ] Results include agency info; support pagination.
- [ ] Client search page with filters + result grid.

**Tasks:**
- [ ] DRVN-31.1 Implement search/availability query (Template A).
- [ ] DRVN-31.2 Add search tests (Template A).
- [ ] DRVN-31.3 Build search page + filter UI (Template B).

### DRVN-32 — Vehicle detail page
**Area:** `client` · `api` · **Priority:** P0 · **Size:** M · **Status:** Todo · **Iteration:** — · **Labels:** `discovery`, `client`, `ui`

**As a** customer, **I want** a detailed car page, **so that** I can decide and request a booking.

**Acceptance criteria:**
- [ ] `GET /vehicles/:id` returns full details + agency + photos.
- [ ] Detail page shows spec, price, deposit, pickup options; "Request booking" → date picker (reuses DRVN-23).

**Tasks:**
- [ ] DRVN-32.1 Implement vehicle detail endpoint (Template A).
- [ ] DRVN-32.2 Build vehicle detail page (Template B).

### DRVN-33 — Compare prices across agencies
**Area:** `client` · **Priority:** P1 · **Size:** M · **Status:** Todo · **Iteration:** — · **Labels:** `discovery`, `client`, `ui`

**As a** customer, **I want** to compare similar cars across agencies, **so that** I can pick the best deal.

**Acceptance criteria:**
- [ ] Comparison of selected vehicles side-by-side (price, specs, agency).
- [ ] Compare list persisted (URL or local state) while browsing.

**Tasks:**
- [ ] DRVN-33.1 Build compare tray + view (Template B).

### DRVN-34 — Featured / recent listings
**Area:** `api` · `client` · **Priority:** P2 · **Size:** S · **Status:** Todo · **Iteration:** — · **Labels:** `discovery`

**As a** customer, **I want** featured or recently added cars on the home page, **so that** I can start browsing immediately.

**Acceptance criteria:**
- [ ] Home page carousel/grid of recent available vehicles from the search endpoint.

**Tasks:**
- [ ] DRVN-34.1 Extend search endpoint with `sort=recent`/featured flag (Template A).
- [ ] DRVN-34.2 Build home page sections (Template B).

---

## EPIC E9 — Notifications

### DRVN-35 — Email notifications on booking state changes
**Area:** `api` · **Priority:** P1 · **Size:** L · **Status:** Todo · **Iteration:** — · **Labels:** `notifications`, `api`

**As a** customer/agency, **I want** email updates on booking confirmations, rejections, cancellations, and reminders, **so that** nobody misses a status change.

**Acceptance criteria:**
- [ ] Emails sent on approve/reject/cancel/complete (template per event).
- [ ] Reminder before pick-up (cron/queued job).
- [ ] Failure to send must not break the booking transition (fire-and-forget + retry).
- [ ] Tests with a mocked mailer.

**Tasks:**
- [ ] DRVN-35.1 Add a mailer service + abstraction (Template D).
- [ ] DRVN-35.2 Emit events on booking transitions and send emails (Template A).
- [ ] DRVN-35.3 Add reminder scheduler (Template D).
- [ ] DRVN-35.4 Add mocked-mailer tests (Template A).

---

## EPIC E10 — Frontend Shell & UX

### DRVN-36 — Role-based routing & layouts
**Area:** `client` · **Priority:** P0 · **Size:** L · **Status:** Todo · **Iteration:** — · **Labels:** `client`, `ui`

**As a** user, **I want** role-aware layouts (public / renter / agency admin), **so that** each audience gets the right navigation.

**Acceptance criteria:**
- [ ] Route groups: `/` public, `/account/*` renter, `/dashboard/*` agency.
- [ ] Guards redirect by session + organization membership/role (uses DRVN-5).
- [ ] Shared layout components (header, footer, nav, containers).

**Tasks:**
- [ ] DRVN-36.1 Define route tree + guards (Template B).
- [ ] DRVN-36.2 Build base layouts + nav (Template B).

### DRVN-37 — Global state (auth, active org)
**Area:** `client` · **Priority:** P0 · **Size:** M · **Status:** Todo · **Iteration:** — · **Labels:** `client`

**As a** developer, **I want** a typed client store for session and active organization, **so that** pages reflect the current context.

**Acceptance criteria:**
- [ ] Zustand stores: `useAuth` (session/user), `useActiveOrg` (org + agency).
- [ ] Hydrated on app load; invalidated on login/logout/org switch.

**Tasks:**
- [ ] DRVN-37.1 Implement auth store (Template B).
- [ ] DRVN-37.2 Implement active-org/agency store (Template B).

### DRVN-38 — Design system & responsive polish
**Area:** `client` · **Priority:** P2 · **Size:** M · **Status:** Todo · **Iteration:** — · **Labels:** `client`, `ui`

**As a** customer, **I want** a polished, responsive interface, **so that** the platform feels professional on any device.

**Acceptance criteria:**
- [ ] Consistent tokens/theme (Tailwind + shadcn/ui), mobile-first layouts.
- [ ] Loading skeletons, empty states, and toasts for actions.

**Tasks:**
- [ ] DRVN-38.1 Audit and unify visual components (Template B).
- [ ] DRVN-38.2 Add skeleton/empty/toast primitives (Template B).

---

## EPIC E11 — Platform & Delivery

### DRVN-39 — CI/CD pipeline
**Area:** `infra` · **Priority:** P0 · **Size:** M · **Status:** Todo · **Iteration:** — · **Labels:** `infra`, `ci`

**As a** maintainer, **I want** CI to lint, type-check, test, and build on every PR, **so that** regressions are caught early.

**Acceptance criteria:**
- [ ] GitHub Actions workflow: install (pnpm) → lint → typecheck → test (api+shared) → build.
- [ ] Turbo caching enabled; matrix for Node LTS (v22+).

**Tasks:**
- [ ] DRVN-39.1 Add GitHub Actions workflow (Template D).
- [ ] DRVN-39.2 Enable turbo remote/local cache in CI (Template D).

### DRVN-40 — API documentation (Swagger + Bruno)
**Area:** `api` · **Priority:** P1 · **Size:** M · **Status:** Todo · **Iteration:** — · **Labels:** `api`, `docs`

**As a** developer, **I want** browsable API docs and a Bruno collection, **so that** consumers can integrate quickly.

**Acceptance criteria:**
- [ ] Swagger UI served at `/docs` with schemas from `packages/shared`.
- [ ] Bruno collection covering auth, agency, fleet, booking, search.

**Tasks:**
- [ ] DRVN-40.1 Add Swagger setup + route metadata (Template D).
- [ ] DRVN-40.2 Curate Bruno collection (Template D).

### DRVN-41 — Deployment & environment management
**Area:** `infra` · **Priority:** P1 · **Size:** M · **Status:** Todo · **Iteration:** — · **Labels:** `infra`, `deploy`

**As a** maintainer, **I want** reproducible staging/production deploys, **so that** the app is available and env is consistent.

**Acceptance criteria:**
- [ ] Render (or equivalent) config for API + client + MongoDB.
- [ ] `.env.production` documented; secrets managed via platform.
- [ ] Docker builds lean (multi-stage, no dev deps).

**Tasks:**
- [ ] DRVN-41.1 Add production Dockerfiles / render.yaml (Template D).
- [ ] DRVN-41.2 Document deploy + env in README (Template D).

### DRVN-42 — Observability & rate limiting
**Area:** `api` · **Priority:** P1 · **Size:** M · **Status:** Todo · **Iteration:** — · **Labels:** `infra`, `api`

**As a** maintainer, **I want** structured logs, request IDs, and rate limits, **so that** issues are diagnosable and abuse is mitigated.

**Acceptance criteria:**
- [ ] Structured logging (JSON in prod), request IDs; `GET /health` reports DB status.
- [ ] Rate limiting on auth + booking endpoints (429 handled).

**Tasks:**
- [ ] DRVN-42.1 Add request-id + structured logging middleware (Template D).
- [ ] DRVN-42.2 Add rate limiter (Template D).

### DRVN-43 — Dev seeding & fixtures
**Area:** `infra` · **Priority:** P2 · **Size:** S · **Status:** Todo · **Iteration:** — · **Labels:** `infra`, `tools`

**As a** developer, **I want** a seed script, **so that** I can demo and test with realistic data.

**Acceptance criteria:**
- [ ] Seed: a demo agency, org, few vehicles, locations, and sample bookings.
- [ ] Idempotent; scripted via `pnpm seed`.

**Tasks:**
- [ ] DRVN-43.1 Write seed script (Template D).

### DRVN-44 — E2E test harness
**Area:** `infra` · **Priority:** P2 · **Size:** L · **Status:** Todo · **Iteration:** — · **Labels:** `infra`, `tests`

**As a** maintainer, **I want** end-to-end tests of critical journeys, **so that** whole flows are verified.

**Acceptance criteria:**
- [ ] Critical journey: guest → signup → search → request booking → agency approves → handover → complete.
- [ ] Runs in CI against seeded environment.

**Tasks:**
- [ ] DRVN-44.1 Add Playwright (or similar) + config (Template D).
- [ ] DRVN-44.2 Write the booking journey spec (Template D).
