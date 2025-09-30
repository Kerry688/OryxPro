import { MongoClient, Db, Collection } from 'mongodb';

// MongoDB connection configuration
const MONGODB_URI = "mongodb://Admin:JB8tq6KpgOjPb9FK@142.171.149.188:27017/Oryx?retryWrites=true&loadBalanced=false&serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-1";
const DB_NAME = "Oryx";

// Global connection cache
let client: MongoClient | null = null;
let db: Db | null = null;

/**
 * Connect to MongoDB and return the database instance
 */
export async function connectToMongoDB(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });

    await client.connect();
    db = client.db(DB_NAME);
    
    console.log('✅ Connected to MongoDB successfully');
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

/**
 * Get a specific collection from the database
 */
export async function getCollection<T = any>(collectionName: string): Promise<Collection<T>> {
  const database = await connectToMongoDB();
  return database.collection<T>(collectionName);
}

/**
 * Close the MongoDB connection
 */
export async function closeMongoDBConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('🔌 MongoDB connection closed');
  }
}

/**
 * Test the MongoDB connection
 */
export async function testMongoDBConnection(): Promise<boolean> {
  try {
    const database = await connectToMongoDB();
    await database.admin().ping();
    console.log('✅ MongoDB connection test successful');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error);
    return false;
  }
}

// Export database name for reference
export { DB_NAME };


