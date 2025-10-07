import { NextRequest, NextResponse } from 'next/server';
import { verifyEmailConnection, sendEmail } from '@/lib/resend';

// GET /api/auth/test-email-simple - Simple email connection test
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
      { success: false, message: 'Email test failed', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/auth/test-email-simple - Send simple test email
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Send simple test email
    const result = await sendEmail({
      to: email,
      subject: 'OryxPro - Email Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Email Test Successful!</h1>
          <p>This is a test email from OryxPro to verify that the email system is working correctly.</p>
          <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Test Details:</h3>
            <ul>
              <li><strong>Service:</strong> Resend SMTP via Nodemailer</li>
              <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
              <li><strong>Status:</strong> ✅ Working</li>
            </ul>
          </div>
          <p>If you received this email, the OryxPro email system is functioning properly.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">
            © 2024 OryxPro. All rights reserved.
          </p>
        </div>
      `,
      text: `
Email Test Successful!

This is a test email from OryxPro to verify that the email system is working correctly.

Test Details:
- Service: Resend SMTP via Nodemailer
- Time: ${new Date().toLocaleString()}
- Status: ✅ Working

If you received this email, the OryxPro email system is functioning properly.

© 2024 OryxPro. All rights reserved.
      `
    });

    return NextResponse.json({
      success: result.success,
      message: result.success ? 'Test email sent successfully' : 'Failed to send test email',
      messageId: result.messageId,
      error: result.error,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { success: false, message: 'Test email failed', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
