import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb-client';
import { Customer, CreateCustomerData } from '@/lib/models/customer';
import { ObjectId } from 'mongodb';

// GET /api/customers - Get all customers with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const db = await connectToMongoDB();
    const customersCollection = db.collection<Customer>('customers');

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const customerType = searchParams.get('customerType') || '';
    const branchId = searchParams.get('branchId') || '';

    // Build filter object
    const filter: any = {};

    if (search) {
      filter.$or = [
        { customerCode: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (customerType) {
      filter.customerType = customerType;
    }

    if (branchId) {
      filter.branchId = branchId;
    }

    const skip = (page - 1) * limit;

    // Get total count
    const totalCount = await customersCollection.countDocuments(filter);

    // Get customers with pagination
    const customers = await customersCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      data: customers,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

// POST /api/customers - Create a new customer
export async function POST(request: NextRequest) {
  try {
    const db = await connectToMongoDB();
    const customersCollection = db.collection<Customer>('customers');

    const customerData: CreateCustomerData = await request.json();
    console.log('Received customer data:', customerData);

    // Check if customer code or email already exists
    const existingCustomer = await customersCollection.findOne({
      $or: [
        { customerCode: customerData.customerCode },
        { email: customerData.email }
      ]
    });

    if (existingCustomer) {
      return NextResponse.json(
        { success: false, error: 'Customer code or email already exists' },
        { status: 400 }
      );
    }

    const newCustomer: Customer = {
      customerCode: customerData.customerCode,
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      companyName: customerData.companyName,
      email: customerData.email,
      phone: customerData.phone,
      address: customerData.address,
      billingAddress: customerData.billingAddress,
      customerType: customerData.customerType,
      status: 'active',
      creditLimit: customerData.creditLimit || 0,
      currentBalance: 0,
      paymentTerms: customerData.paymentTerms,
      notes: customerData.notes,
      tags: customerData.tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      lastOrderDate: undefined,
      totalOrders: 0,
      totalSpent: 0
    };

    console.log('Creating customer in database...');
    const result = await customersCollection.insertOne(newCustomer);
    console.log('Customer created successfully with ID:', result.insertedId);

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newCustomer },
      message: 'Customer created successfully'
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}


