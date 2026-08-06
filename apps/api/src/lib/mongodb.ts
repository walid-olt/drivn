import mongoose from 'mongoose';
export async function connectDB() {
	const { MONGODB_URI, MONGODB_DBNAME } = process.env;
	if (!MONGODB_URI || !MONGODB_DBNAME) throw new Error('DB credentials not found in environment ');
	await mongoose
		.connect(process.env.MONGODB_URI, {
			dbName: process.env.MONGODB_DBNAME,
		})
		.then(() => console.log('Mongodb connected'))
		.catch((e) => {
			console.error("Couldn't connect to Mongodb", e);
			process.exit(1);
		});
}
