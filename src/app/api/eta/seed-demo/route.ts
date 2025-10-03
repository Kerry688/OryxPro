import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ETAProduct, ETAInvoice } from '@/lib/models/eta';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const etaProductsCollection = db.collection('eta_products');
    const etaInvoicesCollection = db.collection('eta_invoices');
    const productsCollection = db.collection('products');
    const usersCollection = db.collection('users');

    // Clear existing demo data
    await etaProductsCollection.deleteMany({});
    await etaInvoicesCollection.deleteMany({});

    // Get existing products and users for demo data
    const products = await productsCollection.find({}).limit(10).toArray();
    const users = await usersCollection.find({}).limit(5).toArray();

    if (products.length === 0 || users.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Need products and users to create ETA demo data' },
        { status: 400 }
      );
    }

    // Create demo ETA products
    const demoProducts = [
      {
        productId: products[0]._id.toString(),
        productName: products[0].name || 'Business Cards',
        productCode: products[0].sku || 'BC001',
        egsCode: 'EGS-001-001',
        egsDescription: 'Business Cards - Standard Quality',
        category: 'Printing Services',
        subcategory: 'Business Cards',
        unitOfMeasure: 'piece',
        taxRate: 14,
        status: 'active',
        syncStatus: 'success',
        lastSyncAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: products[1]?._id.toString() || 'prod_2',
        productName: products[1]?.name || 'Flyers',
        productCode: products[1]?.sku || 'FL001',
        egsCode: 'EGS-001-002',
        egsDescription: 'Flyers - A4 Size',
        category: 'Printing Services',
        subcategory: 'Flyers',
        unitOfMeasure: 'piece',
        taxRate: 14,
        status: 'active',
        syncStatus: 'success',
        lastSyncAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: products[2]?._id.toString() || 'prod_3',
        productName: products[2]?.name || 'Banners',
        productCode: products[2]?.sku || 'BN001',
        egsCode: 'EGS-001-003',
        egsDescription: 'Banners - Vinyl Material',
        category: 'Printing Services',
        subcategory: 'Banners',
        unitOfMeasure: 'square_meter',
        taxRate: 14,
        status: 'pending_approval',
        syncStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: products[3]?._id.toString() || 'prod_4',
        productName: products[3]?.name || 'Brochures',
        productCode: products[3]?.sku || 'BR001',
        egsCode: 'EGS-001-004',
        egsDescription: 'Brochures - Tri-fold Design',
        category: 'Printing Services',
        subcategory: 'Brochures',
        unitOfMeasure: 'piece',
        taxRate: 14,
        status: 'active',
        syncStatus: 'failed',
        syncError: 'Invalid EGS code format',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const createdProducts = await etaProductsCollection.insertMany(demoProducts);

    // Create demo ETA invoices
    const demoInvoices = [
      {
        invoiceId: 'inv_001',
        invoiceNumber: 'INV-2024-001',
        invoiceDate: new Date('2024-01-15'),
        dueDate: new Date('2024-02-15'),
        customerName: 'Ahmed Hassan',
        customerTaxNumber: '12345678901234',
        customerAddress: '123 Tahrir Square, Cairo',
        customerPhone: '+201234567890',
        customerEmail: 'ahmed.hassan@email.com',
        items: [
          {
            itemCode: 'EGS-001-001',
            itemName: 'Business Cards',
            itemDescription: 'Business Cards - Standard Quality',
            quantity: 1000,
            unitPrice: 0.5,
            totalPrice: 500,
            taxRate: 14,
            taxAmount: 70,
            discount: 0,
            discountAmount: 0
          }
        ],
        subtotal: 500,
        taxAmount: 70,
        discountAmount: 0,
        totalAmount: 570,
        currency: 'EGP',
        paymentMethod: 'cash',
        status: 'accepted',
        etaInvoiceId: 'ETA_INV_001',
        submissionDate: new Date('2024-01-15'),
        acceptanceDate: new Date('2024-01-16'),
        etaResponse: {
          uuid: 'uuid_001',
          submissionId: 'sub_001',
          status: 'accepted',
          message: 'Invoice accepted successfully',
          timestamp: new Date('2024-01-16')
        },
        syncStatus: 'success',
        lastSyncAt: new Date('2024-01-16'),
        retryCount: 0,
        maxRetries: 3,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-16')
      },
      {
        invoiceId: 'inv_002',
        invoiceNumber: 'INV-2024-002',
        invoiceDate: new Date('2024-01-20'),
        dueDate: new Date('2024-02-20'),
        customerName: 'Fatma Ali',
        customerTaxNumber: '98765432109876',
        customerAddress: '456 Zamalek, Cairo',
        customerPhone: '+201987654321',
        customerEmail: 'fatma.ali@email.com',
        items: [
          {
            itemCode: 'EGS-001-002',
            itemName: 'Flyers',
            itemDescription: 'Flyers - A4 Size',
            quantity: 5000,
            unitPrice: 0.2,
            totalPrice: 1000,
            taxRate: 14,
            taxAmount: 140,
            discount: 50,
            discountAmount: 50
          }
        ],
        subtotal: 1000,
        taxAmount: 140,
        discountAmount: 50,
        totalAmount: 1090,
        currency: 'EGP',
        paymentMethod: 'bank_transfer',
        status: 'submitted',
        etaInvoiceId: 'ETA_INV_002',
        submissionDate: new Date('2024-01-20'),
        etaResponse: {
          uuid: 'uuid_002',
          submissionId: 'sub_002',
          status: 'submitted',
          message: 'Invoice submitted successfully',
          timestamp: new Date('2024-01-20')
        },
        syncStatus: 'success',
        lastSyncAt: new Date('2024-01-20'),
        retryCount: 0,
        maxRetries: 3,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
      },
      {
        invoiceId: 'inv_003',
        invoiceNumber: 'INV-2024-003',
        invoiceDate: new Date('2024-01-25'),
        dueDate: new Date('2024-02-25'),
        customerName: 'Mohamed Ibrahim',
        customerTaxNumber: '11111111111111',
        customerAddress: '789 Maadi, Cairo',
        customerPhone: '+201111111111',
        customerEmail: 'mohamed.ibrahim@email.com',
        items: [
          {
            itemCode: 'EGS-001-003',
            itemName: 'Banners',
            itemDescription: 'Banners - Vinyl Material',
            quantity: 10,
            unitPrice: 150,
            totalPrice: 1500,
            taxRate: 14,
            taxAmount: 210,
            discount: 0,
            discountAmount: 0
          }
        ],
        subtotal: 1500,
        taxAmount: 210,
        discountAmount: 0,
        totalAmount: 1710,
        currency: 'EGP',
        paymentMethod: 'card',
        status: 'rejected',
        submissionDate: new Date('2024-01-25'),
        rejectionReason: 'Invalid customer tax number format',
        etaResponse: {
          uuid: 'uuid_003',
          submissionId: 'sub_003',
          status: 'rejected',
          message: 'Invalid customer tax number format',
          timestamp: new Date('2024-01-25')
        },
        syncStatus: 'failed',
        syncError: 'Invalid customer tax number format',
        retryCount: 1,
        maxRetries: 3,
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-01-25')
      },
      {
        invoiceId: 'inv_004',
        invoiceNumber: 'INV-2024-004',
        invoiceDate: new Date('2024-01-30'),
        dueDate: new Date('2024-02-28'),
        customerName: 'Sara Mohamed',
        customerTaxNumber: '22222222222222',
        customerAddress: '321 Heliopolis, Cairo',
        customerPhone: '+201222222222',
        customerEmail: 'sara.mohamed@email.com',
        items: [
          {
            itemCode: 'EGS-001-001',
            itemName: 'Business Cards',
            itemDescription: 'Business Cards - Premium Quality',
            quantity: 2000,
            unitPrice: 0.8,
            totalPrice: 1600,
            taxRate: 14,
            taxAmount: 224,
            discount: 100,
            discountAmount: 100
          }
        ],
        subtotal: 1600,
        taxAmount: 224,
        discountAmount: 100,
        totalAmount: 1724,
        currency: 'EGP',
        paymentMethod: 'mobile',
        status: 'draft',
        syncStatus: 'pending',
        retryCount: 0,
        maxRetries: 3,
        createdAt: new Date('2024-01-30'),
        updatedAt: new Date('2024-01-30')
      }
    ];

    const createdInvoices = await etaInvoicesCollection.insertMany(demoInvoices);

    return NextResponse.json({
      success: true,
      data: {
        products: createdProducts.insertedIds,
        invoices: createdInvoices.insertedIds
      },
      message: `Created ${demoProducts.length} ETA products and ${demoInvoices.length} ETA invoices`,
      count: demoProducts.length + demoInvoices.length
    });

  } catch (error) {
    console.error('Error seeding ETA demo data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed ETA demo data' },
      { status: 500 }
    );
  }
}
