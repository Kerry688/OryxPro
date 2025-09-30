import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { authenticateToken, createAuthenticatedResponse, createErrorResponse } from '@/lib/auth/middleware';
import { ObjectId } from 'mongodb';

interface User {
  _id: ObjectId;
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
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// GET /api/auth/me - Get current user profile
export async function GET(request: NextRequest) {
  try {
    const authResult = authenticateToken(request);
    if ('error' in authResult) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const { user } = authResult;
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Get user details from database
    const userDoc = await usersCollection.findOne(
      { _id: new ObjectId(user.userId) },
      { projection: { password: 0 } } // Exclude password
    ) as User | null;

    if (!userDoc) {
      return createErrorResponse('User not found', 404);
    }

    // Get role details
    const rolesCollection = db.collection('roles');
    const role = await rolesCollection.findOne({ _id: new ObjectId(userDoc.roleId) });

    // Get branch details if user has a branch
    let branch = null;
    if (userDoc.branchId) {
      const branchesCollection = db.collection('branches');
      branch = await branchesCollection.findOne({ _id: new ObjectId(userDoc.branchId) });
    }

    // Get employee details if user is linked to an employee
    let employee = null;
    if (userDoc.employeeId) {
      const employeesCollection = db.collection('employees');
      employee = await employeesCollection.findOne({ _id: new ObjectId(userDoc.employeeId) });
    }

    return createAuthenticatedResponse(user, {
      profile: userDoc,
      role,
      branch,
      employee
    }, 'User profile retrieved successfully');

  } catch (error) {
    console.error('Get user profile error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

// PUT /api/auth/me - Update current user profile
export async function PUT(request: NextRequest) {
  try {
    const authResult = authenticateToken(request);
    if ('error' in authResult) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const { user } = authResult;
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    const updateData = await request.json();

    // Remove sensitive fields that shouldn't be updated via profile
    const { password, roleId, status, createdAt, updatedAt, createdBy, updatedBy, ...allowedUpdates } = updateData;

    // Validate email format if provided
    if (allowedUpdates.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(allowedUpdates.email)) {
      return createErrorResponse('Invalid email format', 400);
    }

    // Check if email is already taken by another user
    if (allowedUpdates.email) {
      const existingUser = await usersCollection.findOne({
        email: allowedUpdates.email,
        _id: { $ne: new ObjectId(user.userId) }
      });

      if (existingUser) {
        return createErrorResponse('Email is already taken', 400);
      }
    }

    // Update user profile
    const updateResult = await usersCollection.updateOne(
      { _id: new ObjectId(user.userId) },
      {
        $set: {
          ...allowedUpdates,
          updatedAt: new Date(),
          updatedBy: user.userId
        }
      }
    );

    if (updateResult.matchedCount === 0) {
      return createErrorResponse('User not found', 404);
    }

    // Get updated user data
    const updatedUser = await usersCollection.findOne(
      { _id: new ObjectId(user.userId) },
      { projection: { password: 0 } }
    ) as User | null;

    return createAuthenticatedResponse(user, {
      profile: updatedUser
    }, 'Profile updated successfully');

  } catch (error) {
    console.error('Update user profile error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
