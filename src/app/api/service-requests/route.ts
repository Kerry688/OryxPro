import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabaseMinimal } from '@/lib/mongodb-minimal';
import { 
  ServiceRequest, 
  CreateServiceRequestData, 
  ServiceRequestSearchOptions 
} from '@/lib/models/service-request';

// GET /api/service-requests - List service requests
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabaseMinimal();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const requestType = searchParams.get('requestType');
    const assignedTo = searchParams.get('assignedTo');
    const customerId = searchParams.get('customerId');
    const productId = searchParams.get('productId');
    const warrantyStatus = searchParams.get('warrantyStatus');
    const billingStatus = searchParams.get('billingStatus');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    // Build query
    const query: any = {};
    
    if (search) {
      query.$or = [
        { requestNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { productName: { $regex: search, $options: 'i' } },
        { issueDescription: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (status) {
      query.status = { $in: status.split(',') };
    }
    
    if (priority) {
      query.priority = { $in: priority.split(',') };
    }
    
    if (requestType) {
      query.requestType = { $in: requestType.split(',') };
    }
    
    if (assignedTo) {
      query.assignedTo = { $in: assignedTo.split(',') };
    }
    
    if (customerId) {
      query.customerId = customerId;
    }
    
    if (productId) {
      query.productId = productId;
    }
    
    if (warrantyStatus) {
      query.warrantyStatus = { $in: warrantyStatus.split(',') };
    }
    
    if (billingStatus) {
      query.billingStatus = { $in: billingStatus.split(',') };
    }
    
    if (dateFrom || dateTo) {
      query.reportedDate = {};
      if (dateFrom) {
        query.reportedDate.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        query.reportedDate.$lte = new Date(dateTo);
      }
    }

    // Get total count
    const totalCount = await db.collection('serviceRequests').countDocuments(query);
    
    // Get service requests
    const serviceRequests = await db.collection('serviceRequests')
      .find(query)
      .sort({ reportedDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: serviceRequests,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching service requests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch service requests' },
      { status: 500 }
    );
  }
}

// POST /api/service-requests - Create service request
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabaseMinimal();
    const body: CreateServiceRequestData = await request.json();

    // Validate required fields
    if (!body.customerId || !body.customerName || !body.productId || !body.issueDescription) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate request number
    const requestNumber = `SR${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Create service request
    const serviceRequest: ServiceRequest = {
      requestNumber,
      customerId: body.customerId,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      productId: body.productId,
      productName: body.productName,
      productSku: body.productSku,
      serialNumber: body.serialNumber,
      warrantyCardId: body.warrantyCardId,
      warrantyStatus: 'unknown',
      requestType: body.requestType,
      priority: body.priority,
      status: 'pending',
      issueDescription: body.issueDescription,
      reportedDate: new Date(),
      reportedBy: body.reportedBy,
      assignedTo: body.assignedTo,
      assignedDate: body.assignedTo ? new Date() : undefined,
      expectedCompletionDate: body.expectedCompletionDate,
      workOrders: [],
      billingStatus: 'pending_assessment',
      attachments: body.attachments || [],
      notes: body.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: body.createdBy,
      updatedBy: body.createdBy,
    };

    // Insert service request
    const result = await db.collection('serviceRequests').insertOne(serviceRequest);

    return NextResponse.json({
      success: true,
      data: { ...serviceRequest, _id: result.insertedId },
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create service request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create service request' },
      { status: 500 }
    );
  }
}
