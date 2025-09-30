import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Branch, CreateBranchData, UpdateBranchData } from '@/lib/models/branch';
import { ObjectId } from 'mongodb';

// GET - Fetch all branches
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');
    const search = searchParams.get('search');
    
    const { db } = await connectToDatabase();
    let query: any = {};
    
    // Filter by active status
    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } },
        { manager: { $regex: search, $options: 'i' } }
      ];
    }
    
    const branches = await db.collection<Branch>('branches')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json({ success: true, data: branches });
  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json({ error: 'Failed to fetch branches' }, { status: 500 });
  }
}

// POST - Create new branch
export async function POST(request: NextRequest) {
  try {
    const body: CreateBranchData = await request.json();
    const { db } = await connectToDatabase();
    
    // Check if branch code already exists
    const existingBranch = await db.collection<Branch>('branches').findOne({ 
      code: body.code 
    });
    if (existingBranch) {
      return NextResponse.json({ error: 'Branch code already exists' }, { status: 400 });
    }

    const branchData: Branch = {
      ...body,
      createdBy: new ObjectId(body.createdBy),
      updatedBy: new ObjectId(body.createdBy), // Set updatedBy to same as createdBy for new branches
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<Branch>('branches').insertOne(branchData);
    
    return NextResponse.json({ 
      message: 'Branch created successfully', 
      id: result.insertedId 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating branch:', error);
    return NextResponse.json({ error: 'Failed to create branch' }, { status: 500 });
  }
}
