import { it, expect, describe } from 'vitest';
import mongoose from 'mongoose';
import { createApp } from '../../src/app';
import request from 'supertest';

describe('[AUTH]', () => {
	const AUTH_BASE_URL = '/api/auth';
	const app = () => createApp(mongoose.connection.db!);
	describe('sign-up', () => {
		const SIGN_UP_URL = `${AUTH_BASE_URL}/sign-up/email`;
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
});
