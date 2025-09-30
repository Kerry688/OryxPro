import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Department, CreateDepartmentDTO } from '@/lib/models/department';
import { ObjectId } from 'mongodb';

// GET /api/hr/departments - Get all departments
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const departmentsCollection = db.collection('departments');

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const parentDepartmentId = searchParams.get('parentDepartmentId') || '';

    // Build filter object
    const filter: any = { 'systemInfo.isActive': true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }

    if (parentDepartmentId) {
      filter.parentDepartmentId = parentDepartmentId;
    }

    const departments = await departmentsCollection
      .find(filter)
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: departments
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch departments' },
      { status: 500 }
    );
  }
}

// POST /api/hr/departments - Create a new department
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const departmentsCollection = db.collection('departments');

    const departmentData: CreateDepartmentDTO = await request.json();

    // Generate department ID
    const lastDepartment = await departmentsCollection
      .findOne({}, { sort: { departmentId: -1 } });
    
    let departmentId = 'DEP001';
    if (lastDepartment) {
      const lastNumber = parseInt(lastDepartment.departmentId.replace('DEP', ''));
      departmentId = `DEP${(lastNumber + 1).toString().padStart(3, '0')}`;
    }

    const newDepartment: Department = {
      departmentId,
      name: departmentData.name,
      description: departmentData.description,
      code: departmentData.code,
      parentDepartmentId: departmentData.parentDepartmentId,
      managerId: departmentData.managerId,
      budget: {
        ...departmentData.budget,
        categories: []
      },
      location: departmentData.location,
      contactInfo: departmentData.contactInfo,
      policies: {
        ...departmentData.policies,
        otherPolicies: []
      },
      metrics: {
        totalEmployees: 0,
        averageSalary: 0,
        turnoverRate: 0,
        productivityScore: 0
      },
      systemInfo: {
        createdBy: 'system', // TODO: Get from auth context
        createdAt: new Date(),
        updatedBy: 'system',
        updatedAt: new Date(),
        isActive: true
      }
    };

    const result = await departmentsCollection.insertOne(newDepartment);

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newDepartment },
      message: 'Department created successfully'
    });
  } catch (error) {
    console.error('Error creating department:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create department' },
      { status: 500 }
    );
  }
}
