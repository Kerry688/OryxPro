import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    return NextResponse.json({
      success: true,
      data: []
    });
  } catch (error) {
    console.error('Error fetching chat participants:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chat participants' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      data: { id: 'new-participant-id', ...body }
    });
  } catch (error) {
    console.error('Error adding chat participant:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add chat participant' },
      { status: 500 }
    );
  }
}