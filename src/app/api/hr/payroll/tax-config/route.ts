import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { TaxConfiguration, CreateTaxConfigurationDTO } from '@/lib/models/payroll';

// GET /api/hr/payroll/tax-config - Get tax configurations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const country = searchParams.get('country') || '';
    const taxYear = searchParams.get('taxYear') || '';
    const status = searchParams.get('status') || '';

    const { db } = await connectToDatabase();
    const taxConfigCollection = db.collection('taxConfigurations');

    // Build filter
    const filter: any = { 'systemInfo.isActive': true };
    
    if (country) filter.country = country;
    if (taxYear) filter.taxYear = parseInt(taxYear);
    if (status) filter.status = status;

    // Get total count
    const total = await taxConfigCollection.countDocuments(filter);
    
    // Get configurations with pagination
    const configurations = await taxConfigCollection
      .find(filter)
      .sort({ taxYear: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      data: configurations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching tax configurations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tax configurations' },
      { status: 500 }
    );
  }
}

// POST /api/hr/payroll/tax-config - Create new tax configuration
export async function POST(request: NextRequest) {
  try {
    const configData: CreateTaxConfigurationDTO = await request.json();
    const { db } = await connectToDatabase();
    const taxConfigCollection = db.collection('taxConfigurations');

    // Generate config ID
    const count = await taxConfigCollection.countDocuments();
    const configId = `TAX${String(count + 1).padStart(3, '0')}`;

    const newConfiguration: TaxConfiguration = {
      ...configData,
      configId,
      status: 'active',
      systemInfo: {
        createdBy: 'system', // TODO: Get from auth context
        createdAt: new Date(),
        updatedBy: 'system',
        updatedAt: new Date(),
        isActive: true
      }
    };

    const result = await taxConfigCollection.insertOne(newConfiguration);

    return NextResponse.json({
      success: true,
      data: { ...newConfiguration, _id: result.insertedId },
      message: 'Tax configuration created successfully'
    });
  } catch (error) {
    console.error('Error creating tax configuration:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create tax configuration' },
      { status: 500 }
    );
  }
}
