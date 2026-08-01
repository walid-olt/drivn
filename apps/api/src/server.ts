import mongoose from 'mongoose';
import { config } from 'dotenv';
import { resolve } from 'node:path';
import { validateEnv } from './config/env.js';
import { createApp } from './app.js';

async function bootstrap() {
	console.info('Bootstrapping app...');
	config({ path: resolve(process.cwd(), '../../', '.env.development'), quiet: true });

	const env = validateEnv(process.env);

	const app = createApp();

	await mongoose
		.connect(env.MONGODB_URI, {
			dbName: env.MONGODB_DBNAME,
		})
		.then(() => console.log('Mongodb connected'))
		.catch((e) => {
			console.error("Couldn't connect to Mongodb", e);
			process.exit(1);
		});

	app.listen(env.PORT, () => {
		console.log(`Server running on http://localhost:${env.PORT}`);
	});
}

await bootstrap();
