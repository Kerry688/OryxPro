// Completely isolated MongoDB connection - Server-side only
// This file uses dynamic imports and runtime checks to prevent client-side bundling

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
let cached = (global as any).mongoIsolated;

if (!cached) {
  cached = (global as any).mongoIsolated = { conn: null, promise: null };
}

/**
 * Completely isolated MongoDB connection
 * Uses dynamic imports to prevent client-side bundling
 */
export async function connectToDatabaseIsolated(): Promise<{ client: any; db: any }> {
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
        // Dynamic import with error handling
        const mongodb = await import('mongodb');
        const { MongoClient } = mongodb;

        // Create client with minimal configuration
        const client = new MongoClient(MONGODB_URI, {
          serverSelectionTimeoutMS: 5000,
          connectTimeoutMS: 10000,
          // Disable all client-side features
          autoEncryption: undefined,
          monitorCommands: false,
          // Minimal pool settings
          maxPoolSize: 5,
          minPoolSize: 1,
          maxIdleTimeMS: 30000,
          // Disable compression to avoid zlib issues
          compressors: [],
          // Disable retry writes
          retryWrites: false,
        });

        // Connect with timeout
        await Promise.race([
          client.connect(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Connection timeout')), 10000)
          )
        ]);

        const db = client.db(DB_NAME);
        
        console.log('✅ MongoDB connected successfully (isolated)');
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
