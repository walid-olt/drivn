import z from 'zod';
import {
	customerProfileSchema,
	createCustomerProfileSchema,
	updateCustomerProfileSchema,
} from '../schemas/index.ts';
export type CustomerProfile = z.infer<typeof customerProfileSchema>;
export type createCustomerProfileDto = z.infer<typeof createCustomerProfileSchema>;
export type updateCustomerProfileDto = z.infer<typeof updateCustomerProfileSchema>;
