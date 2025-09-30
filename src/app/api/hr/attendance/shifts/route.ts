import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CreateShiftDTO } from '@/lib/models/attendance';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');
    const shiftType = searchParams.get('shiftType');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Build query
    let query: any = {};
    
    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }
    
    if (shiftType) {
      query.shiftType = shiftType;
    }
    
    const shifts = await db.collection('shifts')
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .toArray();
    
    // Get total count for pagination
    const totalCount = await db.collection('shifts').countDocuments(query);
    
    return NextResponse.json({
      success: true,
      data: shifts,
      count: shifts.length,
      totalCount,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    });
  } catch (error) {
    console.error('Error fetching shifts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch shifts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body: CreateShiftDTO = await request.json();
    
    const { 
      shiftName, 
      shiftType, 
      description, 
      startTime, 
      endTime, 
      applicableDays, 
      breakConfiguration, 
      overtimeRules 
    } = body;
    
    if (!shiftName || !shiftType || !startTime || !endTime || !applicableDays) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Calculate duration
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    let duration = (endTotalMinutes - startTotalMinutes) / 60;
    
    // Handle overnight shifts
    if (duration < 0) {
      duration += 24;
    }
    
    // Create shift
    const shift = {
      shiftId: `SHIFT${Date.now()}`,
      shiftName,
      shiftType,
      description,
      
      startTime,
      endTime,
      duration,
      
      breakConfiguration: breakConfiguration || {
        lunchBreak: {
          duration: 60, // 1 hour default
          startTime: '12:00',
          isPaid: false
        },
        shortBreaks: [
          {
            duration: 15, // 15 minutes
            startTime: '10:00',
            isPaid: true
          },
          {
            duration: 15, // 15 minutes
            startTime: '15:00',
            isPaid: true
          }
        ]
      },
      
      overtimeRules: overtimeRules || {
        dailyOvertimeThreshold: 8,
        overtimeRate: 1.5,
        maximumDailyHours: 12,
        weekendRate: 2.0,
        holidayRate: 2.5
      },
      
      applicableDays,
      assignedEmployees: [],
      
      isActive: true,
      
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'admin',
      updatedBy: 'admin'
    };
    
    await db.collection('shifts').insertOne(shift);
    
    return NextResponse.json({
      success: true,
      data: shift,
      message: 'Shift created successfully'
    });
  } catch (error) {
    console.error('Error creating shift:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create shift' },
      { status: 500 }
    );
  }
}
