import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { LeaveRequest, UpdateLeaveRequestDTO } from '@/lib/models/leaveRequest';
import { ObjectId } from 'mongodb';

// GET /api/hr/leave-requests/[id] - Get specific leave request
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();
    const leaveRequestsCollection = db.collection('leaveRequests');

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid leave request ID' },
        { status: 400 }
      );
    }

    const leaveRequest = await leaveRequestsCollection.findOne({
      _id: new ObjectId(id),
      'systemInfo.isActive': true
    });

    if (!leaveRequest) {
      return NextResponse.json(
        { success: false, error: 'Leave request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: leaveRequest
    });
  } catch (error) {
    console.error('Error fetching leave request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leave request' },
      { status: 500 }
    );
  }
}

// PUT /api/hr/leave-requests/[id] - Update leave request
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();
    const leaveRequestsCollection = db.collection('leaveRequests');

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid leave request ID' },
        { status: 400 }
      );
    }

    const body: UpdateLeaveRequestDTO = await request.json();

    // Check if leave request exists
    const existingRequest = await leaveRequestsCollection.findOne({
      _id: new ObjectId(id),
      'systemInfo.isActive': true
    });

    if (!existingRequest) {
      return NextResponse.json(
        { success: false, error: 'Leave request not found' },
        { status: 404 }
      );
    }

    // Prepare update object
    const updateData: any = {
      'systemInfo.updatedBy': 'current-user', // TODO: Get from auth
      'systemInfo.updatedAt': new Date()
    };

    // Update fields if provided
    if (body.status !== undefined) {
      updateData.status = body.status;
    }

    if (body.approvedBy !== undefined) {
      updateData.approvedBy = body.approvedBy;
    }

    if (body.approvedDate !== undefined) {
      updateData.approvedDate = body.approvedDate;
    }

    if (body.rejectionReason !== undefined) {
      updateData.rejectionReason = body.rejectionReason;
    }

    if (body.comments !== undefined) {
      // Add new comments with IDs
      const newComments = body.comments.map(comment => ({
        id: new ObjectId().toString(),
        ...comment,
        commentedAt: new Date()
      }));
      
      updateData.$push = {
        comments: { $each: newComments }
      };
    }

    const result = await leaveRequestsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Leave request not found' },
        { status: 404 }
      );
    }

    // Fetch updated leave request
    const updatedRequest = await leaveRequestsCollection.findOne({
      _id: new ObjectId(id)
    });

    return NextResponse.json({
      success: true,
      data: updatedRequest,
      message: 'Leave request updated successfully'
    });
  } catch (error) {
    console.error('Error updating leave request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update leave request' },
      { status: 500 }
    );
  }
}

// DELETE /api/hr/leave-requests/[id] - Soft delete leave request
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();
    const leaveRequestsCollection = db.collection('leaveRequests');

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid leave request ID' },
        { status: 400 }
      );
    }

    // Soft delete by setting isActive to false
    const result = await leaveRequestsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          'systemInfo.isActive': false,
          'systemInfo.updatedBy': 'current-user', // TODO: Get from auth
          'systemInfo.updatedAt': new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Leave request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Leave request deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting leave request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete leave request' },
      { status: 500 }
    );
  }
}
