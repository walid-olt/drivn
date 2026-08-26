import { resolvePostAuthPath } from '@/lib/auth-space';
import queryClient from '@/lib/query-client';
import { QUERY_KEYS } from '@/lib/query-keys';
import authClient from '@/lib/auth-client';
import { redirect, type MiddlewareFunction } from 'react-router';

/**
 * @description
 * Keeps authenticated users away from guest-only pages (login, register, ...).
 * Customers are sent to their profile and agency members to their agency home.
 */
export const redirectIfAuthenticated: MiddlewareFunction = async (_ctx, next) => {
	const { data: session } = await queryClient.ensureQueryData({
		queryKey: QUERY_KEYS.session,
		queryFn: () => authClient.getSession(),
	});

	if (!session) return next();

	throw redirect(await resolvePostAuthPath());
};
