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
  Shield, 
  Plus, 
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Building,
  Users,
  Settings,
  RefreshCw,
  Lock,
  Unlock,
  Globe,
  TrendingUp,
  TrendingDown,
  Activity,
  Database,
  User,
  MapPin
} from 'lucide-react';
import { 
  AuditTrail, 
  TaxConfiguration, 
  TaxTransaction, 
  AuditAction, 
  TaxType, 
  TaxStatus 
} from '@/lib/models/finance';

// Mock data
const mockAuditTrails: AuditTrail[] = [
  {
    id: '1',
    entityType: 'JournalEntry',
    entityId: 'JE-2024-001',
    action: AuditAction.CREATE,
    oldValues: null,
    newValues: { entryNumber: 'JE-2024-001', description: 'Sales invoice recording' },
    userId: 'jane.smith',
    userName: 'Jane Smith',
    userRole: 'Accountant',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0...',
    timestamp: new Date('2024-04-15T10:30:00'),
    reason: 'Monthly sales recording',
    reference: 'INV-001'
  },
  {
    id: '2',
    entityType: 'JournalEntry',
    entityId: 'JE-2024-001',
    action: AuditAction.APPROVE,
    oldValues: { status: 'pending_approval' },
    newValues: { status: 'approved', approvedBy: 'john.doe' },
    userId: 'john.doe',
    userName: 'John Doe',
    userRole: 'Finance Manager',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0...',
    timestamp: new Date('2024-04-15T11:15:00'),
    reason: 'Standard approval process',
    reference: 'INV-001'
  },
  {
    id: '3',
    entityType: 'JournalEntry',
    entityId: 'JE-2024-001',
    action: AuditAction.POST,
    oldValues: { status: 'approved' },
    newValues: { status: 'posted', postedAt: new Date('2024-04-15T11:30:00') },
    userId: 'system',
    userName: 'System',
    userRole: 'System',
    ipAddress: '192.168.1.1',
    userAgent: 'System Process',
    timestamp: new Date('2024-04-15T11:30:00'),
    reason: 'Automated posting',
    reference: 'INV-001'
  },
  {
    id: '4',
    entityType: 'VendorInvoice',
    entityId: 'VI-2024-002',
    action: AuditAction.UPDATE,
    oldValues: { amount: 1000, status: 'draft' },
    newValues: { amount: 1200, status: 'pending_approval' },
    userId: 'mike.wilson',
    userName: 'Mike Wilson',
    userRole: 'Accounts Payable',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0...',
    timestamp: new Date('2024-04-16T09:45:00'),
    reason: 'Invoice amount correction',
    reference: 'PO-002'
  }
];

const mockTaxConfigurations: TaxConfiguration[] = [
  {
    id: '1',
    taxType: TaxType.VAT,
    taxName: 'Egyptian VAT',
    taxCode: 'EG-VAT',
    taxRate: 14,
    isCompound: false,
    country: 'Egypt',
    effectiveDate: new Date('2024-01-01'),
    taxAccountId: 'tax-vat-account',
    liabilityAccountId: 'vat-liability-account',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '2',
    taxType: TaxType.WITHHOLDING_TAX,
    taxName: 'Withholding Tax - Services',
    taxCode: 'EG-WHT-SVC',
    taxRate: 2.5,
    isCompound: false,
    country: 'Egypt',
    effectiveDate: new Date('2024-01-01'),
    taxAccountId: 'tax-wht-account',
    liabilityAccountId: 'wht-liability-account',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '3',
    taxType: TaxType.SALES_TAX,
    taxName: 'Sales Tax - US',
    taxCode: 'US-SALES-TAX',
    taxRate: 8.25,
    isCompound: false,
    country: 'United States',
    state: 'Texas',
    effectiveDate: new Date('2024-01-01'),
    taxAccountId: 'tax-sales-account',
    liabilityAccountId: 'sales-tax-liability-account',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'admin',
    updatedBy: 'admin'
  }
];

const mockTaxTransactions: TaxTransaction[] = [
  {
    id: '1',
    transactionId: 'INV-001',
    transactionType: 'Sales Invoice',
    taxType: TaxType.VAT,
    taxRate: 14,
    taxableAmount: 1000,
    taxAmount: 140,
    country: 'Egypt',
    status: TaxStatus.CALCULATED,
    createdAt: new Date('2024-04-15'),
    updatedAt: new Date('2024-04-15'),
    createdBy: 'system',
    updatedBy: 'system'
  },
  {
    id: '2',
    transactionId: 'PO-002',
    transactionType: 'Purchase Invoice',
    taxType: TaxType.WITHHOLDING_TAX,
    taxRate: 2.5,
    taxableAmount: 5000,
    taxAmount: 125,
    country: 'Egypt',
    status: TaxStatus.FILED,
    filedDate: new Date('2024-04-20'),
    createdAt: new Date('2024-04-16'),
    updatedAt: new Date('2024-04-20'),
    createdBy: 'system',
    updatedBy: 'system'
  }
];

export function ComplianceAudit() {
  const [auditTrails, setAuditTrails] = useState<AuditTrail[]>(mockAuditTrails);
  const [taxConfigurations, setTaxConfigurations] = useState<TaxConfiguration[]>(mockTaxConfigurations);
  const [taxTransactions, setTaxTransactions] = useState<TaxTransaction[]>(mockTaxTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [selectedAudit, setSelectedAudit] = useState<AuditTrail | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isTaxConfigDialogOpen, setIsTaxConfigDialogOpen] = useState(false);

  const filteredAuditTrails = auditTrails.filter(audit => {
    const matchesSearch = 
      audit.entityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.reason?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = actionFilter === 'all' || audit.action === actionFilter;
    const matchesEntity = entityFilter === 'all' || audit.entityType === entityFilter;
    
    return matchesSearch && matchesAction && matchesEntity;
  });

  const getActionBadge = (action: AuditAction) => {
    const configs = {
      [AuditAction.CREATE]: { color: 'bg-green-100 text-green-800', icon: Plus, text: 'Create' },
      [AuditAction.READ]: { color: 'bg-blue-100 text-blue-800', icon: Eye, text: 'Read' },
      [AuditAction.UPDATE]: { color: 'bg-yellow-100 text-yellow-800', icon: Edit, text: 'Update' },
      [AuditAction.DELETE]: { color: 'bg-red-100 text-red-800', icon: Trash2, text: 'Delete' },
      [AuditAction.APPROVE]: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Approve' },
      [AuditAction.REJECT]: { color: 'bg-red-100 text-red-800', icon: AlertTriangle, text: 'Reject' },
      [AuditAction.POST]: { color: 'bg-blue-100 text-blue-800', icon: Database, text: 'Post' },
      [AuditAction.REVERSE]: { color: 'bg-orange-100 text-orange-800', icon: RefreshCw, text: 'Reverse' }
    };

    const config = configs[action];
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const getTaxTypeBadge = (type: TaxType) => {
    const configs = {
      [TaxType.VAT]: { color: 'bg-blue-100 text-blue-800', text: 'VAT' },
      [TaxType.GST]: { color: 'bg-green-100 text-green-800', text: 'GST' },
      [TaxType.SALES_TAX]: { color: 'bg-purple-100 text-purple-800', text: 'Sales Tax' },
      [TaxType.WITHHOLDING_TAX]: { color: 'bg-orange-100 text-orange-800', text: 'WHT' },
      [TaxType.INCOME_TAX]: { color: 'bg-red-100 text-red-800', text: 'Income Tax' },
      [TaxType.CORPORATE_TAX]: { color: 'bg-indigo-100 text-indigo-800', text: 'Corporate Tax' },
      [TaxType.CUSTOM]: { color: 'bg-gray-100 text-gray-800', text: 'Custom' }
    };

    const config = configs[type];
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  const getTaxStatusBadge = (status: TaxStatus) => {
    const configs = {
      [TaxStatus.PENDING]: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      [TaxStatus.CALCULATED]: { color: 'bg-blue-100 text-blue-800', icon: DollarSign },
      [TaxStatus.FILED]: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      [TaxStatus.PAID]: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      [TaxStatus.OVERDUE]: { color: 'bg-red-100 text-red-800', icon: AlertTriangle }
    };

    const config = configs[status];
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Compliance & Audit</h2>
          <p className="text-muted-foreground">Tax management, audit trails, and regulatory compliance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Audit Log
          </Button>
          <Button onClick={() => setIsTaxConfigDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tax Configuration
          </Button>
        </div>
      </div>

      <Tabs defaultValue="audit-trail" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="audit-trail">Audit Trail</TabsTrigger>
          <TabsTrigger value="tax-management">Tax Management</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="audit-trail" className="space-y-6">
          {/* Audit Trail Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{auditTrails.length}</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approvals</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {auditTrails.filter(a => a.action === AuditAction.APPROVE).length}
                </div>
                <p className="text-xs text-muted-foreground">Pending reviews</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Changes</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {auditTrails.filter(a => a.action === AuditAction.UPDATE || a.action === AuditAction.DELETE).length}
                </div>
                <p className="text-xs text-muted-foreground">Modifications</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(auditTrails.map(a => a.userId)).size}
                </div>
                <p className="text-xs text-muted-foreground">Unique users</p>
              </CardContent>
            </Card>
          </div>

          {/* Audit Trail Table */}
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by entity, user, or reason..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={actionFilter} onValueChange={setActionFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value={AuditAction.CREATE}>Create</SelectItem>
                      <SelectItem value={AuditAction.UPDATE}>Update</SelectItem>
                      <SelectItem value={AuditAction.DELETE}>Delete</SelectItem>
                      <SelectItem value={AuditAction.APPROVE}>Approve</SelectItem>
                      <SelectItem value={AuditAction.POST}>Post</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={entityFilter} onValueChange={setEntityFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by entity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Entities</SelectItem>
                      <SelectItem value="JournalEntry">Journal Entry</SelectItem>
                      <SelectItem value="VendorInvoice">Vendor Invoice</SelectItem>
                      <SelectItem value="CustomerInvoice">Customer Invoice</SelectItem>
                      <SelectItem value="Payment">Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium">Timestamp</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Entity</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Action</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">User</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Reason</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAuditTrails.map((audit) => (
                        <tr key={audit.id} className="border-b">
                          <td className="p-4">
                            <div className="text-sm">
                              {audit.timestamp.toLocaleString()}
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <div className="font-medium">{audit.entityType}</div>
                              <div className="text-sm text-muted-foreground">{audit.entityId}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            {getActionBadge(audit.action)}
                          </td>
                          <td className="p-4">
                            <div>
                              <div className="font-medium">{audit.userName}</div>
                              <div className="text-sm text-muted-foreground">{audit.userRole}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="max-w-xs truncate">
                              {audit.reason || 'No reason provided'}
                            </div>
                          </td>
                          <td className="p-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedAudit(audit);
                                setIsViewDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax-management" className="space-y-6">
          {/* Tax Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Tax Configurations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium">Tax Code</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Tax Name</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Rate</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Jurisdiction</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {taxConfigurations.map((config) => (
                        <tr key={config.id} className="border-b">
                          <td className="p-4">
                            <div className="font-mono text-sm font-medium">{config.taxCode}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium">{config.taxName}</div>
                          </td>
                          <td className="p-4">
                            {getTaxTypeBadge(config.taxType)}
                          </td>
                          <td className="p-4">
                            <div className="font-medium">{config.taxRate}%</div>
                          </td>
                          <td className="p-4">
                            <div>
                              <div className="font-medium">{config.country}</div>
                              {config.state && (
                                <div className="text-sm text-muted-foreground">{config.state}</div>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant={config.isActive ? 'default' : 'secondary'}>
                              {config.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
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

          {/* Tax Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Tax Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium">Transaction</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Tax Type</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Amount</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Tax Amount</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {taxTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b">
                          <td className="p-4">
                            <div>
                              <div className="font-medium">{transaction.transactionId}</div>
                              <div className="text-sm text-muted-foreground">{transaction.transactionType}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium">{transaction.transactionType}</div>
                          </td>
                          <td className="p-4">
                            {getTaxTypeBadge(transaction.taxType)}
                          </td>
                          <td className="p-4">
                            <div className="font-medium">${transaction.taxableAmount.toLocaleString()}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium">${transaction.taxAmount.toLocaleString()}</div>
                          </td>
                          <td className="p-4">
                            {getTaxStatusBadge(transaction.status)}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
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
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          {/* Compliance Reports */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">IFRS Compliance</CardTitle>
                    <p className="text-xs text-muted-foreground">International standards</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button size="sm" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">SOX Compliance</CardTitle>
                    <p className="text-xs text-muted-foreground">Sarbanes-Oxley Act</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button size="sm" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Country-Specific</CardTitle>
                    <p className="text-xs text-muted-foreground">Local regulations</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button size="sm" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* View Audit Trail Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Audit Trail Details</DialogTitle>
            <DialogDescription>
              Complete audit information for {selectedAudit?.entityType} {selectedAudit?.entityId}
            </DialogDescription>
          </DialogHeader>
          
          {selectedAudit && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Entity Type</Label>
                  <div className="text-sm font-medium">{selectedAudit.entityType}</div>
                </div>
                <div>
                  <Label>Entity ID</Label>
                  <div className="text-sm font-medium">{selectedAudit.entityId}</div>
                </div>
                <div>
                  <Label>Action</Label>
                  <div>{getActionBadge(selectedAudit.action)}</div>
                </div>
                <div>
                  <Label>Timestamp</Label>
                  <div className="text-sm font-medium">{selectedAudit.timestamp.toLocaleString()}</div>
                </div>
                <div>
                  <Label>User</Label>
                  <div className="text-sm font-medium">{selectedAudit.userName} ({selectedAudit.userRole})</div>
                </div>
                <div>
                  <Label>IP Address</Label>
                  <div className="text-sm font-medium">{selectedAudit.ipAddress}</div>
                </div>
                <div>
                  <Label>Reason</Label>
                  <div className="text-sm font-medium">{selectedAudit.reason || 'No reason provided'}</div>
                </div>
                <div>
                  <Label>Reference</Label>
                  <div className="text-sm font-medium">{selectedAudit.reference || 'N/A'}</div>
                </div>
              </div>
              
              {selectedAudit.oldValues && (
                <div>
                  <Label>Previous Values</Label>
                  <div className="p-3 bg-gray-50 border rounded text-sm">
                    <pre>{JSON.stringify(selectedAudit.oldValues, null, 2)}</pre>
                  </div>
                </div>
              )}
              
              {selectedAudit.newValues && (
                <div>
                  <Label>New Values</Label>
                  <div className="p-3 bg-gray-50 border rounded text-sm">
                    <pre>{JSON.stringify(selectedAudit.newValues, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tax Configuration Dialog */}
      <Dialog open={isTaxConfigDialogOpen} onOpenChange={setIsTaxConfigDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tax Configuration</DialogTitle>
            <DialogDescription>
              Configure tax rates and rules for different jurisdictions
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="taxCode">Tax Code</Label>
                <Input id="taxCode" placeholder="EG-VAT" />
              </div>
              <div>
                <Label htmlFor="taxName">Tax Name</Label>
                <Input id="taxName" placeholder="Egyptian VAT" />
              </div>
              <div>
                <Label htmlFor="taxType">Tax Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tax type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TaxType.VAT}>VAT</SelectItem>
                    <SelectItem value={TaxType.GST}>GST</SelectItem>
                    <SelectItem value={TaxType.SALES_TAX}>Sales Tax</SelectItem>
                    <SelectItem value={TaxType.WITHHOLDING_TAX}>Withholding Tax</SelectItem>
                    <SelectItem value={TaxType.INCOME_TAX}>Income Tax</SelectItem>
                    <SelectItem value={TaxType.CORPORATE_TAX}>Corporate Tax</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input id="taxRate" type="number" placeholder="14" />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" placeholder="Egypt" />
              </div>
              <div>
                <Label htmlFor="state">State/Province</Label>
                <Input id="state" placeholder="Optional" />
              </div>
              <div>
                <Label htmlFor="effectiveDate">Effective Date</Label>
                <Input id="effectiveDate" type="date" />
              </div>
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input id="expiryDate" type="date" />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTaxConfigDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsTaxConfigDialogOpen(false)}>
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
