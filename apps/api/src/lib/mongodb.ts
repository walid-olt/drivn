import mongoose from "mongoose";

export async function connectDB() {
  await mongoose
    .connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DBNAME,
    })
    .then(() => console.log("Mongodb connected"))
    .catch((e) => {
      console.error("Couldn't connect to Mongodb", e);
      process.exit(1);
    });
}
