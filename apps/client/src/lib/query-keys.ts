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
	/** Current active agency */
	agency: ['agency'],
	/** Current active agency membership (authClient.organization.getMembership) */
	membership: ['membership'],
	/** Members of the current organization */
	organizationMembers: ['organization', 'members'],
	/** Pending invitations for the current organization */
	organizationInvitations: ['organization', 'invitations'],
	/** Agency reservations */
	reservations: ['reservations'],
	/** Specific agency reservation */
	reservation: (reservationId: string) => ['reservation', reservationId],
} as const;
