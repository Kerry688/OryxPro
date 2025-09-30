import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb-client';
import { Company, CreateCompanyData, UpdateCompanyData } from '@/lib/models/company';
import { ObjectId } from 'mongodb';

// GET - Fetch company details
export async function GET() {
  try {
    const db = await connectToMongoDB();
    const company = await db.collection<Company>('companies').findOne({ isActive: true });
    
    if (!company) {
      return NextResponse.json({ message: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 });
  }
}

// POST - Create new company
export async function POST(request: NextRequest) {
  try {
    const body: CreateCompanyData = await request.json();
    const db = await connectToMongoDB();
    
    // Check if company already exists
    const existingCompany = await db.collection<Company>('companies').findOne({ isActive: true });
    if (existingCompany) {
      return NextResponse.json({ error: 'Company already exists' }, { status: 400 });
    }

    const companyData: Company = {
      ...body,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<Company>('companies').insertOne(companyData);
    
    return NextResponse.json({ 
      message: 'Company created successfully', 
      id: result.insertedId 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
  }
}

// PUT - Update company
export async function PUT(request: NextRequest) {
  try {
    const body: UpdateCompanyData = await request.json();
    const db = await connectToMongoDB();
    
    const company = await db.collection<Company>('companies').findOne({ isActive: true });
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const updateData = {
      ...body,
      updatedAt: new Date(),
    };

    const result = await db.collection<Company>('companies').updateOne(
      { _id: company._id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Company updated successfully' });
  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json({ error: 'Failed to update company' }, { status: 500 });
  }
}
