import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb-client';
import { Brand, CreateBrandData, BrandSearchOptions } from '@/lib/models/brand';
import { ObjectId } from 'mongodb';

// GET - Fetch brands with search and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchOptions: BrandSearchOptions = {
      query: searchParams.get('query') || undefined,
      filters: {
        category: searchParams.get('category')?.split(','),
        status: searchParams.get('status')?.split(','),
        countryOfOrigin: searchParams.get('countryOfOrigin')?.split(','),
        isActive: searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : undefined,
        createdDateRange: searchParams.get('startDate') && searchParams.get('endDate') ? {
          start: new Date(searchParams.get('startDate')!),
          end: new Date(searchParams.get('endDate')!)
        } : undefined,
      },
      sortBy: (searchParams.get('sortBy') as any) || 'name',
      sortOrder: (searchParams.get('sortOrder') as any) || 'asc',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20')
    };

    const db = await connectToMongoDB();
    let query: any = {};

    // Apply filters
    if (searchOptions.filters?.category && searchOptions.filters.category.length > 0) {
      query.category = { $in: searchOptions.filters.category };
    }

    if (searchOptions.filters?.status && searchOptions.filters.status.length > 0) {
      query.status = { $in: searchOptions.filters.status };
    }

    if (searchOptions.filters?.countryOfOrigin && searchOptions.filters.countryOfOrigin.length > 0) {
      query.countryOfOrigin = { $in: searchOptions.filters.countryOfOrigin };
    }

    if (searchOptions.filters?.isActive !== undefined) {
      query.isActive = searchOptions.filters.isActive;
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
        { description: { $regex: searchOptions.query, $options: 'i' } },
        { countryOfOrigin: { $regex: searchOptions.query, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort: any = {};
    sort[searchOptions.sortBy!] = searchOptions.sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (searchOptions.page! - 1) * searchOptions.limit!;

    // Execute query
    const [brands, total] = await Promise.all([
      db.collection<Brand>('brands')
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(searchOptions.limit!)
        .toArray(),
      db.collection('brands').countDocuments(query)
    ]);

    // Get product counts for each brand
    const brandsWithProductCounts = await Promise.all(
      brands.map(async (brand) => {
        const productCount = await db.collection('products').countDocuments({
          'brand': brand._id
        });
        return { ...brand, productCount };
      })
    );

    return NextResponse.json({
      brands: brandsWithProductCounts,
      pagination: {
        page: searchOptions.page,
        limit: searchOptions.limit,
        total,
        pages: Math.ceil(total / searchOptions.limit!)
      }
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
  }
}

// POST - Create new brand
export async function POST(request: NextRequest) {
  try {
    const body: CreateBrandData = await request.json();
    const db = await connectToMongoDB();

    // Check if brand code already exists
    const existingBrand = await db.collection<Brand>('brands').findOne({
      code: body.code
    });

    if (existingBrand) {
      return NextResponse.json({ error: 'Brand code already exists' }, { status: 400 });
    }

    // Create brand data
    const brandData = {
      name: body.name,
      code: body.code,
      description: body.description,
      logo: body.logo,
      website: body.website,
      email: body.email,
      phone: body.phone,
      address: body.address,
      category: body.category,
      status: body.status || 'active',
      establishedYear: body.establishedYear,
      countryOfOrigin: body.countryOfOrigin,
      certifications: body.certifications || [],
      socialMedia: body.socialMedia,
      contactPerson: body.contactPerson,
      terms: body.terms,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: new ObjectId(body.createdBy),
      updatedBy: new ObjectId(body.createdBy)
    };

    const result = await db.collection<Brand>('brands').insertOne(brandData);

    return NextResponse.json({
      message: 'Brand created successfully',
      id: result.insertedId
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating brand:', error);
    return NextResponse.json({ error: 'Failed to create brand' }, { status: 500 });
  }
}
