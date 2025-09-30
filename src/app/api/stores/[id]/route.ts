import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb-client';
import { Store, UpdateStoreData } from '@/lib/models/store';
import { ObjectId } from 'mongodb';

// GET - Fetch single store by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectToMongoDB();
    const store = await db.collection<Store>('stores').findOne({ 
      _id: new ObjectId(params.id) 
    });
    
    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    // Populate branch and manager information
    const branch = await db.collection('branches').findOne({ 
      _id: store.branchId 
    });
    
    const manager = await db.collection('users').findOne({ 
      _id: store.manager 
    });
    
    const staff = await db.collection('users').find({ 
      _id: { $in: store.staff } 
    }).toArray();

    const storeWithDetails = {
      ...store,
      branch,
      manager,
      staff
    };

    return NextResponse.json(storeWithDetails);
  } catch (error) {
    console.error('Error fetching store:', error);
    return NextResponse.json({ error: 'Failed to fetch store' }, { status: 500 });
  }
}

// PUT - Update store
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: UpdateStoreData = await request.json();
    const db = await connectToMongoDB();
    
    const store = await db.collection<Store>('stores').findOne({ 
      _id: new ObjectId(params.id) 
    });
    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    // Check if store code already exists (if code is being updated)
    if (body.code && body.code !== store.code) {
      const existingStore = await db.collection<Store>('stores').findOne({ 
        code: body.code,
        _id: { $ne: new ObjectId(params.id) }
      });
      if (existingStore) {
        return NextResponse.json({ error: 'Store code already exists' }, { status: 400 });
      }
    }

    // Verify branch exists (if branchId is being updated)
    if (body.branchId) {
      const branch = await db.collection('branches').findOne({ 
        _id: body.branchId 
      });
      if (!branch) {
        return NextResponse.json({ error: 'Branch not found' }, { status: 400 });
      }
    }

    // Verify manager exists (if manager is being updated)
    if (body.manager) {
      const manager = await db.collection('users').findOne({ 
        _id: body.manager 
      });
      if (!manager) {
        return NextResponse.json({ error: 'Manager not found' }, { status: 400 });
      }
    }

    const updateData = {
      ...body,
      branchId: body.branchId ? new ObjectId(body.branchId) : undefined,
      manager: body.manager ? new ObjectId(body.manager) : undefined,
      staff: body.staff ? body.staff.map(id => new ObjectId(id)) : undefined,
      updatedBy: new ObjectId(body.updatedBy),
      updatedAt: new Date(),
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => 
      updateData[key as keyof typeof updateData] === undefined && 
      delete updateData[key as keyof typeof updateData]
    );

    const result = await db.collection<Store>('stores').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Store updated successfully' });
  } catch (error) {
    console.error('Error updating store:', error);
    return NextResponse.json({ error: 'Failed to update store' }, { status: 500 });
  }
}

// DELETE - Delete store
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectToMongoDB();
    
    const store = await db.collection<Store>('stores').findOne({ 
      _id: new ObjectId(params.id) 
    });
    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    // Check if store has orders or inventory
    const hasOrders = await db.collection('orders').countDocuments({ 
      storeId: new ObjectId(params.id) 
    });
    
    const hasInventory = await db.collection('inventory').countDocuments({ 
      storeId: new ObjectId(params.id) 
    });
    
    if (hasOrders > 0 || hasInventory > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete store with existing orders or inventory' 
      }, { status: 400 });
    }

    const result = await db.collection<Store>('stores').deleteOne({ 
      _id: new ObjectId(params.id) 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Store deleted successfully' });
  } catch (error) {
    console.error('Error deleting store:', error);
    return NextResponse.json({ error: 'Failed to delete store' }, { status: 500 });
  }
}
