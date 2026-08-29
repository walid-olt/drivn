# Agency Onboarding — Implementation Plan

## Current State

The foundation already exists in the codebase:

- **Agency model** has `onboardingStatus` (`not_started` → `branding` → `support` → `locations` → `completed`) plus all needed fields (logo, banner, summary, support email/phone, address, operatingLocationIds) — `apps/api/src/modules/agency/agency.model.ts:10`
- **Agency auto-created** when an organization is created via the better-auth `afterCreateOrganization` hook — `apps/api/src/lib/auth.ts:127`
- **Agency service** exists but has no onboarding methods — `apps/api/src/modules/agency/agency.service.ts`
- **No onboarding routes** exist on the backend, and the **client cannot read the agency / onboarding status** at all
- **Better-auth** handles org creation; users have a `type` field (`customer` | `agency_member`)

## Decisions

- **Step gating:** strict sequential — a step only advances when the current status matches the expected prior step (no skips).
- **File uploads:** build upload infrastructure now. `multer` (`^2.2.0`) is already a dependency of `apps/api`. Use a `IStorageProvider` strategy (replaceable by S3/R2 later), mirroring the existing `IEmailProvider` pattern.
- **Step names:** keep existing enum values (`not_started` / `branding` / `support` / `locations` / `completed`) — no migration needed.

## Phase 1 — Shared package (`packages/shared`)

1. **`constants/status.ts`**: add `AGENCY_ONBOARDING_STATUS` (ordered array) and an `ONBOARDING_STEPS` mapping of status → `{ step, fields }`.
2. **`schemas/onboarding.schema.ts`**: step-specific zod schemas:
   - `brandingStepSchema` — `logo` (z.url), `banner` (z.url), `summary`
   - `supportStepSchema` — `supportEmail`, `supportPhone` (reuse `phoneNumberSchema`), `address`
   - `locationsStepSchema` — `operatingLocationIds`
   - `agencyOnboardingStatusSchema` — the status enum
3. **`types/onboarding.ts`**: inferred types via `z.infer`.
4. Export through the barrel files: `schemas/index.ts`, `types/index.ts`, `constants/index.ts`.
5. Add `*.schema.test.ts` (vitest) mirroring the existing `agency.schema.test.ts`.
6. **`apps/client`**: add `"@drivn/shared": "workspace:*"` dependency (the client does not currently import it).

## Phase 2 — Backend (`apps/api`)

1. **Upload infrastructure** (multer already installed):
   - `src/lib/storage/provider.ts` — `IStorageProvider` interface (`upload(file, dir) => url`).
   - `src/lib/storage/local.ts` — `LocalStorageProvider`: writes to `UPLOAD_DIR` (`./uploads`) and serves it statically.
   - Add `UPLOAD_DIR` (and optional `PUBLIC_UPLOAD_URL`) to `src/config/env.ts`; serve `/uploads` static in `app.ts`.
2. **`modules/agency/agency.service.ts`**: add strict sequential helpers — `getByOrganizationId` (exists), `updateOnboardingField`, `advanceOnboardingStatus` (only advances if the current status matches the expected prior step).
3. **`middleware/agency.middleware.ts`**: resolve `session.activeOrganizationId` → agency (scoped-context guard).
4. **`modules/agency/onboarding.routes.ts`** mounted at `/api/agency/onboarding` (all `authenticate` + agency-scoped):
   - `GET /` — return current agency + `onboardingStatus`
   - `POST /branding` — **multipart** (logo, banner) via upload middleware + JSON summary; stores files, saves URLs, advances `not_started` → `branding`
   - `PUT /support` — supportEmail / phone / address, advances `branding` → `support`
   - `PUT /locations` — operatingLocationIds, advances `support` → `locations` → `completed`
   - Strict: reject if the current status is not the expected prior step.
5. Wire routes in `app.ts` before the better-auth catch-all.
6. **Tests** `test/agency/onboarding.test.ts` (supertest + MongoMemoryServer + local storage temp dir): happy path through all steps, out-of-order rejection, unauthenticated, validation errors.

## Phase 3 — Frontend (`apps/client`)

1. **`lib/api.ts`**: add `getAgencyOnboarding()`, `uploadBranding()`, `updateSupport()`, `updateLocations()` (fetch, `credentials: include`) — mirroring `signUpAsCustomer`.
2. **`lib/query-keys.ts`**: add `agencyOnboarding: ['agency-onboarding']`.
3. **`lib/auth-hooks.tsx`**: `useAgencyOnboarding()` query hook.
4. **`lib/auth-space.ts` + middleware**:
   - `requireAgencyMembership.ts:6` → redirect incomplete agencies to `/agency/onboarding` (not `/agency`).
   - `requireNoAgency.ts:11` → incomplete agency also goes to onboarding.
   - New `requireAgencyCompleted` middleware guarding the `/agency` dashboard.
   - `resolvePostAuthPath()` → agency_member with incomplete onboarding goes to `/agency/onboarding`.
5. **Onboarding feature** `features/onboarding/`:
   - `OnboardingWizard.tsx` — reads status, renders active step, step progress, back/next.
   - `BrandingStep.tsx` (file input for logo/banner + summary, preview), `SupportStep.tsx`, `LocationsStep.tsx` — react-hook-form + zodResolver, `Field`/`FieldError`, toast, `isSubmitting` — matching `CreateAgencyForm.tsx`.
   - Reuse `CountryDropdown`, `PhoneInput`, `Input`, `Textarea`, `Button`.
6. **Pages/routes**: `pages/protected/Onboarding.tsx` (AuthLayout); route `/agency/onboarding` in `protected/routes.tsx` under `requireAgencyMembership`.
7. **Redirect wiring**: `CreateAgencyForm.tsx:74` → `navigate('/agency/onboarding')`.

## Verification

- `pnpm --filter api test`
- `pnpm --filter client build` (typecheck via `tsc -b`)
- `pnpm lint` (both api and client)
- Manual: create agency → land on onboarding → upload branding → support → locations → reach dashboard
