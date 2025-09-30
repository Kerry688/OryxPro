import { NextRequest, NextResponse } from 'next/server';
import { testMongoDBConnection, connectToMongoDB } from '@/lib/mongodb-client';

export async function GET(request: NextRequest) {
  try {
    // Test the MongoDB connection
    const isConnected = await testMongoDBConnection();
    
    if (isConnected) {
      // Get database info
      const db = await connectToMongoDB();
      const collections = await db.listCollections().toArray();
      
      return NextResponse.json({
        success: true,
        message: 'MongoDB connection successful',
        database: db.databaseName,
        collections: collections.map(col => col.name),
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'MongoDB connection failed',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
  } catch (error) {
    console.error('MongoDB test error:', error);
    return NextResponse.json({
      success: false,
      message: 'MongoDB connection error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    if (action === 'create-collections') {
      const db = await connectToMongoDB();
      
      // Create collections with validation
      const collections = [
        { name: 'users', validator: { $jsonSchema: { bsonType: 'object', required: ['email', 'username'] } } },
        { name: 'products', validator: { $jsonSchema: { bsonType: 'object', required: ['sku', 'name', 'price'] } } },
        { name: 'orders', validator: { $jsonSchema: { bsonType: 'object', required: ['orderNumber', 'customerId'] } } },
        { name: 'customers', validator: { $jsonSchema: { bsonType: 'object', required: ['email', 'firstName', 'lastName'] } } },
        { name: 'branches', validator: { $jsonSchema: { bsonType: 'object', required: ['name', 'address'] } } },
        { name: 'vendors', validator: { $jsonSchema: { bsonType: 'object', required: ['name', 'email'] } } }
      ];
      
      const results = [];
      for (const collection of collections) {
        try {
          await db.createCollection(collection.name, { validator: collection.validator });
          results.push({ name: collection.name, status: 'created' });
        } catch (error: any) {
          if (error.code === 48) { // Collection already exists
            results.push({ name: collection.name, status: 'exists' });
          } else {
            results.push({ name: collection.name, status: 'error', error: error.message });
          }
        }
      }
      
      return NextResponse.json({
        success: true,
        message: 'Collections setup completed',
        results,
        timestamp: new Date().toISOString()
      });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Invalid action',
      timestamp: new Date().toISOString()
    }, { status: 400 });
    
  } catch (error) {
    console.error('MongoDB setup error:', error);
    return NextResponse.json({
      success: false,
      message: 'MongoDB setup error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

