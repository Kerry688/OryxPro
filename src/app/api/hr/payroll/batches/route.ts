import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { PayrollBatch, CreatePayrollBatchDTO, ProcessPayrollDTO } from '@/lib/models/payroll';
import { ObjectId } from 'mongodb';

// GET /api/hr/payroll/batches - Get all payroll batches
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || '';
    const year = searchParams.get('year') || '';
    const month = searchParams.get('month') || '';

    const { db } = await connectToDatabase();
    const batchesCollection = db.collection('payrollBatches');

    // Build filter
    const filter: any = { 'systemInfo.isActive': true };
    
    if (status) filter.status = status;
    if (year) filter['payPeriod.year'] = parseInt(year);
    if (month) filter['payPeriod.month'] = parseInt(month);

    // Get total count
    const total = await batchesCollection.countDocuments(filter);
    
    // Get batches with pagination
    const batches = await batchesCollection
      .find(filter)
      .sort({ 'payPeriod.year': -1, 'payPeriod.month': -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      data: batches,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching payroll batches:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payroll batches' },
      { status: 500 }
    );
  }
}

// POST /api/hr/payroll/batches - Create new payroll batch
export async function POST(request: NextRequest) {
  try {
    const batchData: CreatePayrollBatchDTO = await request.json();
    const { db } = await connectToDatabase();
    const batchesCollection = db.collection('payrollBatches');

    // Generate batch ID
    const count = await batchesCollection.countDocuments();
    const batchId = `BATCH${String(count + 1).padStart(3, '0')}`;

    const newBatch: PayrollBatch = {
      ...batchData,
      batchId,
      status: 'draft',
      totalEmployees: batchData.employeeIds.length,
      totalGrossSalary: 0,
      totalNetSalary: 0,
      totalTaxes: 0,
      totalEmployerCosts: 0,
      generatedPayslips: 0,
      failedPayslips: 0,
      systemInfo: {
        createdBy: 'system', // TODO: Get from auth context
        createdAt: new Date(),
        updatedBy: 'system',
        updatedAt: new Date(),
        isActive: true
      }
    };

    const result = await batchesCollection.insertOne(newBatch);

    return NextResponse.json({
      success: true,
      data: { ...newBatch, _id: result.insertedId },
      message: 'Payroll batch created successfully'
    });
  } catch (error) {
    console.error('Error creating payroll batch:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create payroll batch' },
      { status: 500 }
    );
  }
}

// PUT /api/hr/payroll/batches - Process payroll batch
export async function PUT(request: NextRequest) {
  try {
    const processData: ProcessPayrollDTO = await request.json();
    const { db } = await connectToDatabase();
    const batchesCollection = db.collection('payrollBatches');

    // Find the batch
    const batch = await batchesCollection.findOne({
      batchId: processData.batchId,
      'systemInfo.isActive': true
    });

    if (!batch) {
      return NextResponse.json(
        { success: false, error: 'Payroll batch not found' },
        { status: 404 }
      );
    }

    // Update batch status to processing
    const updatedBatch = await batchesCollection.findOneAndUpdate(
      { batchId: processData.batchId },
      {
        $set: {
          status: 'processing',
          processingStartedAt: new Date(),
          'systemInfo.updatedAt': new Date()
        }
      },
      { returnDocument: 'after' }
    );

    // TODO: Implement actual payroll processing logic
    // This would include:
    // 1. Calculate salaries for each employee
    // 2. Apply tax calculations
    // 3. Generate payslips if requested
    // 4. Create bank transfer files if requested
    // 5. Update batch totals

    // Simulate processing completion
    setTimeout(async () => {
      await batchesCollection.findOneAndUpdate(
        { batchId: processData.batchId },
        {
          $set: {
            status: 'completed',
            processingCompletedAt: new Date(),
            generatedPayslips: batch.totalEmployees,
            totalGrossSalary: 500000, // Example totals
            totalNetSalary: 400000,
            totalTaxes: 75000,
            totalEmployerCosts: 25000,
            'systemInfo.updatedAt': new Date()
          }
        }
      );
    }, 5000); // Simulate 5-second processing

    return NextResponse.json({
      success: true,
      data: updatedBatch,
      message: 'Payroll batch processing started'
    });
  } catch (error) {
    console.error('Error processing payroll batch:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process payroll batch' },
      { status: 500 }
    );
  }
}
