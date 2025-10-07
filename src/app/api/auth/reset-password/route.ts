import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { hashPassword } from '@/lib/auth/password';
import { verifyToken } from '@/lib/auth/jwt';
import { ObjectId } from 'mongodb';

interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// POST /api/auth/reset-password - Reset password using token
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    const { token, newPassword }: ResetPasswordRequest = await request.json();

    // Validate input
    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Token and new password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Verify the reset token
    let decodedToken;
    try {
      decodedToken = await verifyToken(token);
    } catch (error) {
      console.log('Invalid or expired token');
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    // Find user by ID
    const user = await usersCollection.findOne({ 
      _id: new ObjectId(decodedToken.userId) 
    });

    if (!user) {
      console.log('User not found for token:', decodedToken.userId);
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if token matches and is not expired
    if (user.passwordResetToken !== token) {
      console.log('Token mismatch for user:', user.email);
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 400 }
      );
    }

    if (user.passwordResetExpires && new Date() > new Date(user.passwordResetExpires)) {
      console.log('Token expired for user:', user.email);
      return NextResponse.json(
        { success: false, message: 'Token has expired' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user with new password and clear reset flags
    await usersCollection.updateOne(
      { _id: user._id },
      { 
        $set: { 
          password: hashedPassword,
          mustResetPassword: false,
          updatedAt: new Date()
        },
        $unset: { 
          passwordResetToken: "",
          passwordResetExpires: ""
        }
      }
    );

    console.log('Password reset successfully for user:', user.email);

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to reset password' },
      { status: 500 }
    );
  }
}