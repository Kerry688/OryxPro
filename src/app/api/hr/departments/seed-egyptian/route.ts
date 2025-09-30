import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { egyptianDepartments } from '@/lib/data/egyptian-departments';
import { ObjectId } from 'mongodb';

// POST /api/hr/departments/seed-egyptian - Seed Egyptian departments
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const departmentsCollection = db.collection('departments');

    // Clear existing departments first
    await departmentsCollection.deleteMany({});

    // Generate department IDs and update parent references
    const departmentIdMap: { [key: string]: string } = {};
    const departmentsWithIds = egyptianDepartments.map((dept, index) => {
      const departmentId = `DEP${String(index + 1).padStart(3, '0')}`;
      departmentIdMap[dept.code] = departmentId;
      
      return {
        ...dept,
        departmentId,
        systemInfo: {
          createdBy: 'system',
          createdAt: new Date(),
          updatedBy: 'system',
          updatedAt: new Date(),
          isActive: true
        }
      };
    });

    // Update parent department references
    const finalDepartments = departmentsWithIds.map(dept => {
      if (dept.parentDepartmentId && departmentIdMap[dept.parentDepartmentId]) {
        return {
          ...dept,
          parentDepartmentId: departmentIdMap[dept.parentDepartmentId]
        };
      }
      return dept;
    });

    // Insert departments
    const result = await departmentsCollection.insertMany(finalDepartments);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${result.insertedCount} Egyptian departments`,
      data: {
        insertedCount: result.insertedCount,
        departments: Object.keys(departmentIdMap)
      }
    });
  } catch (error) {
    console.error('Error seeding Egyptian departments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed Egyptian departments' },
      { status: 500 }
    );
  }
}

// GET /api/hr/departments/seed-egyptian - Get seeded departments count
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const departmentsCollection = db.collection('departments');

    const count = await departmentsCollection.countDocuments({
      'systemInfo.isActive': true
    });

    const departments = await departmentsCollection
      .find({ 'systemInfo.isActive': true })
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: {
        count,
        departments: departments.map(dept => ({
          departmentId: dept.departmentId,
          name: dept.name,
          code: dept.code,
          parentDepartmentId: dept.parentDepartmentId
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch departments' },
      { status: 500 }
    );
  }
}

// DELETE /api/hr/departments/seed-egyptian - Clear all departments
export async function DELETE(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const departmentsCollection = db.collection('departments');

    const result = await departmentsCollection.deleteMany({});

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} departments`,
      data: {
        deletedCount: result.deletedCount
      }
    });
  } catch (error) {
    console.error('Error clearing departments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear departments' },
      { status: 500 }
    );
  }
}
