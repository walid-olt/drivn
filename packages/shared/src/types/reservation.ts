import z from 'zod';
import { reservationSchema, createReservationSchema, updateReservationSchema } from '../schemas/reservation.schema.ts';

export type Reservation = z.infer<typeof reservationSchema>;
export type createReservationDto = z.infer<typeof createReservationSchema>;
export type updateReservationDto = z.infer<typeof updateReservationSchema>;
