import z from 'zod';
import {
	reservationSchema,
	createReservationSchema,
	updateReservationSchema,
} from '../schemas/reservation.schema.ts';

export type Reservation = z.infer<typeof reservationSchema>;
export type CreateReservationDto = z.infer<typeof createReservationSchema>;
export type UpdateReservationDto = z.infer<typeof updateReservationSchema>;
