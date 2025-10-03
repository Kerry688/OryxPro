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
  const handleSubmit = (data: ProductFormData) => {
    console.log('Product data:', data);
    // Here you would typically send the data to your API
    // For now, we'll just log it
    alert('Product created successfully! (Check console for data)');
  };

  const handleCancel = () => {
    // Navigate back to products page
    window.history.back();
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/products">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create New Product</h1>
          <p className="text-gray-600">Add a comprehensive product to your catalog</p>
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
