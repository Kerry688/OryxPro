'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Plus, 
  Download,
  Upload,
  Calendar,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Activity,
  Target,
  PieChart,
  LineChart,
  FileText,
  Settings,
  AlertTriangle,
  CheckCircle,
  Package,
  Wrench,
  Building,
  MapPin,
  User,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { 
  AssetReport,
  DepreciationSchedule,
  MaintenanceCostReport,
  ROIAnalysis,
  UtilizationAnalysis,
  AssetReportType,
  AssetExportFormat,
  AssetReportSummary,
  CategorySummary,
  DepartmentSummary,
  LocationSummary,
  StatusSummary,
  ConditionSummary
} from '@/lib/models/asset';

// Mock data for reports
const mockAssetRegister: AssetReport = {
  id: '1',
  reportName: 'Complete Asset Register',
  reportType: AssetReportType.ASSET_REGISTER,
  reportDate: new Date(),
  generatedBy: 'admin',
  filters: [],
  parameters: [],
  data: {
    assets: [],
    totalCount: 1247,
    totalValue: 2456789,
    averageValue: 1970,
    categories: [
      { category: 'IT Equipment', count: 156, totalValue: 312000, averageValue: 2000, percentage: 12.5 },
      { category: 'Vehicles', count: 23, totalValue: 1150000, averageValue: 50000, percentage: 46.8 },
      { category: 'Machinery', count: 89, totalValue: 445000, averageValue: 5000, percentage: 18.1 },
      { category: 'Furniture', count: 234, totalValue: 234000, averageValue: 1000, percentage: 9.5 },
      { category: 'Buildings', count: 12, totalValue: 312000, averageValue: 26000, percentage: 12.7 },
      { category: 'Other', count: 733, totalValue: 0, averageValue: 0, percentage: 58.8 }
    ],
    departments: [
      { department: 'Manufacturing', count: 234, totalValue: 567000, utilizationRate: 87, maintenanceCosts: 45000 },
      { department: 'IT', count: 156, totalValue: 312000, utilizationRate: 92, maintenanceCosts: 12000 },
      { department: 'Logistics', count: 23, totalValue: 1150000, utilizationRate: 78, maintenanceCosts: 67000 },
      { department: 'Administration', count: 234, totalValue: 234000, utilizationRate: 65, maintenanceCosts: 8000 },
      { department: 'Maintenance', count: 89, totalValue: 445000, utilizationRate: 95, maintenanceCosts: 89000 }
    ],
    locations: [
      { location: 'Production Floor A', count: 89, totalValue: 445000, condition: 'good' as any, lastMaintenanceDate: new Date('2024-04-15') },
      { location: 'Office Building', count: 234, totalValue: 234000, condition: 'excellent' as any, lastMaintenanceDate: new Date('2024-04-10') },
      { location: 'Warehouse', count: 45, totalValue: 225000, condition: 'fair' as any, lastMaintenanceDate: new Date('2024-03-28') },
      { location: 'Fleet Garage', count: 23, totalValue: 1150000, condition: 'good' as any, lastMaintenanceDate: new Date('2024-04-01') }
    ],
    statusBreakdown: [
      { status: 'active' as any, count: 1156, percentage: 92.7, totalValue: 2456789 },
      { status: 'under_maintenance' as any, count: 45, percentage: 3.6, totalValue: 89000 },
      { status: 'inactive' as any, count: 23, percentage: 1.8, totalValue: 23000 },
      { status: 'disposed' as any, count: 23, percentage: 1.8, totalValue: 0 }
    ],
    conditionBreakdown: [
      { condition: 'excellent' as any, count: 234, percentage: 18.8, totalValue: 468000, maintenanceRequired: false },
      { condition: 'good' as any, count: 567, percentage: 45.5, totalValue: 1134000, maintenanceRequired: false },
      { condition: 'fair' as any, count: 345, percentage: 27.7, totalValue: 690000, maintenanceRequired: true },
      { condition: 'poor' as any, count: 89, percentage: 7.1, totalValue: 178000, maintenanceRequired: true },
      { condition: 'critical' as any, count: 12, percentage: 1.0, totalValue: 24000, maintenanceRequired: true }
    ]
  },
  summary: {
    totalAssets: 1247,
    totalValue: 2456789,
    totalDepreciation: 245679,
    netBookValue: 2211110,
    maintenanceCosts: 212000,
    utilizationRate: 84.2,
    roiPercentage: 18.5,
    complianceRate: 94.2
  },
  exportFormats: [AssetExportFormat.PDF, AssetExportFormat.EXCEL],
  isScheduled: false,
  createdAt: new Date(),
  updatedAt: new Date()
};

const mockDepreciationSchedules: DepreciationSchedule[] = [
  {
    id: '1',
    assetId: 'AST-001',
    assetName: 'Industrial Printer HP LaserJet',
    period: '2024-04',
    depreciationAmount: 417,
    accumulatedDepreciation: 5000,
    bookValue: 20000,
    remainingLife: 48,
    depreciationMethod: 'straight_line' as any,
    calculatedAt: new Date()
  },
  {
    id: '2',
    assetId: 'AST-002',
    assetName: 'Delivery Van - Ford Transit',
    period: '2024-04',
    depreciationAmount: 469,
    accumulatedDepreciation: 9375,
    bookValue: 35625,
    remainingLife: 76,
    depreciationMethod: 'straight_line' as any,
    calculatedAt: new Date()
  }
];

const mockMaintenanceCosts: MaintenanceCostReport[] = [
  {
    id: '1',
    assetId: 'AST-001',
    assetName: 'Industrial Printer HP LaserJet',
    category: 'IT Equipment',
    department: 'Manufacturing',
    totalMaintenanceCost: 2500,
    preventiveCost: 1800,
    correctiveCost: 700,
    emergencyCost: 0,
    maintenanceHours: 24,
    downtimeHours: 8,
    maintenanceFrequency: 3,
    costPerHour: 104,
    costPerUnit: 0.02,
    period: '2024-04',
    reportDate: new Date()
  },
  {
    id: '2',
    assetId: 'AST-002',
    assetName: 'Delivery Van - Ford Transit',
    category: 'Vehicles',
    department: 'Logistics',
    totalMaintenanceCost: 8500,
    preventiveCost: 6000,
    correctiveCost: 2000,
    emergencyCost: 500,
    maintenanceHours: 48,
    downtimeHours: 16,
    maintenanceFrequency: 2,
    costPerHour: 177,
    costPerUnit: 0.10,
    period: '2024-04',
    reportDate: new Date()
  }
];

const mockROIAnalysis: ROIAnalysis[] = [
  {
    id: '1',
    assetId: 'AST-001',
    assetName: 'Industrial Printer HP LaserJet',
    category: 'IT Equipment',
    department: 'Manufacturing',
    initialInvestment: 25000,
    currentValue: 18000,
    totalRevenue: 45000,
    totalCosts: 27500,
    netProfit: 17500,
    roiPercentage: 70.0,
    utilizationRate: 85,
    hoursOperated: 2840,
    hoursAvailable: 3340,
    outputProduced: 125000,
    efficiencyRating: 92,
    maintenanceCostRatio: 0.10,
    downtimePercentage: 2.5,
    productivityIndex: 8.5,
    analysisPeriod: '2024-04',
    reportDate: new Date()
  },
  {
    id: '2',
    assetId: 'AST-002',
    assetName: 'Delivery Van - Ford Transit',
    category: 'Vehicles',
    department: 'Logistics',
    initialInvestment: 45000,
    currentValue: 28000,
    totalRevenue: 89000,
    totalCosts: 53500,
    netProfit: 35500,
    roiPercentage: 78.9,
    utilizationRate: 78,
    hoursOperated: 4560,
    hoursAvailable: 5840,
    outputProduced: 890,
    efficiencyRating: 88,
    maintenanceCostRatio: 0.19,
    downtimePercentage: 3.2,
    productivityIndex: 7.8,
    analysisPeriod: '2024-04',
    reportDate: new Date()
  }
];

const mockUtilizationAnalysis: UtilizationAnalysis[] = [
  {
    id: '1',
    assetId: 'AST-001',
    assetName: 'Industrial Printer HP LaserJet',
    category: 'IT Equipment',
    department: 'Manufacturing',
    location: 'Production Floor A',
    totalHours: 744,
    operationalHours: 632,
    idleHours: 80,
    maintenanceHours: 24,
    downtimeHours: 8,
    overallUtilization: 85.0,
    operationalUtilization: 84.9,
    availabilityRate: 98.9,
    reliabilityRate: 97.3,
    utilizationTrend: 'increasing',
    performanceRating: 9,
    recommendations: [
      'Optimize idle time during shift changes',
      'Implement predictive maintenance schedule',
      'Consider additional capacity for peak periods'
    ],
    analysisPeriod: '2024-04',
    reportDate: new Date()
  },
  {
    id: '2',
    assetId: 'AST-002',
    assetName: 'Delivery Van - Ford Transit',
    category: 'Vehicles',
    department: 'Logistics',
    location: 'Fleet Garage',
    totalHours: 744,
    operationalHours: 580,
    idleHours: 120,
    maintenanceHours: 32,
    downtimeHours: 12,
    overallUtilization: 78.0,
    operationalUtilization: 77.9,
    availabilityRate: 98.4,
    reliabilityRate: 96.2,
    utilizationTrend: 'stable',
    performanceRating: 8,
    recommendations: [
      'Reduce idle time through better route planning',
      'Implement telematics for real-time tracking',
      'Schedule maintenance during low-usage periods'
    ],
    analysisPeriod: '2024-04',
    reportDate: new Date()
  }
];

export function AssetReportingDashboards() {
  const [activeReport, setActiveReport] = useState<AssetReportType>(AssetReportType.ASSET_REGISTER);
  const [selectedPeriod, setSelectedPeriod] = useState('2024-04');
  const [isGenerateReportDialogOpen, setIsGenerateReportDialogOpen] = useState(false);
  const [isScheduleReportDialogOpen, setIsScheduleReportDialogOpen] = useState(false);

  const getTrendIcon = (trend: 'increasing' | 'decreasing' | 'stable') => {
    switch (trend) {
      case 'increasing':
        return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      case 'decreasing':
        return <ArrowDownRight className="h-4 w-4 text-red-600" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-blue-600" />;
    }
  };

  const getROIBadge = (roi: number) => {
    if (roi >= 20) return 'bg-green-100 text-green-800';
    if (roi >= 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getUtilizationBadge = (utilization: number) => {
    if (utilization >= 80) return 'bg-green-100 text-green-800';
    if (utilization >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getConditionBadge = (condition: string) => {
    const configs = {
      'excellent': 'bg-green-100 text-green-800',
      'good': 'bg-blue-100 text-blue-800',
      'fair': 'bg-yellow-100 text-yellow-800',
      'poor': 'bg-orange-100 text-orange-800',
      'critical': 'bg-red-100 text-red-800'
    };
    return configs[condition as keyof typeof configs] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Asset Reporting & Dashboards</h2>
          <p className="text-muted-foreground">Comprehensive asset analytics and reporting</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsScheduleReportDialogOpen(true)}>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Report
          </Button>
          <Button onClick={() => setIsGenerateReportDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Executive Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Asset Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">EGP {mockAssetRegister.summary.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Net Book Value: EGP {mockAssetRegister.summary.netBookValue.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAssetRegister.summary.roiPercentage}%</div>
            <p className="text-xs text-muted-foreground">
              Across all assets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAssetRegister.summary.utilizationRate}%</div>
            <p className="text-xs text-muted-foreground">
              Asset efficiency
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAssetRegister.summary.complianceRate}%</div>
            <p className="text-xs text-muted-foreground">
              Maintenance compliance
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeReport} onValueChange={(value) => setActiveReport(value as AssetReportType)} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value={AssetReportType.ASSET_REGISTER}>Asset Register</TabsTrigger>
            <TabsTrigger value={AssetReportType.DEPRECIATION_SCHEDULE}>Depreciation</TabsTrigger>
            <TabsTrigger value={AssetReportType.MAINTENANCE_COSTS}>Maintenance Costs</TabsTrigger>
            <TabsTrigger value={AssetReportType.ROI_ANALYSIS}>ROI Analysis</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-04">Apr 2024</SelectItem>
                <SelectItem value="2024-03">Mar 2024</SelectItem>
                <SelectItem value="2024-02">Feb 2024</SelectItem>
                <SelectItem value="2024-01">Jan 2024</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <TabsContent value={AssetReportType.ASSET_REGISTER} className="space-y-6">
          {/* Asset Register Report */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAssetRegister.data.categories.map((category) => (
                    <div key={category.category} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{category.category}</div>
                        <div className="text-sm text-muted-foreground">
                          {category.count} assets • {category.percentage.toFixed(1)}%
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">EGP {category.totalValue.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          Avg: EGP {category.averageValue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAssetRegister.data.departments.map((dept) => (
                    <div key={dept.department} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{dept.department}</div>
                        <div className="text-sm text-muted-foreground">
                          {dept.count} assets • {dept.utilizationRate}% utilization
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">EGP {dept.totalValue.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          Maint: EGP {dept.maintenanceCosts.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Status Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAssetRegister.data.statusBreakdown.map((status) => (
                    <div key={status.status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">{status.status.replace('_', ' ')}</Badge>
                        <span className="text-sm">{status.count} assets</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {status.percentage.toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Condition Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAssetRegister.data.conditionBreakdown.map((condition) => (
                    <div key={condition.condition} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getConditionBadge(condition.condition)}>
                          {condition.condition}
                        </Badge>
                        <span className="text-sm">{condition.count} assets</span>
                        {condition.maintenanceRequired && (
                          <AlertTriangle className="h-3 w-3 text-orange-500" />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {condition.percentage.toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value={AssetReportType.DEPRECIATION_SCHEDULE} className="space-y-6">
          {/* Depreciation Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Depreciation Schedule - {selectedPeriod}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDepreciationSchedules.map((schedule) => (
                  <div key={schedule.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">{schedule.assetName}</h4>
                        <p className="text-sm text-muted-foreground">{schedule.assetId}</p>
                      </div>
                      <Badge variant="outline">{schedule.depreciationMethod.replace('_', ' ')}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Monthly Depreciation</div>
                        <div className="font-medium">EGP {schedule.depreciationAmount.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Accumulated</div>
                        <div className="font-medium">EGP {schedule.accumulatedDepreciation.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Book Value</div>
                        <div className="font-medium">EGP {schedule.bookValue.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Remaining Life</div>
                        <div className="font-medium">{schedule.remainingLife} months</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value={AssetReportType.MAINTENANCE_COSTS} className="space-y-6">
          {/* Maintenance Cost Tracking */}
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Cost Analysis - {selectedPeriod}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMaintenanceCosts.map((cost) => (
                  <div key={cost.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">{cost.assetName}</h4>
                        <p className="text-sm text-muted-foreground">{cost.category} • {cost.department}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">EGP {cost.totalMaintenanceCost.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          {cost.costPerHour.toFixed(0)}/hour
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Preventive</div>
                        <div className="font-medium">EGP {cost.preventiveCost.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Corrective</div>
                        <div className="font-medium">EGP {cost.correctiveCost.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Emergency</div>
                        <div className="font-medium">EGP {cost.emergencyCost.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Downtime</div>
                        <div className="font-medium">{cost.downtimeHours} hours</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value={AssetReportType.ROI_ANALYSIS} className="space-y-6">
          {/* ROI and Utilization Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>ROI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockROIAnalysis.map((roi) => (
                    <div key={roi.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium">{roi.assetName}</h4>
                          <p className="text-sm text-muted-foreground">{roi.category} • {roi.department}</p>
                        </div>
                        <Badge className={getROIBadge(roi.roiPercentage)}>
                          {roi.roiPercentage.toFixed(1)}% ROI
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Net Profit</div>
                          <div className="font-medium">EGP {roi.netProfit.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Utilization</div>
                          <div className="font-medium">{roi.utilizationRate}%</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Efficiency</div>
                          <div className="font-medium">{roi.efficiencyRating}/10</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Downtime</div>
                          <div className="font-medium">{roi.downtimePercentage}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Utilization Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUtilizationAnalysis.map((util) => (
                    <div key={util.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium">{util.assetName}</h4>
                          <p className="text-sm text-muted-foreground">{util.location}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getUtilizationBadge(util.overallUtilization)}>
                            {util.overallUtilization}%
                          </Badge>
                          {getTrendIcon(util.utilizationTrend)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Operational Hours</div>
                          <div className="font-medium">{util.operationalHours}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Idle Hours</div>
                          <div className="font-medium">{util.idleHours}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Availability</div>
                          <div className="font-medium">{util.availabilityRate}%</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Performance</div>
                          <div className="font-medium">{util.performanceRating}/10</div>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="text-xs text-muted-foreground mb-1">Recommendations:</div>
                        <div className="space-y-1">
                          {util.recommendations.slice(0, 2).map((rec, idx) => (
                            <div key={idx} className="text-xs text-muted-foreground">
                              • {rec}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Generate Report Dialog */}
      <Dialog open={isGenerateReportDialogOpen} onOpenChange={setIsGenerateReportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Generate Asset Report</DialogTitle>
            <DialogDescription>
              Create a custom asset report with specific filters and parameters
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reportName">Report Name</Label>
                <Input id="reportName" placeholder="Custom Asset Report" />
              </div>
              <div>
                <Label htmlFor="reportType">Report Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={AssetReportType.ASSET_REGISTER}>Asset Register</SelectItem>
                    <SelectItem value={AssetReportType.DEPRECIATION_SCHEDULE}>Depreciation Schedule</SelectItem>
                    <SelectItem value={AssetReportType.MAINTENANCE_COSTS}>Maintenance Costs</SelectItem>
                    <SelectItem value={AssetReportType.ROI_ANALYSIS}>ROI Analysis</SelectItem>
                    <SelectItem value={AssetReportType.UTILIZATION_ANALYSIS}>Utilization Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="logistics">Logistics</SelectItem>
                    <SelectItem value="administration">Administration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="it_equipment">IT Equipment</SelectItem>
                    <SelectItem value="vehicles">Vehicles</SelectItem>
                    <SelectItem value="machinery">Machinery</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="exportFormat">Export Format</Label>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGenerateReportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsGenerateReportDialogOpen(false)}>
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
