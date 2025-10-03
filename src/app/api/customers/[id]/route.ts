import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb-client';
import { Customer, UpdateCustomerData } from '@/lib/models/customer';
import { ObjectId } from 'mongodb';

// GET /api/customers/[id] - Get a specific customer
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectToMongoDB();
    const customersCollection = db.collection<Customer>('customers');

    const customerId = new ObjectId(params.id);
    const customer = await customersCollection.findOne({ _id: customerId });

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}

// PUT /api/customers/[id] - Update a customer
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectToMongoDB();
    const customersCollection = db.collection<Customer>('customers');

    const customerId = new ObjectId(params.id);
    const updateData: UpdateCustomerData = await request.json();

    // Check if customer exists
    const existingCustomer = await customersCollection.findOne({ _id: customerId });
    if (!existingCustomer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Check if email is being changed and if it already exists
    if (updateData.email && updateData.email !== existingCustomer.email) {
      const emailExists = await customersCollection.findOne({
        email: updateData.email,
        _id: { $ne: customerId }
      });

      if (emailExists) {
        return NextResponse.json(
          { success: false, error: 'Email already exists' },
          { status: 400 }
        );
      }
    }

    const updatedCustomer = {
      ...updateData,
      updatedAt: new Date()
    };

    const result = await customersCollection.updateOne(
      { _id: customerId },
      { $set: updatedCustomer }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Return updated customer
    const updatedCustomerData = await customersCollection.findOne({ _id: customerId });

    return NextResponse.json({
      success: true,
      data: updatedCustomerData,
      message: 'Customer updated successfully'
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

// DELETE /api/customers/[id] - Delete a customer
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectToMongoDB();
    const customersCollection = db.collection<Customer>('customers');

    const customerId = new ObjectId(params.id);

    // Check if customer exists
    const existingCustomer = await customersCollection.findOne({ _id: customerId });
    if (!existingCustomer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Check if customer has orders (optional business logic)
    // You might want to prevent deletion if customer has orders
    // const ordersCollection = db.collection('orders');
    // const hasOrders = await ordersCollection.findOne({ customerId: customerId });
    // if (hasOrders) {
    //   return NextResponse.json(
    //     { success: false, error: 'Cannot delete customer with existing orders' },
    //     { status: 400 }
    //   );
    // }

    const result = await customersCollection.deleteOne({ _id: customerId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}


