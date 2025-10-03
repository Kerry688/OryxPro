import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const returnOrdersCollection = db.collection('returnOrders');
    const ordersCollection = db.collection('orders');

    // Get some existing orders to create returns for
    const existingOrders = await ordersCollection.find({}).limit(3).toArray();
    
    if (existingOrders.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No orders found. Please seed orders first.' },
        { status: 400 }
      );
    }

    const demoReturnOrders = [
      {
        _id: new ObjectId(),
        returnNumber: 'RET-2024-001',
        originalOrderId: existingOrders[0]._id,
        originalOrderNumber: existingOrders[0].orderNumber,
        customerId: existingOrders[0].customerId,
        customerName: existingOrders[0].customerName,
        customerEmail: existingOrders[0].customerEmail,
        customerPhone: existingOrders[0].customerPhone,
        returnDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        returnReason: 'defective',
        returnType: 'refund',
        status: 'completed',
        items: [
          {
            id: 'return-item-1',
            originalItemId: existingOrders[0].items[0]?.id || 'item-1',
            productId: existingOrders[0].items[0]?.productId || 'prod-1',
            productName: existingOrders[0].items[0]?.productName || 'Canon EOS R5',
            productCode: existingOrders[0].items[0]?.productCode || 'CAN-R5',
            quantity: 1,
            unitPrice: existingOrders[0].items[0]?.unitPrice || 3899.00,
            totalPrice: existingOrders[0].items[0]?.totalPrice || 3899.00,
            condition: 'defective',
            reason: 'Camera not working properly',
            refundAmount: 3899.00,
            restockingFee: 0,
            finalRefundAmount: 3899.00
          }
        ],
        totalRefundAmount: 3899.00,
        refundMethod: 'original_payment',
        refundStatus: 'completed',
        refundTransactionId: 'REF-001-2024',
        refundProcessedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        notes: 'Customer reported camera malfunction after 1 week of use',
        internalNotes: 'Camera sent to Canon for warranty repair',
        processedBy: 'user_001',
        processedByName: 'Sarah Johnson',
        branchId: existingOrders[0].branchId,
        branchName: existingOrders[0].branchName,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        _id: new ObjectId(),
        returnNumber: 'RET-2024-002',
        originalOrderId: existingOrders[1]?._id || existingOrders[0]._id,
        originalOrderNumber: existingOrders[1]?.orderNumber || existingOrders[0].orderNumber,
        customerId: existingOrders[1]?.customerId || existingOrders[0].customerId,
        customerName: existingOrders[1]?.customerName || existingOrders[0].customerName,
        customerEmail: existingOrders[1]?.customerEmail || existingOrders[0].customerEmail,
        customerPhone: existingOrders[1]?.customerPhone || existingOrders[0].customerPhone,
        returnDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        returnReason: 'changed_mind',
        returnType: 'exchange',
        status: 'approved',
        items: [
          {
            id: 'return-item-2',
            originalItemId: existingOrders[1]?.items[0]?.id || existingOrders[0].items[0]?.id || 'item-2',
            productId: existingOrders[1]?.items[0]?.productId || existingOrders[0].items[0]?.productId || 'prod-2',
            productName: existingOrders[1]?.items[0]?.productName || existingOrders[0].items[0]?.productName || 'Sony A7 IV',
            productCode: existingOrders[1]?.items[0]?.productCode || existingOrders[0].items[0]?.productCode || 'SON-A7IV',
            quantity: 1,
            unitPrice: existingOrders[1]?.items[0]?.unitPrice || existingOrders[0].items[0]?.unitPrice || 2498.00,
            totalPrice: existingOrders[1]?.items[0]?.totalPrice || existingOrders[0].items[0]?.totalPrice || 2498.00,
            condition: 'like_new',
            reason: 'Customer wants different model',
            refundAmount: 2498.00,
            restockingFee: 50.00,
            finalRefundAmount: 2448.00
          }
        ],
        totalRefundAmount: 2448.00,
        refundMethod: 'store_credit',
        refundStatus: 'pending',
        notes: 'Customer wants to exchange for different camera model',
        internalNotes: 'Approved for exchange, waiting for new order',
        processedBy: 'user_002',
        processedByName: 'Mike Wilson',
        branchId: existingOrders[1]?.branchId || existingOrders[0].branchId,
        branchName: existingOrders[1]?.branchName || existingOrders[0].branchName,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        _id: new ObjectId(),
        returnNumber: 'RET-2024-003',
        originalOrderId: existingOrders[2]?._id || existingOrders[0]._id,
        originalOrderNumber: existingOrders[2]?.orderNumber || existingOrders[0].orderNumber,
        customerId: existingOrders[2]?.customerId || existingOrders[0].customerId,
        customerName: existingOrders[2]?.customerName || existingOrders[0].customerName,
        customerEmail: existingOrders[2]?.customerEmail || existingOrders[0].customerEmail,
        customerPhone: existingOrders[2]?.customerPhone || existingOrders[0].customerPhone,
        returnDate: new Date(), // Today
        returnReason: 'wrong_item',
        returnType: 'refund',
        status: 'pending',
        items: [
          {
            id: 'return-item-3',
            originalItemId: existingOrders[2]?.items[0]?.id || existingOrders[0].items[0]?.id || 'item-3',
            productId: existingOrders[2]?.items[0]?.productId || existingOrders[0].items[0]?.productId || 'prod-3',
            productName: existingOrders[2]?.items[0]?.productName || existingOrders[0].items[0]?.productName || 'Nikon Z9',
            productCode: existingOrders[2]?.items[0]?.productCode || existingOrders[0].items[0]?.productCode || 'NIK-Z9',
            quantity: 1,
            unitPrice: existingOrders[2]?.items[0]?.unitPrice || existingOrders[0].items[0]?.unitPrice || 5499.00,
            totalPrice: existingOrders[2]?.items[0]?.totalPrice || existingOrders[0].items[0]?.totalPrice || 5499.00,
            condition: 'new',
            reason: 'Wrong item shipped',
            refundAmount: 5499.00,
            restockingFee: 0,
            finalRefundAmount: 5499.00
          }
        ],
        totalRefundAmount: 5499.00,
        refundMethod: 'original_payment',
        refundStatus: 'pending',
        notes: 'Customer received wrong item',
        internalNotes: 'Need to verify shipping error',
        processedBy: 'user_001',
        processedByName: 'Sarah Johnson',
        branchId: existingOrders[2]?.branchId || existingOrders[0].branchId,
        branchName: existingOrders[2]?.branchName || existingOrders[0].branchName,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Clear existing return orders and insert demo data
    await returnOrdersCollection.deleteMany({});
    const result = await returnOrdersCollection.insertMany(demoReturnOrders);

    return NextResponse.json({
      success: true,
      data: { insertedCount: result.insertedCount },
      message: `Successfully seeded ${result.insertedCount} demo return orders`
    });

  } catch (error) {
    console.error('Error seeding demo return orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed demo return orders' },
      { status: 500 }
    );
  }
}
