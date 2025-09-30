import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { TrainingProgram, CreateTrainingProgramDTO, TrainingProgramFilter } from '@/lib/models/training';
import { ObjectId } from 'mongodb';

// GET /api/hr/training/programs - Get all training programs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const level = searchParams.get('level') || '';
    const deliveryMethod = searchParams.get('deliveryMethod') || '';
    const status = searchParams.get('status') || '';

    const { db } = await connectToDatabase();
    const programsCollection = db.collection('trainingPrograms');

    // Build filter
    const filter: any = { 'systemInfo.isActive': true };
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (deliveryMethod) filter.deliveryMethod = deliveryMethod;
    if (status) filter.status = status;

    // Get total count
    const total = await programsCollection.countDocuments(filter);
    
    // Get programs with pagination
    const programs = await programsCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      data: programs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching training programs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch training programs' },
      { status: 500 }
    );
  }
}

// POST /api/hr/training/programs - Create new training program
export async function POST(request: NextRequest) {
  try {
    const programData: CreateTrainingProgramDTO = await request.json();
    const { db } = await connectToDatabase();
    const programsCollection = db.collection('trainingPrograms');

    // Generate program ID
    const count = await programsCollection.countDocuments();
    const programId = `TRN${String(count + 1).padStart(3, '0')}`;

    const newProgram: TrainingProgram = {
      ...programData,
      programId,
      status: 'active',
      systemInfo: {
        createdBy: 'system', // TODO: Get from auth context
        createdAt: new Date(),
        updatedBy: 'system',
        updatedAt: new Date(),
        isActive: true
      }
    };

    const result = await programsCollection.insertOne(newProgram);

    return NextResponse.json({
      success: true,
      data: { ...newProgram, _id: result.insertedId },
      message: 'Training program created successfully'
    });
  } catch (error) {
    console.error('Error creating training program:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create training program' },
      { status: 500 }
    );
  }
}
