import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CheckInDTO } from '@/lib/models/attendance';

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body: CheckInDTO = await request.json();
    
    const { employeeId, method, location, notes } = body;
    
    if (!employeeId || !method) {
      return NextResponse.json(
        { success: false, error: 'Employee ID and check-in method are required' },
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
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Check if employee already checked in today
    const existingAttendance = await db.collection('attendanceRecords').findOne({
      employeeId,
      workDate: {
        $gte: today,
        $lt: tomorrow
      }
    });
    
    if (existingAttendance && existingAttendance.checkInTime) {
      return NextResponse.json(
        { success: false, error: 'Employee has already checked in today' },
        { status: 400 }
      );
    }
    
    const checkInTime = new Date();
    
    // Get employee's shift information
    const shift = await db.collection('shifts').findOne({
      'assignedEmployees.employeeId': employeeId,
      'assignedEmployees.isActive': true,
      isActive: true
    });
    
    // Calculate scheduled start time
    let scheduledStartTime = new Date(today);
    if (shift) {
      const [hours, minutes] = shift.startTime.split(':').map(Number);
      scheduledStartTime.setHours(hours, minutes, 0, 0);
    } else {
      // Default to 9:00 AM if no shift assigned
      scheduledStartTime.setHours(9, 0, 0, 0);
    }
    
    // Calculate late arrival
    const lateArrivalMinutes = Math.max(0, Math.floor((checkInTime.getTime() - scheduledStartTime.getTime()) / (1000 * 60)));
    
    // Determine status
    let status: 'present' | 'late' | 'absent' = 'present';
    if (lateArrivalMinutes > 0) {
      status = 'late';
    }
    
    // Create attendance record
    const attendanceRecord = {
      attendanceId: `ATT${Date.now()}`,
      employeeId,
      employeeName: employee.name,
      employeeDepartment: employee.department,
      employeePosition: employee.position,
      
      checkInTime,
      checkInMethod: method,
      
      checkInLocation: location,
      
      workDate: today,
      scheduledStartTime,
      scheduledEndTime: shift ? (() => {
        const endTime = new Date(today);
        const [hours, minutes] = shift.endTime.split(':').map(Number);
        endTime.setHours(hours, minutes, 0, 0);
        return endTime;
      })() : (() => {
        const endTime = new Date(today);
        endTime.setHours(17, 0, 0, 0); // Default 5:00 PM
        return endTime;
      })(),
      
      totalWorkHours: 0,
      scheduledHours: shift ? shift.duration : 8, // Default 8 hours
      overtimeHours: 0,
      breakHours: 0,
      lateArrivalMinutes,
      earlyDepartureMinutes: 0,
      
      breaks: [],
      
      status,
      isApproved: false,
      
      shiftId: shift?.shiftId,
      shiftName: shift?.shiftName,
      shiftType: shift?.shiftType || 'regular',
      
      notes,
      
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: employeeId,
      updatedBy: employeeId
    };
    
    if (existingAttendance) {
      // Update existing record
      await db.collection('attendanceRecords').updateOne(
        { _id: existingAttendance._id },
        {
          $set: {
            checkInTime,
            checkInMethod: method,
            checkInLocation: location,
            scheduledStartTime,
            scheduledEndTime: attendanceRecord.scheduledEndTime,
            scheduledHours: attendanceRecord.scheduledHours,
            lateArrivalMinutes,
            status,
            notes,
            updatedAt: new Date(),
            updatedBy: employeeId
          }
        }
      );
    } else {
      // Create new record
      await db.collection('attendanceRecords').insertOne(attendanceRecord);
    }
    
    return NextResponse.json({
      success: true,
      data: attendanceRecord,
      message: 'Check-in recorded successfully'
    });
  } catch (error) {
    console.error('Error recording check-in:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record check-in' },
      { status: 500 }
    );
  }
}
