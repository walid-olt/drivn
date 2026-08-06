import { z } from 'zod';
import phoneNumberSchema from './phone.schema.ts';
// base schema for user validation
export const userSchema = z.object({
	id: z.string().length(24, 'Invalid user id'),
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
	age: z
		.number()
		.int('Age must be an integer')
		.min(18, 'Age must be at least 18')
		.max(120, 'Age must be at most 120'),
	email: z.email('email must be a valid email address').nonempty('Email is required'),
	phone: phoneNumberSchema,
	country: z
		.string()
		.nonempty('Country is required')
		.min(2, 'Country must be at least 2 characters long')
		.max(50, 'Country must be at most 50 characters long'),
});

// user creation schema for user validation
export const creatUserSchema = userSchema.omit({ id: true }).extend({
	password: z
		.string()
		.nonempty('Password is required')
		.min(8, 'Password must be at least 8 characters long')
		.max(50, 'Password must be at most 50 characters long'),
});
