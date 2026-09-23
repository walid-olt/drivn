import { resolvePostAuthPath } from '@/lib/auth-space';
import queryClient from '@/lib/query-client';
import { QUERY_KEYS } from '@/lib/query-keys';
import authClient from '@/lib/auth-client';
import { redirect, type MiddlewareFunction } from 'react-router';

/**
 * @description
 * Keeps authenticated users away from guest-only pages (login, register, ...).
 * Authenticated agency members are sent to their agency home.
 */
export const redirectIfAuthenticated: MiddlewareFunction = async (_ctx, next) => {
	const session = await queryClient.ensureQueryData({
		queryKey: QUERY_KEYS.session,
		queryFn: async () => {
			const { data, error } = await authClient.getSession();
			if (error || !data) return null;
			return data;
		},
	});

	if (!session) return next();

	throw redirect(await resolvePostAuthPath());
};
