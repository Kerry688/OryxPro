import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { LeaveType, CreateLeaveTypeDTO } from '@/lib/models/leave';

export async function GET(request: NextRequest) {
  try {
    const db = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category');
    const isActive = searchParams.get('isActive');
    
    let query: any = {};
    
    if (category) {
      query.category = category;
    }
    
    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }
    
    const leaveTypes = await db.collection('leaveTypes').find(query).toArray();
    
    return NextResponse.json({
      success: true,
      data: leaveTypes,
      count: leaveTypes.length
    });
  } catch (error) {
    console.error('Error fetching leave types:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leave types' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await connectToDatabase();
    const body: CreateLeaveTypeDTO = await request.json();
    
    // Validate required fields
    if (!body.name || !body.code || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if code already exists
    const existingType = await db.collection('leaveTypes').findOne({ code: body.code });
    if (existingType) {
      return NextResponse.json(
        { success: false, error: 'Leave type code already exists' },
        { status: 400 }
      );
    }
    
    const leaveType: LeaveType = {
      leaveTypeId: `LT${Date.now()}`,
      name: body.name,
      code: body.code.toUpperCase(),
      description: body.description || '',
      category: body.category,
      isPaid: body.isPaid,
      maxDaysPerYear: body.maxDaysPerYear,
      requiresApproval: body.requiresApproval,
      advanceNoticeDays: body.advanceNoticeDays,
      maxConsecutiveDays: body.maxConsecutiveDays,
      carryForward: body.carryForward,
      carryForwardDays: body.carryForwardDays,
      accrualRate: body.accrualRate,
      color: body.color || '#3B82F6',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('leaveTypes').insertOne(leaveType);
    
    return NextResponse.json({
      success: true,
      data: leaveType,
      message: 'Leave type created successfully'
    });
  } catch (error) {
    console.error('Error creating leave type:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create leave type' },
      { status: 500 }
    );
  }
}
