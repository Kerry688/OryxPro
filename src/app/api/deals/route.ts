import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Deal, CreateDealData } from '@/lib/models/deal';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const dealsCollection = db.collection<Deal>('deals');

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const stage = searchParams.get('stage') || '';
    const priority = searchParams.get('priority') || '';
    const assignedTo = searchParams.get('assignedTo') || '';
    const pipelineId = searchParams.get('pipelineId') || '';

    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
        { dealNumber: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) filter.status = status;
    if (stage) filter.stage = stage;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (pipelineId) filter.pipelineId = pipelineId;

    const deals = await dealsCollection
      .find(filter)
      .sort({ expectedCloseDate: 1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await dealsCollection.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: deals,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch deals' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const dealsCollection = db.collection<Deal>('deals');

    const dealData: CreateDealData = await request.json();

    // Generate deal number
    const dealNumber = `DEAL-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

    const newDeal: Deal = {
      _id: new ObjectId(),
      dealNumber,
      status: 'prospecting',
      stage: 'lead',
      priority: 'medium',
      type: 'new_business',
      probability: 10,
      currency: 'USD',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'system', // TODO: Get from auth
      createdByName: 'System User',
      ...dealData
    };

    const result = await dealsCollection.insertOne(newDeal);

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newDeal },
      message: 'Deal created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating deal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create deal' },
      { status: 500 }
    );
  }
}
