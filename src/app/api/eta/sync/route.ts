import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ETASyncOptions, ETASyncLog } from '@/lib/models/eta';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const etaProductsCollection = db.collection('eta_products');
    const etaInvoicesCollection = db.collection('eta_invoices');
    const etaSyncLogsCollection = db.collection('eta_sync_logs');
    
    const body: ETASyncOptions = await request.json();
    const { entityType, entityIds, forceSync = false, batchSize = 10 } = body;

    if (!entityType) {
      return NextResponse.json(
        { success: false, error: 'Entity type is required' },
        { status: 400 }
      );
    }

    const startTime = new Date();
    let syncedCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    if (entityType === 'product') {
      // Sync products with ETA
      const query: any = { syncStatus: { $in: ['pending', 'failed'] } };
      if (entityIds && entityIds.length > 0) {
        query._id = { $in: entityIds.map(id => new ObjectId(id)) };
      }

      const products = await etaProductsCollection.find(query).limit(batchSize).toArray();
      
      for (const product of products) {
        try {
          // Simulate ETA API call
          const syncResult = await syncProductWithETA(product);
          
          if (syncResult.success) {
            await etaProductsCollection.updateOne(
              { _id: product._id },
              {
                $set: {
                  status: 'active',
                  syncStatus: 'success',
                  lastSyncAt: new Date(),
                  updatedAt: new Date()
                }
              }
            );
            syncedCount++;
          } else {
            await etaProductsCollection.updateOne(
              { _id: product._id },
              {
                $set: {
                  syncStatus: 'failed',
                  syncError: syncResult.error,
                  updatedAt: new Date()
                }
              }
            );
            failedCount++;
            errors.push(`Product ${product.productName}: ${syncResult.error}`);
          }

          // Log sync attempt
          await etaSyncLogsCollection.insertOne({
            syncType: 'product',
            entityId: product._id.toString(),
            status: syncResult.success ? 'success' : 'failed',
            requestData: product,
            responseData: syncResult,
            errorMessage: syncResult.error,
            retryCount: 0,
            startedAt: startTime,
            completedAt: new Date(),
            duration: Date.now() - startTime.getTime()
          });

        } catch (error) {
          failedCount++;
          errors.push(`Product ${product.productName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

    } else if (entityType === 'invoice') {
      // Sync invoices with ETA
      const query: any = { syncStatus: { $in: ['pending', 'failed'] } };
      if (entityIds && entityIds.length > 0) {
        query._id = { $in: entityIds.map(id => new ObjectId(id)) };
      }

      const invoices = await etaInvoicesCollection.find(query).limit(batchSize).toArray();
      
      for (const invoice of invoices) {
        try {
          // Simulate ETA API call
          const syncResult = await syncInvoiceWithETA(invoice);
          
          if (syncResult.success) {
            await etaInvoicesCollection.updateOne(
              { _id: invoice._id },
              {
                $set: {
                  status: 'submitted',
                  etaInvoiceId: syncResult.etaInvoiceId,
                  etaResponse: syncResult.etaResponse,
                  syncStatus: 'success',
                  lastSyncAt: new Date(),
                  updatedAt: new Date()
                }
              }
            );
            syncedCount++;
          } else {
            await etaInvoicesCollection.updateOne(
              { _id: invoice._id },
              {
                $set: {
                  syncStatus: 'failed',
                  syncError: syncResult.error,
                  retryCount: invoice.retryCount + 1,
                  updatedAt: new Date()
                }
              }
            );
            failedCount++;
            errors.push(`Invoice ${invoice.invoiceNumber}: ${syncResult.error}`);
          }

          // Log sync attempt
          await etaSyncLogsCollection.insertOne({
            syncType: 'invoice',
            entityId: invoice._id.toString(),
            status: syncResult.success ? 'success' : 'failed',
            requestData: invoice,
            responseData: syncResult,
            errorMessage: syncResult.error,
            retryCount: invoice.retryCount,
            startedAt: startTime,
            completedAt: new Date(),
            duration: Date.now() - startTime.getTime()
          });

        } catch (error) {
          failedCount++;
          errors.push(`Invoice ${invoice.invoiceNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        entityType,
        syncedCount,
        failedCount,
        totalProcessed: syncedCount + failedCount,
        errors: errors.slice(0, 10) // Limit error messages
      },
      message: `Sync completed: ${syncedCount} successful, ${failedCount} failed`
    });

  } catch (error) {
    console.error('Error during ETA sync:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to sync with ETA' },
      { status: 500 }
    );
  }
}

// Helper function to simulate product sync with ETA
async function syncProductWithETA(product: any) {
  // This would be replaced with actual ETA API call
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
  
  // Simulate success/failure based on product data
  const success = Math.random() > 0.2; // 80% success rate
  
  if (success) {
    return {
      success: true,
      etaProductId: `ETA_${Date.now()}`,
      message: 'Product synced successfully with ETA'
    };
  } else {
    return {
      success: false,
      error: 'ETA validation failed: Invalid EGS code format'
    };
  }
}

// Helper function to simulate invoice sync with ETA
async function syncInvoiceWithETA(invoice: any) {
  // This would be replaced with actual ETA API call
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
  
  // Simulate success/failure based on invoice data
  const success = Math.random() > 0.15; // 85% success rate
  
  if (success) {
    return {
      success: true,
      etaInvoiceId: `ETA_INV_${Date.now()}`,
      etaResponse: {
        uuid: `uuid_${Date.now()}`,
        submissionId: `sub_${Date.now()}`,
        status: 'accepted',
        message: 'Invoice submitted successfully',
        timestamp: new Date()
      }
    };
  } else {
    return {
      success: false,
      error: 'ETA validation failed: Customer tax number is invalid'
    };
  }
}
