import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ETAInvoice, CreateETAInvoiceData, ETAInvoiceSearchOptions } from '@/lib/models/eta';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const etaInvoicesCollection = db.collection('eta_invoices');
    
    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get('invoiceId');
    const etaInvoiceId = searchParams.get('etaInvoiceId');
    const status = searchParams.get('status');
    const syncStatus = searchParams.get('syncStatus');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const customerName = searchParams.get('customerName');
    const searchTerm = searchParams.get('searchTerm');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const query: any = {};
    
    if (invoiceId) {
      query.invoiceId = invoiceId;
    }
    
    if (etaInvoiceId) {
      query.etaInvoiceId = etaInvoiceId;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (syncStatus) {
      query.syncStatus = syncStatus;
    }
    
    if (dateFrom || dateTo) {
      query.invoiceDate = {};
      if (dateFrom) {
        query.invoiceDate.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        query.invoiceDate.$lte = new Date(dateTo);
      }
    }
    
    if (customerName) {
      query.customerName = { $regex: customerName, $options: 'i' };
    }
    
    if (searchTerm) {
      query.$or = [
        { invoiceNumber: { $regex: searchTerm, $options: 'i' } },
        { customerName: { $regex: searchTerm, $options: 'i' } },
        { etaInvoiceId: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    const invoices = await etaInvoicesCollection
      .find(query)
      .sort({ invoiceDate: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      data: invoices,
      total: invoices.length
    });

  } catch (error) {
    console.error('Error fetching ETA invoices:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ETA invoices' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const etaInvoicesCollection = db.collection('eta_invoices');
    
    const body: CreateETAInvoiceData = await request.json();
    const { invoiceId, invoiceNumber, invoiceDate, dueDate, customerName, customerTaxNumber, customerAddress, customerPhone, customerEmail, items, subtotal, taxAmount, discountAmount, totalAmount, currency, paymentMethod } = body;

    // Validate required fields
    if (!invoiceId || !invoiceNumber || !invoiceDate || !customerName || !items || items.length === 0 || subtotal === undefined || taxAmount === undefined || totalAmount === undefined) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Check if invoice already exists
    const existingInvoice = await etaInvoicesCollection.findOne({
      $or: [
        { invoiceId },
        { invoiceNumber }
      ]
    });

    if (existingInvoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice with this ID or number already exists' },
        { status: 400 }
      );
    }

    const newInvoice: Omit<ETAInvoice, '_id'> = {
      invoiceId,
      invoiceNumber,
      invoiceDate: new Date(invoiceDate),
      dueDate: dueDate ? new Date(dueDate) : undefined,
      customerName,
      customerTaxNumber,
      customerAddress,
      customerPhone,
      customerEmail,
      items,
      subtotal,
      taxAmount,
      discountAmount: discountAmount || 0,
      totalAmount,
      currency: currency || 'EGP',
      paymentMethod,
      status: 'draft',
      syncStatus: 'pending',
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await etaInvoicesCollection.insertOne(newInvoice);

    if (result.insertedId) {
      const createdInvoice = await etaInvoicesCollection.findOne({ _id: result.insertedId });
      return NextResponse.json({
        success: true,
        data: createdInvoice,
        message: 'ETA invoice created successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to create ETA invoice' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error creating ETA invoice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create ETA invoice' },
      { status: 500 }
    );
  }
}
