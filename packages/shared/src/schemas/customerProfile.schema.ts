import { z } from 'zod';
import phoneNumberSchema from './phone.schema.ts';
export const customerProfileSchema = z.object({
	_id: z.string({ error: 'Profile id is required.' }).length(24, 'Profile id must be valid'),
	userId: z.string({ error: 'User id is required.' }).min(1, 'User id must be valid'),
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
	birthDate: z.coerce
		.date({ error: 'Enter a valid birth date.' })
		.refine((date) => date <= new Date(), {
			error: 'Birth date cannot be in the future',
		}),
	phone: phoneNumberSchema,
	country: z
		.string()
		.nonempty('Country is required')
		.min(2, 'Country must be at least 2 characters long')
		.max(50, 'Country must be at most 50 characters long'),
});

// _id and userId are generated and handled by the server, so we omit them from the createCustomerProfileSchema
export const createCustomerProfileSchema = customerProfileSchema
	.omit({
		_id: true,
		userId: true,
	})
	.extend({
		email: z.email('Invalid email address').nonempty('Email is required'),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters long')
			.max(128)
			.nonempty('Password is required'),
		passwordConfirmation: z
			.string()
			.min(8, 'Password must be at least 8 characters long')
			.max(128)
			.nonempty('Password is required'),
	})
	.refine((data) => data.password === data.passwordConfirmation, {
		message: 'Passwords do not match',
		path: ['passwordConfirmation'], // path of the error
	});

export const updateCustomerProfileSchema = customerProfileSchema.partial().omit({
	_id: true,
	userId: true,
});
