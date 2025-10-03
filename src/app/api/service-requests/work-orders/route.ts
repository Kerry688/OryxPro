import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabaseMinimal } from '@/lib/mongodb-minimal';
import { WorkOrder, CreateWorkOrderData } from '@/lib/models/service-request';

// GET /api/service-requests/work-orders - List work orders
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabaseMinimal();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const assignedTo = searchParams.get('assignedTo');
    const serviceRequestId = searchParams.get('serviceRequestId');
    const customerId = searchParams.get('customerId');
    const productId = searchParams.get('productId');
    const billingStatus = searchParams.get('billingStatus');

    // Build query
    const query: any = {};
    
    if (search) {
      query.$or = [
        { workOrderNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { productName: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (status) {
      query.status = { $in: status.split(',') };
    }
    
    if (assignedTo) {
      query.assignedTo = { $in: assignedTo.split(',') };
    }
    
    if (serviceRequestId) {
      query.serviceRequestId = serviceRequestId;
    }
    
    if (customerId) {
      query.customerId = customerId;
    }
    
    if (productId) {
      query.productId = productId;
    }
    
    if (billingStatus) {
      query.billingStatus = { $in: billingStatus.split(',') };
    }

    // Get total count
    const totalCount = await db.collection('workOrders').countDocuments(query);
    
    // Get work orders
    const workOrders = await db.collection('workOrders')
      .find(query)
      .sort({ assignedDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: workOrders,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching work orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch work orders' },
      { status: 500 }
    );
  }
}

// POST /api/service-requests/work-orders - Create work order
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabaseMinimal();
    const body: CreateWorkOrderData = await request.json();

    // Validate required fields
    if (!body.serviceRequestId || !body.assignedTo) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get service request details
    const { ObjectId } = await import('mongodb');
    const serviceRequest = await db.collection('serviceRequests').findOne({ 
      _id: new ObjectId(body.serviceRequestId) 
    });

    if (!serviceRequest) {
      return NextResponse.json(
        { success: false, error: 'Service request not found' },
        { status: 404 }
      );
    }

    // Generate work order number
    const workOrderNumber = `WO${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Create work order
    const workOrder: WorkOrder = {
      workOrderNumber,
      serviceRequestId: body.serviceRequestId,
      customerId: serviceRequest.customerId,
      customerName: serviceRequest.customerName,
      productId: serviceRequest.productId,
      productName: serviceRequest.productName,
      serialNumber: serviceRequest.serialNumber,
      warrantyCardId: serviceRequest.warrantyCardId,
      status: 'draft',
      assignedTo: body.assignedTo,
      assignedDate: new Date(),
      estimatedDuration: body.estimatedDuration,
      laborEntries: [],
      partsUsed: [],
      services: [],
      billingStatus: 'pending_assessment',
      totalCost: 0,
      warrantyCoveredCost: 0,
      billableCost: 0,
      attachments: [],
      notes: body.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: body.createdBy,
      updatedBy: body.createdBy,
    };

    // Insert work order
    const result = await db.collection('workOrders').insertOne(workOrder);

    // Update service request with work order ID
    await db.collection('serviceRequests').updateOne(
      { _id: new ObjectId(body.serviceRequestId) },
      { 
        $push: { workOrders: result.insertedId.toString() },
        $set: { 
          status: 'assigned',
          assignedTo: body.assignedTo,
          assignedDate: new Date(),
          updatedAt: new Date(),
        }
      }
    );

    return NextResponse.json({
      success: true,
      data: { ...workOrder, _id: result.insertedId },
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create work order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create work order' },
      { status: 500 }
    );
  }
}
