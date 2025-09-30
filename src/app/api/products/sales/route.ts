import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb-client';

// GET - Fetch sales products for price list management
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || '';
    const limit = parseInt(searchParams.get('limit') || '1000');

    const db = await connectToMongoDB();

    // Build query for sales products
    let mongoQuery: any = {
      type: 'sales_product',
      isActive: true
    };

    // Add search query
    if (query) {
      mongoQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { sku: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    // Add category filter
    if (category) {
      mongoQuery.category = { $regex: category, $options: 'i' };
    }

    const products = await db.collection('products')
      .find(mongoQuery)
      .sort({ name: 1 })
      .limit(limit)
      .toArray();

    // Format products for price list management
    const formattedProducts = products.map(product => ({
      _id: product._id,
      name: product.name,
      sku: product.sku,
      category: product.category,
      subcategory: product.subcategory,
      basePrice: product.price || 0,
      cost: product.cost || 0,
      stock: product.stock || 0,
      unit: product.unit || '',
      brand: product.brand || null,
      tags: product.tags || []
    }));

    return NextResponse.json({
      products: formattedProducts,
      total: formattedProducts.length
    });
  } catch (error) {
    console.error('Error fetching sales products:', error);
    return NextResponse.json({ error: 'Failed to fetch sales products' }, { status: 500 });
  }
}
