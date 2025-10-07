'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  Save,
  CheckCircle,
  AlertCircle,
  Package,
  DollarSign,
  User,
  Calendar,
  FileText,
  RotateCcw,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { ReturnReason, ReturnType, ItemCondition } from '@/lib/models/return-order';

interface Order {
  _id: string;
  orderNumber: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    productCode: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    category: string;
    brand: string;
  }>;
  total: number;
  orderDate: Date;
  status: string;
}

interface ReturnItem {
  id: string;
  originalItemId: string;
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  condition: ItemCondition;
  reason: string;
  refundAmount: number;
  restockingFee?: number;
  finalRefundAmount: number;
}

export default function CreateReturnOrderPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    originalOrderId: '',
    returnReason: 'defective' as ReturnReason,
    returnType: 'refund' as ReturnType,
    notes: '',
    internalNotes: ''
  });
  const [originalOrder, setOriginalOrder] = useState<Order | null>(null);
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const [isCreatingReturn, setIsCreatingReturn] = useState(false);
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Order[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Search for orders
  const searchOrders = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await fetch(`/api/orders?search=${encodeURIComponent(searchTerm.trim())}&limit=10`);
      const result = await response.json();
      
      if (result.success) {
        setSearchResults(result.data);
      } else {
        console.error('Search failed:', result.error);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching orders:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Load original order when order ID is provided
  const loadOriginalOrder = async (orderId: string) => {
    if (!orderId.trim()) {
      toast({
        title: "Order ID Required",
        description: "Please enter an order ID or order number",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoadingOrder(true);
    try {
      console.log('Frontend: Loading order with ID:', orderId);
      const url = `/api/orders/${encodeURIComponent(orderId.trim())}`;
      console.log('Frontend: Making request to:', url);
      
      const response = await fetch(url);
      console.log('Frontend: Response status:', response.status);
      console.log('Frontend: Response ok:', response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Frontend: Order API response:', result);
      
      if (result.success) {
        setOriginalOrder(result.data);
        // Initialize return items from original order
        const items: ReturnItem[] = result.data.items.map((item: any) => ({
          id: `return-${item.id}`,
          originalItemId: item.id,
          productId: item.productId,
          productName: item.productName,
          productCode: item.productCode,
          quantity: 0, // Start with 0, user will select
          unitPrice: item.unitPrice,
          totalPrice: 0,
          condition: 'new' as ItemCondition,
          reason: '',
          refundAmount: 0,
          restockingFee: 0,
          finalRefundAmount: 0
        }));
        setReturnItems(items);
        
        toast({
          title: "Order Loaded Successfully",
          description: `Found order: ${result.data.orderNumber}`,
        });
      } else {
        console.error('Frontend: Order not found:', result.error);
        toast({
          title: "Order Not Found",
          description: result.error || "The specified order ID was not found",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Frontend: Error loading order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Network Error",
        description: `Failed to load order details: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoadingOrder(false);
    }
  };

  // Update return item
  const updateReturnItem = (itemId: string, updates: Partial<ReturnItem>) => {
    setReturnItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const updated = { ...item, ...updates };
        // Recalculate final refund amount
        updated.finalRefundAmount = updated.refundAmount - (updated.restockingFee || 0);
        return updated;
      }
      return item;
    }));
  };

  // Remove return item
  const removeReturnItem = (itemId: string) => {
    setReturnItems(prev => prev.filter(item => item.id !== itemId));
  };

  // Calculate totals
  const totals = {
    totalItems: returnItems.filter(item => item.quantity > 0).length,
    totalQuantity: returnItems.reduce((sum, item) => sum + item.quantity, 0),
    totalRefundAmount: returnItems.reduce((sum, item) => sum + item.finalRefundAmount, 0)
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!originalOrder) {
      toast({
        title: "Original Order Required",
        description: "Please load an original order first",
        variant: "destructive",
      });
      return;
    }
    
    if (totals.totalItems === 0) {
      toast({
        title: "Items Required",
        description: "Please select at least one item to return",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingReturn(true);
    try {
      const returnData = {
        originalOrderId: originalOrder._id,
        customerId: originalOrder.customerId,
        returnReason: formData.returnReason,
        returnType: formData.returnType,
        items: returnItems.filter(item => item.quantity > 0),
        notes: formData.notes,
        internalNotes: formData.internalNotes
      };

      const response = await fetch('/api/return-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(returnData),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Return Order Created Successfully!",
          description: `Return Number: ${result.data.returnNumber}`,
        });
        // Reset form
        setFormData({
          originalOrderId: '',
          returnReason: 'defective',
          returnType: 'refund',
          notes: '',
          internalNotes: ''
        });
        setOriginalOrder(null);
        setReturnItems([]);
      } else {
        toast({
          title: "Error Creating Return Order",
          description: result.error || "Failed to create return order",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating return order:', error);
      toast({
        title: "Network Error",
        description: "Failed to create return order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingReturn(false);
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
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl">Create Return Order</h1>
            <p className="text-muted-foreground">
              Process a return for an existing order
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Original Order Section */}
        <Card>
          <CardHeader>
            <CardTitle>Original Order</CardTitle>
            <CardDescription>
              Load the original order to process the return
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Label htmlFor="originalOrderId">Order ID or Order Number</Label>
                  <Input
                    id="originalOrderId"
                    value={formData.originalOrderId}
                    onChange={(e) => setFormData({ ...formData, originalOrderId: e.target.value })}
                    placeholder="Enter order ID or order number"
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    type="button" 
                    onClick={() => loadOriginalOrder(formData.originalOrderId)}
                    disabled={!formData.originalOrderId || isLoadingOrder}
                  >
                    {isLoadingOrder ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4 mr-2" />
                    )}
                    {isLoadingOrder ? 'Loading...' : 'Load Order'}
                  </Button>
                </div>
              </div>
              
              {/* Order Search */}
              <div className="space-y-2">
                <Label htmlFor="orderSearch">Search Orders</Label>
                <div className="flex space-x-2">
                  <Input
                    id="orderSearch"
                    value={orderSearchTerm}
                    onChange={(e) => {
                      setOrderSearchTerm(e.target.value);
                      if (e.target.value.length > 2) {
                        searchOrders(e.target.value);
                      } else {
                        setSearchResults([]);
                      }
                    }}
                    placeholder="Search by order number, customer name, or email..."
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => searchOrders(orderSearchTerm)}
                    disabled={!orderSearchTerm || isSearching}
                  >
                    {isSearching ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4 mr-2" />
                    )}
                    Search
                  </Button>
                </div>
                
                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="border rounded-lg p-2 bg-gray-50 max-h-48 overflow-y-auto">
                    <div className="text-sm font-medium mb-2">Search Results:</div>
                    {searchResults.map((order) => (
                      <div 
                        key={order._id}
                        className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
                        onClick={() => {
                          setFormData({ ...formData, originalOrderId: order.orderNumber });
                          setSearchResults([]);
                          setOrderSearchTerm('');
                        }}
                      >
                        <div>
                          <div className="font-medium">{order.orderNumber}</div>
                          <div className="text-sm text-gray-600">
                            {order.customerName} • {formatCurrency(order.total)} • {formatDate(order.orderDate.toString())}
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Select
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Demo Data and Test Buttons */}
              <div className="flex justify-center space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/orders/seed-demo', { method: 'POST' });
                      const result = await response.json();
                      if (result.success) {
                        toast({
                          title: "Demo Orders Created",
                          description: `Created ${result.data.insertedCount} demo orders`,
                        });
                      } else {
                        toast({
                          title: "Error",
                          description: "Failed to create demo orders",
                          variant: "destructive",
                        });
                      }
                    } catch (error) {
                      console.error('Error seeding orders:', error);
                      toast({
                        title: "Error",
                        description: "Failed to create demo orders",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Seed Demo Orders
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/orders/test');
                      const result = await response.json();
                      if (result.success) {
                        console.log('Test API Response:', result.data);
                        toast({
                          title: "Database Test",
                          description: `Found ${result.data.totalOrders} orders in database`,
                        });
                      } else {
                        toast({
                          title: "Test Failed",
                          description: "Failed to test database connection",
                          variant: "destructive",
                        });
                      }
                    } catch (error) {
                      console.error('Error testing database:', error);
                      toast({
                        title: "Test Error",
                        description: "Failed to test database connection",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Test Database
                </Button>
              </div>
            </div>

            {originalOrder && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Order Number</Label>
                    <p className="text-sm text-muted-foreground">{originalOrder.orderNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Customer</Label>
                    <p className="text-sm text-muted-foreground">{originalOrder.customerName || 'Unknown Customer'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Order Date</Label>
                    <p className="text-sm text-muted-foreground">{formatDate(originalOrder.orderDate.toString())}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Total Amount</Label>
                    <p className="text-sm text-muted-foreground font-medium">{formatCurrency(originalOrder.total)}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Return Details Section */}
        <Card>
          <CardHeader>
            <CardTitle>Return Details</CardTitle>
            <CardDescription>
              Specify the reason and type of return
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="notes">Customer Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Customer's reason for return..."
                />
              </div>
              <div>
                <Label htmlFor="internalNotes">Internal Notes</Label>
                <Textarea
                  id="internalNotes"
                  value={formData.internalNotes}
                  onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
                  rows={3}
                  placeholder="Internal notes for staff..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Return Items Section */}
        {originalOrder && (
          <Card>
            <CardHeader>
              <CardTitle>Return Items</CardTitle>
              <CardDescription>
                Select items to return and specify their condition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Available Qty</TableHead>
                      <TableHead>Return Qty</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Refund Amount</TableHead>
                      <TableHead>Restocking Fee</TableHead>
                      <TableHead>Final Amount</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {returnItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.productName}</div>
                            <div className="text-sm text-muted-foreground">{item.productCode}</div>
                          </div>
                        </TableCell>
                        <TableCell>{originalOrder.items.find(o => o.id === item.originalItemId)?.quantity || 0}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => updateReturnItem(item.id, { quantity: Math.max(0, item.quantity - 1) })}
                              disabled={item.quantity <= 0}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => updateReturnItem(item.id, { quantity: item.quantity + 1 })}
                              disabled={item.quantity >= (originalOrder.items.find(o => o.id === item.originalItemId)?.quantity || 0)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={item.condition} 
                            onValueChange={(value: ItemCondition) => updateReturnItem(item.id, { condition: value })}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="like_new">Like New</SelectItem>
                              <SelectItem value="good">Good</SelectItem>
                              <SelectItem value="fair">Fair</SelectItem>
                              <SelectItem value="damaged">Damaged</SelectItem>
                              <SelectItem value="defective">Defective</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.reason}
                            onChange={(e) => updateReturnItem(item.id, { reason: e.target.value })}
                            placeholder="Reason..."
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.refundAmount}
                            onChange={(e) => updateReturnItem(item.id, { refundAmount: parseFloat(e.target.value) || 0 })}
                            placeholder="0.00"
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.restockingFee || 0}
                            onChange={(e) => updateReturnItem(item.id, { restockingFee: parseFloat(e.target.value) || 0 })}
                            placeholder="0.00"
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(item.finalRefundAmount)}
                        </TableCell>
                        <TableCell>
                          {item.quantity > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeReturnItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Section */}
        {totals.totalItems > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Return Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Items:</span>
                  <span>{totals.totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Quantity:</span>
                  <span>{totals.totalQuantity}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Refund Amount:</span>
                  <span>{formatCurrency(totals.totalRefundAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={!originalOrder || totals.totalItems === 0 || isCreatingReturn}
          >
            {isCreatingReturn ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Creating Return Order...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Return Order
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
