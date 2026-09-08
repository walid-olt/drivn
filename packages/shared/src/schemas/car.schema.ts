import z from 'zod';
import {
	ACCEPTED_IMAGE_TYPES,
	MAX_CAR_IMAGE_SIZE_BYTES,
	MAX_CAR_IMAGES,
	MAX_TOTAL_CAR_IMAGE_UPLOAD_SIZE_BYTE,
	MIN_CAR_IMAGES,
} from '../constants/files';
export const carSchema = z.object({
	_id: z.string({ error: 'Car id is required.' }),
	organizationId: z.string({ error: 'Organization id is required.' }),
	agencyId: z.string({ error: 'Agency id is required.' }),
	make: z
		.string({ error: 'Car make is required.' })
		.trim()
		.min(1, 'Enter the car make.')
		.max(100, 'Car make must be 100 characters or fewer.'),
	model: z
		.string({ error: 'Car model is required.' })
		.trim()
		.min(1, 'Enter the car model.')
		.max(100, 'Car model must be 100 characters or fewer.'),
	year: z
		.number({ error: 'Enter the car model year.' })
		.int('Year must be a whole number.')
		.min(1886, 'Year must be 1886 or later.')
		.max(2100, 'Year must be 2100 or earlier.'),
	vin: z.string().length(17, 'VIN must be exactly 17 characters.').optional(),
	licensePlate: z.string().max(20, 'License plate must be 20 characters or fewer.').optional(),
	color: z.string().max(50, 'Color must be 50 characters or fewer.').optional(),
	status: z
		.enum(['available', 'rented', 'maintenance', 'inactive'], {
			error: 'Choose a valid car status.',
		})
		.default('available'),
	category: z
		.enum(['sedan', 'suv', 'hatchback', 'coupe', 'convertible', 'minivan', 'truck', 'luxury'], {
			error: 'Choose a valid car category.',
		})
		.default('sedan'),

	transmission: z
		.enum(['automatic', 'manual', 'semi-automatic'], {
			error: 'Choose a valid transmission type.',
		})
		.default('automatic'),

	fuelType: z
		.enum(['gasoline', 'diesel', 'electric', 'hybrid', 'plug-in-hybrid'], {
			error: 'Choose a valid fuel type.',
		})
		.default('gasoline'),

	seatingCapacity: z
		.number()
		.int('Seating capacity must be a whole number.')
		.min(1, 'A car must have at least one seat.')
		.max(12, 'Seating capacity cannot exceed 12.')
		.default(5),
	doors: z
		.number()
		.int('Number of doors must be a whole number.')
		.min(2, 'A car must have at least 2 doors.')
		.max(6, 'A car cannot have more than 6 doors.')
		.default(4),

	kilometrage: z.number().nonnegative('Kilometrage cannot be negative').default(0),
	dailyRate: z
		.number({ error: 'Enter a daily rental rate.' })
		.positive('Daily rate must be greater than zero.'),

	images: z
		.array(z.url('Each image must be a valid URL.'))
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
