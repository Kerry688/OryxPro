import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const department = searchParams.get('department');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Build query
    let query: any = {};
    
    if (employeeId) {
      query.employeeId = employeeId;
    }
    
    if (department) {
      query.employeeDepartment = department;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (startDate && endDate) {
      query.workDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (startDate) {
      query.workDate = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.workDate = { $lte: new Date(endDate) };
    }
    
    const attendanceRecords = await db.collection('attendanceRecords')
      .find(query)
      .sort({ workDate: -1, createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .toArray();
    
    // Get total count for pagination
    const totalCount = await db.collection('attendanceRecords').countDocuments(query);
    
    return NextResponse.json({
      success: true,
      data: attendanceRecords,
      count: attendanceRecords.length,
      totalCount,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    });
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch attendance records' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();
    
    const { employeeId, workDate, checkInTime, checkOutTime, status, notes } = body;
    
    if (!employeeId || !workDate) {
      return NextResponse.json(
        { success: false, error: 'Employee ID and work date are required' },
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
    
    // Check if attendance record already exists for this date
    const workDateObj = new Date(workDate);
    workDateObj.setHours(0, 0, 0, 0);
    const nextDay = new Date(workDateObj);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const existingRecord = await db.collection('attendanceRecords').findOne({
      employeeId,
      workDate: {
        $gte: workDateObj,
        $lt: nextDay
      }
    });
    
    if (existingRecord) {
      return NextResponse.json(
        { success: false, error: 'Attendance record already exists for this date' },
        { status: 400 }
      );
    }
    
    // Calculate work hours if both check-in and check-out times are provided
    let totalWorkHours = 0;
    let overtimeHours = 0;
    let lateArrivalMinutes = 0;
    let earlyDepartureMinutes = 0;
    
    if (checkInTime && checkOutTime) {
      const checkIn = new Date(checkInTime);
      const checkOut = new Date(checkOutTime);
      const workTimeMs = checkOut.getTime() - checkIn.getTime();
      totalWorkHours = workTimeMs / (1000 * 60 * 60);
      
      // Get employee's shift for calculations
      const shift = await db.collection('shifts').findOne({
        'assignedEmployees.employeeId': employeeId,
        'assignedEmployees.isActive': true,
        isActive: true
      });
      
      if (shift) {
        const scheduledStart = new Date(workDateObj);
        const [startHours, startMinutes] = shift.startTime.split(':').map(Number);
        scheduledStart.setHours(startHours, startMinutes, 0, 0);
        
        const scheduledEnd = new Date(workDateObj);
        const [endHours, endMinutes] = shift.endTime.split(':').map(Number);
        scheduledEnd.setHours(endHours, endMinutes, 0, 0);
        
        const scheduledHours = shift.duration;
        overtimeHours = Math.max(0, totalWorkHours - scheduledHours);
        
        lateArrivalMinutes = Math.max(0, Math.floor((checkIn.getTime() - scheduledStart.getTime()) / (1000 * 60)));
        earlyDepartureMinutes = Math.max(0, Math.floor((scheduledEnd.getTime() - checkOut.getTime()) / (1000 * 60)));
      }
    }
    
    // Create attendance record
    const attendanceRecord = {
      attendanceId: `ATT${Date.now()}`,
      employeeId,
      employeeName: employee.name,
      employeeDepartment: employee.department,
      employeePosition: employee.position,
      
      checkInTime: checkInTime ? new Date(checkInTime) : undefined,
      checkOutTime: checkOutTime ? new Date(checkOutTime) : undefined,
      checkInMethod: 'manual',
      checkOutMethod: 'manual',
      
      workDate: workDateObj,
      scheduledStartTime: new Date(workDateObj),
      scheduledEndTime: new Date(workDateObj),
      actualStartTime: checkInTime ? new Date(checkInTime) : undefined,
      actualEndTime: checkOutTime ? new Date(checkOutTime) : undefined,
      
      totalWorkHours: Math.round(totalWorkHours * 100) / 100,
      scheduledHours: 8, // Default
      overtimeHours: Math.round(overtimeHours * 100) / 100,
      breakHours: 0,
      lateArrivalMinutes,
      earlyDepartureMinutes,
      
      breaks: [],
      
      status: status || 'present',
      isApproved: false,
      
      notes,
      
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'admin',
      updatedBy: 'admin'
    };
    
    await db.collection('attendanceRecords').insertOne(attendanceRecord);
    
    return NextResponse.json({
      success: true,
      data: attendanceRecord,
      message: 'Attendance record created successfully'
    });
  } catch (error) {
    console.error('Error creating attendance record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create attendance record' },
      { status: 500 }
    );
  }
}
