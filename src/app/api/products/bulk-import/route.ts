import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file type
    const allowedExtensions = ['.csv', '.xlsx', '.xls'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { success: false, error: 'Only CSV and Excel files (.csv, .xlsx, .xls) are allowed' },
        { status: 400 }
      );
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Read and parse file
    let text: string;
    
    if (fileExtension === '.csv') {
      text = await file.text();
    } else {
      // For Excel files, we'll need a library like xlsx to parse them
      // For now, we'll return an error asking user to convert to CSV
      return NextResponse.json(
        { 
          success: false, 
          error: 'Excel file parsing not yet implemented. Please convert your Excel file to CSV format and try again.' 
        },
        { status: 400 }
      );
    }
    
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      return NextResponse.json(
        { success: false, error: 'CSV file must contain at least a header row and one data row' },
        { status: 400 }
      );
    }

    // Parse CSV headers
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const dataLines = lines.slice(1);

    // Validate required headers
    const requiredHeaders = ['name', 'sku', 'description', 'type', 'category'];
    const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
    
    if (missingHeaders.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required headers: ${missingHeaders.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();
    const productsCollection = db.collection('products');

    const results = {
      success: 0,
      errors: 0,
      total: dataLines.length,
      errorsList: [] as string[]
    };

    // Process each row
    for (let i = 0; i < dataLines.length; i++) {
      try {
        const values = dataLines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        
        if (values.length !== headers.length) {
          throw new Error(`Row ${i + 2}: Column count mismatch`);
        }

        // Create product object
        const rowData: { [key: string]: string } = {};
        headers.forEach((header, index) => {
          rowData[header] = values[index];
        });

        // Validate required fields
        if (!rowData.name || !rowData.sku || !rowData.description || !rowData.type || !rowData.category) {
          throw new Error(`Row ${i + 2}: Missing required fields`);
        }

        // Check if SKU already exists
        const existingProduct = await productsCollection.findOne({ sku: rowData.sku });
        if (existingProduct) {
          throw new Error(`Row ${i + 2}: SKU '${rowData.sku}' already exists`);
        }

        // Create product document
        const product = {
          name: rowData.name,
          sku: rowData.sku,
          description: rowData.description,
          type: rowData.type,
          category: rowData.category,
          subcategory: rowData.subcategory || rowData.category,
          brand: rowData.brand || '',
          tags: rowData.tags ? rowData.tags.split(';').map((tag: string) => tag.trim()).filter((tag: string) => tag) : [],
          images: [],
          slug: rowData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          isService: rowData.isService === 'true',
          warrantyPeriod: rowData.warrantyPeriod ? parseInt(rowData.warrantyPeriod) : undefined,
          trackingType: rowData.trackingType || 'serial',
          price: rowData.price ? parseFloat(rowData.price) : undefined,
          cost: rowData.cost ? parseFloat(rowData.cost) : undefined,
          stock: rowData.stock ? parseInt(rowData.stock) : undefined,
          minStock: rowData.minStock ? parseInt(rowData.minStock) : undefined,
          maxStock: rowData.maxStock ? parseInt(rowData.maxStock) : undefined,
          reorderPoint: rowData.reorderPoint ? parseInt(rowData.reorderPoint) : undefined,
          unit: rowData.unit || 'pcs',
          trackStock: rowData.trackStock === 'true',
          allowBackorders: rowData.allowBackorders === 'true',
          dimensions: undefined,
          isActive: rowData.isActive !== 'false',
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: '507f1f77bcf86cd799439011', // Default user ID
          updatedBy: '507f1f77bcf86cd799439011'
        };

        // Insert product
        await productsCollection.insertOne(product);
        results.success++;

      } catch (error) {
        results.errors++;
        const errorMessage = error instanceof Error ? error.message : `Row ${i + 2}: Unknown error`;
        results.errorsList.push(errorMessage);
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
      message: `Import completed. ${results.success} products imported successfully, ${results.errors} errors.`
    });

  } catch (error) {
    console.error('Error in bulk import:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process import file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
