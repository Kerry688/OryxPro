import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb-client';
import { ObjectId } from 'mongodb';

// GET - Fetch store analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');
    const branchId = searchParams.get('branchId');
    const period = searchParams.get('period') || 'monthly'; // daily, weekly, monthly, quarterly, yearly
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    const db = await connectToMongoDB();
    
    // Build date range
    let dateRange: any = {};
    if (startDate && endDate) {
      dateRange = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    } else {
      // Default to last 30 days if no date range provided
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      
      dateRange = {
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      };
    }

    // Build query
    let query: any = { ...dateRange };
    if (storeId) {
      query.storeId = new ObjectId(storeId);
    }
    if (branchId) {
      query.branchId = new ObjectId(branchId);
    }

    // Get orders data
    const orders = await db.collection('orders').find(query).toArray();
    
    // Get inventory data
    const inventoryQuery = storeId ? { storeId: new ObjectId(storeId) } : {};
    const inventory = await db.collection('inventory').find(inventoryQuery).toArray();
    
    // Get customers data
    const customerQuery = storeId ? { storeId: new ObjectId(storeId) } : {};
    const customers = await db.collection('customers').find(customerQuery).toArray();

    // Calculate analytics
    const analytics = {
      summary: {
        totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
        totalOrders: orders.length,
        averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + (order.total || 0), 0) / orders.length : 0,
        totalCustomers: customers.length,
        inventoryValue: inventory.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0),
        stockTurnover: calculateStockTurnover(inventory, orders)
      },
      trends: {
        salesGrowth: calculateSalesGrowth(orders),
        orderGrowth: calculateOrderGrowth(orders),
        customerGrowth: calculateCustomerGrowth(customers),
        inventoryGrowth: calculateInventoryGrowth(inventory)
      },
      topCategories: getTopCategories(orders),
      peakHours: getPeakHours(orders),
      busiestDays: getBusiestDays(orders),
      insights: generateInsights(orders, inventory, customers),
      recommendations: generateRecommendations(orders, inventory, customers)
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching store analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch store analytics' }, { status: 500 });
  }
}

// Helper functions for analytics calculations
function calculateStockTurnover(inventory: any[], orders: any[]): number {
  if (inventory.length === 0) return 0;
  
  const totalInventoryValue = inventory.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);
  const totalSales = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  
  return totalInventoryValue > 0 ? totalSales / totalInventoryValue : 0;
}

function calculateSalesGrowth(orders: any[]): number {
  if (orders.length < 2) return 0;
  
  const sortedOrders = orders.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const midpoint = Math.floor(sortedOrders.length / 2);
  
  const firstHalf = sortedOrders.slice(0, midpoint);
  const secondHalf = sortedOrders.slice(midpoint);
  
  const firstHalfSales = firstHalf.reduce((sum, order) => sum + (order.total || 0), 0);
  const secondHalfSales = secondHalf.reduce((sum, order) => sum + (order.total || 0), 0);
  
  return firstHalfSales > 0 ? ((secondHalfSales - firstHalfSales) / firstHalfSales) * 100 : 0;
}

function calculateOrderGrowth(orders: any[]): number {
  if (orders.length < 2) return 0;
  
  const sortedOrders = orders.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const midpoint = Math.floor(sortedOrders.length / 2);
  
  const firstHalf = sortedOrders.slice(0, midpoint);
  const secondHalf = sortedOrders.slice(midpoint);
  
  return firstHalf.length > 0 ? ((secondHalf.length - firstHalf.length) / firstHalf.length) * 100 : 0;
}

function calculateCustomerGrowth(customers: any[]): number {
  if (customers.length < 2) return 0;
  
  const sortedCustomers = customers.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const midpoint = Math.floor(sortedCustomers.length / 2);
  
  const firstHalf = sortedCustomers.slice(0, midpoint);
  const secondHalf = sortedCustomers.slice(midpoint);
  
  return firstHalf.length > 0 ? ((secondHalf.length - firstHalf.length) / firstHalf.length) * 100 : 0;
}

function calculateInventoryGrowth(inventory: any[]): number {
  // This would typically compare inventory values over time
  // For now, return a placeholder
  return 0;
}

function getTopCategories(orders: any[]): Array<{ category: string; revenue: number; orders: number }> {
  const categoryMap = new Map<string, { revenue: number; orders: number }>();
  
  orders.forEach(order => {
    order.items?.forEach((item: any) => {
      const category = item.category || 'Uncategorized';
      const existing = categoryMap.get(category) || { revenue: 0, orders: 0 };
      categoryMap.set(category, {
        revenue: existing.revenue + (item.price * item.quantity),
        orders: existing.orders + 1
      });
    });
  });
  
  return Array.from(categoryMap.entries())
    .map(([category, data]) => ({ category, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
}

function getPeakHours(orders: any[]): Array<{ hour: number; sales: number }> {
  const hourMap = new Map<number, number>();
  
  orders.forEach(order => {
    const hour = new Date(order.createdAt).getHours();
    const existing = hourMap.get(hour) || 0;
    hourMap.set(hour, existing + (order.total || 0));
  });
  
  return Array.from(hourMap.entries())
    .map(([hour, sales]) => ({ hour, sales }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);
}

function getBusiestDays(orders: any[]): Array<{ day: string; sales: number }> {
  const dayMap = new Map<string, number>();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  orders.forEach(order => {
    const day = dayNames[new Date(order.createdAt).getDay()];
    const existing = dayMap.get(day) || 0;
    dayMap.set(day, existing + (order.total || 0));
  });
  
  return Array.from(dayMap.entries())
    .map(([day, sales]) => ({ day, sales }))
    .sort((a, b) => b.sales - a.sales);
}

function generateInsights(orders: any[], inventory: any[], customers: any[]): string[] {
  const insights: string[] = [];
  
  // Sales insights
  if (orders.length > 0) {
    const avgOrderValue = orders.reduce((sum, order) => sum + (order.total || 0), 0) / orders.length;
    insights.push(`Average order value is $${avgOrderValue.toFixed(2)}`);
  }
  
  // Inventory insights
  const lowStockItems = inventory.filter(item => item.quantity <= item.minStock);
  if (lowStockItems.length > 0) {
    insights.push(`${lowStockItems.length} items are at or below minimum stock levels`);
  }
  
  // Customer insights
  if (customers.length > 0) {
    insights.push(`Total customer base: ${customers.length} customers`);
  }
  
  return insights;
}

function generateRecommendations(orders: any[], inventory: any[], customers: any[]): string[] {
  const recommendations: string[] = [];
  
  // Stock recommendations
  const lowStockItems = inventory.filter(item => item.quantity <= item.minStock);
  if (lowStockItems.length > 0) {
    recommendations.push('Consider reordering low stock items to avoid stockouts');
  }
  
  // Sales recommendations
  if (orders.length > 0) {
    const avgOrderValue = orders.reduce((sum, order) => sum + (order.total || 0), 0) / orders.length;
    if (avgOrderValue < 50) {
      recommendations.push('Consider upselling strategies to increase average order value');
    }
  }
  
  // Customer recommendations
  if (customers.length < orders.length * 0.8) {
    recommendations.push('Focus on customer retention - many orders may be from new customers');
  }
  
  return recommendations;
}
