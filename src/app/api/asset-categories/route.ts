import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { AssetCategory, AssetType, DepreciationMethod } from '@/lib/models/asset';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const isActive = searchParams.get('isActive');
    const assetType = searchParams.get('assetType');
    
    // Build filter object
    const filter: any = {};
    
    if (isActive !== null) {
      filter.isActive = isActive === 'true';
    }
    
    if (assetType && assetType !== 'all') {
      filter.assetType = assetType;
    }
    
    // Execute query
    const categories = await db.collection('assetCategories')
      .find(filter)
      .sort({ name: 1 })
      .toArray();
    
    return NextResponse.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching asset categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch asset categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const categoryData = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'code', 'assetType', 'depreciationMethod', 'defaultUsefulLife'];
    for (const field of requiredFields) {
      if (!categoryData[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Check if category code already exists
    const existingCategory = await db.collection('assetCategories').findOne({ code: categoryData.code });
    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category code already exists' },
        { status: 400 }
      );
    }
    
    // Set default values
    const now = new Date();
    const newCategory = {
      ...categoryData,
      defaultSalvageValue: categoryData.defaultSalvageValue || 0,
      isActive: categoryData.isActive !== undefined ? categoryData.isActive : true,
      createdAt: now,
      updatedAt: now
    };
    
    // Insert category
    const result = await db.collection('assetCategories').insertOne(newCategory);
    
    return NextResponse.json({
      success: true,
      data: {
        _id: result.insertedId,
        ...newCategory
      }
    });
  } catch (error) {
    console.error('Error creating asset category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create asset category' },
      { status: 500 }
    );
  }
}
