import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb-client';
import { Warehouse, CreateWarehouseData } from '@/lib/models/warehouse';
import { ObjectId } from 'mongodb';

// GET - Fetch all warehouses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');
    const isActive = searchParams.get('isActive');
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    
    const db = await connectToMongoDB();
    let query: any = {};
    
    // Filter by branch
    if (branchId) {
      query.branchId = new ObjectId(branchId);
    }
    
    // Filter by active status
    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }
    
    // Filter by type
    if (type) {
      query.type = type;
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
    
    const warehouses = await db.collection<Warehouse>('warehouses')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    // Populate branch information
    const branches = await db.collection('branches').find({}).toArray();
    const warehousesWithBranches = warehouses.map(warehouse => ({
      ...warehouse,
      branch: branches.find(branch => branch._id.toString() === warehouse.branchId.toString())
    }));
    
    return NextResponse.json(warehousesWithBranches);
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    return NextResponse.json({ error: 'Failed to fetch warehouses' }, { status: 500 });
  }
}

// POST - Create new warehouse
export async function POST(request: NextRequest) {
  try {
    const body: CreateWarehouseData = await request.json();
    const db = await connectToMongoDB();
    
    // Check if warehouse code already exists
    const existingWarehouse = await db.collection<Warehouse>('warehouses').findOne({ 
      code: body.code 
    });
    if (existingWarehouse) {
      return NextResponse.json({ error: 'Warehouse code already exists' }, { status: 400 });
    }

    // Verify branch exists
    const branch = await db.collection('branches').findOne({ 
      _id: body.branchId 
    });
    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 400 });
    }

    const warehouseData: Warehouse = {
      ...body,
      branchId: new ObjectId(body.branchId),
      createdBy: new ObjectId(body.createdBy),
      currentCapacity: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<Warehouse>('warehouses').insertOne(warehouseData);
    
    return NextResponse.json({ 
      message: 'Warehouse created successfully', 
      id: result.insertedId 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating warehouse:', error);
    return NextResponse.json({ error: 'Failed to create warehouse' }, { status: 500 });
  }
}
