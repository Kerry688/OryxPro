import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    
    // Test database connection
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    // Check if chats collection exists
    const chatsExists = collectionNames.includes('chats');
    const messagesExists = collectionNames.includes('messages');
    
    // Get counts
    const chatsCount = chatsExists ? await db.collection('chats').countDocuments() : 0;
    const messagesCount = messagesExists ? await db.collection('messages').countDocuments() : 0;
    
    return NextResponse.json({
      success: true,
      data: {
        database: 'Connected',
        collections: collectionNames,
        chats: {
          exists: chatsExists,
          count: chatsCount
        },
        messages: {
          exists: messagesExists,
          count: messagesCount
        }
      }
    });

  } catch (error) {
    console.error('Error testing chat database connection:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to connect to database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
