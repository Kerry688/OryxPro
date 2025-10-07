'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Fuel,
  Car,
  Users,
  Wrench,
  Download,
  Calendar,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Circle,
  Target,
  PieChart,
  Activity
} from 'lucide-react';

// Mock analytics data
const mockAnalyticsData = {
  totalFleetCost: 45678,
  fuelEfficiency: 24.5,
  utilizationRate: 87,
  maintenanceCompliance: 94,
  costBreakdown: [
    { category: 'Fuel Costs', amount: 15680, percentage: 45, color: 'bg-blue-500' },
    { category: 'Maintenance', amount: 8450, percentage: 24, color: 'bg-orange-500' },
    { category: 'Insurance', amount: 5230, percentage: 15, color: 'bg-green-500' },
    { category: 'Other', amount: 5318, percentage: 16, color: 'bg-purple-500' }
  ],
  performanceMetrics: {
    costPerMile: 0.52,
    averageTripDuration: 2.3,
    totalTripsThisMonth: 156,
    averageFuelConsumption: 8.5,
    totalDistance: 2450,
    activeVehicles: 18,
    driversOnDuty: 12
  },
  vehiclePerformance: [
    { vehicle: 'Toyota Camry - ABC123', efficiency: 26.2, cost: 0.48, utilization: 92, trips: 45 },
    { vehicle: 'Ford Transit - DEF456', efficiency: 18.5, cost: 0.65, utilization: 85, trips: 38 },
    { vehicle: 'Nissan Patrol - GHI789', efficiency: 15.8, cost: 0.72, utilization: 78, trips: 32 },
    { vehicle: 'Honda Civic - JKL012', efficiency: 28.1, cost: 0.42, utilization: 95, trips: 41 }
  ],
  fuelAnalytics: {
    totalFuelConsumed: 850,
    averageConsumption: 8.5,
    fuelCost: 15680,
    efficiencyTrend: '+2.1%',
    topConsumers: [
      { vehicle: 'Ford Transit - DEF456', consumption: 12.5, cost: 2340 },
      { vehicle: 'Nissan Patrol - GHI789', consumption: 11.8, cost: 2210 },
      { vehicle: 'Toyota Camry - ABC123', consumption: 9.2, cost: 1720 },
      { vehicle: 'Honda Civic - JKL012', consumption: 8.1, cost: 1515 }
    ]
  },
  maintenanceAnalytics: {
    totalMaintenanceCost: 8450,
    averageCostPerVehicle: 469,
    preventiveMaintenance: 6800,
    correctiveMaintenance: 1650,
    complianceRate: 94,
    upcomingServices: 8,
    overdueServices: 2
  }
};

export function FleetAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedVehicle, setSelectedVehicle] = useState('all');
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const data = mockAnalyticsData;

  const getTrendIcon = (trend: string) => {
    return trend.startsWith('+') ? 
      <TrendingUp className="h-3 w-3 text-green-500" /> : 
      <TrendingDown className="h-3 w-3 text-red-500" />;
  };

  const getTrendColor = (trend: string) => {
    return trend.startsWith('+') ? 'text-green-500' : 'text-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Fleet Analytics</h2>
          <p className="text-muted-foreground">Comprehensive fleet performance and cost analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setIsExportDialogOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fleet Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.totalFleetCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
              -5.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fuel Efficiency</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.fuelEfficiency} MPG</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +2.1% improvement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.utilizationRate}%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +3.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Compliance</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.maintenanceCompliance}%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +1.8% improvement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Cost Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.costBreakdown.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                      <span className="text-sm font-medium">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">${item.amount.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${item.color} h-2 rounded-full transition-all duration-300`} 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">${data.performanceMetrics.costPerMile}</div>
                <div className="text-sm text-muted-foreground">Cost per Mile</div>
                <div className="text-xs text-green-600 mt-1">-$0.03 from last month</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{data.performanceMetrics.averageTripDuration} hrs</div>
                <div className="text-sm text-muted-foreground">Avg Trip Duration</div>
                <div className="text-xs text-green-600 mt-1">-0.2 hrs improvement</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{data.performanceMetrics.totalTripsThisMonth}</div>
                <div className="text-sm text-muted-foreground">Total Trips</div>
                <div className="text-xs text-blue-600 mt-1">+12 from last month</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{data.performanceMetrics.totalDistance} km</div>
                <div className="text-sm text-muted-foreground">Total Distance</div>
                <div className="text-xs text-green-600 mt-1">+8% increase</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Vehicle Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium">Vehicle</th>
                  <th className="text-left py-3 font-medium">Efficiency</th>
                  <th className="text-left py-3 font-medium">Cost/Mile</th>
                  <th className="text-left py-3 font-medium">Utilization</th>
                  <th className="text-left py-3 font-medium">Trips</th>
                  <th className="text-left py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.vehiclePerformance.map((vehicle, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3">
                      <div className="font-medium">{vehicle.vehicle}</div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{vehicle.efficiency} MPG</span>
                        {vehicle.efficiency > 25 ? (
                          <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                        ) : vehicle.efficiency > 20 ? (
                          <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">Poor</Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="font-medium">${vehicle.cost}</div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{vehicle.utilization}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${vehicle.utilization > 90 ? 'bg-green-500' : vehicle.utilization > 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${vehicle.utilization}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="font-medium">{vehicle.trips}</div>
                    </td>
                    <td className="py-3">
                      <Badge className={vehicle.utilization > 90 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {vehicle.utilization > 90 ? 'Optimal' : 'Good'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Fuel Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fuel className="h-5 w-5" />
            Fuel Consumption Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{data.fuelAnalytics.totalFuelConsumed}L</div>
              <div className="text-sm text-muted-foreground">Total Fuel Consumed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{data.fuelAnalytics.averageConsumption} L/100km</div>
              <div className="text-sm text-muted-foreground">Average Consumption</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">${data.fuelAnalytics.fuelCost.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Fuel Cost</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 flex items-center justify-center gap-1">
                {data.fuelAnalytics.efficiencyTrend}
                {getTrendIcon(data.fuelAnalytics.efficiencyTrend)}
              </div>
              <div className="text-sm text-muted-foreground">Efficiency Trend</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Top Fuel Consumers</h4>
            <div className="space-y-3">
              {data.fuelAnalytics.topConsumers.map((vehicle, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{vehicle.vehicle}</div>
                    <div className="text-sm text-muted-foreground">{vehicle.consumption} L/100km</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${vehicle.cost.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Fuel cost</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Maintenance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">${data.maintenanceAnalytics.totalMaintenanceCost.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Maintenance Cost</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">${data.maintenanceAnalytics.averageCostPerVehicle}</div>
              <div className="text-sm text-muted-foreground">Avg Cost per Vehicle</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{data.maintenanceAnalytics.complianceRate}%</div>
              <div className="text-sm text-muted-foreground">Compliance Rate</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-4">Maintenance Breakdown</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Preventive Maintenance</span>
                  </div>
                  <div className="font-medium">${data.maintenanceAnalytics.preventiveMaintenance.toLocaleString()}</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span className="font-medium">Corrective Maintenance</span>
                  </div>
                  <div className="font-medium">${data.maintenanceAnalytics.correctiveMaintenance.toLocaleString()}</div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Service Status</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium">Upcoming Services</span>
                  </div>
                  <div className="font-medium">{data.maintenanceAnalytics.upcomingServices}</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="font-medium">Overdue Services</span>
                  </div>
                  <div className="font-medium">{data.maintenanceAnalytics.overdueServices}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Report Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Export Fleet Analytics Report</DialogTitle>
            <DialogDescription>
              Choose the format and date range for your analytics report
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="format">Export Format</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  <SelectItem value="csv">CSV Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="dateRange">Date Range</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="quarter">Last 3 Months</SelectItem>
                  <SelectItem value="year">Last 12 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="includeCharts">Include Charts</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select charts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Charts</SelectItem>
                  <SelectItem value="summary">Summary Only</SelectItem>
                  <SelectItem value="detailed">Detailed Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsExportDialogOpen(false)}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}