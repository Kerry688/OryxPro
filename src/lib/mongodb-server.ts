import { MongoClient, Db } from 'mongodb';

// MongoDB configuration - Server-side only
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (!DB_NAME) {
  throw new Error('Please define the DB_NAME environment variable inside .env.local');
}

/**
 * Server-side MongoDB connection
 * This should only be used in API routes and server-side code
 */
let cached = (global as any).mongoServer;

if (!cached) {
  cached = (global as any).mongoServer = { conn: null, promise: null };
}

export async function connectToDatabaseServer(): Promise<{ client: MongoClient; db: Db }> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = MongoClient.connect(MONGODB_URI, {
      // Server-side configuration
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      // Disable client-side encryption
      autoEncryption: undefined,
      monitorCommands: false,
    }).then((client) => {
      return {
        client,
        db: client.db(DB_NAME),
      };
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Export the database name for use in other files
export { DB_NAME };
