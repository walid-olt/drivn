import z from 'zod';
import {
	carSchema,
	createCarFormSchema,
	createCarSchema,
	updateCarSchema,
} from '../schemas/car.schema.ts';

export type Car = z.infer<typeof carSchema>;
export type CreateCarDto = z.infer<typeof createCarSchema>;
export type UpdateCarDto = z.infer<typeof updateCarSchema>;
export type CarCreateFormData = z.infer<typeof createCarFormSchema>;
