import { NextRequest, NextResponse } from 'next/server';
import { verifyEmailConnection } from '@/lib/resend';
import { sendPasswordResetEmail } from '@/lib/email-service';
import { LoginPortal } from '@/lib/models/user';

// GET /api/auth/test-resend - Test email connection
export async function GET() {
  try {
    const isConnected = await verifyEmailConnection();
    
    return NextResponse.json({
      success: isConnected,
      message: isConnected ? 'Email connection successful' : 'Email connection failed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Email test error:', error);
    return NextResponse.json(
      { success: false, message: 'Email test failed', error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/auth/test-resend - Send test email
export async function POST(request: NextRequest) {
  try {
    const { email, portal = LoginPortal.ERP_SYSTEM } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Send test password reset email
    const emailSent = await sendPasswordResetEmail({
      to: email,
      firstName: 'Test',
      lastName: 'User',
      resetUrl: 'https://oryxpro.com/reset-password?token=test-token-123',
      portal: portal
    });

    return NextResponse.json({
      success: emailSent,
      message: emailSent ? 'Test email sent successfully' : 'Failed to send test email',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { success: false, message: 'Test email failed', error: error.message },
      { status: 500 }
    );
  }
}
