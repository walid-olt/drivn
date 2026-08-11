import { describe, expect, it } from 'vitest';
import { createReservationSchema, updateReservationSchema } from './reservation.schema';

const validReservation = {
	agencyId: 'agency-1',
	carId: 'car-1',
	customerId: 'user-1',
	pickupLocationId: 'loc-1',
	dropoffLocationId: 'loc-2',
	startDate: '2026-08-01T10:00:00.000Z',
	endDate: '2026-08-05T10:00:00.000Z',
	dailyRate: 45,
	totalDays: 4,
	totalAmount: 180,
};

describe('createReservationSchema', () => {
	it('parses a valid reservation', () => {
		expect(() => createReservationSchema.parse(validReservation)).not.toThrow();
	});

	it('defaults status to pending', () => {
		const result = createReservationSchema.parse(validReservation);
		expect(result.status).toBe('pending');
	});

	it('rejects an invalid status', () => {
		expect(() => createReservationSchema.parse({ ...validReservation, status: 'bogus' })).toThrow();
	});

	it('rejects an end date that is not strictly after the start date', () => {
		expect(() =>
			createReservationSchema.parse({
				...validReservation,
				endDate: validReservation.startDate,
			}),
		).toThrow('End date must be strictly after the start date');

		expect(() =>
			createReservationSchema.parse({
				...validReservation,
				endDate: '2026-07-31T10:00:00.000Z',
			}),
		).toThrow('End date must be strictly after the start date');
	});

	it('rejects non-positive daily rate, total days, and total amount', () => {
		expect(() => createReservationSchema.parse({ ...validReservation, dailyRate: 0 })).toThrow();
		expect(() => createReservationSchema.parse({ ...validReservation, totalDays: 0 })).toThrow();
		expect(() => createReservationSchema.parse({ ...validReservation, totalAmount: -5 })).toThrow();
	});

	it('rejects a fractional total days', () => {
		expect(() => createReservationSchema.parse({ ...validReservation, totalDays: 4.5 })).toThrow();
	});

	it('strips _id and organizationId from the output', () => {
		const result = createReservationSchema.parse({
			...validReservation,
			_id: '507f1f77bcf86cd799439011',
			organizationId: 'org-1',
		});
		expect(result).not.toHaveProperty('_id');
		expect(result).not.toHaveProperty('organizationId');
	});
});

describe('updateReservationSchema', () => {
	it('accepts a partial update', () => {
		expect(() => updateReservationSchema.parse({ notes: 'early pickup' })).not.toThrow();
	});

	it('rejects a swapped date range in a partial update', () => {
		expect(() =>
			updateReservationSchema.parse({
				startDate: '2026-08-05T10:00:00.000Z',
				endDate: '2026-08-01T10:00:00.000Z',
			}),
		).toThrow('End date must be strictly after the start date');
	});
});
