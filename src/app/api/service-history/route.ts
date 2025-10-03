import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabaseMinimal } from '@/lib/mongodb-minimal';
import { 
  ServiceHistoryEntry, 
  CreateServiceHistoryData, 
  ServiceHistorySearchOptions 
} from '@/lib/models/service-history';

// GET /api/service-history - List service history entries
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabaseMinimal();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const productId = searchParams.get('productId');
    const serviceType = searchParams.get('serviceType');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const technicianId = searchParams.get('technicianId');
    const customerId = searchParams.get('customerId');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const warrantyCovered = searchParams.get('warrantyCovered');
    const followUpRequired = searchParams.get('followUpRequired');
    const hasAttachments = searchParams.get('hasAttachments');

    // Build query
    const query: any = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { productName: { $regex: search, $options: 'i' } },
        { technicianName: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (productId) {
      query.productId = productId;
    }
    
    if (serviceType) {
      query.serviceType = { $in: serviceType.split(',') };
    }
    
    if (status) {
      query.status = { $in: status.split(',') };
    }
    
    if (priority) {
      query.priority = { $in: priority.split(',') };
    }
    
    if (technicianId) {
      query.technicianId = technicianId;
    }
    
    if (customerId) {
      query.customerId = customerId;
    }
    
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) {
        query.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        query.createdAt.$lte = new Date(dateTo);
      }
    }
    
    if (warrantyCovered === 'true') {
      query.warrantyCoverage = { $gt: 0 };
    } else if (warrantyCovered === 'false') {
      query.warrantyCoverage = 0;
    }
    
    if (followUpRequired === 'true') {
      query.followUpRequired = true;
    } else if (followUpRequired === 'false') {
      query.followUpRequired = false;
    }
    
    if (hasAttachments === 'true') {
      query.attachments = { $exists: true, $ne: [] };
    } else if (hasAttachments === 'false') {
      query.$or = [
        { attachments: { $exists: false } },
        { attachments: [] }
      ];
    }

    // Get total count
    const totalCount = await db.collection('serviceHistory').countDocuments(query);
    
    // Get service history entries
    const serviceHistory = await db.collection('serviceHistory')
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: serviceHistory,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching service history:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch service history' },
      { status: 500 }
    );
  }
}

// POST /api/service-history - Create service history entry
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabaseMinimal();
    const body: CreateServiceHistoryData = await request.json();

    // Validate required fields
    if (!body.productId || !body.serviceType || !body.title || !body.description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create service history entry
    const serviceHistory: ServiceHistoryEntry = {
      productId: body.productId,
      productName: body.productName,
      productSerialNumber: body.productSerialNumber,
      productModel: body.productModel,
      productCategory: body.productCategory,
      serviceType: body.serviceType,
      title: body.title,
      description: body.description,
      status: body.status,
      priority: body.priority,
      scheduledDate: body.scheduledDate,
      startDate: body.startDate,
      endDate: body.endDate,
      estimatedDuration: body.estimatedDuration,
      technicianId: body.technicianId,
      technicianName: body.technicianName,
      serviceProviderId: body.serviceProviderId,
      serviceProviderName: body.serviceProviderName,
      serviceLocation: body.serviceLocation,
      customerId: body.customerId,
      customerName: body.customerName,
      customerContact: body.customerContact,
      serviceRequestId: body.serviceRequestId,
      workOrderId: body.workOrderId,
      warrantyClaimId: body.warrantyClaimId,
      invoiceId: body.invoiceId,
      purchaseOrderId: body.purchaseOrderId,
      serviceItems: body.serviceItems || [],
      partsUsed: body.partsUsed || [],
      laborHours: body.laborHours || 0,
      totalCost: body.totalCost || 0,
      warrantyCoverage: body.warrantyCoverage || 0,
      customerCharge: body.customerCharge || 0,
      notes: body.notes,
      recommendations: body.recommendations,
      followUpRequired: body.followUpRequired || false,
      followUpDate: body.followUpDate,
      attachments: [],
      customerRating: body.customerRating,
      customerFeedback: body.customerFeedback,
      technicianNotes: body.technicianNotes,
      qualityCheckPassed: body.qualityCheckPassed,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: body.createdBy,
      updatedBy: body.createdBy,
      version: 1,
    };

    // Insert service history entry
    const result = await db.collection('serviceHistory').insertOne(serviceHistory);

    return NextResponse.json({
      success: true,
      data: { ...serviceHistory, _id: result.insertedId },
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create service history:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create service history' },
      { status: 500 }
    );
  }
}
