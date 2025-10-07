import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { comparePassword } from '@/lib/auth/password';
import { generateToken } from '@/lib/auth/jwt';
import { ObjectId } from 'mongodb';
import { LoginPortal, UserType, UserRole } from '@/lib/models/user';

interface LoginRequest {
  email: string;
  password: string;
  portal: LoginPortal;
  rememberMe?: boolean;
}

interface User {
  _id: ObjectId;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  userType: UserType;
  role: UserRole;
  loginPortal: LoginPortal;
  isActive: boolean;
  lastLogin?: Date;
  branchId?: ObjectId;
  permissions?: string[];
  
  // Password management
  mustResetPassword?: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  
  // Customer-specific fields
  customerId?: string;
  companyName?: string;
  
  // Employee-specific fields
  employeeId?: string;
  department?: string;
  position?: string;
  managerId?: ObjectId;
  
  password: string;
}

// Portal access rules
const PORTAL_ACCESS_RULES = {
  [LoginPortal.ERP_SYSTEM]: [UserType.ERP_USER],
  [LoginPortal.EMPLOYEE_PORTAL]: [UserType.EMPLOYEE, UserType.ERP_USER], // ERP users can access employee portal
  [LoginPortal.CUSTOMER_PORTAL]: [UserType.CUSTOMER]
};

// Default redirect URLs for each portal
const DEFAULT_REDIRECTS = {
  [LoginPortal.ERP_SYSTEM]: '/',
  [LoginPortal.EMPLOYEE_PORTAL]: '/employee',
  [LoginPortal.CUSTOMER_PORTAL]: '/customer-portal'
};

// POST /api/auth/login - Unified login for all portals
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    const { email, password, portal, rememberMe }: LoginRequest = await request.json();

    // Validate input
    if (!email || !password || !portal) {
      return NextResponse.json(
        { success: false, message: 'Email, password, and portal are required' },
        { status: 400 }
      );
    }

    console.log('Login attempt for email:', email, 'portal:', portal);

    // Find user by email
    const user = await usersCollection.findOne({ email: email }) as User | null;

    if (!user) {
      console.log('User not found:', email);
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      console.log('User account is not active');
      return NextResponse.json(
        { success: false, message: 'Account is not active' },
        { status: 401 }
      );
    }

    // Check portal access permissions
    const allowedUserTypes = PORTAL_ACCESS_RULES[portal];
    if (!allowedUserTypes.includes(user.userType)) {
      console.log('User not authorized for portal:', portal, 'userType:', user.userType);
      return NextResponse.json(
        { success: false, message: 'You are not authorized to access this portal' },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if user must reset password
    if (user.mustResetPassword) {
      console.log('User must reset password:', email);
      return NextResponse.json(
        { 
          success: false, 
          message: 'You must reset your password before logging in',
          mustResetPassword: true,
          resetToken: user.passwordResetToken
        },
        { status: 403 }
      );
    }

    // Update last login time
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );

    // Determine redirect URL based on user type and portal
    let redirectUrl = DEFAULT_REDIRECTS[portal];
    
    // Special case: If ERP user is accessing employee portal, redirect to employee portal
    if (user.userType === UserType.ERP_USER && portal === LoginPortal.EMPLOYEE_PORTAL) {
      redirectUrl = '/employee';
    }
    // Special case: If ERP user is accessing customer portal, redirect to customer portal
    else if (user.userType === UserType.ERP_USER && portal === LoginPortal.CUSTOMER_PORTAL) {
      redirectUrl = '/customer-portal';
    }
    // Default case: Use the portal's default redirect
    else {
      redirectUrl = DEFAULT_REDIRECTS[user.loginPortal];
    }

    // Generate JWT token with portal information
    const token = await generateToken({
      userId: user._id.toString(),
      email: user.email,
      userType: user.userType,
      role: user.role,
      loginPortal: user.loginPortal,
      branchId: user.branchId?.toString(),
      customerId: user.customerId,
      employeeId: user.employeeId
    });

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token,
      redirectUrl,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
