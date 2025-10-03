import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const ordersCollection = db.collection('orders');

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const source = searchParams.get('source');
    const search = searchParams.get('search');

    // Build filter object
    const filter: any = {};
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (priority && priority !== 'all') {
      filter.priority = priority;
    }
    
    if (source && source !== 'all') {
      filter.source = source;
    }
    
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count
    const totalCount = await ordersCollection.countDocuments(filter);

    // Get orders with pagination
    const orders = await ordersCollection
      .find(filter)
      .sort({ orderDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const ordersCollection = db.collection('orders');

    const orderData = await request.json();

    // Generate order number
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

    // Create order document
    const order = {
      _id: new ObjectId(),
      orderNumber,
      customerId: orderData.customerId || null,
      customerName: orderData.customerName || null,
      customerEmail: orderData.customerEmail || null,
      customerPhone: orderData.customerPhone || null,
      items: orderData.items.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        productCode: item.productCode || item.sku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        category: item.category || 'General',
        brand: item.brand || 'Unknown'
      })),
      subtotal: orderData.subtotal,
      tax: orderData.taxAmount || 0,
      discount: orderData.discountAmount || 0,
      total: orderData.totalAmount,
      payment: {
        method: orderData.paymentMethod || 'pending',
        amount: orderData.totalAmount,
        transactionId: orderData.transactionId || null,
        status: orderData.status === 'draft' ? 'pending' : 'completed',
        processedAt: orderData.status === 'draft' ? null : new Date()
      },
      status: orderData.status || 'draft',
      orderDate: new Date(),
      completedAt: orderData.status === 'draft' ? null : new Date(),
      notes: orderData.notes || null,
      internalNotes: orderData.internalNotes || null,
      cashierId: orderData.cashierId,
      cashierName: orderData.cashierName || 'Unknown Cashier',
      branchId: orderData.branchId,
      branchName: orderData.branchName || 'Main Branch',
      source: orderData.source || 'pos',
      sourceDetails: orderData.sourceDetails || {},
      paymentTerms: orderData.paymentTerms || 30,
      promotionId: orderData.promotionId || null,
      shippingMethod: orderData.shippingMethod || 'pickup',
      shippingAddress: orderData.shippingAddress || null,
      priority: orderData.priority || 'normal',
      requiredDate: orderData.requiredDate || null,
      createdBy: orderData.cashierId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await ordersCollection.insertOne(order);

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...order },
      message: 'Order created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}