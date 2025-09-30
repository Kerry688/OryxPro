import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { egyptianEmployees } from '@/lib/data/egyptian-employees';
import { ObjectId } from 'mongodb';

// POST /api/hr/employees/seed-egyptian - Seed Egyptian employees
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const employeesCollection = db.collection('employees');

    // Clear existing employees first
    await employeesCollection.deleteMany({});

    // Generate employee IDs and prepare data
    const employeesWithIds = egyptianEmployees.map((emp, index) => {
      const employeeId = `EMP${String(index + 1).padStart(3, '0')}`;
      
      return {
        ...emp,
        employeeId,
        systemInfo: {
          createdBy: 'system',
          createdAt: new Date(),
          updatedBy: 'system',
          updatedAt: new Date(),
          isActive: true
        }
      };
    });

    // Insert employees
    const result = await employeesCollection.insertMany(employeesWithIds);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${result.insertedCount} Egyptian employees`,
      data: {
        insertedCount: result.insertedCount,
        employees: employeesWithIds.map(emp => ({
          employeeId: emp.employeeId,
          name: `${emp.personalInfo.firstName} ${emp.personalInfo.lastName}`,
          position: emp.employmentInfo.position,
          department: emp.employmentInfo.departmentId
        }))
      }
    });
  } catch (error) {
    console.error('Error seeding Egyptian employees:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed Egyptian employees' },
      { status: 500 }
    );
  }
}

// GET /api/hr/employees/seed-egyptian - Get seeded employees count
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const employeesCollection = db.collection('employees');

    const count = await employeesCollection.countDocuments({
      'systemInfo.isActive': true
    });

    const employees = await employeesCollection
      .find({ 'systemInfo.isActive': true })
      .sort({ 'personalInfo.firstName': 1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: {
        count,
        employees: employees.map(emp => ({
          employeeId: emp.employeeId,
          name: `${emp.personalInfo.firstName} ${emp.personalInfo.lastName}`,
          position: emp.employmentInfo.position,
          department: emp.employmentInfo.departmentId,
          email: emp.personalInfo.email
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

// DELETE /api/hr/employees/seed-egyptian - Clear all employees
export async function DELETE(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const employeesCollection = db.collection('employees');

    const result = await employeesCollection.deleteMany({});

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} employees`,
      data: {
        deletedCount: result.deletedCount
      }
    });
  } catch (error) {
    console.error('Error clearing employees:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear employees' },
      { status: 500 }
    );
  }
}
