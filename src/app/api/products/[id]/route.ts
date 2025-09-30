import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb-client';
import { Product, UpdateProductData } from '@/lib/models/product';
import { ObjectId } from 'mongodb';

// GET - Fetch single product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectToMongoDB();
    const product = await db.collection<Product>('products').findOne({
      _id: new ObjectId(params.id)
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Populate related data based on product type
    let populatedProduct = { ...product };

    if (product.type === 'raw_material' && (product as any).supplier) {
      const supplier = await db.collection('suppliers').findOne({
        _id: (product as any).supplier
      });
      populatedProduct = { ...populatedProduct, supplier };
    }

    if (product.type === 'kit_bundle' && (product as any).components) {
      const componentIds = (product as any).components.map((comp: any) => comp.productId);
      const componentProducts = await db.collection('products').find({
        _id: { $in: componentIds }
      }).toArray();
      
      const componentsWithDetails = (product as any).components.map((comp: any) => ({
        ...comp,
        product: componentProducts.find(p => p._id.toString() === comp.productId.toString())
      }));

      populatedProduct = { ...populatedProduct, components: componentsWithDetails };
    }

    return NextResponse.json(populatedProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// PUT - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: UpdateProductData = await request.json();
    const db = await connectToMongoDB();

    const product = await db.collection<Product>('products').findOne({
      _id: new ObjectId(params.id)
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if SKU already exists (if SKU is being updated)
    if (body.sku && body.sku !== product.sku) {
      const existingProduct = await db.collection<Product>('products').findOne({
        sku: body.sku,
        _id: { $ne: new ObjectId(params.id) }
      });

      if (existingProduct) {
        return NextResponse.json({ error: 'SKU already exists' }, { status: 400 });
      }
    }

    // Create update data
    const updateData: any = {
      ...body,
      updatedBy: new ObjectId(body.updatedBy),
      updatedAt: new Date()
    };

    // Merge type-specific data
    if (body.salesData && product.type === 'sales_product') {
      Object.assign(updateData, body.salesData);
    }
    if (body.printData && product.type === 'print_item') {
      Object.assign(updateData, body.printData);
    }
    if (body.serviceData && product.type === 'service') {
      Object.assign(updateData, body.serviceData);
    }
    if (body.materialData && product.type === 'raw_material') {
      Object.assign(updateData, body.materialData);
    }
    if (body.kitData && product.type === 'kit_bundle') {
      Object.assign(updateData, body.kitData);
    }
    if (body.assetData && product.type === 'asset') {
      Object.assign(updateData, body.assetData);
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    const result = await db.collection<Product>('products').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectToMongoDB();

    const product = await db.collection<Product>('products').findOne({
      _id: new ObjectId(params.id)
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if product is used in orders
    const orderCount = await db.collection('orders').countDocuments({
      'items.productId': new ObjectId(params.id)
    });

    if (orderCount > 0) {
      return NextResponse.json({
        error: 'Cannot delete product that has been used in orders'
      }, { status: 400 });
    }

    // Check if product is used as component in kits
    const kitCount = await db.collection('products').countDocuments({
      type: 'kit_bundle',
      'components.productId': new ObjectId(params.id)
    });

    if (kitCount > 0) {
      return NextResponse.json({
        error: 'Cannot delete product that is used as component in kit bundles'
      }, { status: 400 });
    }

    const result = await db.collection<Product>('products').deleteOne({
      _id: new ObjectId(params.id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
