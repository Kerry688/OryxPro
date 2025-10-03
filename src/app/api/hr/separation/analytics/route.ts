import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: {
        totalSeparations: 0,
        voluntarySeparations: 0,
        involuntarySeparations: 0,
        averageNoticePeriod: 0,
        turnoverRate: 0
      }
    });
  } catch (error) {
    console.error('Error fetching separation analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch separation analytics' },
      { status: 500 }
    );
  }
}