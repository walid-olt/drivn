import z from 'zod';
import {
	ACCEPTED_IMAGE_TYPES,
	MAX_CAR_IMAGE_SIZE_BYTES,
	MAX_CAR_IMAGES,
	MAX_TOTAL_CAR_IMAGE_UPLOAD_SIZE_BYTE,
	MIN_CAR_IMAGES,
} from '../constants/files';
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
	status: z.enum(['available', 'rented', 'maintenance', 'inactive']).default('available'),
	category: z
		.enum(['sedan', 'suv', 'hatchback', 'coupe', 'convertible', 'minivan', 'truck', 'luxury'])
		.default('sedan'),

	transmission: z.enum(['automatic', 'manual', 'semi-automatic']).default('automatic'),

	fuelType: z
		.enum(['gasoline', 'diesel', 'electric', 'hybrid', 'plug-in-hybrid'])
		.default('gasoline'),

	seatingCapacity: z.number().int().min(1).max(12).default(5),
	doors: z.number().int().min(2).max(6).default(4),

	kilometrage: z.number().nonnegative('Kilometrage cannot be negative').default(0),
	dailyRate: z.number().positive('Daily rate must be greater than zero'),

	images: z
		.array(z.url())
		.max(MAX_CAR_IMAGES, 'Exceeded maximum number of images')
		.min(MIN_CAR_IMAGES, 'Each car must have at least one image'),
});

// omit identifiers since they will be inferred from the auth context and agency context
export const createCarSchema = carSchema.omit({
	_id: true,
	agencyId: true,
	organizationId: true,
});

// validate actual image files on the client side.
export const carImageSchema = z
	.file()
	.mime(ACCEPTED_IMAGE_TYPES, 'Only standard image formats are allowed')
	.max(MAX_CAR_IMAGE_SIZE_BYTES, 'Individual file size exceeds the limit');

export const createCarFormSchema = carSchema
	.omit({
		images: true,
		_id: true,
		organizationId: true,
		agencyId: true,
	})
	.extend({
		images: z
			.array(carImageSchema)
			.min(MIN_CAR_IMAGES, 'Each car must have at least one image')
			.max(MAX_CAR_IMAGES, 'Exceeded maximum number of images')
			.refine(
				(files) =>
					files.reduce((acc, file) => acc + file.size, 0) <= MAX_TOTAL_CAR_IMAGE_UPLOAD_SIZE_BYTE,
				'Total upload size is too large',
			)
			.refine(
				(files) => new Set(files.map((f) => `${(f as any).name}-${f.size}`)).size === files.length,
				'Duplicate images are not allowed',
			),
	});
export const updateCarSchema = carSchema.partial().omit({
	_id: true,
	organizationId: true,
});
