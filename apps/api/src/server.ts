import { validateEnv } from './config/env.ts';
import { createApp } from './app.ts';
import { connectDB } from './lib/mongodb.ts';
import mongoose from 'mongoose';

async function bootstrap() {
	console.info('Bootstrapping app...');

	validateEnv();
	await connectDB();

	const app = createApp(mongoose.connection.db!);

	app.listen(process.env.PORT, () => {
		console.log(`Server running on ${process.env.BACKEND_URL}`);
	});
}

await bootstrap();
