import { it, expect, describe } from 'vitest';
import mongoose from 'mongoose';
import { createApp } from '../../src/app';
import request from 'supertest';
import { parseCookies } from '../utils.ts';
import { log } from 'console';

describe('[AUTH]', () => {
	const AUTH_BASE_URL = '/api/auth';

	const SIGN_IN_URL = `${AUTH_BASE_URL}/sign-in/email`;

	const SIGN_UP_URL = `${AUTH_BASE_URL}/sign-up/email`;
	const app = () => createApp(mongoose.connection.db!);
	describe('sign-up', () => {
		it("should return 400 when sign-up data aren't valid", async () => {
			const response = await request(app()).post(SIGN_UP_URL).send({}).expect(400);
			expect(response.body).toMatchObject({
				code: 'VALIDATION_ERROR',
			});
		});

		it('should create a user and return a session', async () => {
			const response = await request(app())
				.post(SIGN_UP_URL)
				.send({
					email: 'test@example.com',
					password: 'password123',
					name: 'Test User',
				})
				.expect(200);

			expect(response.body.user.email).toBe('test@example.com');
			expect(response.body.user.emailVerified).toBe(false);

			const stored = await mongoose.connection
				.db!.collection('user')
				.findOne({ email: 'test@example.com' });
			expect(stored).not.toBeNull();
		});
	});

	describe('sign-in', () => {
		const app = () => createApp(mongoose.connection.db!);

		it("should return 400 when sign-in data aren't valid", async () => {
			const response = await request(app()).post(SIGN_IN_URL).send({}).expect(400);
			expect(response.body).toMatchObject({
				code: 'VALIDATION_ERROR',
			});
		});

		it('should issue a session cookie', async () => {
			const _app = app();
			const credentais = {
				email: 'test@example.com',
				password: 'password123',
				name: 'Test User',
			};
			await request(_app).post(SIGN_UP_URL).send(credentais).expect(200);

			const response = await request(_app)
				.post(SIGN_IN_URL)
				.send({ ...credentais, name: undefined })
				.expect(200);
			const cookies = response.get('Set-Cookie') || [];
			const jar = parseCookies(cookies);
			expect(jar).toMatchObject({
				['better-auth.session_token']: expect.any(String),
			});
		});
	});
});
