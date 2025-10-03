import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { SalesActivity, CreateSalesActivityData } from '@/lib/models/sales-activity';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const activitiesCollection = db.collection<SalesActivity>('salesActivities');

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const status = searchParams.get('status') || '';
    const priority = searchParams.get('priority') || '';
    const assignedTo = searchParams.get('assignedTo') || '';
    const customerId = searchParams.get('customerId') || '';
    const leadId = searchParams.get('leadId') || '';
    const dealId = searchParams.get('dealId') || '';

    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};
    
    if (search) {
      filter.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { activityNumber: { $regex: search, $options: 'i' } }
      ];
    }

    if (type) filter.type = type;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (customerId) filter.customerId = customerId;
    if (leadId) filter.leadId = leadId;
    if (dealId) filter.dealId = dealId;

    const activities = await activitiesCollection
      .find(filter)
      .sort({ scheduledDate: 1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await activitiesCollection.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: activities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching sales activities:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sales activities' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const activitiesCollection = db.collection<SalesActivity>('salesActivities');

    const activityData: CreateSalesActivityData = await request.json();

    // Generate activity number
    const activityNumber = `ACT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

    const newActivity: SalesActivity = {
      _id: new ObjectId(),
      activityNumber,
      status: 'scheduled',
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'system', // TODO: Get from auth
      createdByName: 'System User',
      ...activityData
    };

    const result = await activitiesCollection.insertOne(newActivity);

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newActivity },
      message: 'Sales activity created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating sales activity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create sales activity' },
      { status: 500 }
    );
  }
}
