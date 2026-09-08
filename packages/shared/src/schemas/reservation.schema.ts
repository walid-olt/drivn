import { z } from 'zod';
import { RESERVATION_STATUS } from '../constants/status';

export const reservationSchema = z.object({
	// Identifiers
	_id: z.string({ error: 'Reservation id is required.' }),
	organizationId: z.string({ error: 'Organization id is required.' }),
	agencyId: z.string({ error: 'Agency id is required.' }),
	carId: z.string({ error: 'Select a car.' }),
	customerId: z.string({ error: 'Customer id is required.' }),
	pickupLocationId: z.string({ error: 'Select a pickup location.' }),
	dropoffLocationId: z.string({ error: 'Select a drop-off location.' }),

	startDate: z.coerce.date({
		message: 'A valid start date is required',
	}),
	endDate: z.coerce.date({
		message: 'A valid end date is required',
	}),

	status: z
		.enum(RESERVATION_STATUS, { error: 'Choose a valid reservation status.' })
		.default('pending'),

	dailyRate: z
		.number({ error: 'Daily rate is required.' })
		.positive('Daily rate must be greater than zero.'),
	totalDays: z
		.number({ error: 'Reservation duration is required.' })
		.int('Duration must be a whole number.')
		.positive('Reservation must be at least 1 day.'),
	totalAmount: z
		.number({ error: 'Total amount is required.' })
		.positive('Total amount must be greater than zero.'),

	notes: z.string().max(500, 'Notes must be 500 characters or fewer.').optional(),
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
