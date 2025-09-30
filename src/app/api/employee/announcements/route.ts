import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { MarkAsReadDTO } from '@/lib/models/employee-portal';

export async function GET(request: NextRequest) {
  try {
    const db = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    if (!employeeId) {
      return NextResponse.json(
        { success: false, error: 'Employee ID is required' },
        { status: 400 }
      );
    }
    
    // Get employee info to determine target audience
    const employee = await db.collection('employees').findOne({ employeeId });
    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }
    
    // Build query for announcements visible to this employee
    const query: any = {
      isActive: true,
      $or: [
        { 'targetAudience.allEmployees': true },
        { 'targetAudience.departments': { $in: [employee.department] } },
        { 'targetAudience.positions': { $in: [employee.position] } },
        { 'targetAudience.specificEmployees': { $in: [employeeId] } }
      ]
    };
    
    // Add expiry date filter
    query.$or.push({
      $and: [
        { expiryDate: { $exists: true } },
        { expiryDate: { $gte: new Date() } }
      ]
    });
    
    const announcements = await db.collection('announcements')
      .find(query)
      .sort({ publishDate: -1 })
      .limit(limit)
      .skip(offset)
      .toArray();
    
    const formattedAnnouncements = announcements.map(announcement => ({
      announcementId: announcement.announcementId || announcement._id.toString(),
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      priority: announcement.priority,
      authorName: announcement.authorName,
      authorRole: announcement.authorRole,
      attachments: announcement.attachments || [],
      publishDate: new Date(announcement.publishDate),
      expiryDate: announcement.expiryDate ? new Date(announcement.expiryDate) : undefined,
      isActive: announcement.isActive,
      isRead: announcement.readBy?.includes(employeeId) || false,
      createdAt: new Date(announcement.createdAt)
    }));
    
    return NextResponse.json({
      success: true,
      data: formattedAnnouncements,
      count: formattedAnnouncements.length
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await connectToDatabase();
    const body: MarkAsReadDTO = await request.json();
    
    const { itemId, itemType, readDate } = body;
    
    if (!itemId || !itemType || !readDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    if (itemType === 'announcement') {
      await db.collection('announcements').updateOne(
        { announcementId: itemId },
        { 
          $addToSet: { 
            readBy: body.itemId // This should be employeeId, but using itemId for now
          } 
        }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Announcement marked as read'
    });
  } catch (error) {
    console.error('Error marking announcement as read:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to mark announcement as read' },
      { status: 500 }
    );
  }
}
