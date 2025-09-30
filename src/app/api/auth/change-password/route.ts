import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { authenticateToken, createErrorResponse, createAuthenticatedResponse } from '@/lib/auth/middleware';
import { comparePassword, hashPassword, validatePasswordStrength } from '@/lib/auth/password';
import { ObjectId } from 'mongodb';

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// PUT /api/auth/change-password - Change user password
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

    const { currentPassword, newPassword }: ChangePasswordRequest = await request.json();

    // Validate input
    if (!currentPassword || !newPassword) {
      return createErrorResponse('Current password and new password are required', 400);
    }

    // Get current user with password
    const userDoc = await usersCollection.findOne({ _id: new ObjectId(user.userId) });
    if (!userDoc) {
      return createErrorResponse('User not found', 404);
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(currentPassword, userDoc.password);
    if (!isCurrentPasswordValid) {
      return createErrorResponse('Current password is incorrect', 400);
    }

    // Validate new password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'New password does not meet security requirements',
          details: passwordValidation.errors
        },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    await usersCollection.updateOne(
      { _id: new ObjectId(user.userId) },
      {
        $set: {
          password: hashedNewPassword,
          updatedAt: new Date(),
          updatedBy: user.userId
        }
      }
    );

    return createAuthenticatedResponse(user, {}, 'Password changed successfully');

  } catch (error) {
    console.error('Change password error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
