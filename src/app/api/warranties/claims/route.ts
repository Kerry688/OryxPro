import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabaseMinimal } from '@/lib/mongodb-minimal';
import { 
  WarrantyClaim, 
  CreateWarrantyClaimData, 
  ClaimSearchOptions,
  ClaimFilters 
} from '@/lib/models/warranty';

// GET /api/warranties/claims - Get all warranty claims with search and filtering
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabaseMinimal();
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const query = searchParams.get('query') || '';
    const status = searchParams.get('status')?.split(',') || [];
    const claimType = searchParams.get('claimType')?.split(',') || [];
    const priority = searchParams.get('priority')?.split(',') || [];
    const severity = searchParams.get('severity')?.split(',') || [];
    const warrantyCardId = searchParams.get('warrantyCardId');
    const sortBy = searchParams.get('sortBy') || 'reportedDate';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build filter object
    const filters: any = {};
    
    if (status.length > 0) {
      filters.status = { $in: status };
    }
    
    if (claimType.length > 0) {
      filters.claimType = { $in: claimType };
    }
    
    if (priority.length > 0) {
      filters.priority = { $in: priority };
    }
    
    if (severity.length > 0) {
      filters.severity = { $in: severity };
    }
    
    if (warrantyCardId) {
      filters.warrantyCardId = new ObjectId(warrantyCardId);
    }

    // Build search query
    let searchQuery = {};
    if (query) {
      searchQuery = {
        $or: [
          { claimNumber: { $regex: query, $options: 'i' } },
          { issueDescription: { $regex: query, $options: 'i' } },
          { 'resolution.description': { $regex: query, $options: 'i' } }
        ]
      };
    }

    // Combine filters
    const finalFilters = { ...filters, ...searchQuery };

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const claims = await db.collection('warranty_claims')
      .find(finalFilters)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count for pagination
    const totalCount = await db.collection('warranty_claims').countDocuments(finalFilters);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: claims,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit
      }
    });

  } catch (error) {
    console.error('Error fetching warranty claims:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch warranty claims' },
      { status: 500 }
    );
  }
}

// POST /api/warranties/claims - Create a new warranty claim
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabaseMinimal();
    const body: CreateWarrantyClaimData = await request.json();

    // Validate required fields
    if (!body.warrantyCardId || !body.customerId || !body.issueDescription) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if warranty exists and is active
    const warranty = await db.collection('warranties').findOne({ 
      _id: body.warrantyCardId 
    });

    if (!warranty) {
      return NextResponse.json(
        { success: false, error: 'Warranty not found' },
        { status: 404 }
      );
    }

    if (warranty.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Warranty is not active' },
        { status: 400 }
      );
    }

    // Check if warranty is expired
    if (new Date() > warranty.endDate) {
      return NextResponse.json(
        { success: false, error: 'Warranty has expired' },
        { status: 400 }
      );
    }

    // Generate claim number
    const claimNumber = `WC${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Create warranty claim
    const warrantyClaim: WarrantyClaim = {
      claimNumber,
      warrantyCardId: body.warrantyCardId,
      customerId: body.customerId,
      status: 'pending',
      issueDescription: body.issueDescription,
      reportedDate: new Date(),
      claimType: body.claimType,
      priority: body.priority,
      severity: body.severity,
      evidence: body.evidence,
      communications: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: body.createdBy,
      updatedBy: body.createdBy
    };

    // Insert warranty claim
    const result = await db.collection('warranty_claims').insertOne(warrantyClaim);

    // Update warranty card with new claim
    await db.collection('warranties').updateOne(
      { _id: body.warrantyCardId },
      { 
        $inc: { totalClaims: 1 },
        $set: { 
          lastClaimDate: new Date(),
          updatedAt: new Date(),
          updatedBy: body.createdBy
        }
      }
    );

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...warrantyClaim },
      message: 'Warranty claim created successfully'
    });

  } catch (error) {
    console.error('Error creating warranty claim:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create warranty claim' },
      { status: 500 }
    );
  }
}
