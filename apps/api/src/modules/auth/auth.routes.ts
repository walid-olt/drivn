import { Router } from 'express';
import type { mongo } from 'mongoose';
import { auth } from '../../lib/auth.ts';
import { BadRequestException } from '../../errors/http.exception.ts';

const signupBodySchema = {
	parse(data: unknown) {
		if (!data || typeof data !== 'object') throw new Error('Invalid body');
		const { name, email, password } = data as Record<string, unknown>;
		if (typeof name !== 'string' || !name.trim()) throw new Error('name is required');
		if (typeof email !== 'string' || !email.includes('@'))
			throw new Error('Valid email is required');
		if (typeof password !== 'string' || password.length < 8)
			throw new Error('Password must be at least 8 characters');
		return { name: name.trim(), email: email.trim(), password };
	},
};

export function createAuthRoutes(db: mongo.Db) {
	const router = Router();
	const authInstance = auth(db);

	router.post('/sign-up/customer', async (req, res, next) => {
		try {
			const body = signupBodySchema.parse(req.body);

			const { response, headers } = await authInstance.api.signUpEmail({
				body: { ...body, role: 'customer' },
				returnHeaders: true,
			});

			const setCookie = headers.getSetCookie();
			if (setCookie.length) res.setHeader('Set-Cookie', setCookie);

			res.json(response);
		} catch (err: any) {
			if (err?.status) return next(err);
			next(new BadRequestException(err.message));
		}
	});

	router.post('/sign-up/agency', async (req, res, next) => {
		try {
			const body = signupBodySchema.parse(req.body);

			const { response, headers } = await authInstance.api.signUpEmail({
				body: { ...body, role: 'agency' },
				returnHeaders: true,
			});

			const setCookie = headers.getSetCookie();
			if (setCookie.length) res.setHeader('Set-Cookie', setCookie);

			res.json(response);
		} catch (err: any) {
			if (err?.status) return next(err);
			next(new BadRequestException(err.message));
		}
	});

	return router;
}
