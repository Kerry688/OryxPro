import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb-client';
import { Customer } from '@/lib/models/customer';
import { ObjectId } from 'mongodb';

// Demo customer data
const demoCustomers = [
  {
    customerCode: 'CUST-001',
    firstName: 'Ahmed',
    lastName: 'Mahmoud',
    companyName: 'Mahmoud Photography Studio',
    email: 'ahmed.mahmoud@photostudio.com',
    phone: '+20 10 1234 5678',
    address: {
      street: '123 Tahrir Square',
      city: 'Cairo',
      state: 'Cairo',
      zipCode: '11511',
      country: 'Egypt'
    },
    customerType: 'business' as const,
    creditLimit: 50000,
    paymentTerms: 30,
    notes: 'Professional photography studio with high volume orders',
    tags: ['professional', 'studio', 'high-volume', 'vip']
  },
  {
    customerCode: 'CUST-002',
    firstName: 'Sarah',
    lastName: 'Johnson',
    companyName: 'Johnson Events',
    email: 'sarah.johnson@events.com',
    phone: '+1 555 123 4567',
    address: {
      street: '456 Event Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    customerType: 'business' as const,
    creditLimit: 25000,
    paymentTerms: 15,
    notes: 'Event planning company specializing in corporate events',
    tags: ['events', 'corporate', 'regular']
  },
  {
    customerCode: 'CUST-003',
    firstName: 'Mohamed',
    lastName: 'Hassan',
    email: 'mohamed.hassan@email.com',
    phone: '+20 11 9876 5432',
    address: {
      street: '789 Alexandria Street',
      city: 'Alexandria',
      state: 'Alexandria',
      zipCode: '21500',
      country: 'Egypt'
    },
    customerType: 'individual' as const,
    creditLimit: 5000,
    paymentTerms: 30,
    notes: 'Freelance photographer',
    tags: ['freelance', 'individual', 'photographer']
  },
  {
    customerCode: 'CUST-004',
    firstName: 'Emily',
    lastName: 'Davis',
    companyName: 'Davis Wedding Photography',
    email: 'emily.davis@weddingphoto.com',
    phone: '+1 555 987 6543',
    address: {
      street: '321 Wedding Lane',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    customerType: 'business' as const,
    creditLimit: 15000,
    paymentTerms: 30,
    notes: 'Specialized wedding photography business',
    tags: ['wedding', 'photography', 'specialized']
  },
  {
    customerCode: 'CUST-005',
    firstName: 'Omar',
    lastName: 'Ibrahim',
    companyName: 'Ibrahim Media Group',
    email: 'omar.ibrahim@mediagroup.com',
    phone: '+20 12 3456 7890',
    address: {
      street: '654 Media District',
      city: 'Cairo',
      state: 'Cairo',
      zipCode: '11511',
      country: 'Egypt'
    },
    customerType: 'business' as const,
    creditLimit: 75000,
    paymentTerms: 45,
    notes: 'Large media production company with multiple projects',
    tags: ['media', 'production', 'large-client', 'vip']
  },
  {
    customerCode: 'CUST-006',
    firstName: 'Jessica',
    lastName: 'Wilson',
    email: 'jessica.wilson@email.com',
    phone: '+1 555 456 7890',
    address: {
      street: '987 Art Street',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    customerType: 'individual' as const,
    creditLimit: 3000,
    paymentTerms: 15,
    notes: 'Art student and amateur photographer',
    tags: ['student', 'amateur', 'art']
  },
  {
    customerCode: 'CUST-007',
    firstName: 'Hassan',
    lastName: 'Ali',
    companyName: 'Ali Commercial Photography',
    email: 'hassan.ali@commercial.com',
    phone: '+20 15 6789 0123',
    address: {
      street: '147 Business Avenue',
      city: 'Giza',
      state: 'Giza',
      zipCode: '12613',
      country: 'Egypt'
    },
    customerType: 'business' as const,
    creditLimit: 30000,
    paymentTerms: 30,
    notes: 'Commercial photography for advertising agencies',
    tags: ['commercial', 'advertising', 'business']
  },
  {
    customerCode: 'CUST-008',
    firstName: 'Lisa',
    lastName: 'Brown',
    companyName: 'Brown Photography Academy',
    email: 'lisa.brown@academy.com',
    phone: '+1 555 789 0123',
    address: {
      street: '258 Academy Road',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'USA'
    },
    customerType: 'business' as const,
    creditLimit: 20000,
    paymentTerms: 30,
    notes: 'Photography education and training center',
    tags: ['education', 'training', 'academy']
  },
  {
    customerCode: 'CUST-009',
    firstName: 'Youssef',
    lastName: 'Nasser',
    email: 'youssef.nasser@email.com',
    phone: '+20 19 0123 4567',
    address: {
      street: '369 Residential Area',
      city: 'Sharm El Sheikh',
      state: 'South Sinai',
      zipCode: '46619',
      country: 'Egypt'
    },
    customerType: 'individual' as const,
    creditLimit: 8000,
    paymentTerms: 30,
    notes: 'Travel and landscape photographer',
    tags: ['travel', 'landscape', 'individual']
  },
  {
    customerCode: 'CUST-010',
    firstName: 'Michael',
    lastName: 'Taylor',
    companyName: 'Taylor Sports Photography',
    email: 'michael.taylor@sportsphoto.com',
    phone: '+1 555 321 0987',
    address: {
      street: '741 Sports Complex',
      city: 'Boston',
      state: 'MA',
      zipCode: '02101',
      country: 'USA'
    },
    customerType: 'business' as const,
    creditLimit: 40000,
    paymentTerms: 30,
    notes: 'Specialized sports photography for major events',
    tags: ['sports', 'events', 'specialized']
  }
];

// GET - Check existing demo customers
export async function GET() {
  try {
    const db = await connectToMongoDB();
    const customersCollection = db.collection<Customer>('customers');
    
    const existingCustomers = await customersCollection.find({
      customerCode: { $regex: /^CUST-/ }
    }).toArray();

    return NextResponse.json({
      success: true,
      count: existingCustomers.length,
      customers: existingCustomers,
      message: `Found ${existingCustomers.length} demo customers`
    });
  } catch (error) {
    console.error('Error fetching demo customers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch demo customers' },
      { status: 500 }
    );
  }
}

// POST - Seed demo customers
export async function POST() {
  try {
    const db = await connectToMongoDB();
    const customersCollection = db.collection<Customer>('customers');

    // Check if demo customers already exist
    const existingCustomers = await customersCollection.find({
      customerCode: { $regex: /^CUST-/ }
    }).toArray();

    if (existingCustomers.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Demo customers already exist. Use DELETE to clear them first.',
        count: existingCustomers.length
      }, { status: 400 });
    }

    // Prepare customer data with proper structure
    const customersToInsert = demoCustomers.map(customer => ({
      ...customer,
      status: 'active' as const,
      currentBalance: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastOrderDate: undefined,
      totalOrders: 0,
      totalSpent: 0
    }));

    const result = await customersCollection.insertMany(customersToInsert);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${result.insertedCount} demo customers`,
      insertedCount: result.insertedCount,
      data: {
        customers: customersToInsert,
        summary: {
          business: customersToInsert.filter(c => c.customerType === 'business').length,
          individual: customersToInsert.filter(c => c.customerType === 'individual').length,
          totalCreditLimit: customersToInsert.reduce((sum, c) => sum + c.creditLimit, 0)
        }
      }
    });
  } catch (error) {
    console.error('Error seeding demo customers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed demo customers' },
      { status: 500 }
    );
  }
}

// DELETE - Clear demo customers
export async function DELETE() {
  try {
    const db = await connectToMongoDB();
    const customersCollection = db.collection<Customer>('customers');

    const result = await customersCollection.deleteMany({
      customerCode: { $regex: /^CUST-/ }
    });

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} demo customers`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error clearing demo customers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear demo customers' },
      { status: 500 }
    );
  }
}

