import mongoose from 'mongoose';
import { validateEnv } from '../src/config/env';
import { connectDB } from '../src/lib/mongodb';
async function clearDB() {
	validateEnv();
	await connectDB();
	const cols = await mongoose?.connection?.db?.collections();
	if (!cols) {
		console.log('No collections found in the database');
		return;
	}
	for (const col of cols) {
		await col.deleteMany({});
	}
	console.log('Database cleared successfully');
	//@ts-ignore
	process.exit(0);
}

await clearDB();
