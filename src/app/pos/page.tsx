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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Plus, 
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  DollarSign,
  User,
  Search,
  Filter,
  Package,
  Printer,
  Calculator,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Receipt,
  QrCode,
  Scan,
  Users,
  Building2,
  Star,
  Tag,
  Percent,
  Edit,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { products, customers, categories, branches, users, posOrders } from '@/lib/data';
import type { Product, Customer, ProductCategory, CartItem, PaymentMethod, POSOrder } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';

export default function POSPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountType, setDiscountType] = useState<'amount' | 'percentage'>('amount');
  const [notes, setNotes] = useState('');
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentOrder, setCurrentOrder] = useState<POSOrder | null>(null);

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
    const isActive = product.isActive;

    return matchesSearch && matchesCategory && isActive;
  });

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const taxRate = 0.08; // 8% tax rate
  const taxAmount = subtotal * taxRate;
  const discountValue = discountType === 'percentage' ? (subtotal * discountAmount / 100) : discountAmount;
  const total = subtotal + taxAmount - discountValue;

  // Helper functions
  const getCategory = (categoryId: string) => categories.find(c => c.id === categoryId);
  const getProductTypeIcon = (type: string) => {
    switch (type) {
      case 'sale_item':
        return <Package className="h-4 w-4" />;
      case 'print_item':
        return <Printer className="h-4 w-4" />;
      case 'service_item':
        return <Zap className="h-4 w-4" />;
      case 'bundle':
        return <Target className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getProductTypeColor = (type: string) => {
    switch (type) {
      case 'sale_item':
        return 'bg-blue-100 text-blue-800';
      case 'print_item':
        return 'bg-green-100 text-green-800';
      case 'service_item':
        return 'bg-purple-100 text-purple-800';
      case 'bundle':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Cart functions
  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      updateCartItemQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      const newItem: CartItem = {
        id: `cart_${Date.now()}`,
        productId: product.id,
        product,
        quantity: 1,
        unitPrice: product.basePrice,
        totalPrice: product.basePrice,
      };
      setCart([...cart, newItem]);
    }
  };

  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(cart.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity,
          totalPrice: item.unitPrice * quantity
        };
      }
      return item;
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
    setDiscountAmount(0);
    setNotes('');
  };

  // Payment functions
  const processPayment = () => {
    if (cart.length === 0) return;
    
    const order: POSOrder = {
      id: `pos_${Date.now()}`,
      orderNumber: `POS-${new Date().getFullYear()}-${String(posOrders.length + 1).padStart(3, '0')}`,
      customerId: selectedCustomer?.id,
      customer: selectedCustomer,
      items: cart,
      subtotal,
      taxAmount,
      discountAmount: discountValue,
      totalAmount: total,
      paymentMethod,
      paymentStatus: 'paid',
      status: 'completed',
      cashierId: user?.id || 'user_001',
      cashier: user,
      branchId: user?.branchId || 'br_001',
      notes,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    setCurrentOrder(order);
    setIsPaymentDialogOpen(false);
    
    // In a real app, you would save the order to the database here
    console.log('Order processed:', order);
    
    // Clear cart after successful payment
    setTimeout(() => {
      clearCart();
      setCurrentOrder(null);
    }, 3000);
  };

  // Calculate today's stats
  const todayOrders = posOrders.filter(order => {
    const orderDate = new Date(order.createdAt).toDateString();
    const today = new Date().toDateString();
    return orderDate === today;
  });

  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const todayOrdersCount = todayOrders.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Point of Sale</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.firstName}! • {branches.find(b => b.id === user?.branchId)?.name || 'Main Branch'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Today's Sales</div>
              <div className="text-xl font-bold text-green-600">${todayRevenue.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">{todayOrdersCount} orders</div>
            </div>
            <Button variant="outline" size="sm">
              <Clock className="mr-2 h-4 w-4" />
              {new Date().toLocaleTimeString()}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Products */}
        <div className="w-2/3 p-6">
          {/* Search and Filters */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-2'}>
            {filteredProducts.map(product => (
              <Card 
                key={product.id} 
                className={`cursor-pointer hover:shadow-md transition-shadow ${viewMode === 'list' ? 'flex items-center p-4' : ''}`}
                onClick={() => addToCart(product)}
              >
                <CardContent className={viewMode === 'grid' ? 'p-4' : 'p-0 flex-1'}>
                  <div className={viewMode === 'grid' ? 'text-center' : 'flex items-center gap-4'}>
                    <div className={`mx-auto mb-3 w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center ${viewMode === 'list' ? 'mx-0 mb-0' : ''}`}>
                      {getProductTypeIcon(product.type)}
                    </div>
                    <div className={viewMode === 'list' ? 'flex-1' : ''}>
                      <h3 className={`font-semibold ${viewMode === 'list' ? 'text-left' : 'text-center'}`}>
                        {product.name}
                      </h3>
                      <p className={`text-sm text-muted-foreground ${viewMode === 'list' ? 'text-left' : 'text-center'}`}>
                        {product.sku}
                      </p>
                      <div className={`flex items-center gap-2 mt-2 ${viewMode === 'list' ? 'justify-start' : 'justify-center'}`}>
                        <Badge className={getProductTypeColor(product.type || 'sale_item')}>
                          {(product.type || 'sale_item').replace('_', ' ')}
                        </Badge>
                        <span className="font-bold text-green-600">
                          ${product.basePrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Panel - Cart */}
        <div className="w-1/3 bg-white border-l p-6 flex flex-col">
          {/* Cart Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Cart ({cart.length})
            </h2>
            <Button variant="outline" size="sm" onClick={clearCart}>
              Clear
            </Button>
          </div>

          {/* Customer Selection */}
          <div className="mb-4">
            <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  {selectedCustomer ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}` : 'Select Customer'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select Customer</DialogTitle>
                  <DialogDescription>
                    Choose a customer for this order
                  </DialogDescription>
                </DialogHeader>
                <CustomerSelector 
                  selectedCustomer={selectedCustomer}
                  onSelect={setSelectedCustomer}
                  onClose={() => setIsCustomerDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto mb-4">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Cart is empty</p>
                <p className="text-sm">Add products to get started</p>
              </div>
            ) : (
              <div className="space-y-2">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.product.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.product.sku}</p>
                      <p className="text-sm font-medium">${item.unitPrice.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${item.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          {cart.length > 0 && (
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (8%):</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              
              {/* Discount */}
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Discount"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                  className="flex-1"
                />
                <Select value={discountType} onValueChange={(value: 'amount' | 'percentage') => setDiscountType(value)}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="amount">$</SelectItem>
                    <SelectItem value="percentage">%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {discountValue > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount:</span>
                  <span>-${discountValue.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Payment Button */}
          {cart.length > 0 && (
            <Button 
              className="w-full mt-4" 
              size="lg"
              onClick={() => setIsPaymentDialogOpen(true)}
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Process Payment
            </Button>
          )}
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>
              Complete the payment for this order
            </DialogDescription>
          </DialogHeader>
          <PaymentDialog 
            total={total}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            onProcessPayment={processPayment}
            onCancel={() => setIsPaymentDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      {currentOrder && (
        <Dialog open={!!currentOrder} onOpenChange={() => setCurrentOrder(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                Payment Successful!
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-lg font-semibold">Order #{currentOrder.orderNumber}</p>
                <p className="text-2xl font-bold text-green-600">${currentOrder.totalAmount.toFixed(2)}</p>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1">
                  <Printer className="mr-2 h-4 w-4" />
                  Print Receipt
                </Button>
                <Button variant="outline" className="flex-1">
                  <Receipt className="mr-2 h-4 w-4" />
                  Email Receipt
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Customer Selector Component
function CustomerSelector({ 
  selectedCustomer, 
  onSelect, 
  onClose 
}: { 
  selectedCustomer: Customer | null; 
  onSelect: (customer: Customer | null) => void;
  onClose: () => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCustomers = customers.filter(customer =>
    customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="max-h-60 overflow-y-auto space-y-2">
        <Button
          variant={!selectedCustomer ? "default" : "outline"}
          className="w-full justify-start"
          onClick={() => {
            onSelect(null);
            onClose();
          }}
        >
          <User className="mr-2 h-4 w-4" />
          Walk-in Customer
        </Button>
        
        {filteredCustomers.map(customer => (
          <Button
            key={customer.id}
            variant={selectedCustomer?.id === customer.id ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => {
              onSelect(customer);
              onClose();
            }}
          >
            <Avatar className="mr-2 h-6 w-6">
              <AvatarFallback className="text-xs">
                {customer.firstName[0]}{customer.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <div className="font-medium">{customer.firstName} {customer.lastName}</div>
              <div className="text-xs text-muted-foreground">{customer.email}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}

// Payment Dialog Component
function PaymentDialog({
  total,
  paymentMethod,
  onPaymentMethodChange,
  onProcessPayment,
  onCancel
}: {
  total: number;
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onProcessPayment: () => void;
  onCancel: () => void;
}) {
  const [amountPaid, setAmountPaid] = useState(total);
  const [change, setChange] = useState(0);

  useEffect(() => {
    if (paymentMethod === 'cash') {
      setAmountPaid(total);
      setChange(Math.max(0, amountPaid - total));
    } else {
      setAmountPaid(total);
      setChange(0);
    }
  }, [paymentMethod, total, amountPaid]);

  const paymentMethods = [
    { value: 'cash', label: 'Cash', icon: DollarSign },
    { value: 'credit_card', label: 'Credit Card', icon: CreditCard },
    { value: 'debit_card', label: 'Debit Card', icon: CreditCard },
    { value: 'mobile_payment', label: 'Mobile Payment', icon: QrCode },
    { value: 'check', label: 'Check', icon: Receipt },
    { value: 'store_credit', label: 'Store Credit', icon: Tag },
  ];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-2xl font-bold">${total.toFixed(2)}</p>
        <p className="text-sm text-muted-foreground">Total Amount</p>
      </div>

      <div>
        <Label>Payment Method</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {paymentMethods.map(method => (
            <Button
              key={method.value}
              variant={paymentMethod === method.value ? "default" : "outline"}
              className="justify-start"
              onClick={() => onPaymentMethodChange(method.value as PaymentMethod)}
            >
              <method.icon className="mr-2 h-4 w-4" />
              {method.label}
            </Button>
          ))}
        </div>
      </div>

      {paymentMethod === 'cash' && (
        <div>
          <Label htmlFor="amountPaid">Amount Paid</Label>
          <Input
            id="amountPaid"
            type="number"
            step="0.01"
            value={amountPaid}
            onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
            className="mt-1"
          />
          {change > 0 && (
            <p className="text-sm text-green-600 mt-1">
              Change: ${change.toFixed(2)}
            </p>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          className="flex-1" 
          onClick={onProcessPayment}
          disabled={paymentMethod === 'cash' && amountPaid < total}
        >
          Process Payment
        </Button>
      </div>
    </div>
  );
}