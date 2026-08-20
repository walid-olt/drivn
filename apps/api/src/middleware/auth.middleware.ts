import type { Request, Response, NextFunction } from 'express';
import { HttpException, UnauthorizedException, ForbiddenException } from '../errors/http.exception.ts';

export interface AuthUser {
	id: string;
	email: string;
	name: string;
	role: string;
	image?: string;
	emailVerified: boolean;
}

export interface AuthSession {
	id: string;
	userId: string;
	expiresAt: Date;
}

declare global {
	namespace Express {
		interface Request {
			authUser?: AuthUser;
			authSession?: AuthSession;
		}
	}
}

/**
 * Middleware that extracts the session from better-auth cookies
 * and attaches authUser + authSession to the request.
 */
export const authenticate = (authInstance: { api: { getSession: (params: { headers: any }) => Promise<any> } }) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const session = await authInstance.api.getSession({
				headers: req.headers,
			});

			if (!session) {
				throw new UnauthorizedException();
			}

			req.authUser = session.user as AuthUser;
			req.authSession = session.session as AuthSession;
			next();
		} catch (err) {
			if (err instanceof HttpException) {
				next(err);
			} else {
				next(new UnauthorizedException());
			}
		}
	};
};

/**
 * Middleware factory that checks if the authenticated user has one of the required roles.
 * Must be used after `authenticate`.
 */
export const requireRole = (...roles: string[]) => {
	return (req: Request, _res: Response, next: NextFunction) => {
		if (!req.authUser) {
			next(new UnauthorizedException());
			return;
		}

		if (!roles.includes(req.authUser.role)) {
			next(new ForbiddenException());
			return;
		}

		next();
	};
};
