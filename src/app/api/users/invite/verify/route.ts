import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

// GET /api/users/invite/verify - Verify invitation token
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const invitationsCollection = db.collection('user_invitations');

    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Invitation token is required' },
        { status: 400 }
      );
    }

    console.log('Verifying invitation token:', token);

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

    return NextResponse.json({
      success: true,
      invitation: {
        token: invitation.token,
        email: invitation.email,
        firstName: invitation.firstName,
        lastName: invitation.lastName,
        userType: invitation.userType,
        role: invitation.role,
        loginPortal: invitation.loginPortal,
        customerId: invitation.customerId,
        companyName: invitation.companyName,
        employeeId: invitation.employeeId,
        department: invitation.department,
        position: invitation.position,
        phone: invitation.phone,
        expiresAt: invitation.expiresAt,
        status: invitation.status
      }
    });

  } catch (error) {
    console.error('Verify invitation error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
