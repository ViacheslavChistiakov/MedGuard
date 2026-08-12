import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not set")
}

export async function connectDB(): Promise<void> {
  await mongoose.connect(MONGODB_URI!, { dbName: MONGODB_DB_NAME })
  console.log(`Connected to MongoDB database "${mongoose.connection.name}"`)
}
