import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Lead, UpdateLeadData } from '@/lib/models/lead';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const leadsCollection = db.collection<Lead>('leads');

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ success: false, error: 'Invalid Lead ID' }, { status: 400 });
    }

    const lead = await leadsCollection.findOne({ _id: new ObjectId(params.id) });

    if (!lead) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: lead });

  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch lead' },
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
    const leadsCollection = db.collection<Lead>('leads');

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ success: false, error: 'Invalid Lead ID' }, { status: 400 });
    }

    const updateData: UpdateLeadData = await request.json();
    delete (updateData as any)._id; // Prevent _id from being updated

    const result = await leadsCollection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    // Fetch updated lead
    const updatedLead = await leadsCollection.findOne({ _id: new ObjectId(params.id) });

    return NextResponse.json({
      success: true,
      data: updatedLead,
      message: 'Lead updated successfully'
    });

  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update lead' },
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
    const leadsCollection = db.collection<Lead>('leads');

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ success: false, error: 'Invalid Lead ID' }, { status: 400 });
    }

    const result = await leadsCollection.deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}
