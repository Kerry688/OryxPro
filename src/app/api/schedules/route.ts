import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabaseMinimal } from '@/lib/mongodb-minimal';
import { 
  TechnicianSchedule, 
  CreateScheduleData, 
  ScheduleSearchOptions 
} from '@/lib/models/schedule';

// GET /api/schedules - List technician schedules
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabaseMinimal();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const technicianId = searchParams.get('technicianId');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const priority = searchParams.get('priority');
    const hasWorkOrder = searchParams.get('hasWorkOrder');
    const isRecurring = searchParams.get('isRecurring');

    // Build query
    const query: any = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { technicianName: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (technicianId) {
      query.technicianId = technicianId;
    }
    
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) {
        query.date.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        query.date.$lte = new Date(dateTo);
      }
    }
    
    if (status) {
      query.status = { $in: status.split(',') };
    }
    
    if (type) {
      query.type = { $in: type.split(',') };
    }
    
    if (priority) {
      query.priority = { $in: priority.split(',') };
    }
    
    if (hasWorkOrder === 'true') {
      query.workOrderId = { $exists: true, $ne: null };
    } else if (hasWorkOrder === 'false') {
      query.$or = [
        { workOrderId: { $exists: false } },
        { workOrderId: null }
      ];
    }
    
    if (isRecurring === 'true') {
      query.isRecurring = true;
    } else if (isRecurring === 'false') {
      query.isRecurring = false;
    }

    // Get total count
    const totalCount = await db.collection('technicianSchedules').countDocuments(query);
    
    // Get schedules
    const schedules = await db.collection('technicianSchedules')
      .find(query)
      .sort({ date: 1, startTime: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: schedules,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch schedules' },
      { status: 500 }
    );
  }
}

// POST /api/schedules - Create schedule entry
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabaseMinimal();
    const body: CreateScheduleData = await request.json();

    // Validate required fields
    if (!body.technicianId || !body.date || !body.startTime || !body.endTime || !body.title) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check for conflicts
    const conflicts = await checkScheduleConflicts(db, body);
    if (conflicts.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Schedule conflicts detected',
          conflicts 
        },
        { status: 409 }
      );
    }

    // Create schedule entry
    const schedule: TechnicianSchedule = {
      technicianId: body.technicianId,
      technicianName: body.technicianName || '',
      date: body.date,
      startTime: body.startTime,
      endTime: body.endTime,
      status: body.status,
      type: body.type,
      title: body.title,
      description: body.description,
      workOrderId: body.workOrderId,
      serviceRequestId: body.serviceRequestId,
      customerId: body.customerId,
      customerName: body.customerName,
      location: body.location,
      isRecurring: body.isRecurring,
      recurrenceType: body.recurrenceType,
      recurrencePattern: body.recurrencePattern,
      parentScheduleId: body.parentScheduleId,
      isAllDay: body.isAllDay,
      priority: body.priority,
      estimatedDuration: body.estimatedDuration,
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: body.createdBy,
      updatedBy: body.createdBy,
    };

    // Insert schedule
    const result = await db.collection('technicianSchedules').insertOne(schedule);

    // If recurring, create additional instances
    if (body.isRecurring && body.recurrenceType !== 'none') {
      await createRecurringSchedules(db, { ...schedule, _id: result.insertedId }, body);
    }

    return NextResponse.json({
      success: true,
      data: { ...schedule, _id: result.insertedId },
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create schedule:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create schedule' },
      { status: 500 }
    );
  }
}

// Helper function to check for schedule conflicts
async function checkScheduleConflicts(db: any, scheduleData: CreateScheduleData): Promise<any[]> {
  const conflicts = [];
  
  // Check for overlapping schedules for the same technician
  const overlappingSchedules = await db.collection('technicianSchedules').find({
    technicianId: scheduleData.technicianId,
    date: scheduleData.date,
    $or: [
      {
        startTime: { $lt: scheduleData.endTime },
        endTime: { $gt: scheduleData.startTime }
      }
    ]
  }).toArray();

  for (const existing of overlappingSchedules) {
    conflicts.push({
      type: 'overlap',
      existingScheduleId: existing._id,
      message: `Conflicts with existing schedule: ${existing.title}`,
      severity: 'high'
    });
  }

  return conflicts;
}

// Helper function to create recurring schedules
async function createRecurringSchedules(db: any, parentSchedule: any, scheduleData: CreateScheduleData) {
  const { recurrenceType, recurrencePattern } = scheduleData;
  const startDate = new Date(scheduleData.date);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 3); // Create 3 months of recurring schedules

  const recurringSchedules = [];

  if (recurrenceType === 'daily') {
    const interval = recurrencePattern?.interval || 1;
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + interval)) {
      if (date.getTime() !== startDate.getTime()) {
        recurringSchedules.push({
          ...parentSchedule,
          _id: undefined,
          date: new Date(date),
          startTime: new Date(date.setHours(new Date(scheduleData.startTime).getHours(), new Date(scheduleData.startTime).getMinutes())),
          endTime: new Date(date.setHours(new Date(scheduleData.endTime).getHours(), new Date(scheduleData.endTime).getMinutes())),
          parentScheduleId: parentSchedule._id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
  } else if (recurrenceType === 'weekly') {
    const daysOfWeek = recurrencePattern?.daysOfWeek || [];
    const interval = recurrencePattern?.interval || 1;
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      if (daysOfWeek.includes(date.getDay()) && date.getTime() !== startDate.getTime()) {
        recurringSchedules.push({
          ...parentSchedule,
          _id: undefined,
          date: new Date(date),
          startTime: new Date(date.setHours(new Date(scheduleData.startTime).getHours(), new Date(scheduleData.startTime).getMinutes())),
          endTime: new Date(date.setHours(new Date(scheduleData.endTime).getHours(), new Date(scheduleData.endTime).getMinutes())),
          parentScheduleId: parentSchedule._id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
  }

  if (recurringSchedules.length > 0) {
    await db.collection('technicianSchedules').insertMany(recurringSchedules);
  }
}
