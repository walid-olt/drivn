import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { mongo } from 'mongoose';

export const auth = (db: mongo.Db) =>
	betterAuth({
		baseURL: process.env.BACKEND_URL,
		database: mongodbAdapter(db),
		emailAndPassword: {
			enabled: true,
			maxPasswordLength: 255,
			minPasswordLength: 8,

			// might add it later
			requireEmailVerification: false,
		},
	});
