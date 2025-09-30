import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Certification, CreateCertificationDTO, CertificationFilter } from '@/lib/models/training';
import { ObjectId } from 'mongodb';

// GET /api/hr/training/certifications - Get all certifications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const level = searchParams.get('level') || '';
    const issuingAuthority = searchParams.get('issuingAuthority') || '';
    const status = searchParams.get('status') || '';

    const { db } = await connectToDatabase();
    const certificationsCollection = db.collection('certifications');

    // Build filter
    const filter: any = { 'systemInfo.isActive': true };
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { issuingAuthority: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (issuingAuthority) filter.issuingAuthority = { $regex: issuingAuthority, $options: 'i' };
    if (status) filter.status = status;

    // Get total count
    const total = await certificationsCollection.countDocuments(filter);
    
    // Get certifications with pagination
    const certifications = await certificationsCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      data: certifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching certifications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch certifications' },
      { status: 500 }
    );
  }
}

// POST /api/hr/training/certifications - Create new certification
export async function POST(request: NextRequest) {
  try {
    const certificationData: CreateCertificationDTO = await request.json();
    const { db } = await connectToDatabase();
    const certificationsCollection = db.collection('certifications');

    // Generate certification ID
    const count = await certificationsCollection.countDocuments();
    const certificationId = `CERT${String(count + 1).padStart(3, '0')}`;

    const newCertification: Certification = {
      ...certificationData,
      certificationId,
      status: 'active',
      systemInfo: {
        createdBy: 'system', // TODO: Get from auth context
        createdAt: new Date(),
        updatedBy: 'system',
        updatedAt: new Date(),
        isActive: true
      }
    };

    const result = await certificationsCollection.insertOne(newCertification);

    return NextResponse.json({
      success: true,
      data: { ...newCertification, _id: result.insertedId },
      message: 'Certification created successfully'
    });
  } catch (error) {
    console.error('Error creating certification:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create certification' },
      { status: 500 }
    );
  }
}
