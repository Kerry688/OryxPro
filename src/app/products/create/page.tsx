'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedCreateProductForm } from '@/components/features/EnhancedCreateProductForm';
import { ArrowLeft, Package } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ProductFormData {
  // Basic Info
  productName: string;
  productType: string;
  status: string;
  category: string;
  brand: string;
  description: string;
  slug: string;
  sku: string;
  tags: string[];
  
  // Tracking & Service
  trackingType: 'none' | 'serial' | 'batch';
  isService: boolean;
  warrantyPeriod?: number;
  
  // Images
  images: File[];
  imageUrls: string[];
  
  // Pricing
  masterPrice: number;
  trackStock: boolean;
  allowBackorders: boolean;
  lowStockThreshold: number;
  stock: number;
  
  // Advanced
  customAttributes: { key: string; value: string }[];
  specifications: { key: string; value: string }[];
  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
  relatedProducts: string[];
}

export default function CreateProductPage() {
  const handleSubmit = async (data: ProductFormData) => {
    try {
      console.log('Creating product with data:', data);
      
      // Transform the form data to match the API expected format
      const productData = {
        name: data.productName,
        sku: data.sku,
        description: data.description,
        type: data.productType,
        category: data.category,
        subcategory: data.category, // Using category as subcategory for now
        brand: data.brand,
        tags: data.tags,
        images: data.imageUrls || [],
        slug: data.slug,
        isService: data.isService,
        warrantyPeriod: data.warrantyPeriod,
        trackingType: data.trackingType,
        // System fields - using a default ObjectId for system operations
        createdBy: '507f1f77bcf86cd799439011', // Default system ObjectId
        status: data.status || 'active',
        // Type-specific data based on product type
        virtualDigitalData: data.productType === 'virtual_digital' ? {
          price: data.masterPrice,
          cost: data.masterPrice * 0.6,
          stock: data.stock,
          minStock: data.lowStockThreshold,
          maxStock: data.stock * 2,
          reorderPoint: data.lowStockThreshold,
          unit: 'pcs',
          isDownloadable: true,
          downloadLimit: 1,
          downloadExpiry: 30,
          supportedFormats: ['PDF', 'ZIP'],
          licenseType: 'single_use',
          digitalDelivery: {
            method: 'download_link',
            automated: true
          }
        } : undefined,
        manufacturedData: data.productType === 'manufactured_product' ? {
          price: data.masterPrice,
          cost: data.masterPrice * 0.6,
          stock: data.stock,
          minStock: data.lowStockThreshold,
          maxStock: data.stock * 2,
          reorderPoint: data.lowStockThreshold,
          unit: 'pcs',
          manufacturing: {
            productionTime: 8,
            batchSize: 10,
            productionCost: data.masterPrice * 0.4,
            materialsUsed: [],
            qualityControl: {
              inspectionRequired: true,
              inspectionSteps: ['Visual check', 'Function test'],
              qualityStandards: ['ISO 9001']
            }
          }
        } : undefined,
        salesData: data.productType === 'sales_product' ? {
          price: data.masterPrice,
          cost: data.masterPrice * 0.6, // Assuming 60% cost ratio
          stock: data.stock,
          minStock: data.lowStockThreshold,
          maxStock: data.stock * 2,
          reorderPoint: data.lowStockThreshold,
          unit: 'pcs',
          trackStock: data.trackStock,
          allowBackorders: data.allowBackorders,
          dimensions: data.dimensions
        } : undefined,
        consumablesData: data.productType === 'consumables' ? {
          price: data.masterPrice,
          cost: data.masterPrice * 0.6,
          stock: data.stock,
          minStock: data.lowStockThreshold,
          maxStock: data.stock * 2,
          reorderPoint: data.lowStockThreshold,
          unit: 'pcs',
          consumptionRate: 1, // Default consumption rate
          shelfLife: 365, // Default 1 year shelf life
          storageRequirements: {
            temperature: { min: 15, max: 25 },
            humidity: { min: 30, max: 70 },
            lightSensitive: false,
            requiresRefrigeration: false
          },
          packaging: {
            type: 'bottle',
            size: '500ml',
            unitsPerPackage: 1
          },
          usage: {
            primaryUse: 'General use',
            applicationMethod: 'Direct application'
          }
        } : undefined
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create product');
      }

      const result = await response.json();
      console.log('Product created successfully:', result);
      
      alert('Product created successfully!');
      
      // Navigate back to products page
      window.location.href = '/products';
      
    } catch (error) {
      console.error('Error creating product:', error);
      alert(`Error creating product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCancel = () => {
    // Navigate back to products page
    window.history.back();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/products">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl">Create New Product</h1>
            <p className="text-muted-foreground">Add a comprehensive product to your catalog</p>
          </div>
        </div>
      </div>

      {/* Create Product Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EnhancedCreateProductForm 
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
}
