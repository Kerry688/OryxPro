import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Holiday, CreateHolidayDTO, HolidayFilters } from '@/lib/models/leave';

export async function GET(request: NextRequest) {
  try {
    const db = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    
    // Build filter object
    const filters: HolidayFilters = {};
    
    if (searchParams.get('country')) {
      filters.country = searchParams.get('country')!;
    }
    
    if (searchParams.get('region')) {
      filters.region = searchParams.get('region')!;
    }
    
    if (searchParams.get('type')) {
      filters.type = searchParams.get('type') as Holiday['type'];
    }
    
    if (searchParams.get('year')) {
      filters.year = parseInt(searchParams.get('year')!);
    }
    
    if (searchParams.get('isPublicHoliday') !== null) {
      filters.isPublicHoliday = searchParams.get('isPublicHoliday') === 'true';
    }
    
    // Build MongoDB query
    let query: any = {};
    
    if (filters.country) {
      query.country = filters.country;
    }
    
    if (filters.region) {
      query.region = filters.region;
    }
    
    if (filters.type) {
      query.type = filters.type;
    }
    
    if (filters.year) {
      query.date = {
        $gte: new Date(filters.year, 0, 1),
        $lt: new Date(filters.year + 1, 0, 1)
      };
    }
    
    if (filters.isPublicHoliday !== undefined) {
      query.isPublicHoliday = filters.isPublicHoliday;
    }
    
    // Default to active holidays only
    query.isActive = true;
    
    const holidays = await db.collection('holidays').find(query).sort({ date: 1 }).toArray();
    
    return NextResponse.json({
      success: true,
      data: holidays,
      count: holidays.length
    });
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch holidays' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await connectToDatabase();
    const body: CreateHolidayDTO = await request.json();
    
    // Validate required fields
    if (!body.name || !body.date || !body.type || !body.country) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if holiday already exists for the same date and country
    const existingHoliday = await db.collection('holidays').findOne({
      name: body.name,
      date: new Date(body.date),
      country: body.country
    });
    
    if (existingHoliday) {
      return NextResponse.json(
        { success: false, error: 'Holiday already exists for this date and country' },
        { status: 400 }
      );
    }
    
    const holiday: Holiday = {
      holidayId: `HOL${Date.now()}`,
      name: body.name,
      description: body.description,
      date: new Date(body.date),
      type: body.type,
      country: body.country,
      region: body.region,
      isRecurring: body.isRecurring || false,
      recurringPattern: body.recurringPattern,
      isActive: true,
      isPublicHoliday: body.isPublicHoliday || false,
      workDayCompensation: body.workDayCompensation || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('holidays').insertOne(holiday);
    
    return NextResponse.json({
      success: true,
      data: holiday,
      message: 'Holiday created successfully'
    });
  } catch (error) {
    console.error('Error creating holiday:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create holiday' },
      { status: 500 }
    );
  }
}
