import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import type { UpdateReturnOrderData } from '@/lib/models/return-order';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const returnOrdersCollection = db.collection('returnOrders');

    const returnOrder = await returnOrdersCollection.findOne({
      _id: new ObjectId(params.id)
    });

    if (!returnOrder) {
      return NextResponse.json(
        { success: false, error: 'Return order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: returnOrder
    });

  } catch (error) {
    console.error('Error fetching return order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch return order' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const returnOrdersCollection = db.collection('returnOrders');

    const updateData: UpdateReturnOrderData = await request.json();

    const result = await returnOrdersCollection.updateOne(
      { _id: new ObjectId(params.id) },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Return order not found' },
        { status: 404 }
      );
    }

    // Fetch updated return order
    const updatedReturnOrder = await returnOrdersCollection.findOne({
      _id: new ObjectId(params.id)
    });

    return NextResponse.json({
      success: true,
      data: updatedReturnOrder,
      message: 'Return order updated successfully'
    });

  } catch (error) {
    console.error('Error updating return order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update return order' },
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
    const returnOrdersCollection = db.collection('returnOrders');

    const result = await returnOrdersCollection.deleteOne({
      _id: new ObjectId(params.id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Return order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Return order deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting return order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete return order' },
      { status: 500 }
    );
  }
}
