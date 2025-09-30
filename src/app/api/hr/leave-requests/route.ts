import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { LeaveRequest, CreateLeaveRequestDTO, LeaveRequestFilter } from '@/lib/models/leaveRequest';
import { ObjectId } from 'mongodb';

// GET /api/hr/leave-requests - List leave requests with filtering
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const leaveRequestsCollection = db.collection('leaveRequests');

    const { searchParams } = new URL(request.url);
    const filter: LeaveRequestFilter = {
      employeeId: searchParams.get('employeeId') || undefined,
      leaveType: searchParams.get('leaveType') || undefined,
      status: searchParams.get('status') || undefined,
      approvedBy: searchParams.get('approvedBy') || undefined,
      search: searchParams.get('search') || undefined,
    };

    // Build MongoDB query
    const query: any = { 'systemInfo.isActive': true };

    if (filter.employeeId) {
      query.employeeId = filter.employeeId;
    }

    if (filter.leaveType) {
      query.leaveType = filter.leaveType;
    }

    if (filter.status) {
      query.status = filter.status;
    }

    if (filter.approvedBy) {
      query.approvedBy = filter.approvedBy;
    }

    if (filter.search) {
      query.$or = [
        { reason: { $regex: filter.search, $options: 'i' } },
        { requestId: { $regex: filter.search, $options: 'i' } }
      ];
    }

    // Date filtering
    if (searchParams.get('startDate')) {
      query.startDate = { $gte: new Date(searchParams.get('startDate')!) };
    }

    if (searchParams.get('endDate')) {
      query.endDate = { $lte: new Date(searchParams.get('endDate')!) };
    }

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const [leaveRequests, total] = await Promise.all([
      leaveRequestsCollection
        .find(query)
        .sort({ appliedDate: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      leaveRequestsCollection.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: leaveRequests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leave requests' },
      { status: 500 }
    );
  }
}

// POST /api/hr/leave-requests - Create new leave request
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const leaveRequestsCollection = db.collection('leaveRequests');

    const body: CreateLeaveRequestDTO = await request.json();

    // Validate required fields
    if (!body.employeeId || !body.leaveType || !body.startDate || !body.endDate || !body.reason) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate total days
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);
    const timeDiff = endDate.getTime() - startDate.getTime();
    const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    // Generate unique request ID
    const lastRequest = await leaveRequestsCollection
      .findOne({}, { sort: { requestId: -1 } });
    
    const lastId = lastRequest?.requestId || 'LR000';
    const nextId = `LR${String(parseInt(lastId.replace('LR', '')) + 1).padStart(3, '0')}`;

    // Create leave request object
    const leaveRequest: Omit<LeaveRequest, '_id'> = {
      requestId: nextId,
      employeeId: body.employeeId,
      leaveType: body.leaveType,
      startDate: startDate,
      endDate: endDate,
      totalDays,
      reason: body.reason,
      status: 'pending',
      appliedDate: new Date(),
      attachments: body.attachments || [],
      comments: [],
      systemInfo: {
        createdBy: 'current-user', // TODO: Get from auth
        createdAt: new Date(),
        updatedBy: 'current-user',
        updatedAt: new Date(),
        isActive: true
      }
    };

    const result = await leaveRequestsCollection.insertOne(leaveRequest);

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...leaveRequest },
      message: 'Leave request created successfully'
    });
  } catch (error) {
    console.error('Error creating leave request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create leave request' },
      { status: 500 }
    );
  }
}