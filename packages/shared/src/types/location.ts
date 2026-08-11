import z from 'zod';
import { locationSchema, locationCreateSchema, locationUpdateSchema } from '../schemas/';

export type Location = z.infer<typeof locationSchema>;
export type LocationCreateDto = z.infer<typeof locationCreateSchema>;
export type LocationUpdateDto = z.infer<typeof locationUpdateSchema>;
