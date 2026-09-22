# Drivn — Presentation Outline (Soutenance, 60 min)

Multi-tenant car-rental CRM for agencies (MERN + Turborepo monorepo).

---

## 1. Context & Problem (2 slides, ~5 min)
- **Problem statement:** local rental agencies lack a dedicated system -> fragmented fleet, renter, and reservation workflows.
- **Solution:** unified, multi-tenant B2B CRM; each agency gets an isolated workspace with role-based team access.
- **Graphics:** 3-panel "before / with Drivn" illustration; tenant isolation diagram (2 agencies -> 2 isolated workspaces on 1 platform).

## 2. Spec & Use cases (2 slides)
- Reuse `docs/drivn-[use-case].svg`; highlight 3 roles: Renter, Agency member, Agency admin.
- User stories: renter books a car, team member manages fleet, agency approves reservations.
- **Graphics:** the SVG use-case diagram; icon cards for each user story.

## 3. Architecture & Tech (2 slides)
- System topography: client SPA -> Express API -> MongoDB (Atlas), with monorepo layer in between.
- **Graphic:** architecture diagram of `apps/client` + `apps/api` + `packages/shared` (shared zod schemas + types as single source of truth), Docker/Compose, deployment to Vercel/Render/Atlas.
- **Stack:** React + Vite + Tailwind/shadcn · TanStack Query · Zustand · Express + Mongoose · Better-auth · Resend.

## 4. Data model (1 slide)
- **Graphic:** export `docs/entity-relationship.er` as visual ERD (User-Organization-Member, Agency, Location, Car, Reservation); emphasize the 3 core tables (Agency/Car/Reservation).

## 5. Demo (10 min, live app)
- Walkthrough: sign-up -> email verification -> agency onboarding (branding/support/locations) -> add car to fleet -> create reservation -> approve/reject.
- **Graphic (backup):** pre-built screenshots of each screen in case the live demo fails.

## 6. Code & Architecture deep-dive (10 min)
- Folder tour: `modules/` (controller/service/model/routes), `middleware/`, `lib/` (auth, handler, result, mongodb), `errors/` (HTTP exception + error handler).
- **Graphic:** request flow layered diagram: Route -> Middleware (auth/role/validation) -> Controller -> Service -> Model; error -> centralized `errorHandler`.
- Highlights: shared package contracts, reactive route guards (`requireUserAuth`, `requireAgencyOnBoarding`, ...).

## 7. Code quality (1-2 slides)
- Stack: Vitest + Supertest + in-memory MongoDB. Test files under `apps/api/test/` (auth/*, fleet/car.integration.test.ts, ...).
- **Graphic:** green test run terminal screenshot + coverage bar chart.
- Notes: oxlint, formatting, strict TypeScript.

## 8. Industrialization (2 slides)
- Docker/Compose: `docker-compose.yml` (mongo + db volume). **Graphic:** compose topology box.
- CI: `.github/workflows/CI.yml` pipeline (install -> lint -> test -> build on PR/push). **Graphic:** pipeline flow or GitHub Actions badge.
- Deployment: Vercel (client) / Render (API) / Atlas (DB) + `.env` config.

## 9. Closing & next steps (1 slide, ~5 min)
- Lessons learned; roadmap: payments, real-time notifications, renter portal, availability calendar.
- **Graphic:** roadmap timeline (MVP -> next iterations).

---

## Practical notes
- **Mise en situation (15 min):** likely a live change task (e.g., add an endpoint/role, fix a race condition on reservations). Know how to navigate the code fast and where key decisions were made.
- Keep deck <= 12 slides; strongest existing assets: `docs/drivn-[use-case].svg` and `docs/entity-relationship.er`.