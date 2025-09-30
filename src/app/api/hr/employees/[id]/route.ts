import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Employee, UpdateEmployeeDTO } from '@/lib/models/employee';
import { ObjectId } from 'mongodb';

// GET /api/hr/employees/[id] - Get employee by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();
    const employeesCollection = db.collection('employees');

    // Try to find by employeeId first, then by _id if it's a valid ObjectId
    let employee;
    if (id.startsWith('EMP')) {
      // Search by employeeId for employee IDs like EMP001, EMP002, etc.
      employee = await employeesCollection.findOne({
        employeeId: id,
        'systemInfo.isActive': true
      });
    } else {
      // Try to search by _id if it's a valid ObjectId
      try {
        employee = await employeesCollection.findOne({
          _id: new ObjectId(id),
          'systemInfo.isActive': true
        });
      } catch (error) {
        // If ObjectId conversion fails, return not found
        employee = null;
      }
    }

    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Error fetching employee:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch employee' },
      { status: 500 }
    );
  }
}

// PUT /api/hr/employees/[id] - Update employee
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();
    const employeesCollection = db.collection('employees');

    const updateData: UpdateEmployeeDTO = await request.json();

    const updateFields: any = {
      ...updateData,
      'systemInfo.updatedBy': 'system', // TODO: Get from auth context
      'systemInfo.updatedAt': new Date()
    };

    // Find employee first using the same logic as GET
    let query;
    if (id.startsWith('EMP')) {
      query = { employeeId: id, 'systemInfo.isActive': true };
    } else {
      try {
        query = { _id: new ObjectId(id), 'systemInfo.isActive': true };
      } catch (error) {
        query = null;
      }
    }

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }

    const result = await employeesCollection.findOneAndUpdate(
      query,
      { $set: updateFields },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Employee updated successfully'
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update employee' },
      { status: 500 }
    );
  }
}

// DELETE /api/hr/employees/[id] - Soft delete employee
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();
    const employeesCollection = db.collection('employees');

    // Find employee first using the same logic as GET
    let query;
    if (id.startsWith('EMP')) {
      query = { employeeId: id, 'systemInfo.isActive': true };
    } else {
      try {
        query = { _id: new ObjectId(id), 'systemInfo.isActive': true };
      } catch (error) {
        query = null;
      }
    }

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }

    const result = await employeesCollection.findOneAndUpdate(
      query,
      {
        $set: {
          'systemInfo.isActive': false,
          'systemInfo.updatedBy': 'system', // TODO: Get from auth context
          'systemInfo.updatedAt': new Date(),
          'employmentInfo.employmentStatus': 'terminated',
          'employmentInfo.terminationDate': new Date()
        }
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete employee' },
      { status: 500 }
    );
  }
}
