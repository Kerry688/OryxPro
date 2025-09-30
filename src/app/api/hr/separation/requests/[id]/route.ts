import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const { id } = params;
    
    const separationRequest = await db.collection('separationRequests').findOne({ separationId: id });
    
    if (!separationRequest) {
      return NextResponse.json(
        { success: false, error: 'Separation request not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: separationRequest
    });
  } catch (error) {
    console.error('Error fetching separation request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch separation request' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const { id } = params;
    
    const result = await db.collection('separationRequests').deleteOne({ separationId: id });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Separation request not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Separation request deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting separation request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete separation request' },
      { status: 500 }
    );
  }
}
