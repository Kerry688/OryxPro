import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { UserType, LoginPortal } from '@/lib/models/user';
import { sendPasswordResetEmail } from '@/lib/email-service';
import crypto from 'crypto';

interface ForgotPasswordRequest {
  email: string;
}

// POST /api/auth/forgot-password - Send password reset email
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    const resetTokensCollection = db.collection('password_reset_tokens');

    const { email }: ForgotPasswordRequest = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('Forgot password request for email:', email);

    // Find user by email
    const user = await usersCollection.findOne({ 
      email: email.toLowerCase(),
      isActive: true 
    });

    if (!user) {
      // For security, we don't reveal if the email exists or not
      // Always return success to prevent email enumeration attacks
      console.log('User not found for email:', email);
      return NextResponse.json({
        success: true,
        message: 'If an account with this email exists, a reset link has been sent.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

    // Store reset token in database
    await resetTokensCollection.insertOne({
      token: resetToken,
      userId: user._id,
      email: user.email,
      userType: user.userType,
      loginPortal: user.loginPortal,
      expiresAt,
      createdAt: new Date(),
      used: false
    });

    // In a real application, you would send an email here
    // For demo purposes, we'll log the reset link
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    console.log('Password reset link for', user.email, ':', resetUrl);

    // Send password reset email
    const emailSent = await sendPasswordResetEmail({
      to: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      resetUrl,
      portal: user.loginPortal
    });

    if (!emailSent) {
      console.error('Failed to send password reset email to:', user.email);
      // Don't fail the request if email sending fails
      // The token is still created and can be used
    }

    return NextResponse.json({
      success: true,
      message: 'If an account with this email exists, a reset link has been sent.',
      // In development, include the reset link for testing
      ...(process.env.NODE_ENV === 'development' && { resetUrl })
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
