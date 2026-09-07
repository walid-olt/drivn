import type { RequestHandler } from 'express';
import { getAuth } from '../lib/auth.ts';
import { unauthorized } from '../errors';

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
			throw unauthorized('Unauthorized');
		}
		req.user = session.user;
		req.session = session.session;
		next();
	} catch (err) {
		next(err);
	}
};
