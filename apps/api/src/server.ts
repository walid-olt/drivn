import { config } from 'dotenv';
import { resolve } from 'node:path';
import { validateEnv } from './config/env.ts';
import { createApp } from './app.ts';
import { connectDB } from './lib/mongodb.ts';

async function bootstrap() {
	console.info('Bootstrapping app...');
	config({
		path: resolve(process.cwd(), '../../', '.env.development'),
		quiet: true,
	});

	validateEnv();
	const app = createApp();
	await connectDB();

	app.listen(process.env.PORT, () => {
		console.log(`Server running on ${process.env.BACKEND_URL}`);
	});
}

await bootstrap();
