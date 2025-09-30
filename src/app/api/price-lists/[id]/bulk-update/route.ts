import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb-client';
import { BulkPriceUpdateData } from '@/lib/models/priceList';
import { ObjectId } from 'mongodb';

// PUT - Bulk update prices in a price list
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: BulkPriceUpdateData = await request.json();
    const db = await connectToMongoDB();

    const priceList = await db.collection('priceLists').findOne({
      _id: new ObjectId(params.id)
    });

    if (!priceList) {
      return NextResponse.json({ error: 'Price list not found' }, { status: 404 });
    }

    // Update each item in the price list
    const updatePromises = body.updates.map(async (update) => {
      const updateFields: any = {};
      
      if (update.price !== undefined) updateFields['items.$.price'] = update.price;
      if (update.discountPercentage !== undefined) updateFields['items.$.discountPercentage'] = update.discountPercentage;
      if (update.discountAmount !== undefined) updateFields['items.$.discountAmount'] = update.discountAmount;
      if (update.minQuantity !== undefined) updateFields['items.$.minQuantity'] = update.minQuantity;
      if (update.maxQuantity !== undefined) updateFields['items.$.maxQuantity'] = update.maxQuantity;
      if (update.effectiveDate !== undefined) updateFields['items.$.effectiveDate'] = update.effectiveDate;
      if (update.expiryDate !== undefined) updateFields['items.$.expiryDate'] = update.expiryDate;
      if (update.notes !== undefined) updateFields['items.$.notes'] = update.notes;
      if (update.isActive !== undefined) updateFields['items.$.isActive'] = update.isActive;

      // Update the specific item in the price list
      await db.collection('priceLists').updateOne(
        { 
          _id: new ObjectId(params.id),
          'items.productId': update.productId
        },
        { $set: updateFields }
      );

      // Record price history if price changed
      const currentItem = priceList.items.find((item: any) => 
        item.productId.toString() === update.productId.toString()
      );

      if (update.price !== undefined && currentItem && currentItem.price !== update.price) {
        const priceHistory = {
          productId: update.productId,
          priceListId: new ObjectId(params.id),
          oldPrice: currentItem.price,
          newPrice: update.price,
          changeType: update.price > currentItem.price ? 'increase' : 'decrease',
          changePercentage: ((update.price - currentItem.price) / currentItem.price) * 100,
          changeAmount: update.price - currentItem.price,
          reason: 'Bulk price update',
          effectiveDate: new Date(),
          createdBy: new ObjectId(body.updatedBy),
          createdAt: new Date()
        };

        await db.collection('priceHistory').insertOne(priceHistory);
      }
    });

    await Promise.all(updatePromises);

    // Update the price list's updatedAt timestamp
    await db.collection('priceLists').updateOne(
      { _id: new ObjectId(params.id) },
      { 
        $set: { 
          updatedAt: new Date(),
          updatedBy: new ObjectId(body.updatedBy)
        }
      }
    );

    return NextResponse.json({ 
      message: `Successfully updated ${body.updates.length} price items` 
    });
  } catch (error) {
    console.error('Error bulk updating prices:', error);
    return NextResponse.json({ error: 'Failed to bulk update prices' }, { status: 500 });
  }
}
