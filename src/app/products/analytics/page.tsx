'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Lightbulb
} from 'lucide-react';
import { ProductType } from '@/lib/models/product';

interface ProductAnalytics {
  summary: {
    totalProducts: number;
    activeProducts: number;
    lowStockProducts: number;
    outOfStockProducts: number;
    totalRevenue: number;
    averageProductValue: number;
  };
  trends: {
    salesGrowth: number;
    orderGrowth: number;
    inventoryGrowth: number;
    revenueGrowth: number;
  };
  topSellingProducts: any[];
  categoryBreakdown: Array<{ _id: string; count: number }>;
  typeBreakdown: Array<{ _id: ProductType; count: number }>;
  insights: string[];
  recommendations: string[];
}

export default function ProductAnalyticsPage() {
  const [analytics, setAnalytics] = useState<ProductAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedType, setSelectedType] = useState<ProductType | 'all'>('all');

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod, selectedType]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('period', selectedPeriod);
      if (selectedType !== 'all') {
        params.append('type', selectedType);
      }
      
      const response = await fetch(`/api/products/analytics?${params}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (value < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  const getTrendColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const formatPercentage = (value: number) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your product portfolio performance
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={(value) => setSelectedType(value as ProductType | 'all')}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="sales_product">Sales Products</SelectItem>
              <SelectItem value="print_item">Print Items</SelectItem>
              <SelectItem value="service">Services</SelectItem>
              <SelectItem value="raw_material">Raw Materials</SelectItem>
              <SelectItem value="kit_bundle">Kits & Bundles</SelectItem>
              <SelectItem value="asset">Assets</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{analytics.summary.totalProducts}</p>
                <p className="text-xs text-muted-foreground">
                  {analytics.summary.activeProducts} active
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
                <p className="text-2xl font-bold">${analytics.summary.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">
                  ${analytics.summary.averageProductValue.toFixed(2)} avg value
                </p>
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
                <p className="text-2xl font-bold">{analytics.summary.lowStockProducts}</p>
                <p className="text-xs text-muted-foreground">
                  {analytics.summary.outOfStockProducts} out of stock
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
                  {Math.round(((analytics.summary.totalProducts - analytics.summary.lowStockProducts - analytics.summary.outOfStockProducts) / analytics.summary.totalProducts) * 100)}%
                </p>
                <p className="text-xs text-muted-foreground">healthy stock</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Performance Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
              {getTrendIcon(analytics.trends.salesGrowth)}
              <div>
                <p className="text-sm font-medium">Sales Growth</p>
                <p className={`text-lg font-bold ${getTrendColor(analytics.trends.salesGrowth)}`}>
                  {formatPercentage(analytics.trends.salesGrowth)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
              {getTrendIcon(analytics.trends.orderGrowth)}
              <div>
                <p className="text-sm font-medium">Order Growth</p>
                <p className={`text-lg font-bold ${getTrendColor(analytics.trends.orderGrowth)}`}>
                  {formatPercentage(analytics.trends.orderGrowth)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
              {getTrendIcon(analytics.trends.inventoryGrowth)}
              <div>
                <p className="text-sm font-medium">Inventory Growth</p>
                <p className={`text-lg font-bold ${getTrendColor(analytics.trends.inventoryGrowth)}`}>
                  {formatPercentage(analytics.trends.inventoryGrowth)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
              {getTrendIcon(analytics.trends.revenueGrowth)}
              <div>
                <p className="text-sm font-medium">Revenue Growth</p>
                <p className={`text-lg font-bold ${getTrendColor(analytics.trends.revenueGrowth)}`}>
                  {formatPercentage(analytics.trends.revenueGrowth)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Top Selling Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topSellingProducts.slice(0, 5).map((product, index) => (
                <div key={product._id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-lg">#{index + 1}</span>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${product.price?.toFixed(2) || '0.00'}</p>
                    <p className="text-sm text-muted-foreground">{product.stock || 0} in stock</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Category Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.categoryBreakdown.slice(0, 5).map((category, index) => {
                const percentage = (category.count / analytics.summary.totalProducts) * 100;
                return (
                  <div key={category._id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{category._id}</span>
                      <Badge variant="secondary">{category.count}</Badge>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Type Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Product Type Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.typeBreakdown.map((type) => {
              const percentage = (type.count / analytics.summary.totalProducts) * 100;
              return (
                <div key={type._id} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize">
                      {type._id.replace('_', ' ')}
                    </span>
                    <Badge variant="outline">{type.count}</Badge>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {percentage.toFixed(1)}% of total
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="h-5 w-5 mr-2" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.insights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
