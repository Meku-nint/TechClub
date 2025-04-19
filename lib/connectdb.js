import mongoose from 'mongoose';
const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
  throw new Error('Please define the MONGO_URL environment variable inside .env.local');
}
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}
async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const options = {
      bufferCommands: false,
    };
    cached.promise = mongoose
      .connect(MONGO_URL, options)
      .then((mongooseInstance) => mongooseInstance);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
export default connectToDatabase;