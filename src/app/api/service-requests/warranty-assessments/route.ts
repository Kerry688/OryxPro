import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabaseMinimal } from '@/lib/mongodb-minimal';
import { WarrantyAssessment } from '@/lib/models/service-request';

// POST /api/service-requests/warranty-assessments - Create warranty assessment
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabaseMinimal();
    const body: WarrantyAssessment = await request.json();

    // Validate required fields
    if (!body.serviceRequestId || !body.workOrderId || !body.warrantyCardId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert warranty assessment
    const result = await db.collection('warrantyAssessments').insertOne(body);

    return NextResponse.json({
      success: true,
      data: { ...body, _id: result.insertedId },
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create warranty assessment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create warranty assessment' },
      { status: 500 }
    );
  }
}

// GET /api/service-requests/warranty-assessments - List warranty assessments
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabaseMinimal();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const serviceRequestId = searchParams.get('serviceRequestId');
    const workOrderId = searchParams.get('workOrderId');
    const warrantyCardId = searchParams.get('warrantyCardId');
    const warrantyStatus = searchParams.get('warrantyStatus');

    // Build query
    const query: any = {};
    
    if (serviceRequestId) {
      query.serviceRequestId = serviceRequestId;
    }
    
    if (workOrderId) {
      query.workOrderId = workOrderId;
    }
    
    if (warrantyCardId) {
      query.warrantyCardId = warrantyCardId;
    }
    
    if (warrantyStatus) {
      query.warrantyStatus = { $in: warrantyStatus.split(',') };
    }

    // Get total count
    const totalCount = await db.collection('warrantyAssessments').countDocuments(query);
    
    // Get warranty assessments
    const assessments = await db.collection('warrantyAssessments')
      .find(query)
      .sort({ assessmentDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: assessments,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching warranty assessments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch warranty assessments' },
      { status: 500 }
    );
  }
}
