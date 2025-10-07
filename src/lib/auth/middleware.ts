import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader, JWTPayload } from './jwt';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

/**
 * Middleware to verify JWT token and add user to request
 * @param request - NextRequest object
 * @returns NextResponse with user data or error
 */
export async function authenticateToken(request: NextRequest): Promise<{ user: JWTPayload } | { error: string; status: number }> {
  const authHeader = request.headers.get('authorization');
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return {
      error: 'Access token is required',
      status: 401
    };
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return {
      error: 'Invalid or expired token',
      status: 401
    };
  }

  return { user: payload };
}

/**
 * Create an authenticated response
 * @param user - User payload from JWT
 * @param data - Response data
 * @param message - Optional message
 * @returns NextResponse with user data
 */
export function createAuthenticatedResponse(user: JWTPayload, data: any, message?: string): NextResponse {
  return NextResponse.json({
    success: true,
    data: {
      ...data,
      user: {
        userId: user.userId,
        email: user.email,
        userType: user.userType,
        role: user.role,
        loginPortal: user.loginPortal,
        branchId: user.branchId,
        customerId: user.customerId,
        employeeId: user.employeeId
      }
    },
    message
  });
}

/**
 * Create an error response
 * @param error - Error message
 * @param status - HTTP status code
 * @returns NextResponse with error
 */
export function createErrorResponse(error: string, status: number = 500): NextResponse {
  return NextResponse.json(
    { success: false, error },
    { status }
  );
}
