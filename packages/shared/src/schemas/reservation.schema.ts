import { z } from 'zod';
import { RESERVATION_STATUS } from '../constants/status';

export const reservationSchema = z
	.object({
		// Identifiers
		_id: z.string(),
		organizationId: z.string(),
		agencyId: z.string(),
		carId: z.string(),
		customerId: z.string(),

		startDate: z.coerce.date({
			message: 'A valid start date is required',
		}),
		endDate: z.coerce.date({
			message: 'A valid end date is required',
		}),

		status: z.enum(RESERVATION_STATUS).default('pending'),

		// Financials (calculated or passed from front end)
		dailyRate: z.number().positive('Daily rate must be greater than zero'),
		totalDays: z.number().int().positive('Must be at least 1 day'),
		totalAmount: z.number().positive('Total amount must be greater than zero'),

		// Optional MVP notes or extras
		notes: z.string().max(500).optional(),
	})
	.refine((data) => data.endDate > data.startDate, {
		message: 'End date must be strictly after the start date',
		path: ['endDate'], // Points the error directly to the end date field in forms
	});

export const createReservationSchema = reservationSchema.omit({ _id: true, organizationId: true });
export const updateReservationSchema = reservationSchema.partial().omit({ _id: true, organizationId: true });

export type Reservation = z.infer<typeof reservationSchema>;
