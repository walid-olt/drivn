# Client-side Auth Implementation Plan

## Goal
Implement client auth flows that prevent customer/agency space conflicts:
- **Shared login** for everyone
- **Separated signup** for customer vs agency intent
- **Deterministic post-auth routing** based on organization membership

## Current baseline
- Better Auth client is already configured with organization plugin.
- Protected routes are already split into customer and agency trees.
- Existing loaders already enforce auth and basic org checks.

## Implementation steps
1. Add a shared auth-space resolver utility for:
   - required session checks
   - organization lookup
   - customer vs agency space resolution
2. Keep a generic `/register` page as account-type selector.
3. Add dedicated signup pages:
   - `/register/customer` (extended fields)
   - `/register/agency` (email/password only)
4. Keep `/login` shared and route users to the right protected area after sign-in.
5. Apply consistent loader behavior:
   - session loader for all protected routes
   - customer-space loader to prevent agency users from customer pages
   - agency-space loader to block org-less users from agency pages
6. Polish cross-links and empty states so users can move between auth journeys without confusion.
7. Run client build/type checks and fix integration regressions.

## Data model direction
Use one identity account (email/password) and layer role-specific data on top:
- customer intent -> customer profile data
- agency intent -> organization membership/ownership journey
