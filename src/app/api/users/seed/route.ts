import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { hashPassword } from '@/lib/auth/password';

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

// Demo users data
const demoUsers: Omit<User, '_id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>[] = [
  {
    username: 'admin',
    email: 'admin@oryxpro.com',
    firstName: 'Ahmed',
    lastName: 'Hassan',
    phone: '+201234567890',
    status: 'active',
    roleId: 'admin',
    branchId: 'main-branch',
    department: 'IT',
    position: 'System Administrator',
    isEmailVerified: true,
    isPhoneVerified: true,
    twoFactorEnabled: true,
    password: 'admin123',
    lastLoginAt: new Date()
  },
  {
    username: 'sales_manager',
    email: 'sales.manager@oryxpro.com',
    firstName: 'Mohamed',
    lastName: 'Ali',
    phone: '+201234567891',
    status: 'active',
    roleId: 'sales_manager',
    branchId: 'main-branch',
    department: 'Sales',
    position: 'Sales Manager',
    isEmailVerified: true,
    isPhoneVerified: true,
    twoFactorEnabled: false,
    employeeId: 'EMP001',
    password: 'sales123',
    lastLoginAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    username: 'hr_manager',
    email: 'hr.manager@oryxpro.com',
    firstName: 'Fatima',
    lastName: 'Omar',
    phone: '+201234567892',
    status: 'active',
    roleId: 'hr_manager',
    branchId: 'main-branch',
    department: 'Human Resources',
    position: 'HR Manager',
    isEmailVerified: true,
    isPhoneVerified: true,
    twoFactorEnabled: false,
    employeeId: 'EMP002',
    password: 'hr123',
    lastLoginAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    username: 'sales_rep1',
    email: 'sales1@oryxpro.com',
    firstName: 'Omar',
    lastName: 'Ibrahim',
    phone: '+201234567893',
    status: 'active',
    roleId: 'sales_rep',
    branchId: 'main-branch',
    department: 'Sales',
    position: 'Sales Representative',
    isEmailVerified: true,
    isPhoneVerified: false,
    twoFactorEnabled: false,
    employeeId: 'EMP003',
    password: 'sales123',
    lastLoginAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
  },
  {
    username: 'sales_rep2',
    email: 'sales2@oryxpro.com',
    firstName: 'Nour',
    lastName: 'Mahmoud',
    phone: '+201234567894',
    status: 'active',
    roleId: 'sales_rep',
    branchId: 'branch-2',
    department: 'Sales',
    position: 'Sales Representative',
    isEmailVerified: true,
    isPhoneVerified: true,
    twoFactorEnabled: false,
    employeeId: 'EMP004',
    password: 'sales123',
    lastLoginAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
  },
  {
    username: 'hr_specialist',
    email: 'hr.specialist@oryxpro.com',
    firstName: 'Youssef',
    lastName: 'Said',
    phone: '+201234567895',
    status: 'active',
    roleId: 'hr_specialist',
    branchId: 'main-branch',
    department: 'Human Resources',
    position: 'HR Specialist',
    isEmailVerified: false,
    isPhoneVerified: true,
    twoFactorEnabled: false,
    employeeId: 'EMP005',
    password: 'hr123',
    lastLoginAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
  },
  {
    username: 'accountant',
    email: 'accountant@oryxpro.com',
    firstName: 'Aisha',
    lastName: 'Khalil',
    phone: '+201234567896',
    status: 'active',
    roleId: 'accountant',
    branchId: 'main-branch',
    department: 'Finance',
    position: 'Senior Accountant',
    isEmailVerified: true,
    isPhoneVerified: true,
    twoFactorEnabled: true,
    employeeId: 'EMP006',
    password: 'finance123',
    lastLoginAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    username: 'inventory_manager',
    email: 'inventory@oryxpro.com',
    firstName: 'Tarek',
    lastName: 'Farouk',
    phone: '+201234567897',
    status: 'active',
    roleId: 'inventory_manager',
    branchId: 'warehouse-1',
    department: 'Inventory',
    position: 'Inventory Manager',
    isEmailVerified: true,
    isPhoneVerified: true,
    twoFactorEnabled: false,
    employeeId: 'EMP007',
    password: 'inventory123',
    lastLoginAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
  },
  {
    username: 'customer_service',
    email: 'support@oryxpro.com',
    firstName: 'Dina',
    lastName: 'Rashad',
    phone: '+201234567898',
    status: 'active',
    roleId: 'customer_service',
    branchId: 'main-branch',
    department: 'Customer Service',
    position: 'Customer Service Representative',
    isEmailVerified: true,
    isPhoneVerified: false,
    twoFactorEnabled: false,
    employeeId: 'EMP008',
    password: 'support123',
    lastLoginAt: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    username: 'marketing_manager',
    email: 'marketing@oryxpro.com',
    firstName: 'Khaled',
    lastName: 'Nasser',
    phone: '+201234567899',
    status: 'inactive',
    roleId: 'marketing_manager',
    branchId: 'main-branch',
    department: 'Marketing',
    position: 'Marketing Manager',
    isEmailVerified: true,
    isPhoneVerified: true,
    twoFactorEnabled: false,
    employeeId: 'EMP009',
    password: 'marketing123',
    lastLoginAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  },
  {
    username: 'pending_user',
    email: 'pending@oryxpro.com',
    firstName: 'Sara',
    lastName: 'Mohamed',
    phone: '+201234567900',
    status: 'pending',
    roleId: 'sales_rep',
    branchId: 'branch-2',
    department: 'Sales',
    position: 'Sales Representative',
    isEmailVerified: false,
    isPhoneVerified: false,
    twoFactorEnabled: false,
    employeeId: 'EMP010',
    password: 'temp123'
  }
];

// POST /api/users/seed - Seed demo users data
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Clear existing users (optional - remove this if you want to keep existing data)
    await usersCollection.deleteMany({});

    // Prepare users with timestamps and hashed passwords
    const usersToInsert = await Promise.all(demoUsers.map(async (user) => ({
      ...user,
      password: await hashPassword(user.password), // Hash passwords securely
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'system',
      updatedBy: 'system'
    })));

    // Insert demo users
    const result = await usersCollection.insertMany(usersToInsert);

    return NextResponse.json({
      success: true,
      message: `${result.insertedCount} demo users created successfully`,
      data: {
        insertedCount: result.insertedCount,
        insertedIds: Object.values(result.insertedIds)
      }
    });
  } catch (error) {
    console.error('Error seeding demo users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed demo users' },
      { status: 500 }
    );
  }
}
