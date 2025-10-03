import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabaseMinimal } from '@/lib/mongodb-minimal';
import { ServiceHistoryEntry, UpdateServiceHistoryData } from '@/lib/models/service-history';

// GET /api/service-history/[id] - Get service history by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabaseMinimal();
    
    // Dynamic import of ObjectId
    const { ObjectId } = await import('mongodb');
    
    const serviceHistory = await db.collection('serviceHistory').findOne({ 
      _id: new ObjectId(params.id) 
    });

    if (!serviceHistory) {
      return NextResponse.json(
        { success: false, error: 'Service history not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: serviceHistory,
    });
  } catch (error) {
    console.error('Error fetching service history:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch service history' },
      { status: 500 }
    );
  }
}

// PUT /api/service-history/[id] - Update service history
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabaseMinimal();
    const body: UpdateServiceHistoryData = await request.json();
    
    // Dynamic import of ObjectId
    const { ObjectId } = await import('mongodb');

    const updateData = {
      ...body,
      updatedAt: new Date(),
      version: { $inc: 1 },
    };

    const result = await db.collection('serviceHistory').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Service history not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { _id: params.id, ...updateData },
    });
  } catch (error) {
    console.error('Error updating service history:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update service history' },
      { status: 500 }
    );
  }
}

// DELETE /api/service-history/[id] - Delete service history
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabaseMinimal();
    
    // Dynamic import of ObjectId
    const { ObjectId } = await import('mongodb');

    const result = await db.collection('serviceHistory').deleteOne({ 
      _id: new ObjectId(params.id) 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Service history not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Service history deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting service history:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete service history' },
      { status: 500 }
    );
  }
}
