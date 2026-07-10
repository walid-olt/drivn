import z from "zod";
import { userSchema, userResponseSchema } from "../schemas";

export type User = z.infer<typeof userSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
