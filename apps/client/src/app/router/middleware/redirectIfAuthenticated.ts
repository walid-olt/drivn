import authClient from '@/lib/auth-client';
import { resolvePostAuthPath } from '@/lib/auth-space';
import { redirect, type MiddlewareFunction } from 'react-router';

/**
 * @description
 * Keeps authenticated users away from guest-only pages (login, register, ...).
 * Customers are sent to their profile and agency members to their agency home.
 */
export const redirectIfAuthenticated: MiddlewareFunction = async (_ctx, next) => {
	const { data: session } = await authClient.getSession();
	if (!session) return next();

	throw redirect(await resolvePostAuthPath());
};
