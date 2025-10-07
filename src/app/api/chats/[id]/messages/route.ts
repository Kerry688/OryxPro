import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase();
    const messagesCollection = db.collection('messages');
    
    const chatId = params.id;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch messages for the specific chat
    const messages = await messagesCollection
      .find({ 
        chatId: chatId,
        isDeleted: { $ne: true }
      })
      .sort({ timestamp: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      data: messages.reverse() // Reverse to show oldest first
    });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chat messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase();
    const messagesCollection = db.collection('messages');
    const chatsCollection = db.collection('chats');
    
    const chatId = params.id;
    const body = await request.json();
    const { content, type = 'text', replyTo, attachments } = body;

    // Validate required fields
    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, error: 'Message content is required' },
        { status: 400 }
      );
    }

    // Verify chat exists and get chat info
    const chat = await chatsCollection.findOne({ chatId: chatId });
    if (!chat) {
      return NextResponse.json(
        { success: false, error: 'Chat not found' },
        { status: 404 }
      );
    }

    // For now, we'll use a placeholder sender - in a real app, this would come from authentication
    const messageId = new ObjectId();
    const message = {
      _id: messageId,
      chatId: chatId,
      senderId: 'current-user-id', // This should come from auth context
      senderName: 'Current User', // This should come from auth context
      senderAvatar: null,
      content: content.trim(),
      type: type,
      timestamp: new Date(),
      editedAt: null,
      isEdited: false,
      replyTo: replyTo || null,
      attachments: attachments || [],
      reactions: [],
      isDeleted: false,
      deletedAt: null,
      deletedBy: null
    };

    // Save message to database
    await messagesCollection.insertOne(message);

    // Update chat's last message and updatedAt
    await chatsCollection.updateOne(
      { chatId: chatId },
      {
        $set: {
          lastMessage: {
            content: content.trim(),
            senderName: message.senderName,
            timestamp: message.timestamp,
            type: type
          },
          updatedAt: new Date()
        }
      }
    );

    return NextResponse.json({
      success: true,
      data: message,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Error creating chat message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create chat message' },
      { status: 500 }
    );
  }
}