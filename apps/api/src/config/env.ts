import z from 'zod';

export const envSchema = z.object({
	MONGODB_URI: z.url(),
	MONGODB_DBNAME: z.string().default('drivn-dev'),
	JWT_SECRET: z.string().min(32, { error: 'JWT_SECRET too short, use a stronger one' }),
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
	console.log('env loaded');

	return result.data;
}
