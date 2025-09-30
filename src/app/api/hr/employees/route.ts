import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Employee, CreateEmployeeDTO, EmployeeFilter } from '@/lib/models/employee';
import { ObjectId } from 'mongodb';

// GET /api/hr/employees - Get all employees with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const employeesCollection = db.collection('employees');

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const departmentId = searchParams.get('departmentId') || '';
    const employmentStatus = searchParams.get('employmentStatus') || '';
    const employmentType = searchParams.get('employmentType') || '';

    // Build filter object
    const filter: any = { 'systemInfo.isActive': true };

    if (search) {
      filter.$or = [
        { 'personalInfo.firstName': { $regex: search, $options: 'i' } },
        { 'personalInfo.lastName': { $regex: search, $options: 'i' } },
        { 'personalInfo.email': { $regex: search, $options: 'i' } },
        { 'employmentInfo.jobTitle': { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }

    if (departmentId) {
      filter['employmentInfo.departmentId'] = departmentId;
    }

    if (employmentStatus) {
      filter['employmentInfo.employmentStatus'] = employmentStatus;
    }

    if (employmentType) {
      filter['employmentInfo.employmentType'] = employmentType;
    }

    const skip = (page - 1) * limit;

    // Get total count
    const totalCount = await employeesCollection.countDocuments(filter);

    // Get employees with pagination
    const employees = await employeesCollection
      .find(filter)
      .sort({ 'systemInfo.createdAt': -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      data: employees,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
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

// POST /api/hr/employees - Create a new employee
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const employeesCollection = db.collection('employees');

    const employeeData: CreateEmployeeDTO = await request.json();

    // Generate employee ID
    const lastEmployee = await employeesCollection
      .findOne({}, { sort: { employeeId: -1 } });
    
    let employeeId = 'EMP001';
    if (lastEmployee) {
      const lastNumber = parseInt(lastEmployee.employeeId.replace('EMP', ''));
      employeeId = `EMP${(lastNumber + 1).toString().padStart(3, '0')}`;
    }

    const newEmployee: Employee = {
      employeeId,
      personalInfo: employeeData.personalInfo,
      employmentInfo: {
        ...employeeData.employmentInfo,
        employmentStatus: 'active',
        hireDate: new Date(),
      },
      documents: {
        otherDocuments: []
      },
      skills: {
        technicalSkills: [],
        softSkills: [],
        certifications: [],
        languages: []
      },
      performance: {
        goals: [],
        achievements: []
      },
      leave: {
        totalLeaveDays: 21, // Default annual leave
        usedLeaveDays: 0,
        remainingLeaveDays: 21,
        leaveHistory: []
      },
      systemInfo: {
        createdBy: 'system', // TODO: Get from auth context
        createdAt: new Date(),
        updatedBy: 'system',
        updatedAt: new Date(),
        isActive: true
      }
    };

    const result = await employeesCollection.insertOne(newEmployee);

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newEmployee },
      message: 'Employee created successfully'
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create employee' },
      { status: 500 }
    );
  }
}
