'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator,
  FileText,
  Calendar,
  DollarSign,
  CreditCard,
  Receipt,
  Banknote,
  Building,
  TrendingUp,
  PieChart,
  Settings,
  Users,
  Wallet,
  BarChart3,
  Target,
  PiggyBank,
  Shield
} from 'lucide-react';
import { ChartOfAccounts } from '@/components/finance/ChartOfAccounts';
import { JournalEntries } from '@/components/finance/JournalEntries';
import { PeriodManagement } from '@/components/finance/PeriodManagement';
import { MultiCurrency } from '@/components/finance/MultiCurrency';
import { AccountsPayable } from '@/components/finance/AccountsPayable';
import { AccountsReceivable } from '@/components/finance/AccountsReceivable';
import { CashBankManagement } from '@/components/finance/CashBankManagement';
import { FixedAssetsIntegration } from '@/components/finance/FixedAssetsIntegration';
import { BudgetingPlanning } from '@/components/finance/BudgetingPlanning';
import { FinancialReports } from '@/components/finance/FinancialReports';
import { ComplianceAudit } from '@/components/finance/ComplianceAudit';
import { IntegrationPoints } from '@/components/finance/IntegrationPoints';

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState('chart-of-accounts');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Finance & Accounting</h1>
          <p className="text-muted-foreground">
            Comprehensive financial management and accounting system
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,847,392</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accounts Payable</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$485,672</div>
            <p className="text-xs text-muted-foreground">
              23 invoices pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accounts Receivable</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$623,847</div>
            <p className="text-xs text-muted-foreground">
              15 overdue invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$892,156</div>
            <p className="text-xs text-muted-foreground">
              Across 5 bank accounts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Finance Modules */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="space-y-4">
          {/* Core Accounting */}
          <div>
            <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Core Accounting
            </h3>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="chart-of-accounts" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                <span className="text-sm">Chart of Accounts</span>
              </TabsTrigger>
              <TabsTrigger value="journal-entries" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm">Journal Entries</span>
              </TabsTrigger>
              <TabsTrigger value="period-management" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Period Management</span>
              </TabsTrigger>
              <TabsTrigger value="multi-currency" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm">Multi-Currency</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Financial Operations */}
          <div>
            <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Financial Operations
            </h3>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="accounts-payable" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="text-sm">Accounts Payable</span>
              </TabsTrigger>
              <TabsTrigger value="accounts-receivable" className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                <span className="text-sm">Accounts Receivable</span>
              </TabsTrigger>
              <TabsTrigger value="cash-bank-management" className="flex items-center gap-2">
                <Banknote className="h-4 w-4" />
                <span className="text-sm">Cash & Bank</span>
              </TabsTrigger>
              <TabsTrigger value="fixed-assets-integration" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span className="text-sm">Fixed Assets</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Planning & Analysis */}
          <div>
            <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Planning & Analysis
            </h3>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="budgeting-planning" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Budgeting</span>
              </TabsTrigger>
              <TabsTrigger value="financial-reports" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="text-sm">Financial Reports</span>
              </TabsTrigger>
              <TabsTrigger value="compliance-audit" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="text-sm">Compliance</span>
              </TabsTrigger>
              <TabsTrigger value="integration-points" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="text-sm">Integration</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="chart-of-accounts" className="space-y-6">
          <ChartOfAccounts />
        </TabsContent>

        <TabsContent value="journal-entries" className="space-y-6">
          <JournalEntries />
        </TabsContent>

        <TabsContent value="period-management" className="space-y-6">
          <PeriodManagement />
        </TabsContent>

        <TabsContent value="multi-currency" className="space-y-6">
          <MultiCurrency />
        </TabsContent>

        <TabsContent value="accounts-payable" className="space-y-6">
          <AccountsPayable />
        </TabsContent>

        <TabsContent value="accounts-receivable" className="space-y-6">
          <AccountsReceivable />
        </TabsContent>

        <TabsContent value="cash-bank-management" className="space-y-6">
          <CashBankManagement />
        </TabsContent>

        <TabsContent value="fixed-assets-integration" className="space-y-6">
          <FixedAssetsIntegration />
        </TabsContent>

        <TabsContent value="budgeting-planning" className="space-y-6">
          <BudgetingPlanning />
        </TabsContent>

        <TabsContent value="financial-reports" className="space-y-6">
          <FinancialReports />
        </TabsContent>

        <TabsContent value="compliance-audit" className="space-y-6">
          <ComplianceAudit />
        </TabsContent>

        <TabsContent value="integration-points" className="space-y-6">
          <IntegrationPoints />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Financial Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <PieChart className="h-8 w-8 text-blue-600" />
                    <div>
                      <h4 className="font-medium">Balance Sheet</h4>
                      <p className="text-sm text-muted-foreground">Assets, Liabilities & Equity</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <div>
                      <h4 className="font-medium">Income Statement</h4>
                      <p className="text-sm text-muted-foreground">Revenue & Expenses</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Wallet className="h-8 w-8 text-purple-600" />
                    <div>
                      <h4 className="font-medium">Cash Flow Statement</h4>
                      <p className="text-sm text-muted-foreground">Operating, Investing & Financing</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Target className="h-8 w-8 text-orange-600" />
                    <div>
                      <h4 className="font-medium">Budget vs Actual</h4>
                      <p className="text-sm text-muted-foreground">Variance Analysis</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-8 w-8 text-red-600" />
                    <div>
                      <h4 className="font-medium">Aging Reports</h4>
                      <p className="text-sm text-muted-foreground">AP & AR Aging</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <PiggyBank className="h-8 w-8 text-cyan-600" />
                    <div>
                      <h4 className="font-medium">Trial Balance</h4>
                      <p className="text-sm text-muted-foreground">Account Balances</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
