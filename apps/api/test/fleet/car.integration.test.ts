import { describe, expect, it } from 'vitest';
import mongoose from 'mongoose';
import request from 'supertest';
import { createApp } from '../../src/app';
import AgencyModel from '../../src/modules/agency/agency.model';
import CarModel from '../../src/modules/fleet/car.model';

describe('[FLEET CARS]', () => {
	const SIGN_UP_URL = '/api/auth/sign-up/email';
	const SIGN_IN_URL = '/api/auth/sign-in/email';
	const CREATE_ORG_URL = '/api/auth/organization/create';
	const CARS_URL = '/api/cars';
	const app = () => createApp(mongoose.connection.db!);

	const signUp = async (_app: ReturnType<typeof app>, email: string) => {
		const credentials = { email, password: 'password123', name: 'Fleet Owner' };
		await request(_app).post(SIGN_UP_URL).send(credentials).expect(200);
		const signIn = await request(_app)
			.post(SIGN_IN_URL)
			.send({ email, password: credentials.password })
			.expect(200);
		return signIn.get('Set-Cookie') || [];
	};

	const setupAgency = async () => {
		const _app = app();
		const cookies = await signUp(_app, 'fleet-owner@example.com');
		await request(_app)
			.post(CREATE_ORG_URL)
			.set('Cookie', cookies)
			.send({ name: 'Fleet Rentals', slug: 'fleet-rentals' })
			.expect(200);
		const agency = await AgencyModel.findOne({
			slug: 'fleet-rentals',
		}).orFail();
		return { _app, cookies, agency };
	};

	const car = (
		agency: {
			_id: mongoose.Types.ObjectId;
			organizationId: mongoose.Types.ObjectId;
		},
		status: 'available' | 'rented' = 'available',
	) => ({
		organizationId: agency.organizationId,
		agencyId: agency._id,
		make: 'Toyota',
		model: 'Corolla',
		year: 2024,
		status,
		category: 'sedan' as const,
		transmission: 'automatic' as const,
		fuelType: 'hybrid' as const,
		seatingCapacity: 5,
		doors: 4,
		kilometrage: 1000,
		dailyRate: 45,
		images: ['https://example.com/corolla.jpg'],
	});

	it('lists the agency fleet for authenticated members', async () => {
		const { _app, cookies, agency } = await setupAgency();
		await CarModel.create([car(agency), car(agency, 'rented')]);

		const response = await request(_app).get(`${CARS_URL}/agency`).set('Cookie', cookies).expect(200);

		expect(response.body.success).toBe(true);
		expect(response.body.data).toHaveLength(2);
		expect(response.body.data).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
			make: 'Toyota',
			status: 'available',
				}),
			]),
		);
	});

	it('creates a car for the authenticated agency and derives its ownership fields', async () => {
		const { _app, cookies, agency } = await setupAgency();

		const response = await request(_app)
			.post(CARS_URL)
			.set('Cookie', cookies)
			.field('make', 'Tesla')
			.field('model', 'Model 3')
			.field('year', '2025')
			.field('dailyRate', '90')
			.attach('images', Buffer.from('fake image'), {
				filename: 'model-3.jpg',
				contentType: 'image/jpeg',
			})
			.expect(200);

		expect(response.body.data).toMatchObject({
			make: 'Tesla',
			model: 'Model 3',
			status: 'available',
			agencyId: agency._id.toString(),
			organizationId: agency.organizationId.toString(),
		});
	});

	it('rejects car creation without authentication', async () => {
		await request(app()).post(CARS_URL).send({}).expect(401);
	});

	it('rejects invalid car data before persistence', async () => {
		const { _app, cookies } = await setupAgency();

		const response = await request(_app)
			.post(CARS_URL)
			.set('Cookie', cookies)
			.field('make', '')
			.field('model', 'Model 3')
			.field('year', '2025')
			.field('dailyRate', '-1')
			.attach('images', Buffer.from('fake image'), {
				filename: 'model-3.jpg',
				contentType: 'image/jpeg',
			})
			.expect(422);

		expect(response.body).toMatchObject({ success: false, status: 422 });
		expect(await CarModel.countDocuments()).toBe(0);
	});
});
