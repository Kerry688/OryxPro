import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { hashPassword } from '@/lib/auth/password';
import { UserType, LoginPortal, UserRole } from '@/lib/models/user';

// Test users for different portals
const testUsers = [
  // ERP System User (Full Access)
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@oryxpro.com',
    username: 'admin',
    password: 'admin123',
    userType: UserType.ERP_USER,
    role: UserRole.ADMIN,
    loginPortal: LoginPortal.ERP_SYSTEM,
    isActive: true,
    phone: '+1234567890',
    permissions: ['all']
  },
  
  // Employee User
  {
    firstName: 'John',
    lastName: 'Employee',
    email: 'john.employee@oryxpro.com',
    username: 'john.employee',
    password: 'employee123',
    userType: UserType.EMPLOYEE,
    role: UserRole.EMPLOYEE,
    loginPortal: LoginPortal.EMPLOYEE_PORTAL,
    isActive: true,
    employeeId: 'EMP-001',
    department: 'IT',
    position: 'Software Developer',
    phone: '+1234567891'
  },
  
  // Customer User
  {
    firstName: 'Ahmed',
    lastName: 'Customer',
    email: 'ahmed.customer@techsolutions.com',
    username: 'ahmed.customer',
    password: 'customer123',
    userType: UserType.CUSTOMER,
    role: UserRole.CUSTOMER,
    loginPortal: LoginPortal.CUSTOMER_PORTAL,
    isActive: true,
    customerId: 'CUST-001',
    companyName: 'Tech Solutions Ltd.',
    phone: '+1234567892'
  }
];

// POST /api/auth/seed-test-users - Create test users in database
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Clear existing test users
    await usersCollection.deleteMany({
      email: { $in: testUsers.map(user => user.email) }
    });

    // Create test users
    const createdUsers = [];
    for (const userData of testUsers) {
      const hashedPassword = await hashPassword(userData.password);
      
      const user = {
        ...userData,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: null,
        permissions: userData.permissions || []
      };

      const result = await usersCollection.insertOne(user);
      createdUsers.push({
        _id: result.insertedId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        userType: user.userType,
        role: user.role,
        loginPortal: user.loginPortal,
        password: userData.password // Include plain password for reference
      });
    }

    return NextResponse.json({
      success: true,
      message: `Created ${createdUsers.length} test users`,
      users: createdUsers
    });

  } catch (error) {
    console.error('Seed test users error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create test users', error: error.message },
      { status: 500 }
    );
  }
}

// GET /api/auth/seed-test-users - Get test user credentials
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    const testUsers = await usersCollection.find({
      email: { $in: ['admin@oryxpro.com', 'john.employee@oryxpro.com', 'ahmed.customer@techsolutions.com'] }
    }).toArray();

    // Return credentials for testing (without hashed passwords)
    const credentials = testUsers.map(user => ({
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      userType: user.userType,
      loginPortal: user.loginPortal,
      role: user.role,
      // Map back to original passwords for display
      password: user.email === 'admin@oryxpro.com' ? 'admin123' :
                user.email === 'john.employee@oryxpro.com' ? 'employee123' :
                user.email === 'ahmed.customer@techsolutions.com' ? 'customer123' : 'unknown'
    }));

    return NextResponse.json({
      success: true,
      credentials
    });

  } catch (error) {
    console.error('Get test users error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get test users' },
      { status: 500 }
    );
  }
}
