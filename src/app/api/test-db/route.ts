import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb-client';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing database connection...');
    
    const db = await connectToMongoDB();
    
    // Test basic database operations
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Test inserting a simple document
    const testCollection = db.collection('test');
    const testDoc = {
      message: 'Database connection test',
      timestamp: new Date(),
      testId: Math.random().toString(36).substring(7)
    };
    
    const insertResult = await testCollection.insertOne(testDoc);
    console.log('Test document inserted:', insertResult.insertedId);
    
    // Clean up test document
    await testCollection.deleteOne({ _id: insertResult.insertedId });
    console.log('Test document cleaned up');
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      collections: collections.map(c => c.name),
      testResult: 'Insert and delete operations completed successfully'
    });
    
  } catch (error) {
    console.error('Database connection test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Database connection failed'
    }, { status: 500 });
  }
}
