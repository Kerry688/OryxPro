'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, 
  Plus, 
  Search, 
  Eye, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Download,
  Upload,
  DollarSign
} from 'lucide-react';
import { ETAInvoice, CreateETAInvoiceData, ETAInvoiceStatus, ETASyncStatus } from '@/lib/models/eta';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function ETAInvoicesPage() {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<ETAInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [syncStatusFilter, setSyncStatusFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<ETAInvoice | null>(null);

  // Fetch invoices
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/eta/invoices');
      const data = await response.json();
      
      if (data.success) {
        setInvoices(data.data || []);
      } else {
        toast({
          title: "Error",
          description: data.error || 'Failed to fetch invoices',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast({
        title: "Error",
        description: "Failed to fetch invoices",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Sync invoices with ETA
  const syncInvoices = async () => {
    try {
      toast({
        title: "Sync Started",
        description: "Syncing invoices with ETA...",
      });

      const response = await fetch('/api/eta/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityType: 'invoice' })
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Sync Completed",
          description: `${data.data.syncedCount} invoices synced, ${data.data.failedCount} failed`,
        });
        fetchInvoices(); // Refresh invoices
      } else {
        toast({
          title: "Sync Error",
          description: data.error || 'Failed to sync invoices',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error syncing invoices:', error);
      toast({
        title: "Sync Error",
        description: "Failed to sync invoices with ETA",
        variant: "destructive",
      });
    }
  };

  // Create new invoice
  const createInvoice = async (invoiceData: CreateETAInvoiceData) => {
    try {
      const response = await fetch('/api/eta/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData)
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Invoice Created",
          description: "ETA invoice created successfully",
        });
        setIsCreateDialogOpen(false);
        fetchInvoices();
      } else {
        toast({
          title: "Error",
          description: data.error || 'Failed to create invoice',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = searchTerm === '' || 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.etaInvoiceId && invoice.etaInvoiceId.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    const matchesSyncStatus = syncStatusFilter === 'all' || invoice.syncStatus === syncStatusFilter;
    
    const matchesDate = (!dateFrom || new Date(invoice.invoiceDate) >= new Date(dateFrom)) &&
                       (!dateTo || new Date(invoice.invoiceDate) <= new Date(dateTo));
    
    return matchesSearch && matchesStatus && matchesSyncStatus && matchesDate;
  });

  const getStatusBadge = (status: ETAInvoiceStatus) => {
    const statusConfig = {
      draft: { variant: 'outline' as const, text: 'Draft', icon: Clock },
      submitted: { variant: 'secondary' as const, text: 'Submitted', icon: Upload },
      accepted: { variant: 'default' as const, text: 'Accepted', icon: CheckCircle },
      rejected: { variant: 'destructive' as const, text: 'Rejected', icon: XCircle },
      cancelled: { variant: 'secondary' as const, text: 'Cancelled', icon: XCircle },
      under_review: { variant: 'outline' as const, text: 'Under Review', icon: AlertTriangle }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <config.icon className="h-3 w-3" />
        <span>{config.text}</span>
      </Badge>
    );
  };

  const getSyncStatusBadge = (syncStatus: ETASyncStatus) => {
    const statusConfig = {
      pending: { variant: 'outline' as const, text: 'Pending', icon: Clock },
      success: { variant: 'default' as const, text: 'Success', icon: CheckCircle },
      failed: { variant: 'destructive' as const, text: 'Failed', icon: XCircle },
      retry: { variant: 'secondary' as const, text: 'Retry', icon: AlertTriangle }
    };
    
    const config = statusConfig[syncStatus] || statusConfig.pending;
    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <config.icon className="h-3 w-3" />
        <span>{config.text}</span>
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ETA Invoices</h1>
          <p className="text-muted-foreground">
            Submit and track sales invoices with Egyptian Tax Authority
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={fetchInvoices}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={syncInvoices}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync with ETA
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create ETA Invoice</DialogTitle>
                <DialogDescription>
                  Create a new sales invoice for ETA submission
                </DialogDescription>
              </DialogHeader>
              <CreateInvoiceForm onSubmit={createInvoice} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
                <option value="under_review">Under Review</option>
              </select>
            </div>
            <div>
              <select
                value={syncStatusFilter}
                onChange={(e) => setSyncStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="all">All Sync Status</option>
                <option value="pending">Pending</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="retry">Retry</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Input
                type="date"
                placeholder="From Date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="flex-1"
              />
              <Input
                type="date"
                placeholder="To Date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invoices ({filteredInvoices.length})</CardTitle>
          <CardDescription>
            Manage sales invoices submitted to ETA
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading invoices...</p>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No invoices found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' || syncStatusFilter !== 'all'
                  ? 'No invoices match your current filters'
                  : 'Get started by creating your first invoice'
                }
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sync Status</TableHead>
                  <TableHead>ETA ID</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice._id.toString()}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{invoice.invoiceNumber}</div>
                        <div className="text-sm text-muted-foreground">
                          {invoice.invoiceId}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{invoice.customerName}</div>
                        {invoice.customerTaxNumber && (
                          <div className="text-sm text-muted-foreground">
                            Tax: {invoice.customerTaxNumber}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {format(new Date(invoice.invoiceDate), 'MMM dd, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        EGP {invoice.totalAmount.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(invoice.status)}
                    </TableCell>
                    <TableCell>
                      {getSyncStatusBadge(invoice.syncStatus)}
                    </TableCell>
                    <TableCell>
                      {invoice.etaInvoiceId ? (
                        <span className="font-mono text-sm">{invoice.etaInvoiceId}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setIsViewDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Invoice Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
            <DialogDescription>
              View detailed information about this ETA invoice
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <InvoiceDetails invoice={selectedInvoice} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Create Invoice Form Component
function CreateInvoiceForm({ onSubmit }: { onSubmit: (data: CreateETAInvoiceData) => void }) {
  const [formData, setFormData] = useState<CreateETAInvoiceData>({
    invoiceId: '',
    invoiceNumber: '',
    invoiceDate: new Date(),
    customerName: '',
    customerTaxNumber: '',
    customerAddress: '',
    customerPhone: '',
    customerEmail: '',
    items: [],
    subtotal: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 0,
    currency: 'EGP',
    paymentMethod: 'cash'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Invoice ID</label>
          <Input
            value={formData.invoiceId}
            onChange={(e) => setFormData({ ...formData, invoiceId: e.target.value })}
            placeholder="Enter invoice ID"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Invoice Number</label>
          <Input
            value={formData.invoiceNumber}
            onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
            placeholder="Enter invoice number"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Invoice Date</label>
          <Input
            type="date"
            value={formData.invoiceDate.toISOString().split('T')[0]}
            onChange={(e) => setFormData({ ...formData, invoiceDate: new Date(e.target.value) })}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Payment Method</label>
          <select
            value={formData.paymentMethod}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="mobile">Mobile Payment</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="text-sm font-medium">Customer Name</label>
        <Input
          value={formData.customerName}
          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
          placeholder="Enter customer name"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Customer Tax Number</label>
          <Input
            value={formData.customerTaxNumber}
            onChange={(e) => setFormData({ ...formData, customerTaxNumber: e.target.value })}
            placeholder="Enter tax number"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Customer Phone</label>
          <Input
            value={formData.customerPhone}
            onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
            placeholder="Enter phone number"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">
          Create Invoice
        </Button>
      </div>
    </form>
  );
}

// Invoice Details Component
function InvoiceDetails({ invoice }: { invoice: ETAInvoice }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold">Invoice Information</h4>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Invoice Number:</span> {invoice.invoiceNumber}</div>
            <div><span className="font-medium">Invoice ID:</span> {invoice.invoiceId}</div>
            <div><span className="font-medium">Date:</span> {format(new Date(invoice.invoiceDate), 'MMM dd, yyyy')}</div>
            <div><span className="font-medium">Payment Method:</span> {invoice.paymentMethod}</div>
          </div>
        </div>
        <div>
          <h4 className="font-semibold">Customer Information</h4>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Name:</span> {invoice.customerName}</div>
            {invoice.customerTaxNumber && (
              <div><span className="font-medium">Tax Number:</span> {invoice.customerTaxNumber}</div>
            )}
            {invoice.customerPhone && (
              <div><span className="font-medium">Phone:</span> {invoice.customerPhone}</div>
            )}
            {invoice.customerEmail && (
              <div><span className="font-medium">Email:</span> {invoice.customerEmail}</div>
            )}
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="font-semibold">Items</h4>
        <div className="mt-2 space-y-2">
          {invoice.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-2 border rounded">
              <div>
                <div className="font-medium">{item.itemName}</div>
                <div className="text-sm text-muted-foreground">{item.itemCode}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">EGP {item.totalPrice.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Total Amount:</span>
          <span className="text-lg font-bold">EGP {invoice.totalAmount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
