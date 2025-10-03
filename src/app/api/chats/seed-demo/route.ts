import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Chat, CreateChatData } from '@/lib/models/chat';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const chatsCollection = db.collection('chats');
    const messagesCollection = db.collection('messages');
    const usersCollection = db.collection('users');

    // Get demo users
    const users = await usersCollection.find({}).limit(10).toArray();
    
    if (users.length < 3) {
      return NextResponse.json(
        { success: false, error: 'Need at least 3 users to create demo chats' },
        { status: 400 }
      );
    }

    // Clear existing demo data
    await chatsCollection.deleteMany({ createdBy: { $in: users.map(u => u._id.toString()) } });
    await messagesCollection.deleteMany({});

    const demoChats = [
      {
        name: 'General Discussion',
        description: 'General team discussions and updates',
        type: 'channel' as const,
        participants: users.slice(0, 5).map(user => ({
          userId: user._id.toString(),
          userName: `${user.firstName} ${user.lastName}`,
          userEmail: user.email,
          userAvatar: user.avatar,
          role: 'member' as const,
          joinedAt: new Date(),
          isActive: true
        })),
        createdBy: users[0]._id.toString(),
        settings: {
          allowMemberInvites: true,
          allowFileSharing: true,
          allowReactions: true,
          isPrivate: false
        },
        metadata: {
          channelCategory: 'General',
          channelTopic: 'Team discussions'
        }
      },
      {
        name: 'Project Alpha',
        description: 'Discussion for Project Alpha development',
        type: 'group' as const,
        participants: users.slice(0, 4).map(user => ({
          userId: user._id.toString(),
          userName: `${user.firstName} ${user.lastName}`,
          userEmail: user.email,
          userAvatar: user.avatar,
          role: 'member' as const,
          joinedAt: new Date(),
          isActive: true
        })),
        createdBy: users[1]._id.toString(),
        settings: {
          allowMemberInvites: true,
          allowFileSharing: true,
          allowReactions: true,
          isPrivate: true
        },
        metadata: {
          groupPurpose: 'Project Alpha development team'
        }
      },
      {
        name: 'Sales Updates',
        description: 'Daily sales updates and targets',
        type: 'channel' as const,
        participants: users.slice(2, 6).map(user => ({
          userId: user._id.toString(),
          userName: `${user.firstName} ${user.lastName}`,
          userEmail: user.email,
          userAvatar: user.avatar,
          role: 'member' as const,
          joinedAt: new Date(),
          isActive: true
        })),
        createdBy: users[2]._id.toString(),
        settings: {
          allowMemberInvites: false,
          allowFileSharing: true,
          allowReactions: true,
          isPrivate: false
        },
        metadata: {
          channelCategory: 'Sales',
          channelTopic: 'Daily sales updates'
        }
      }
    ];

    const createdChats = [];

    for (const chatData of demoChats) {
      const chatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const newChat: Omit<Chat, '_id'> = {
        chatId,
        name: chatData.name,
        description: chatData.description,
        type: chatData.type,
        status: 'active',
        participants: chatData.participants,
        createdBy: chatData.createdBy,
        createdAt: new Date(),
        updatedAt: new Date(),
        settings: chatData.settings,
        metadata: chatData.metadata
      };

      const result = await chatsCollection.insertOne(newChat);
      const createdChat = await chatsCollection.findOne({ _id: result.insertedId });
      createdChats.push(createdChat);

      // Create demo messages for each chat
      const demoMessages = [
        {
          chatId,
          senderId: chatData.participants[0].userId,
          senderName: chatData.participants[0].userName,
          senderAvatar: chatData.participants[0].userAvatar,
          content: `Welcome to ${chatData.name}! 👋`,
          type: 'text' as const,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          isEdited: false,
          reactions: [],
          isDeleted: false
        },
        {
          chatId,
          senderId: chatData.participants[1].userId,
          senderName: chatData.participants[1].userName,
          senderAvatar: chatData.participants[1].userAvatar,
          content: 'Thanks for creating this chat! Looking forward to working together.',
          type: 'text' as const,
          timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
          isEdited: false,
          reactions: [],
          isDeleted: false
        },
        {
          chatId,
          senderId: chatData.participants[0].userId,
          senderName: chatData.participants[0].userName,
          senderAvatar: chatData.participants[0].userAvatar,
          content: 'Let me know if you have any questions or need help with anything.',
          type: 'text' as const,
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
          isEdited: false,
          reactions: [],
          isDeleted: false
        }
      ];

      // Insert demo messages
      await messagesCollection.insertMany(demoMessages);

      // Update chat with last message
      await chatsCollection.updateOne(
        { _id: result.insertedId },
        {
          $set: {
            lastMessage: {
              content: demoMessages[demoMessages.length - 1].content,
              senderName: demoMessages[demoMessages.length - 1].senderName,
              timestamp: demoMessages[demoMessages.length - 1].timestamp,
              type: demoMessages[demoMessages.length - 1].type
            },
            updatedAt: new Date()
          }
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: createdChats,
      message: `Created ${createdChats.length} demo chats with messages`,
      count: createdChats.length
    });

  } catch (error) {
    console.error('Error seeding demo chats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed demo chats' },
      { status: 500 }
    );
  }
}
