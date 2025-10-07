'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Calculator, 
  Plus, 
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  ChevronRight,
  ChevronDown,
  Building,
  DollarSign,
  Settings,
  Globe,
  FileText
} from 'lucide-react';
import { ChartOfAccount, AccountType, BalanceType, LocalGAAP } from '@/lib/models/finance';

// Mock data
const mockAccounts: ChartOfAccount[] = [
  {
    id: '1',
    accountCode: '1000',
    accountName: 'Assets',
    accountType: AccountType.ASSETS,
    level: 1,
    fullPath: 'Assets',
    balanceType: BalanceType.DEBIT,
    isActive: true,
    isSystemAccount: false,
    companyId: 'company1',
    companyName: 'OryxPro Ltd',
    currency: 'USD',
    localGAAP: LocalGAAP.IFRS,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '2',
    accountCode: '1100',
    accountName: 'Current Assets',
    accountType: AccountType.ASSETS,
    parentAccountId: '1',
    level: 2,
    fullPath: 'Assets > Current Assets',
    balanceType: BalanceType.DEBIT,
    isActive: true,
    isSystemAccount: false,
    companyId: 'company1',
    companyName: 'OryxPro Ltd',
    currency: 'USD',
    localGAAP: LocalGAAP.IFRS,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '3',
    accountCode: '1110',
    accountName: 'Cash and Cash Equivalents',
    accountType: AccountType.ASSETS,
    parentAccountId: '2',
    level: 3,
    fullPath: 'Assets > Current Assets > Cash and Cash Equivalents',
    balanceType: BalanceType.DEBIT,
    isActive: true,
    isSystemAccount: false,
    companyId: 'company1',
    companyName: 'OryxPro Ltd',
    currency: 'USD',
    localGAAP: LocalGAAP.IFRS,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '4',
    accountCode: '1111',
    accountName: 'Petty Cash',
    accountType: AccountType.ASSETS,
    parentAccountId: '3',
    level: 4,
    fullPath: 'Assets > Current Assets > Cash and Cash Equivalents > Petty Cash',
    balanceType: BalanceType.DEBIT,
    isActive: true,
    isSystemAccount: false,
    companyId: 'company1',
    companyName: 'OryxPro Ltd',
    currency: 'USD',
    localGAAP: LocalGAAP.IFRS,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '5',
    accountCode: '1112',
    accountName: 'Bank Account - Main',
    accountType: AccountType.ASSETS,
    parentAccountId: '3',
    level: 4,
    fullPath: 'Assets > Current Assets > Cash and Cash Equivalents > Bank Account - Main',
    balanceType: BalanceType.DEBIT,
    isActive: true,
    isSystemAccount: false,
    companyId: 'company1',
    companyName: 'OryxPro Ltd',
    currency: 'USD',
    localGAAP: LocalGAAP.IFRS,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '6',
    accountCode: '1120',
    accountName: 'Accounts Receivable',
    accountType: AccountType.ASSETS,
    parentAccountId: '2',
    level: 3,
    fullPath: 'Assets > Current Assets > Accounts Receivable',
    balanceType: BalanceType.DEBIT,
    isActive: true,
    isSystemAccount: false,
    companyId: 'company1',
    companyName: 'OryxPro Ltd',
    currency: 'USD',
    localGAAP: LocalGAAP.IFRS,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '7',
    accountCode: '2000',
    accountName: 'Liabilities',
    accountType: AccountType.LIABILITIES,
    level: 1,
    fullPath: 'Liabilities',
    balanceType: BalanceType.CREDIT,
    isActive: true,
    isSystemAccount: false,
    companyId: 'company1',
    companyName: 'OryxPro Ltd',
    currency: 'USD',
    localGAAP: LocalGAAP.IFRS,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '8',
    accountCode: '2100',
    accountName: 'Current Liabilities',
    accountType: AccountType.LIABILITIES,
    parentAccountId: '7',
    level: 2,
    fullPath: 'Liabilities > Current Liabilities',
    balanceType: BalanceType.CREDIT,
    isActive: true,
    isSystemAccount: false,
    companyId: 'company1',
    companyName: 'OryxPro Ltd',
    currency: 'USD',
    localGAAP: LocalGAAP.IFRS,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '9',
    accountCode: '2110',
    accountName: 'Accounts Payable',
    accountType: AccountType.LIABILITIES,
    parentAccountId: '8',
    level: 3,
    fullPath: 'Liabilities > Current Liabilities > Accounts Payable',
    balanceType: BalanceType.CREDIT,
    isActive: true,
    isSystemAccount: false,
    companyId: 'company1',
    companyName: 'OryxPro Ltd',
    currency: 'USD',
    localGAAP: LocalGAAP.IFRS,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '10',
    accountCode: '3000',
    accountName: 'Equity',
    accountType: AccountType.EQUITY,
    level: 1,
    fullPath: 'Equity',
    balanceType: BalanceType.CREDIT,
    isActive: true,
    isSystemAccount: false,
    companyId: 'company1',
    companyName: 'OryxPro Ltd',
    currency: 'USD',
    localGAAP: LocalGAAP.IFRS,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '11',
    accountCode: '4000',
    accountName: 'Income',
    accountType: AccountType.INCOME,
    level: 1,
    fullPath: 'Income',
    balanceType: BalanceType.CREDIT,
    isActive: true,
    isSystemAccount: false,
    companyId: 'company1',
    companyName: 'OryxPro Ltd',
    currency: 'USD',
    localGAAP: LocalGAAP.IFRS,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '12',
    accountCode: '5000',
    accountName: 'Expenses',
    accountType: AccountType.EXPENSES,
    level: 1,
    fullPath: 'Expenses',
    balanceType: BalanceType.DEBIT,
    isActive: true,
    isSystemAccount: false,
    companyId: 'company1',
    companyName: 'OryxPro Ltd',
    currency: 'USD',
    localGAAP: LocalGAAP.IFRS,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'admin',
    updatedBy: 'admin'
  }
];

export function ChartOfAccounts() {
  const [accounts, setAccounts] = useState<ChartOfAccount[]>(mockAccounts);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set(['1', '2', '7', '8', '10', '11', '12']));
  const [selectedAccount, setSelectedAccount] = useState<ChartOfAccount | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = 
      account.accountCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.fullPath.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || account.accountType === typeFilter;
    const matchesCompany = companyFilter === 'all' || account.companyId === companyFilter;
    
    return matchesSearch && matchesType && matchesCompany;
  });

  const getAccountTypeBadge = (type: AccountType) => {
    const configs = {
      [AccountType.ASSETS]: { color: 'bg-blue-100 text-blue-800', text: 'Assets' },
      [AccountType.LIABILITIES]: { color: 'bg-red-100 text-red-800', text: 'Liabilities' },
      [AccountType.EQUITY]: { color: 'bg-green-100 text-green-800', text: 'Equity' },
      [AccountType.INCOME]: { color: 'bg-purple-100 text-purple-800', text: 'Income' },
      [AccountType.EXPENSES]: { color: 'bg-orange-100 text-orange-800', text: 'Expenses' }
    };

    const config = configs[type];
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  const getBalanceTypeBadge = (balanceType: BalanceType) => {
    return balanceType === BalanceType.DEBIT ? 
      <Badge className="bg-blue-100 text-blue-800">Debit</Badge> :
      <Badge className="bg-green-100 text-green-800">Credit</Badge>;
  };

  const toggleExpand = (accountId: string) => {
    const newExpanded = new Set(expandedAccounts);
    if (newExpanded.has(accountId)) {
      newExpanded.delete(accountId);
    } else {
      newExpanded.add(accountId);
    }
    setExpandedAccounts(newExpanded);
  };

  const getChildAccounts = (parentId: string) => {
    return filteredAccounts.filter(account => account.parentAccountId === parentId);
  };

  const renderAccountTree = (parentId: string | null, level: number = 0) => {
    const childAccounts = filteredAccounts.filter(account => 
      account.parentAccountId === parentId
    );

    return childAccounts.map(account => {
      const hasChildren = filteredAccounts.some(child => child.parentAccountId === account.id);
      const isExpanded = expandedAccounts.has(account.id || '');

      return (
        <React.Fragment key={account.id}>
          <tr className="border-b hover:bg-muted/50">
            <td className="p-4" style={{ paddingLeft: `${level * 20 + 16}px` }}>
              <div className="flex items-center gap-2">
                {hasChildren ? (
                  <button
                    onClick={() => toggleExpand(account.id || '')}
                    className="p-1 hover:bg-muted rounded"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                ) : (
                  <div className="w-6" />
                )}
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-medium">{account.accountCode}</span>
                  <span className="font-medium">{account.accountName}</span>
                </div>
              </div>
            </td>
            <td className="p-4">
              {getAccountTypeBadge(account.accountType)}
            </td>
            <td className="p-4">
              {getBalanceTypeBadge(account.balanceType)}
            </td>
            <td className="p-4">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{account.currency}</span>
              </div>
            </td>
            <td className="p-4">
              <Badge variant={account.isActive ? 'default' : 'secondary'}>
                {account.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </td>
            <td className="p-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedAccount(account);
                    setIsViewDialogOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedAccount(account);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                {!account.isSystemAccount && (
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </td>
          </tr>
          {hasChildren && isExpanded && renderAccountTree(account.id, level + 1)}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Chart of Accounts</h2>
          <p className="text-muted-foreground">Manage your accounting structure and account hierarchy</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Account Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by account code, name, or path..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value={AccountType.ASSETS}>Assets</SelectItem>
                  <SelectItem value={AccountType.LIABILITIES}>Liabilities</SelectItem>
                  <SelectItem value={AccountType.EQUITY}>Equity</SelectItem>
                  <SelectItem value={AccountType.INCOME}>Income</SelectItem>
                  <SelectItem value={AccountType.EXPENSES}>Expenses</SelectItem>
                </SelectContent>
              </Select>
              <Select value={companyFilter} onValueChange={setCompanyFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  <SelectItem value="company1">OryxPro Ltd</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Accounts Tree Table */}
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium">Account</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Balance Type</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Currency</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {renderAccountTree(null)}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Account Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Account</DialogTitle>
            <DialogDescription>
              Create a new account in the chart of accounts
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="accountCode">Account Code</Label>
                <Input id="accountCode" placeholder="e.g., 1113" />
              </div>
              <div>
                <Label htmlFor="accountName">Account Name</Label>
                <Input id="accountName" placeholder="e.g., Bank Account - Savings" />
              </div>
              <div>
                <Label htmlFor="accountType">Account Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={AccountType.ASSETS}>Assets</SelectItem>
                    <SelectItem value={AccountType.LIABILITIES}>Liabilities</SelectItem>
                    <SelectItem value={AccountType.EQUITY}>Equity</SelectItem>
                    <SelectItem value={AccountType.INCOME}>Income</SelectItem>
                    <SelectItem value={AccountType.EXPENSES}>Expenses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="parentAccount">Parent Account</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id || ''}>
                        {account.accountCode} - {account.accountName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="balanceType">Balance Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select balance type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={BalanceType.DEBIT}>Debit</SelectItem>
                    <SelectItem value={BalanceType.CREDIT}>Credit</SelectItem>
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
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="EGP">EGP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAddDialogOpen(false)}>
              Add Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Account Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Account Details</DialogTitle>
            <DialogDescription>
              Complete information for account {selectedAccount?.accountCode}
            </DialogDescription>
          </DialogHeader>
          
          {selectedAccount && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Account Code</Label>
                  <div className="text-sm font-medium font-mono">{selectedAccount.accountCode}</div>
                </div>
                <div>
                  <Label>Account Name</Label>
                  <div className="text-sm font-medium">{selectedAccount.accountName}</div>
                </div>
                <div>
                  <Label>Account Type</Label>
                  <div>{getAccountTypeBadge(selectedAccount.accountType)}</div>
                </div>
                <div>
                  <Label>Balance Type</Label>
                  <div>{getBalanceTypeBadge(selectedAccount.balanceType)}</div>
                </div>
                <div>
                  <Label>Level</Label>
                  <div className="text-sm font-medium">Level {selectedAccount.level}</div>
                </div>
                <div>
                  <Label>Currency</Label>
                  <div className="text-sm font-medium">{selectedAccount.currency}</div>
                </div>
                <div>
                  <Label>Company</Label>
                  <div className="text-sm font-medium">{selectedAccount.companyName}</div>
                </div>
                <div>
                  <Label>GAAP Standard</Label>
                  <div className="text-sm font-medium">{selectedAccount.localGAAP}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div>
                    <Badge variant={selectedAccount.isActive ? 'default' : 'secondary'}>
                      {selectedAccount.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label>System Account</Label>
                  <div>
                    <Badge variant={selectedAccount.isSystemAccount ? 'default' : 'secondary'}>
                      {selectedAccount.isSystemAccount ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </div>
                <div className="col-span-2">
                  <Label>Full Path</Label>
                  <div className="text-sm font-medium">{selectedAccount.fullPath}</div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsViewDialogOpen(false);
              setIsEditDialogOpen(true);
            }}>
              Edit Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
