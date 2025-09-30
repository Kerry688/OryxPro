import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CheckOutDTO } from '@/lib/models/attendance';

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body: CheckOutDTO = await request.json();
    
    const { employeeId, method, location, notes } = body;
    
    if (!employeeId || !method) {
      return NextResponse.json(
        { success: false, error: 'Employee ID and check-out method are required' },
        { status: 400 }
      );
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Find today's attendance record
    const attendanceRecord = await db.collection('attendanceRecords').findOne({
      employeeId,
      workDate: {
        $gte: today,
        $lt: tomorrow
      }
    });
    
    if (!attendanceRecord) {
      return NextResponse.json(
        { success: false, error: 'No attendance record found for today. Please check in first.' },
        { status: 404 }
      );
    }
    
    if (attendanceRecord.checkOutTime) {
      return NextResponse.json(
        { success: false, error: 'Employee has already checked out today' },
        { status: 400 }
      );
    }
    
    const checkOutTime = new Date();
    
    // Calculate work hours
    const checkInTime = new Date(attendanceRecord.checkInTime);
    const totalWorkTimeMs = checkOutTime.getTime() - checkInTime.getTime();
    const totalWorkHours = totalWorkTimeMs / (1000 * 60 * 60);
    
    // Subtract break time
    const totalBreakMinutes = attendanceRecord.breaks.reduce((sum, breakRecord) => {
      if (breakRecord.endTime) {
        const breakTimeMs = new Date(breakRecord.endTime).getTime() - new Date(breakRecord.startTime).getTime();
        return sum + (breakTimeMs / (1000 * 60));
      }
      return sum;
    }, 0);
    
    const breakHours = totalBreakMinutes / 60;
    const netWorkHours = totalWorkHours - breakHours;
    
    // Calculate overtime
    const scheduledHours = attendanceRecord.scheduledHours;
    const overtimeHours = Math.max(0, netWorkHours - scheduledHours);
    
    // Calculate early departure
    const scheduledEndTime = new Date(attendanceRecord.scheduledEndTime);
    const earlyDepartureMinutes = Math.max(0, Math.floor((scheduledEndTime.getTime() - checkOutTime.getTime()) / (1000 * 60)));
    
    // Update attendance record
    const updatedRecord = {
      ...attendanceRecord,
      checkOutTime,
      checkOutMethod: method,
      checkOutLocation: location,
      
      totalWorkHours: Math.round(netWorkHours * 100) / 100,
      overtimeHours: Math.round(overtimeHours * 100) / 100,
      breakHours: Math.round(breakHours * 100) / 100,
      earlyDepartureMinutes,
      
      updatedAt: new Date(),
      updatedBy: employeeId
    };
    
    // Update status if needed
    if (earlyDepartureMinutes > 0 && netWorkHours < scheduledHours * 0.5) {
      updatedRecord.status = 'half_day';
    }
    
    await db.collection('attendanceRecords').updateOne(
      { _id: attendanceRecord._id },
      {
        $set: {
          checkOutTime,
          checkOutMethod: method,
          checkOutLocation: location,
          totalWorkHours: updatedRecord.totalWorkHours,
          overtimeHours: updatedRecord.overtimeHours,
          breakHours: updatedRecord.breakHours,
          earlyDepartureMinutes,
          status: updatedRecord.status,
          notes: notes || attendanceRecord.notes,
          updatedAt: new Date(),
          updatedBy: employeeId
        }
      }
    );
    
    return NextResponse.json({
      success: true,
      data: updatedRecord,
      message: 'Check-out recorded successfully'
    });
  } catch (error) {
    console.error('Error recording check-out:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record check-out' },
      { status: 500 }
    );
  }
}
