import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { hashPassword } from '@/lib/auth/password';
import { UserType, LoginPortal, UserRole } from '@/lib/models/user';

interface AcceptInvitationRequest {
  token: string;
  password: string;
}

// POST /api/users/invite/accept - Accept invitation and create user account
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const invitationsCollection = db.collection('user_invitations');
    const usersCollection = db.collection('users');

    const { token, password }: AcceptInvitationRequest = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { success: false, message: 'Token and password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    console.log('Accepting invitation for token:', token);

    // Find invitation
    const invitation = await invitationsCollection.findOne({
      token,
      status: 'pending'
    });

    if (!invitation) {
      console.log('Invalid or used invitation token');
      return NextResponse.json(
        { success: false, message: 'Invalid or expired invitation' },
        { status: 400 }
      );
    }

    // Check if invitation has expired
    if (new Date() > new Date(invitation.expiresAt)) {
      console.log('Invitation token expired');
      return NextResponse.json(
        { success: false, message: 'Invitation has expired' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: invitation.email });
    if (existingUser) {
      console.log('User already exists:', invitation.email);
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user account
    const user = {
      firstName: invitation.firstName,
      lastName: invitation.lastName,
      email: invitation.email,
      username: invitation.email.split('@')[0], // Use email prefix as username
      password: hashedPassword,
      userType: invitation.userType,
      role: invitation.role,
      loginPortal: invitation.loginPortal,
      isActive: true,
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: [],
      
      // Customer-specific fields
      customerId: invitation.customerId,
      companyName: invitation.companyName,
      
      // Employee-specific fields
      employeeId: invitation.employeeId,
      department: invitation.department,
      position: invitation.position,
      managerId: invitation.managerId,
      
      // Additional fields
      phone: invitation.phone,
      branchId: invitation.branchId
    };

    const result = await usersCollection.insertOne(user);

    // Mark invitation as accepted
    await invitationsCollection.updateOne(
      { token },
      { 
        $set: { 
          status: 'accepted',
          acceptedAt: new Date(),
          userId: result.insertedId
        } 
      }
    );

    console.log('User account created successfully:', invitation.email);

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        _id: result.insertedId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
        role: user.role,
        loginPortal: user.loginPortal
      }
    });

  } catch (error) {
    console.error('Accept invitation error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
