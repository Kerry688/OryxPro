import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { TrainingSchedule, CreateTrainingScheduleDTO } from '@/lib/models/training';
import { ObjectId } from 'mongodb';

// GET /api/hr/training/schedules - Get all training schedules
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const programId = searchParams.get('programId') || '';
    const status = searchParams.get('status') || '';
    const instructor = searchParams.get('instructor') || '';

    const { db } = await connectToDatabase();
    const schedulesCollection = db.collection('trainingSchedules');

    // Build filter
    const filter: any = { 'systemInfo.isActive': true };
    
    if (search) {
      filter.$or = [
        { programTitle: { $regex: search, $options: 'i' } },
        { 'instructor.name': { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (programId) filter.programId = programId;
    if (status) filter.status = status;
    if (instructor) filter['instructor.name'] = { $regex: instructor, $options: 'i' };

    // Get total count
    const total = await schedulesCollection.countDocuments(filter);
    
    // Get schedules with pagination
    const schedules = await schedulesCollection
      .find(filter)
      .sort({ 'schedule.startDate': 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      data: schedules,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching training schedules:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch training schedules' },
      { status: 500 }
    );
  }
}

// POST /api/hr/training/schedules - Create new training schedule
export async function POST(request: NextRequest) {
  try {
    const scheduleData: CreateTrainingScheduleDTO = await request.json();
    const { db } = await connectToDatabase();
    const schedulesCollection = db.collection('trainingSchedules');

    // Get program title
    const programsCollection = db.collection('trainingPrograms');
    const program = await programsCollection.findOne({ 
      programId: scheduleData.programId,
      'systemInfo.isActive': true 
    });

    if (!program) {
      return NextResponse.json(
        { success: false, error: 'Training program not found' },
        { status: 404 }
      );
    }

    // Generate schedule ID
    const count = await schedulesCollection.countDocuments();
    const scheduleId = `SCH${String(count + 1).padStart(3, '0')}`;

    const newSchedule: TrainingSchedule = {
      ...scheduleData,
      scheduleId,
      programTitle: program.title,
      currentEnrollments: 0,
      enrolledEmployees: [],
      status: 'scheduled',
      systemInfo: {
        createdBy: 'system', // TODO: Get from auth context
        createdAt: new Date(),
        updatedBy: 'system',
        updatedAt: new Date(),
        isActive: true
      }
    };

    const result = await schedulesCollection.insertOne(newSchedule);

    return NextResponse.json({
      success: true,
      data: { ...newSchedule, _id: result.insertedId },
      message: 'Training schedule created successfully'
    });
  } catch (error) {
    console.error('Error creating training schedule:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create training schedule' },
      { status: 500 }
    );
  }
}
