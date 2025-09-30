import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb-client';
import { ProductType } from '@/lib/models/product';

// GET - Get product analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as ProductType;
    const period = searchParams.get('period') || 'monthly';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const db = await connectToMongoDB();

    // Build date filter
    let dateFilter: any = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    // Build type filter
    let typeFilter: any = {};
    if (type) {
      typeFilter = { type };
    }

    const filter = { ...dateFilter, ...typeFilter };

    // Get basic statistics
    const [
      totalProducts,
      activeProducts,
      lowStockProducts,
      outOfStockProducts,
      totalRevenue,
      topSellingProducts,
      categoryBreakdown,
      typeBreakdown
    ] = await Promise.all([
      // Total products
      db.collection('products').countDocuments(filter),
      
      // Active products
      db.collection('products').countDocuments({ ...filter, isActive: true }),
      
      // Low stock products
      db.collection('products').countDocuments({
        ...filter,
        $expr: { $lte: ['$stock', '$minStock'] }
      }),
      
      // Out of stock products
      db.collection('products').countDocuments({
        ...filter,
        stock: { $lte: 0 }
      }),
      
      // Total revenue (for products with pricing)
      db.collection('products').aggregate([
        { $match: { ...filter, isActive: true } },
        { $group: { _id: null, total: { $sum: '$price' } } }
      ]).toArray(),
      
      // Top selling products
      db.collection('products').aggregate([
        { $match: { ...filter, isActive: true } },
        { $sort: { stock: -1 } },
        { $limit: 10 },
        { $project: { name: 1, sku: 1, type: 1, price: 1, stock: 1 } }
      ]).toArray(),
      
      // Category breakdown
      db.collection('products').aggregate([
        { $match: filter },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]).toArray(),
      
      // Type breakdown
      db.collection('products').aggregate([
        { $match: filter },
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]).toArray()
    ]);

    // Calculate growth metrics (placeholder - would need historical data)
    const growthMetrics = {
      salesGrowth: Math.random() * 20 - 10, // Placeholder
      orderGrowth: Math.random() * 15 - 5, // Placeholder
      inventoryGrowth: Math.random() * 10 - 5, // Placeholder
      revenueGrowth: Math.random() * 25 - 10 // Placeholder
    };

    // Generate insights
    const insights = generateInsights({
      totalProducts,
      activeProducts,
      lowStockProducts,
      outOfStockProducts,
      totalRevenue: totalRevenue[0]?.total || 0,
      growthMetrics
    });

    // Generate recommendations
    const recommendations = generateRecommendations({
      lowStockProducts,
      outOfStockProducts,
      activeProducts,
      totalProducts,
      growthMetrics
    });

    const analytics = {
      summary: {
        totalProducts,
        activeProducts,
        lowStockProducts,
        outOfStockProducts,
        totalRevenue: totalRevenue[0]?.total || 0,
        averageProductValue: totalProducts > 0 ? (totalRevenue[0]?.total || 0) / totalProducts : 0
      },
      trends: growthMetrics,
      topSellingProducts,
      categoryBreakdown,
      typeBreakdown,
      insights,
      recommendations
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching product analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch product analytics' }, { status: 500 });
  }
}

// Helper functions
function generateInsights(data: any): string[] {
  const insights: string[] = [];

  if (data.totalProducts > 0) {
    const activeRate = (data.activeProducts / data.totalProducts) * 100;
    insights.push(`${activeRate.toFixed(1)}% of products are currently active`);
  }

  if (data.lowStockProducts > 0) {
    insights.push(`${data.lowStockProducts} products are running low on stock`);
  }

  if (data.outOfStockProducts > 0) {
    insights.push(`${data.outOfStockProducts} products are completely out of stock`);
  }

  if (data.totalRevenue > 0) {
    const avgValue = data.totalRevenue / data.activeProducts;
    insights.push(`Average product value is $${avgValue.toFixed(2)}`);
  }

  if (data.growthMetrics.salesGrowth > 0) {
    insights.push(`Sales are growing by ${data.growthMetrics.salesGrowth.toFixed(1)}%`);
  } else if (data.growthMetrics.salesGrowth < 0) {
    insights.push(`Sales have declined by ${Math.abs(data.growthMetrics.salesGrowth).toFixed(1)}%`);
  }

  return insights;
}

function generateRecommendations(data: any): string[] {
  const recommendations: string[] = [];

  if (data.lowStockProducts > data.totalProducts * 0.1) {
    recommendations.push('Consider implementing automated reorder alerts for low stock items');
  }

  if (data.outOfStockProducts > 0) {
    recommendations.push('Immediate attention needed for out-of-stock products');
  }

  if (data.activeProducts / data.totalProducts < 0.8) {
    recommendations.push('Review and potentially reactivate inactive products');
  }

  if (data.growthMetrics.salesGrowth < 0) {
    recommendations.push('Consider promotional campaigns to boost sales');
  }

  if (data.lowStockProducts > 0) {
    recommendations.push('Update supplier relationships to ensure consistent stock levels');
  }

  return recommendations;
}
