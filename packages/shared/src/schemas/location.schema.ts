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
	_id: z.string({ error: 'Location id is required.' }),
	name: z.string({ error: 'Location name is required.' }).trim().min(1, 'Enter a location name.'),
	address: z.string({ error: 'Address is required.' }).trim().min(1, 'Enter an address.'),
	country: z.string({ error: 'Country is required.' }).trim().min(1, 'Enter a country.'),
	city: z.string({ error: 'City is required.' }).trim().min(1, 'Enter a city.'),
	postalCode: z.string().max(20, 'Postal code must be 20 characters or fewer.').optional(),
	type: locationTypeEnum,
});

export const locationCreateSchema = locationSchema.omit({ _id: true });
export const locationUpdateSchema = locationSchema.partial().omit({ _id: true });

export const locationQuerySchema = z.object({
	q: z.string().max(100, 'Search must be 100 characters or fewer.').optional(),
	country: z.string().max(50, 'Country must be 50 characters or fewer.').optional(),
	city: z.string().max(100, 'City must be 100 characters or fewer.').optional(),
	type: locationTypeEnum.optional(),
	page: z.coerce
		.number()
		.int('Page must be a whole number.')
		.positive('Page must be at least 1.')
		.default(1),
	limit: z.coerce
		.number()
		.int('Limit must be a whole number.')
		.positive('Limit must be at least 1.')
		.max(100, 'Limit cannot exceed 100 results.')
		.default(20),
});
