import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { LeaveBalance, LeaveBalanceFilters } from '@/lib/models/leave';

export async function GET(request: NextRequest) {
  try {
    const db = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    
    // Build filter object
    const filters: LeaveBalanceFilters = {};
    
    if (searchParams.get('employeeId')) {
      filters.employeeId = searchParams.get('employeeId')!;
    }
    
    if (searchParams.get('leaveTypeId')) {
      filters.leaveTypeId = searchParams.get('leaveTypeId')!;
    }
    
    if (searchParams.get('year')) {
      filters.year = parseInt(searchParams.get('year')!);
    }
    
    if (searchParams.get('department')) {
      filters.department = searchParams.get('department')!;
    }
    
    // Build MongoDB query
    let query: any = {};
    
    if (filters.employeeId) {
      query.employeeId = filters.employeeId;
    }
    
    if (filters.leaveTypeId) {
      query.leaveTypeId = filters.leaveTypeId;
    }
    
    if (filters.year) {
      query.year = filters.year;
    }
    
    // If no year specified, default to current year
    if (!filters.year) {
      query.year = new Date().getFullYear();
    }
    
    // If department filter, we need to join with employees collection
    let pipeline: any[] = [
      { $match: query }
    ];
    
    if (filters.department) {
      pipeline.push({
        $lookup: {
          from: 'employees',
          localField: 'employeeId',
          foreignField: 'employeeId',
          as: 'employee'
        }
      });
      
      pipeline.push({
        $match: {
          'employee.department': filters.department
        }
      });
      
      pipeline.push({
        $unwind: '$employee'
      });
    }
    
    pipeline.push({
      $lookup: {
        from: 'leaveTypes',
        localField: 'leaveTypeId',
        foreignField: 'leaveTypeId',
        as: 'leaveType'
      }
    });
    
    pipeline.push({
      $unwind: '$leaveType'
    });
    
    pipeline.push({
      $sort: { employeeId: 1, leaveTypeName: 1 }
    });
    
    const leaveBalances = await db.collection('leaveBalances').aggregate(pipeline).toArray();
    
    return NextResponse.json({
      success: true,
      data: leaveBalances,
      count: leaveBalances.length
    });
  } catch (error) {
    console.error('Error fetching leave balances:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leave balances' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await connectToDatabase();
    const body = await request.json();
    
    const { employeeId, year, leaveTypeIds } = body;
    
    if (!employeeId || !year) {
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
    
    // Get leave types
    const query = leaveTypeIds && leaveTypeIds.length > 0 
      ? { leaveTypeId: { $in: leaveTypeIds }, isActive: true }
      : { isActive: true };
    
    const leaveTypes = await db.collection('leaveTypes').find(query).toArray();
    
    if (leaveTypes.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No active leave types found' },
        { status: 404 }
      );
    }
    
    // Create or update leave balances
    const balances = [];
    
    for (const leaveType of leaveTypes) {
      // Check if balance already exists
      const existingBalance = await db.collection('leaveBalances').findOne({
        employeeId,
        leaveTypeId: leaveType.leaveTypeId,
        year
      });
      
      if (existingBalance) {
        // Update existing balance
        const updatedBalance = {
          ...existingBalance,
          allocatedDays: leaveType.maxDaysPerYear || 0,
          availableDays: (leaveType.maxDaysPerYear || 0) - existingBalance.usedDays - existingBalance.pendingDays,
          lastUpdated: new Date()
        };
        
        await db.collection('leaveBalances').updateOne(
          { _id: existingBalance._id },
          { $set: updatedBalance }
        );
        
        balances.push(updatedBalance);
      } else {
        // Create new balance
        const newBalance: LeaveBalance = {
          balanceId: `LB${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          employeeId,
          leaveTypeId: leaveType.leaveTypeId,
          leaveTypeName: leaveType.name,
          year,
          allocatedDays: leaveType.maxDaysPerYear || 0,
          usedDays: 0,
          pendingDays: 0,
          carriedForwardDays: 0,
          availableDays: leaveType.maxDaysPerYear || 0,
          lastUpdated: new Date()
        };
        
        await db.collection('leaveBalances').insertOne(newBalance);
        balances.push(newBalance);
      }
    }
    
    return NextResponse.json({
      success: true,
      data: balances,
      message: 'Leave balances created/updated successfully'
    });
  } catch (error) {
    console.error('Error creating/updating leave balances:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create/update leave balances' },
      { status: 500 }
    );
  }
}
