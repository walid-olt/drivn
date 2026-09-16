import z from 'zod';
import {
	customerProfileSchema,
	createCustomerProfileSchema,
	updateCustomerProfileSchema,
} from '../schemas/index.ts';
export type CustomerProfile = z.infer<typeof customerProfileSchema>;
export type CreateCustomerProfileDto = z.infer<typeof createCustomerProfileSchema>;
export type UpdateCustomerProfileDto = z.infer<typeof updateCustomerProfileSchema>;
export type User = {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	email: string;
	emailVerified: boolean;
	name: string;
	image?: string | null | undefined;
	type: string;
};
