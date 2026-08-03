import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { connectDB } from './mongodb';
import mongoose from 'mongoose';
await connectDB(); // short circuits to ensure the database is connected before initializing auth
const db = mongoose.connection.db!;
export const auth = betterAuth({
	baseURL: process.env.BACKEND_URL,
	database: mongodbAdapter(db),
	emailAndPassword: {
		enabled: true,
	},
});
