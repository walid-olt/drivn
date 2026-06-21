import z from 'zod';

export const envSchema = z.object({
  MONGO_URI: z.url(),
  MONGO_INITDB_ROOT_USERNAME: z.string(),
  MONGO_INITDB_ROOT_PASSWORD: z
    .string()
    .min(8, 'Password must be at least 8 characters long'),
  MONGO_INITDB_DATABASE: z.string().default('drivn'),
  MONGO_INITDB_PORT: z.coerce.number().default(27017),
});
