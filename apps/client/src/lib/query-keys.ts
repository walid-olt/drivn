/**
 * @description
 * Central registry of TanStack Query cache keys.
 * Always use these instead of inline literals so invalidations
 * and reads stay in sync across the app.
 */
export const QUERY_KEYS = {
	/** Auth session (authClient.getSession) */
	session: ['session'],
	/** Agencies the signed-in user belongs to (authClient.organization.list) */
	agencies: ['agencies'],
} as const;
