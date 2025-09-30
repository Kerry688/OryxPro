import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Department, UpdateDepartmentDTO } from '@/lib/models/department';
import { ObjectId } from 'mongodb';

// GET /api/hr/departments/[id] - Get department by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();
    const departmentsCollection = db.collection('departments');

    const department = await departmentsCollection.findOne({
      $or: [
        { _id: new ObjectId(id) },
        { departmentId: id }
      ],
      'systemInfo.isActive': true
    });

    if (!department) {
      return NextResponse.json(
        { success: false, error: 'Department not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: department
    });
  } catch (error) {
    console.error('Error fetching department:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch department' },
      { status: 500 }
    );
  }
}

// PUT /api/hr/departments/[id] - Update department
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();
    const departmentsCollection = db.collection('departments');

    const updateData: UpdateDepartmentDTO = await request.json();

    const updateFields: any = {
      ...updateData,
      'systemInfo.updatedBy': 'system', // TODO: Get from auth context
      'systemInfo.updatedAt': new Date()
    };

    const result = await departmentsCollection.findOneAndUpdate(
      {
        $or: [
          { _id: new ObjectId(id) },
          { departmentId: id }
        ],
        'systemInfo.isActive': true
      },
      { $set: updateFields },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Department not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Department updated successfully'
    });
  } catch (error) {
    console.error('Error updating department:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update department' },
      { status: 500 }
    );
  }
}

// DELETE /api/hr/departments/[id] - Soft delete department
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();
    const departmentsCollection = db.collection('departments');

    const result = await departmentsCollection.findOneAndUpdate(
      {
        $or: [
          { _id: new ObjectId(id) },
          { departmentId: id }
        ],
        'systemInfo.isActive': true
      },
      {
        $set: {
          'systemInfo.isActive': false,
          'systemInfo.updatedBy': 'system', // TODO: Get from auth context
          'systemInfo.updatedAt': new Date()
        }
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Department not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Department deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting department:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete department' },
      { status: 500 }
    );
  }
}
