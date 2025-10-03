// Dynamic MongoDB imports - Server-side only
// This ensures MongoDB is never bundled on the client side

import { Db } from 'mongodb';

// Ensure this only runs on the server
if (typeof window !== 'undefined') {
  throw new Error('This module can only be used on the server side');
}

// MongoDB configuration
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (!DB_NAME) {
  throw new Error('Please define the DB_NAME environment variable inside .env.local');
}

/**
 * Dynamic MongoDB connection using dynamic imports
 * This prevents MongoDB from being bundled on the client side
 */
let cached = (global as any).mongoDynamic;

if (!cached) {
  cached = (global as any).mongoDynamic = { conn: null, promise: null };
}

export async function connectToDatabaseDynamic(): Promise<{ client: any; db: Db }> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = (async () => {
      // Dynamic import of MongoDB to prevent client-side bundling
      const { MongoClient } = await import('mongodb');
      
      const client = new MongoClient(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
        // Minimal configuration to avoid client-side encryption
        autoEncryption: undefined,
        monitorCommands: false,
        maxPoolSize: 10,
        minPoolSize: 1,
        maxIdleTimeMS: 30000,
      });

      await client.connect();
      const db = client.db(DB_NAME);
      
      return {
        client,
        db,
      };
    })();
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
