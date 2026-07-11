import z from 'zod';

export const envSchema = z.object({
	MONGO_URI: z.url(),
	MONGO_INITDB_ROOT_USERNAME: z.string(),
	MONGO_INITDB_ROOT_PASSWORD: z
		.string()
		.min(8, 'MONGO_INITDB_ROOT_PASSWORD too short, use a stronger one'),
	MONGO_INITDB_DATABASE: z.string().default('drivn'),
	MONGO_INITDB_PORT: z.coerce.number().default(27017),
	JWT_SECRET: z.string().min(32, { error: 'SESSION_SECRET too short, use a stronger one' }),
	PORT: z.coerce.number().default(3000),
	NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type Env = z.infer<typeof envSchema>;
export function validateEnv(env: Record<string, unknown>) {
	const result = envSchema.safeParse(env);
	if (!result.success) {
		console.error('Invalid environment configuration options:');
		console.error(JSON.stringify(result.error.format(), null, 2));
		throw new Error('Environment validation failed');
	}
  console.log("env loaded");
  
	return result.data;
}
