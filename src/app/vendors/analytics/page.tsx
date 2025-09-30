'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  TrendingUp,
  TrendingDown,
  Star,
  Clock,
  Truck,
  DollarSign,
  Package,
  Building2,
  Wrench,
  Award,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Download,
  Filter,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { vendors, vendorTransactions, vendorPayments } from '@/lib/data';
import type { Vendor, VendorType } from '@/lib/data';

export default function VendorAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedVendor, setSelectedVendor] = useState<string>('all');

  // Helper functions
  const getVendorInitials = (vendor: Vendor) => {
    return vendor.companyName.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
  };

  const getTypeIcon = (type: VendorType) => {
    switch (type) {
      case 'supplier':
        return <Package className="h-4 w-4" />;
      case 'service_provider':
        return <Wrench className="h-4 w-4" />;
      case 'contractor':
        return <Truck className="h-4 w-4" />;
      case 'distributor':
        return <Building2 className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: VendorType) => {
    switch (type) {
      case 'supplier':
        return 'bg-blue-100 text-blue-800';
      case 'service_provider':
        return 'bg-green-100 text-green-800';
      case 'contractor':
        return 'bg-purple-100 text-purple-800';
      case 'distributor':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate overall metrics
  const totalVendors = vendors.length;
  const activeVendors = vendors.filter(v => v.status === 'active').length;
  const totalPurchased = vendors.reduce((sum, v) => sum + v.totalPurchased, 0);
  const totalPaid = vendors.reduce((sum, v) => sum + v.totalPaid, 0);
  const averageQualityRating = vendors.reduce((sum, v) => sum + v.qualityRating, 0) / vendors.length;
  const averageOnTimeDelivery = vendors.reduce((sum, v) => sum + v.onTimeDeliveryRate, 0) / vendors.length;
  const averageResponseTime = vendors.reduce((sum, v) => sum + v.responseTime, 0) / vendors.length;

  // Top performers
  const topQualityVendors = vendors
    .sort((a, b) => b.qualityRating - a.qualityRating)
    .slice(0, 5);

  const topDeliveryVendors = vendors
    .sort((a, b) => b.onTimeDeliveryRate - a.onTimeDeliveryRate)
    .slice(0, 5);

  const topVolumeVendors = vendors
    .sort((a, b) => b.totalPurchased - a.totalPurchased)
    .slice(0, 5);

  // Vendor type distribution
  const vendorTypeStats = ['supplier', 'service_provider', 'contractor', 'distributor'].map(type => {
    const count = vendors.filter(v => v.type === type).length;
    const percentage = (count / vendors.length) * 100;
    const totalPurchased = vendors
      .filter(v => v.type === type)
      .reduce((sum, v) => sum + v.totalPurchased, 0);
    
    return {
      type: type as VendorType,
      count,
      percentage,
      totalPurchased,
      averageQuality: vendors
        .filter(v => v.type === type)
        .reduce((sum, v) => sum + v.qualityRating, 0) / count || 0
    };
  });

  // Performance metrics by vendor
  const vendorPerformanceMetrics = vendors.map(vendor => ({
    ...vendor,
    paymentTimeliness: 95, // Mock data - in real app, calculate from actual payment dates
    orderAccuracy: 98, // Mock data - in real app, calculate from order accuracy
    communicationScore: 4.5, // Mock data - in real app, calculate from communication ratings
    overallScore: (vendor.qualityRating + vendor.onTimeDeliveryRate / 20 + 4.5) / 3 // Combined score
  }));

  // Risk assessment
  const riskVendors = vendors.filter(vendor => {
    const riskScore = 
      (vendor.currentBalance > vendor.creditLimit * 0.8 ? 3 : 0) + // High balance
      (vendor.qualityRating < 3.5 ? 2 : 0) + // Low quality
      (vendor.onTimeDeliveryRate < 85 ? 2 : 0) + // Poor delivery
      (vendor.responseTime > 24 ? 1 : 0); // Slow response
    
    return riskScore >= 3;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Vendor Analytics</h1>
          <p className="text-muted-foreground">Comprehensive vendor performance and analytics</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVendors}</div>
            <p className="text-xs text-muted-foreground">
              {activeVendors} active vendors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchased</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPurchased.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All-time purchases
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Quality Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageQualityRating.toFixed(1)}/5</div>
            <p className="text-xs text-muted-foreground">
              Overall vendor quality
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg On-Time Delivery</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageOnTimeDelivery.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Delivery performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vendor Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Vendor Type Distribution</CardTitle>
                <CardDescription>
                  Breakdown of vendors by type and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendorTypeStats.map(stat => (
                    <div key={stat.type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={getTypeColor(stat.type)}>
                            {getTypeIcon(stat.type)}
                            {stat.type.replace('_', ' ')}
                          </Badge>
                          <span className="text-sm font-medium">{stat.count} vendors</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{stat.percentage.toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">
                            ${stat.totalPurchased.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${stat.percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3" />
                        Avg Quality: {stat.averageQuality.toFixed(1)}/5
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Vendors */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Vendors</CardTitle>
                <CardDescription>
                  Vendors with highest overall performance scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendorPerformanceMetrics
                    .sort((a, b) => b.overallScore - a.overallScore)
                    .slice(0, 5)
                    .map((vendor, index) => (
                      <div key={vendor.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-bold">
                            {index + 1}
                          </div>
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {getVendorInitials(vendor)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{vendor.companyName}</div>
                            <div className="text-sm text-muted-foreground">
                              {vendor.type.replace('_', ' ')}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{vendor.overallScore.toFixed(1)}/5</div>
                          <div className="text-xs text-muted-foreground">
                            Overall Score
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quality vs Delivery Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Quality vs Delivery Performance</CardTitle>
              <CardDescription>
                Scatter plot of vendor quality ratings vs on-time delivery rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vendors.map(vendor => (
                  <div key={vendor.id} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {getVendorInitials(vendor)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{vendor.companyName}</div>
                        <div className="text-xs text-muted-foreground">
                          {vendor.type.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Quality:</span>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < vendor.qualityRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                          <span className="ml-1">{vendor.qualityRating.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Delivery:</span>
                        <span>{vendor.onTimeDeliveryRate.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Response:</span>
                        <span>{vendor.responseTime}h</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quality Leaders */}
            <Card>
              <CardHeader>
                <CardTitle>Quality Leaders</CardTitle>
                <CardDescription>
                  Vendors with highest quality ratings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topQualityVendors.map((vendor, index) => (
                    <div key={vendor.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-bold">
                          {index + 1}
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getVendorInitials(vendor)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{vendor.companyName}</div>
                          <div className="text-sm text-muted-foreground">
                            {vendor.type.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < vendor.qualityRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {vendor.qualityRating.toFixed(1)}/5
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Champions */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Champions</CardTitle>
                <CardDescription>
                  Vendors with best on-time delivery rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topDeliveryVendors.map((vendor, index) => (
                    <div key={vendor.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-bold">
                            {index + 1}
                          </div>
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {getVendorInitials(vendor)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{vendor.companyName}</div>
                            <div className="text-sm text-muted-foreground">
                              {vendor.type.replace('_', ' ')}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{vendor.onTimeDeliveryRate.toFixed(1)}%</div>
                          <div className="text-sm text-muted-foreground">
                            on-time
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${vendor.onTimeDeliveryRate}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Response Time Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Response Time Analysis</CardTitle>
              <CardDescription>
                Average response times by vendor type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendorTypeStats.map(stat => {
                  const avgResponseTime = vendors
                    .filter(v => v.type === stat.type)
                    .reduce((sum, v) => sum + v.responseTime, 0) / stat.count;
                  
                  return (
                    <div key={stat.type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={getTypeColor(stat.type)}>
                            {getTypeIcon(stat.type)}
                            {stat.type.replace('_', ' ')}
                          </Badge>
                          <span className="text-sm">{stat.count} vendors</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{avgResponseTime.toFixed(1)}h</div>
                          <div className="text-xs text-muted-foreground">
                            avg response
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${avgResponseTime < 4 ? 'bg-green-500' : avgResponseTime < 8 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(100, (avgResponseTime / 24) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Volume Vendors */}
            <Card>
              <CardHeader>
                <CardTitle>Top Volume Vendors</CardTitle>
                <CardDescription>
                  Vendors with highest purchase volumes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topVolumeVendors.map((vendor, index) => (
                    <div key={vendor.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-bold">
                          {index + 1}
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getVendorInitials(vendor)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{vendor.companyName}</div>
                          <div className="text-sm text-muted-foreground">
                            {vendor.totalOrders} orders
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          ${vendor.totalPurchased.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ${vendor.averageOrderValue.toLocaleString()} avg
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Credit Utilization */}
            <Card>
              <CardHeader>
                <CardTitle>Credit Utilization</CardTitle>
                <CardDescription>
                  Credit limit usage by vendor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendors
                    .sort((a, b) => (b.currentBalance / b.creditLimit) - (a.currentBalance / a.creditLimit))
                    .slice(0, 5)
                    .map(vendor => {
                      const utilization = (vendor.currentBalance / vendor.creditLimit) * 100;
                      
                      return (
                        <div key={vendor.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {getVendorInitials(vendor)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm">{vendor.companyName}</div>
                                <div className="text-xs text-muted-foreground">
                                  ${vendor.currentBalance.toLocaleString()} / ${vendor.creditLimit.toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{utilization.toFixed(1)}%</div>
                              <div className="text-xs text-muted-foreground">
                                utilized
                              </div>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${utilization > 80 ? 'bg-red-500' : utilization > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                              style={{ width: `${Math.min(100, utilization)}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
                <CardDescription>
                  Vendors identified as high risk
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskVendors.length > 0 ? (
                    riskVendors.map(vendor => (
                      <div key={vendor.id} className="p-4 border border-red-200 rounded-lg bg-red-50">
                        <div className="flex items-center gap-3 mb-2">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                          <div>
                            <div className="font-medium text-red-900">{vendor.companyName}</div>
                            <div className="text-sm text-red-700">
                              {vendor.vendorNumber}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1 text-sm text-red-700">
                          {vendor.currentBalance > vendor.creditLimit * 0.8 && (
                            <div>• High credit utilization ({((vendor.currentBalance / vendor.creditLimit) * 100).toFixed(1)}%)</div>
                          )}
                          {vendor.qualityRating < 3.5 && (
                            <div>• Low quality rating ({vendor.qualityRating.toFixed(1)}/5)</div>
                          )}
                          {vendor.onTimeDeliveryRate < 85 && (
                            <div>• Poor delivery performance ({vendor.onTimeDeliveryRate.toFixed(1)}%)</div>
                          )}
                          {vendor.responseTime > 24 && (
                            <div>• Slow response time ({vendor.responseTime}h)</div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <p className="text-muted-foreground">No high-risk vendors identified</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>
                  Key performance indicators over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Quality Rating</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600">+0.2</div>
                      <div className="text-xs text-green-600">vs last period</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">On-Time Delivery</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-blue-600">+2.1%</div>
                      <div className="text-xs text-blue-600">vs last period</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">Response Time</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-purple-600">-0.5h</div>
                      <div className="text-xs text-purple-600">vs last period</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium">Purchase Volume</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-orange-600">+15.3%</div>
                      <div className="text-xs text-orange-600">vs last period</div>
                    </div>
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
