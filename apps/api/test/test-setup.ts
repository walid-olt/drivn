import { fileURLToPath } from 'node:url';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { beforeAll, afterAll, beforeEach } from 'vitest';

/**
 * @description
 * testing setup, loads `.env.test` from the repo root and spins up an in-memory mongodb instance,
 * it's way cheaper than a dedicated test db.
 *
 * note: `MONGODB_URI` in `.env.test` is a placeholder, the in-memory instance
 * provides the real uri which is assigned to `process.env.MONGODB_URI` here.
 */

dotenv.config({
	path: fileURLToPath(new URL('../../../.env.test', import.meta.url)),
});

let mongod: MongoMemoryServer;
let uploadDir: string;

beforeAll(async () => {
	process.env.NODE_ENV = 'test';

	uploadDir = mkdtempSync(path.join(tmpdir(), 'drivn-uploads-'));
	process.env.UPLOAD_DIR = uploadDir;

	mongod = await MongoMemoryServer.create();

	const uri = mongod.getUri();
	process.env.MONGODB_URI = uri;

	await mongoose.connect(uri, { dbName: process.env.MONGODB_DBNAME });
});

beforeEach(async () => {
	if (mongoose.connection.db) {
		const collections = await mongoose.connection.db.collections();
		for (const collection of collections) {
			await collection.deleteMany({});
		}
	}
});

afterAll(async () => {
	await mongoose.disconnect();
	if (mongod) {
		await mongod.stop();
	}
	if (uploadDir) {
		rmSync(uploadDir, { recursive: true, force: true });
	}
});
