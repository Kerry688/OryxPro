import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb-client';
import { Product, CreateProductData, ProductSearchOptions } from '@/lib/models/product';
import { ObjectId } from 'mongodb';

// GET - Fetch products with search and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchOptions: ProductSearchOptions = {
      query: searchParams.get('query') || undefined,
      filters: {
        type: searchParams.get('type')?.split(',') as any,
        category: searchParams.get('category')?.split(','),
        subcategory: searchParams.get('subcategory')?.split(','),
        priceRange: searchParams.get('priceMin') && searchParams.get('priceMax') ? {
          min: parseFloat(searchParams.get('priceMin')!),
          max: parseFloat(searchParams.get('priceMax')!)
        } : undefined,
        stockStatus: searchParams.get('stockStatus') as any || 'all',
        isActive: searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : undefined,
        tags: searchParams.get('tags')?.split(','),
      },
      sortBy: (searchParams.get('sortBy') as any) || 'name',
      sortOrder: (searchParams.get('sortOrder') as any) || 'asc',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20')
    };

    const db = await connectToMongoDB();
    let query: any = {};

    // Apply filters
    if (searchOptions.filters?.type && searchOptions.filters.type.length > 0) {
      query.type = { $in: searchOptions.filters.type };
    }

    if (searchOptions.filters?.category && searchOptions.filters.category.length > 0) {
      query.category = { $in: searchOptions.filters.category };
    }

    if (searchOptions.filters?.subcategory && searchOptions.filters.subcategory.length > 0) {
      query.subcategory = { $in: searchOptions.filters.subcategory };
    }

    if (searchOptions.filters?.priceRange) {
      const priceField = searchOptions.filters.type?.includes('service') ? 'basePrice' : 'price';
      query[priceField] = {
        $gte: searchOptions.filters.priceRange.min,
        $lte: searchOptions.filters.priceRange.max
      };
    }

    if (searchOptions.filters?.stockStatus && searchOptions.filters.stockStatus !== 'all') {
      switch (searchOptions.filters.stockStatus) {
        case 'in_stock':
          query.stock = { $gt: 0 };
          break;
        case 'low_stock':
          query.$expr = { $lte: ['$stock', '$minStock'] };
          break;
        case 'out_of_stock':
          query.stock = { $lte: 0 };
          break;
      }
    }

    if (searchOptions.filters?.isActive !== undefined) {
      query.isActive = searchOptions.filters.isActive;
    }

    if (searchOptions.filters?.tags && searchOptions.filters.tags.length > 0) {
      query.tags = { $in: searchOptions.filters.tags };
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
        { sku: { $regex: searchOptions.query, $options: 'i' } },
        { description: { $regex: searchOptions.query, $options: 'i' } },
        { tags: { $in: [new RegExp(searchOptions.query, 'i')] } }
      ];
    }

    // Build sort object
    const sort: any = {};
    sort[searchOptions.sortBy!] = searchOptions.sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (searchOptions.page! - 1) * searchOptions.limit!;

    // Execute query
    const [products, total] = await Promise.all([
      db.collection<Product>('products')
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(searchOptions.limit!)
        .toArray(),
      db.collection('products').countDocuments(query)
    ]);

    // Populate related data
    const populatedProducts = await Promise.all(
      products.map(async (product) => {
        // Populate supplier for raw materials
        if (product.type === 'raw_material' && (product as any).supplier) {
          const supplier = await db.collection('suppliers').findOne({
            _id: (product as any).supplier
          });
          return { ...product, supplier };
        }

        // Populate bundle components for kits
        if (product.type === 'kit_bundle' && (product as any).components) {
          const componentIds = (product as any).components.map((comp: any) => comp.productId);
          const componentProducts = await db.collection('products').find({
            _id: { $in: componentIds }
          }).toArray();
          
          const componentsWithDetails = (product as any).components.map((comp: any) => ({
            ...comp,
            product: componentProducts.find(p => p._id.toString() === comp.productId.toString())
          }));

          return { ...product, components: componentsWithDetails };
        }

        return product;
      })
    );

    return NextResponse.json({
      products: populatedProducts,
      pagination: {
        page: searchOptions.page,
        limit: searchOptions.limit,
        total,
        pages: Math.ceil(total / searchOptions.limit!)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const body: CreateProductData = await request.json();
    const db = await connectToMongoDB();

    // Check if SKU already exists
    const existingProduct = await db.collection<Product>('products').findOne({
      sku: body.sku
    });

    if (existingProduct) {
      return NextResponse.json({ error: 'SKU already exists' }, { status: 400 });
    }

    // Helper function to safely convert to ObjectId
    const safeObjectId = (id: string) => {
      try {
        // Check if it's a valid ObjectId format (24 hex characters)
        if (typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id)) {
          return new ObjectId(id);
        }
        // If not a valid ObjectId, create a new one or use a default
        return new ObjectId();
      } catch (error) {
        console.warn('Invalid ObjectId format, creating new one:', id);
        return new ObjectId();
      }
    };

    // Create base product data
    const baseProduct = {
      sku: body.sku,
      name: body.name,
      description: body.description,
      type: body.type,
      category: body.category,
      subcategory: body.subcategory,
      images: body.images,
      tags: body.tags,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: safeObjectId(body.createdBy),
      updatedBy: safeObjectId(body.createdBy)
    };

    // Merge type-specific data
    let productData: any = { ...baseProduct };

    switch (body.type) {
      case 'virtual_digital':
        productData = { ...productData, ...body.virtualDigitalData };
        break;
      case 'manufactured_product':
        productData = { ...productData, ...body.manufacturedData };
        break;
      case 'sales_product':
        productData = { ...productData, ...body.salesData };
        break;
      case 'consumables':
        productData = { ...productData, ...body.consumablesData };
        break;
      case 'print_item':
        productData = { ...productData, ...body.printData };
        break;
      case 'service':
        productData = { ...productData, ...body.serviceData };
        break;
      case 'raw_material':
        productData = { ...productData, ...body.materialData };
        break;
      case 'kit_bundle':
        productData = { ...productData, ...body.kitData };
        break;
      case 'asset':
        productData = { ...productData, ...body.assetData };
        break;
    }

    // Validate required fields based on type
    const validationError = validateProductData(productData);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const result = await db.collection<Product>('products').insertOne(productData);

    return NextResponse.json({
      message: 'Product created successfully',
      id: result.insertedId
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

// Helper function to validate product data
function validateProductData(productData: any): string | null {
  switch (productData.type) {
    case 'virtual_digital':
      if (!productData.price || productData.price <= 0) {
        return 'Price is required for virtual/digital products';
      }
      if (!productData.licenseType) {
        return 'License type is required for virtual/digital products';
      }
      if (!productData.supportedFormats || productData.supportedFormats.length === 0) {
        return 'Supported formats are required for virtual/digital products';
      }
      break;

    case 'manufactured_product':
      if (!productData.price || productData.price <= 0) {
        return 'Price is required for manufactured products';
      }
      if (productData.stock === undefined || productData.stock < 0) {
        return 'Stock quantity is required for manufactured products';
      }
      if (!productData.manufacturing || !productData.manufacturing.productionTime) {
        return 'Production time is required for manufactured products';
      }
      break;

    case 'sales_product':
      if (!productData.price || productData.price <= 0) {
        return 'Price is required for sales products';
      }
      if (productData.stock === undefined || productData.stock < 0) {
        return 'Stock quantity is required for sales products';
      }
      break;

    case 'consumables':
      if (!productData.price || productData.price <= 0) {
        return 'Price is required for consumables';
      }
      if (productData.stock === undefined || productData.stock < 0) {
        return 'Stock quantity is required for consumables';
      }
      if (!productData.consumptionRate || productData.consumptionRate <= 0) {
        return 'Consumption rate is required for consumables';
      }
      if (!productData.packaging || !productData.packaging.type) {
        return 'Packaging type is required for consumables';
      }
      break;

    case 'print_item':
      if (!productData.basePrice || productData.basePrice <= 0) {
        return 'Base price is required for print items';
      }
      if (!productData.printComplexity) {
        return 'Print complexity is required for print items';
      }
      break;

    case 'service':
      if (!productData.basePrice || productData.basePrice <= 0) {
        return 'Base price is required for services';
      }
      if (!productData.duration || productData.duration <= 0) {
        return 'Duration is required for services';
      }
      break;

    case 'raw_material':
      if (!productData.cost || productData.cost <= 0) {
        return 'Cost is required for raw materials';
      }
      if (!productData.supplier) {
        return 'Supplier is required for raw materials';
      }
      break;

    case 'kit_bundle':
      if (!productData.basePrice || productData.basePrice <= 0) {
        return 'Base price is required for kit bundles';
      }
      if (!productData.components || productData.components.length === 0) {
        return 'At least one component is required for kit bundles';
      }
      break;

    case 'asset':
      if (!productData.purchasePrice || productData.purchasePrice <= 0) {
        return 'Purchase price is required for assets';
      }
      if (!productData.usefulLife || productData.usefulLife <= 0) {
        return 'Useful life is required for assets';
      }
      break;
  }

  return null;
}
