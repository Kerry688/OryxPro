import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const ordersCollection = db.collection('orders');
    
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    if (!date) {
      return NextResponse.json(
        { success: false, error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    // Create date range for the selected date
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    console.log('Daily Orders API - Date range:', {
      date,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });

    // First, let's check what orders exist in the database
    const allOrders = await ordersCollection.find({}).sort({ orderDate: -1 }).limit(10).toArray();
    console.log('Daily Orders API - All orders in database:', allOrders.length);
    console.log('Daily Orders API - Sample order dates:', allOrders.map(o => ({ 
      orderNumber: o.orderNumber, 
      orderDate: o.orderDate,
      orderDateType: typeof o.orderDate,
      orderDateString: o.orderDate?.toString()
    })));

    // Try multiple date filtering approaches
    let orders = await ordersCollection
      .find({
        orderDate: {
          $gte: startDate,
          $lte: endDate
        }
      })
      .sort({ orderDate: -1 })
      .toArray();

    console.log('Daily Orders API - Found orders with date range:', orders.length);

    // If no orders found, try different approaches
    if (orders.length === 0) {
      // Try matching by date string (YYYY-MM-DD format)
      const dateString = date; // e.g., "2024-01-15"
      const dateRegex = new RegExp(`^${dateString}`);
      
      orders = await ordersCollection
        .find({
          $or: [
            { orderDate: { $gte: startDate, $lte: endDate } },
            { orderDate: { $regex: dateRegex } }
          ]
        })
        .sort({ orderDate: -1 })
        .toArray();
        
      console.log('Daily Orders API - Found orders with regex match:', orders.length);
    }

    // If still no orders found, try a broader search (last 7 days)
    if (orders.length === 0) {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      orders = await ordersCollection
        .find({
          orderDate: {
            $gte: sevenDaysAgo
          }
        })
        .sort({ orderDate: -1 })
        .toArray();
        
      console.log('Daily Orders API - Found orders in last 7 days:', orders.length);
    }

    // If still no orders, return all orders for debugging
    if (orders.length === 0) {
      orders = await ordersCollection
        .find({})
        .sort({ orderDate: -1 })
        .limit(10)
        .toArray();
        
      console.log('Daily Orders API - Returning all orders for debugging:', orders.length);
    }

    return NextResponse.json({
      success: true,
      data: orders,
      message: `Found ${orders.length} orders for ${date}`
    });

  } catch (error) {
    console.error('Error fetching daily orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch daily orders' },
      { status: 500 }
    );
  }
}
