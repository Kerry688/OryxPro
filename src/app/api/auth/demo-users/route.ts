import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { hashPassword } from '@/lib/auth/password';
import { ObjectId } from 'mongodb';

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

// POST /api/auth/demo-users - Create demo users for testing authentication
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    const rolesCollection = db.collection('roles');

    // Get or create demo roles first
    const adminRole = await rolesCollection.findOne({ name: 'Super Admin' });
    const managerRole = await rolesCollection.findOne({ name: 'Manager' });
    const employeeRole = await rolesCollection.findOne({ name: 'Employee' });

    if (!adminRole || !managerRole || !employeeRole) {
      return NextResponse.json(
        { success: false, error: 'Required roles not found. Please seed roles first.' },
        { status: 400 }
      );
    }

    // Demo users for testing authentication
    const demoUsers = [
      {
        username: 'admin',
        email: 'admin@oryxpro.com',
        firstName: 'Ahmed',
        lastName: 'Hassan',
        phone: '+20 123 456 7890',
        status: 'active' as const,
        roleId: adminRole._id.toString(),
        department: 'IT',
        position: 'System Administrator',
        isEmailVerified: true,
        isPhoneVerified: true,
        twoFactorEnabled: false,
        password: 'AdminPass123!',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
        updatedBy: 'system'
      },
      {
        username: 'manager',
        email: 'manager@oryxpro.com',
        firstName: 'Fatima',
        lastName: 'Mohamed',
        phone: '+20 987 654 3210',
        status: 'active' as const,
        roleId: managerRole._id.toString(),
        department: 'Sales',
        position: 'Sales Manager',
        isEmailVerified: true,
        isPhoneVerified: false,
        twoFactorEnabled: false,
        password: 'ManagerPass123!',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
        updatedBy: 'system'
      },
      {
        username: 'employee',
        email: 'employee@oryxpro.com',
        firstName: 'Omar',
        lastName: 'Ali',
        phone: '+20 555 123 4567',
        status: 'active' as const,
        roleId: employeeRole._id.toString(),
        department: 'HR',
        position: 'HR Assistant',
        isEmailVerified: false,
        isPhoneVerified: false,
        twoFactorEnabled: false,
        password: 'EmployeePass123!',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
        updatedBy: 'system'
      },
      {
        username: 'salesrep',
        email: 'sales@oryxpro.com',
        firstName: 'Yasmine',
        lastName: 'Ibrahim',
        phone: '+20 444 789 0123',
        status: 'active' as const,
        roleId: employeeRole._id.toString(),
        department: 'Sales',
        position: 'Sales Representative',
        isEmailVerified: true,
        isPhoneVerified: true,
        twoFactorEnabled: true,
        password: 'SalesPass123!',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
        updatedBy: 'system'
      }
    ];

    // Check if demo users already exist
    const existingUsers = await usersCollection.find({
      username: { $in: demoUsers.map(u => u.username) }
    }).toArray();

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Demo users already exist',
          existingUsers: existingUsers.map(u => ({ username: u.username, email: u.email }))
        },
        { status: 400 }
      );
    }

    // Hash passwords and insert users
    const usersToInsert = await Promise.all(demoUsers.map(async (user) => ({
      ...user,
      password: await hashPassword(user.password)
    })));

    const result = await usersCollection.insertMany(usersToInsert);

    return NextResponse.json({
      success: true,
      data: {
        insertedCount: result.insertedCount,
        users: demoUsers.map((user, index) => ({
          _id: result.insertedIds[index],
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.roleId === adminRole._id.toString() ? 'Super Admin' : 
                user.roleId === managerRole._id.toString() ? 'Manager' : 'Employee',
          password: user.password // Include plain password for testing
        }))
      },
      message: 'Demo users created successfully'
    });

  } catch (error) {
    console.error('Error creating demo users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create demo users' },
      { status: 500 }
    );
  }
}
