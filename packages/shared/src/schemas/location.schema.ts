import z from 'zod';
export const locationSchema = z.object({
	_id: z.string(),
	name: z.string().min(1),
	address: z.string().min(1),
	country: z.string(),
	city: z.string(),
	postalCode: z.string().optional(),
	// we are NOT doing coordinates 💔🥀.
	// coordinates: z.object({
	//   latitude: z.number().min(-90).max(90),
	//   longitude: z.number().min(-180).max(180),
	// }),
	//
	type: z.enum(['office', 'airport', 'hotel', 'train_station', 'port', 'other']),

	organizationId: z.string(),
	isActive: z.boolean().default(true),
});

export const locationCreateSchema = locationSchema.omit({ _id: true });
export const locationUpdateSchema = locationSchema.partial().omit({ _id: true });
