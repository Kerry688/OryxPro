import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CreateSeparationRequestDTO, UpdateSeparationRequestDTO } from '@/lib/models/separation';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const department = searchParams.get('department');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Build query
    let query: any = {};
    
    if (status) {
      query.status = status;
    }
    
    if (department) {
      query.employeeDepartment = department;
    }
    
    if (type) {
      query.separationType = type;
    }
    
    const separationRequests = await db.collection('separationRequests')
      .find(query)
      .sort({ submittedDate: -1 })
      .limit(limit)
      .skip(offset)
      .toArray();
    
    return NextResponse.json({
      success: true,
      data: separationRequests,
      count: separationRequests.length
    });
  } catch (error) {
    console.error('Error fetching separation requests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch separation requests' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body: CreateSeparationRequestDTO = await request.json();
    
    const { employeeId, separationType, separationReason, lastWorkingDate, noticePeriodDays, resignationReason, terminationReason } = body;
    
    if (!employeeId || !separationType || !separationReason || !lastWorkingDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get employee details
    const employee = await db.collection('employees').findOne({ employeeId });
    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }
    
    // Calculate notice period
    const noticeDays = noticePeriodDays || 30; // Default 30 days
    const noticeStartDate = new Date();
    const noticeEndDate = new Date(noticeStartDate);
    noticeEndDate.setDate(noticeEndDate.getDate() + noticeDays);
    
    // Create separation request
    const separationRequest = {
      separationId: `SEP${Date.now()}`,
      employeeId,
      employeeName: employee.name,
      employeeEmail: employee.email,
      employeePosition: employee.position,
      employeeDepartment: employee.department,
      managerId: employee.managerId || '',
      managerName: employee.managerName || '',
      hrManagerId: '', // Would be set based on department or assignment
      hrManagerName: '',
      
      separationType,
      separationReason,
      resignationReason,
      terminationReason,
      
      lastWorkingDate: new Date(lastWorkingDate),
      noticePeriodDays: noticeDays,
      noticePeriodStartDate: noticeStartDate,
      noticePeriodEndDate: noticeEndDate,
      
      status: 'draft',
      priority: 'medium',
      
      workflowSteps: [
        {
          stepId: 'STEP001',
          stepName: 'Manager Review',
          assignedTo: employee.managerId || '',
          assignedToName: employee.managerName || 'Manager',
          status: 'pending',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
          comments: ''
        },
        {
          stepId: 'STEP002',
          stepName: 'HR Review',
          assignedTo: '',
          assignedToName: 'HR Manager',
          status: 'pending',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
          comments: ''
        },
        {
          stepId: 'STEP003',
          stepName: 'Exit Interview',
          assignedTo: '',
          assignedToName: 'HR Team',
          status: 'pending',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          comments: ''
        },
        {
          stepId: 'STEP004',
          stepName: 'Clearance Process',
          assignedTo: '',
          assignedToName: 'Multiple Departments',
          status: 'pending',
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days
          comments: ''
        }
      ],
      
      approvals: [
        {
          approverId: employee.managerId || '',
          approverName: employee.managerName || 'Manager',
          approverRole: 'Manager',
          status: 'pending',
          priority: 1
        },
        {
          approverId: '',
          approverName: 'HR Manager',
          approverRole: 'HR Manager',
          status: 'pending',
          priority: 2
        }
      ],
      
      documents: [],
      
      finalSettlement: {
        lastSalaryAmount: 0,
        accruedLeaveDays: 0,
        accruedLeaveValue: 0,
        noticePayDays: 0,
        noticePayValue: 0,
        bonusAmount: 0,
        deductions: [],
        totalSettlement: 0,
        paymentMethod: 'bank_transfer',
        paymentDate: undefined,
        paymentReference: ''
      },
      
      submittedDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: employeeId,
      updatedBy: employeeId
    };
    
    await db.collection('separationRequests').insertOne(separationRequest);
    
    return NextResponse.json({
      success: true,
      data: separationRequest,
      message: 'Separation request created successfully'
    });
  } catch (error) {
    console.error('Error creating separation request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create separation request' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body: UpdateSeparationRequestDTO & { separationId: string } = await request.json();
    
    const { separationId, ...updateData } = body;
    
    if (!separationId) {
      return NextResponse.json(
        { success: false, error: 'Separation ID is required' },
        { status: 400 }
      );
    }
    
    const updateObject: any = {
      updatedAt: new Date(),
      updatedBy: body.updatedBy || 'system'
    };
    
    // Add update fields
    Object.assign(updateObject, updateData);
    
    await db.collection('separationRequests').updateOne(
      { separationId },
      { $set: updateObject }
    );
    
    return NextResponse.json({
      success: true,
      message: 'Separation request updated successfully'
    });
  } catch (error) {
    console.error('Error updating separation request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update separation request' },
      { status: 500 }
    );
  }
}
