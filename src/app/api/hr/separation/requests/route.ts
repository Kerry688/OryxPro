import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: []
    });
  } catch (error) {
    console.error('Error fetching separation requests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch separation requests' },
      { status: 500 }
    );
  }
}