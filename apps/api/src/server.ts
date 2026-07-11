import mongoose from 'mongoose';
import { config } from 'dotenv';
import { resolve } from 'node:path';
import { validateEnv } from './config/env.js';
import { createApp } from './app.js';

config({ path: resolve(process.cwd(), '../../', '.env.development') , quiet:true});

const env = validateEnv(process.env);

const app = createApp();

await mongoose.connect(env.MONGO_URI, {
	dbName: env.MONGO_INITDB_DATABASE,
}).then(()=>console.log("Mongodb connected"))

app.listen(env.PORT, () => {
	console.log(`Server running on http://localhost:${env.PORT}`);
});
