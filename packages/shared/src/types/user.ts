import z from 'zod';
import {
	userProfileSchema,
	createUserProfileSchema,
	updateUserProfileSchema,
} from '../schemas/index.ts';
export type UserProfile = z.infer<typeof userProfileSchema>;
export type createUserProfileDto = z.infer<typeof createUserProfileSchema>;
export type updateUserProfileDto = z.infer<typeof updateUserProfileSchema>;
export type User = UserProfile & {
	id: string;
	image?: string;
	email: string;
	emailVerified: boolean;
	name: string;
};
