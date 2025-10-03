import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabaseMinimal } from '@/lib/mongodb-minimal';
import { ServiceRequest, UpdateServiceRequestData } from '@/lib/models/service-request';

// GET /api/service-requests/[id] - Get service request by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabaseMinimal();
    
    // Dynamic import of ObjectId
    const { ObjectId } = await import('mongodb');
    
    const serviceRequest = await db.collection('serviceRequests').findOne({ 
      _id: new ObjectId(params.id) 
    });

    if (!serviceRequest) {
      return NextResponse.json(
        { success: false, error: 'Service request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: serviceRequest,
    });
  } catch (error) {
    console.error('Error fetching service request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch service request' },
      { status: 500 }
    );
  }
}

// PUT /api/service-requests/[id] - Update service request
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabaseMinimal();
    const body: UpdateServiceRequestData = await request.json();
    
    // Dynamic import of ObjectId
    const { ObjectId } = await import('mongodb');

    const updateData = {
      ...body,
      updatedAt: new Date(),
    };

    const result = await db.collection('serviceRequests').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Service request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { _id: params.id, ...updateData },
    });
  } catch (error) {
    console.error('Error updating service request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update service request' },
      { status: 500 }
    );
  }
}

// DELETE /api/service-requests/[id] - Delete service request
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabaseMinimal();
    
    // Dynamic import of ObjectId
    const { ObjectId } = await import('mongodb');

    const result = await db.collection('serviceRequests').deleteOne({ 
      _id: new ObjectId(params.id) 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Service request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Service request deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting service request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete service request' },
      { status: 500 }
    );
  }
}
