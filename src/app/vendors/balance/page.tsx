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
  Download,
  Building2,
  Package,
  Wrench,
  Truck
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { vendors, vendorTransactions, vendorPayments, branches } from '@/lib/data';
import type { Vendor, VendorTransaction, VendorPayment, VendorTransactionType, VendorPaymentMethod, VendorType } from '@/lib/data';

export default function VendorBalancePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<string>('all');
  const [selectedTransactionType, setSelectedTransactionType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<VendorPayment | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  // Filter vendors
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.vendorNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVendor = selectedVendor === 'all' || vendor.id === selectedVendor;

    return matchesSearch && matchesVendor;
  });

  // Filter transactions
  const filteredTransactions = vendorTransactions.filter(transaction => {
    const vendor = vendors.find(v => v.id === transaction.vendorId);
    if (!vendor) return false;

    const matchesVendor = selectedVendor === 'all' || transaction.vendorId === selectedVendor;
    const matchesType = selectedTransactionType === 'all' || transaction.type === selectedTransactionType;
    const matchesStatus = selectedStatus === 'all' || transaction.status === selectedStatus;

    return matchesVendor && matchesType && matchesStatus;
  });

  // Helper functions
  const getVendor = (vendorId: string) => vendors.find(v => v.id === vendorId);
  const getVendorInitials = (vendor: Vendor) => {
    return vendor.companyName.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
  };

  const getTypeIcon = (type: VendorType) => {
    switch (type) {
      case 'supplier':
        return <Package className="h-4 w-4" />;
      case 'service_provider':
        return <Wrench className="h-4 w-4" />;
      case 'contractor':
        return <Truck className="h-4 w-4" />;
      case 'distributor':
        return <Building2 className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  const getTransactionTypeColor = (type: VendorTransactionType) => {
    switch (type) {
      case 'purchase_order':
        return 'bg-blue-100 text-blue-800';
      case 'payment':
        return 'bg-green-100 text-green-800';
      case 'credit_memo':
        return 'bg-purple-100 text-purple-800';
      case 'debit_memo':
        return 'bg-orange-100 text-orange-800';
      case 'adjustment':
        return 'bg-yellow-100 text-yellow-800';
      case 'refund':
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

  const getPaymentMethodIcon = (method: VendorPaymentMethod) => {
    switch (method) {
      case 'credit_card':
        return <CreditCard className="h-4 w-4" />;
      case 'bank_transfer':
        return <ArrowUpDown className="h-4 w-4" />;
      case 'check':
        return <FileText className="h-4 w-4" />;
      case 'cash':
        return <DollarSign className="h-4 w-4" />;
      case 'ach':
        return <ArrowUpDown className="h-4 w-4" />;
      case 'wire_transfer':
        return <ArrowUpDown className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  // Calculate metrics
  const totalOutstanding = vendors.reduce((sum, v) => sum + v.currentBalance, 0);
  const totalCreditLimit = vendors.reduce((sum, v) => sum + v.creditLimit, 0);
  const totalAvailableCredit = vendors.reduce((sum, v) => sum + v.availableCredit, 0);
  const overdueAmount = vendors.reduce((sum, v) => {
    // In a real app, you would check actual due dates
    return sum + (v.currentBalance > 0 ? v.currentBalance * 0.2 : 0); // Simulate 20% overdue
  }, 0);

  // Get recent transactions
  const getRecentTransactions = () => {
    return vendorTransactions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Vendor Account Balances</h1>
          <p className="text-muted-foreground">Track vendor balances, payments, and transactions</p>
        </div>
        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Make Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Make Vendor Payment</DialogTitle>
              <DialogDescription>
                Record a payment made to a vendor
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
              Amount owed to vendors
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
              Total credit available
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
                  placeholder="Search vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label>Vendor</Label>
              <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                <SelectTrigger>
                  <SelectValue placeholder="All Vendors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vendors</SelectItem>
                  {vendors.map(vendor => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.companyName}
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
                  <SelectItem value="purchase_order">Purchase Order</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="credit_memo">Credit Memo</SelectItem>
                  <SelectItem value="debit_memo">Debit Memo</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                  <SelectItem value="refund">Refund</SelectItem>
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
              <CardTitle>Vendor Account Balances</CardTitle>
              <CardDescription>
                Current balances and credit information for all vendors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Current Balance</TableHead>
                    <TableHead>Available Credit</TableHead>
                    <TableHead>Credit Limit</TableHead>
                    <TableHead>Payment Terms</TableHead>
                    <TableHead>Last Payment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVendors.map(vendor => (
                    <TableRow key={vendor.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{getVendorInitials(vendor)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{vendor.companyName}</div>
                            <div className="text-sm text-muted-foreground">
                              {vendor.vendorNumber}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`font-medium ${vendor.currentBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          ${vendor.currentBalance.toLocaleString()}
                        </div>
                        {vendor.currentBalance > 0 && (
                          <div className="text-xs text-red-600">
                            Outstanding
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-green-600">
                          ${vendor.availableCredit.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {((vendor.availableCredit / vendor.creditLimit) * 100).toFixed(0)}% available
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          ${vendor.creditLimit.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {vendor.paymentTerms.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {vendor.lastPaymentDate ? (
                          <div>
                            <div className="text-sm">{new Date(vendor.lastPaymentDate).toLocaleDateString()}</div>
                            <div className="text-xs text-muted-foreground">
                              ${vendor.lastPaymentAmount?.toLocaleString()}
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
                            Make Payment
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
                All vendor transactions and account activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Vendor</TableHead>
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
                    const vendor = getVendor(transaction.vendorId);
                    
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
                          {vendor ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {getVendorInitials(vendor)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-sm font-medium">{vendor.companyName}</div>
                                <div className="text-xs text-muted-foreground">
                                  {vendor.vendorNumber}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Unknown Vendor</span>
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
                            {transaction.type === 'payment' ? '-' : '+'}${transaction.amount.toLocaleString()}
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
                Record of all payments made to vendors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorPayments.map(payment => {
                    const vendor = getVendor(payment.vendorId);
                    
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
                          {vendor ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {getVendorInitials(vendor)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-sm font-medium">{vendor.companyName}</div>
                                <div className="text-xs text-muted-foreground">
                                  {vendor.vendorNumber}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Unknown Vendor</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-green-600">
                            -${payment.amount.toLocaleString()}
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
                Vendors with outstanding balances past due date
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendors
                  .filter(v => v.currentBalance > 0)
                  .map(vendor => (
                    <div key={vendor.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{getVendorInitials(vendor)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{vendor.companyName}</div>
                          <div className="text-sm text-muted-foreground">
                            {vendor.vendorNumber} • {vendor.email}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Last payment: {vendor.lastPaymentDate ? new Date(vendor.lastPaymentDate).toLocaleDateString() : 'Never'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-red-600">
                          ${vendor.currentBalance.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Outstanding
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline">
                            <DollarSign className="mr-2 h-4 w-4" />
                            Make Payment
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileText className="mr-2 h-4 w-4" />
                            Send Reminder
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                {vendors.filter(v => v.currentBalance > 0).length === 0 && (
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
function PaymentForm({ payment, onClose }: { payment: VendorPayment | null; onClose: () => void }) {
  const [formData, setFormData] = useState({
    vendorId: '',
    amount: '',
    paymentMethod: 'check' as VendorPaymentMethod,
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
        <Label>Vendor</Label>
        <Select value={formData.vendorId} onValueChange={(value) => setFormData({ ...formData, vendorId: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select vendor" />
          </SelectTrigger>
          <SelectContent>
            {vendors.map(vendor => (
              <SelectItem key={vendor.id} value={vendor.id}>
                {vendor.companyName} - {vendor.vendorNumber}
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
        <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value as VendorPaymentMethod })}>
          <SelectTrigger>
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="check">Check</SelectItem>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            <SelectItem value="credit_card">Credit Card</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="ach">ACH</SelectItem>
            <SelectItem value="wire_transfer">Wire Transfer</SelectItem>
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
