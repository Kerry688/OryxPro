import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { attendanceDemo } from '@/lib/data/attendance-demo';

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    
    // Clear existing attendance data
    await db.collection('attendanceRecords').deleteMany({});
    await db.collection('shifts').deleteMany({});
    await db.collection('biometricDevices').deleteMany({});
    await db.collection('attendancePolicies').deleteMany({});
    
    // Insert demo attendance records
    if (attendanceDemo.attendanceRecords.length > 0) {
      await db.collection('attendanceRecords').insertMany(attendanceDemo.attendanceRecords);
    }
    
    // Insert demo shifts
    if (attendanceDemo.shifts.length > 0) {
      await db.collection('shifts').insertMany(attendanceDemo.shifts);
    }
    
    // Insert demo biometric devices
    if (attendanceDemo.biometricDevices.length > 0) {
      await db.collection('biometricDevices').insertMany(attendanceDemo.biometricDevices);
    }
    
    // Insert demo attendance policies
    if (attendanceDemo.attendancePolicies.length > 0) {
      await db.collection('attendancePolicies').insertMany(attendanceDemo.attendancePolicies);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Attendance & Time Tracking demo data seeded successfully',
      data: {
        attendanceRecords: attendanceDemo.attendanceRecords.length,
        shifts: attendanceDemo.shifts.length,
        biometricDevices: attendanceDemo.biometricDevices.length,
        attendancePolicies: attendanceDemo.attendancePolicies.length
      }
    });
  } catch (error) {
    console.error('Error seeding attendance demo data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed attendance demo data' },
      { status: 500 }
    );
  }
}
