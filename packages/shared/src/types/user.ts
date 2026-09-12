import z from 'zod';
import {
	customerProfileSchema,
	createCustomerProfileSchema,
	updateCustomerProfileSchema,
} from '../schemas/index.ts';
export type CustomerProfile = z.infer<typeof customerProfileSchema>;
export type createCustomerProfileDto = z.infer<typeof createCustomerProfileSchema>;
export type updateCustomerProfileDto = z.infer<typeof updateCustomerProfileSchema>;
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
