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
  Link, 
  Plus, 
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Settings,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  Building,
  Users,
  Package,
  Car,
  ShoppingCart,
  FileText,
  Activity,
  Database,
  ArrowRight,
  ArrowLeft,
  Zap,
  Target,
  Globe,
  TrendingUp
} from 'lucide-react';
import { 
  IntegrationMapping, 
  FieldMapping, 
  TransformationRule, 
  SourceModule, 
  TargetModule, 
  TransformationType 
} from '@/lib/models/finance';

// Mock data
const mockIntegrations: IntegrationMapping[] = [
  {
    id: '1',
    sourceModule: SourceModule.SALES,
    targetModule: TargetModule.FINANCE,
    mappingName: 'Sales Order to AR Invoice',
    fieldMappings: [
      { id: '1', sourceField: 'orderNumber', targetField: 'invoiceNumber', dataType: 'string', isRequired: true },
      { id: '2', sourceField: 'customerId', targetField: 'customerId', dataType: 'string', isRequired: true },
      { id: '3', sourceField: 'totalAmount', targetField: 'grossAmount', dataType: 'number', isRequired: true },
      { id: '4', sourceField: 'orderDate', targetField: 'invoiceDate', dataType: 'date', isRequired: true }
    ],
    transformations: [
      { id: '1', ruleName: 'Calculate Tax', ruleType: TransformationType.CALCULATION, expression: 'totalAmount * 0.14', order: 1 },
      { id: '2', ruleName: 'Set Payment Terms', ruleType: TransformationType.MAPPING, expression: 'NET30', order: 2 }
    ],
    isActive: true,
    lastSyncDate: new Date('2024-04-15T10:30:00'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-04-15'),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '2',
    sourceModule: SourceModule.PROCUREMENT,
    targetModule: TargetModule.FINANCE,
    mappingName: 'Purchase Order to AP Invoice',
    fieldMappings: [
      { id: '1', sourceField: 'poNumber', targetField: 'invoiceNumber', dataType: 'string', isRequired: true },
      { id: '2', sourceField: 'vendorId', targetField: 'vendorId', dataType: 'string', isRequired: true },
      { id: '3', sourceField: 'totalAmount', targetField: 'grossAmount', dataType: 'number', isRequired: true },
      { id: '4', sourceField: 'poDate', targetField: 'invoiceDate', dataType: 'date', isRequired: true }
    ],
    transformations: [
      { id: '1', ruleName: 'Calculate WHT', ruleType: TransformationType.CALCULATION, expression: 'totalAmount * 0.025', order: 1 },
      { id: '2', ruleName: 'Set Match Status', ruleType: TransformationType.MAPPING, expression: 'THREE_WAY', order: 2 }
    ],
    isActive: true,
    lastSyncDate: new Date('2024-04-16T09:15:00'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-04-16'),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '3',
    sourceModule: SourceModule.INVENTORY,
    targetModule: TargetModule.FINANCE,
    mappingName: 'Inventory Receipt to COGS',
    fieldMappings: [
      { id: '1', sourceField: 'receiptNumber', targetField: 'journalReference', dataType: 'string', isRequired: true },
      { id: '2', sourceField: 'productId', targetField: 'productId', dataType: 'string', isRequired: true },
      { id: '3', sourceField: 'quantity', targetField: 'quantity', dataType: 'number', isRequired: true },
      { id: '4', sourceField: 'unitCost', targetField: 'unitCost', dataType: 'number', isRequired: true }
    ],
    transformations: [
      { id: '1', ruleName: 'Calculate Total Cost', ruleType: TransformationType.CALCULATION, expression: 'quantity * unitCost', order: 1 },
      { id: '2', ruleName: 'Post to COGS Account', ruleType: TransformationType.MAPPING, expression: 'COGS_ACCOUNT', order: 2 }
    ],
    isActive: true,
    lastSyncDate: new Date('2024-04-14T14:20:00'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-04-14'),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '4',
    sourceModule: SourceModule.HR,
    targetModule: TargetModule.FINANCE,
    mappingName: 'Payroll to Salary Postings',
    fieldMappings: [
      { id: '1', sourceField: 'employeeId', targetField: 'employeeId', dataType: 'string', isRequired: true },
      { id: '2', sourceField: 'salaryAmount', targetField: 'salaryAmount', dataType: 'number', isRequired: true },
      { id: '3', sourceField: 'payPeriod', targetField: 'payPeriod', dataType: 'string', isRequired: true },
      { id: '4', sourceField: 'department', targetField: 'costCenter', dataType: 'string', isRequired: false }
    ],
    transformations: [
      { id: '1', ruleName: 'Calculate Deductions', ruleType: TransformationType.CALCULATION, expression: 'salaryAmount * 0.2', order: 1 },
      { id: '2', ruleName: 'Post to Salary Account', ruleType: TransformationType.MAPPING, expression: 'SALARY_EXPENSE_ACCOUNT', order: 2 }
    ],
    isActive: true,
    lastSyncDate: new Date('2024-04-15T08:00:00'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-04-15'),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '5',
    sourceModule: SourceModule.ASSETS,
    targetModule: TargetModule.FINANCE,
    mappingName: 'Asset Purchase to Capitalization',
    fieldMappings: [
      { id: '1', sourceField: 'assetId', targetField: 'assetId', dataType: 'string', isRequired: true },
      { id: '2', sourceField: 'purchaseCost', targetField: 'capitalizationAmount', dataType: 'number', isRequired: true },
      { id: '3', sourceField: 'purchaseDate', targetField: 'capitalizationDate', dataType: 'date', isRequired: true },
      { id: '4', sourceField: 'supplier', targetField: 'supplier', dataType: 'string', isRequired: false }
    ],
    transformations: [
      { id: '1', ruleName: 'Set Capitalization Source', ruleType: TransformationType.MAPPING, expression: 'AP_INVOICE', order: 1 },
      { id: '2', ruleName: 'Post to Asset Account', ruleType: TransformationType.MAPPING, expression: 'FIXED_ASSETS_ACCOUNT', order: 2 }
    ],
    isActive: true,
    lastSyncDate: new Date('2024-04-13T16:45:00'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-04-13'),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '6',
    sourceModule: SourceModule.FLEET,
    targetModule: TargetModule.FINANCE,
    mappingName: 'Fleet Maintenance to Expenses',
    fieldMappings: [
      { id: '1', sourceField: 'maintenanceId', targetField: 'maintenanceId', dataType: 'string', isRequired: true },
      { id: '2', sourceField: 'vehicleId', targetField: 'vehicleId', dataType: 'string', isRequired: true },
      { id: '3', sourceField: 'maintenanceCost', targetField: 'maintenanceCost', dataType: 'number', isRequired: true },
      { id: '4', sourceField: 'maintenanceDate', targetField: 'maintenanceDate', dataType: 'date', isRequired: true }
    ],
    transformations: [
      { id: '1', ruleName: 'Classify Maintenance Type', ruleType: TransformationType.VALIDATION, expression: 'preventive || corrective', order: 1 },
      { id: '2', ruleName: 'Post to Maintenance Account', ruleType: TransformationType.MAPPING, expression: 'MAINTENANCE_EXPENSE_ACCOUNT', order: 2 }
    ],
    isActive: true,
    lastSyncDate: new Date('2024-04-12T11:30:00'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-04-12'),
    createdBy: 'admin',
    updatedBy: 'admin'
  }
];

export function IntegrationPoints() {
  const [integrations, setIntegrations] = useState<IntegrationMapping[]>(mockIntegrations);
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [targetFilter, setTargetFilter] = useState<string>('all');
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationMapping | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = 
      integration.mappingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.sourceModule.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.targetModule.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSource = sourceFilter === 'all' || integration.sourceModule === sourceFilter;
    const matchesTarget = targetFilter === 'all' || integration.targetModule === targetFilter;
    
    return matchesSearch && matchesSource && matchesTarget;
  });

  const getSourceModuleIcon = (module: SourceModule) => {
    const icons = {
      [SourceModule.SALES]: ShoppingCart,
      [SourceModule.PROCUREMENT]: Building,
      [SourceModule.INVENTORY]: Package,
      [SourceModule.HR]: Users,
      [SourceModule.ASSETS]: Building,
      [SourceModule.FLEET]: Car
    };
    return icons[module] || FileText;
  };

  const getTargetModuleIcon = (module: TargetModule) => {
    const icons = {
      [TargetModule.FINANCE]: DollarSign,
      [TargetModule.ACCOUNTING]: FileText,
      [TargetModule.REPORTING]: TrendingUp
    };
    return icons[module] || FileText;
  };

  const getTransformationTypeBadge = (type: TransformationType) => {
    const configs = {
      [TransformationType.MAPPING]: { color: 'bg-blue-100 text-blue-800', text: 'Mapping' },
      [TransformationType.CALCULATION]: { color: 'bg-green-100 text-green-800', text: 'Calculation' },
      [TransformationType.VALIDATION]: { color: 'bg-yellow-100 text-yellow-800', text: 'Validation' },
      [TransformationType.FORMATTING]: { color: 'bg-purple-100 text-purple-800', text: 'Formatting' }
    };

    const config = configs[type];
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  const getStatusBadge = (isActive: boolean, lastSyncDate?: Date) => {
    if (!isActive) {
      return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
    }

    const now = new Date();
    const syncDate = lastSyncDate ? new Date(lastSyncDate) : null;
    const hoursSinceSync = syncDate ? (now.getTime() - syncDate.getTime()) / (1000 * 60 * 60) : null;

    if (!syncDate) {
      return <Badge className="bg-yellow-100 text-yellow-800">Never Synced</Badge>;
    }

    if (hoursSinceSync && hoursSinceSync < 24) {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    } else if (hoursSinceSync && hoursSinceSync < 72) {
      return <Badge className="bg-yellow-100 text-yellow-800">Stale</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">Outdated</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Integration Points</h2>
          <p className="text-muted-foreground">Manage data flow between modules and finance system</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync All
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </div>
      </div>

      {/* Integration Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
            <Link className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {integrations.filter(i => i.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">of {integrations.length} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Syncs</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {integrations.filter(i => {
                if (!i.lastSyncDate) return false;
                const hoursSinceSync = (new Date().getTime() - new Date(i.lastSyncDate).getTime()) / (1000 * 60 * 60);
                return hoursSinceSync < 24;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Source Modules</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(integrations.map(i => i.sourceModule)).size}
            </div>
            <p className="text-xs text-muted-foreground">Connected modules</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Field Mappings</CardTitle>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {integrations.reduce((sum, i) => sum + i.fieldMappings.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total mappings</p>
          </CardContent>
        </Card>
      </div>

      {/* Module Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-base">Sales & AR</CardTitle>
                <p className="text-xs text-muted-foreground">Invoices & receipts</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Order → Invoice</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Payment → Receipt</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-base">Procurement & AP</CardTitle>
                <p className="text-xs text-muted-foreground">Supplier bills & payments</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>PO → Invoice</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Payment → Journal</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-base">Inventory & Manufacturing</CardTitle>
                <p className="text-xs text-muted-foreground">COGS & stock valuation</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Receipt → COGS</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>WIP → Inventory</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-base">HR/Payroll</CardTitle>
                <p className="text-xs text-muted-foreground">Salary postings</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Payroll → Journal</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Benefits → Expense</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-100 rounded-lg">
                <Building className="h-6 w-6 text-cyan-600" />
              </div>
              <div>
                <CardTitle className="text-base">Assets & Fleet</CardTitle>
                <p className="text-xs text-muted-foreground">Depreciation & disposals</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Purchase → Capitalize</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Maintenance → Expense</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Zap className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <CardTitle className="text-base">Custom Integrations</CardTitle>
                <p className="text-xs text-muted-foreground">API & webhook endpoints</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>API Endpoints</span>
                <Badge className="bg-blue-100 text-blue-800">3 Active</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Webhooks</span>
                <Badge className="bg-blue-100 text-blue-800">5 Configured</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Mappings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Mappings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by mapping name or module..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value={SourceModule.SALES}>Sales</SelectItem>
                  <SelectItem value={SourceModule.PROCUREMENT}>Procurement</SelectItem>
                  <SelectItem value={SourceModule.INVENTORY}>Inventory</SelectItem>
                  <SelectItem value={SourceModule.HR}>HR</SelectItem>
                  <SelectItem value={SourceModule.ASSETS}>Assets</SelectItem>
                  <SelectItem value={SourceModule.FLEET}>Fleet</SelectItem>
                </SelectContent>
              </Select>
              <Select value={targetFilter} onValueChange={setTargetFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by target" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Targets</SelectItem>
                  <SelectItem value={TargetModule.FINANCE}>Finance</SelectItem>
                  <SelectItem value={TargetModule.ACCOUNTING}>Accounting</SelectItem>
                  <SelectItem value={TargetModule.REPORTING}>Reporting</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium">Mapping Name</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Source</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Target</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Field Mappings</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Last Sync</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIntegrations.map((integration) => {
                    const SourceIcon = getSourceModuleIcon(integration.sourceModule);
                    const TargetIcon = getTargetModuleIcon(integration.targetModule);
                    
                    return (
                      <tr key={integration.id} className="border-b">
                        <td className="p-4">
                          <div className="font-medium">{integration.mappingName}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <SourceIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{integration.sourceModule}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <TargetIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{integration.targetModule}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            {integration.fieldMappings.length} mappings
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            {integration.lastSyncDate 
                              ? integration.lastSyncDate.toLocaleString()
                              : 'Never'
                            }
                          </div>
                        </td>
                        <td className="p-4">
                          {getStatusBadge(integration.isActive, integration.lastSyncDate)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedIntegration(integration);
                                setIsViewDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Integration Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Integration Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedIntegration?.mappingName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedIntegration && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="mappings">Field Mappings</TabsTrigger>
                <TabsTrigger value="transformations">Transformations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Mapping Name</Label>
                    <div className="text-sm font-medium">{selectedIntegration.mappingName}</div>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div>{getStatusBadge(selectedIntegration.isActive, selectedIntegration.lastSyncDate)}</div>
                  </div>
                  <div>
                    <Label>Source Module</Label>
                    <div className="flex items-center gap-2">
                      {React.createElement(getSourceModuleIcon(selectedIntegration.sourceModule), { className: "h-4 w-4" })}
                      <span className="text-sm font-medium">{selectedIntegration.sourceModule}</span>
                    </div>
                  </div>
                  <div>
                    <Label>Target Module</Label>
                    <div className="flex items-center gap-2">
                      {React.createElement(getTargetModuleIcon(selectedIntegration.targetModule), { className: "h-4 w-4" })}
                      <span className="text-sm font-medium">{selectedIntegration.targetModule}</span>
                    </div>
                  </div>
                  <div>
                    <Label>Last Sync</Label>
                    <div className="text-sm font-medium">
                      {selectedIntegration.lastSyncDate 
                        ? selectedIntegration.lastSyncDate.toLocaleString()
                        : 'Never'
                      }
                    </div>
                  </div>
                  <div>
                    <Label>Created</Label>
                    <div className="text-sm font-medium">
                      {selectedIntegration.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="mappings" className="space-y-4">
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-10 px-4 text-left font-medium">Source Field</th>
                        <th className="h-10 px-4 text-left font-medium">Target Field</th>
                        <th className="h-10 px-4 text-left font-medium">Data Type</th>
                        <th className="h-10 px-4 text-left font-medium">Required</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedIntegration.fieldMappings.map((mapping) => (
                        <tr key={mapping.id} className="border-b">
                          <td className="p-4">
                            <div className="font-medium">{mapping.sourceField}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium">{mapping.targetField}</div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline">{mapping.dataType}</Badge>
                          </td>
                          <td className="p-4">
                            {mapping.isRequired ? (
                              <Badge className="bg-red-100 text-red-800">Required</Badge>
                            ) : (
                              <Badge variant="secondary">Optional</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="transformations" className="space-y-4">
                <div className="space-y-3">
                  {selectedIntegration.transformations.map((transformation) => (
                    <div key={transformation.id} className="p-4 border rounded">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{transformation.ruleName}</span>
                          {getTransformationTypeBadge(transformation.ruleType)}
                        </div>
                        <Badge variant="outline">Order: {transformation.order}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground font-mono bg-gray-50 p-2 rounded">
                        {transformation.expression}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => setIsViewDialogOpen(false)}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
