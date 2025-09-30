'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  CreditCard, 
  Calendar,
  Download,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { customers, customerTransactions, customerPayments } from '@/lib/data';
import type { Customer, CustomerType } from '@/lib/data';

export default function CustomerAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Calculate key metrics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalInvoiced, 0);
  const totalOutstanding = customers.reduce((sum, c) => sum + c.currentBalance, 0);
  const averageOrderValue = customers.reduce((sum, c) => sum + c.averageOrderValue, 0) / customers.length;
  const totalCreditLimit = customers.reduce((sum, c) => sum + c.creditLimit, 0);
  const creditUtilization = ((totalCreditLimit - customers.reduce((sum, c) => sum + c.availableCredit, 0)) / totalCreditLimit) * 100;

  // Customer type distribution
  const customerTypeStats = ['business', 'individual', 'government', 'nonprofit'].map(type => {
    const count = customers.filter(c => c.type === type).length;
    const revenue = customers.filter(c => c.type === type).reduce((sum, c) => sum + c.totalInvoiced, 0);
    return {
      type: type as CustomerType,
      count,
      percentage: (count / totalCustomers) * 100,
      revenue,
      revenuePercentage: (revenue / totalRevenue) * 100
    };
  });

  // Top customers by revenue
  const topCustomersByRevenue = customers
    .sort((a, b) => b.totalInvoiced - a.totalInvoiced)
    .slice(0, 10);

  // Top customers by order count
  const topCustomersByOrders = customers
    .sort((a, b) => b.totalOrders - a.totalOrders)
    .slice(0, 10);

  // Payment terms distribution
  const paymentTermsStats = ['due_on_receipt', 'net_15', 'net_30', 'net_45', 'net_60', 'prepaid'].map(term => {
    const count = customers.filter(c => c.paymentTerms === term).length;
    return {
      term,
      count,
      percentage: (count / totalCustomers) * 100
    };
  });

  // Credit utilization by customer
  const creditUtilizationStats = customers.map(customer => ({
    customer,
    utilization: ((customer.creditLimit - customer.availableCredit) / customer.creditLimit) * 100
  })).sort((a, b) => b.utilization - a.utilization);

  // Recent activity
  const recentTransactions = customerTransactions
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  const recentPayments = customerPayments
    .sort((a, b) => new Date(b.processedAt).getTime() - new Date(a.processedAt).getTime())
    .slice(0, 10);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Customer Analytics</h1>
          <p className="text-muted-foreground">Customer insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {activeCustomers} active ({((activeCustomers / totalCustomers) * 100).toFixed(1)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ${averageOrderValue.toLocaleString()} avg order value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalOutstanding.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {customers.filter(c => c.currentBalance > 0).length} customers with balance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credit Utilization</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creditUtilization.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              ${totalCreditLimit.toLocaleString()} total credit limit
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customers">Customer Analysis</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="credit">Credit Analysis</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Types</CardTitle>
                <CardDescription>
                  Distribution of customers by type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerTypeStats.map(stat => (
                    <div key={stat.type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {stat.type}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{stat.count} customers</div>
                        <div className="text-sm text-muted-foreground">
                          {stat.percentage.toFixed(1)}% • ${stat.revenue.toLocaleString()} revenue
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Terms Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Terms</CardTitle>
                <CardDescription>
                  Distribution of payment terms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentTermsStats.map(stat => (
                    <div key={stat.term} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {stat.term.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{stat.count} customers</div>
                        <div className="text-sm text-muted-foreground">
                          {stat.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Customers by Revenue */}
            <Card>
              <CardHeader>
                <CardTitle>Top Customers by Revenue</CardTitle>
                <CardDescription>
                  Highest revenue generating customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCustomersByRevenue.map((customer, index) => (
                    <div key={customer.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">
                            {customer.companyName || `${customer.firstName} ${customer.lastName}`}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {customer.customerNumber} • {customer.totalOrders} orders
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${customer.totalInvoiced.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          ${customer.averageOrderValue.toLocaleString()} avg
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Customers by Order Count */}
            <Card>
              <CardHeader>
                <CardTitle>Most Active Customers</CardTitle>
                <CardDescription>
                  Customers with the most orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCustomersByOrders.map((customer, index) => (
                    <div key={customer.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">
                            {customer.companyName || `${customer.firstName} ${customer.lastName}`}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {customer.customerNumber}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{customer.totalOrders} orders</div>
                        <div className="text-sm text-muted-foreground">
                          ${customer.averageOrderValue.toLocaleString()} avg
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue by Customer Type */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Customer Type</CardTitle>
                <CardDescription>
                  Revenue breakdown by customer type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerTypeStats
                    .sort((a, b) => b.revenue - a.revenue)
                    .map(stat => (
                      <div key={stat.type} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="capitalize">
                            {stat.type}
                          </Badge>
                          <div className="text-right">
                            <div className="font-medium">${stat.revenue.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">
                              {stat.revenuePercentage.toFixed(1)}% of total
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${stat.revenuePercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Average Order Value by Type */}
            <Card>
              <CardHeader>
                <CardTitle>Average Order Value by Type</CardTitle>
                <CardDescription>
                  AOV comparison across customer types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerTypeStats.map(stat => {
                    const avgOrderValue = stat.revenue / stat.count;
                    return (
                      <div key={stat.type} className="flex items-center justify-between">
                        <Badge variant="outline" className="capitalize">
                          {stat.type}
                        </Badge>
                        <div className="text-right">
                          <div className="font-medium">${avgOrderValue.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">
                            {stat.count} customers
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="credit">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Credit Utilization */}
            <Card>
              <CardHeader>
                <CardTitle>Credit Utilization</CardTitle>
                <CardDescription>
                  Customers with highest credit utilization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {creditUtilizationStats.slice(0, 10).map((stat, index) => (
                    <div key={stat.customer.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">
                            {stat.customer.companyName || `${stat.customer.firstName} ${stat.customer.lastName}`}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {stat.customer.customerNumber}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{stat.utilization.toFixed(1)}%</div>
                          <div className="text-sm text-muted-foreground">
                            ${stat.customer.creditLimit.toLocaleString()} limit
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${stat.utilization > 80 ? 'bg-red-500' : stat.utilization > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min(stat.utilization, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Credit Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle>Credit Risk Assessment</CardTitle>
                <CardDescription>
                  Customer credit risk categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-800">Low Risk</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-800">
                        {customers.filter(c => c.currentBalance === 0 && c.availableCredit > c.creditLimit * 0.5).length}
                      </div>
                      <div className="text-sm text-green-600">customers</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Medium Risk</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-yellow-800">
                        {customers.filter(c => c.currentBalance > 0 && c.currentBalance < c.creditLimit * 0.5).length}
                      </div>
                      <div className="text-sm text-yellow-600">customers</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <span className="font-medium text-red-800">High Risk</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-red-800">
                        {customers.filter(c => c.currentBalance > c.creditLimit * 0.5).length}
                      </div>
                      <div className="text-sm text-red-600">customers</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Latest customer transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map(transaction => {
                    const customer = customers.find(c => c.id === transaction.customerId);
                    return (
                      <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">
                            {customer ? (customer.companyName || `${customer.firstName} ${customer.lastName}`) : 'Unknown Customer'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {transaction.description}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${transaction.type === 'payment' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === 'payment' ? '+' : '-'}${transaction.amount.toLocaleString()}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {transaction.type}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Payments */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>
                  Latest customer payments received
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPayments.map(payment => {
                    const customer = customers.find(c => c.id === payment.customerId);
                    return (
                      <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">
                            {customer ? (customer.companyName || `${customer.firstName} ${customer.lastName}`) : 'Unknown Customer'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {payment.description || 'Payment received'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(payment.processedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-green-600">
                            +${payment.amount.toLocaleString()}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {payment.paymentMethod.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
