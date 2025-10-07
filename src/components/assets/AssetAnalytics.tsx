'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Wrench,
  Calendar,
  AlertTriangle,
  Download,
  RefreshCw
} from 'lucide-react';

export function AssetAnalytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Asset Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive analytics and reporting for asset management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Asset Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,456,789</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +8.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +12 new assets this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Cost</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,678</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              -3.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Asset Utilization</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +2.3% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Asset Distribution by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Distribution by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">IT Equipment</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">456 assets</div>
                  <div className="text-xs text-muted-foreground">37%</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '37%' }}></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Furniture</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">234 assets</div>
                  <div className="text-xs text-muted-foreground">19%</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '19%' }}></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium">Vehicles</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">123 assets</div>
                  <div className="text-xs text-muted-foreground">10%</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '10%' }}></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium">Machinery</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">89 assets</div>
                  <div className="text-xs text-muted-foreground">7%</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '7%' }}></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-sm font-medium">Other</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">332 assets</div>
                  <div className="text-xs text-muted-foreground">27%</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gray-500 h-2 rounded-full" style={{ width: '27%' }}></div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Asset Status Distribution</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Active</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">1,089 (88%)</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Under Maintenance</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">45 (4%)</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Retired</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">67 (5%)</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Disposed</span>
                  </div>
                  <Badge className="bg-red-100 text-red-800">33 (3%)</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">94%</div>
              <div className="text-sm text-muted-foreground">Preventive Maintenance Compliance</div>
              <div className="text-xs text-green-600 mt-1">+2% from last month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">2.3 days</div>
              <div className="text-sm text-muted-foreground">Average Repair Time</div>
              <div className="text-xs text-blue-600 mt-1">-0.5 days from last month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">$89</div>
              <div className="text-sm text-muted-foreground">Average Maintenance Cost per Asset</div>
              <div className="text-xs text-orange-600 mt-1">+$12 from last month</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Assets */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Detailed performance analytics will appear here</p>
            <p className="text-sm">Asset utilization, maintenance costs, and performance metrics</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
