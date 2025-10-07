import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { generateToken } from '@/lib/auth/jwt';
import bcrypt from 'bcryptjs';
import { UserType, UserRole, LoginPortal } from '@/lib/models/user';
import { sendPortalInvitationEmail } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, portal, role, employeeId, customerId, message } = await request.json();

    if (!email || !firstName || !lastName || !portal || !role) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Generate a temporary password that must be reset
    const temporaryPassword = 'TEMP_PASSWORD_' + Math.random().toString(36).substring(2, 15);
    const hashedPassword = await bcrypt.hash(temporaryPassword, 12);

    // Determine user type based on portal
    let userType: UserType;
    if (portal === 'customer_portal') {
      userType = UserType.CUSTOMER;
    } else if (portal === 'employee_portal') {
      userType = UserType.EMPLOYEE;
    } else {
      userType = UserType.ERP_USER;
    }

    // Generate username from email
    const username = email.split('@')[0];

    // Create user account
    const newUser = {
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
      userType,
      role: role as UserRole,
      loginPortal: portal as LoginPortal,
      isActive: true,
      mustResetPassword: true, // Force password reset on first login
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null,
      
      // Add employee or customer specific fields
      ...(employeeId && { employeeId }),
      ...(customerId && { customerId })
    };

    // Save user to database
    const result = await db.collection('users').insertOne(newUser);
    const userId = result.insertedId;

    // Generate password reset token for first login
    const passwordResetToken = await generateToken({
      userId: userId.toString(),
      email,
      userType,
      role,
      loginPortal: portal,
      employeeId,
      customerId
    });

    // Update user with password reset token
    await db.collection('users').updateOne(
      { _id: userId },
      { 
        $set: { 
          passwordResetToken,
          passwordResetExpires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        }
      }
    );

    // Generate login link that will force password reset
    const loginLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/login?reset_token=${passwordResetToken}`;
    
    console.log(`User created for ${email}:`);
    console.log(`User ID: ${userId}`);
    console.log(`Portal: ${portal}`);
    console.log(`Role: ${role}`);
    console.log(`Login Link: ${loginLink}`);
    console.log(`Must Reset Password: true`);

    // Send invitation email
    const emailSent = await sendPortalInvitationEmail({
      to: email,
      firstName,
      lastName,
      loginUrl: loginLink,
      portal: portal as LoginPortal,
      role,
      message,
      companyName: 'OryxPro'
    });

    if (!emailSent) {
      console.error('Failed to send invitation email to:', email);
      // Don't fail the request if email fails, just log it
    }

    return NextResponse.json({
      success: true,
      message: 'User created successfully and invitation sent',
      data: {
        userId: userId.toString(),
        email,
        portal,
        role,
        loginLink,
        mustResetPassword: true
      }
    });

  } catch (error) {
    console.error('Error sending invitation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send invitation' },
      { status: 500 }
    );
  }
}
