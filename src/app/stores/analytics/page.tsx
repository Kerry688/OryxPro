'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Loader2,
  Eye,
  Store,
  Clock,
  Target,
  Award,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Store as StoreType } from '@/lib/models/store';

interface AnalyticsData {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    totalCustomers: number;
    inventoryValue: number;
    stockTurnover: number;
  };
  trends: {
    salesGrowth: number;
    orderGrowth: number;
    customerGrowth: number;
    inventoryGrowth: number;
  };
  topCategories: Array<{
    category: string;
    revenue: number;
    orders: number;
  }>;
  peakHours: Array<{
    hour: number;
    sales: number;
  }>;
  busiestDays: Array<{
    day: string;
    sales: number;
  }>;
  insights: string[];
  recommendations: string[];
  storePerformance: Array<{
    storeId: string;
    storeName: string;
    revenue: number;
    orders: number;
    customers: number;
    growth: number;
  }>;
}

export default function StoreAnalyticsPage() {
  const [stores, setStores] = useState<StoreType[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('monthly');
  const [selectedMetric, setSelectedMetric] = useState<string>('revenue');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    if (stores.length > 0) {
      fetchAnalytics();
    }
  }, [selectedStore, selectedPeriod, stores]);

  const fetchStores = async () => {
    try {
      const response = await fetch('/api/stores');
      if (response.ok) {
        const data = await response.json();
        setStores(data);
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        period: selectedPeriod,
        ...(selectedStore !== 'all' && { storeId: selectedStore })
      });

      const response = await fetch(`/api/stores/analytics?${params}`);
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      } else {
        throw new Error('Failed to fetch analytics');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
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

  const exportReport = () => {
    // TODO: Implement report export functionality
    console.log('Exporting report...');
  };

  if (isLoading && !analyticsData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Store Analytics</h1>
          <p className="text-muted-foreground">Comprehensive analytics and insights for your stores</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportReport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Analytics Filters</CardTitle>
          <CardDescription>
            Select store and time period for detailed analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Store</label>
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger>
                  <SelectValue placeholder="Select store" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stores</SelectItem>
                  {stores.map(store => (
                    <SelectItem key={store._id?.toString()} value={store._id?.toString() || ''}>
                      {store.name} ({store.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Period</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Metric</label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger>
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="orders">Orders</SelectItem>
                  <SelectItem value="customers">Customers</SelectItem>
                  <SelectItem value="inventory">Inventory</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={fetchAnalytics} variant="outline" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <BarChart3 className="mr-2 h-4 w-4" />
                )}
                Refresh Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {!analyticsData ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Analytics Data</h3>
            <p className="text-muted-foreground text-center">
              Analytics data will appear here once stores have transaction history.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Store Performance</TabsTrigger>
            <TabsTrigger value="trends">Trends & Insights</TabsTrigger>
            <TabsTrigger value="comparison">Store Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(analyticsData.summary.totalRevenue)}</div>
                  <div className="flex items-center gap-1 text-xs">
                    {getTrendIcon(analyticsData.trends.salesGrowth)}
                    <span className={getTrendColor(analyticsData.trends.salesGrowth)}>
                      {formatPercentage(analyticsData.trends.salesGrowth)}
                    </span>
                    <span className="text-muted-foreground">from last period</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.summary.totalOrders.toLocaleString()}</div>
                  <div className="flex items-center gap-1 text-xs">
                    {getTrendIcon(analyticsData.trends.orderGrowth)}
                    <span className={getTrendColor(analyticsData.trends.orderGrowth)}>
                      {formatPercentage(analyticsData.trends.orderGrowth)}
                    </span>
                    <span className="text-muted-foreground">from last period</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(analyticsData.summary.averageOrderValue)}</div>
                  <p className="text-xs text-muted-foreground">
                    Per transaction
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.summary.totalCustomers.toLocaleString()}</div>
                  <div className="flex items-center gap-1 text-xs">
                    {getTrendIcon(analyticsData.trends.customerGrowth)}
                    <span className={getTrendColor(analyticsData.trends.customerGrowth)}>
                      {formatPercentage(analyticsData.trends.customerGrowth)}
                    </span>
                    <span className="text-muted-foreground">from last period</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Top Categories
                  </CardTitle>
                  <CardDescription>
                    Revenue by product category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.topCategories.map((category, index) => (
                      <div key={category.category} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">#{index + 1}</Badge>
                          <span className="font-medium">{category.category}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(category.revenue)}</div>
                          <div className="text-sm text-muted-foreground">{category.orders} orders</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Peak Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Peak Hours
                  </CardTitle>
                  <CardDescription>
                    Sales performance by hour
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.peakHours.map((hour) => (
                      <div key={hour.hour} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{hour.hour}:00</Badge>
                          <span className="text-sm">
                            {hour.hour < 12 ? 'AM' : 'PM'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ 
                                width: `${(hour.sales / Math.max(...analyticsData.peakHours.map(h => h.sales))) * 100}%` 
                              }}
                            ></div>
                          </div>
                          <span className="font-semibold">{formatCurrency(hour.sales)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Busiest Days */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Busiest Days
                </CardTitle>
                <CardDescription>
                  Sales performance by day of week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
                  {analyticsData.busiestDays.map((day) => (
                    <div key={day.day} className="text-center">
                      <div className="text-sm font-medium mb-2">{day.day}</div>
                      <div className="text-2xl font-bold mb-1">{formatCurrency(day.sales)}</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ 
                            width: `${(day.sales / Math.max(...analyticsData.busiestDays.map(d => d.sales))) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Store Performance Ranking
                </CardTitle>
                <CardDescription>
                  Performance comparison across all stores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.storePerformance?.map((store, index) => (
                    <div key={store.storeId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Badge variant={index < 3 ? 'default' : 'outline'} className="w-8 h-8 flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <div>
                          <h4 className="font-semibold">{store.storeName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {store.orders} orders • {store.customers} customers
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
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Key Insights
                  </CardTitle>
                  <CardDescription>
                    Important findings from your data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.insights.map((insight, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                        <Badge variant="outline" className="mt-0.5">#{index + 1}</Badge>
                        <span className="text-sm">{insight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Recommendations
                  </CardTitle>
                  <CardDescription>
                    Actionable suggestions to improve performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                        <Badge variant="outline" className="mt-0.5">#{index + 1}</Badge>
                        <span className="text-sm">{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Store Comparison
                </CardTitle>
                <CardDescription>
                  Compare performance metrics across stores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {stores.map(store => (
                    <div key={store._id?.toString()} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold">{store.name}</h4>
                          <p className="text-sm text-muted-foreground">{store.code} • {store.type}</p>
                        </div>
                        <Badge variant={store.isActive ? 'default' : 'secondary'}>
                          {store.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{formatCurrency(store.metrics?.totalSales || 0)}</div>
                          <div className="text-sm text-muted-foreground">Total Sales</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{store.metrics?.totalOrders || 0}</div>
                          <div className="text-sm text-muted-foreground">Total Orders</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{formatCurrency(store.metrics?.averageOrderValue || 0)}</div>
                          <div className="text-sm text-muted-foreground">Avg Order Value</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{store.metrics?.customerCount || 0}</div>
                          <div className="text-sm text-muted-foreground">Customers</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
