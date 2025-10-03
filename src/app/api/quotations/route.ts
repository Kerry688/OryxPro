import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Quotation, CreateQuotationData } from '@/lib/models/quotation';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const quotationsCollection = db.collection<Quotation>('quotations');

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const type = searchParams.get('type') || '';
    const assignedTo = searchParams.get('assignedTo') || '';
    const customerId = searchParams.get('customerId') || '';

    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};
    
    if (search) {
      filter.$or = [
        { quotationNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) filter.status = status;
    if (type) filter.type = type;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (customerId) filter.customerId = customerId;

    const quotations = await quotationsCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await quotationsCollection.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: quotations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching quotations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quotations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const quotationsCollection = db.collection<Quotation>('quotations');

    const quotationData: CreateQuotationData = await request.json();

    // Generate quotation number
    const quotationNumber = `QUO-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

    const newQuotation: Quotation = {
      _id: new ObjectId(),
      quotationNumber,
      status: 'draft',
      type: 'quotation',
      currency: 'USD',
      taxRate: 0,
      taxAmount: 0,
      discountAmount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'system', // TODO: Get from auth
      createdByName: 'System User',
      ...quotationData
    };

    const result = await quotationsCollection.insertOne(newQuotation);

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newQuotation },
      message: 'Quotation created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating quotation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create quotation' },
      { status: 500 }
    );
  }
}
