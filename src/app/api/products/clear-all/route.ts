import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function DELETE() {
  try {
    const { db } = await connectToDatabase();
    const productsCollection = db.collection('products');

    // Delete all products from the database
    const result = await productsCollection.deleteMany({});

    return NextResponse.json({
      success: true,
      message: 'All products cleared successfully',
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('Error clearing products:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to clear products',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const productsCollection = db.collection('products');

    // Get count of products in database
    const count = await productsCollection.countDocuments();

    return NextResponse.json({
      success: true,
      count: count,
      message: `Found ${count} products in database`
    });

  } catch (error) {
    console.error('Error getting product count:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to get product count',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
