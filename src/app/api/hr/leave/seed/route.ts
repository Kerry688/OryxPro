import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { leaveTypesDemo, leaveRequestsDemo, leaveBalancesDemo, holidaysDemo } from '@/lib/data/leave-demo';

export async function POST(request: NextRequest) {
  try {
    const db = await connectToDatabase();
    
    // Clear existing data
    await db.collection('leaveTypes').deleteMany({});
    await db.collection('leaveRequests').deleteMany({});
    await db.collection('leaveBalances').deleteMany({});
    await db.collection('holidays').deleteMany({});
    
    // Insert demo data
    const leaveTypesResult = await db.collection('leaveTypes').insertMany(leaveTypesDemo);
    const leaveRequestsResult = await db.collection('leaveRequests').insertMany(leaveRequestsDemo);
    const leaveBalancesResult = await db.collection('leaveBalances').insertMany(leaveBalancesDemo);
    const holidaysResult = await db.collection('holidays').insertMany(holidaysDemo);
    
    return NextResponse.json({
      success: true,
      message: 'Leave management demo data seeded successfully',
      data: {
        leaveTypes: leaveTypesResult.insertedCount,
        leaveRequests: leaveRequestsResult.insertedCount,
        leaveBalances: leaveBalancesResult.insertedCount,
        holidays: holidaysResult.insertedCount
      }
    });
  } catch (error) {
    console.error('Error seeding leave management demo data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed leave management demo data' },
      { status: 500 }
    );
  }
}
