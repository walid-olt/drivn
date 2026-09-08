import z from 'zod';
import phoneNumberSchema from './phone.schema';
import { AGENCY_ONBOARDING_STATUS } from '../constants/status';

export const agencyOnboardingStatusSchema = z.enum(AGENCY_ONBOARDING_STATUS);

export const agencySchema = z.object({
	_id: z.string({ error: 'Agency id is required.' }),
	organizationId: z.string({ error: 'Organization id is required.' }),
	name: z
		.string({ error: 'Agency name is required.' })
		.min(3, 'Agency name must be at least 3 characters.')
		.max(100, 'Agency name must be 100 characters or fewer.'),
	slug: z
		.string({ error: 'Agency slug is required.' })
		.min(3, 'Agency slug must be at least 3 characters.')
		.max(100, 'Agency slug must be 100 characters or fewer.')
		.regex(
			/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
			'Slug must contain only lowercase letters, numbers, and hyphens',
		),
	logo: z.url('Logo must be a valid URL.').optional(),
	banner: z.url('Banner must be a valid URL.').optional(),
	summary: z.string().max(500, 'Summary must be 500 characters or fewer.').optional(),
	supportEmail: z.email('Support email must be a valid email address.').optional(),
	supportPhone: phoneNumberSchema.optional(),
	address: z
		.object({
			city: z.string().max(100, 'City must be 100 characters or fewer.').optional(),
			addressLine1: z.string().max(100, 'Address must be 100 characters or fewer.').optional(),
			zipCode: z.string().max(20, 'Postal code must be 20 characters or fewer.').optional(),
		})
		.optional(),
	onboardingStatus: agencyOnboardingStatusSchema.default('not_started'),
	operatingLocationIds: z.array(z.string({ error: 'Location id is required.' })).default([]),
});
export const createAgencySchema = agencySchema.omit({
	_id: true,
});
export const updateAgencySchema = agencySchema.partial().omit({
	_id: true,
	organizationId: true,
});

export const updateAgencyBranding = agencySchema.pick({
	logo: true,
	banner: true,
	summary: true,
});

export const updateAgencySupport = agencySchema.pick({
	supportEmail: true,
	supportPhone: true,
	address: true,
});

export const updateAgencyLocations = z.object({
	operatingLocationIds: z.array(z.string()).min(1, 'At least one operating location is required'),
});
