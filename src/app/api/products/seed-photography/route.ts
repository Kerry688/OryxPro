import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { photographyProducts } from '@/lib/data/photography-products';
import { Product } from '@/lib/data';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB using centralized connection
    const { db } = await connectToDatabase();
    const productsCollection = db.collection<Product>('products');

    // Check if photography products already exist
    const existingProducts = await productsCollection.find({ 
      category: { 
        $in: [
          'DSLR Cameras', 'Mirrorless Cameras', 'Medium Format Cameras', 'Point & Shoot Cameras',
          'Prime Lenses', 'Zoom Lenses', 'Macro Lenses', 'Telephoto Lenses',
          'Studio Lights', 'Flash Units', 'Light Modifiers',
          'Tripods', 'Monopods', 'Tripod Heads',
          'Memory Cards', 'Card Readers', 'External Storage',
          'Camera Bags', 'Camera Straps', 'Filters', 'Cleaning Kits',
          'Video Cameras', 'Video Accessories',
          'Print Services', 'Photo Services'
        ]
      }
    }).toArray();

    if (existingProducts.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Photography products already exist in the database',
        count: existingProducts.length
      });
    }

    // Prepare products data with required fields
    const productsToInsert = photographyProducts.map(product => ({
      ...product,
      id: new ObjectId().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // Insert products into database
    const result = await productsCollection.insertMany(productsToInsert);

    return NextResponse.json({
      success: true,
      message: 'Photography products seeded successfully',
      insertedCount: result.insertedCount,
      products: productsToInsert.map(product => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        category: product.category,
        brand: product.brand,
        type: product.type,
        price: product.price
      }))
    });

  } catch (error) {
    console.error('Error seeding photography products:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to seed photography products',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Connect to MongoDB using centralized connection
    const { db } = await connectToDatabase();
    const productsCollection = db.collection<Product>('products');

    // Get all photography-related products
    const photographyProducts = await productsCollection.find({ 
      category: { 
        $in: [
          'DSLR Cameras', 'Mirrorless Cameras', 'Medium Format Cameras', 'Point & Shoot Cameras',
          'Prime Lenses', 'Zoom Lenses', 'Macro Lenses', 'Telephoto Lenses',
          'Studio Lights', 'Flash Units', 'Light Modifiers',
          'Tripods', 'Monopods', 'Tripod Heads',
          'Memory Cards', 'Card Readers', 'External Storage',
          'Camera Bags', 'Camera Straps', 'Filters', 'Cleaning Kits',
          'Video Cameras', 'Video Accessories',
          'Print Services', 'Photo Services'
        ]
      }
    }).toArray();

    return NextResponse.json({
      success: true,
      count: photographyProducts.length,
      products: photographyProducts.map(product => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        category: product.category,
        brand: product.brand,
        type: product.type,
        price: product.price,
        stock: product.stock,
        isActive: product.isActive,
        createdAt: product.createdAt
      }))
    });

  } catch (error) {
    console.error('Error fetching photography products:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch photography products',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    // Connect to MongoDB using centralized connection
    const { db } = await connectToDatabase();
    const productsCollection = db.collection<Product>('products');

    // Delete all photography-related products
    const result = await productsCollection.deleteMany({ 
      category: { 
        $in: [
          'DSLR Cameras', 'Mirrorless Cameras', 'Medium Format Cameras', 'Point & Shoot Cameras',
          'Prime Lenses', 'Zoom Lenses', 'Macro Lenses', 'Telephoto Lenses',
          'Studio Lights', 'Flash Units', 'Light Modifiers',
          'Tripods', 'Monopods', 'Tripod Heads',
          'Memory Cards', 'Card Readers', 'External Storage',
          'Camera Bags', 'Camera Straps', 'Filters', 'Cleaning Kits',
          'Video Cameras', 'Video Accessories',
          'Print Services', 'Photo Services'
        ]
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Photography products deleted successfully',
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('Error deleting photography products:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete photography products',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
