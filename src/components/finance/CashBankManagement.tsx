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
  Banknote, 
  Plus, 
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Building,
  Users,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpDown,
  ArrowDown,
  Download,
  Upload,
  FileText,
  Activity,
  Target,
  PieChart,
  BarChart3,
  Wallet,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Zap
} from 'lucide-react';
import { 
  BankAccount, 
  BankReconciliation, 
  ReconciliationItem, 
  BankAccountType, 
  ReconciliationStatus, 
  ReconciliationItemType 
} from '@/lib/models/finance';

// Mock data
const mockBankAccounts: BankAccount[] = [
  {
    id: '1',
    accountNumber: '001-1234567',
    accountName: 'Main Operating Account',
    bankName: 'National Bank of Egypt',
    bankCode: 'NBE',
    branchCode: '001',
    accountType: BankAccountType.CHECKING,
    currency: 'EGP',
    isActive: true,
    currentBalance: 1250000,
    availableBalance: 1180000,
    lastReconciledBalance: 1200000,
    lastReconciledDate: new Date('2024-04-15'),
    companyId: 'company1',
    glAccountId: '1112',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-04-20'),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '2',
    accountNumber: '002-7654321',
    accountName: 'USD Foreign Account',
    bankName: 'Commercial International Bank',
    bankCode: 'CIB',
    branchCode: '002',
    accountType: BankAccountType.CHECKING,
    currency: 'USD',
    isActive: true,
    currentBalance: 85000,
    availableBalance: 82000,
    lastReconciledBalance: 80000,
    lastReconciledDate: new Date('2024-04-10'),
    companyId: 'company1',
    glAccountId: '1113',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-04-18'),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '3',
    accountNumber: '003-9876543',
    accountName: 'Savings Account',
    bankName: 'Banque Misr',
    bankCode: 'BM',
    branchCode: '003',
    accountType: BankAccountType.SAVINGS,
    currency: 'EGP',
    isActive: true,
    currentBalance: 500000,
    availableBalance: 500000,
    lastReconciledBalance: 495000,
    lastReconciledDate: new Date('2024-04-12'),
    companyId: 'company1',
    glAccountId: '1114',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-04-15'),
    createdBy: 'admin',
    updatedBy: 'admin'
  }
];

const mockReconciliations: BankReconciliation[] = [
  {
    id: '1',
    bankAccountId: '1',
    bankAccountName: 'Main Operating Account',
    reconciliationDate: new Date('2024-04-15'),
    statementBalance: 1200000,
    bookBalance: 1195000,
    reconciledBalance: 1200000,
    status: ReconciliationStatus.COMPLETED,
    items: [
      {
        id: '1',
        transactionDate: new Date('2024-04-14'),
        description: 'Customer Payment - ABC Corp',
        amount: 50000,
        type: ReconciliationItemType.DEPOSIT,
        status: ReconciliationStatus.COMPLETED,
        journalEntryId: 'JE-2024-045',
        bankReference: 'CHQ-001234'
      },
      {
        id: '2',
        transactionDate: new Date('2024-04-13'),
        description: 'Vendor Payment - XYZ Suppliers',
        amount: -25000,
        type: ReconciliationItemType.WITHDRAWAL,
        status: ReconciliationStatus.COMPLETED,
        paymentId: 'PAY-2024-023',
        bankReference: 'CHQ-001235'
      }
    ],
    createdAt: new Date('2024-04-15'),
    updatedAt: new Date('2024-04-15'),
    createdBy: 'finance.team',
    updatedBy: 'finance.team'
  }
];

export function CashBankManagement() {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(mockBankAccounts);
  const [reconciliations, setReconciliations] = useState<BankReconciliation[]>(mockReconciliations);
  const [searchQuery, setSearchQuery] = useState('');
  const [currencyFilter, setCurrencyFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [selectedReconciliation, setSelectedReconciliation] = useState<BankReconciliation | null>(null);
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false);
  const [isEditAccountDialogOpen, setIsEditAccountDialogOpen] = useState(false);
  const [isViewAccountDialogOpen, setIsViewAccountDialogOpen] = useState(false);
  const [isReconcileDialogOpen, setIsReconcileDialogOpen] = useState(false);
  const [isViewReconciliationDialogOpen, setIsViewReconciliationDialogOpen] = useState(false);

  const filteredAccounts = bankAccounts.filter(account => {
    const matchesSearch = 
      account.accountNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.bankName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCurrency = currencyFilter === 'all' || account.currency === currencyFilter;
    const matchesType = typeFilter === 'all' || account.accountType === typeFilter;
    
    return matchesSearch && matchesCurrency && matchesType;
  });

  const getAccountTypeBadge = (type: BankAccountType) => {
    const configs = {
      [BankAccountType.CHECKING]: { color: 'bg-blue-100 text-blue-800', text: 'Checking' },
      [BankAccountType.SAVINGS]: { color: 'bg-green-100 text-green-800', text: 'Savings' },
      [BankAccountType.MONEY_MARKET]: { color: 'bg-purple-100 text-purple-800', text: 'Money Market' },
      [BankAccountType.CREDIT_LINE]: { color: 'bg-orange-100 text-orange-800', text: 'Credit Line' }
    };

    const config = configs[type];
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  const getStatusBadge = (status: ReconciliationStatus) => {
    const configs = {
      [ReconciliationStatus.PENDING]: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pending' },
      [ReconciliationStatus.IN_PROGRESS]: { color: 'bg-blue-100 text-blue-800', icon: Activity, text: 'In Progress' },
      [ReconciliationStatus.COMPLETED]: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Completed' },
      [ReconciliationStatus.DISPUTED]: { color: 'bg-red-100 text-red-800', icon: AlertTriangle, text: 'Disputed' }
    };

    const config = configs[status];
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const getItemTypeBadge = (type: ReconciliationItemType) => {
    const configs = {
      [ReconciliationItemType.DEPOSIT]: { color: 'bg-green-100 text-green-800', text: 'Deposit', icon: ArrowUpDown },
      [ReconciliationItemType.WITHDRAWAL]: { color: 'bg-red-100 text-red-800', text: 'Withdrawal', icon: ArrowDown },
      [ReconciliationItemType.CHECK]: { color: 'bg-blue-100 text-blue-800', text: 'Check', icon: FileText },
      [ReconciliationItemType.TRANSFER]: { color: 'bg-purple-100 text-purple-800', text: 'Transfer', icon: ArrowRight },
      [ReconciliationItemType.FEE]: { color: 'bg-orange-100 text-orange-800', text: 'Fee', icon: DollarSign },
      [ReconciliationItemType.INTEREST]: { color: 'bg-cyan-100 text-cyan-800', text: 'Interest', icon: TrendingUp }
    };

    const config = configs[type];
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const totalCashBalance = bankAccounts.reduce((sum, account) => sum + account.currentBalance, 0);
  const totalAvailableBalance = bankAccounts.reduce((sum, account) => sum + account.availableBalance, 0);
  const accountsNeedReconciliation = bankAccounts.filter(account => {
    if (!account.lastReconciledDate) return true;
    const daysSinceReconciliation = (new Date().getTime() - account.lastReconciledDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceReconciliation > 30;
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Cash & Bank Management</h2>
          <p className="text-muted-foreground">Manage bank accounts, reconciliation, and cash flow forecasting</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Statement
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reconcile
          </Button>
          <Button onClick={() => setIsAddAccountDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cash Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">EGP {totalCashBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across {bankAccounts.length} accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">EGP {totalAvailableBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Ready for use
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accounts Need Reconciliation</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accountsNeedReconciliation}</div>
            <p className="text-xs text-muted-foreground">
              Over 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Reconciliations</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reconciliations.filter(r => r.status === ReconciliationStatus.IN_PROGRESS).length}
            </div>
            <p className="text-xs text-muted-foreground">
              In progress
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bank-accounts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bank-accounts">Bank Accounts</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
          <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="bank-accounts" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Bank Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by account number, name, or bank..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Currencies</SelectItem>
                      <SelectItem value="EGP">EGP</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value={BankAccountType.CHECKING}>Checking</SelectItem>
                      <SelectItem value={BankAccountType.SAVINGS}>Savings</SelectItem>
                      <SelectItem value={BankAccountType.MONEY_MARKET}>Money Market</SelectItem>
                      <SelectItem value={BankAccountType.CREDIT_LINE}>Credit Line</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bank Accounts Table */}
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium">Account</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Bank</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Currency</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Current Balance</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Available Balance</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Last Reconciled</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAccounts.map((account) => (
                        <tr key={account.id} className="border-b">
                          <td className="p-4">
                            <div>
                              <div className="font-medium">{account.accountName}</div>
                              <div className="text-sm text-muted-foreground">{account.accountNumber}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <div className="font-medium">{account.bankName}</div>
                              <div className="text-sm text-muted-foreground">{account.bankCode}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            {getAccountTypeBadge(account.accountType)}
                          </td>
                          <td className="p-4">
                            <div className="text-sm font-medium">{account.currency}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm font-medium">
                              {account.currency} {account.currentBalance.toLocaleString()}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm font-medium">
                              {account.currency} {account.availableBalance.toLocaleString()}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">
                              {account.lastReconciledDate 
                                ? account.lastReconciledDate.toLocaleDateString()
                                : 'Never'
                              }
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedAccount(account);
                                  setIsViewAccountDialogOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedAccount(account);
                                  setIsEditAccountDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedAccount(account);
                                  setIsReconcileDialogOpen(true);
                                }}
                              >
                                <RefreshCw className="h-4 w-4" />
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

        <TabsContent value="reconciliation" className="space-y-6">
          {/* Reconciliation History */}
          <Card>
            <CardHeader>
              <CardTitle>Bank Reconciliation History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reconciliations.map((reconciliation) => (
                  <div key={reconciliation.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">{reconciliation.bankAccountName}</h4>
                        <p className="text-sm text-muted-foreground">
                          Reconciled on {reconciliation.reconciliationDate.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            Statement: EGP {reconciliation.statementBalance.toLocaleString()}
                          </div>
                          <div className="text-sm font-medium">
                            Book: EGP {reconciliation.bookBalance.toLocaleString()}
                          </div>
                        </div>
                        {getStatusBadge(reconciliation.status)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedReconciliation(reconciliation);
                            setIsViewReconciliationDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Items</div>
                        <div className="font-medium">{reconciliation.items.length}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Variance</div>
                        <div className="font-medium">
                          EGP {(reconciliation.statementBalance - reconciliation.bookBalance).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Reconciled By</div>
                        <div className="font-medium">{reconciliation.createdBy}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Status</div>
                        <div className="font-medium">{reconciliation.status}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cash-flow" className="space-y-6">
          {/* Cash Flow Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Cash Inflows</span>
                    </div>
                    <div className="text-sm font-medium">EGP 2,450,000</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium">Cash Outflows</span>
                    </div>
                    <div className="text-sm font-medium">EGP 1,890,000</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '58%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Net Cash Flow</span>
                    </div>
                    <div className="text-sm font-bold text-green-600">EGP 560,000</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Balance Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bankAccounts.map((account, index) => {
                    const percentage = (account.currentBalance / totalCashBalance) * 100;
                    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'];
                    const color = colors[index % colors.length];
                    
                    return (
                      <div key={account.id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{account.accountName}</span>
                          <span className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className={`${color} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {account.currency} {account.currentBalance.toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-6">
          {/* Cash Flow Forecasting */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Expected Cash Inflows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium">Customer Payments</div>
                      <div className="text-sm text-muted-foreground">Next 30 days</div>
                    </div>
                    <div className="text-green-600 font-medium">EGP 1,200,000</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium">Investment Returns</div>
                      <div className="text-sm text-muted-foreground">Expected</div>
                    </div>
                    <div className="text-blue-600 font-medium">EGP 45,000</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <div className="font-medium">Loan Disbursements</div>
                      <div className="text-sm text-muted-foreground">Approved</div>
                    </div>
                    <div className="text-purple-600 font-medium">EGP 300,000</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expected Cash Outflows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <div className="font-medium">Vendor Payments</div>
                      <div className="text-sm text-muted-foreground">Due next 30 days</div>
                    </div>
                    <div className="text-red-600 font-medium">EGP 850,000</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <div className="font-medium">Payroll</div>
                      <div className="text-sm text-muted-foreground">Monthly</div>
                    </div>
                    <div className="text-orange-600 font-medium">EGP 450,000</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <div className="font-medium">Operating Expenses</div>
                      <div className="text-sm text-muted-foreground">Utilities, Rent</div>
                    </div>
                    <div className="text-yellow-600 font-medium">EGP 120,000</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Forecast Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Forecast Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">EGP 245,000</div>
                  <div className="text-sm text-muted-foreground">Expected Net Cash Flow</div>
                  <div className="text-xs text-green-600 mt-1">Next 30 days</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">EGP 1,745,000</div>
                  <div className="text-sm text-muted-foreground">Projected Ending Balance</div>
                  <div className="text-xs text-blue-600 mt-1">Current + Net Flow</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">45 days</div>
                  <div className="text-sm text-muted-foreground">Cash Runway</div>
                  <div className="text-xs text-purple-600 mt-1">At current burn rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Bank Account Dialog */}
      <Dialog open={isAddAccountDialogOpen} onOpenChange={setIsAddAccountDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Bank Account</DialogTitle>
            <DialogDescription>
              Add a new bank account for cash management
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="accountName">Account Name</Label>
                <Input id="accountName" placeholder="Main Operating Account" />
              </div>
              <div>
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input id="accountNumber" placeholder="001-1234567" />
              </div>
              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <Input id="bankName" placeholder="National Bank of Egypt" />
              </div>
              <div>
                <Label htmlFor="bankCode">Bank Code</Label>
                <Input id="bankCode" placeholder="NBE" />
              </div>
              <div>
                <Label htmlFor="accountType">Account Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={BankAccountType.CHECKING}>Checking</SelectItem>
                    <SelectItem value={BankAccountType.SAVINGS}>Savings</SelectItem>
                    <SelectItem value={BankAccountType.MONEY_MARKET}>Money Market</SelectItem>
                    <SelectItem value={BankAccountType.CREDIT_LINE}>Credit Line</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EGP">EGP</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="currentBalance">Current Balance</Label>
                <Input id="currentBalance" type="number" placeholder="0.00" />
              </div>
              <div>
                <Label htmlFor="availableBalance">Available Balance</Label>
                <Input id="availableBalance" type="number" placeholder="0.00" />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddAccountDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAddAccountDialogOpen(false)}>
              Add Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Bank Account Dialog */}
      <Dialog open={isViewAccountDialogOpen} onOpenChange={setIsViewAccountDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bank Account Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedAccount?.accountName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedAccount && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Account Name</Label>
                  <div className="text-sm font-medium">{selectedAccount.accountName}</div>
                </div>
                <div>
                  <Label>Account Number</Label>
                  <div className="text-sm font-medium">{selectedAccount.accountNumber}</div>
                </div>
                <div>
                  <Label>Bank Name</Label>
                  <div className="text-sm font-medium">{selectedAccount.bankName}</div>
                </div>
                <div>
                  <Label>Bank Code</Label>
                  <div className="text-sm font-medium">{selectedAccount.bankCode}</div>
                </div>
                <div>
                  <Label>Account Type</Label>
                  <div>{getAccountTypeBadge(selectedAccount.accountType)}</div>
                </div>
                <div>
                  <Label>Currency</Label>
                  <div className="text-sm font-medium">{selectedAccount.currency}</div>
                </div>
                <div>
                  <Label>Current Balance</Label>
                  <div className="text-sm font-medium">
                    {selectedAccount.currency} {selectedAccount.currentBalance.toLocaleString()}
                  </div>
                </div>
                <div>
                  <Label>Available Balance</Label>
                  <div className="text-sm font-medium">
                    {selectedAccount.currency} {selectedAccount.availableBalance.toLocaleString()}
                  </div>
                </div>
                <div>
                  <Label>Last Reconciled</Label>
                  <div className="text-sm font-medium">
                    {selectedAccount.lastReconciledDate 
                      ? selectedAccount.lastReconciledDate.toLocaleDateString()
                      : 'Never'
                    }
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div>
                    <Badge variant={selectedAccount.isActive ? 'default' : 'secondary'}>
                      {selectedAccount.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewAccountDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsViewAccountDialogOpen(false);
              setIsEditAccountDialogOpen(true);
            }}>
              Edit Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
