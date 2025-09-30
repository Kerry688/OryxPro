import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { photographyBrands } from '@/lib/data/photography-brands';
import { Brand } from '@/lib/models/brand';
import { connectToDatabase, DB_NAME } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB using centralized connection
    const { client, db } = await connectToDatabase();
    const brandsCollection = db.collection<Brand>('brands');

    // Check if photography brands already exist
    const existingBrands = await brandsCollection.find({ category: 'photography' }).toArray();
    
    if (existingBrands.length > 0) {
      // Don't close the client as it's managed by the centralized connection
      return NextResponse.json({
        success: false,
        message: 'Photography brands already exist in the database',
        count: existingBrands.length
      });
    }

    // Prepare brands data with required fields
    const brandsToInsert = photographyBrands.map(brand => ({
      ...brand,
      _id: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: new ObjectId('507f1f77bcf86cd799439011'), // Default user ID
      updatedBy: new ObjectId('507f1f77bcf86cd799439011') // Default user ID
    }));

    // Insert brands into database
    const result = await brandsCollection.insertMany(brandsToInsert);

    // Don't close the client as it's managed by the centralized connection

    return NextResponse.json({
      success: true,
      message: 'Photography brands seeded successfully',
      insertedCount: result.insertedCount,
      brands: brandsToInsert.map(brand => ({
        _id: brand._id,
        name: brand.name,
        code: brand.code,
        category: brand.category
      }))
    });

  } catch (error) {
    console.error('Error seeding photography brands:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to seed photography brands',
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
    const brandsCollection = db.collection<Brand>('brands');

    // Get all photography brands
    const photographyBrands = await brandsCollection.find({ category: 'photography' }).toArray();

    return NextResponse.json({
      success: true,
      count: photographyBrands.length,
      brands: photographyBrands.map(brand => ({
        _id: brand._id,
        name: brand.name,
        code: brand.code,
        category: brand.category,
        status: brand.status,
        isActive: brand.isActive,
        createdAt: brand.createdAt
      }))
    });

  } catch (error) {
    console.error('Error fetching photography brands:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch photography brands',
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
    const brandsCollection = db.collection<Brand>('brands');

    // Delete all photography brands
    const result = await brandsCollection.deleteMany({ category: 'photography' });

    return NextResponse.json({
      success: true,
      message: 'Photography brands deleted successfully',
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('Error deleting photography brands:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to delete photography brands',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
