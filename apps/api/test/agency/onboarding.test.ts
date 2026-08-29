import { it, expect, describe } from 'vitest';
import mongoose from 'mongoose';
import { createApp } from '../../src/app';
import request from 'supertest';

/**
 * @description
 * Integration tests for the agency onboarding API
 * (`/api/agency/onboarding`). The agency is auto-created by the
 * `afterCreateOrganization` better-auth hook, so each test signs up a user and
 * creates an organization instead of seeding an agency directly.
 */

describe('[AGENCY ONBOARDING]', () => {
	const AUTH_BASE_URL = '/api/auth';

	const SIGN_UP_URL = `${AUTH_BASE_URL}/sign-up/email`;

	const SIGN_IN_URL = `${AUTH_BASE_URL}/sign-in/email`;

	const CREATE_ORG_URL = `${AUTH_BASE_URL}/organization/create`;

	const ONBOARDING_URL = '/api/agency/onboarding';

	const PNG_BUFFER = Buffer.from(
		'89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c489',
		'hex',
	);

	const app = () => createApp(mongoose.connection.db!);

	const signUp = async (_app: ReturnType<typeof app>, email: string) => {
		const credentials = {
			email,
			password: 'password123',
			name: 'Test User',
		};
		await request(_app).post(SIGN_UP_URL).send(credentials).expect(200);

		const signIn = await request(_app)
			.post(SIGN_IN_URL)
			.send({ ...credentials, name: undefined })
			.expect(200);
		return signIn.get('Set-Cookie') || [];
	};

	const createOrganization = async (
		_app: ReturnType<typeof app>,
		cookies: string[],
		name = 'Acme Rentals',
		slug = 'acme-rentals',
	) => {
		return request(_app)
			.post(CREATE_ORG_URL)
			.set('Cookie', cookies)
			.send({ name, slug })
			.expect(200);
	};

	const setup = async () => {
		const _app = app();
		const cookies = await signUp(_app, 'owner@example.com');
		await createOrganization(_app, cookies);
		return { _app, cookies };
	};

	describe('authentication', () => {
		it("should return 401 when the user isn't authenticated", async () => {
			await request(app()).get(ONBOARDING_URL).expect(401);
		});

		it('should return 403 when the user has no active organization', async () => {
			const _app = app();
			const cookies = await signUp(_app, 'owner@example.com');

			await request(_app).get(ONBOARDING_URL).set('Cookie', cookies).expect(403);
		});
	});

	describe('GET /', () => {
		it('should return the agency with its onboarding status', async () => {
			const { _app, cookies } = await setup();
			const response = await request(_app).get(ONBOARDING_URL).set('Cookie', cookies).expect(200);
			expect(response.body.data).toMatchObject({
				name: 'Acme Rentals',
				slug: 'acme-rentals',
				onboardingStatus: 'not_started',
				operatingLocationIds: [],
			});
		});
	});

	describe('step gating', () => {
		it('should reject the support step before branding has been completed', async () => {
			const { _app, cookies } = await setup();

			const response = await request(_app)
				.put(`${ONBOARDING_URL}/support`)
				.set('Cookie', cookies)
				.send({ supportEmail: 'support@acme.com' })
				.expect(409);
			expect(response.body).toMatchObject({ success: false, status: 409 });
		});

		it('should reject re-submitting branding after onboarding is completed', async () => {
			const { _app, cookies } = await setup();

			await request(_app)
				.post(`${ONBOARDING_URL}/branding`)
				.set('Cookie', cookies)
				.field('summary', 'Premium car rentals')
				.attach('logo', PNG_BUFFER, {
					filename: 'logo.png',
					contentType: 'image/png',
				})
				.expect(200);
			await request(_app)
				.put(`${ONBOARDING_URL}/support`)
				.set('Cookie', cookies)
				.send({
					supportEmail: 'support@acme.com',
					supportPhone: '+14155552671',
					address: { city: 'Casablanca', country: 'MA' },
				})
				.expect(200);
			await request(_app)
				.put(`${ONBOARDING_URL}/locations`)
				.set('Cookie', cookies)
				.send({ operatingLocationIds: ['507f1f77bcf86cd799439011'] })
				.expect(200);

			const response = await request(_app)
				.post(`${ONBOARDING_URL}/branding`)
				.set('Cookie', cookies)
				.field('summary', 'Try again')
				.attach('logo', PNG_BUFFER, {
					filename: 'logo.png',
					contentType: 'image/png',
				})
				.expect(409);
			expect(response.body).toMatchObject({ success: false, status: 409 });
		});
	});

	describe('full flow', () => {
		it('should walk through branding → support → locations → completed', async () => {
			const { _app, cookies } = await setup();

			const branding = await request(_app)
				.post(`${ONBOARDING_URL}/branding`)
				.set('Cookie', cookies)
				.field('summary', 'Premium car rentals')
				.attach('logo', PNG_BUFFER, {
					filename: 'logo.png',
					contentType: 'image/png',
				})
				.attach('banner', PNG_BUFFER, {
					filename: 'banner.png',
					contentType: 'image/png',
				})
				.expect(200);
			expect(branding.body.data.onboardingStatus).toBe('branding');
			expect(branding.body.data.summary).toBe('Premium car rentals');
			expect(branding.body.data.logo).toMatch(/\/uploads\/logo-/);
			expect(branding.body.data.banner).toMatch(/\/uploads\/banner-/);

			const support = await request(_app)
				.put(`${ONBOARDING_URL}/support`)
				.set('Cookie', cookies)
				.send({
					supportEmail: 'support@acme.com',
					supportPhone: '+14155552671',
					address: {
						city: 'Casablanca',
						country: 'MA',
						addressLine1: '5 Boulevard de la Corniche',
						zipCode: '20000',
					},
				})
				.expect(200);
			expect(support.body.data).toMatchObject({
				onboardingStatus: 'support',
				supportEmail: 'support@acme.com',
			});
			expect(support.body.data.address).toMatchObject({ city: 'Casablanca' });

			const locations = await request(_app)
				.put(`${ONBOARDING_URL}/locations`)
				.set('Cookie', cookies)
				.send({ operatingLocationIds: ['507f1f77bcf86cd799439011'] })
				.expect(200);
			expect(locations.body.data.onboardingStatus).toBe('completed');
			expect(locations.body.data.operatingLocationIds).toEqual(['507f1f77bcf86cd799439011']);

			const stored = await mongoose.connection
				.db!.collection('agencies')
				.findOne({ slug: 'acme-rentals' });
			expect(stored).toMatchObject({ onboardingStatus: 'completed' });
		});
	});

	describe('validation', () => {
		it('should reject an invalid support email', async () => {
			const { _app, cookies } = await setup();

			const response = await request(_app)
				.post(`${ONBOARDING_URL}/branding`)
				.set('Cookie', cookies)
				.field('summary', 'Premium car rentals')
				.attach('logo', PNG_BUFFER, {
					filename: 'logo.png',
					contentType: 'image/png',
				})
				.expect(200);

			expect(response.body.data.onboardingStatus).toBe('branding');

			const invalid = await request(_app)
				.put(`${ONBOARDING_URL}/support`)
				.set('Cookie', cookies)
				.send({ supportEmail: 'not-an-email' })
				.expect(422);
			expect(invalid.body).toMatchObject({
				success: false,
				status: 422,
			});
			expect(invalid.body.details).toEqual(
				expect.arrayContaining([expect.objectContaining({ field: 'supportEmail' })]),
			);
		});

		it('should reject an empty operatingLocationIds array', async () => {
			const { _app, cookies } = await setup();

			await request(_app)
				.post(`${ONBOARDING_URL}/branding`)
				.set('Cookie', cookies)
				.field('summary', 'Premium car rentals')
				.attach('logo', PNG_BUFFER, {
					filename: 'logo.png',
					contentType: 'image/png',
				})
				.expect(200);
			await request(_app)
				.put(`${ONBOARDING_URL}/support`)
				.set('Cookie', cookies)
				.send({ supportEmail: 'support@acme.com' })
				.expect(200);

			const response = await request(_app)
				.put(`${ONBOARDING_URL}/locations`)
				.set('Cookie', cookies)
				.send({ operatingLocationIds: [] })
				.expect(422);
			expect(response.body.details).toEqual(
				expect.arrayContaining([expect.objectContaining({ field: 'operatingLocationIds' })]),
			);
		});

		it('should reject branding without any content', async () => {
			const { _app, cookies } = await setup();

			const response = await request(_app)
				.post(`${ONBOARDING_URL}/branding`)
				.set('Cookie', cookies)
				.field('summary', '')
				.expect(400);
			expect(response.body).toMatchObject({ success: false, status: 400 });
		});

		it('should reject non-image branding files', async () => {
			const { _app, cookies } = await setup();

			const response = await request(_app)
				.post(`${ONBOARDING_URL}/branding`)
				.set('Cookie', cookies)
				.attach('logo', Buffer.from('not an image'), {
					filename: 'logo.txt',
					contentType: 'text/plain',
				})
				.expect(400);
			expect(response.body).toMatchObject({ success: false, status: 400 });
		});
	});
});
