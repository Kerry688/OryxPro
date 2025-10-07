'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  FileText, 
  Search, 
  Download,
  Eye,
  CreditCard,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter
} from 'lucide-react';

// Mock data
const mockInvoices = [
  {
    id: 'INV-2024-001',
    invoiceNumber: 'INV-2024-001',
    date: '2024-04-01',
    dueDate: '2024-04-30',
    status: 'overdue',
    paymentStatus: 'pending',
    totalAmount: 8750,
    paidAmount: 0,
    outstandingAmount: 8750,
    currency: 'EGP',
    orderNumber: 'ORD-2024-001',
    items: [
      {
        id: '1',
        productName: 'Industrial Printer HP LaserJet',
        productCode: 'HP-LJ-001',
        quantity: 1,
        unitPrice: 7500,
        lineTotal: 7500
      },
      {
        id: '2',
        productName: 'Office Supplies Package',
        productCode: 'OS-PKG-001',
        quantity: 1,
        unitPrice: 1250,
        lineTotal: 1250
      }
    ]
  },
  {
    id: 'INV-2024-002',
    invoiceNumber: 'INV-2024-002',
    date: '2024-04-10',
    dueDate: '2024-05-10',
    status: 'sent',
    paymentStatus: 'pending',
    totalAmount: 7000,
    paidAmount: 0,
    outstandingAmount: 7000,
    currency: 'EGP',
    orderNumber: 'ORD-2024-002',
    items: [
      {
        id: '1',
        productName: 'Network Switch 24-Port',
        productCode: 'NS-24-001',
        quantity: 1,
        unitPrice: 5000,
        lineTotal: 5000
      },
      {
        id: '2',
        productName: 'CAT6 Ethernet Cable',
        productCode: 'CAT6-100',
        quantity: 5,
        unitPrice: 400,
        lineTotal: 2000
      }
    ]
  },
  {
    id: 'INV-2024-003',
    invoiceNumber: 'INV-2024-003',
    date: '2024-03-15',
    dueDate: '2024-04-14',
    status: 'paid',
    paymentStatus: 'paid',
    totalAmount: 3200,
    paidAmount: 3200,
    outstandingAmount: 0,
    currency: 'EGP',
    orderNumber: 'ORD-2024-003',
    paymentDate: '2024-04-10',
    paymentMethod: 'Bank Transfer',
    items: [
      {
        id: '1',
        productName: 'Wireless Mouse Logitech',
        productCode: 'WM-LOG-001',
        quantity: 10,
        unitPrice: 180,
        lineTotal: 1800
      },
      {
        id: '2',
        productName: 'Keyboard Mechanical',
        productCode: 'KB-MECH-001',
        quantity: 5,
        unitPrice: 280,
        lineTotal: 1400
      }
    ]
  }
];

export function CustomerInvoices() {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethod, setPaymentMethod] = useState('');

  const getStatusBadge = (status: string) => {
    const configs = {
      'sent': 'bg-blue-100 text-blue-800',
      'paid': 'bg-green-100 text-green-800',
      'overdue': 'bg-red-100 text-red-800',
      'cancelled': 'bg-gray-100 text-gray-800',
      'partially_paid': 'bg-yellow-100 text-yellow-800'
    };
    return configs[status as keyof typeof configs] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusBadge = (status: string) => {
    const configs = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'paid': 'bg-green-100 text-green-800',
      'overdue': 'bg-red-100 text-red-800',
      'partial': 'bg-blue-100 text-blue-800'
    };
    return configs[status as keyof typeof configs] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP'
    }).format(amount);
  };

  const handleMakePayment = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsPaymentDialogOpen(true);
  };

  const handleProcessPayment = () => {
    if (selectedInvoice && paymentMethod) {
      // Process payment logic
      setInvoices(prev => prev.map(inv => 
        inv.id === selectedInvoice.id 
          ? { 
              ...inv, 
              status: 'paid', 
              paymentStatus: 'paid',
              paidAmount: inv.totalAmount,
              outstandingAmount: 0,
              paymentDate: new Date().toISOString(),
              paymentMethod: paymentMethod
            }
          : inv
      ));
      setIsPaymentDialogOpen(false);
      setPaymentMethod('');
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOutstanding = invoices.reduce((sum, invoice) => sum + invoice.outstandingAmount, 0);
  const overdueInvoices = invoices.filter(invoice => invoice.status === 'overdue').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Invoices & Payments</h2>
          <p className="text-muted-foreground">View and manage your invoices and payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalOutstanding)}</div>
            <p className="text-xs text-muted-foreground">
              Across all invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Invoices</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueInvoices}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              Available payment options
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices List */}
      <div className="space-y-4">
        {filteredInvoices.map((invoice) => (
          <Card key={invoice.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium">{invoice.invoiceNumber}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(invoice.date)} • Order: {invoice.orderNumber}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(invoice.totalAmount)}</div>
                    <div className="text-sm text-muted-foreground">
                      Outstanding: {formatCurrency(invoice.outstandingAmount)}
                    </div>
                  </div>
                  <Badge className={getStatusBadge(invoice.status)}>
                    {invoice.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-muted-foreground">Due Date:</span>
                  <span>{formatDate(invoice.dueDate)}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="text-muted-foreground">Paid:</span>
                  <span>{formatCurrency(invoice.paidAmount)}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  <span className="text-muted-foreground">Payment:</span>
                  <Badge className={getPaymentStatusBadge(invoice.paymentStatus)}>
                    {invoice.paymentStatus}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedInvoice(invoice);
                      setIsInvoiceDialogOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Invoice
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                {invoice.outstandingAmount > 0 && (
                  <Button 
                    size="sm"
                    onClick={() => handleMakePayment(invoice)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Make Payment
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Invoice Details Dialog */}
      <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Invoice Details - {selectedInvoice?.invoiceNumber}</DialogTitle>
            <DialogDescription>
              Complete invoice information and payment history
            </DialogDescription>
          </DialogHeader>
          
          {selectedInvoice && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Invoice Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>Invoice Number: {selectedInvoice.invoiceNumber}</div>
                    <div>Invoice Date: {formatDate(selectedInvoice.date)}</div>
                    <div>Due Date: {formatDate(selectedInvoice.dueDate)}</div>
                    <div>Status: <Badge className={getStatusBadge(selectedInvoice.status)}>{selectedInvoice.status}</Badge></div>
                    <div>Order Number: {selectedInvoice.orderNumber}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Payment Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div>Total Amount: {formatCurrency(selectedInvoice.totalAmount)}</div>
                    <div>Paid Amount: {formatCurrency(selectedInvoice.paidAmount)}</div>
                    <div>Outstanding: {formatCurrency(selectedInvoice.outstandingAmount)}</div>
                    <div>Payment Status: <Badge className={getPaymentStatusBadge(selectedInvoice.paymentStatus)}>{selectedInvoice.paymentStatus}</Badge></div>
                    {selectedInvoice.paymentDate && <div>Payment Date: {formatDate(selectedInvoice.paymentDate)}</div>}
                    {selectedInvoice.paymentMethod && <div>Payment Method: {selectedInvoice.paymentMethod}</div>}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Invoice Items</h4>
                <div className="space-y-4">
                  {selectedInvoice.items.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-sm text-muted-foreground">{item.productCode}</div>
                        <div className="text-sm">Quantity: {item.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(item.unitPrice)}</div>
                        <div className="text-sm text-muted-foreground">each</div>
                      </div>
                      <div className="text-right ml-8">
                        <div className="font-medium">{formatCurrency(item.lineTotal)}</div>
                        <div className="text-sm text-muted-foreground">total</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-lg font-medium">
                  Total: {formatCurrency(selectedInvoice.totalAmount)}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  {selectedInvoice.outstandingAmount > 0 && (
                    <Button onClick={() => handleMakePayment(selectedInvoice)}>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Make Payment
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Make Payment</DialogTitle>
            <DialogDescription>
              Complete payment for {selectedInvoice?.invoiceNumber}
            </DialogDescription>
          </DialogHeader>
          
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Invoice Amount:</span>
                  <span className="font-medium">{formatCurrency(selectedInvoice.totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Already Paid:</span>
                  <span className="font-medium">{formatCurrency(selectedInvoice.paidAmount)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-medium">Amount Due:</span>
                  <span className="font-bold text-lg">{formatCurrency(selectedInvoice.outstandingAmount)}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Payment Method</label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paymentMethod === 'credit_card' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Card Number</label>
                    <Input placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Expiry Date</label>
                      <Input placeholder="MM/YY" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">CVV</label>
                      <Input placeholder="123" />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'bank_transfer' && (
                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-medium mb-2">Bank Transfer Details</h4>
                    <div className="text-sm space-y-1">
                      <div>Bank: National Bank of Egypt</div>
                      <div>Account: 12345678901234567890</div>
                      <div>Reference: {selectedInvoice.invoiceNumber}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleProcessPayment}
              disabled={!paymentMethod}
            >
              Process Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
