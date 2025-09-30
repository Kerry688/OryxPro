'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Store,
  Warehouse,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Settings,
  Building2,
  MapPin,
  Phone,
  Mail,
  Loader2,
  Activity,
  Target,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { Store as StoreType } from '@/lib/models/store';
import { Warehouse as WarehouseType } from '@/lib/models/warehouse';

interface DashboardData {
  stores: StoreType[];
  warehouses: WarehouseType[];
  metrics: {
    totalStores: number;
    activeStores: number;
    totalWarehouses: number;
    activeWarehouses: number;
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalInventoryValue: number;
    salesGrowth: number;
    orderGrowth: number;
    customerGrowth: number;
  };
  topPerformingStores: Array<{
    id: string;
    name: string;
    revenue: number;
    orders: number;
    growth: number;
  }>;
  lowStockAlerts: Array<{
    productId: string;
    productName: string;
    currentStock: number;
    minStock: number;
    warehouse: string;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'sale' | 'order' | 'inventory' | 'customer';
    description: string;
    timestamp: string;
    store: string;
  }>;
}

export default function StoreManagementDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch stores and warehouses data
      const [storesRes, warehousesRes] = await Promise.all([
        fetch('/api/stores'),
        fetch('/api/warehouses')
      ]);

      let stores: StoreType[] = [];
      let warehouses: WarehouseType[] = [];

      if (storesRes.ok) {
        stores = await storesRes.json();
      }

      if (warehousesRes.ok) {
        warehouses = await warehousesRes.json();
      }

      // Calculate metrics
      const metrics = {
        totalStores: stores.length,
        activeStores: stores.filter(s => s.isActive).length,
        totalWarehouses: warehouses.length,
        activeWarehouses: warehouses.filter(w => w.isActive).length,
        totalRevenue: stores.reduce((sum, store) => sum + (store.metrics?.totalSales || 0), 0),
        totalOrders: stores.reduce((sum, store) => sum + (store.metrics?.totalOrders || 0), 0),
        totalCustomers: stores.reduce((sum, store) => sum + (store.metrics?.customerCount || 0), 0),
        totalInventoryValue: warehouses.reduce((sum, warehouse) => sum + ((warehouse.currentCapacity || 0) * 100), 0), // Placeholder calculation
        salesGrowth: 12.5, // Placeholder
        orderGrowth: 8.3, // Placeholder
        customerGrowth: 15.2, // Placeholder
      };

      // Top performing stores
      const topPerformingStores = stores
        .filter(store => store.isActive)
        .sort((a, b) => (b.metrics?.totalSales || 0) - (a.metrics?.totalSales || 0))
        .slice(0, 5)
        .map(store => ({
          id: store._id?.toString() || '',
          name: store.name,
          revenue: store.metrics?.totalSales || 0,
          orders: store.metrics?.totalOrders || 0,
          growth: Math.random() * 30 - 10, // Placeholder growth
        }));

      // Low stock alerts (placeholder)
      const lowStockAlerts = [
        {
          productId: 'prod_001',
          productName: 'Premium Paper A4',
          currentStock: 50,
          minStock: 100,
          warehouse: 'NYC Main Warehouse',
        },
        {
          productId: 'prod_002',
          productName: 'Ink Cartridge Black',
          currentStock: 25,
          minStock: 50,
          warehouse: 'LAX Storage Facility',
        },
      ];

      // Recent activity (placeholder)
      const recentActivity = [
        {
          id: 'act_001',
          type: 'sale' as const,
          description: 'Large order completed',
          timestamp: '2024-01-15T10:30:00Z',
          store: 'NYC Retail Store',
        },
        {
          id: 'act_002',
          type: 'inventory' as const,
          description: 'Stock updated for Premium Paper',
          timestamp: '2024-01-15T09:15:00Z',
          store: 'NYC Main Warehouse',
        },
        {
          id: 'act_003',
          type: 'customer' as const,
          description: 'New customer registered',
          timestamp: '2024-01-15T08:45:00Z',
          store: 'LAX Retail Store',
        },
      ];

      setDashboardData({
        stores,
        warehouses,
        metrics,
        topPerformingStores,
        lowStockAlerts,
        recentActivity,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (value < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <BarChart3 className="h-4 w-4 text-gray-600" />;
  };

  const getTrendColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale': return <ShoppingCart className="h-4 w-4 text-green-600" />;
      case 'order': return <Package className="h-4 w-4 text-blue-600" />;
      case 'inventory': return <Warehouse className="h-4 w-4 text-orange-600" />;
      case 'customer': return <Users className="h-4 w-4 text-purple-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Unable to Load Dashboard</h3>
            <p className="text-muted-foreground text-center">
              There was an error loading the dashboard data. Please try again.
            </p>
            <Button onClick={fetchDashboardData} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Store Management Dashboard</h1>
          <p className="text-muted-foreground">Overview of your retail operations and performance</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/stores/analytics">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Analytics
            </Link>
          </Button>
          <Button asChild>
            <Link href="/stores">
              <Store className="mr-2 h-4 w-4" />
              Manage Stores
            </Link>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stores">Stores</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(dashboardData.metrics.totalRevenue)}</div>
                <div className="flex items-center gap-1 text-xs">
                  {getTrendIcon(dashboardData.metrics.salesGrowth)}
                  <span className={getTrendColor(dashboardData.metrics.salesGrowth)}>
                    {formatPercentage(dashboardData.metrics.salesGrowth)}
                  </span>
                  <span className="text-muted-foreground">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.metrics.totalOrders.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-xs">
                  {getTrendIcon(dashboardData.metrics.orderGrowth)}
                  <span className={getTrendColor(dashboardData.metrics.orderGrowth)}>
                    {formatPercentage(dashboardData.metrics.orderGrowth)}
                  </span>
                  <span className="text-muted-foreground">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.metrics.totalCustomers.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-xs">
                  {getTrendIcon(dashboardData.metrics.customerGrowth)}
                  <span className={getTrendColor(dashboardData.metrics.customerGrowth)}>
                    {formatPercentage(dashboardData.metrics.customerGrowth)}
                  </span>
                  <span className="text-muted-foreground">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Stores</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.metrics.activeStores}</div>
                <p className="text-xs text-muted-foreground">
                  of {dashboardData.metrics.totalStores} total stores
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performing Stores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Top Performing Stores
                </CardTitle>
                <CardDescription>
                  Stores ranked by revenue performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.topPerformingStores.map((store, index) => (
                    <div key={store.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={index < 3 ? 'default' : 'outline'} className="w-8 h-8 flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <div>
                          <h4 className="font-medium">{store.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {store.orders} orders
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(store.revenue)}</div>
                        <div className={`text-sm flex items-center gap-1 ${getTrendColor(store.growth)}`}>
                          {getTrendIcon(store.growth)}
                          {formatPercentage(store.growth)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest updates from your stores and warehouses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.store} • {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stores" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardData.stores.map(store => (
              <Card key={store._id?.toString()}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Store className="h-5 w-5" />
                      <CardTitle className="text-lg">{store.name}</CardTitle>
                    </div>
                    <Badge variant={store.isActive ? 'default' : 'secondary'}>
                      {store.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <CardDescription>
                    {store.code} • {store.type}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {store.address.city}, {store.address.state}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{formatCurrency(store.metrics?.totalSales || 0)}</div>
                      <div className="text-sm text-muted-foreground">Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{store.metrics?.totalOrders || 0}</div>
                      <div className="text-sm text-muted-foreground">Orders</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button asChild size="sm" className="flex-1">
                      <Link href={`/stores/${store._id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/stores/${store._id}/analytics`}>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Analytics
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="warehouses" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardData.warehouses.map(warehouse => {
              const utilization = ((warehouse.currentCapacity || 0) / warehouse.capacity) * 100;
              return (
                <Card key={warehouse._id?.toString()}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Warehouse className="h-5 w-5" />
                        <CardTitle className="text-lg">{warehouse.name}</CardTitle>
                      </div>
                      <Badge variant={warehouse.isActive ? 'default' : 'secondary'}>
                        {warehouse.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <CardDescription>
                      {warehouse.code} • {warehouse.type.replace('_', ' ')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {warehouse.city}, {warehouse.state}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Capacity Utilization</span>
                        <span>{utilization.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            utilization >= 90 ? 'bg-red-600' :
                            utilization >= 75 ? 'bg-orange-600' :
                            utilization >= 50 ? 'bg-yellow-600' : 'bg-green-600'
                          }`}
                          style={{ width: `${Math.min(utilization, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button asChild size="sm" className="flex-1">
                        <Link href={`/warehouses/${warehouse._id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="flex-1">
                        <Link href={`/warehouses/${warehouse._id}/inventory`}>
                          <Package className="mr-2 h-4 w-4" />
                          Inventory
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Low Stock Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Low Stock Alerts
                </CardTitle>
                <CardDescription>
                  Products that need immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.lowStockAlerts.map((alert) => (
                    <div key={alert.productId} className="flex items-center justify-between p-3 border rounded-lg border-orange-200 bg-orange-50">
                      <div>
                        <h4 className="font-medium">{alert.productName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {alert.warehouse}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-orange-600">
                          {alert.currentStock} / {alert.minStock}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {((alert.currentStock / alert.minStock) * 100).toFixed(0)}% of minimum
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  System Status
                </CardTitle>
                <CardDescription>
                  Overall system health and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg border-green-200 bg-green-50">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">All Systems Operational</span>
                    </div>
                    <Badge variant="outline" className="border-green-600 text-green-600">
                      Healthy
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Stores</span>
                    </div>
                    <Badge variant="outline">
                      {dashboardData.metrics.activeStores}/{dashboardData.metrics.totalStores} Active
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Warehouse className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">Warehouses</span>
                    </div>
                    <Badge variant="outline">
                      {dashboardData.metrics.activeWarehouses}/{dashboardData.metrics.totalWarehouses} Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
