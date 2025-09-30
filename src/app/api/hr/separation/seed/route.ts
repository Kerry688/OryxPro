import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { separationDemo } from '@/lib/data/separation-demo';

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    
    // Clear existing separation data
    await db.collection('separationRequests').deleteMany({});
    await db.collection('exitInterviews').deleteMany({});
    await db.collection('clearanceChecklists').deleteMany({});
    
    // Insert demo separation requests
    if (separationDemo.separationRequests.length > 0) {
      await db.collection('separationRequests').insertMany(separationDemo.separationRequests);
    }
    
    // Insert demo exit interviews
    if (separationDemo.exitInterviews.length > 0) {
      await db.collection('exitInterviews').insertMany(separationDemo.exitInterviews);
    }
    
    // Insert demo clearance checklists
    if (separationDemo.clearanceChecklists.length > 0) {
      await db.collection('clearanceChecklists').insertMany(separationDemo.clearanceChecklists);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Separation & Offboarding demo data seeded successfully',
      data: {
        separationRequests: separationDemo.separationRequests.length,
        exitInterviews: separationDemo.exitInterviews.length,
        clearanceChecklists: separationDemo.clearanceChecklists.length
      }
    });
  } catch (error) {
    console.error('Error seeding separation demo data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed separation demo data' },
      { status: 500 }
    );
  }
}
