'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Copy,
  Printer,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package,
  Truck,
  User,
  Calendar,
  DollarSign,
  TrendingUp,
  BarChart3,
  FileText,
  ShoppingCart,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Tag,
  Hash,
  Activity,
  Settings,
  Globe,
  RotateCcw,
  RefreshCw,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { ReturnOrder, ReturnReason, ReturnType, ReturnStatus, RefundMethod, RefundStatus } from '@/lib/models/return-order';

export default function ReturnOrdersPage() {
  const { toast } = useToast();
  const [returnOrders, setReturnOrders] = useState<ReturnOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ReturnStatus | 'all'>('all');
  const [selectedReturnType, setSelectedReturnType] = useState<ReturnType | 'all'>('all');
  const [selectedRefundStatus, setSelectedRefundStatus] = useState<RefundStatus | 'all'>('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedReturnOrder, setSelectedReturnOrder] = useState<ReturnOrder | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Fetch return orders from database
  const fetchReturnOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/return-orders');
      const result = await response.json();
      if (result.success) {
        setReturnOrders(result.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch return orders",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching return orders:', error);
      toast({
        title: "Network Error",
        description: "Failed to fetch return orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load return orders on component mount
  useEffect(() => {
    fetchReturnOrders();
  }, []);

  // Filter return orders based on search and filters
  const filteredReturnOrders = useMemo(() => {
    return returnOrders.filter(order => {
      const matchesSearch = 
        order.returnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.originalOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.customerEmail && order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
      const matchesReturnType = selectedReturnType === 'all' || order.returnType === selectedReturnType;
      const matchesRefundStatus = selectedRefundStatus === 'all' || order.refundStatus === selectedRefundStatus;
      
      let matchesDate = true;
      if (selectedDateRange !== 'all') {
        const returnDate = new Date(order.returnDate);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - returnDate.getTime()) / (1000 * 60 * 60 * 24));
        
        switch (selectedDateRange) {
          case 'today':
            matchesDate = daysDiff === 0;
            break;
          case 'week':
            matchesDate = daysDiff <= 7;
            break;
          case 'month':
            matchesDate = daysDiff <= 30;
            break;
          case 'quarter':
            matchesDate = daysDiff <= 90;
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesReturnType && matchesRefundStatus && matchesDate;
    });
  }, [returnOrders, searchTerm, selectedStatus, selectedReturnType, selectedRefundStatus, selectedDateRange]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalReturns = returnOrders.length;
    const totalRefundAmount = returnOrders.reduce((sum, order) => sum + order.totalRefundAmount, 0);
    const pendingReturns = returnOrders.filter(order => 
      order.status === 'pending'
    ).length;
    const approvedReturns = returnOrders.filter(order => 
      order.status === 'approved'
    ).length;
    const completedReturns = returnOrders.filter(order => 
      order.status === 'completed'
    ).length;
    const pendingRefunds = returnOrders.filter(order => 
      order.refundStatus === 'pending'
    ).length;

    return {
      totalReturns,
      totalRefundAmount,
      pendingReturns,
      approvedReturns,
      completedReturns,
      pendingRefunds
    };
  }, [returnOrders]);

  const getStatusColor = (status: ReturnStatus) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRefundStatusColor = (status: RefundStatus) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReturnTypeIcon = (type: ReturnType) => {
    switch (type) {
      case 'refund': return <DollarSign className="h-4 w-4" />;
      case 'exchange': return <RefreshCw className="h-4 w-4" />;
      case 'store_credit': return <CreditCard className="h-4 w-4" />;
      case 'repair': return <Settings className="h-4 w-4" />;
      case 'replacement': return <Package className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '$0.00';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Return Orders</h1>
          <p className="text-muted-foreground">
            Manage return orders, refunds, and exchanges
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Return
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Return Order</DialogTitle>
                <DialogDescription>
                  Process a return for an existing order
                </DialogDescription>
              </DialogHeader>
              <ReturnOrderForm onClose={() => setIsCreateDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReturns}</div>
            <p className="text-xs text-muted-foreground">
              All time returns
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRefundAmount)}</div>
            <p className="text-xs text-muted-foreground">
              Total refund amount
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReturns}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedReturns}</div>
            <p className="text-xs text-muted-foreground">
              Approved returns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedReturns}</div>
            <p className="text-xs text-muted-foreground">
              Successfully processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Refunds</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRefunds}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting refund processing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Return Orders</CardTitle>
          <CardDescription>
            Manage and track all return orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search return orders, original orders, or customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={(value: ReturnStatus | 'all') => setSelectedStatus(value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedReturnType} onValueChange={(value: ReturnType | 'all') => setSelectedReturnType(value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="refund">Refund</SelectItem>
                <SelectItem value="exchange">Exchange</SelectItem>
                <SelectItem value="store_credit">Store Credit</SelectItem>
                <SelectItem value="repair">Repair</SelectItem>
                <SelectItem value="replacement">Replacement</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedRefundStatus} onValueChange={(value: RefundStatus | 'all') => setSelectedRefundStatus(value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Refund Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Refund Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Return Orders Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Return #</TableHead>
                  <TableHead>Original Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Refund Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Refund Amount</TableHead>
                  <TableHead>Return Date</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                        <span className="ml-2">Loading return orders...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredReturnOrders.map((returnOrder) => (
                  <TableRow key={returnOrder._id}>
                    <TableCell className="font-medium">
                      {returnOrder.returnNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{returnOrder.originalOrderNumber}</div>
                        <div className="text-sm text-muted-foreground">
                          {returnOrder.returnReason.replace('_', ' ')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{returnOrder.customerName || 'Unknown Customer'}</div>
                        <div className="text-sm text-muted-foreground">{returnOrder.customerEmail || '-'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getReturnTypeIcon(returnOrder.returnType)}
                        <span className="capitalize">{returnOrder.returnType.replace('_', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(returnOrder.status)}>
                        {returnOrder.status?.replace('_', ' ') || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRefundStatusColor(returnOrder.refundStatus)}>
                        {returnOrder.refundStatus?.replace('_', ' ') || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {returnOrder.items.length} item{returnOrder.items.length !== 1 ? 's' : ''}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(returnOrder.totalRefundAmount)}
                    </TableCell>
                    <TableCell>
                      {formatDate(returnOrder.returnDate.toString())}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedReturnOrder(returnOrder);
                            setIsViewDialogOpen(true);
                          }}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Return
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Printer className="h-4 w-4 mr-2" />
                            Print Return
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Send className="h-4 w-4 mr-2" />
                            Send to Customer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Cancel Return
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredReturnOrders.length === 0 && !loading && (
            <div className="text-center py-8">
              <RotateCcw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No return orders found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedStatus !== 'all' || selectedReturnType !== 'all' || selectedRefundStatus !== 'all' || selectedDateRange !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'Get started by creating your first return order'
                }
              </p>
              {(!searchTerm && selectedStatus === 'all' && selectedReturnType === 'all' && selectedRefundStatus === 'all' && selectedDateRange === 'all') && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Return Order
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Return Order Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Return Order Details</DialogTitle>
            <DialogDescription>
              View and manage return order information
            </DialogDescription>
          </DialogHeader>
          {selectedReturnOrder && <ReturnOrderDetails returnOrder={selectedReturnOrder} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Return Order Form Component
function ReturnOrderForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    originalOrderId: '',
    returnReason: 'defective' as ReturnReason,
    returnType: 'refund' as ReturnType,
    notes: '',
    items: [] as any[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating return order:', formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="originalOrder">Original Order ID</Label>
          <Input
            id="originalOrder"
            value={formData.originalOrderId}
            onChange={(e) => setFormData({ ...formData, originalOrderId: e.target.value })}
            placeholder="Enter original order ID"
          />
        </div>
        <div>
          <Label htmlFor="returnReason">Return Reason</Label>
          <Select value={formData.returnReason} onValueChange={(value: ReturnReason) => setFormData({ ...formData, returnReason: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="defective">Defective</SelectItem>
              <SelectItem value="wrong_item">Wrong Item</SelectItem>
              <SelectItem value="not_as_described">Not as Described</SelectItem>
              <SelectItem value="changed_mind">Changed Mind</SelectItem>
              <SelectItem value="damaged_shipping">Damaged in Shipping</SelectItem>
              <SelectItem value="late_delivery">Late Delivery</SelectItem>
              <SelectItem value="duplicate_order">Duplicate Order</SelectItem>
              <SelectItem value="size_issue">Size Issue</SelectItem>
              <SelectItem value="quality_issue">Quality Issue</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="returnType">Return Type</Label>
          <Select value={formData.returnType} onValueChange={(value: ReturnType) => setFormData({ ...formData, returnType: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="refund">Refund</SelectItem>
              <SelectItem value="exchange">Exchange</SelectItem>
              <SelectItem value="store_credit">Store Credit</SelectItem>
              <SelectItem value="repair">Repair</SelectItem>
              <SelectItem value="replacement">Replacement</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Create Return Order
        </Button>
      </div>
    </form>
  );
}

// Return Order Details Component
function ReturnOrderDetails({ returnOrder }: { returnOrder: ReturnOrder }) {
  const formatCurrency = (amount: number) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '$0.00';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="items">Items</TabsTrigger>
        <TabsTrigger value="refund">Refund</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4">
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Return Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Return Number</Label>
                <p className="text-sm text-muted-foreground">{returnOrder.returnNumber}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Original Order</Label>
                <p className="text-sm text-muted-foreground">{returnOrder.originalOrderNumber}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <p className="text-sm text-muted-foreground capitalize">{returnOrder.status?.replace('_', ' ') || 'Unknown'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Type</Label>
                <p className="text-sm text-muted-foreground capitalize">{returnOrder.returnType.replace('_', ' ')}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Reason</Label>
                <p className="text-sm text-muted-foreground capitalize">{returnOrder.returnReason.replace('_', ' ')}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Return Date</Label>
                <p className="text-sm text-muted-foreground">{formatDate(returnOrder.returnDate.toString())}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Name</Label>
                <p className="text-sm text-muted-foreground">{returnOrder.customerName || 'Unknown Customer'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <p className="text-sm text-muted-foreground">{returnOrder.customerEmail || '-'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Phone</Label>
                <p className="text-sm text-muted-foreground">{returnOrder.customerPhone || '-'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Processed By</Label>
                <p className="text-sm text-muted-foreground">{returnOrder.processedByName}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Return Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Refund Amount:</span>
                <span className="font-bold">{formatCurrency(returnOrder.totalRefundAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Refund Method:</span>
                <span className="capitalize">{returnOrder.refundMethod.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span>Refund Status:</span>
                <span className="capitalize">{returnOrder.refundStatus.replace('_', ' ')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="items" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Return Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Refund Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {returnOrder.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-sm text-muted-foreground">{item.productCode}</div>
                      </div>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                    <TableCell className="capitalize">{item.condition}</TableCell>
                    <TableCell>{formatCurrency(item.finalRefundAmount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="refund" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Refund Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Refund Method</Label>
                <p className="text-sm text-muted-foreground capitalize">{returnOrder.refundMethod.replace('_', ' ')}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Refund Status</Label>
                <p className="text-sm text-muted-foreground capitalize">{returnOrder.refundStatus.replace('_', ' ')}</p>
              </div>
              {returnOrder.refundTransactionId && (
                <div>
                  <Label className="text-sm font-medium">Transaction ID</Label>
                  <p className="text-sm text-muted-foreground">{returnOrder.refundTransactionId}</p>
                </div>
              )}
              {returnOrder.refundProcessedAt && (
                <div>
                  <Label className="text-sm font-medium">Processed At</Label>
                  <p className="text-sm text-muted-foreground">{formatDate(returnOrder.refundProcessedAt.toString())}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="history" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Return History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium capitalize">{returnOrder.status?.replace('_', ' ') || 'Unknown'}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(returnOrder.returnDate.toString())}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Return created</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
