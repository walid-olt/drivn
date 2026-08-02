import mongoose from 'mongoose';
import { config } from 'dotenv';
import { resolve } from 'node:path';
import { validateEnv } from './config/env.ts';
import { createApp } from './app.ts';

async function bootstrap() {
	console.info('Bootstrapping app...');
	config({ path: resolve(process.cwd(), '../../', '.env.development'), quiet: true });

	validateEnv();
	const app = createApp();

	await mongoose
		.connect(process.env.MONGODB_URI, {
			dbName: process.env.MONGODB_DBNAME,
		})
		.then(() => console.log('Mongodb connected'))
		.catch((e) => {
			console.error("Couldn't connect to Mongodb", e);
			process.exit(1);
		});

	app.listen(process.env.PORT, () => {
		console.log(`Server running on http://localhost:${process.env.PORT}`);
	});
}

await bootstrap();
