import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabaseMinimal } from '@/lib/mongodb-minimal';
import { BillingAssessment } from '@/lib/models/service-request';

// POST /api/service-requests/billing-assessments - Create billing assessment
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabaseMinimal();
    const body: BillingAssessment = await request.json();

    // Validate required fields
    if (!body.serviceRequestId || !body.workOrderId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert billing assessment
    const result = await db.collection('billingAssessments').insertOne(body);

    return NextResponse.json({
      success: true,
      data: { ...body, _id: result.insertedId },
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create billing assessment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create billing assessment' },
      { status: 500 }
    );
  }
}

// GET /api/service-requests/billing-assessments - List billing assessments
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabaseMinimal();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const serviceRequestId = searchParams.get('serviceRequestId');
    const workOrderId = searchParams.get('workOrderId');
    const billingStatus = searchParams.get('billingStatus');
    const paymentStatus = searchParams.get('paymentStatus');

    // Build query
    const query: any = {};
    
    if (serviceRequestId) {
      query.serviceRequestId = serviceRequestId;
    }
    
    if (workOrderId) {
      query.workOrderId = workOrderId;
    }
    
    if (billingStatus) {
      query.billingStatus = { $in: billingStatus.split(',') };
    }
    
    if (paymentStatus) {
      query.paymentStatus = { $in: paymentStatus.split(',') };
    }

    // Get total count
    const totalCount = await db.collection('billingAssessments').countDocuments(query);
    
    // Get billing assessments
    const assessments = await db.collection('billingAssessments')
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
    console.error('Error fetching billing assessments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch billing assessments' },
      { status: 500 }
    );
  }
}
