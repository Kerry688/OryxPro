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
  Plus, 
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  Calendar,
  FileText,
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building,
  Users,
  Settings,
  RefreshCw,
  Share2,
  Clock,
  CheckCircle,
  AlertTriangle,
  Target,
  Activity,
  Database,
  Globe,
  Lock,
  Unlock
} from 'lucide-react';
import { 
  FinancialReport, 
  ReportType, 
  ReportCategory, 
  ScheduleFrequency, 
  ExportFormat, 
  AccessLevel 
} from '@/lib/models/finance';

// Mock data
const mockReports: FinancialReport[] = [
  {
    id: '1',
    reportName: 'Balance Sheet - Q1 2024',
    reportType: ReportType.BALANCE_SHEET,
    reportCategory: ReportCategory.STANDARD,
    parameters: [
      { id: '1', parameterName: 'As of Date', parameterType: 'date', defaultValue: '2024-03-31', isRequired: true },
      { id: '2', parameterName: 'Company', parameterType: 'select', defaultValue: 'all', isRequired: false }
    ],
    filters: [
      { id: '1', filterName: 'Date Range', filterType: 'date_range', filterValue: { start: '2024-01-01', end: '2024-03-31' }, operator: 'between' }
    ],
    data: [],
    generatedAt: new Date('2024-04-01'),
    generatedBy: 'john.doe',
    isScheduled: true,
    scheduleFrequency: ScheduleFrequency.QUARTERLY,
    nextRunDate: new Date('2024-06-30'),
    exportFormats: [ExportFormat.PDF, ExportFormat.EXCEL],
    accessLevel: AccessLevel.RESTRICTED,
    authorizedUsers: ['john.doe', 'jane.smith', 'finance.team'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-04-01'),
    createdBy: 'john.doe',
    updatedBy: 'john.doe'
  },
  {
    id: '2',
    reportName: 'P&L Statement - Monthly',
    reportType: ReportType.PROFIT_LOSS,
    reportCategory: ReportCategory.STANDARD,
    parameters: [
      { id: '1', parameterName: 'Period Start', parameterType: 'date', defaultValue: '2024-04-01', isRequired: true },
      { id: '2', parameterName: 'Period End', parameterType: 'date', defaultValue: '2024-04-30', isRequired: true }
    ],
    filters: [
      { id: '1', filterName: 'Company', filterType: 'company', filterValue: 'company1', operator: 'equals' }
    ],
    data: [],
    generatedAt: new Date('2024-05-01'),
    generatedBy: 'jane.smith',
    isScheduled: true,
    scheduleFrequency: ScheduleFrequency.MONTHLY,
    nextRunDate: new Date('2024-06-01'),
    exportFormats: [ExportFormat.PDF, ExportFormat.EXCEL, ExportFormat.CSV],
    accessLevel: AccessLevel.RESTRICTED,
    authorizedUsers: ['jane.smith', 'finance.team'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-05-01'),
    createdBy: 'jane.smith',
    updatedBy: 'jane.smith'
  },
  {
    id: '3',
    reportName: 'Department Profitability Analysis',
    reportType: ReportType.DEPARTMENT_PROFITABILITY,
    reportCategory: ReportCategory.MANAGEMENT,
    parameters: [
      { id: '1', parameterName: 'Department', parameterType: 'select', defaultValue: 'all', isRequired: false },
      { id: '2', parameterName: 'Period', parameterType: 'date', defaultValue: '2024-04-01', isRequired: true }
    ],
    filters: [
      { id: '1', filterName: 'Date Range', filterType: 'date_range', filterValue: { start: '2024-04-01', end: '2024-04-30' }, operator: 'between' }
    ],
    data: [],
    generatedAt: new Date('2024-05-02'),
    generatedBy: 'finance.team',
    isScheduled: false,
    exportFormats: [ExportFormat.PDF, ExportFormat.EXCEL],
    accessLevel: AccessLevel.CONFIDENTIAL,
    authorizedUsers: ['finance.team', 'management.team'],
    createdAt: new Date('2024-04-15'),
    updatedAt: new Date('2024-05-02'),
    createdBy: 'finance.team',
    updatedBy: 'finance.team'
  },
  {
    id: '4',
    reportName: 'Trial Balance - April 2024',
    reportType: ReportType.TRIAL_BALANCE,
    reportCategory: ReportCategory.STANDARD,
    parameters: [
      { id: '1', parameterName: 'As of Date', parameterType: 'date', defaultValue: '2024-04-30', isRequired: true }
    ],
    filters: [
      { id: '1', filterName: 'Company', filterType: 'company', filterValue: 'company1', operator: 'equals' }
    ],
    data: [],
    generatedAt: new Date('2024-05-01'),
    generatedBy: 'system',
    isScheduled: true,
    scheduleFrequency: ScheduleFrequency.MONTHLY,
    nextRunDate: new Date('2024-06-01'),
    exportFormats: [ExportFormat.PDF, ExportFormat.EXCEL],
    accessLevel: AccessLevel.RESTRICTED,
    authorizedUsers: ['finance.team'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-05-01'),
    createdBy: 'system',
    updatedBy: 'system'
  }
];

export function FinancialReports() {
  const [reports, setReports] = useState<FinancialReport[]>(mockReports);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<FinancialReport | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.reportName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.generatedBy.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || report.reportCategory === categoryFilter;
    const matchesType = typeFilter === 'all' || report.reportType === typeFilter;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const getReportTypeBadge = (type: ReportType) => {
    const configs = {
      [ReportType.BALANCE_SHEET]: { color: 'bg-blue-100 text-blue-800', text: 'Balance Sheet', icon: BarChart3 },
      [ReportType.PROFIT_LOSS]: { color: 'bg-green-100 text-green-800', text: 'P&L Statement', icon: TrendingUp },
      [ReportType.TRIAL_BALANCE]: { color: 'bg-purple-100 text-purple-800', text: 'Trial Balance', icon: FileText },
      [ReportType.CASH_FLOW]: { color: 'bg-orange-100 text-orange-800', text: 'Cash Flow', icon: DollarSign },
      [ReportType.DEPARTMENT_PROFITABILITY]: { color: 'bg-cyan-100 text-cyan-800', text: 'Dept. Profitability', icon: Building },
      [ReportType.COST_CENTER_REPORT]: { color: 'bg-yellow-100 text-yellow-800', text: 'Cost Center', icon: Target },
      [ReportType.CUSTOM_DASHBOARD]: { color: 'bg-gray-100 text-gray-800', text: 'Custom Dashboard', icon: PieChart },
      [ReportType.TAX_REPORT]: { color: 'bg-red-100 text-red-800', text: 'Tax Report', icon: FileText },
      [ReportType.AUDIT_REPORT]: { color: 'bg-indigo-100 text-indigo-800', text: 'Audit Report', icon: CheckCircle }
    };

    const config = configs[type];
    if (!config) {
      return <Badge variant="secondary">Unknown</Badge>;
    }

    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const getCategoryBadge = (category: ReportCategory) => {
    const configs = {
      [ReportCategory.STANDARD]: { color: 'bg-blue-100 text-blue-800', text: 'Standard' },
      [ReportCategory.MANAGEMENT]: { color: 'bg-green-100 text-green-800', text: 'Management' },
      [ReportCategory.COMPLIANCE]: { color: 'bg-red-100 text-red-800', text: 'Compliance' },
      [ReportCategory.CUSTOM]: { color: 'bg-purple-100 text-purple-800', text: 'Custom' }
    };

    const config = configs[category];
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  const getAccessLevelBadge = (level: AccessLevel) => {
    const configs = {
      [AccessLevel.PUBLIC]: { color: 'bg-green-100 text-green-800', icon: Unlock },
      [AccessLevel.RESTRICTED]: { color: 'bg-yellow-100 text-yellow-800', icon: Lock },
      [AccessLevel.CONFIDENTIAL]: { color: 'bg-red-100 text-red-800', icon: Lock }
    };

    const config = configs[level];
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {level}
      </Badge>
    );
  };

  const getScheduleFrequencyBadge = (frequency?: ScheduleFrequency) => {
    if (!frequency) return <Badge variant="secondary">Manual</Badge>;
    
    const configs = {
      [ScheduleFrequency.DAILY]: { color: 'bg-blue-100 text-blue-800', text: 'Daily' },
      [ScheduleFrequency.WEEKLY]: { color: 'bg-green-100 text-green-800', text: 'Weekly' },
      [ScheduleFrequency.MONTHLY]: { color: 'bg-purple-100 text-purple-800', text: 'Monthly' },
      [ScheduleFrequency.QUARTERLY]: { color: 'bg-orange-100 text-orange-800', text: 'Quarterly' },
      [ScheduleFrequency.YEARLY]: { color: 'bg-red-100 text-red-800', text: 'Yearly' }
    };

    const config = configs[frequency];
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Financial Reports</h2>
          <p className="text-muted-foreground">Generate and manage financial reports and analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Report Builder
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Report
          </Button>
        </div>
      </div>

      {/* Report Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-base">Balance Sheet</CardTitle>
                <p className="text-xs text-muted-foreground">Assets, Liabilities & Equity</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Button size="sm" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              Generate
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-base">Profit & Loss</CardTitle>
                <p className="text-xs text-muted-foreground">Revenue & Expenses</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Button size="sm" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              Generate
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-base">Trial Balance</CardTitle>
                <p className="text-xs text-muted-foreground">Account Balances</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Button size="sm" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              Generate
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-base">Cash Flow</CardTitle>
                <p className="text-xs text-muted-foreground">Operating, Investing & Financing</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Button size="sm" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              Generate
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Management Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-100 rounded-lg">
                <Building className="h-6 w-6 text-cyan-600" />
              </div>
              <div>
                <CardTitle className="text-base">Department Profitability</CardTitle>
                <p className="text-xs text-muted-foreground">Performance by department</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Button size="sm" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              Generate
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Target className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <CardTitle className="text-base">Cost Center Report</CardTitle>
                <p className="text-xs text-muted-foreground">Project-based reporting</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Button size="sm" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              Generate
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <PieChart className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <CardTitle className="text-base">Custom Dashboard</CardTitle>
                <p className="text-xs text-muted-foreground">KPI dashboards</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Button size="sm" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              Generate
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by report name or creator..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value={ReportCategory.STANDARD}>Standard</SelectItem>
                  <SelectItem value={ReportCategory.MANAGEMENT}>Management</SelectItem>
                  <SelectItem value={ReportCategory.COMPLIANCE}>Compliance</SelectItem>
                  <SelectItem value={ReportCategory.CUSTOM}>Custom</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value={ReportType.BALANCE_SHEET}>Balance Sheet</SelectItem>
                  <SelectItem value={ReportType.PROFIT_LOSS}>P&L Statement</SelectItem>
                  <SelectItem value={ReportType.TRIAL_BALANCE}>Trial Balance</SelectItem>
                  <SelectItem value={ReportType.CASH_FLOW}>Cash Flow</SelectItem>
                  <SelectItem value={ReportType.DEPARTMENT_PROFITABILITY}>Dept. Profitability</SelectItem>
                  <SelectItem value={ReportType.COST_CENTER_REPORT}>Cost Center</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reports Table */}
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium">Report Name</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Category</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Generated</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Schedule</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Access</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="border-b">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{report.reportName}</div>
                          <div className="text-sm text-muted-foreground">by {report.generatedBy}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        {getReportTypeBadge(report.reportType)}
                      </td>
                      <td className="p-4">
                        {getCategoryBadge(report.reportCategory)}
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {report.generatedAt.toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        {getScheduleFrequencyBadge(report.scheduleFrequency)}
                      </td>
                      <td className="p-4">
                        {getAccessLevelBadge(report.accessLevel)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedReport(report);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Report Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedReport?.reportName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Report Details</TabsTrigger>
                <TabsTrigger value="parameters">Parameters</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="access">Access Control</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Report Name</Label>
                    <div className="text-sm font-medium">{selectedReport.reportName}</div>
                  </div>
                  <div>
                    <Label>Report Type</Label>
                    <div>{getReportTypeBadge(selectedReport.reportType)}</div>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <div>{getCategoryBadge(selectedReport.reportCategory)}</div>
                  </div>
                  <div>
                    <Label>Generated By</Label>
                    <div className="text-sm font-medium">{selectedReport.generatedBy}</div>
                  </div>
                  <div>
                    <Label>Generated At</Label>
                    <div className="text-sm font-medium">{selectedReport.generatedAt.toLocaleString()}</div>
                  </div>
                  <div>
                    <Label>Export Formats</Label>
                    <div className="flex gap-1 mt-1">
                      {selectedReport.exportFormats.map((format, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {format.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="parameters" className="space-y-4">
                <div className="space-y-3">
                  {selectedReport.parameters.map((param) => (
                    <div key={param.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">{param.parameterName}</div>
                        <div className="text-sm text-muted-foreground">
                          Type: {param.parameterType} • Required: {param.isRequired ? 'Yes' : 'No'}
                        </div>
                      </div>
                      <div className="text-sm font-medium">{param.defaultValue}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="schedule" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Scheduled</Label>
                    <div>
                      {selectedReport.isScheduled ? (
                        <Badge className="bg-green-100 text-green-800">Yes</Badge>
                      ) : (
                        <Badge variant="secondary">No</Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>Frequency</Label>
                    <div>{getScheduleFrequencyBadge(selectedReport.scheduleFrequency)}</div>
                  </div>
                  {selectedReport.nextRunDate && (
                    <div>
                      <Label>Next Run</Label>
                      <div className="text-sm font-medium">{selectedReport.nextRunDate.toLocaleDateString()}</div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="access" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Access Level</Label>
                    <div>{getAccessLevelBadge(selectedReport.accessLevel)}</div>
                  </div>
                  <div>
                    <Label>Authorized Users</Label>
                    <div className="text-sm font-medium">{selectedReport.authorizedUsers.length} users</div>
                  </div>
                  <div className="col-span-2">
                    <Label>Authorized Users List</Label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedReport.authorizedUsers.map((user, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {user}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => setIsGenerateDialogOpen(true)}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Report Dialog */}
      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Generate Report</DialogTitle>
            <DialogDescription>
              Configure parameters and generate {selectedReport?.reportName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedReport?.parameters.map((param) => (
              <div key={param.id}>
                <Label htmlFor={param.id}>{param.parameterName}</Label>
                {param.parameterType === 'date' ? (
                  <Input id={param.id} type="date" defaultValue={param.defaultValue} />
                ) : param.parameterType === 'select' ? (
                  <Select defaultValue={param.defaultValue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      {param.options?.map((option, index) => (
                        <SelectItem key={index} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input id={param.id} type={param.parameterType} defaultValue={param.defaultValue} />
                )}
              </div>
            ))}
            
            <div>
              <Label>Export Format</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select export format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ExportFormat.PDF}>PDF</SelectItem>
                  <SelectItem value={ExportFormat.EXCEL}>Excel</SelectItem>
                  <SelectItem value={ExportFormat.CSV}>CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsGenerateDialogOpen(false)}>
              <Download className="h-4 w-4 mr-2" />
              Generate & Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
