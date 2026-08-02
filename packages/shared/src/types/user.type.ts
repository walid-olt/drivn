import z from 'zod';
import { userSchema, creatUserSchema, userResponseSchema } from '../schemas';

export type User = z.infer<typeof userSchema>;
export type createUserDto = z.infer<typeof creatUserSchema>;
export type userResponse = z.infer<typeof userResponseSchema>;
