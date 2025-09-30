import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { hashPassword, validatePasswordStrength } from '@/lib/auth/password';

// User interface
interface User {
  _id?: ObjectId;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  roleId: string;
  branchId?: string;
  department: string;
  position: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  twoFactorEnabled: boolean;
  employeeId?: string;
  password: string;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

interface CreateUserDTO {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  roleId: string;
  branchId?: string;
  department: string;
  position: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  twoFactorEnabled: boolean;
  employeeId?: string;
  password: string;
}

// GET /api/users - Get all users with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const roleId = searchParams.get('roleId') || '';
    const branchId = searchParams.get('branchId') || '';

    // Build filter object
    const filter: any = {};

    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (roleId) {
      filter.roleId = roleId;
    }

    if (branchId) {
      filter.branchId = branchId;
    }

    const skip = (page - 1) * limit;

    // Get total count
    const totalCount = await usersCollection.countDocuments(filter);

    // Get users with pagination
    const users = await usersCollection
      .find(filter, { projection: { password: 0 } }) // Exclude password from results
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    const userData: CreateUserDTO = await request.json();
    console.log('Received user data:', userData);

    // Check if username or email already exists
    const existingUser = await usersCollection.findOne({
      $or: [
        { username: userData.username },
        { email: userData.email }
      ]
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Username or email already exists' },
        { status: 400 }
      );
    }

    // Check if employee is already linked to another user
    if (userData.employeeId) {
      const existingEmployeeUser = await usersCollection.findOne({
        employeeId: userData.employeeId
      });

      if (existingEmployeeUser) {
        return NextResponse.json(
          { success: false, error: 'Employee is already linked to another user' },
          { status: 400 }
        );
      }
    }

    // Validate password strength
    console.log('Validating password:', userData.password);
    const passwordValidation = validatePasswordStrength(userData.password);
    console.log('Password validation result:', passwordValidation);
    
    if (!passwordValidation.isValid) {
      console.log('Password validation failed:', passwordValidation.errors);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Password does not meet security requirements',
          details: passwordValidation.errors
        },
        { status: 400 }
      );
    }

    // Hash password using bcryptjs
    console.log('Hashing password...');
    const hashedPassword = await hashPassword(userData.password);
    console.log('Password hashed successfully');

    const newUser: User = {
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      status: userData.status,
      roleId: userData.roleId,
      branchId: userData.branchId,
      department: userData.department,
      position: userData.position,
      isEmailVerified: userData.isEmailVerified,
      isPhoneVerified: userData.isPhoneVerified,
      twoFactorEnabled: userData.twoFactorEnabled,
      employeeId: userData.employeeId,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'system', // TODO: Get from auth context
      updatedBy: 'system'
    };

    console.log('Creating user in database...');
    const result = await usersCollection.insertOne(newUser);
    console.log('User created successfully with ID:', result.insertedId);

    // Return user without password
    const { password, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...userWithoutPassword },
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
