// Minimal MongoDB connection - Server-side only
// This uses the most basic MongoDB connection possible to avoid client-side encryption

// Runtime check to ensure this only runs on server
if (typeof window !== 'undefined') {
  throw new Error('MongoDB operations can only be performed on the server side');
}

// Environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (!DB_NAME) {
  throw new Error('Please define the DB_NAME environment variable inside .env.local');
}

// Global connection cache
let cached = (global as any).mongoMinimal;

if (!cached) {
  cached = (global as any).mongoMinimal = { conn: null, promise: null };
}

/**
 * Minimal MongoDB connection that avoids client-side encryption entirely
 */
export async function connectToDatabaseMinimal(): Promise<{ client: any; db: any }> {
  // Double-check we're on server
  if (typeof window !== 'undefined') {
    throw new Error('This function can only be called on the server side');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = (async () => {
      try {
        // Use require instead of import to avoid bundling issues
        const mongodb = require('mongodb');
        const { MongoClient } = mongodb;

        // Create client with absolute minimal configuration
        const client = new MongoClient(MONGODB_URI, {
          // Basic connection settings only
          serverSelectionTimeoutMS: 5000,
          connectTimeoutMS: 10000,
          // Minimal pool settings
          maxPoolSize: 1,
          minPoolSize: 1,
          maxIdleTimeMS: 30000,
          // Disable all compression and advanced features
          compressors: [],
          retryWrites: false,
          retryReads: false,
        });

        // Connect with basic error handling
        await client.connect();
        const db = client.db(DB_NAME);
        
        console.log('✅ MongoDB connected successfully (minimal)');
        return { client, db };
      } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        throw error;
      }
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

// Export database name
export { DB_NAME };
