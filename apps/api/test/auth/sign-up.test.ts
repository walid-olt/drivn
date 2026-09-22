import { it, expect, describe } from 'vitest';
import mongoose from 'mongoose';
import { createApp } from '../../src/app';
import request from 'supertest';
import { parseCookies } from '../utils.ts';

/**
 * @description
 * Tests for the custom sign-up routes that wrap better-auth's signUpEmail
 * and force the user type to `agency_member` server-side.
 */
describe('[AUTH] sign-up routes', () => {
	const AGENCY_URL = '/api/auth/sign-up/agency';

	const app = () => createApp(mongoose.connection.db!);

	const validAgency = {
		email: 'agency@example.com',
		password: 'password123',
		name: 'Test Agency',
	};

	describe('POST /sign-up/agency', () => {
		it("should return 400 when sign-up data aren't valid", async () => {
			await request(app()).post(AGENCY_URL).send({}).expect(400);
		});

		it('should create an agency user, return a session cookie and persist type', async () => {
			const response = await request(app()).post(AGENCY_URL).send(validAgency).expect(200);

			expect(response.body.data.user.email).toBe(validAgency.email);
			expect(response.body.data.user.type).toBe('agency_member');

			const cookies = response.get('Set-Cookie') || [];
			expect(parseCookies(cookies)).toMatchObject({
				['better-auth.session_token']: expect.any(String),
			});

			const stored = await mongoose.connection
				.db!.collection('users')
				.findOne({ email: validAgency.email });
			expect(stored).not.toBeNull();
			expect(stored!.type).toBe('agency_member');
		});

		it('should ignore client-supplied type and always create an agency member', async () => {
			const response = await request(app())
				.post(AGENCY_URL)
				.send({ ...validAgency, type: 'not-an-agency-member' })
				.expect(200);

			expect(response.body.data.user.type).toBe('agency_member');

			const stored = await mongoose.connection
				.db!.collection('users')
				.findOne({ email: validAgency.email });
			expect(stored!.type).toBe('agency_member');
		});
	});
});
