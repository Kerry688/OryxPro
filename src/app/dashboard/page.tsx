'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  MapPin, 
  DollarSign,
  ShoppingCart,
  Users,
  BarChart3,
  Building2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import Link from 'next/link';
import { products, stockLevels, stockMovements, categories, suppliers, branches, warehouses } from '@/lib/data';
import type { Product, StockLevel, StockMovement, Branch, Warehouse } from '@/lib/data';

export default function DashboardPage() {
  // Calculate key metrics
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const totalCategories = categories.length;
  const totalSuppliers = suppliers.length;
  const totalBranches = branches.length;
  const totalWarehouses = warehouses.length;
  
  // Calculate inventory value
  const totalInventoryValue = stockLevels.reduce((total, stock) => {
    const product = products.find(p => p.id === stock.productId);
    if (product) {
      return total + (stock.quantity * product.costPrice);
    }
    return total;
  }, 0);

  // Calculate low stock items
  const lowStockItems = stockLevels.filter(stock => {
    const product = products.find(p => p.id === stock.productId);
    if (!product) return false;
    return stock.availableQuantity <= product.reorderPoint;
  });

  // Get recent stock movements
  const recentMovements = stockMovements
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Get top products by stock value
  const topProductsByValue = stockLevels
    .map(stock => {
      const product = products.find(p => p.id === stock.productId);
      if (!product) return null;
      return {
        product,
        stock,
        value: stock.quantity * product.costPrice
      };
    })
    .filter(Boolean)
    .sort((a, b) => b!.value - a!.value)
    .slice(0, 5);

  // Calculate movement trends
  const inboundMovements = stockMovements.filter(m => m.type === 'inbound').length;
  const outboundMovements = stockMovements.filter(m => m.type === 'outbound').length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">ERP Dashboard</h1>
        <p className="text-muted-foreground">Overview of your products and inventory management</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {activeProducts} active products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalInventoryValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Total cost value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">
              Need reordering
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Branches</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBranches}</div>
            <p className="text-xs text-muted-foreground">
              {totalWarehouses} warehouses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product Management
            </CardTitle>
            <CardDescription>
              Manage your product catalog
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/products/manage">
                View All Products
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/categories">
                Manage Categories
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Inventory Management
            </CardTitle>
            <CardDescription>
              Track stock levels and movements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/inventory">
                View Inventory
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/inventory">
                Stock Movements
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Branch Management
            </CardTitle>
            <CardDescription>
              Manage branches and warehouses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/branches">
                View All Branches
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/branches">
                Manage Warehouses
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Stock Movements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Stock Movements
            </CardTitle>
            <CardDescription>
              Latest inventory transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMovements.map(movement => {
                const product = products.find(p => p.id === movement.productId);
                if (!product) return null;

                return (
                  <div key={movement.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        movement.type === 'inbound' ? 'bg-green-100 text-green-600' :
                        movement.type === 'outbound' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {movement.type === 'inbound' ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {movement.reference} • {new Date(movement.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${
                        movement.quantity > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                      </p>
                      <Badge variant={
                        movement.type === 'inbound' ? 'default' :
                        movement.type === 'outbound' ? 'destructive' : 'secondary'
                      }>
                        {movement.type}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Products by Value */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Top Products by Inventory Value
            </CardTitle>
            <CardDescription>
              Highest value items in stock
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProductsByValue.map((item, index) => {
                if (!item) return null;
                const { product, stock, value } = item;
                const isLowStock = stock.availableQuantity <= product.reorderPoint;

                return (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Stock: {stock.availableQuantity} / {stock.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${value.toFixed(2)}</p>
                      {isLowStock && (
                        <Badge variant="destructive" className="text-xs">
                          Low Stock
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alerts
            </CardTitle>
            <CardDescription>
              Products that need immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockItems.slice(0, 6).map(stock => {
                const product = products.find(p => p.id === stock.productId);
                if (!product) return null;

                return (
                  <div key={stock.id} className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{product.name}</h4>
                      <Badge variant="destructive">Low Stock</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      SKU: {product.sku}
                    </p>
                    <div className="text-sm space-y-1">
                      <p>Current: {stock.availableQuantity}</p>
                      <p>Reorder Point: {product.reorderPoint}</p>
                      <p>Min Level: {product.minStockLevel}</p>
                    </div>
                    <Button size="sm" className="w-full mt-3" asChild>
                      <a href="/purchase-orders/create">
                        Create Purchase Order
                      </a>
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
