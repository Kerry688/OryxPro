import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Branch, UpdateBranchData } from '@/lib/models/branch';
import { ObjectId } from 'mongodb';

// GET - Fetch single branch by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();
    const branch = await db.collection<Branch>('branches').findOne({ 
      _id: new ObjectId(id) 
    });
    
    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    return NextResponse.json(branch);
  } catch (error) {
    console.error('Error fetching branch:', error);
    return NextResponse.json({ error: 'Failed to fetch branch' }, { status: 500 });
  }
}

// PUT - Update branch
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: UpdateBranchData = await request.json();
    const { db } = await connectToDatabase();
    
    const branch = await db.collection<Branch>('branches').findOne({ 
      _id: new ObjectId(id) 
    });
    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    // Check if branch code already exists (if code is being updated)
    if (body.code && body.code !== branch.code) {
      const existingBranch = await db.collection<Branch>('branches').findOne({ 
        code: body.code,
        _id: { $ne: new ObjectId(id) }
      });
      if (existingBranch) {
        return NextResponse.json({ error: 'Branch code already exists' }, { status: 400 });
      }
    }

    const updateData = {
      ...body,
      updatedBy: new ObjectId(body.updatedBy),
      updatedAt: new Date(),
    };

    const result = await db.collection<Branch>('branches').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Branch updated successfully' });
  } catch (error) {
    console.error('Error updating branch:', error);
    return NextResponse.json({ error: 'Failed to update branch' }, { status: 500 });
  }
}

// DELETE - Delete branch
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();
    
    const branch = await db.collection<Branch>('branches').findOne({ 
      _id: new ObjectId(id) 
    });
    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    // Check if branch has warehouses
    const warehouses = await db.collection('warehouses').countDocuments({ 
      branchId: new ObjectId(id) 
    });
    
    if (warehouses > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete branch with existing warehouses' 
      }, { status: 400 });
    }

    const result = await db.collection<Branch>('branches').deleteOne({ 
      _id: new ObjectId(id) 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Branch deleted successfully' });
  } catch (error) {
    console.error('Error deleting branch:', error);
    return NextResponse.json({ error: 'Failed to delete branch' }, { status: 500 });
  }
}
