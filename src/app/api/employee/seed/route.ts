import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { employeePortalDemo } from '@/lib/data/employee-portal-demo';

export async function POST(request: NextRequest) {
  try {
    const db = await connectToDatabase();
    
    // Clear existing employee portal data
    await db.collection('employeeProfiles').deleteMany({});
    await db.collection('employeePayslips').deleteMany({});
    await db.collection('employeeAnnouncements').deleteMany({});
    await db.collection('employeeMessages').deleteMany({});
    
    // Insert demo employees
    if (employeePortalDemo.employees.length > 0) {
      await db.collection('employeeProfiles').insertMany(employeePortalDemo.employees);
    }
    
    // Insert demo payslips
    if (employeePortalDemo.payslips.length > 0) {
      await db.collection('employeePayslips').insertMany(employeePortalDemo.payslips);
    }
    
    // Insert demo announcements
    if (employeePortalDemo.announcements.length > 0) {
      await db.collection('employeeAnnouncements').insertMany(employeePortalDemo.announcements);
    }
    
    // Insert demo messages
    if (employeePortalDemo.messages.length > 0) {
      await db.collection('employeeMessages').insertMany(employeePortalDemo.messages);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Employee portal demo data seeded successfully',
      data: {
        employees: employeePortalDemo.employees.length,
        payslips: employeePortalDemo.payslips.length,
        announcements: employeePortalDemo.announcements.length,
        messages: employeePortalDemo.messages.length
      }
    });
  } catch (error) {
    console.error('Error seeding employee portal demo data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed employee portal demo data' },
      { status: 500 }
    );
  }
}
