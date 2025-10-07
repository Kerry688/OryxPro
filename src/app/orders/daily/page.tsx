'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign,
  Package,
  User,
  Calendar,
  Receipt,
  CreditCard,
  Banknote,
  Smartphone,
  Building2,
  TrendingUp,
  RefreshCw,
  Printer,
  FileText,
  Users,
  Plus
} from 'lucide-react';
import { format } from 'date-fns';

interface OrderItem {
  id: string;
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
  brand: string;
}

interface Payment {
  method: 'cash' | 'card' | 'mobile' | 'bank_transfer';
  amount: number;
  transactionId?: string;
  status: 'completed' | 'pending' | 'failed';
  processedAt?: Date;
}

interface Order {
  _id: string;
  orderNumber: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  payment: Payment;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  orderDate: Date;
  completedAt?: Date;
  notes?: string;
  cashierId: string;
  cashierName: string;
  branchId: string;
  branchName: string;
  source: 'pos' | 'online' | 'phone' | 'email' | 'walk-in' | 'sales-rep';
  sourceDetails?: {
    channel?: string;
    salesRepId?: string;
    salesRepName?: string;
    phoneNumber?: string;
    emailAddress?: string;
  };
}

export default function DailyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [userFilter, setUserFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Fetch orders for the selected date
  const fetchOrders = async (date: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Daily Orders - Fetching orders for date:', date);
      const response = await fetch(`/api/orders/daily?date=${date}`);
      const result = await response.json();
      
      if (result.success) {
        console.log('Daily Orders - API Response:', result);
        setOrders(result.data);
      } else {
        console.error('Daily Orders - API Error:', result.error);
        setError(result.error || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(selectedDate);
  }, [selectedDate]);

  const filteredOrders = orders.filter(order => {
    // Safety check: ensure order exists and has required properties
    if (!order || typeof order !== 'object') {
      return false;
    }
    
    const matchesSearch = 
      (order.orderNumber && order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.customerEmail && order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.cashierName && order.cashierName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || (order.status && order.status === statusFilter);
    const matchesUser = userFilter === 'all' || (order.cashierName && order.cashierName === userFilter);
    
    return matchesSearch && matchesStatus && matchesUser;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, icon: Clock, text: 'Pending' },
      completed: { variant: 'default' as const, icon: CheckCircle, text: 'Completed' },
      cancelled: { variant: 'destructive' as const, icon: XCircle, text: 'Cancelled' },
      refunded: { variant: 'outline' as const, icon: RefreshCw, text: 'Refunded' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const getPaymentMethodIcon = (method: string) => {
    const icons = {
      cash: Cash,
      card: CreditCard,
      mobile: Smartphone,
      bank_transfer: Building2
    };
    const Icon = icons[method as keyof typeof icons] || CreditCard;
    return <Icon className="h-4 w-4" />;
  };

  const getPaymentMethodText = (method: string) => {
    const methods = {
      cash: 'Cash',
      card: 'Card',
      mobile: 'Mobile Payment',
      bank_transfer: 'Bank Transfer'
    };
    return methods[method as keyof typeof methods] || method;
  };

  const getOrderSourceInfo = (order: Order | null | undefined) => {
    // Default fallback configuration
    const defaultConfig = { label: 'POS', icon: '🖥️', color: 'bg-blue-500', details: '' };
    
    if (!order || typeof order !== 'object') {
      return defaultConfig;
    }

    const sourceConfig = {
      'pos': { label: 'POS', icon: '🖥️', color: 'bg-blue-500' },
      'online': { label: 'Online', icon: '🌐', color: 'bg-green-500' },
      'phone': { label: 'Phone', icon: '📞', color: 'bg-orange-500' },
      'email': { label: 'Email', icon: '📧', color: 'bg-purple-500' },
      'walk-in': { label: 'Walk-in', icon: '🚶', color: 'bg-gray-500' },
      'sales-rep': { label: 'Sales Rep', icon: '👔', color: 'bg-indigo-500' }
    };
    
    // Ensure source is a valid key
    const validSource = order.source && sourceConfig[order.source as keyof typeof sourceConfig] 
      ? order.source as keyof typeof sourceConfig 
      : 'pos';
    
    const config = sourceConfig[validSource] || defaultConfig;
    
    return {
      ...config,
      details: order.sourceDetails?.channel || order.sourceDetails?.salesRepName || ''
    };
  };

  const totalStats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    completedOrders: orders.filter(order => order.status === 'completed').length,
    pendingOrders: orders.filter(order => order.status === 'pending').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Daily Orders</h1>
          <p className="text-muted-foreground">
            Manage and track your daily orders and payments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => fetchOrders(selectedDate)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            onClick={async () => {
              try {
                const response = await fetch('/api/orders/seed-demo', { method: 'POST' });
                const result = await response.json();
                if (result.success) {
                  alert(`Seeded ${result.data.insertedCount} demo orders!`);
                  fetchOrders(selectedDate);
                } else {
                  alert('Failed to seed demo orders');
                }
              } catch (error) {
                console.error('Error seeding orders:', error);
                alert('Failed to seed demo orders');
              }
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Seed Demo Orders
          </Button>
          <Button 
            variant="outline" 
            onClick={async () => {
              try {
                const response = await fetch('/api/orders/test');
                const result = await response.json();
                console.log('Test API Response:', result);
                alert(`Found ${result.data.totalOrders} orders in database. Check console for details.`);
              } catch (error) {
                console.error('Error testing orders:', error);
                alert('Failed to test orders');
              }
            }}
          >
            <FileText className="h-4 w-4 mr-2" />
            Test DB
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Debug Information */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-sm text-yellow-800">Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-yellow-700">
              <p>Selected Date: {selectedDate}</p>
              <p>Orders Count: {orders.length}</p>
              <p>Loading: {loading ? 'Yes' : 'No'}</p>
              <p>Error: {error || 'None'}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {format(new Date(selectedDate), 'MMM dd, yyyy')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalStats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Today's earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.completedOrders}</div>
            <p className="text-xs text-muted-foreground">
              Successfully processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting completion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders, customers, or cashiers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-auto pl-10"
                />
              </div>
              <div className="relative">
                <CheckCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 pl-10 border border-input bg-background rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="px-3 py-2 pl-10 border border-input bg-background rounded-md text-sm"
                >
                  <option value="all">All Users</option>
                  {Array.from(new Set(orders.map(order => order.cashierName))).map(cashierName => (
                    <option key={cashierName} value={cashierName}>
                      {cashierName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setUserFilter('all');
                }}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>
            {filteredOrders.length} orders found for {format(new Date(selectedDate), 'MMM dd, yyyy')}
            {userFilter !== 'all' && ` • Filtered by ${userFilter}`}
            {statusFilter !== 'all' && ` • Status: ${statusFilter}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                Loading orders...
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center text-red-600">
                <XCircle className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">{error}</p>
              </div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center text-muted-foreground">
                <Receipt className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">No orders found for this date</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.filter(order => order && typeof order === 'object').map((order) => (
                <Card key={order._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">#{order.orderNumber}</h3>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {order.customerName || 'Walk-in Customer'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(order.orderDate), 'HH:mm')}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            ${order.total.toFixed(2)}
                          </div>
                          <div className="flex items-center gap-1">
                            {(() => {
                              const sourceInfo = getOrderSourceInfo(order);
                              return (
                                <>
                                  <span className="text-xs">{sourceInfo.icon}</span>
                                  <span className="text-xs">{sourceInfo.label}</span>
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Order Details - #{order.orderNumber}</DialogTitle>
                              <DialogDescription>
                                Complete order information and payment details
                              </DialogDescription>
                            </DialogHeader>
                            {selectedOrder && <OrderDetails order={selectedOrder} />}
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm">
                          <Printer className="h-4 w-4 mr-2" />
                          Print
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Order Details Component
function OrderDetails({ order }: { order: Order }) {
  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Order Number:</span>
                <span className="font-medium">#{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Date:</span>
                <span className="font-medium">{format(new Date(order.orderDate), 'MMM dd, yyyy HH:mm')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Cashier:</span>
                <span className="font-medium">{order.cashierName}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Customer:</span>
                <span className="font-medium">{order.customerName || 'Walk-in Customer'}</span>
              </div>
              {order.customerEmail && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <span className="font-medium">{order.customerEmail}</span>
                </div>
              )}
              {order.customerPhone && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Phone:</span>
                  <span className="font-medium">{order.customerPhone}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Branch:</span>
                <span className="font-medium">{order.branchName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Source:</span>
                <div className="flex items-center gap-2">
                  {(() => {
                    const sourceInfo = getOrderSourceInfo(order);
                    return (
                      <>
                        <span className="text-sm">{sourceInfo.icon}</span>
                        <span className="font-medium">{sourceInfo.label}</span>
                        {sourceInfo.details && (
                          <span className="text-xs text-muted-foreground">({sourceInfo.details})</span>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell className="text-muted-foreground">{item.productCode}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.brand}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-medium">${item.totalPrice.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Payment Method:</span>
                  <div className="flex items-center gap-2">
                    {getPaymentMethodIcon(order.payment.method)}
                    <span className="font-medium">{getPaymentMethodText(order.payment.method)}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Amount:</span>
                  <span className="font-medium">${order.payment.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge variant={order.payment.status === 'completed' ? 'default' : 'secondary'}>
                    {order.payment.status.charAt(0).toUpperCase() + order.payment.status.slice(1)}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                {order.payment.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Transaction ID:</span>
                    <span className="font-medium font-mono text-xs">{order.payment.transactionId}</span>
                  </div>
                )}
                {order.payment.processedAt && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Processed At:</span>
                    <span className="font-medium">{format(new Date(order.payment.processedAt), 'HH:mm:ss')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Totals */}
      <Card>
        <CardHeader>
          <CardTitle>Order Totals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Subtotal:</span>
              <span className="font-medium">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Tax:</span>
              <span className="font-medium">${order.tax.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Discount:</span>
                <span className="font-medium text-green-600">-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-lg">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {order.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{order.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper functions
function getPaymentMethodIcon(method: string) {
  const icons = {
    cash: Banknote,
    card: CreditCard,
    mobile: Smartphone,
    bank_transfer: Building2
  };
  const Icon = icons[method as keyof typeof icons] || CreditCard;
  return <Icon className="h-4 w-4" />;
}

function getPaymentMethodText(method: string) {
  const methods = {
    cash: 'Cash',
    card: 'Card',
    mobile: 'Mobile Payment',
    bank_transfer: 'Bank Transfer'
  };
  return methods[method as keyof typeof methods] || method;
}
