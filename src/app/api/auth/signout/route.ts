import { NextRequest, NextResponse } from 'next/server';

// POST /api/auth/signout - User sign out
export async function POST(request: NextRequest) {
  try {
    // In a stateless JWT system, sign out is handled on the client side
    // by removing the token from storage. However, we can add server-side
    // logic here for token blacklisting if needed in the future.

    console.log('User signed out');

    return NextResponse.json({
      success: true,
      message: 'Sign out successful'
    });

  } catch (error) {
    console.error('Sign out error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
