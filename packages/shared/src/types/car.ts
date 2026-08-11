import z from 'zod';
import { carSchema, createCarSchema, updateCarSchema } from '../schemas/car.schema.ts';

export type Car = z.infer<typeof carSchema>;
export type createCarDto = z.infer<typeof createCarSchema>;
export type updateCarDto = z.infer<typeof updateCarSchema>;
