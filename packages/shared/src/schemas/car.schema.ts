import z from 'zod';

// Car schema
export const carSchema = z.object({
	_id: z.string(),
	organizationId: z.string(),
	agencyId: z.string(),
	make: z.string().min(1).max(100),
	model: z.string().min(1).max(100),
	year: z.number().int().min(1886).max(2100),
	vin: z.string().length(17).optional(),
	licensePlate: z.string().max(20).optional(),
	color: z.string().max(50).optional(),
	status: z.enum(['available', 'rented', 'maintenance']).default('available'),
	images: z.array(z.string().url()).max(5).optional(),
	metadata: z.record(z.any()).optional(),
});

export const createCarSchema = carSchema.omit({
	_id: true,
	organizationId: true,
});

export const updateCarSchema = carSchema.partial().omit({
	_id: true,
	organizationId: true,
});
