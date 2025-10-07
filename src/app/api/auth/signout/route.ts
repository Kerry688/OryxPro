import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Create response with success message
    const response = NextResponse.json({
      success: true,
      message: 'Signed out successfully'
    });

    // Clear the token cookie
    response.cookies.set('token', '', {
      path: '/',
      expires: new Date(0),
      httpOnly: false, // Allow client-side access for clearing
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    return response;
  } catch (error) {
    console.error('Error signing out:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to sign out' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Create response that redirects to login
    const response = NextResponse.redirect(new URL('/login', request.url));

    // Clear the token cookie
    response.cookies.set('token', '', {
      path: '/',
      expires: new Date(0),
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    return response;
  } catch (error) {
    console.error('Error signing out:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}