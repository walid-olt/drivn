import { z } from 'zod';
import { RESERVATION_STATUS } from '../constants/status';

export const reservationSchema = z.object({
	// Identifiers
	_id: z.string(),
	organizationId: z.string(),
	agencyId: z.string(),
	carId: z.string(),
	customerId: z.string(),
	pickupLocationId: z.string(),
	dropoffLocationId: z.string(),

	startDate: z.coerce.date({
		message: 'A valid start date is required',
	}),
	endDate: z.coerce.date({
		message: 'A valid end date is required',
	}),

	status: z.enum(RESERVATION_STATUS).default('pending'),

	dailyRate: z.number().positive('Daily rate must be greater than zero'),
	totalDays: z.number().int().positive('Must be at least 1 day'),
	totalAmount: z.number().positive('Total amount must be greater than zero'),

	notes: z.string().max(500).optional(),
});

export const createReservationSchema = reservationSchema
	.omit({
		_id: true,
		organizationId: true,
	})
	.refine((data) => data.endDate > data.startDate, {
		message: 'End date must be strictly after the start date',
		path: ['endDate'], // Points the error directly to the end date field in forms
	});

export const updateReservationSchema = reservationSchema
	.partial()
	.omit({ _id: true, organizationId: true })
	// superRefine because we want to validate the relationship between
	// startDate and endDate, not just their individual values
	.superRefine((data, ctx) => {
		if (data.startDate && data.endDate && data.endDate <= data.startDate) {
			ctx.addIssue({
				code: 'custom',
				message: 'End date must be strictly after the start date',
				path: ['endDate'],
			});
		}
	});
