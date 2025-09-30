'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  Calculator, 
  FileText, 
  Building2,
  Plus,
  Users,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Receipt,
  PieChart
} from 'lucide-react';
import Link from 'next/link';

export default function PayrollManagementPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payroll Management</h1>
          <p className="text-muted-foreground">
            Manage salary structures, tax compliance, and payroll processing
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Quick Actions
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Process Payroll
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250,000 EGP</div>
            <p className="text-xs text-muted-foreground">
              +5.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              +3 new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tax Compliance</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">
              All payments up to date
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Due this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="structures">Salary Structures</TabsTrigger>
          <TabsTrigger value="batches">Payroll Batches</TabsTrigger>
          <TabsTrigger value="employee-payroll">Employee Payroll</TabsTrigger>
          <TabsTrigger value="tax-config">Tax Configuration</TabsTrigger>
          <TabsTrigger value="payslips">Payslips</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Payroll Batches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Recent Payroll Batches
                </CardTitle>
                <CardDescription>
                  Latest payroll processing activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">December 2024 Payroll</p>
                      <p className="text-sm text-muted-foreground">156 employees • 1,250,000 EGP</p>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 border-green-200">
                        Completed
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Dec 31, 2024</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">November 2024 Payroll</p>
                      <p className="text-sm text-muted-foreground">153 employees • 1,180,000 EGP</p>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 border-green-200">
                        Completed
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Nov 30, 2024</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">January 2025 Payroll</p>
                      <p className="text-sm text-muted-foreground">156 employees • Processing...</p>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 border-blue-200">
                        Processing
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">In Progress</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/hr/payroll/batches">
                      View All Batches
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Salary Structure Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Salary Structures
                </CardTitle>
                <CardDescription>
                  Active salary structures in your organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Senior Management</p>
                      <p className="text-sm text-muted-foreground">Grade A • 8 employees</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">15,000 - 25,000 EGP</div>
                      <div className="text-xs text-muted-foreground">Base salary range</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Middle Management</p>
                      <p className="text-sm text-muted-foreground">Grade B • 24 employees</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">8,000 - 15,000 EGP</div>
                      <div className="text-xs text-muted-foreground">Base salary range</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Junior Staff</p>
                      <p className="text-sm text-muted-foreground">Grade C • 124 employees</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">3,000 - 8,000 EGP</div>
                      <div className="text-xs text-muted-foreground">Base salary range</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/hr/payroll/structures">
                      Manage Structures
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common payroll tasks and operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                  <Link href="/hr/payroll/batches/new">
                    <Calculator className="h-6 w-6" />
                    <span>Process Payroll</span>
                  </Link>
                </Button>

                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                  <Link href="/hr/payroll/structures/new">
                    <Building2 className="h-6 w-6" />
                    <span>Salary Structure</span>
                  </Link>
                </Button>

                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                  <Link href="/hr/payroll/tax-config/new">
                    <FileText className="h-6 w-6" />
                    <span>Tax Setup</span>
                  </Link>
                </Button>

                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                  <Link href="/hr/payroll/payslips">
                    <Receipt className="h-6 w-6" />
                    <span>Generate Payslips</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Salary Structures Tab */}
        <TabsContent value="structures" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Salary Structures
                </CardTitle>
                <CardDescription>
                  Manage employee salary structures and grades
                </CardDescription>
              </div>
              <Button asChild>
                <Link href="/hr/payroll/structures">
                  <Plus className="h-4 w-4 mr-2" />
                  View All Structures
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Navigate to the Salary Structures page to manage all salary structures, 
                create new grades, and configure compensation packages.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payroll Batches Tab */}
        <TabsContent value="batches" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Payroll Batches
                </CardTitle>
                <CardDescription>
                  Process and manage payroll batches
                </CardDescription>
              </div>
              <Button asChild>
                <Link href="/hr/payroll/batches">
                  <Plus className="h-4 w-4 mr-2" />
                  View All Batches
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Navigate to the Payroll Batches page to process monthly payroll, 
                manage batch operations, and track payment status.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Employee Payroll Tab */}
        <TabsContent value="employee-payroll" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Employee Payroll
                </CardTitle>
                <CardDescription>
                  Individual employee payroll records and payments
                </CardDescription>
              </div>
              <Button asChild>
                <Link href="/hr/payroll/employee-payroll">
                  <Plus className="h-4 w-4 mr-2" />
                  View All Records
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Navigate to the Employee Payroll page to view individual payroll records, 
                payment history, and salary calculations.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Configuration Tab */}
        <TabsContent value="tax-config" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Tax Configuration
                </CardTitle>
                <CardDescription>
                  Configure tax rates, social insurance, and compliance settings
                </CardDescription>
              </div>
              <Button asChild>
                <Link href="/hr/payroll/tax-config">
                  <Plus className="h-4 w-4 mr-2" />
                  Manage Tax Settings
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Navigate to the Tax Configuration page to set up tax brackets, 
                social insurance rates, and compliance requirements.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payslips Tab */}
        <TabsContent value="payslips" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Payslips
                </CardTitle>
                <CardDescription>
                  Generate and manage employee payslips
                </CardDescription>
              </div>
              <Button asChild>
                <Link href="/hr/payroll/payslips">
                  <Plus className="h-4 w-4 mr-2" />
                  Manage Payslips
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Navigate to the Payslips page to generate employee payslips, 
                customize templates, and manage payslip distribution.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
