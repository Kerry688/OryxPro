import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CreateMessageDTO } from '@/lib/models/employee-portal';

export async function GET(request: NextRequest) {
  try {
    const db = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const type = searchParams.get('type') || 'received'; // 'received', 'sent', 'all'
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    if (!employeeId) {
      return NextResponse.json(
        { success: false, error: 'Employee ID is required' },
        { status: 400 }
      );
    }
    
    let query: any = {};
    
    if (type === 'received') {
      query.toEmployeeId = employeeId;
    } else if (type === 'sent') {
      query.fromEmployeeId = employeeId;
    } else if (type === 'all') {
      query.$or = [
        { toEmployeeId: employeeId },
        { fromEmployeeId: employeeId }
      ];
    }
    
    const messages = await db.collection('messages')
      .find(query)
      .sort({ sentDate: -1 })
      .limit(limit)
      .skip(offset)
      .toArray();
    
    const formattedMessages = messages.map(message => ({
      messageId: message.messageId || message._id.toString(),
      fromEmployeeId: message.fromEmployeeId,
      fromEmployeeName: message.fromEmployeeName,
      fromEmployeeRole: message.fromEmployeeRole,
      toEmployeeId: message.toEmployeeId,
      toEmployeeName: message.toEmployeeName,
      subject: message.subject,
      content: message.content,
      type: message.type,
      priority: message.priority,
      attachments: message.attachments || [],
      isRead: message.isRead || false,
      readDate: message.readDate ? new Date(message.readDate) : undefined,
      isImportant: message.isImportant || false,
      isArchived: message.isArchived || false,
      sentDate: new Date(message.sentDate),
      repliedTo: message.repliedTo,
      threadId: message.threadId
    }));
    
    return NextResponse.json({
      success: true,
      data: formattedMessages,
      count: formattedMessages.length
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await connectToDatabase();
    const body: CreateMessageDTO & { fromEmployeeId: string } = await request.json();
    
    const { fromEmployeeId, toEmployeeId, subject, content, type, priority, attachments } = body;
    
    if (!fromEmployeeId || !toEmployeeId || !subject || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get sender and recipient info
    const sender = await db.collection('employees').findOne({ employeeId: fromEmployeeId });
    const recipient = await db.collection('employees').findOne({ employeeId: toEmployeeId });
    
    if (!sender || !recipient) {
      return NextResponse.json(
        { success: false, error: 'Invalid sender or recipient' },
        { status: 400 }
      );
    }
    
    const message = {
      messageId: `MSG${Date.now()}`,
      fromEmployeeId,
      fromEmployeeName: sender.name,
      fromEmployeeRole: sender.position,
      toEmployeeId,
      toEmployeeName: recipient.name,
      subject,
      content,
      type: type || 'direct',
      priority: priority || 'medium',
      attachments: attachments || [],
      isRead: false,
      isImportant: priority === 'urgent' || priority === 'high',
      isArchived: false,
      sentDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('messages').insertOne(message);
    
    return NextResponse.json({
      success: true,
      data: message,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const db = await connectToDatabase();
    const body = await request.json();
    const { messageId, employeeId, action, ...updateData } = body;
    
    if (!messageId || !employeeId || !action) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    let updateObject: any = {};
    
    if (action === 'mark_read') {
      updateObject = {
        isRead: true,
        readDate: new Date()
      };
    } else if (action === 'mark_unread') {
      updateObject = {
        isRead: false,
        readDate: null
      };
    } else if (action === 'archive') {
      updateObject = {
        isArchived: true
      };
    } else if (action === 'unarchive') {
      updateObject = {
        isArchived: false
      };
    }
    
    await db.collection('messages').updateOne(
      { messageId, toEmployeeId: employeeId },
      { $set: updateObject }
    );
    
    return NextResponse.json({
      success: true,
      message: `Message ${action.replace('_', ' ')} successfully`
    });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update message' },
      { status: 500 }
    );
  }
}
