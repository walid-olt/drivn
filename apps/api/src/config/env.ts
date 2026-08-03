import z from 'zod';

export const envSchema = z.object({
	MONGODB_URI: z.url(),
	MONGODB_DBNAME: z.string().default('drivn-dev'),
	PORT: z.coerce.number().default(3000),
	BACKEND_URL: z.url().default('http://localhost:3000'),
	FRONTEND_URL: z.url().default('http://localhost:5173'),
	BETTER_AUTH_SECRET: z
		.string()
		.min(32, { error: 'BETTER_AUTH_SECRET too short, use a stronger one' }),
	NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type Env = z.infer<typeof envSchema>;
export function validateEnv() {
	const result = envSchema.safeParse(process.env);
	if (!result.success) {
		console.error('Invalid environment configuration options:');
		console.error(JSON.stringify(result.error.format(), null, 2));
		throw new Error('Environment validation failed');
	}
	console.log('env loaded');

	Object.assign(process.env, result.data);
}
