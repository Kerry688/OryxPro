import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Chat, CreateChatData, ChatSearchOptions } from '@/lib/models/chat';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const chatsCollection = db.collection('chats');
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type') as ChatType;
    const status = searchParams.get('status') as ChatStatus;
    const searchTerm = searchParams.get('searchTerm');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const query: any = {};
    
    if (userId) {
      query['participants.userId'] = userId;
    }
    
    if (type) {
      query.type = type;
    }
    
    if (status) {
      query.status = status;
    } else {
      query.status = { $ne: 'deleted' };
    }
    
    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    const chats = await chatsCollection
      .find(query)
      .sort({ updatedAt: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      data: chats,
      total: chats.length
    });

  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chats' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const chatsCollection = db.collection('chats');
    const usersCollection = db.collection('users');
    
    const body: CreateChatData = await request.json();
    const { name, description, type, participants, settings, metadata } = body;

    // Validate required fields
    if (!name || !type || !participants || participants.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Name, type, and participants are required' },
        { status: 400 }
      );
    }

    // Get user details for participants
    const userDetails = await usersCollection
      .find({ _id: { $in: participants.map(id => new ObjectId(id)) } })
      .toArray();

    if (userDetails.length !== participants.length) {
      return NextResponse.json(
        { success: false, error: 'Some participants not found' },
        { status: 400 }
      );
    }

    // Create chat participants
    const chatParticipants = userDetails.map(user => ({
      userId: user._id.toString(),
      userName: `${user.firstName} ${user.lastName}`,
      userEmail: user.email,
      userAvatar: user.avatar,
      role: 'member' as const,
      joinedAt: new Date(),
      isActive: true
    }));

    // Make the first participant an admin
    if (chatParticipants.length > 0) {
      chatParticipants[0].role = 'admin';
    }

    const chatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newChat: Omit<Chat, '_id'> = {
      chatId,
      name,
      description,
      type,
      status: 'active',
      participants: chatParticipants,
      createdBy: chatParticipants[0].userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      settings: {
        allowMemberInvites: true,
        allowFileSharing: true,
        allowReactions: true,
        isPrivate: false,
        ...settings
      },
      metadata
    };

    const result = await chatsCollection.insertOne(newChat);

    if (result.insertedId) {
      const createdChat = await chatsCollection.findOne({ _id: result.insertedId });
      return NextResponse.json({
        success: true,
        data: createdChat,
        message: 'Chat created successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to create chat' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create chat' },
      { status: 500 }
    );
  }
}
