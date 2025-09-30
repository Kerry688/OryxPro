import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb-client';
import { Warehouse, UpdateWarehouseData } from '@/lib/models/warehouse';
import { ObjectId } from 'mongodb';

// GET - Fetch single warehouse by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectToMongoDB();
    const warehouse = await db.collection<Warehouse>('warehouses').findOne({ 
      _id: new ObjectId(params.id) 
    });
    
    if (!warehouse) {
      return NextResponse.json({ error: 'Warehouse not found' }, { status: 404 });
    }

    // Populate branch information
    const branch = await db.collection('branches').findOne({ 
      _id: warehouse.branchId 
    });

    const warehouseWithBranch = {
      ...warehouse,
      branch
    };

    return NextResponse.json(warehouseWithBranch);
  } catch (error) {
    console.error('Error fetching warehouse:', error);
    return NextResponse.json({ error: 'Failed to fetch warehouse' }, { status: 500 });
  }
}

// PUT - Update warehouse
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: UpdateWarehouseData = await request.json();
    const db = await connectToMongoDB();
    
    const warehouse = await db.collection<Warehouse>('warehouses').findOne({ 
      _id: new ObjectId(params.id) 
    });
    if (!warehouse) {
      return NextResponse.json({ error: 'Warehouse not found' }, { status: 404 });
    }

    // Check if warehouse code already exists (if code is being updated)
    if (body.code && body.code !== warehouse.code) {
      const existingWarehouse = await db.collection<Warehouse>('warehouses').findOne({ 
        code: body.code,
        _id: { $ne: new ObjectId(params.id) }
      });
      if (existingWarehouse) {
        return NextResponse.json({ error: 'Warehouse code already exists' }, { status: 400 });
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

    const updateData = {
      ...body,
      branchId: body.branchId ? new ObjectId(body.branchId) : undefined,
      updatedBy: new ObjectId(body.updatedBy),
      updatedAt: new Date(),
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => 
      updateData[key as keyof typeof updateData] === undefined && 
      delete updateData[key as keyof typeof updateData]
    );

    const result = await db.collection<Warehouse>('warehouses').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Warehouse not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Warehouse updated successfully' });
  } catch (error) {
    console.error('Error updating warehouse:', error);
    return NextResponse.json({ error: 'Failed to update warehouse' }, { status: 500 });
  }
}

// DELETE - Delete warehouse
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectToMongoDB();
    
    const warehouse = await db.collection<Warehouse>('warehouses').findOne({ 
      _id: new ObjectId(params.id) 
    });
    if (!warehouse) {
      return NextResponse.json({ error: 'Warehouse not found' }, { status: 404 });
    }

    // Check if warehouse has inventory or zones
    const hasInventory = await db.collection('inventory').countDocuments({ 
      warehouseId: new ObjectId(params.id) 
    });
    
    const hasZones = await db.collection('warehouse_zones').countDocuments({ 
      warehouseId: new ObjectId(params.id) 
    });
    
    if (hasInventory > 0 || hasZones > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete warehouse with existing inventory or zones' 
      }, { status: 400 });
    }

    const result = await db.collection<Warehouse>('warehouses').deleteOne({ 
      _id: new ObjectId(params.id) 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Warehouse not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Warehouse deleted successfully' });
  } catch (error) {
    console.error('Error deleting warehouse:', error);
    return NextResponse.json({ error: 'Failed to delete warehouse' }, { status: 500 });
  }
}
