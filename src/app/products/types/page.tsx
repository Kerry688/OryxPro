'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  BarChart3
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

  const getIconComponent = (iconName: string) => {
    const icons = {
      'Package': Package,
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
      'sales_product': 'bg-blue-50 border-blue-200 text-blue-800',
      'print_item': 'bg-purple-50 border-purple-200 text-purple-800',
      'service': 'bg-green-50 border-green-200 text-green-800',
      'raw_material': 'bg-orange-50 border-orange-200 text-orange-800',
      'kit_bundle': 'bg-pink-50 border-pink-200 text-pink-800',
      'asset': 'bg-gray-50 border-gray-200 text-gray-800'
    };
    return colors[type];
  };

  const getTypeAccent = (type: ProductType) => {
    const accents = {
      'sales_product': 'bg-blue-500',
      'print_item': 'bg-purple-500',
      'service': 'bg-green-500',
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
      <div>
        <h1 className="text-3xl font-bold">Product Types Overview</h1>
        <p className="text-muted-foreground">
          Comprehensive overview of all product types and their performance metrics
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">
                  {productTypes.reduce((sum, type) => sum + type.totalCount, 0)}
                </p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Products</p>
                <p className="text-2xl font-bold">
                  {productTypes.reduce((sum, type) => sum + type.activeCount, 0)}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
                <p className="text-2xl font-bold">
                  {productTypes.reduce((sum, type) => sum + type.lowStockCount, 0)}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productTypes.map((type) => {
          const IconComponent = getIconComponent(type.icon);
          const activeRate = type.totalCount > 0 ? (type.activeCount / type.totalCount) * 100 : 0;
          const lowStockRate = type.totalCount > 0 ? (type.lowStockCount / type.totalCount) * 100 : 0;

          return (
            <Card key={type.type} className={`${getTypeColor(type.type)} hover:shadow-lg transition-shadow`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getTypeAccent(type.type)} text-white`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{type.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{type.totalCount} products</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {type.type.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{type.description}</p>
                
                {/* Metrics */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Active Products</span>
                    <span className="font-medium">{type.activeCount}</span>
                  </div>
                  <Progress value={activeRate} className="h-2" />
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Low Stock</span>
                    <span className="font-medium">{type.lowStockCount}</span>
                  </div>
                  <Progress value={lowStockRate} className="h-2" />
                  
                  {type.totalRevenue > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Revenue
                      </span>
                      <span className="font-medium">${type.totalRevenue.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => window.location.href = `/products/manage?type=${type.type}`}
                  >
                    <BarChart3 className="h-4 w-4 mr-1" />
                    View Products
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = `/products/manage?type=${type.type}&action=add`}
                  >
                    <Package className="h-4 w-4 mr-1" />
                    Add New
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Top Performing Types</h4>
              <div className="space-y-2">
                {productTypes
                  .sort((a, b) => b.totalCount - a.totalCount)
                  .slice(0, 3)
                  .map((type, index) => (
                    <div key={type.type} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">#{index + 1}</span>
                        <span className="text-sm">{type.name}</span>
                      </div>
                      <Badge variant="secondary">{type.totalCount} products</Badge>
                    </div>
                  ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Revenue Leaders</h4>
              <div className="space-y-2">
                {productTypes
                  .filter(type => type.totalRevenue > 0)
                  .sort((a, b) => b.totalRevenue - a.totalRevenue)
                  .slice(0, 3)
                  .map((type, index) => (
                    <div key={type.type} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">#{index + 1}</span>
                        <span className="text-sm">{type.name}</span>
                      </div>
                      <Badge variant="secondary">${type.totalRevenue.toLocaleString()}</Badge>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}