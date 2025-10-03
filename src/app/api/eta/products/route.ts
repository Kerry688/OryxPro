import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ETAProduct, CreateETAProductData, ETAProductSearchOptions } from '@/lib/models/eta';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const etaProductsCollection = db.collection('eta_products');
    
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const egsCode = searchParams.get('egsCode');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const syncStatus = searchParams.get('syncStatus');
    const searchTerm = searchParams.get('searchTerm');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const query: any = {};
    
    if (productId) {
      query.productId = productId;
    }
    
    if (egsCode) {
      query.egsCode = egsCode;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (syncStatus) {
      query.syncStatus = syncStatus;
    }
    
    if (searchTerm) {
      query.$or = [
        { productName: { $regex: searchTerm, $options: 'i' } },
        { productCode: { $regex: searchTerm, $options: 'i' } },
        { egsCode: { $regex: searchTerm, $options: 'i' } },
        { egsDescription: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    const products = await etaProductsCollection
      .find(query)
      .sort({ updatedAt: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      data: products,
      total: products.length
    });

  } catch (error) {
    console.error('Error fetching ETA products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ETA products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const etaProductsCollection = db.collection('eta_products');
    
    const body: CreateETAProductData = await request.json();
    const { productId, productName, productCode, egsCode, egsDescription, category, subcategory, unitOfMeasure, taxRate } = body;

    // Validate required fields
    if (!productId || !productName || !productCode || !egsCode || !egsDescription || !category || !unitOfMeasure || taxRate === undefined) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Check if product already exists
    const existingProduct = await etaProductsCollection.findOne({
      $or: [
        { productId },
        { egsCode }
      ]
    });

    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product with this ID or EGS code already exists' },
        { status: 400 }
      );
    }

    const newProduct: Omit<ETAProduct, '_id'> = {
      productId,
      productName,
      productCode,
      egsCode,
      egsDescription,
      category,
      subcategory,
      unitOfMeasure,
      taxRate,
      status: 'pending_approval',
      syncStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await etaProductsCollection.insertOne(newProduct);

    if (result.insertedId) {
      const createdProduct = await etaProductsCollection.findOne({ _id: result.insertedId });
      return NextResponse.json({
        success: true,
        data: createdProduct,
        message: 'ETA product created successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to create ETA product' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error creating ETA product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create ETA product' },
      { status: 500 }
    );
  }
}
