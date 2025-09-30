import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { ProductCategory } from '@/lib/data';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const categoriesCollection = db.collection<ProductCategory>('categories');

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const parentId = searchParams.get('parentId');
    const isActive = searchParams.get('isActive');
    const level = searchParams.get('level');

    // Build query
    let query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { path: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (parentId) {
      query.parentId = parentId === 'root' ? { $exists: false } : parentId;
    }
    
    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }
    
    if (level !== null) {
      query.level = parseInt(level);
    }

    // Fetch categories
    const categories = await categoriesCollection.find(query).sort({ sortOrder: 1, name: 1 }).toArray();

    // Build tree structure
    const categoryMap = new Map<string, ProductCategory & { children: ProductCategory[] }>();
    const rootCategories: (ProductCategory & { children: ProductCategory[] })[] = [];

    // Initialize all categories with empty children arrays
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Build the tree structure
    categories.forEach(category => {
      const categoryWithChildren = categoryMap.get(category.id)!;
      
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.children.push(categoryWithChildren);
        }
      } else {
        rootCategories.push(categoryWithChildren);
      }
    });

    // Sort categories by sortOrder
    const sortCategories = (cats: (ProductCategory & { children: ProductCategory[] })[]) => {
      cats.sort((a, b) => a.sortOrder - b.sortOrder);
      cats.forEach(cat => {
        if (cat.children.length > 0) {
          sortCategories(cat.children);
        }
      });
    };

    sortCategories(rootCategories);

    return NextResponse.json({
      success: true,
      categories: categories,
      tree: rootCategories,
      total: categories.length
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch categories',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { db } = await connectToDatabase();
    const categoriesCollection = db.collection<ProductCategory>('categories');

    // Validate required fields
    if (!body.name || !body.slug) {
      return NextResponse.json(
        {
          success: false,
          message: 'Name and slug are required'
        },
        { status: 400 }
      );
    }

    // Check for duplicate slug
    const existingCategory = await categoriesCollection.findOne({ slug: body.slug });
    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: 'A category with this slug already exists'
        },
        { status: 400 }
      );
    }

    // Generate new category ID
    const categoryId = new ObjectId().toString();

    // Calculate level and path
    let level = 0;
    let path = body.name;
    
    if (body.parentId && body.parentId !== 'root') {
      const parentCategory = await categoriesCollection.findOne({ id: body.parentId });
      if (parentCategory) {
        level = parentCategory.level + 1;
        path = `${parentCategory.path} > ${body.name}`;
      }
    }

    // Prepare category data
    const categoryData: ProductCategory = {
      id: categoryId,
      name: body.name,
      description: body.description || '',
      slug: body.slug,
      parentId: body.parentId && body.parentId !== 'root' ? body.parentId : undefined,
      isActive: body.isActive !== false,
      sortOrder: body.sortOrder || 1,
      level: level,
      path: path,
      productCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Insert category
    await categoriesCollection.insertOne(categoryData);

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      category: categoryData
    });

  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create category',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
