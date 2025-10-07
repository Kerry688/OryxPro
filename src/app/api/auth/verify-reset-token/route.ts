import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

interface VerifyTokenRequest {
  token: string;
}

// GET /api/auth/verify-reset-token - Verify password reset token
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const resetTokensCollection = db.collection('password_reset_tokens');
    const usersCollection = db.collection('users');

    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    // Validate input
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Reset token is required' },
        { status: 400 }
      );
    }

    console.log('Verifying reset token:', token);

    // Find reset token
    const resetTokenDoc = await resetTokensCollection.findOne({
      token,
      used: false
    });

    if (!resetTokenDoc) {
      console.log('Invalid or used reset token');
      return NextResponse.json(
        { success: false, message: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (new Date() > resetTokenDoc.expiresAt) {
      console.log('Reset token expired');
      // Mark token as used
      await resetTokensCollection.updateOne(
        { token },
        { $set: { used: true } }
      );
      return NextResponse.json(
        { success: false, message: 'Reset token has expired' },
        { status: 400 }
      );
    }

    // Verify user still exists and is active
    const user = await usersCollection.findOne({
      _id: resetTokenDoc.userId,
      isActive: true
    });

    if (!user) {
      console.log('User not found or inactive');
      return NextResponse.json(
        { success: false, message: 'User account not found or inactive' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      userInfo: {
        userType: resetTokenDoc.userType,
        loginPortal: resetTokenDoc.loginPortal,
        email: resetTokenDoc.email
      }
    });

  } catch (error) {
    console.error('Verify reset token error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
