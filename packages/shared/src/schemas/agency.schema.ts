import z from 'zod';
import phoneNumberSchema from './phone.schema';
export const agencySchema = z.object({
	_id: z.string(),
	organizationId: z.string(),
	name: z.string().min(3).max(100),
	slug: z
		.string()
		.min(3)
		.max(100)
		.regex(
			/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
			'Slug must contain only lowercase letters, numbers, and hyphens',
		),
	logo: z.url().optional(),
	banner: z.url().optional(),
	summary: z.string().max(500).optional(),
	supportEmail: z.email().optional(),
	supportPhone: phoneNumberSchema.optional(),
	address: z
		.object({
			city: z.string().max(100).optional(),
			country: z.string().max(100).optional(),
			addressLine1: z.string().max(100).optional(),
			zipCode: z.string().max(20).optional(),
		})
		.optional(),
});
export const createAgencySchema = agencySchema.omit({
	_id: true,
	organizationId: true,
});

export const updateAgencySchema = agencySchema.partial().omit({
	_id: true,
	organizationId: true,
});
