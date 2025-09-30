import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb-client';
import { PriceList, CreatePriceListData, PriceListSearchOptions } from '@/lib/models/priceList';
import { ObjectId } from 'mongodb';

// GET - Fetch price lists with search and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchOptions: PriceListSearchOptions = {
      query: searchParams.get('query') || undefined,
      filters: {
        type: searchParams.get('type')?.split(',') as any,
        status: searchParams.get('status')?.split(',') as any,
        currency: searchParams.get('currency')?.split(','),
        isActive: searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : undefined,
        isDefault: searchParams.get('isDefault') ? searchParams.get('isDefault') === 'true' : undefined,
        createdDateRange: searchParams.get('startDate') && searchParams.get('endDate') ? {
          start: new Date(searchParams.get('startDate')!),
          end: new Date(searchParams.get('endDate')!)
        } : undefined,
      },
      sortBy: (searchParams.get('sortBy') as any) || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20')
    };

    const db = await connectToMongoDB();
    let query: any = {};

    // Apply filters
    if (searchOptions.filters?.type && searchOptions.filters.type.length > 0) {
      query.type = { $in: searchOptions.filters.type };
    }

    if (searchOptions.filters?.status && searchOptions.filters.status.length > 0) {
      query.status = { $in: searchOptions.filters.status };
    }

    if (searchOptions.filters?.currency && searchOptions.filters.currency.length > 0) {
      query.currency = { $in: searchOptions.filters.currency };
    }

    if (searchOptions.filters?.isActive !== undefined) {
      query.isActive = searchOptions.filters.isActive;
    }

    if (searchOptions.filters?.isDefault !== undefined) {
      query.isDefault = searchOptions.filters.isDefault;
    }

    if (searchOptions.filters?.createdDateRange) {
      query.createdAt = {
        $gte: searchOptions.filters.createdDateRange.start,
        $lte: searchOptions.filters.createdDateRange.end
      };
    }

    // Apply search query
    if (searchOptions.query) {
      query.$or = [
        { name: { $regex: searchOptions.query, $options: 'i' } },
        { code: { $regex: searchOptions.query, $options: 'i' } },
        { description: { $regex: searchOptions.query, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort: any = {};
    sort[searchOptions.sortBy!] = searchOptions.sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (searchOptions.page! - 1) * searchOptions.limit!;

    // Execute query
    const [priceLists, total] = await Promise.all([
      db.collection<PriceList>('priceLists')
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(searchOptions.limit!)
        .toArray(),
      db.collection('priceLists').countDocuments(query)
    ]);

    // Populate product details for items
    const populatedPriceLists = await Promise.all(
      priceLists.map(async (priceList) => {
        const productIds = priceList.items.map(item => item.productId);
        const products = await db.collection('products').find({
          _id: { $in: productIds }
        }).toArray();

        const itemsWithProductDetails = priceList.items.map(item => {
          const product = products.find(p => p._id.toString() === item.productId.toString());
          return {
            ...item,
            productName: product?.name || item.productName,
            productSku: product?.sku || item.productSku
          };
        });

        return {
          ...priceList,
          items: itemsWithProductDetails
        };
      })
    );

    return NextResponse.json({
      priceLists: populatedPriceLists,
      pagination: {
        page: searchOptions.page,
        limit: searchOptions.limit,
        total,
        pages: Math.ceil(total / searchOptions.limit!)
      }
    });
  } catch (error) {
    console.error('Error fetching price lists:', error);
    return NextResponse.json({ error: 'Failed to fetch price lists' }, { status: 500 });
  }
}

// POST - Create new price list
export async function POST(request: NextRequest) {
  try {
    const body: CreatePriceListData = await request.json();
    const db = await connectToMongoDB();

    // Check if price list code already exists
    const existingPriceList = await db.collection<PriceList>('priceLists').findOne({
      code: body.code
    });

    if (existingPriceList) {
      return NextResponse.json({ error: 'Price list code already exists' }, { status: 400 });
    }

    // If this is set as default, unset other default price lists
    if (body.isDefault) {
      await db.collection('priceLists').updateMany(
        { isDefault: true },
        { $set: { isDefault: false } }
      );
    }

    // Create price list data
    const priceListData = {
      name: body.name,
      code: body.code,
      description: body.description,
      type: body.type,
      status: body.status || 'draft',
      currency: body.currency,
      taxInclusive: body.taxInclusive,
      taxRate: body.taxRate,
      validFrom: body.validFrom,
      validTo: body.validTo,
      customerSegments: body.customerSegments || [],
      customerTypes: body.customerTypes || [],
      minimumOrderValue: body.minimumOrderValue,
      regions: body.regions || [],
      countries: body.countries || [],
      productCategories: body.productCategories || [],
      productTags: body.productTags || [],
      includeProducts: body.includeProducts || [],
      excludeProducts: body.excludeProducts || [],
      items: body.items || [],
      isActive: true,
      isDefault: body.isDefault || false,
      priority: body.priority || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: new ObjectId(body.createdBy),
      updatedBy: new ObjectId(body.createdBy)
    };

    const result = await db.collection<PriceList>('priceLists').insertOne(priceListData);

    return NextResponse.json({
      message: 'Price list created successfully',
      id: result.insertedId
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating price list:', error);
    return NextResponse.json({ error: 'Failed to create price list' }, { status: 500 });
  }
}
