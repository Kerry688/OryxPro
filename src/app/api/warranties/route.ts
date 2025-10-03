import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabaseMinimal } from '@/lib/mongodb-minimal';
import { 
  WarrantyCard, 
  CreateWarrantyCardData, 
  WarrantySearchOptions,
  WarrantyFilters 
} from '@/lib/models/warranty';

// GET /api/warranties - Get all warranties with search and filtering
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabaseMinimal();
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const query = searchParams.get('query') || '';
    const status = searchParams.get('status')?.split(',') || [];
    const warrantyType = searchParams.get('warrantyType')?.split(',') || [];
    const productId = searchParams.get('productId');
    const customerId = searchParams.get('customerId');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const isExpired = searchParams.get('isExpired');
    const hasClaims = searchParams.get('hasClaims');

    // Build filter object
    const filters: any = {};
    
    if (status.length > 0) {
      filters.status = { $in: status };
    }
    
    if (warrantyType.length > 0) {
      filters.warrantyType = { $in: warrantyType };
    }
    
    if (productId) {
      filters.productId = new ObjectId(productId);
    }
    
    if (customerId) {
      filters.customerId = new ObjectId(customerId);
    }
    
    if (isExpired === 'true') {
      filters.endDate = { $lt: new Date() };
    } else if (isExpired === 'false') {
      filters.endDate = { $gte: new Date() };
    }
    
    if (hasClaims === 'true') {
      filters.totalClaims = { $gt: 0 };
    } else if (hasClaims === 'false') {
      filters.totalClaims = { $eq: 0 };
    }

    // Build search query
    let searchQuery = {};
    if (query) {
      searchQuery = {
        $or: [
          { warrantyNumber: { $regex: query, $options: 'i' } },
          { productName: { $regex: query, $options: 'i' } },
          { productSku: { $regex: query, $options: 'i' } },
          { customerName: { $regex: query, $options: 'i' } },
          { customerEmail: { $regex: query, $options: 'i' } },
          { serialNumber: { $regex: query, $options: 'i' } }
        ]
      };
    }

    // Combine filters
    const finalFilters = { ...filters, ...searchQuery };

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const warranties = await db.collection('warranties')
      .find(finalFilters)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count for pagination
    const totalCount = await db.collection('warranties').countDocuments(finalFilters);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: warranties,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit
      }
    });

  } catch (error) {
    console.error('Error fetching warranties:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch warranties' },
      { status: 500 }
    );
  }
}

// POST /api/warranties - Create a new warranty card
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabaseMinimal();
    const body: CreateWarrantyCardData = await request.json();

    // Validate required fields
    if (!body.productId || !body.customerId || !body.customerName || !body.customerEmail) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Dynamic import of ObjectId
    const { ObjectId } = await import('mongodb');

    // Generate warranty number
    const warrantyNumber = `WC${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Calculate end date
    const endDate = new Date(body.purchaseDate);
    endDate.setMonth(endDate.getMonth() + body.duration);

    // Create warranty card
    const warrantyCard: WarrantyCard = {
      warrantyNumber,
      productId: new ObjectId(body.productId),
      productName: '', // Will be populated from product lookup
      productSku: '', // Will be populated from product lookup
      customerId: new ObjectId(body.customerId),
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      orderId: body.orderId ? new ObjectId(body.orderId) : undefined,
      orderNumber: body.orderNumber,
      warrantyType: body.warrantyType,
      status: 'active',
      startDate: body.purchaseDate,
      endDate,
      duration: body.duration,
      terms: body.terms,
      coverage: body.coverage,
      serialNumber: body.serialNumber,
      batchNumber: body.batchNumber,
      purchaseDate: body.purchaseDate,
      purchasePrice: body.purchasePrice,
      vendor: body.vendor,
      provider: body.provider,
      claims: [],
      totalClaims: 0,
      notes: body.notes,
      attachments: body.attachments || [],
      isTransferable: body.isTransferable,
      transferFee: body.transferFee,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: new ObjectId(body.createdBy),
      updatedBy: new ObjectId(body.createdBy)
    };

    // Get product information
    const product = await db.collection('products').findOne({ _id: new ObjectId(body.productId) });
    if (product) {
      warrantyCard.productName = product.name;
      warrantyCard.productSku = product.sku;
    }

    // Insert warranty card
    const result = await db.collection('warranties').insertOne(warrantyCard);

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...warrantyCard },
      message: 'Warranty card created successfully'
    });

  } catch (error) {
    console.error('Error creating warranty card:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create warranty card' },
      { status: 500 }
    );
  }
}
