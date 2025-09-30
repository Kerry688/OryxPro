import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { SalaryStructure, CreateSalaryStructureDTO, SalaryStructureFilter } from '@/lib/models/payroll';
import { ObjectId } from 'mongodb';

// GET /api/hr/payroll/structures - Get all salary structures
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const grade = searchParams.get('grade') || '';
    const level = searchParams.get('level') || '';
    const status = searchParams.get('status') || '';

    const { db } = await connectToDatabase();
    const structuresCollection = db.collection('salaryStructures');

    // Build filter
    const filter: any = { 'systemInfo.isActive': true };
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { grade: { $regex: search, $options: 'i' } },
        { level: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (grade) filter.grade = grade;
    if (level) filter.level = level;
    if (status) filter.status = status;

    // Get total count
    const total = await structuresCollection.countDocuments(filter);
    
    // Get structures with pagination
    const structures = await structuresCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      data: structures,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching salary structures:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch salary structures' },
      { status: 500 }
    );
  }
}

// POST /api/hr/payroll/structures - Create new salary structure
export async function POST(request: NextRequest) {
  try {
    const structureData: CreateSalaryStructureDTO = await request.json();
    const { db } = await connectToDatabase();
    const structuresCollection = db.collection('salaryStructures');

    // Generate structure ID
    const count = await structuresCollection.countDocuments();
    const structureId = `SAL${String(count + 1).padStart(3, '0')}`;

    const newStructure: SalaryStructure = {
      ...structureData,
      structureId,
      status: 'active',
      systemInfo: {
        createdBy: 'system', // TODO: Get from auth context
        createdAt: new Date(),
        updatedBy: 'system',
        updatedAt: new Date(),
        isActive: true
      }
    };

    const result = await structuresCollection.insertOne(newStructure);

    return NextResponse.json({
      success: true,
      data: { ...newStructure, _id: result.insertedId },
      message: 'Salary structure created successfully'
    });
  } catch (error) {
    console.error('Error creating salary structure:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create salary structure' },
      { status: 500 }
    );
  }
}
