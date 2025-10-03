import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('API: Fetching order with ID:', params.id);
    const { db } = await connectToDatabase();
    const ordersCollection = db.collection('orders');

    let order = null;

    // First try to find by orderNumber (most common case)
    order = await ordersCollection.findOne({
      orderNumber: params.id
    });

    console.log('API: Search by orderNumber result:', order ? 'Found' : 'Not found');

    // If not found by orderNumber, try by ObjectId
    if (!order) {
      try {
        order = await ordersCollection.findOne({
          _id: new ObjectId(params.id)
        });
        console.log('API: Search by ObjectId result:', order ? 'Found' : 'Not found');
      } catch (objectIdError) {
        console.log('API: ObjectId conversion failed:', objectIdError);
        // ObjectId conversion failed, continue with null
      }
    }

    if (!order) {
      console.log('API: Order not found for ID:', params.id);
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    console.log('API: Order found:', order.orderNumber);
    return NextResponse.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('API: Error fetching order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
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
    const ordersCollection = db.collection('orders');

    const updateData = await request.json();

    const result = await ordersCollection.updateOne(
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
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Fetch updated order
    const updatedOrder = await ordersCollection.findOne({
      _id: new ObjectId(params.id)
    });

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'Order updated successfully'
    });

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
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
    const ordersCollection = db.collection('orders');

    const result = await ordersCollection.deleteOne({
      _id: new ObjectId(params.id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}
