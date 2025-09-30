import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { ProductCategory } from '@/lib/data';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const categoriesCollection = db.collection<ProductCategory>('categories');

    const category = await categoriesCollection.findOne({ id: params.id });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: 'Category not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      category: category
    });

  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch category',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { db } = await connectToDatabase();
    const categoriesCollection = db.collection<ProductCategory>('categories');

    // Check if category exists
    const existingCategory = await categoriesCollection.findOne({ id: params.id });
    if (!existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: 'Category not found'
        },
        { status: 404 }
      );
    }

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

    // Check for duplicate slug (excluding current category)
    const duplicateCategory = await categoriesCollection.findOne({ 
      slug: body.slug,
      id: { $ne: params.id }
    });
    if (duplicateCategory) {
      return NextResponse.json(
        {
          success: false,
          message: 'A category with this slug already exists'
        },
        { status: 400 }
      );
    }

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

    // Prepare update data
    const updateData = {
      name: body.name,
      description: body.description || '',
      slug: body.slug,
      parentId: body.parentId && body.parentId !== 'root' ? body.parentId : undefined,
      isActive: body.isActive !== false,
      sortOrder: body.sortOrder || 1,
      level: level,
      path: path,
      updatedAt: new Date().toISOString()
    };

    // Update category
    const result = await categoriesCollection.updateOne(
      { id: params.id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Category not found'
        },
        { status: 404 }
      );
    }

    // Get updated category
    const updatedCategory = await categoriesCollection.findOne({ id: params.id });

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
      category: updatedCategory
    });

  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update category',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
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
    const categoriesCollection = db.collection<ProductCategory>('categories');
    const productsCollection = db.collection('products');

    // Check if category exists
    const existingCategory = await categoriesCollection.findOne({ id: params.id });
    if (!existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: 'Category not found'
        },
        { status: 404 }
      );
    }

    // Check if category has children
    const childCategories = await categoriesCollection.find({ parentId: params.id }).toArray();
    if (childCategories.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Cannot delete category with sub-categories. Please delete sub-categories first.'
        },
        { status: 400 }
      );
    }

    // Check if category has products
    const productsInCategory = await productsCollection.find({ category: existingCategory.name }).toArray();
    if (productsInCategory.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot delete category with products. ${productsInCategory.length} products are assigned to this category.`
        },
        { status: 400 }
      );
    }

    // Delete category
    const result = await categoriesCollection.deleteOne({ id: params.id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Category not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete category',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
