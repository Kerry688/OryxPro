'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Download,
  Eye,
  Check,
  X,
  Package,
  Calendar,
  User,
  MapPin,
  CreditCard,
  Truck,
  RefreshCw,
  FileText,
  Plus
} from 'lucide-react';

// Mock data
const mockOrders = [
  {
    id: 'ORD-2024-001',
    date: '2024-04-15',
    status: 'processing',
    total: 5250,
    itemsCount: 3,
    shippingAddress: '123 Business District, Cairo, Egypt',
    paymentStatus: 'pending',
    requiredDate: '2024-04-25',
    items: [
      {
        id: '1',
        productId: 'PROD-001',
        productName: 'Industrial Printer HP LaserJet',
        productCode: 'HP-LJ-001',
        quantity: 1,
        unitPrice: 25000,
        lineTotal: 25000,
        imageUrl: '/placeholder-product.jpg'
      },
      {
        id: '2',
        productId: 'PROD-002',
        productName: 'Office Chair Ergonomic',
        productCode: 'OC-ERG-001',
        quantity: 2,
        unitPrice: 1500,
        lineTotal: 3000,
        imageUrl: '/placeholder-product.jpg'
      }
    ]
  },
  {
    id: 'ORD-2024-002',
    date: '2024-04-12',
    status: 'shipped',
    total: 3200,
    itemsCount: 2,
    shippingAddress: '456 Industrial Zone, Alexandria, Egypt',
    paymentStatus: 'paid',
    shippedDate: '2024-04-14',
    trackingNumber: 'DHL1234567890',
    items: [
      {
        id: '1',
        productId: 'PROD-003',
        productName: 'Network Switch 24-Port',
        productCode: 'NS-24-001',
        quantity: 1,
        unitPrice: 2800,
        lineTotal: 2800,
        imageUrl: '/placeholder-product.jpg'
      },
      {
        id: '2',
        productId: 'PROD-004',
        productName: 'CAT6 Ethernet Cable',
        productCode: 'CAT6-100',
        quantity: 2,
        unitPrice: 200,
        lineTotal: 400,
        imageUrl: '/placeholder-product.jpg'
      }
    ]
  },
  {
    id: 'ORD-2024-003',
    date: '2024-04-10',
    status: 'pending',
    total: 1800,
    itemsCount: 1,
    shippingAddress: '123 Business District, Cairo, Egypt',
    paymentStatus: 'pending',
    requiredDate: '2024-04-20',
    items: [
      {
        id: '1',
        productId: 'PROD-005',
        productName: 'Wireless Mouse Logitech',
        productCode: 'WM-LOG-001',
        quantity: 10,
        unitPrice: 180,
        lineTotal: 1800,
        imageUrl: '/placeholder-product.jpg'
      }
    ]
  }
];

const mockQuotes = [
  {
    id: 'QUO-2024-001',
    date: '2024-04-16',
    status: 'sent',
    total: 15000,
    itemsCount: 2,
    validUntil: '2024-05-16',
    items: [
      {
        id: '1',
        productId: 'PROD-006',
        productName: 'Server Rack 42U',
        productCode: 'SR-42U-001',
        quantity: 1,
        unitPrice: 12000,
        lineTotal: 12000,
        imageUrl: '/placeholder-product.jpg'
      },
      {
        id: '2',
        productId: 'PROD-007',
        productName: 'UPS Battery Backup',
        productCode: 'UPS-1500',
        quantity: 2,
        unitPrice: 1500,
        lineTotal: 3000,
        imageUrl: '/placeholder-product.jpg'
      }
    ]
  }
];

export function CustomerOrders() {
  const [orders, setOrders] = useState(mockOrders);
  const [quotes, setQuotes] = useState(mockQuotes);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusBadge = (status: string) => {
    const configs = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-green-100 text-green-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'sent': 'bg-blue-100 text-blue-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'expired': 'bg-gray-100 text-gray-800'
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

  const handleApproveQuote = (quoteId: string) => {
    setQuotes(prev => prev.map(quote => 
      quote.id === quoteId 
        ? { ...quote, status: 'approved', approvedDate: new Date().toISOString() }
        : quote
    ));
  };

  const handleRejectQuote = (quoteId: string) => {
    setQuotes(prev => prev.map(quote => 
      quote.id === quoteId 
        ? { ...quote, status: 'rejected' }
        : quote
    ));
  };

  const handleReorder = (order: any) => {
    // Reorder logic
    console.log('Reordering:', order);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some((item: any) => item.productName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.items.some((item: any) => item.productName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Orders & Quotes</h2>
          <p className="text-muted-foreground">Manage your orders and review quotations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search orders or quotes..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{order.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(order.date)} • {order.itemsCount} items
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">EGP {order.total.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          Payment: <Badge className={getPaymentStatusBadge(order.paymentStatus)}>
                            {order.paymentStatus}
                          </Badge>
                        </div>
                      </div>
                      <Badge className={getStatusBadge(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-muted-foreground">Ship to:</span>
                      <span>{order.shippingAddress}</span>
                    </div>
                    {order.requiredDate && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-muted-foreground">Required:</span>
                        <span>{formatDate(order.requiredDate)}</span>
                      </div>
                    )}
                    {order.trackingNumber && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Truck className="h-4 w-4 text-gray-400" />
                        <span className="text-muted-foreground">Tracking:</span>
                        <span>{order.trackingNumber}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsOrderDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReorder(order)}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reorder
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    {order.status === 'delivered' && (
                      <Button variant="outline" size="sm">
                        Return Items
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quotes" className="space-y-6">
          <div className="space-y-4">
            {filteredQuotes.map((quote) => (
              <Card key={quote.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">{quote.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(quote.date)} • Valid until {formatDate(quote.validUntil)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">EGP {quote.total.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          {quote.itemsCount} items
                        </div>
                      </div>
                      <Badge className={getStatusBadge(quote.status)}>
                        {quote.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedQuote(quote);
                          setIsQuoteDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Quote
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                    {quote.status === 'sent' && (
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm"
                          onClick={() => handleApproveQuote(quote.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRejectQuote(quote.id)}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Order Details Dialog */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Complete information about this order
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Order Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>Order Date: {formatDate(selectedOrder.date)}</div>
                    <div>Status: <Badge className={getStatusBadge(selectedOrder.status)}>{selectedOrder.status}</Badge></div>
                    <div>Payment Status: <Badge className={getPaymentStatusBadge(selectedOrder.paymentStatus)}>{selectedOrder.paymentStatus}</Badge></div>
                    {selectedOrder.requiredDate && <div>Required Date: {formatDate(selectedOrder.requiredDate)}</div>}
                    {selectedOrder.shippedDate && <div>Shipped Date: {formatDate(selectedOrder.shippedDate)}</div>}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Shipping Address</h4>
                  <div className="text-sm text-muted-foreground">
                    {selectedOrder.shippingAddress}
                  </div>
                  {selectedOrder.trackingNumber && (
                    <div className="mt-2">
                      <h5 className="font-medium">Tracking Information</h5>
                      <div className="text-sm">Tracking Number: {selectedOrder.trackingNumber}</div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Order Items</h4>
                <div className="space-y-4">
                  {selectedOrder.items.map((item: any) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-sm text-muted-foreground">{item.productCode}</div>
                        <div className="text-sm">Quantity: {item.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">EGP {item.unitPrice.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">each</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">EGP {item.lineTotal.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">total</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-lg font-medium">
                  Total: EGP {selectedOrder.total.toLocaleString()}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Invoice
                  </Button>
                  <Button onClick={() => handleReorder(selectedOrder)}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reorder
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Quote Details Dialog */}
      <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Quote Details - {selectedQuote?.id}</DialogTitle>
            <DialogDescription>
              Review this quotation and make a decision
            </DialogDescription>
          </DialogHeader>
          
          {selectedQuote && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Quote Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>Quote Date: {formatDate(selectedQuote.date)}</div>
                    <div>Valid Until: {formatDate(selectedQuote.validUntil)}</div>
                    <div>Status: <Badge className={getStatusBadge(selectedQuote.status)}>{selectedQuote.status}</Badge></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Terms & Conditions</h4>
                  <div className="text-sm text-muted-foreground">
                    Payment terms, delivery conditions, and validity period will be displayed here.
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Quote Items</h4>
                <div className="space-y-4">
                  {selectedQuote.items.map((item: any) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-sm text-muted-foreground">{item.productCode}</div>
                        <div className="text-sm">Quantity: {item.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">EGP {item.unitPrice.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">each</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">EGP {item.lineTotal.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">total</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-lg font-medium">
                  Total: EGP {selectedQuote.total.toLocaleString()}
                </div>
                {selectedQuote.status === 'sent' && (
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button variant="outline" onClick={() => handleRejectQuote(selectedQuote.id)}>
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button onClick={() => handleApproveQuote(selectedQuote.id)}>
                      <Check className="h-4 w-4 mr-2" />
                      Approve Quote
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
