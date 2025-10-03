import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabaseMinimal } from '@/lib/mongodb-minimal';
import { 
  WarrantyCard, 
  UpdateWarrantyCardData 
} from '@/lib/models/warranty';

// GET /api/warranties/[id] - Get warranty card by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabaseMinimal();
    const warrantyId = params.id;

    if (!ObjectId.isValid(warrantyId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid warranty ID' },
        { status: 400 }
      );
    }

    const warranty = await db.collection('warranties').findOne({ 
      _id: new ObjectId(warrantyId) 
    });

    if (!warranty) {
      return NextResponse.json(
        { success: false, error: 'Warranty not found' },
        { status: 404 }
      );
    }

    // Get related claims
    const claims = await db.collection('warranty_claims')
      .find({ warrantyCardId: new ObjectId(warrantyId) })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: {
        ...warranty,
        claims
      }
    });

  } catch (error) {
    console.error('Error fetching warranty:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch warranty' },
      { status: 500 }
    );
  }
}

// PUT /api/warranties/[id] - Update warranty card
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabaseMinimal();
    const warrantyId = params.id;
    const body: UpdateWarrantyCardData = await request.json();

    if (!ObjectId.isValid(warrantyId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid warranty ID' },
        { status: 400 }
      );
    }

    // Check if warranty exists
    const existingWarranty = await db.collection('warranties').findOne({ 
      _id: new ObjectId(warrantyId) 
    });

    if (!existingWarranty) {
      return NextResponse.json(
        { success: false, error: 'Warranty not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {
      ...body,
      updatedAt: new Date(),
      updatedBy: body.updatedBy
    };

    // Update warranty
    const result = await db.collection('warranties').updateOne(
      { _id: new ObjectId(warrantyId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Warranty not found' },
        { status: 404 }
      );
    }

    // Get updated warranty
    const updatedWarranty = await db.collection('warranties').findOne({ 
      _id: new ObjectId(warrantyId) 
    });

    return NextResponse.json({
      success: true,
      data: updatedWarranty,
      message: 'Warranty updated successfully'
    });

  } catch (error) {
    console.error('Error updating warranty:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update warranty' },
      { status: 500 }
    );
  }
}

// DELETE /api/warranties/[id] - Delete warranty card
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabaseMinimal();
    const warrantyId = params.id;

    if (!ObjectId.isValid(warrantyId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid warranty ID' },
        { status: 400 }
      );
    }

    // Check if warranty exists
    const existingWarranty = await db.collection('warranties').findOne({ 
      _id: new ObjectId(warrantyId) 
    });

    if (!existingWarranty) {
      return NextResponse.json(
        { success: false, error: 'Warranty not found' },
        { status: 404 }
      );
    }

    // Check if warranty has claims
    const claimsCount = await db.collection('warranty_claims').countDocuments({
      warrantyCardId: new ObjectId(warrantyId)
    });

    if (claimsCount > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot delete warranty with existing claims. Please resolve all claims first.' 
        },
        { status: 400 }
      );
    }

    // Delete warranty
    const result = await db.collection('warranties').deleteOne({ 
      _id: new ObjectId(warrantyId) 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Warranty not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Warranty deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting warranty:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete warranty' },
      { status: 500 }
    );
  }
}
