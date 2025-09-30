'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Plus, 
  Search, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  MoreHorizontal,
  Eye,
  CreditCard,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  Filter,
  Download
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { customers, customerTransactions, customerPayments, branches } from '@/lib/data';
import type { Customer, CustomerTransaction, CustomerPayment, TransactionType, PaymentMethod } from '@/lib/data';

export default function CustomerBalancePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('all');
  const [selectedTransactionType, setSelectedTransactionType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<CustomerPayment | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.customerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (customer.companyName && customer.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (customer.firstName && customer.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (customer.lastName && customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCustomer = selectedCustomer === 'all' || customer.id === selectedCustomer;

    return matchesSearch && matchesCustomer;
  });

  // Filter transactions
  const filteredTransactions = customerTransactions.filter(transaction => {
    const customer = customers.find(c => c.id === transaction.customerId);
    if (!customer) return false;

    const matchesCustomer = selectedCustomer === 'all' || transaction.customerId === selectedCustomer;
    const matchesType = selectedTransactionType === 'all' || transaction.type === selectedTransactionType;
    const matchesStatus = selectedStatus === 'all' || transaction.status === selectedStatus;

    return matchesCustomer && matchesType && matchesStatus;
  });

  // Helper functions
  const getCustomer = (customerId: string) => customers.find(c => c.id === customerId);
  const getCustomerInitials = (customer: Customer) => {
    if (customer.companyName) {
      return customer.companyName.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
    }
    return `${customer.firstName?.[0] || ''}${customer.lastName?.[0] || ''}`.toUpperCase();
  };

  const getTransactionTypeColor = (type: TransactionType) => {
    switch (type) {
      case 'invoice':
        return 'bg-blue-100 text-blue-800';
      case 'payment':
        return 'bg-green-100 text-green-800';
      case 'credit_memo':
        return 'bg-purple-100 text-purple-800';
      case 'refund':
        return 'bg-orange-100 text-orange-800';
      case 'adjustment':
        return 'bg-yellow-100 text-yellow-800';
      case 'write_off':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'credit_card':
        return <CreditCard className="h-4 w-4" />;
      case 'bank_transfer':
        return <ArrowUpDown className="h-4 w-4" />;
      case 'check':
        return <FileText className="h-4 w-4" />;
      case 'cash':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  // Calculate metrics
  const totalOutstanding = customers.reduce((sum, c) => sum + c.currentBalance, 0);
  const totalCreditLimit = customers.reduce((sum, c) => sum + c.creditLimit, 0);
  const totalAvailableCredit = customers.reduce((sum, c) => sum + c.availableCredit, 0);
  const overdueAmount = customers.reduce((sum, c) => {
    // In a real app, you would check actual due dates
    return sum + (c.currentBalance > 0 ? c.currentBalance * 0.3 : 0); // Simulate 30% overdue
  }, 0);

  // Get recent transactions
  const getRecentTransactions = () => {
    return customerTransactions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Customer Account Balances</h1>
          <p className="text-muted-foreground">Track customer balances, payments, and transactions</p>
        </div>
        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Record Customer Payment</DialogTitle>
              <DialogDescription>
                Record a payment received from a customer
              </DialogDescription>
            </DialogHeader>
            <PaymentForm 
              payment={selectedPayment} 
              onClose={() => {
                setIsPaymentDialogOpen(false);
                setSelectedPayment(null);
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${totalOutstanding.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Amount owed by customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Credit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalAvailableCredit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Unused credit limit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credit Limit</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalCreditLimit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total credit extended
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Amount</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ${overdueAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Past due amounts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label>Customer</Label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger>
                  <SelectValue placeholder="All Customers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  {customers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.companyName || `${customer.firstName} ${customer.lastName}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Transaction Type</Label>
              <Select value={selectedTransactionType} onValueChange={setSelectedTransactionType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="invoice">Invoice</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="credit_memo">Credit Memo</SelectItem>
                  <SelectItem value="refund">Refund</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                  <SelectItem value="write_off">Write Off</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="balances" className="space-y-6">
        <TabsList>
          <TabsTrigger value="balances">Account Balances</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="overdue">Overdue Accounts</TabsTrigger>
        </TabsList>

        <TabsContent value="balances">
          <Card>
            <CardHeader>
              <CardTitle>Customer Account Balances</CardTitle>
              <CardDescription>
                Current balances and credit information for all customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Current Balance</TableHead>
                    <TableHead>Available Credit</TableHead>
                    <TableHead>Credit Limit</TableHead>
                    <TableHead>Payment Terms</TableHead>
                    <TableHead>Last Payment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map(customer => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{getCustomerInitials(customer)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {customer.companyName || `${customer.firstName} ${customer.lastName}`}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {customer.customerNumber}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`font-medium ${customer.currentBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          ${customer.currentBalance.toLocaleString()}
                        </div>
                        {customer.currentBalance > 0 && (
                          <div className="text-xs text-red-600">
                            Outstanding
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-green-600">
                          ${customer.availableCredit.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {((customer.availableCredit / customer.creditLimit) * 100).toFixed(0)}% available
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          ${customer.creditLimit.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {customer.paymentTerms.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {customer.lastPaymentDate ? (
                          <div>
                            <div className="text-sm">{new Date(customer.lastPaymentDate).toLocaleDateString()}</div>
                            <div className="text-xs text-muted-foreground">
                              ${customer.lastPaymentAmount?.toLocaleString()}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">No payments</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <DollarSign className="mr-2 h-4 w-4" />
                            Record Payment
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileText className="mr-2 h-4 w-4" />
                            View History
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                All customer transactions and account activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map(transaction => {
                    const customer = getCustomer(transaction.customerId);
                    
                    return (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div>
                            <div className="text-sm">{new Date(transaction.createdAt).toLocaleDateString()}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(transaction.createdAt).toLocaleTimeString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {customer ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {getCustomerInitials(customer)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-sm font-medium">
                                  {customer.companyName || `${customer.firstName} ${customer.lastName}`}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {customer.customerNumber}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Unknown Customer</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getTransactionTypeColor(transaction.type)}>
                            {transaction.type.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate" title={transaction.description}>
                            {transaction.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`font-medium ${transaction.type === 'payment' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === 'payment' ? '+' : '-'}${transaction.amount.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {transaction.reference && (
                            <div className="text-sm font-mono">
                              {transaction.reference}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                Record of all customer payments received
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerPayments.map(payment => {
                    const customer = getCustomer(payment.customerId);
                    
                    return (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div>
                            <div className="text-sm">{new Date(payment.processedAt).toLocaleDateString()}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(payment.processedAt).toLocaleTimeString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {customer ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {getCustomerInitials(customer)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-sm font-medium">
                                  {customer.companyName || `${customer.firstName} ${customer.lastName}`}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {customer.customerNumber}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Unknown Customer</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-green-600">
                            +${payment.amount.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getPaymentMethodIcon(payment.paymentMethod)}
                            <span className="text-sm capitalize">
                              {payment.paymentMethod.replace('_', ' ')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-mono">
                            {payment.reference}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue">
          <Card>
            <CardHeader>
              <CardTitle>Overdue Accounts</CardTitle>
              <CardDescription>
                Customers with outstanding balances past due date
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customers
                  .filter(c => c.currentBalance > 0)
                  .map(customer => (
                    <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{getCustomerInitials(customer)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {customer.companyName || `${customer.firstName} ${customer.lastName}`}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {customer.customerNumber} • {customer.email}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Last payment: {customer.lastPaymentDate ? new Date(customer.lastPaymentDate).toLocaleDateString() : 'Never'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-red-600">
                          ${customer.currentBalance.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Outstanding
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline">
                            <DollarSign className="mr-2 h-4 w-4" />
                            Record Payment
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileText className="mr-2 h-4 w-4" />
                            Send Statement
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                {customers.filter(c => c.currentBalance > 0).length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-muted-foreground">No overdue accounts</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Payment Form Component
function PaymentForm({ payment, onClose }: { payment: CustomerPayment | null; onClose: () => void }) {
  const [formData, setFormData] = useState({
    customerId: '',
    amount: '',
    paymentMethod: 'credit_card' as PaymentMethod,
    reference: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Recording payment:', formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Customer</Label>
        <Select value={formData.customerId} onValueChange={(value) => setFormData({ ...formData, customerId: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select customer" />
          </SelectTrigger>
          <SelectContent>
            {customers.map(customer => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.companyName || `${customer.firstName} ${customer.lastName}`} - {customer.customerNumber}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="0.00"
          required
        />
      </div>

      <div>
        <Label>Payment Method</Label>
        <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value as PaymentMethod })}>
          <SelectTrigger>
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="check">Check</SelectItem>
            <SelectItem value="credit_card">Credit Card</SelectItem>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            <SelectItem value="paypal">PayPal</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="reference">Reference</Label>
        <Input
          id="reference"
          value={formData.reference}
          onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
          placeholder="Payment reference number"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Payment description (optional)"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Record Payment
        </Button>
      </div>
    </form>
  );
}
