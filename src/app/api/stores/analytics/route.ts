import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: {
        totalStores: 0,
        totalRevenue: 0,
        averageRevenue: 0,
        topPerformingStore: null
      }
    });
  } catch (error) {
    console.error('Error fetching store analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch store analytics' },
      { status: 500 }
    );
  }
}