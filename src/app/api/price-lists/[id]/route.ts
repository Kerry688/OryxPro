import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb-client';
import { PriceList, UpdatePriceListData } from '@/lib/models/priceList';
import { ObjectId } from 'mongodb';

// GET - Fetch single price list by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectToMongoDB();
    const priceList = await db.collection<PriceList>('priceLists').findOne({
      _id: new ObjectId(params.id)
    });

    if (!priceList) {
      return NextResponse.json({ error: 'Price list not found' }, { status: 404 });
    }

    // Populate product details for items
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

    return NextResponse.json({
      ...priceList,
      items: itemsWithProductDetails
    });
  } catch (error) {
    console.error('Error fetching price list:', error);
    return NextResponse.json({ error: 'Failed to fetch price list' }, { status: 500 });
  }
}

// PUT - Update price list
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: UpdatePriceListData = await request.json();
    const db = await connectToMongoDB();

    const priceList = await db.collection<PriceList>('priceLists').findOne({
      _id: new ObjectId(params.id)
    });

    if (!priceList) {
      return NextResponse.json({ error: 'Price list not found' }, { status: 404 });
    }

    // Check if price list code already exists (if code is being updated)
    if (body.code && body.code !== priceList.code) {
      const existingPriceList = await db.collection<PriceList>('priceLists').findOne({
        code: body.code,
        _id: { $ne: new ObjectId(params.id) }
      });

      if (existingPriceList) {
        return NextResponse.json({ error: 'Price list code already exists' }, { status: 400 });
      }
    }

    // If this is set as default, unset other default price lists
    if (body.isDefault) {
      await db.collection('priceLists').updateMany(
        { isDefault: true, _id: { $ne: new ObjectId(params.id) } },
        { $set: { isDefault: false } }
      );
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

    const result = await db.collection<PriceList>('priceLists').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Price list not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Price list updated successfully' });
  } catch (error) {
    console.error('Error updating price list:', error);
    return NextResponse.json({ error: 'Failed to update price list' }, { status: 500 });
  }
}

// DELETE - Delete price list
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectToMongoDB();

    const priceList = await db.collection<PriceList>('priceLists').findOne({
      _id: new ObjectId(params.id)
    });

    if (!priceList) {
      return NextResponse.json({ error: 'Price list not found' }, { status: 404 });
    }

    // Check if price list is used in orders
    const orderCount = await db.collection('orders').countDocuments({
      priceListId: new ObjectId(params.id)
    });

    if (orderCount > 0) {
      return NextResponse.json({
        error: `Cannot delete price list that has been used in ${orderCount} orders. Please archive it instead.`
      }, { status: 400 });
    }

    const result = await db.collection<PriceList>('priceLists').deleteOne({
      _id: new ObjectId(params.id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Price list not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Price list deleted successfully' });
  } catch (error) {
    console.error('Error deleting price list:', error);
    return NextResponse.json({ error: 'Failed to delete price list' }, { status: 500 });
  }
}
