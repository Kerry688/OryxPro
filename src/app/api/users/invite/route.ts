import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { hashPassword } from '@/lib/auth/password';
import { sendEmail } from '@/lib/resend';
import { UserType, LoginPortal, UserRole } from '@/lib/models/user';
import crypto from 'crypto';

interface InviteUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  userType: UserType;
  role: UserRole;
  loginPortal: LoginPortal;
  
  // Customer-specific fields
  customerId?: string;
  companyName?: string;
  
  // Employee-specific fields
  employeeId?: string;
  department?: string;
  position?: string;
  managerId?: string;
  
  // Additional fields
  phone?: string;
  branchId?: string;
}

// POST /api/users/invite - Invite a new user
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    const invitationsCollection = db.collection('user_invitations');

    const inviteData: InviteUserRequest = await request.json();

    // Validate required fields
    if (!inviteData.firstName || !inviteData.lastName || !inviteData.email || !inviteData.userType) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: inviteData.email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Check if there's already a pending invitation
    const existingInvitation = await invitationsCollection.findOne({ 
      email: inviteData.email,
      status: 'pending'
    });
    if (existingInvitation) {
      return NextResponse.json(
        { success: false, message: 'User invitation already sent' },
        { status: 400 }
      );
    }

    // Generate invitation token
    const invitationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Store invitation
    const invitation = {
      token: invitationToken,
      email: inviteData.email,
      firstName: inviteData.firstName,
      lastName: inviteData.lastName,
      userType: inviteData.userType,
      role: inviteData.role,
      loginPortal: inviteData.loginPortal,
      customerId: inviteData.customerId,
      companyName: inviteData.companyName,
      employeeId: inviteData.employeeId,
      department: inviteData.department,
      position: inviteData.position,
      managerId: inviteData.managerId,
      phone: inviteData.phone,
      branchId: inviteData.branchId,
      status: 'pending',
      expiresAt,
      createdAt: new Date(),
      invitedBy: 'system' // In real app, this would be the current user ID
    };

    await invitationsCollection.insertOne(invitation);

    // Generate invitation URL
    const invitationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/invite/${invitationToken}`;

    // Send invitation email
    const emailSent = await sendInvitationEmail({
      to: inviteData.email,
      firstName: inviteData.firstName,
      lastName: inviteData.lastName,
      invitationUrl,
      userType: inviteData.userType,
      loginPortal: inviteData.loginPortal,
      companyName: inviteData.companyName,
      department: inviteData.department,
      position: inviteData.position
    });

    if (!emailSent) {
      console.error('Failed to send invitation email to:', inviteData.email);
      // Don't fail the request if email sending fails
    }

    return NextResponse.json({
      success: true,
      message: 'User invitation sent successfully',
      invitationUrl: process.env.NODE_ENV === 'development' ? invitationUrl : undefined
    });

  } catch (error) {
    console.error('User invitation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send user invitation' },
      { status: 500 }
    );
  }
}

// GET /api/users/invite - Get pending invitations
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const invitationsCollection = db.collection('user_invitations');

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';

    const invitations = await invitationsCollection.find({
      status: status
    }).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({
      success: true,
      invitations
    });

  } catch (error) {
    console.error('Get invitations error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get invitations' },
      { status: 500 }
    );
  }
}

// Email template for user invitations
async function sendInvitationEmail(data: {
  to: string;
  firstName: string;
  lastName: string;
  invitationUrl: string;
  userType: UserType;
  loginPortal: LoginPortal;
  companyName?: string;
  department?: string;
  position?: string;
}): Promise<boolean> {
  try {
    const portalConfig = getPortalConfig(data.loginPortal);
    const userTypeConfig = getUserTypeConfig(data.userType);

    const subject = `You're invited to join ${portalConfig.name} - OryxPro`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>User Invitation - OryxPro</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 8px 8px;
          }
          .portal-badge {
            display: inline-block;
            background: ${portalConfig.color};
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin: 10px 0;
          }
          .user-type-badge {
            display: inline-block;
            background: ${userTypeConfig.color};
            color: white;
            padding: 6px 12px;
            border-radius: 16px;
            font-size: 12px;
            font-weight: 600;
            margin: 5px 0;
          }
          .accept-button {
            display: inline-block;
            background: #28a745;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            color: #666;
            font-size: 12px;
            margin-top: 30px;
          }
          .details {
            background: #fff;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid ${portalConfig.color};
          }
          .security-notice {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎉 You're Invited!</h1>
          <div class="portal-badge">${portalConfig.name}</div>
          <div class="user-type-badge">${userTypeConfig.name}</div>
        </div>
        
        <div class="content">
          <h2>Hello ${data.firstName} ${data.lastName},</h2>
          
          <p>You have been invited to join the <strong>${portalConfig.name}</strong> at OryxPro.</p>
          
          <div class="details">
            <h3>📋 Invitation Details</h3>
            <ul>
              <li><strong>Portal:</strong> ${portalConfig.name}</li>
              <li><strong>User Type:</strong> ${userTypeConfig.name}</li>
              ${data.companyName ? `<li><strong>Company:</strong> ${data.companyName}</li>` : ''}
              ${data.department ? `<li><strong>Department:</strong> ${data.department}</li>` : ''}
              ${data.position ? `<li><strong>Position:</strong> ${data.position}</li>` : ''}
            </ul>
          </div>
          
          <p>Click the button below to accept your invitation and set up your account:</p>
          
          <div style="text-align: center;">
            <a href="${data.invitationUrl}" class="accept-button">Accept Invitation</a>
          </div>
          
          <div class="security-notice">
            <h3>🔒 Security Notice</h3>
            <ul>
              <li>This invitation will expire in <strong>7 days</strong></li>
              <li>If you didn't expect this invitation, please ignore this email</li>
              <li>Never share your login credentials with anyone</li>
            </ul>
          </div>
          
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 4px; font-family: monospace;">
            ${data.invitationUrl}
          </p>
          
          <p>Welcome to the OryxPro team!</p>
          
          <p>Best regards,<br>The OryxPro Team</p>
        </div>
        
        <div class="footer">
          <p>&copy; 2024 OryxPro. All rights reserved.</p>
          <p>Enterprise Resource Planning System</p>
        </div>
      </body>
      </html>
    `;

    const text = `
You're Invited to Join OryxPro!

Hello ${data.firstName} ${data.lastName},

You have been invited to join the ${portalConfig.name} at OryxPro.

Invitation Details:
- Portal: ${portalConfig.name}
- User Type: ${userTypeConfig.name}
${data.companyName ? `- Company: ${data.companyName}` : ''}
${data.department ? `- Department: ${data.department}` : ''}
${data.position ? `- Position: ${data.position}` : ''}

To accept your invitation, click the link below:
${data.invitationUrl}

Security Notice:
- This invitation will expire in 7 days
- If you didn't expect this invitation, please ignore this email
- Never share your login credentials with anyone

Welcome to the OryxPro team!

Best regards,
The OryxPro Team

---
© 2024 OryxPro. All rights reserved.
Enterprise Resource Planning System
    `;

    const result = await sendEmail({
      to: data.to,
      subject,
      html,
      text
    });

    return result.success;

  } catch (error) {
    console.error('Error sending invitation email:', error);
    return false;
  }
}

function getPortalConfig(portal: LoginPortal) {
  switch (portal) {
    case LoginPortal.ERP_SYSTEM:
      return { name: 'ERP System', color: '#007bff' };
    case LoginPortal.EMPLOYEE_PORTAL:
      return { name: 'Employee Portal', color: '#28a745' };
    case LoginPortal.CUSTOMER_PORTAL:
      return { name: 'Customer Portal', color: '#6f42c1' };
    default:
      return { name: 'System', color: '#6c757d' };
  }
}

function getUserTypeConfig(userType: UserType) {
  switch (userType) {
    case UserType.ERP_USER:
      return { name: 'ERP User', color: '#007bff' };
    case UserType.EMPLOYEE:
      return { name: 'Employee', color: '#28a745' };
    case UserType.CUSTOMER:
      return { name: 'Customer', color: '#6f42c1' };
    default:
      return { name: 'User', color: '#6c757d' };
  }
}
