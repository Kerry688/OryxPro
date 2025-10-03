// Server-only MongoDB utilities
// This file should never be imported on the client side

import { MongoClient, Db } from 'mongodb';

// Ensure this only runs on the server
if (typeof window !== 'undefined') {
  throw new Error('This module can only be used on the server side');
}

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
 * Server-side MongoDB connection with minimal configuration
 * This should only be used in API routes and server-side code
 */
let cached = (global as any).mongoServerOnly;

if (!cached) {
  cached = (global as any).mongoServerOnly = { conn: null, promise: null };
}

export async function connectToDatabaseServerOnly(): Promise<{ client: MongoClient; db: Db }> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = MongoClient.connect(MONGODB_URI, {
      // Minimal server-side configuration
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      // Disable all client-side features that cause browser issues
      autoEncryption: undefined,
      monitorCommands: false,
      // Use minimal driver features
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      serverSelectionRetryDelayMS: 1000,
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
