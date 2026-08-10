import z from 'zod';
import { reservationSchema } from '../schemas/reservation.schema.ts';

export type Reservation = z.infer<typeof reservationSchema>;
