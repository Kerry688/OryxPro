'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EnhancedCreateProductForm } from '@/components/features/EnhancedCreateProductForm';
import { 
  Package,
  Printer,
  Wrench,
  Package2,
  Layers,
  Building2,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  BarChart3,
  Monitor,
  Factory,
  Droplets,
  Plus,
  ArrowRight
} from 'lucide-react';
import { ProductType } from '@/lib/models/product';

interface ProductTypeStats {
  type: ProductType;
  name: string;
  description: string;
  totalCount: number;
  activeCount: number;
  lowStockCount: number;
  totalRevenue: number;
  icon: string;
}

export default function ProductTypesPage() {
  const [productTypes, setProductTypes] = useState<ProductTypeStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState<string>('');

  useEffect(() => {
    fetchProductTypes();
  }, []);

  const fetchProductTypes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products/types');
      if (!response.ok) throw new Error('Failed to fetch product types');
      
      const data = await response.json();
      setProductTypes(data);
    } catch (error) {
      console.error('Error fetching product types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = (productType: string) => {
    setSelectedProductType(productType);
    setIsCreateDialogOpen(true);
  };

  const handleCreateProduct = async (data: any) => {
    try {
      console.log('Creating product with data:', data);
      
      const productData = {
        name: data.productName,
        sku: data.sku,
        description: data.description,
        type: selectedProductType || data.productType,
        category: data.category,
        subcategory: data.category,
        brand: data.brand,
        tags: data.tags,
        images: data.imageUrls || [],
        slug: data.slug,
        isService: data.isService,
        warrantyPeriod: data.warrantyPeriod,
        trackingType: data.trackingType,
        createdBy: '507f1f77bcf86cd799439011',
        status: data.status || 'active',
        virtualDigitalData: selectedProductType === 'virtual_digital' ? {
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
        manufacturedData: selectedProductType === 'manufactured_product' ? {
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
        salesData: selectedProductType === 'sales_product' ? {
          price: data.masterPrice,
          cost: data.masterPrice * 0.6,
          stock: data.stock,
          minStock: data.lowStockThreshold,
          maxStock: data.stock * 2,
          reorderPoint: data.lowStockThreshold,
          unit: 'pcs',
          trackStock: data.trackStock,
          allowBackorders: data.allowBackorders,
          dimensions: data.dimensions
        } : undefined,
        consumablesData: selectedProductType === 'consumables' ? {
          price: data.masterPrice,
          cost: data.masterPrice * 0.6,
          stock: data.stock,
          minStock: data.lowStockThreshold,
          maxStock: data.stock * 2,
          reorderPoint: data.lowStockThreshold,
          unit: 'pcs',
          consumptionRate: 1,
          shelfLife: 365,
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
      
      setIsCreateDialogOpen(false);
      alert('Product created successfully!');
      fetchProductTypes(); // Refresh the product types list
      
    } catch (error) {
      console.error('Error creating product:', error);
      alert(`Error creating product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getIconComponent = (iconName: string) => {
    const icons = {
      'Monitor': Monitor,
      'Factory': Factory,
      'Package': Package,
      'Droplets': Droplets,
      'Printer': Printer,
      'Wrench': Wrench,
      'Package2': Package2,
      'Layers': Layers,
      'Building2': Building2
    };
    return icons[iconName as keyof typeof icons] || Package;
  };

  const getTypeColor = (type: ProductType) => {
    const colors = {
      'virtual_digital': 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
      'manufactured_product': 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
      'sales_product': 'bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200',
      'consumables': 'bg-cyan-50 dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-200',
      'print_item': 'bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-200',
      'service': 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
      'raw_material': 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-200',
      'kit_bundle': 'bg-pink-50 dark:bg-pink-950 border-pink-200 dark:border-pink-800 text-pink-800 dark:text-pink-200',
      'asset': 'bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200'
    };
    return colors[type];
  };

  const getTypeAccent = (type: ProductType) => {
    const accents = {
      'virtual_digital': 'bg-blue-500',
      'manufactured_product': 'bg-green-500',
      'sales_product': 'bg-indigo-500',
      'consumables': 'bg-cyan-500',
      'print_item': 'bg-purple-500',
      'service': 'bg-emerald-500',
      'raw_material': 'bg-orange-500',
      'kit_bundle': 'bg-pink-500',
      'asset': 'bg-gray-500'
    };
    return accents[type];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Product Types</h1>
          <p className="text-muted-foreground">Manage and overview all product types in your inventory</p>
        </div>
      </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <p className="text-3xl font-bold text-foreground">
                  {productTypes.reduce((sum, type) => sum + type.totalCount, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Products</p>
                <p className="text-3xl font-bold text-foreground">
                  {productTypes.reduce((sum, type) => sum + type.activeCount, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                <p className="text-3xl font-bold text-foreground">
                  {productTypes.reduce((sum, type) => sum + type.lowStockCount, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold text-foreground">
                  ${productTypes.reduce((sum, type) => sum + type.totalRevenue, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Product Types List - Vertical Layout */}
        <div className="space-y-4">
          {productTypes.map((type) => {
            const IconComponent = getIconComponent(type.icon);
            const activeRate = type.totalCount > 0 ? (type.activeCount / type.totalCount) * 100 : 0;
            const lowStockRate = type.totalCount > 0 ? (type.lowStockCount / type.totalCount) * 100 : 0;

            return (
              <div key={type.type} className="bg-card rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-14 h-14 ${getTypeAccent(type.type)} rounded-xl flex items-center justify-center`}>
                        <IconComponent className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{type.name}</h3>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="px-3 py-1">
                        {type.totalCount} products
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.location.href = `/products?type=${type.type}`}
                        className="flex items-center space-x-2"
                      >
                        <BarChart3 className="h-4 w-4" />
                        <span>View Products</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Active Products */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Active Products</span>
                        <span className="text-sm font-semibold text-foreground">{type.activeCount}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${activeRate}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground">{activeRate.toFixed(1)}% active</span>
                    </div>

                    {/* Low Stock */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Low Stock</span>
                        <span className="text-sm font-semibold text-foreground">{type.lowStockCount}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${lowStockRate}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground">{lowStockRate.toFixed(1)}% low stock</span>
                    </div>

                    {/* Revenue */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
                        <span className="text-sm font-semibold text-foreground">
                          ${type.totalRevenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: '100%' }}
                          ></div>
                        </div>
                        <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-6 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAddProduct(type.type)}
                          className="flex items-center space-x-2"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add {type.name}</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.location.href = `/products/types/${type.type}`}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          View Details
                        </Button>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Type: {type.type.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Performance Insights - Simplified */}
        <div className="mt-8 bg-card rounded-lg shadow-sm border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Performance Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-3">Top Product Types by Count</h4>
              <div className="space-y-3">
                {productTypes
                  .sort((a, b) => b.totalCount - a.totalCount)
                  .slice(0, 5)
                  .map((type, index) => (
                    <div key={type.type} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 ${getTypeAccent(type.type)} rounded-lg flex items-center justify-center`}>
                          <span className="text-white text-sm font-medium">#{index + 1}</span>
                        </div>
                        <span className="text-sm font-medium text-foreground">{type.name}</span>
                      </div>
                      <Badge variant="secondary">{type.totalCount} products</Badge>
                    </div>
                  ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-3">Top Revenue Generators</h4>
              <div className="space-y-3">
                {productTypes
                  .filter(type => type.totalRevenue > 0)
                  .sort((a, b) => b.totalRevenue - a.totalRevenue)
                  .slice(0, 5)
                  .map((type, index) => (
                    <div key={type.type} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 ${getTypeAccent(type.type)} rounded-lg flex items-center justify-center`}>
                          <span className="text-white text-sm font-medium">#{index + 1}</span>
                        </div>
                        <span className="text-sm font-medium text-foreground">{type.name}</span>
                      </div>
                      <Badge variant="secondary">${type.totalRevenue.toLocaleString()}</Badge>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Create Product Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] w-[1180px] h-[800px] p-0 overflow-hidden large-dialog">
            <div className="flex flex-col h-full">
              <DialogHeader className="p-6 border-b bg-background flex-shrink-0">
                <DialogTitle className="text-2xl font-bold">
                  Create New {productTypes.find(t => t.type === selectedProductType)?.name || 'Product'}
                </DialogTitle>
                <DialogDescription className="text-base">
                  Create a new product of type: {selectedProductType.replace('_', ' ').toUpperCase()}
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto p-6">
                <EnhancedCreateProductForm 
                  onSubmit={handleCreateProduct}
                  onCancel={() => setIsCreateDialogOpen(false)}
                  defaultProductType={selectedProductType}
                />
              </div>
              <div className="p-6 border-t bg-background flex-shrink-0">
                <div className="flex justify-end space-x-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="px-6"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    form="create-product-form"
                    className="px-6"
                  >
                    Create Product
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
    </div>
  );
}