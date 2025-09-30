import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb-client';
import { Brand, UpdateBrandData } from '@/lib/models/brand';
import { ObjectId } from 'mongodb';

// GET - Fetch single brand by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectToMongoDB();
    const brand = await db.collection<Brand>('brands').findOne({
      _id: new ObjectId(params.id)
    });

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    // Get product count for this brand
    const productCount = await db.collection('products').countDocuments({
      'brand': brand._id
    });

    return NextResponse.json({ ...brand, productCount });
  } catch (error) {
    console.error('Error fetching brand:', error);
    return NextResponse.json({ error: 'Failed to fetch brand' }, { status: 500 });
  }
}

// PUT - Update brand
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: UpdateBrandData = await request.json();
    const db = await connectToMongoDB();

    const brand = await db.collection<Brand>('brands').findOne({
      _id: new ObjectId(params.id)
    });

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    // Check if brand code already exists (if code is being updated)
    if (body.code && body.code !== brand.code) {
      const existingBrand = await db.collection<Brand>('brands').findOne({
        code: body.code,
        _id: { $ne: new ObjectId(params.id) }
      });

      if (existingBrand) {
        return NextResponse.json({ error: 'Brand code already exists' }, { status: 400 });
      }
    }

    // Create update data
    const updateData = {
      ...body,
      updatedBy: new ObjectId(body.updatedBy),
      updatedAt: new Date()
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    const result = await db.collection<Brand>('brands').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Brand updated successfully' });
  } catch (error) {
    console.error('Error updating brand:', error);
    return NextResponse.json({ error: 'Failed to update brand' }, { status: 500 });
  }
}

// DELETE - Delete brand
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectToMongoDB();

    const brand = await db.collection<Brand>('brands').findOne({
      _id: new ObjectId(params.id)
    });

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    // Check if brand is used in products
    const productCount = await db.collection('products').countDocuments({
      'brand': new ObjectId(params.id)
    });

    if (productCount > 0) {
      return NextResponse.json({
        error: `Cannot delete brand that is used in ${productCount} products. Please reassign or remove these products first.`
      }, { status: 400 });
    }

    const result = await db.collection<Brand>('brands').deleteOne({
      _id: new ObjectId(params.id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    console.error('Error deleting brand:', error);
    return NextResponse.json({ error: 'Failed to delete brand' }, { status: 500 });
  }
}
