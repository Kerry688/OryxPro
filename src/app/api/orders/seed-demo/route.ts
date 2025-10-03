import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const ordersCollection = db.collection('orders');

    // Generate demo orders for today and yesterday
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const demoOrders = [
      {
        _id: new ObjectId(),
        orderNumber: 'ORD-001',
        customerId: 'cust-1',
        customerName: 'John Smith',
        customerEmail: 'john.smith@email.com',
        customerPhone: '+1-555-0123',
        items: [
          {
            id: 'item-1',
            productName: 'Canon EOS R5',
            productCode: 'CAN-R5',
            quantity: 1,
            unitPrice: 3899.00,
            totalPrice: 3899.00,
            category: 'Cameras',
            brand: 'Canon'
          },
          {
            id: 'item-2',
            productName: 'Canon RF 24-70mm f/2.8L IS USM',
            productCode: 'CAN-RF2470',
            quantity: 1,
            unitPrice: 2299.00,
            totalPrice: 2299.00,
            category: 'Lenses',
            brand: 'Canon'
          }
        ],
        subtotal: 6198.00,
        tax: 619.80,
        discount: 0,
        total: 6817.80,
        payment: {
          method: 'card',
          amount: 6817.80,
          transactionId: 'TXN-001-2024',
          status: 'completed',
          processedAt: new Date()
        },
        status: 'completed',
        orderDate: new Date(today.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        completedAt: new Date(today.getTime() - 2 * 60 * 60 * 1000),
        notes: 'Customer requested expedited shipping',
        cashierId: 'cashier-1',
        cashierName: 'Sarah Johnson',
        branchId: 'branch-1',
        branchName: 'Downtown Store',
        source: 'pos',
        sourceDetails: {
          channel: 'Point of Sale System'
        }
      },
      {
        _id: new ObjectId(),
        orderNumber: 'ORD-002',
        customerId: 'cust-2',
        customerName: 'Emily Davis',
        customerEmail: 'emily.davis@email.com',
        customerPhone: '+1-555-0456',
        items: [
          {
            id: 'item-3',
            productName: 'Sony A7 IV',
            productCode: 'SON-A7IV',
            quantity: 1,
            unitPrice: 2498.00,
            totalPrice: 2498.00,
            category: 'Cameras',
            brand: 'Sony'
          },
          {
            id: 'item-4',
            productName: 'Sony FE 70-200mm f/2.8 GM OSS II',
            productCode: 'SON-FE70200',
            quantity: 1,
            unitPrice: 2798.00,
            totalPrice: 2798.00,
            category: 'Lenses',
            brand: 'Sony'
          },
          {
            id: 'item-5',
            productName: 'SanDisk 128GB Extreme Pro CFexpress',
            productCode: 'SD-128GB',
            quantity: 2,
            unitPrice: 199.99,
            totalPrice: 399.98,
            category: 'Memory Cards',
            brand: 'SanDisk'
          }
        ],
        subtotal: 5695.98,
        tax: 569.60,
        discount: 100.00,
        total: 6165.58,
        payment: {
          method: 'mobile',
          amount: 6165.58,
          transactionId: 'TXN-002-2024',
          status: 'completed',
          processedAt: new Date()
        },
        status: 'completed',
        orderDate: new Date(today.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
        completedAt: new Date(today.getTime() - 4 * 60 * 60 * 1000),
        cashierId: 'cashier-2',
        cashierName: 'Mike Wilson',
        branchId: 'branch-1',
        branchName: 'Downtown Store',
        source: 'online',
        sourceDetails: {
          channel: 'Website'
        }
      },
      {
        _id: new ObjectId(),
        orderNumber: 'ORD-003',
        customerName: 'Walk-in Customer',
        items: [
          {
            id: 'item-6',
            productName: 'Nikon Z9',
            productCode: 'NIK-Z9',
            quantity: 1,
            unitPrice: 5499.00,
            totalPrice: 5499.00,
            category: 'Cameras',
            brand: 'Nikon'
          }
        ],
        subtotal: 5499.00,
        tax: 549.90,
        discount: 0,
        total: 6048.90,
        payment: {
          method: 'cash',
          amount: 6048.90,
          status: 'completed',
          processedAt: new Date()
        },
        status: 'completed',
        orderDate: new Date(today.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
        completedAt: new Date(today.getTime() - 6 * 60 * 60 * 1000),
        cashierId: 'cashier-1',
        cashierName: 'Sarah Johnson',
        branchId: 'branch-1',
        branchName: 'Downtown Store',
        source: 'walk-in',
        sourceDetails: {}
      },
      {
        _id: new ObjectId(),
        orderNumber: 'ORD-004',
        customerId: 'cust-3',
        customerName: 'Robert Brown',
        customerEmail: 'robert.brown@email.com',
        customerPhone: '+1-555-0789',
        items: [
          {
            id: 'item-7',
            productName: 'Fujifilm X-T5',
            productCode: 'FUJ-XT5',
            quantity: 1,
            unitPrice: 1699.00,
            totalPrice: 1699.00,
            category: 'Cameras',
            brand: 'Fujifilm'
          },
          {
            id: 'item-8',
            productName: 'Fujifilm XF 16-55mm f/2.8 R LM WR',
            productCode: 'FUJ-XF1655',
            quantity: 1,
            unitPrice: 1199.00,
            totalPrice: 1199.00,
            category: 'Lenses',
            brand: 'Fujifilm'
          }
        ],
        subtotal: 2898.00,
        tax: 289.80,
        discount: 0,
        total: 3187.80,
        payment: {
          method: 'bank_transfer',
          amount: 3187.80,
          transactionId: 'TXN-003-2024',
          status: 'pending',
          processedAt: new Date()
        },
        status: 'pending',
        orderDate: new Date(today.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
        notes: 'Customer will complete bank transfer within 24 hours',
        cashierId: 'cashier-2',
        cashierName: 'Mike Wilson',
        branchId: 'branch-1',
        branchName: 'Downtown Store',
        source: 'phone',
        sourceDetails: {
          phoneNumber: '+1-555-0789'
        }
      },
      {
        _id: new ObjectId(),
        orderNumber: 'ORD-005',
        customerId: 'cust-4',
        customerName: 'Lisa Anderson',
        customerEmail: 'lisa.anderson@email.com',
        customerPhone: '+1-555-0321',
        items: [
          {
            id: 'item-9',
            productName: 'Panasonic Lumix S5 II',
            productCode: 'PAN-S5II',
            quantity: 1,
            unitPrice: 1999.00,
            totalPrice: 1999.00,
            category: 'Cameras',
            brand: 'Panasonic'
          },
          {
            id: 'item-10',
            productName: 'Panasonic Lumix S 24-70mm f/2.8',
            productCode: 'PAN-S2470',
            quantity: 1,
            unitPrice: 1299.00,
            totalPrice: 1299.00,
            category: 'Lenses',
            brand: 'Panasonic'
          },
          {
            id: 'item-11',
            productName: 'Peak Design Camera Strap',
            productCode: 'PD-STRAP',
            quantity: 1,
            unitPrice: 59.99,
            totalPrice: 59.99,
            category: 'Accessories',
            brand: 'Peak Design'
          }
        ],
        subtotal: 3357.99,
        tax: 335.80,
        discount: 50.00,
        total: 3643.79,
        payment: {
          method: 'card',
          amount: 3643.79,
          transactionId: 'TXN-004-2024',
          status: 'completed',
          processedAt: new Date()
        },
        status: 'completed',
        orderDate: new Date(today.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
        completedAt: new Date(today.getTime() - 3 * 60 * 60 * 1000),
        cashierId: 'cashier-1',
        cashierName: 'Sarah Johnson',
        branchId: 'branch-1',
        branchName: 'Downtown Store',
        source: 'sales-rep',
        sourceDetails: {
          salesRepId: 'rep-001',
          salesRepName: 'Alex Thompson'
        }
      },
      // Yesterday's orders
      {
        _id: new ObjectId(),
        orderNumber: 'ORD-006',
        customerId: 'cust-5',
        customerName: 'David Miller',
        customerEmail: 'david.miller@email.com',
        customerPhone: '+1-555-0654',
        items: [
          {
            id: 'item-12',
            productName: 'Canon EOS R6 Mark II',
            productCode: 'CAN-R6II',
            quantity: 1,
            unitPrice: 2499.00,
            totalPrice: 2499.00,
            category: 'Cameras',
            brand: 'Canon'
          }
        ],
        subtotal: 2499.00,
        tax: 249.90,
        discount: 0,
        total: 2748.90,
        payment: {
          method: 'cash',
          amount: 2748.90,
          status: 'completed',
          processedAt: new Date(yesterday)
        },
        status: 'completed',
        orderDate: new Date(yesterday.getTime() + 14 * 60 * 60 * 1000), // 2 PM yesterday
        completedAt: new Date(yesterday.getTime() + 14 * 60 * 60 * 1000),
        cashierId: 'cashier-2',
        cashierName: 'Mike Wilson',
        branchId: 'branch-1',
        branchName: 'Downtown Store',
        source: 'email',
        sourceDetails: {
          emailAddress: 'david.miller@email.com'
        }
      },
      {
        _id: new ObjectId(),
        orderNumber: 'ORD-007',
        customerName: 'Walk-in Customer',
        items: [
          {
            id: 'item-13',
            productName: 'Sony A7R V',
            productCode: 'SON-A7RV',
            quantity: 1,
            unitPrice: 3898.00,
            totalPrice: 3898.00,
            category: 'Cameras',
            brand: 'Sony'
          },
          {
            id: 'item-14',
            productName: 'Sony FE 24-70mm f/2.8 GM II',
            productCode: 'SON-FE2470II',
            quantity: 1,
            unitPrice: 2298.00,
            totalPrice: 2298.00,
            category: 'Lenses',
            brand: 'Sony'
          }
        ],
        subtotal: 6196.00,
        tax: 619.60,
        discount: 200.00,
        total: 6615.60,
        payment: {
          method: 'card',
          amount: 6615.60,
          transactionId: 'TXN-005-2024',
          status: 'completed',
          processedAt: new Date(yesterday)
        },
        status: 'completed',
        orderDate: new Date(yesterday.getTime() + 16 * 60 * 60 * 1000), // 4 PM yesterday
        completedAt: new Date(yesterday.getTime() + 16 * 60 * 60 * 1000),
        cashierId: 'cashier-1',
        cashierName: 'Sarah Johnson',
        branchId: 'branch-1',
        branchName: 'Downtown Store',
        source: 'online',
        sourceDetails: {
          channel: 'Mobile App'
        }
      }
    ];

    // Clear existing orders and insert demo data
    await ordersCollection.deleteMany({});
    const result = await ordersCollection.insertMany(demoOrders);

    return NextResponse.json({
      success: true,
      data: { insertedCount: result.insertedCount },
      message: `Successfully seeded ${result.insertedCount} demo orders`
    });

  } catch (error) {
    console.error('Error seeding demo orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed demo orders' },
      { status: 500 }
    );
  }
}
