import z from 'zod';
import { userSchema, creatUserSchema } from '../schemas/index.ts';

export type User = z.infer<typeof userSchema>;
export type createUserDto = z.infer<typeof creatUserSchema>;
