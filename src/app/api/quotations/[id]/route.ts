import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Quotation, UpdateQuotationData } from '@/lib/models/quotation';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const quotationsCollection = db.collection<Quotation>('quotations');

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ success: false, error: 'Invalid Quotation ID' }, { status: 400 });
    }

    const quotation = await quotationsCollection.findOne({ _id: new ObjectId(params.id) });

    if (!quotation) {
      return NextResponse.json({ success: false, error: 'Quotation not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: quotation });

  } catch (error) {
    console.error('Error fetching quotation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quotation' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const quotationsCollection = db.collection<Quotation>('quotations');

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ success: false, error: 'Invalid Quotation ID' }, { status: 400 });
    }

    const updateData: UpdateQuotationData = await request.json();
    delete (updateData as any)._id; // Prevent _id from being updated

    const result = await quotationsCollection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Quotation not found' }, { status: 404 });
    }

    // Fetch updated quotation
    const updatedQuotation = await quotationsCollection.findOne({ _id: new ObjectId(params.id) });

    return NextResponse.json({
      success: true,
      data: updatedQuotation,
      message: 'Quotation updated successfully'
    });

  } catch (error) {
    console.error('Error updating quotation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update quotation' },
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
    const quotationsCollection = db.collection<Quotation>('quotations');

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ success: false, error: 'Invalid Quotation ID' }, { status: 400 });
    }

    const result = await quotationsCollection.deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Quotation not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Quotation deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting quotation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete quotation' },
      { status: 500 }
    );
  }
}
