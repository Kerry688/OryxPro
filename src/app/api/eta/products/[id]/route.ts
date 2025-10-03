import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ETAProduct, UpdateETAProductData } from '@/lib/models/eta';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const etaProductsCollection = db.collection('eta_products');
    
    const product = await etaProductsCollection.findOne({
      $or: [
        { _id: new ObjectId(params.id) },
        { productId: params.id },
        { egsCode: params.id }
      ]
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'ETA product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Error fetching ETA product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ETA product' },
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
    const etaProductsCollection = db.collection('eta_products');
    
    const body: UpdateETAProductData = await request.json();
    
    const updateData = {
      ...body,
      updatedAt: new Date()
    };

    const result = await etaProductsCollection.updateOne(
      {
        $or: [
          { _id: new ObjectId(params.id) },
          { productId: params.id },
          { egsCode: params.id }
        ]
      },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'ETA product not found' },
        { status: 404 }
      );
    }

    const updatedProduct = await etaProductsCollection.findOne({
      $or: [
        { _id: new ObjectId(params.id) },
        { productId: params.id },
        { egsCode: params.id }
      ]
    });

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'ETA product updated successfully'
    });

  } catch (error) {
    console.error('Error updating ETA product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update ETA product' },
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
    const etaProductsCollection = db.collection('eta_products');
    
    const result = await etaProductsCollection.deleteOne({
      $or: [
        { _id: new ObjectId(params.id) },
        { productId: params.id },
        { egsCode: params.id }
      ]
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'ETA product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'ETA product deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting ETA product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete ETA product' },
      { status: 500 }
    );
  }
}
