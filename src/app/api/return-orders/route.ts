import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import type { CreateReturnOrderData } from '@/lib/models/return-order';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const returnOrdersCollection = db.collection('returnOrders');

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const returnType = searchParams.get('returnType');
    const search = searchParams.get('search');

    // Build filter object
    const filter: any = {};
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (returnType && returnType !== 'all') {
      filter.returnType = returnType;
    }
    
    if (search) {
      filter.$or = [
        { returnNumber: { $regex: search, $options: 'i' } },
        { originalOrderNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count
    const totalCount = await returnOrdersCollection.countDocuments(filter);

    // Get return orders with pagination
    const returnOrders = await returnOrdersCollection
      .find(filter)
      .sort({ returnDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      data: returnOrders,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching return orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch return orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const returnOrdersCollection = db.collection('returnOrders');
    const ordersCollection = db.collection('orders');

    const returnData: CreateReturnOrderData = await request.json();

    // Verify original order exists
    const originalOrder = await ordersCollection.findOne({ 
      _id: new ObjectId(returnData.originalOrderId) 
    });

    if (!originalOrder) {
      return NextResponse.json(
        { success: false, error: 'Original order not found' },
        { status: 404 }
      );
    }

    // Generate return number
    const returnNumber = `RET-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

    // Calculate refund amounts for each item
    const items = returnData.items.map(item => ({
      ...item,
      id: new ObjectId().toString(),
      finalRefundAmount: item.refundAmount - (item.restockingFee || 0)
    }));

    // Calculate total refund amount
    const totalRefundAmount = items.reduce((sum, item) => sum + item.finalRefundAmount, 0);

    // Create return order document
    const returnOrder = {
      _id: new ObjectId(),
      returnNumber,
      originalOrderId: returnData.originalOrderId,
      originalOrderNumber: originalOrder.orderNumber,
      customerId: returnData.customerId || originalOrder.customerId,
      customerName: returnData.customerId ? 
        (await db.collection('customers').findOne({ _id: new ObjectId(returnData.customerId) }))?.firstName + ' ' + 
        (await db.collection('customers').findOne({ _id: new ObjectId(returnData.customerId) }))?.lastName :
        originalOrder.customerName,
      customerEmail: originalOrder.customerEmail,
      customerPhone: originalOrder.customerPhone,
      returnDate: new Date(),
      returnReason: returnData.returnReason,
      returnType: returnData.returnType,
      status: 'pending' as const,
      items,
      totalRefundAmount,
      refundMethod: 'original_payment' as const,
      refundStatus: 'pending' as const,
      notes: returnData.notes,
      internalNotes: returnData.internalNotes,
      processedBy: 'user_001', // This would come from auth context
      processedByName: 'Current User', // This would come from auth context
      branchId: originalOrder.branchId,
      branchName: originalOrder.branchName,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await returnOrdersCollection.insertOne(returnOrder);

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...returnOrder },
      message: 'Return order created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating return order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create return order' },
      { status: 500 }
    );
  }
}
