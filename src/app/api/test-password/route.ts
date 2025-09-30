import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, comparePassword, validatePasswordStrength, generateRandomPassword } from '@/lib/auth/password';

export async function POST(request: NextRequest) {
  try {
    const { action, password, hashedPassword } = await request.json();

    switch (action) {
      case 'hash':
        if (!password) {
          return NextResponse.json({ success: false, error: 'Password is required' }, { status: 400 });
        }
        
        const hashed = await hashPassword(password);
        const validation = validatePasswordStrength(password);
        
        return NextResponse.json({
          success: true,
          data: {
            originalPassword: password,
            hashedPassword: hashed,
            strength: validation
          }
        });

      case 'compare':
        if (!password || !hashedPassword) {
          return NextResponse.json({ success: false, error: 'Password and hashed password are required' }, { status: 400 });
        }
        
        const isValid = await comparePassword(password, hashedPassword);
        
        return NextResponse.json({
          success: true,
          data: {
            isValid,
            message: isValid ? 'Password matches' : 'Password does not match'
          }
        });

      case 'validate':
        if (!password) {
          return NextResponse.json({ success: false, error: 'Password is required' }, { status: 400 });
        }
        
        const validationResult = validatePasswordStrength(password);
        
        return NextResponse.json({
          success: true,
          data: validationResult
        });

      case 'generate':
        const generatedPassword = generateRandomPassword(12, true);
        const generatedValidation = validatePasswordStrength(generatedPassword);
        
        return NextResponse.json({
          success: true,
          data: {
            password: generatedPassword,
            strength: generatedValidation
          }
        });

      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Password test error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
