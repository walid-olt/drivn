import { z } from 'zod';
import phoneNumberSchema from './phone.schema.ts';
export const userProfileSchema = z.object({
	_id: z.string().length(24, 'Invalid user id'),
	userId: z.string().min(1, 'Invalid user id'),
	firstName: z
		.string()
		.nonempty('First name is required')
		.min(2, 'First name must be at least 2 characters long')
		.max(50, 'First name must be at most 50 characters long'),
	lastName: z
		.string()
		.nonempty('Last name is required')
		.min(2, 'Last name must be at least 2 characters long')
		.max(50, 'Last name must be at most 50 characters long'),
	birthDate: z.coerce.date().refine((date) => date <= new Date(), {
		error: 'Birth date cannot be in the future',
	}),
	phone: phoneNumberSchema,
	country: z
		.string()
		.nonempty('Country is required')
		.min(2, 'Country must be at least 2 characters long')
		.max(50, 'Country must be at most 50 characters long'),
});

// _id and userId are generated and handled by the server, so we omit them from the createUserProfileSchema
export const createUserProfileSchema = userProfileSchema.omit({
	_id: true,
	userId: true,
});

export const updateUserProfileSchema = userProfileSchema.partial().omit({
	_id: true,
	userId: true,
});
