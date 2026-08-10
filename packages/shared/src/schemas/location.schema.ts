import z from 'zod';
export const locationSchema = z.object({
	_id: z.string(),
	name: z.string().min(1),
	address: z.string().min(1),
	country: z.string(),
	city: z.string(),
	postalCode: z.string().optional(),
	type: z.enum(['office', 'airport', 'hotel', 'train_station', 'port', 'other']),
});

export const locationCreateSchema = locationSchema.omit({ _id: true });
export const locationUpdateSchema = locationSchema.partial().omit({ _id: true });
