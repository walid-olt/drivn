import z from 'zod';
import {
	locationSchema,
	locationCreateSchema,
	locationUpdateSchema,
	locationQuerySchema,
} from '../schemas/';

export type Location = z.infer<typeof locationSchema>;
export type LocationCreateDto = z.infer<typeof locationCreateSchema>;
export type LocationUpdateDto = z.infer<typeof locationUpdateSchema>;
export type LocationQuery = z.infer<typeof locationQuerySchema>;
export interface LocationListResult {
	locations: Location[];
	total: number;
	page: number;
	limit: number;
}
