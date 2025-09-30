'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  BarChart3,
  Plus,
  Eye,
  Edit,
  Printer,
  Wrench,
  Package2,
  Layers,
  Building2,
  ShoppingCart
} from 'lucide-react';
import { ProductType } from '@/lib/models/product';
import { ProductWorkflows } from '@/components/features/ProductWorkflows';
import Link from 'next/link';

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalRevenue: number;
  recentOrders: number;
}

interface ProductTypeStats {
  type: ProductType;
  name: string;
  count: number;
  revenue: number;
  icon: string;
  color: string;
}

export default function ProductDashboardPage() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [productTypeStats, setProductTypeStats] = useState<ProductTypeStats[]>([]);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkflow, setSelectedWorkflow] = useState<ProductType | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch analytics data
      const [analyticsResponse, typesResponse, productsResponse] = await Promise.all([
        fetch('/api/products/analytics'),
        fetch('/api/products/types'),
        fetch('/api/products?limit=5&sortBy=updatedAt&sortOrder=desc')
      ]);

      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setDashboardStats({
          totalProducts: analyticsData.summary.totalProducts,
          activeProducts: analyticsData.summary.activeProducts,
          lowStockProducts: analyticsData.summary.lowStockProducts,
          outOfStockProducts: analyticsData.summary.outOfStockProducts,
          totalRevenue: analyticsData.summary.totalRevenue,
          recentOrders: 0 // This would come from orders API
        });
      }

      if (typesResponse.ok) {
        const typesData = await typesResponse.json();
        setProductTypeStats(typesData.map((type: any) => ({
          type: type.type,
          name: type.name,
          count: type.totalCount,
          revenue: type.totalRevenue,
          icon: type.icon,
          color: getTypeColor(type.type)
        })));
      }

      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setRecentProducts(productsData.products);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: ProductType) => {
    const colors = {
      'sales_product': 'bg-blue-100 text-blue-800',
      'print_item': 'bg-purple-100 text-purple-800',
      'service': 'bg-green-100 text-green-800',
      'raw_material': 'bg-orange-100 text-orange-800',
      'kit_bundle': 'bg-pink-100 text-pink-800',
      'asset': 'bg-gray-100 text-gray-800'
    };
    return colors[type];
  };

  const getTypeIcon = (iconName: string) => {
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

  const getWorkflowIcon = (type: ProductType) => {
    const icons = {
      'sales_product': ShoppingCart,
      'print_item': Printer,
      'service': Wrench,
      'raw_material': Package2,
      'kit_bundle': Layers,
      'asset': Building2
    };
    return icons[type];
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
          <h1 className="text-3xl font-bold">Product Management Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive overview of your product portfolio and operations
          </p>
        </div>
        <div className="flex space-x-2">
          <Link href="/products/manage">
            <Button variant="outline">
              <Package className="h-4 w-4 mr-2" />
              Manage Products
            </Button>
          </Link>
          <Link href="/products/manage?action=add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      {dashboardStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">{dashboardStats.totalProducts}</p>
                  <p className="text-xs text-muted-foreground">
                    {dashboardStats.activeProducts} active
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
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">${dashboardStats.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">This month</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                  <p className="text-2xl font-bold">{dashboardStats.lowStockProducts}</p>
                  <p className="text-xs text-muted-foreground">
                    {dashboardStats.outOfStockProducts} out of stock
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Stock Health</p>
                  <p className="text-2xl font-bold">
                    {Math.round(((dashboardStats.totalProducts - dashboardStats.lowStockProducts - dashboardStats.outOfStockProducts) / dashboardStats.totalProducts) * 100)}%
                  </p>
                  <p className="text-xs text-muted-foreground">healthy</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="types">Product Types</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Types Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Product Types Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productTypeStats.map((type) => {
                    const IconComponent = getTypeIcon(type.icon);
                    return (
                      <div key={type.type} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <IconComponent className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{type.name}</p>
                            <p className="text-sm text-muted-foreground">{type.count} products</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={type.color}>
                            {type.type.replace('_', ' ')}
                          </Badge>
                          {type.revenue > 0 && (
                            <p className="text-sm font-medium mt-1">
                              ${type.revenue.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/products/manage?type=sales_product">
                    <Button variant="outline" className="w-full h-20 flex-col">
                      <ShoppingCart className="h-6 w-6 mb-2" />
                      Sales Products
                    </Button>
                  </Link>
                  <Link href="/products/manage?type=print_item">
                    <Button variant="outline" className="w-full h-20 flex-col">
                      <Printer className="h-6 w-6 mb-2" />
                      Print Items
                    </Button>
                  </Link>
                  <Link href="/products/manage?type=service">
                    <Button variant="outline" className="w-full h-20 flex-col">
                      <Wrench className="h-6 w-6 mb-2" />
                      Services
                    </Button>
                  </Link>
                  <Link href="/products/manage?type=raw_material">
                    <Button variant="outline" className="w-full h-20 flex-col">
                      <Package2 className="h-6 w-6 mb-2" />
                      Raw Materials
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="types" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productTypeStats.map((type) => {
              const IconComponent = getTypeIcon(type.icon);
              return (
                <Card key={type.type} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${type.color}`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{type.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{type.count} products</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {type.revenue > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Revenue</span>
                          <span className="font-medium">${type.revenue.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex space-x-2">
                        <Link href={`/products/manage?type=${type.type}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Link href={`/products/manage?type=${type.type}&action=add`}>
                          <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productTypeStats.map((type) => {
              const WorkflowIcon = getWorkflowIcon(type.type);
              return (
                <Card key={type.type} className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => setSelectedWorkflow(type.type)}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${type.color}`}>
                        <WorkflowIcon className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{type.name} Workflow</h3>
                        <p className="text-sm text-muted-foreground">
                          Start {type.name.toLowerCase()} process
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Workflow Component */}
          {selectedWorkflow && (
            <div className="mt-6">
              <Button
                variant="outline"
                onClick={() => setSelectedWorkflow(null)}
                className="mb-4"
              >
                Close Workflow
              </Button>
              <ProductWorkflows
                productType={selectedWorkflow}
                onComplete={(data) => {
                  console.log('Workflow completed:', data);
                  setSelectedWorkflow(null);
                }}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProducts.map((product) => {
                  const IconComponent = getTypeIcon(
                    productTypeStats.find(t => t.type === product.type)?.icon || 'Package'
                  );
                  return (
                    <div key={product._id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.sku}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getTypeColor(product.type)}>
                          {productTypeStats.find(t => t.type === product.type)?.name || product.type}
                        </Badge>
                        <Link href={`/products/manage?edit=${product._id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
