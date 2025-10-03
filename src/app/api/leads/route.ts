import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Lead, CreateLeadData } from '@/lib/models/lead';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const leadsCollection = db.collection<Lead>('leads');

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const source = searchParams.get('source') || '';
    const priority = searchParams.get('priority') || '';
    const assignedTo = searchParams.get('assignedTo') || '';

    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { leadNumber: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) filter.status = status;
    if (source) filter.source = source;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    const leads = await leadsCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await leadsCollection.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const leadsCollection = db.collection<Lead>('leads');

    const leadData: CreateLeadData = await request.json();

    // Generate lead number
    const leadNumber = `LEAD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

    const newLead: Lead = {
      _id: new ObjectId(),
      leadNumber,
      status: 'new',
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'system', // TODO: Get from auth
      createdByName: 'System User',
      ...leadData
    };

    const result = await leadsCollection.insertOne(newLead);

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newLead },
      message: 'Lead created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}
