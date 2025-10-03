import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const ordersCollection = db.collection('orders');

    // Get all orders without any filtering
    const allOrders = await ordersCollection.find({}).sort({ orderDate: -1 }).toArray();

    console.log('Test API - Total orders in database:', allOrders.length);
    console.log('Test API - Sample orders:', allOrders.slice(0, 3).map(o => ({
      orderNumber: o.orderNumber,
      orderDate: o.orderDate,
      customerName: o.customerName,
      total: o.total
    })));

    return NextResponse.json({
      success: true,
      data: {
        totalOrders: allOrders.length,
        orders: allOrders.slice(0, 10), // Return first 10 orders
        sampleOrders: allOrders.slice(0, 5).map(o => ({
          orderNumber: o.orderNumber,
          orderDate: o.orderDate,
          customerName: o.customerName,
          total: o.total
        }))
      },
      message: `Found ${allOrders.length} total orders in database`
    });

  } catch (error) {
    console.error('Error in test API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}