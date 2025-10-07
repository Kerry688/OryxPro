import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { LoginPortal, UserType } from '@/lib/models/user';

// Define protected routes and their required user types
const PROTECTED_ROUTES = {
  '/employee': [UserType.EMPLOYEE, UserType.ERP_USER],
  '/customer-portal': [UserType.CUSTOMER, UserType.ERP_USER],
  '/': [UserType.ERP_USER], // Main ERP system
  '/overview': [UserType.ERP_USER],
  '/orders': [UserType.ERP_USER],
  '/products': [UserType.ERP_USER],
  '/customers': [UserType.ERP_USER],
  '/assets': [UserType.ERP_USER],
  '/fleet': [UserType.ERP_USER],
  '/finance': [UserType.ERP_USER],
  '/hr': [UserType.ERP_USER],
  '/users': [UserType.ERP_USER],
  '/settings': [UserType.ERP_USER],
};

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/login',
  '/api/auth/login',
  '/api/auth/signout',
  '/api/auth/forgot-password',
  '/api/auth/verify-reset-token',
  '/api/auth/reset-password',
  '/api/users/invite',
  '/api/users/invite/verify',
  '/api/users/invite/accept',
  '/forgot-password',
  '/reset-password',
  '/demo-users',
  '/invite',
  '/test-users',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect signin to login
  if (pathname === '/signin') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow API routes (they have their own auth)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Allow static files
  if (pathname.startsWith('/_next/') || pathname.startsWith('/static/')) {
    return NextResponse.next();
  }

  try {
    // Get token from cookies
    const token = request.cookies.get('token')?.value;

    if (!token) {
      // Redirect to login page
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Verify JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'oryxpro-super-secret-jwt-key-2024-change-in-production');
    const { payload } = await jwtVerify(token, secret);

    const userType = payload.userType as UserType;
    const loginPortal = payload.loginPortal as LoginPortal;

    // Check if user has access to the requested route
    const requiredUserTypes = PROTECTED_ROUTES[pathname as keyof typeof PROTECTED_ROUTES];
    
    if (requiredUserTypes && !requiredUserTypes.includes(userType)) {
      // User doesn't have access to this route
      // Redirect to their appropriate portal
      let redirectUrl = '/login';
      
      switch (userType) {
        case UserType.EMPLOYEE:
          redirectUrl = '/employee';
          break;
        case UserType.CUSTOMER:
          redirectUrl = '/customer-portal';
          break;
        case UserType.ERP_USER:
          redirectUrl = '/';
          break;
      }

      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // User has access, continue to the requested page
    return NextResponse.next();

  } catch (error) {
    console.error('Middleware auth error:', error);
    // Token is invalid, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
