import type { RequestHandler } from 'express';
import { APIError } from 'better-auth';
import { getAuth } from '../lib/auth.ts';

/**
 * Middleware that extracts the auth context and attach it to the request
 */
export const authenticate: RequestHandler = async (req, _res, next) => {
	try {
		const authInstance = getAuth();
		const session = await authInstance.api.getSession({
			headers: req.headers,
		});

		if (!session) {
			throw new APIError('UNAUTHORIZED');
		}
		req.user = session.user;
		req.session = session.session;
		next();
	} catch (err) {
		next(err);
	}
};
