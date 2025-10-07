import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const { id } = params;
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid asset ID' },
        { status: 400 }
      );
    }
    
    const asset = await db.collection('assets').findOne({ _id: new ObjectId(id) });
    
    if (!asset) {
      return NextResponse.json(
        { success: false, error: 'Asset not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: asset
    });
  } catch (error) {
    console.error('Error fetching asset:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch asset' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const { id } = params;
    const updateData = await request.json();
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid asset ID' },
        { status: 400 }
      );
    }
    
    // Check if asset exists
    const existingAsset = await db.collection('assets').findOne({ _id: new ObjectId(id) });
    if (!existingAsset) {
      return NextResponse.json(
        { success: false, error: 'Asset not found' },
        { status: 404 }
      );
    }
    
    // Check if asset ID is being changed and if it already exists
    if (updateData.assetId && updateData.assetId !== existingAsset.assetId) {
      const duplicateAsset = await db.collection('assets').findOne({ 
        assetId: updateData.assetId,
        _id: { $ne: new ObjectId(id) }
      });
      
      if (duplicateAsset) {
        return NextResponse.json(
          { success: false, error: 'Asset ID already exists' },
          { status: 400 }
        );
      }
    }
    
    // Prepare update data
    const now = new Date();
    const updatePayload = {
      ...updateData,
      updatedAt: now,
      updatedBy: updateData.updatedBy || 'system'
    };
    
    // Update asset
    const result = await db.collection('assets').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatePayload }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Asset not found' },
        { status: 404 }
      );
    }
    
    // Fetch updated asset
    const updatedAsset = await db.collection('assets').findOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({
      success: true,
      data: updatedAsset
    });
  } catch (error) {
    console.error('Error updating asset:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update asset' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const { id } = params;
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid asset ID' },
        { status: 400 }
      );
    }
    
    // Check if asset exists
    const existingAsset = await db.collection('assets').findOne({ _id: new ObjectId(id) });
    if (!existingAsset) {
      return NextResponse.json(
        { success: false, error: 'Asset not found' },
        { status: 404 }
      );
    }
    
    // Delete asset
    const result = await db.collection('assets').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Asset not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Asset deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting asset:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete asset' },
      { status: 500 }
    );
  }
}
