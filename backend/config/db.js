import mongoose from 'mongoose';

/** Reuse connection on Vercel serverless cold starts */
const globalCache = globalThis;

const getCache = () => {
  if (!globalCache._mongoose) {
    globalCache._mongoose = { conn: null, promise: null };
  }
  return globalCache._mongoose;
};

const connectDB = async () => {
  const cached = getCache();
  if (cached.conn) return cached.conn;

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set');
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI)
      .then((mongooseInstance) => {
        console.log(`MongoDB connected: ${mongooseInstance.connection.host}`);
        return mongooseInstance;
      })
      .catch((error) => {
        cached.promise = null;
        console.error(`MongoDB error: ${error.message}`);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
