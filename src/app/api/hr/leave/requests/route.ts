import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { LeaveRequest, CreateLeaveRequestDTO, LeaveRequestFilters } from '@/lib/models/leave';

export async function GET(request: NextRequest) {
  try {
    const db = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    
    // Build filter object
    const filters: LeaveRequestFilters = {};
    
    if (searchParams.get('employeeId')) {
      filters.employeeId = searchParams.get('employeeId')!;
    }
    
    if (searchParams.get('leaveTypeId')) {
      filters.leaveTypeId = searchParams.get('leaveTypeId')!;
    }
    
    if (searchParams.get('status')) {
      filters.status = searchParams.get('status') as LeaveRequest['status'];
    }
    
    if (searchParams.get('priority')) {
      filters.priority = searchParams.get('priority') as LeaveRequest['priority'];
    }
    
    if (searchParams.get('department')) {
      filters.department = searchParams.get('department')!;
    }
    
    if (searchParams.get('approverId')) {
      filters.approverId = searchParams.get('approverId')!;
    }
    
    // Build MongoDB query
    let query: any = {};
    
    if (filters.employeeId) {
      query.employeeId = filters.employeeId;
    }
    
    if (filters.leaveTypeId) {
      query.leaveTypeId = filters.leaveTypeId;
    }
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.priority) {
      query.priority = filters.priority;
    }
    
    if (filters.department) {
      query['approvalWorkflow.approvers'] = {
        $elemMatch: { department: filters.department }
      };
    }
    
    if (filters.approverId) {
      query['approvalWorkflow.approvers'] = {
        $elemMatch: { approverId: filters.approverId }
      };
    }
    
    // Date filters
    if (searchParams.get('startDate')) {
      const startDate = new Date(searchParams.get('startDate')!);
      query.startDate = { $gte: startDate };
    }
    
    if (searchParams.get('endDate')) {
      const endDate = new Date(searchParams.get('endDate')!);
      query.endDate = { $lte: endDate };
    }
    
    const leaveRequests = await db.collection('leaveRequests').find(query).sort({ submittedDate: -1 }).toArray();
    
    return NextResponse.json({
      success: true,
      data: leaveRequests,
      count: leaveRequests.length
    });
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leave requests' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await connectToDatabase();
    const body: CreateLeaveRequestDTO = await request.json();
    
    // Validate required fields
    if (!body.employeeId || !body.leaveTypeId || !body.startDate || !body.endDate || !body.reason) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get employee and leave type details
    const employee = await db.collection('employees').findOne({ employeeId: body.employeeId });
    const leaveType = await db.collection('leaveTypes').findOne({ leaveTypeId: body.leaveTypeId });
    
    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }
    
    if (!leaveType) {
      return NextResponse.json(
        { success: false, error: 'Leave type not found' },
        { status: 404 }
      );
    }
    
    // Calculate total days
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);
    const timeDiff = endDate.getTime() - startDate.getTime();
    const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    
    // If half day, adjust total days
    const adjustedTotalDays = body.isHalfDay ? 0.5 : totalDays;
    
    // Check leave balance
    const currentYear = new Date().getFullYear();
    const leaveBalance = await db.collection('leaveBalances').findOne({
      employeeId: body.employeeId,
      leaveTypeId: body.leaveTypeId,
      year: currentYear
    });
    
    if (leaveBalance && leaveBalance.availableDays < adjustedTotalDays) {
      return NextResponse.json(
        { success: false, error: 'Insufficient leave balance' },
        { status: 400 }
      );
    }
    
    // Create approval workflow based on leave type and employee
    const approvalWorkflow = {
      approvers: [
        {
          approverId: 'EMP009', // Default to CEO for now
          approverName: 'Ahmed Mahmoud',
          approverRole: 'CEO',
          department: 'Executive',
          level: 1,
          status: 'pending' as const,
          isRequired: true
        }
      ],
      currentLevel: 1,
      isCompleted: false
    };
    
    const leaveRequest: LeaveRequest = {
      requestId: `LR${Date.now()}`,
      employeeId: body.employeeId,
      employeeName: employee.name,
      leaveTypeId: body.leaveTypeId,
      leaveTypeName: leaveType.name,
      leaveTypeCode: leaveType.code,
      startDate,
      endDate,
      totalDays: adjustedTotalDays,
      reason: body.reason,
      status: 'pending',
      priority: body.priority || 'medium',
      isHalfDay: body.isHalfDay || false,
      halfDayType: body.halfDayType,
      submittedDate: new Date(),
      lastModifiedDate: new Date(),
      submittedBy: body.employeeId,
      approvalWorkflow,
      emergencyContact: body.emergencyContact,
      handoverDetails: body.handoverDetails ? {
        colleagueId: body.handoverDetails.colleagueId,
        colleagueName: 'Colleague Name', // Would fetch from DB
        handoverNotes: body.handoverDetails.handoverNotes,
        handoverDate: new Date(),
        handoverAccepted: false
      } : undefined,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: body.employeeId,
      updatedBy: body.employeeId
    };
    
    await db.collection('leaveRequests').insertOne(leaveRequest);
    
    return NextResponse.json({
      success: true,
      data: leaveRequest,
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
