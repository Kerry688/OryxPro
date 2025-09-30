import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { UpdateLeaveRequestDTO } from '@/lib/models/leave';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await connectToDatabase();
    const { id } = params;
    
    const leaveRequest = await db.collection('leaveRequests').findOne({
      $or: [
        { requestId: id },
        { _id: id }
      ]
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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await connectToDatabase();
    const { id } = params;
    const body: UpdateLeaveRequestDTO = await request.json();
    
    // Find the leave request
    const leaveRequest = await db.collection('leaveRequests').findOne({
      $or: [
        { requestId: id },
        { _id: id }
      ]
    });
    
    if (!leaveRequest) {
      return NextResponse.json(
        { success: false, error: 'Leave request not found' },
        { status: 404 }
      );
    }
    
    // Update approval workflow
    const updatedApprovalWorkflow = { ...leaveRequest.approvalWorkflow };
    
    // Find the current approver and update their status
    const currentApproverIndex = updatedApprovalWorkflow.approvers.findIndex(
      approver => approver.approverId === body.approverId && approver.status === 'pending'
    );
    
    if (currentApproverIndex !== -1) {
      updatedApprovalWorkflow.approvers[currentApproverIndex].status = body.status;
      updatedApprovalWorkflow.approvers[currentApproverIndex].comments = body.comments;
      updatedApprovalWorkflow.approvers[currentApproverIndex].actionDate = new Date();
      
      // If approved, move to next level or complete
      if (body.status === 'approved') {
        const nextApproverIndex = updatedApprovalWorkflow.approvers.findIndex(
          approver => approver.level === updatedApprovalWorkflow.currentLevel + 1
        );
        
        if (nextApproverIndex !== -1) {
          updatedApprovalWorkflow.currentLevel += 1;
        } else {
          // No more approvers, request is fully approved
          updatedApprovalWorkflow.isCompleted = true;
          updatedApprovalWorkflow.completedDate = new Date();
        }
      } else if (body.status === 'rejected') {
        // If rejected, mark as completed (rejected)
        updatedApprovalWorkflow.isCompleted = true;
        updatedApprovalWorkflow.completedDate = new Date();
      }
    }
    
    // Add comment if provided
    const newComment = {
      commentId: `COMMENT_${Date.now()}`,
      authorId: body.approverId,
      authorName: 'Approver Name', // Would fetch from employee data
      authorRole: 'Manager', // Would fetch from employee data
      comment: body.comments || '',
      timestamp: new Date(),
      isInternal: body.isInternal || false
    };
    
    const updatedComments = [...(leaveRequest.comments || []), newComment];
    
    // Update the leave request
    const updatedRequest = {
      ...leaveRequest,
      status: body.status === 'approved' && updatedApprovalWorkflow.isCompleted ? 'approved' :
              body.status === 'rejected' ? 'rejected' : 'pending',
      approvalWorkflow: updatedApprovalWorkflow,
      comments: updatedComments,
      lastModifiedDate: new Date(),
      updatedAt: new Date(),
      updatedBy: body.approverId
    };
    
    await db.collection('leaveRequests').updateOne(
      { _id: leaveRequest._id },
      { $set: updatedRequest }
    );
    
    // If approved and completed, update leave balance
    if (body.status === 'approved' && updatedApprovalWorkflow.isCompleted) {
      const currentYear = new Date().getFullYear();
      await db.collection('leaveBalances').updateOne(
        {
          employeeId: leaveRequest.employeeId,
          leaveTypeId: leaveRequest.leaveTypeId,
          year: currentYear
        },
        {
          $inc: {
            usedDays: leaveRequest.totalDays,
            pendingDays: -leaveRequest.totalDays,
            availableDays: -leaveRequest.totalDays
          }
        }
      );
    }
    
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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await connectToDatabase();
    const { id } = params;
    
    const result = await db.collection('leaveRequests').deleteOne({
      $or: [
        { requestId: id },
        { _id: id }
      ]
    });
    
    if (result.deletedCount === 0) {
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
