import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { hashPassword } from '@/lib/auth/password';
import { UserType, LoginPortal, UserRole } from '@/lib/models/user';

// Demo users for testing the split login system
const demoUsers = [
  // ERP System Users
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
    permissions: ['all']
  },
  {
    firstName: 'Manager',
    lastName: 'User',
    email: 'manager@oryxpro.com',
    username: 'manager',
    password: 'manager123',
    userType: UserType.ERP_USER,
    role: UserRole.MANAGER,
    loginPortal: LoginPortal.ERP_SYSTEM,
    isActive: true,
    permissions: ['orders', 'products', 'customers', 'reports']
  },
  {
    firstName: 'Sales',
    lastName: 'Rep',
    email: 'sales@oryxpro.com',
    username: 'sales',
    password: 'sales123',
    userType: UserType.ERP_USER,
    role: UserRole.SALES_REP,
    loginPortal: LoginPortal.ERP_SYSTEM,
    isActive: true,
    permissions: ['orders', 'customers', 'products']
  },

  // Employee Portal Users
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
    permissions: ['profile', 'payslips', 'leave']
  },
  {
    firstName: 'Sarah',
    lastName: 'HR',
    email: 'sarah.hr@oryxpro.com',
    username: 'sarah.hr',
    password: 'hr123',
    userType: UserType.EMPLOYEE,
    role: UserRole.HR_MANAGER,
    loginPortal: LoginPortal.EMPLOYEE_PORTAL,
    isActive: true,
    employeeId: 'EMP-002',
    department: 'HR',
    position: 'HR Manager',
    permissions: ['profile', 'payslips', 'leave', 'hr_management']
  },

  // Customer Portal Users
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
    permissions: ['orders', 'invoices', 'payments', 'profile']
  },
  {
    firstName: 'Fatima',
    lastName: 'Business',
    email: 'fatima.business@businesscorp.com',
    username: 'fatima.business',
    password: 'business123',
    userType: UserType.CUSTOMER,
    role: UserRole.CUSTOMER_ADMIN,
    loginPortal: LoginPortal.CUSTOMER_PORTAL,
    isActive: true,
    customerId: 'CUST-002',
    companyName: 'Business Corp',
    permissions: ['orders', 'invoices', 'payments', 'profile', 'team_management']
  },

  // ERP Users who can also access Employee Portal
  {
    firstName: 'ERP',
    lastName: 'Employee',
    email: 'erp.employee@oryxpro.com',
    username: 'erp.employee',
    password: 'erp123',
    userType: UserType.ERP_USER,
    role: UserRole.ADMIN,
    loginPortal: LoginPortal.ERP_SYSTEM,
    isActive: true,
    employeeId: 'EMP-003',
    department: 'Operations',
    position: 'Operations Manager',
    permissions: ['all']
  }
];

// POST /api/auth/demo-users - Create demo users for testing
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Clear existing demo users
    await usersCollection.deleteMany({
      email: { $regex: /@oryxpro\.com|@techsolutions\.com|@businesscorp\.com/ }
    });

    // Create demo users
    const createdUsers = [];
    for (const userData of demoUsers) {
      const hashedPassword = await hashPassword(userData.password);
      
      const user = {
        ...userData,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
        updatedBy: 'system'
      };

      const result = await usersCollection.insertOne(user);
      createdUsers.push({
        _id: result.insertedId,
        email: user.email,
        userType: user.userType,
        loginPortal: user.loginPortal,
        role: user.role
      });
    }

    return NextResponse.json({
      success: true,
      message: `Created ${createdUsers.length} demo users`,
      users: createdUsers
    });

  } catch (error) {
    console.error('Demo users creation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create demo users' },
      { status: 500 }
    );
  }
}

// GET /api/auth/demo-users - Get demo users info
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    const demoUsers = await usersCollection.find({
      email: { $regex: /@oryxpro\.com|@techsolutions\.com|@businesscorp\.com/ }
    }).project({
      email: 1,
      firstName: 1,
      lastName: 1,
      userType: 1,
      loginPortal: 1,
      role: 1,
      isActive: 1
    }).toArray();

    return NextResponse.json({
      success: true,
      users: demoUsers
    });

  } catch (error) {
    console.error('Get demo users error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get demo users' },
      { status: 500 }
    );
  }
}