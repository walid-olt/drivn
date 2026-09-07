import z from 'zod';

export const locationTypeEnum = z.enum([
	'office',
	'airport',
	'hotel',
	'train_station',
	'port',
	'other',
]);

export const locationSchema = z.object({
	_id: z.string(),
	name: z.string().min(1),
	address: z.string().min(1),
	country: z.string().min(1),
	city: z.string().min(1),
	postalCode: z.string().optional(),
	type: locationTypeEnum,
});

export const locationCreateSchema = locationSchema.omit({ _id: true });
export const locationUpdateSchema = locationSchema.partial().omit({ _id: true });

export const locationQuerySchema = z.object({
	q: z.string().optional(),
	country: z.string().optional(),
	city: z.string().optional(),
	type: locationTypeEnum.optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
});
