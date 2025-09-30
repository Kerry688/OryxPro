import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { photographyCategories } from '@/lib/data/photography-categories';
import { ProductCategory } from '@/lib/data';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB using centralized connection
    const { db } = await connectToDatabase();
    const categoriesCollection = db.collection<ProductCategory>('categories');

    // Check if photography categories already exist
    const existingCategories = await categoriesCollection.find({ 
      path: { $regex: /^Cameras|Lenses|Lighting|Support Systems|Storage & Memory|Accessories|Video Equipment/ } 
    }).toArray();

    if (existingCategories.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Photography categories already exist in the database',
        count: existingCategories.length
      });
    }

    // Prepare categories data with required fields
    const categoriesToInsert = photographyCategories.map(category => ({
      ...category,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // Insert categories into database
    const result = await categoriesCollection.insertMany(categoriesToInsert);

    return NextResponse.json({
      success: true,
      message: 'Photography categories seeded successfully',
      insertedCount: result.insertedCount,
      categories: categoriesToInsert.map(category => ({
        id: category.id,
        name: category.name,
        path: category.path,
        level: category.level
      }))
    });

  } catch (error) {
    console.error('Error seeding photography categories:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to seed photography categories',
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
    const categoriesCollection = db.collection<ProductCategory>('categories');

    // Get all photography-related categories
    const photographyCategories = await categoriesCollection.find({ 
      path: { $regex: /^Cameras|Lenses|Lighting|Support Systems|Storage & Memory|Accessories|Video Equipment/ } 
    }).toArray();

    return NextResponse.json({
      success: true,
      count: photographyCategories.length,
      categories: photographyCategories.map(category => ({
        id: category.id,
        name: category.name,
        path: category.path,
        level: category.level,
        productCount: category.productCount,
        isActive: category.isActive,
        createdAt: category.createdAt
      }))
    });

  } catch (error) {
    console.error('Error fetching photography categories:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch photography categories',
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
    const categoriesCollection = db.collection<ProductCategory>('categories');

    // Delete all photography-related categories
    const result = await categoriesCollection.deleteMany({ 
      path: { $regex: /^Cameras|Lenses|Lighting|Support Systems|Storage & Memory|Accessories|Video Equipment/ } 
    });

    return NextResponse.json({
      success: true,
      message: 'Photography categories deleted successfully',
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('Error deleting photography categories:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete photography categories',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
