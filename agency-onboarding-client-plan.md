# Agency onboarding client plan

## Current state

The client already has the routing and guard layer for onboarding:

- `/agency/onboarding` is registered behind `requireAgencyMembership` and `requireAgencyOnboarding`.
- `requireAgencyOnboarding` redirects any agency whose `onboardingStatus !== 'completed'` to the onboarding screen.
- The page at `apps/client/src/pages/protected/AgencyOnboarding.tsx` is only a placeholder: it renders a caption and a raw `ImageUploader` component with no actual onboarding flow.
- The API client exposes only `apiClient.agency.getActive()` and `updateAgencyBranding()`.
- The backend sequencing is already defined and enforced:
  - `not_started -> branding -> support -> locations -> completed`
  - each step advances only when the previous status matches the expected value.

The underlying data model already supports all required onboarding fields through the shared schema:

- `summary`
- `logo`
- `banner`
- `supportEmail`
- `supportPhone`
- `address`
- `operatingLocationIds`

## Goal

Build a complete onboarding flow on the client that matches the API contract and the app's existing auth/route model. The flow should be sequential, resume-safe, and complete the agency onboarding without breaking the current protected routing rules.

## Recommended implementation structure

### 1. Replace the stub onboarding page with a step-based flow

Create a client-side onboarding wizard with a progress indicator and step state derived from the agency record:

- Step 1: Branding
- Step 2: Support & contact
- Step 3: Locations
- Step 4: Done

Use `useAgency()` as the source of truth. Derive the current step from `agency.onboardingStatus` so the user can resume where they left off.

Implementation guidance:

- Keep the route at `/agency/onboarding`.
- Keep the current route guards in place.
- Add a loading state while `useAgency()` is pending.
- If onboarding is already completed, redirect to `/agency`.

### 2. Add a dedicated onboarding state machine on the client

Create a local `OnboardingStep` enum or object map to reflect backend status ordering:

- `not_started` => branding
- `branding` => support
- `support` => locations
- `locations` => completed

This keeps the UI synced with the backend. Do not let the client invent a different state order.

### 3. Implement the branding step

The branding endpoint is already implemented on the API and should be used directly:

- `PUT /api/agency/onboarding/branding`
- accepts `summary`, `logo`, and `banner` as multipart form data

Client tasks:

- Add a form with fields for agency summary and logo/banner upload.
- Reuse `ImageUploader` for logo and banner selection/cropping.
- Convert the selected images into `File` objects and send them as multipart form data.
- Validate at least one of the three branding inputs is present before submitting.
- After success, invalidate/refresh the agency query and advance to the next step.

Important note: the current `ImageUploader` emits a cropped `Blob`, not an attached `File`, so the onboarding form must wrap that output into a proper `File` before submitting to `FormData`.

### 4. Implement the support step

The backend contract for support is:

- `PUT /api/agency/onboarding/support`
- payload fields from `updateAgencySupport`:
  - `supportEmail`
  - `supportPhone`
  - `address`

Client tasks:

- Build a contact/address form with the same fields as the shared schema.
- Keep `supportPhone` in the format expected by the shared phone schema.
- Validate address fields and email before submit.
- On success, refresh agency data and move to the next step.

### 5. Implement the locations step

The backend contract is:

- `PUT /api/agency/onboarding/locations`
- payload: `{ operatingLocationIds: string[] }`

Client tasks:

- Add a location selector or list UI for the agency's operating locations.
- Keep the submission as an array of IDs, even if the initial implementation is a minimal multi-select or chips selector.
- Require at least one location.
- After success, mark onboarding complete and redirect to `/agency`.

### 6. Add completion UX

After the final submission succeeds:

- invalidate the agency query
- redirect to `/agency`
- show a success state or short confirmation before navigation if needed

The route guard will then allow access because `onboardingStatus === 'completed'`.

## API client updates

Add the missing client methods:

- `agency.updateAgencySupport(data)`
- `agency.updateAgencyLocations(data)`

Keep them consistent with `updateAgencyBranding()` and the existing `tryCatch` pattern.

Potential helper shape:

```ts
async updateAgencySupport(data: UpdateAgencySupportDto) {
  const promise = httpClient.put<ApiResult<Agency>>('/agency/onboarding/support', {
    json: data,
  });
  return tryCatch(promise);
}
```

```ts
async updateAgencyLocations(data: UpdateAgencyLocationsDto) {
  const promise = httpClient.put<ApiResult<Agency>>('/agency/onboarding/locations', {
    json: data,
  });
  return tryCatch(promise);
}
```

## Suggested frontend structure

Use a small set of focused files rather than one giant page:

- `apps/client/src/pages/protected/AgencyOnboarding.tsx` — wizard shell and step routing
- `apps/client/src/features/agency/components/onboarding/BrandingStep.tsx`
- `apps/client/src/features/agency/components/onboarding/SupportStep.tsx`
- `apps/client/src/features/agency/components/onboarding/LocationsStep.tsx`
- `apps/client/src/features/agency/components/onboarding/OnboardingProgress.tsx`

This keeps the logic easier to test and easier to extend later.

## Data flow and state management

Use React Query for the data source and mutation lifecycle:

- `useAgency()` for current agency state
- `useMutation` for each step submit
- `queryClient.invalidateQueries({ queryKey: QUERY_KEYS.agency })` after each successful step

Do not store onboarding progress in local state only. The server's onboarding status is the source of truth.

## Acceptance criteria

- A logged-in agency with `onboardingStatus: 'not_started'` is redirected to `/agency/onboarding`.
- The onboarding page renders a valid step flow and not a stub.
- The branding step accepts summary + logo/banner upload and submits to the API.
- The support step accepts support email, phone, and address data.
- The locations step accepts at least one operating location ID.
- Each successful step updates the backend and advances the onboarding status.
- After the final step, the user is redirected to `/agency` and gains access.
- Existing protected routes remain guarded correctly.

## Risks / watchouts

- `ImageUploader` currently returns a cropped blob, not a `File`; this must be transformed before `FormData` submission.
- The client must respect backend sequential validation; no step can be skipped.
- `supportPhone` formatting and validation are easy to get wrong if the client sends raw strings without the shared schema's expected format.
- The onboarding page should never assume the agency has already completed previous steps; it should render based on the server-returned status.

## Recommended order of work

1. Add missing API methods to `api-client.ts`.
2. Replace the stub `AgencyOnboarding` page with a wizard shell and server-backed step detection.
3. Implement branding form and upload flow.
4. Implement support form.
5. Implement locations form.
6. Add redirect and completion UX.
7. Run targeted client validation and check route access behavior.
