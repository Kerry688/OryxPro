import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Asset, AssetType, AssetStatus, AssetCondition, AssetLifecycleStage, DepreciationMethod } from '@/lib/models/asset';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const assetType = searchParams.get('assetType');
    const search = searchParams.get('search');
    const location = searchParams.get('location');
    const department = searchParams.get('department');
    
    // Build filter object
    const filter: any = {};
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (assetType && assetType !== 'all') {
      filter.assetType = assetType;
    }
    
    if (location && location !== 'all') {
      filter.location = location;
    }
    
    if (department && department !== 'all') {
      filter.department = department;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { assetId: { $regex: search, $options: 'i' } },
        { serialNumber: { $regex: search, $options: 'i' } },
        { barcode: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute query
    const assets = await db.collection('assets')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Get total count for pagination
    const totalCount = await db.collection('assets').countDocuments(filter);
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    return NextResponse.json({
      success: true,
      data: {
        assets,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch assets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const assetData = await request.json();
    
    // Validate required fields
    const requiredFields = ['assetId', 'name', 'category', 'assetType', 'purchaseDate', 'purchaseCost'];
    for (const field of requiredFields) {
      if (!assetData[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Check if asset ID already exists
    const existingAsset = await db.collection('assets').findOne({ assetId: assetData.assetId });
    if (existingAsset) {
      return NextResponse.json(
        { success: false, error: 'Asset ID already exists' },
        { status: 400 }
      );
    }
    
    // Set default values
    const now = new Date();
    const newAsset = {
      ...assetData,
      currentValue: assetData.currentValue || assetData.purchaseCost,
      status: assetData.status || AssetStatus.ACTIVE,
      condition: assetData.condition || AssetCondition.GOOD,
      lifecycleStage: assetData.lifecycleStage || AssetLifecycleStage.ACQUISITION,
      depreciationMethod: assetData.depreciationMethod || DepreciationMethod.STRAIGHT_LINE,
      usefulLife: assetData.usefulLife || 5,
      salvageValue: assetData.salvageValue || 0,
      createdAt: now,
      updatedAt: now,
      createdBy: assetData.createdBy || 'system',
      updatedBy: assetData.updatedBy || 'system'
    };
    
    // Insert asset
    const result = await db.collection('assets').insertOne(newAsset);
    
    return NextResponse.json({
      success: true,
      data: {
        _id: result.insertedId,
        ...newAsset
      }
    });
  } catch (error) {
    console.error('Error creating asset:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create asset' },
      { status: 500 }
    );
  }
}
