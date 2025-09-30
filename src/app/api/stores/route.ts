import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb-client';
import { Store, CreateStoreData } from '@/lib/models/store';
import { ObjectId } from 'mongodb';

// GET - Fetch all stores
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
        { 'address.city': { $regex: search, $options: 'i' } },
        { 'address.state': { $regex: search, $options: 'i' } },
        { 'contact.email': { $regex: search, $options: 'i' } }
      ];
    }
    
    const stores = await db.collection<Store>('stores')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    // Populate branch and manager information
    const branches = await db.collection('branches').find({}).toArray();
    const users = await db.collection('users').find({}).toArray();
    
    const storesWithDetails = stores.map(store => ({
      ...store,
      branch: branches.find(branch => branch._id.toString() === store.branchId.toString()),
      manager: users.find(user => user._id.toString() === store.manager.toString()),
      staff: store.staff.map(staffId => 
        users.find(user => user._id.toString() === staffId.toString())
      ).filter(Boolean)
    }));
    
    return NextResponse.json(storesWithDetails);
  } catch (error) {
    console.error('Error fetching stores:', error);
    return NextResponse.json({ error: 'Failed to fetch stores' }, { status: 500 });
  }
}

// POST - Create new store
export async function POST(request: NextRequest) {
  try {
    const body: CreateStoreData = await request.json();
    const db = await connectToMongoDB();
    
    // Check if store code already exists
    const existingStore = await db.collection<Store>('stores').findOne({ 
      code: body.code 
    });
    if (existingStore) {
      return NextResponse.json({ error: 'Store code already exists' }, { status: 400 });
    }

    // Verify branch exists
    const branch = await db.collection('branches').findOne({ 
      _id: body.branchId 
    });
    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 400 });
    }

    // Verify manager exists
    const manager = await db.collection('users').findOne({ 
      _id: body.manager 
    });
    if (!manager) {
      return NextResponse.json({ error: 'Manager not found' }, { status: 400 });
    }

    const storeData: Store = {
      ...body,
      branchId: new ObjectId(body.branchId),
      manager: new ObjectId(body.manager),
      staff: body.staff.map(id => new ObjectId(id)),
      createdBy: new ObjectId(body.createdBy),
      metrics: {
        totalSales: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        customerCount: 0,
        inventoryValue: 0,
        stockTurnover: 0,
        lastUpdated: new Date()
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<Store>('stores').insertOne(storeData);
    
    return NextResponse.json({ 
      message: 'Store created successfully', 
      id: result.insertedId 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating store:', error);
    return NextResponse.json({ error: 'Failed to create store' }, { status: 500 });
  }
}
