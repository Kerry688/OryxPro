import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb-client';
import { ProductType } from '@/lib/models/product';

// GET - Get product types and their statistics
export async function GET(request: NextRequest) {
  try {
    const db = await connectToMongoDB();

    const productTypes: ProductType[] = [
      'virtual_digital',
      'manufactured_product',
      'sales_product',
      'consumables',
      'print_item', 
      'service',
      'raw_material',
      'kit_bundle',
      'asset'
    ];

    // Get statistics for each product type
    const typeStats = await Promise.all(
      productTypes.map(async (type) => {
        const [totalCount, activeCount, lowStockCount] = await Promise.all([
          db.collection('products').countDocuments({ type }),
          db.collection('products').countDocuments({ type, isActive: true }),
          db.collection('products').countDocuments({
            type,
            $expr: { $lte: ['$stock', '$minStock'] }
          })
        ]);

        // Get revenue for types that have pricing
        let totalRevenue = 0;
        if (['virtual_digital', 'manufactured_product', 'sales_product', 'consumables', 'print_item', 'service', 'kit_bundle'].includes(type)) {
          const priceField = type === 'service' ? 'basePrice' : 'price';
          const revenueResult = await db.collection('products').aggregate([
            { $match: { type, isActive: true } },
            { $group: { _id: null, total: { $sum: `$${priceField}` } } }
          ]).toArray();
          totalRevenue = revenueResult[0]?.total || 0;
        }

        return {
          type,
          name: getProductTypeName(type),
          description: getProductTypeDescription(type),
          totalCount,
          activeCount,
          lowStockCount,
          totalRevenue,
          icon: getProductTypeIcon(type)
        };
      })
    );

    return NextResponse.json(typeStats);
  } catch (error) {
    console.error('Error fetching product types:', error);
    return NextResponse.json({ error: 'Failed to fetch product types' }, { status: 500 });
  }
}

// Helper functions
function getProductTypeName(type: ProductType): string {
  const names = {
    'virtual_digital': 'Virtual / Digital Products',
    'manufactured_product': 'Manufactured Products (Finished Goods)',
    'sales_product': 'Sales Products',
    'consumables': 'Consumables',
    'print_item': 'Print Items',
    'service': 'Services',
    'raw_material': 'Raw Materials',
    'kit_bundle': 'Kits & Bundles',
    'asset': 'Assets'
  };
  return names[type];
}

function getProductTypeDescription(type: ProductType): string {
  const descriptions = {
    'virtual_digital': 'Digital products and downloadable content with licensing options',
    'manufactured_product': 'Finished goods from production with manufacturing details',
    'sales_product': 'Regular retail products for direct sale to customers',
    'consumables': 'Items that get used up or consumed with shelf life tracking',
    'print_item': 'Print-on-demand products with customizable options',
    'service': 'Service-based offerings including consultations and installations',
    'raw_material': 'Materials and supplies used in production processes',
    'kit_bundle': 'Product bundles and kits combining multiple items',
    'asset': 'Fixed assets and capital goods for business operations'
  };
  return descriptions[type];
}

function getProductTypeIcon(type: ProductType): string {
  const icons = {
    'virtual_digital': 'Monitor',
    'manufactured_product': 'Factory',
    'sales_product': 'Package',
    'consumables': 'Droplets',
    'print_item': 'Printer',
    'service': 'Wrench',
    'raw_material': 'Package2',
    'kit_bundle': 'Layers',
    'asset': 'Building2'
  };
  return icons[type];
}
