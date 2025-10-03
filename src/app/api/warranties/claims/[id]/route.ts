import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabaseMinimal } from '@/lib/mongodb-minimal';
import { 
  WarrantyClaim, 
  UpdateWarrantyClaimData 
} from '@/lib/models/warranty';

// GET /api/warranties/claims/[id] - Get warranty claim by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabaseMinimal();
    const claimId = params.id;

    if (!ObjectId.isValid(claimId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid claim ID' },
        { status: 400 }
      );
    }

    const claim = await db.collection('warranty_claims').findOne({ 
      _id: new ObjectId(claimId) 
    });

    if (!claim) {
      return NextResponse.json(
        { success: false, error: 'Warranty claim not found' },
        { status: 404 }
      );
    }

    // Get related warranty card
    const warranty = await db.collection('warranties').findOne({ 
      _id: claim.warrantyCardId 
    });

    return NextResponse.json({
      success: true,
      data: {
        ...claim,
        warranty
      }
    });

  } catch (error) {
    console.error('Error fetching warranty claim:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch warranty claim' },
      { status: 500 }
    );
  }
}

// PUT /api/warranties/claims/[id] - Update warranty claim
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabaseMinimal();
    const claimId = params.id;
    const body: UpdateWarrantyClaimData = await request.json();

    if (!ObjectId.isValid(claimId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid claim ID' },
        { status: 400 }
      );
    }

    // Check if claim exists
    const existingClaim = await db.collection('warranty_claims').findOne({ 
      _id: new ObjectId(claimId) 
    });

    if (!existingClaim) {
      return NextResponse.json(
        { success: false, error: 'Warranty claim not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {
      ...body,
      updatedAt: new Date(),
      updatedBy: body.updatedBy
    };

    // If status is being updated to completed, set actual resolution date
    if (body.status === 'completed' && !existingClaim.actualResolutionDate) {
      updateData.actualResolutionDate = new Date();
    }

    // Update claim
    const result = await db.collection('warranty_claims').updateOne(
      { _id: new ObjectId(claimId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Warranty claim not found' },
        { status: 404 }
      );
    }

    // Get updated claim
    const updatedClaim = await db.collection('warranty_claims').findOne({ 
      _id: new ObjectId(claimId) 
    });

    return NextResponse.json({
      success: true,
      data: updatedClaim,
      message: 'Warranty claim updated successfully'
    });

  } catch (error) {
    console.error('Error updating warranty claim:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update warranty claim' },
      { status: 500 }
    );
  }
}

// DELETE /api/warranties/claims/[id] - Delete warranty claim
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabaseMinimal();
    const claimId = params.id;

    if (!ObjectId.isValid(claimId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid claim ID' },
        { status: 400 }
      );
    }

    // Check if claim exists
    const existingClaim = await db.collection('warranty_claims').findOne({ 
      _id: new ObjectId(claimId) 
    });

    if (!existingClaim) {
      return NextResponse.json(
        { success: false, error: 'Warranty claim not found' },
        { status: 404 }
      );
    }

    // Check if claim is in progress or completed
    if (['in_progress', 'completed'].includes(existingClaim.status)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot delete claim that is in progress or completed' 
        },
        { status: 400 }
      );
    }

    // Delete claim
    const result = await db.collection('warranty_claims').deleteOne({ 
      _id: new ObjectId(claimId) 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Warranty claim not found' },
        { status: 404 }
      );
    }

    // Update warranty card claim count
    await db.collection('warranties').updateOne(
      { _id: existingClaim.warrantyCardId },
      { 
        $inc: { totalClaims: -1 },
        $set: { 
          updatedAt: new Date(),
          updatedBy: existingClaim.updatedBy
        }
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Warranty claim deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting warranty claim:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete warranty claim' },
      { status: 500 }
    );
  }
}
