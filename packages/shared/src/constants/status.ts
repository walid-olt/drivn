export const RESERVATION_STATUS = [
	'pending',
	'confirmed',
	'active',
	'completed',
	'cancelled',
] as const;

/**
 * Ordered agency onboarding steps. The value of `onboardingStatus` represents
 * the last completed step; the next step to complete is
 * `AGENCY_ONBOARDING_STATUS[indexOf(current) + 1]`.
 */
export const AGENCY_ONBOARDING_STATUS = [
	'not_started',
	'branding',
	'support',
	'locations',
	'completed',
] as const;
