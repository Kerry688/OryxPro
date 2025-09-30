'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  ShoppingCart, 
  Truck, 
  ArrowUpDown, 
  RotateCcw,
  TrendingUp,
  AlertTriangle,
  Building2,
  Warehouse,
  FileText,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
import { 
  purchaseOrders, 
  goodsReceipts, 
  issues, 
  returns, 
  transferOrders, 
  stockLevels, 
  products, 
  branches, 
  warehouses,
  suppliers 
} from '@/lib/data';
import type { 
  PurchaseOrder, 
  GoodsReceipt, 
  Issue, 
  Return, 
  TransferOrder,
  StockLevel,
  Product,
  Branch,
  Warehouse as WarehouseType,
  Supplier
} from '@/lib/data';

export default function WarehouseManagementPage() {
  // Calculate key metrics
  const totalPurchaseOrders = purchaseOrders.length;
  const pendingPOs = purchaseOrders.filter(po => ['draft', 'pending', 'ordered'].includes(po.status)).length;
  const totalGoodsReceipts = goodsReceipts.length;
  const pendingReceipts = goodsReceipts.filter(gr => gr.status !== 'completed').length;
  const totalIssues = issues.length;
  const pendingIssues = issues.filter(issue => issue.status !== 'completed').length;
  const totalReturns = returns.length;
  const pendingReturns = returns.filter(ret => ret.status !== 'completed').length;
  const totalTransfers = transferOrders.length;
  const pendingTransfers = transferOrders.filter(to => ['draft', 'approved', 'in_transit'].includes(to.status)).length;

  // Calculate total inventory value
  const totalInventoryValue = stockLevels.reduce((total, stock) => {
    const product = products.find(p => p.id === stock.productId);
    if (product) {
      return total + (stock.quantity * product.costPrice);
    }
    return total;
  }, 0);

  // Get recent activities
  const getRecentPurchaseOrders = () => {
    return purchaseOrders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  const getRecentGoodsReceipts = () => {
    return goodsReceipts
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  const getRecentIssues = () => {
    return issues
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  const getRecentTransfers = () => {
    return transferOrders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  // Helper functions
  const getProduct = (productId: string) => products.find(p => p.id === productId);
  const getBranch = (branchId: string) => branches.find(b => b.id === branchId);
  const getWarehouse = (warehouseId: string) => warehouses.find(w => w.id === warehouseId);
  const getSupplier = (supplierId: string) => suppliers.find(s => s.id === supplierId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'received':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'draft':
      case 'approved':
        return 'bg-yellow-100 text-yellow-800';
      case 'ordered':
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Warehouse Management</h1>
        <p className="text-muted-foreground">Comprehensive warehouse operations and inventory management</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Purchase Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPurchaseOrders}</div>
            <p className="text-xs text-muted-foreground">
              {pendingPOs} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goods Receipts</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGoodsReceipts}</div>
            <p className="text-xs text-muted-foreground">
              {pendingReceipts} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issues</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIssues}</div>
            <p className="text-xs text-muted-foreground">
              {pendingIssues} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transfer Orders</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransfers}</div>
            <p className="text-xs text-muted-foreground">
              {pendingTransfers} pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Purchase Orders
            </CardTitle>
            <CardDescription>
              Manage purchase orders and procurement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/warehouse/purchase-orders">
                View All POs
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/warehouse/purchase-orders/create">
                Create PO
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Goods Receipts
            </CardTitle>
            <CardDescription>
              Process incoming deliveries
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/warehouse/goods-receipts">
                View Receipts
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/warehouse/goods-receipts/create">
                Create Receipt
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Issues & Consumption
            </CardTitle>
            <CardDescription>
              Track stock issues and consumption
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/warehouse/issues">
                View Issues
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/warehouse/issues/create">
                Create Issue
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpDown className="h-5 w-5" />
              Transfer Orders
            </CardTitle>
            <CardDescription>
              Manage inter-warehouse transfers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/warehouse/transfers">
                View Transfers
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/warehouse/transfers/create">
                Create Transfer
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="purchase-orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="goods-receipts">Goods Receipts</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
          <TabsTrigger value="returns">Returns</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Purchase Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Recent Purchase Orders
                </CardTitle>
                <CardDescription>
                  Latest purchase order activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getRecentPurchaseOrders().map(po => {
                    const supplier = getSupplier(po.supplierId);
                    const branch = getBranch(po.branchId);
                    const warehouse = getWarehouse(po.warehouseId);
                    
                    return (
                      <div key={po.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{po.poNumber}</h4>
                            <Badge className={getStatusColor(po.status)}>
                              {po.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {supplier?.name} • {branch?.name} • {warehouse?.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ${po.total.toFixed(2)} • {new Date(po.orderDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Issues */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Recent Issues
                </CardTitle>
                <CardDescription>
                  Latest stock issues and consumption
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getRecentIssues().map(issue => {
                    const branch = getBranch(issue.branchId);
                    const warehouse = getWarehouse(issue.warehouseId);
                    
                    return (
                      <div key={issue.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{issue.issueNumber}</h4>
                            <Badge className={getStatusColor(issue.status)}>
                              {issue.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {issue.type} • {issue.department || issue.project || 'N/A'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ${issue.totalCost.toFixed(2)} • {new Date(issue.issueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="purchase-orders">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Orders</CardTitle>
              <CardDescription>
                Manage purchase orders and procurement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {purchaseOrders.map(po => {
                  const supplier = getSupplier(po.supplierId);
                  const branch = getBranch(po.branchId);
                  const warehouse = getWarehouse(po.warehouseId);
                  
                  return (
                    <div key={po.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <h3 className="font-semibold">{po.poNumber}</h3>
                            <p className="text-sm text-muted-foreground">
                              {supplier?.name} • {branch?.name} • {warehouse?.name}
                            </p>
                          </div>
                          <Badge className={getStatusColor(po.status)}>
                            {po.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>Total: ${po.total.toFixed(2)}</span>
                          <span>Items: {po.items.length}</span>
                          <span>Order Date: {new Date(po.orderDate).toLocaleDateString()}</span>
                          <span>Expected: {new Date(po.expectedDeliveryDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        <Button size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goods-receipts">
          <Card>
            <CardHeader>
              <CardTitle>Goods Receipts</CardTitle>
              <CardDescription>
                Process incoming deliveries and goods receipts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {goodsReceipts.map(gr => {
                  const po = purchaseOrders.find(p => p.id === gr.purchaseOrderId);
                  const branch = getBranch(gr.branchId);
                  const warehouse = getWarehouse(gr.warehouseId);
                  
                  return (
                    <div key={gr.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <h3 className="font-semibold">{gr.grNumber}</h3>
                            <p className="text-sm text-muted-foreground">
                              PO: {po?.poNumber} • {branch?.name} • {warehouse?.name}
                            </p>
                          </div>
                          <Badge className={getStatusColor(gr.status)}>
                            {gr.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>Items: {gr.items.length}</span>
                          <span>Received: {new Date(gr.receivedDate).toLocaleDateString()}</span>
                          <span>Received By: {gr.receivedBy}</span>
                          {gr.verifiedBy && <span>Verified By: {gr.verifiedBy}</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        <Button size="sm">
                          Process
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues">
          <Card>
            <CardHeader>
              <CardTitle>Issues & Consumption</CardTitle>
              <CardDescription>
                Track stock issues to departments, projects, and customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {issues.map(issue => {
                  const branch = getBranch(issue.branchId);
                  const warehouse = getWarehouse(issue.warehouseId);
                  
                  return (
                    <div key={issue.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <h3 className="font-semibold">{issue.issueNumber}</h3>
                            <p className="text-sm text-muted-foreground">
                              {issue.type} • {branch?.name} • {warehouse?.name}
                            </p>
                          </div>
                          <Badge className={getStatusColor(issue.status)}>
                            {issue.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>Type: {issue.type}</span>
                          <span>Department: {issue.department || 'N/A'}</span>
                          <span>Project: {issue.project || 'N/A'}</span>
                          <span>Total Cost: ${issue.totalCost.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        <Button size="sm">
                          Process
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfers">
          <Card>
            <CardHeader>
              <CardTitle>Transfer Orders</CardTitle>
              <CardDescription>
                Manage inter-warehouse and inter-branch transfers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transferOrders.map(transfer => {
                  const fromBranch = getBranch(transfer.fromBranchId);
                  const fromWarehouse = getWarehouse(transfer.fromWarehouseId);
                  const toBranch = getBranch(transfer.toBranchId);
                  const toWarehouse = getWarehouse(transfer.toWarehouseId);
                  
                  return (
                    <div key={transfer.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <h3 className="font-semibold">{transfer.transferNumber}</h3>
                            <p className="text-sm text-muted-foreground">
                              From: {fromBranch?.name} - {fromWarehouse?.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              To: {toBranch?.name} - {toWarehouse?.name}
                            </p>
                          </div>
                          <Badge className={getStatusColor(transfer.status)}>
                            {transfer.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>Items: {transfer.items.length}</span>
                          <span>Value: ${transfer.totalValue.toFixed(2)}</span>
                          <span>Date: {new Date(transfer.transferDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        <Button size="sm">
                          Track
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="returns">
          <Card>
            <CardHeader>
              <CardTitle>Returns & Refunds</CardTitle>
              <CardDescription>
                Manage purchase returns, sales returns, and damaged goods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {returns.map(ret => {
                  const branch = getBranch(ret.branchId);
                  const warehouse = getWarehouse(ret.warehouseId);
                  const supplier = ret.supplierId ? getSupplier(ret.supplierId) : null;
                  
                  return (
                    <div key={ret.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <h3 className="font-semibold">{ret.returnNumber}</h3>
                            <p className="text-sm text-muted-foreground">
                              {ret.type} • {branch?.name} • {warehouse?.name}
                            </p>
                          </div>
                          <Badge className={getStatusColor(ret.status)}>
                            {ret.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>Type: {ret.type}</span>
                          <span>Supplier: {supplier?.name || 'N/A'}</span>
                          <span>Value: ${ret.totalValue.toFixed(2)}</span>
                          <span>Date: {new Date(ret.returnDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        <Button size="sm">
                          Process
                        </Button>
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
