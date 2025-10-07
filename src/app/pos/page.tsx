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
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { products, categories, branches, users, posOrders } from '@/lib/data';
import type { Product, ProductCategory, CartItem, PaymentMethod, POSOrder } from '@/lib/data';
import type { Customer } from '@/lib/models/customer';
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
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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
  const processPayment = async () => {
    if (cart.length === 0) return;
    
    setIsProcessingPayment(true);
    try {
      // Prepare order data for database
      const orderData = {
        customerId: selectedCustomer?._id?.toString() || selectedCustomer?.customerCode,
        customerName: selectedCustomer?.firstName && selectedCustomer?.lastName 
          ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}` 
          : selectedCustomer?.companyName || 'Walk-in Customer',
        customerEmail: selectedCustomer?.email,
        customerPhone: selectedCustomer?.phone,
        items: cart.map(item => ({
          id: item.id,
          productName: item.productName,
          productCode: item.sku,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          category: item.category || 'General',
          brand: item.brand || 'Unknown'
        })),
        subtotal,
        taxAmount,
        discountAmount: discountValue,
        totalAmount: total,
        paymentMethod,
        status: 'completed',
        cashierId: user?.id || 'user_001',
        cashierName: user?.name || 'Unknown Cashier',
        branchId: user?.branchId || 'br_001',
        branchName: 'Main Branch',
        notes,
        transactionId: `TXN-${Date.now()}`,
        source: 'pos' as const,
        sourceDetails: {
          channel: 'Point of Sale System'
        }
      };

      // Save order to database
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        // Create local order object for display
        const order: POSOrder = {
          id: `pos_${Date.now()}`,
          orderNumber: result.data.orderNumber,
          customerId: selectedCustomer?._id?.toString() || selectedCustomer?.customerCode,
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
        
        console.log('Order saved to database:', result.data);
        
        // Clear cart after successful payment
        setTimeout(() => {
          clearCart();
          setCurrentOrder(null);
        }, 3000);
      } else {
        throw new Error(result.error || 'Failed to save order');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert(`Error processing payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessingPayment(false);
    }
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
            <h1 className="text-2xl">Point of Sale</h1>
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
                  {selectedCustomer ? (selectedCustomer.companyName || `${selectedCustomer.firstName} ${selectedCustomer.lastName}`) : 'Select Customer'}
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
            isProcessing={isProcessingPayment}
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
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  
  // Fetch customers from API
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/customers');
      const result = await response.json();
      
      if (result.success) {
        setCustomers(result.data);
      } else {
        setError(result.error || 'Failed to fetch customers');
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);
  
  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.firstName.toLowerCase().includes(searchLower) ||
      customer.lastName.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      (customer.phone && customer.phone.includes(searchTerm)) ||
      (customer.companyName && customer.companyName.toLowerCase().includes(searchLower)) ||
      (customer.customerCode && customer.customerCode.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="space-y-4 w-full max-w-md">
      <div className="flex gap-2 w-full">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, phone, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowQuickAdd(true)}
          className="flex items-center gap-2 flex-shrink-0"
          size="sm"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Quick Add</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            fetchCustomers();
          }}
          disabled={loading}
          className="flex items-center gap-2 flex-shrink-0"
          size="sm"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>
      
      <div className="max-h-60 overflow-y-auto space-y-2 w-full">
        <Button
          variant={!selectedCustomer ? "default" : "outline"}
          className="w-full justify-start text-left"
          onClick={() => {
            onSelect(null);
            onClose();
          }}
        >
          <User className="mr-2 h-4 w-4 flex-shrink-0" />
          Walk-in Customer
        </Button>
        
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
              Loading customers...
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-4">
            <div className="text-center text-red-600">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="flex items-center justify-center py-4">
            <div className="text-center text-muted-foreground">
              <User className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">No customers found</p>
            </div>
          </div>
        ) : (
                filteredCustomers.map(customer => (
                  <Button
                    key={customer._id?.toString() || customer.customerCode}
                    variant={selectedCustomer?._id?.toString() === customer._id?.toString() ? "default" : "outline"}
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => {
                      onSelect(customer);
                      onClose();
                    }}
                  >
                    <Avatar className="mr-3 h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="text-xs">
                        {customer.firstName[0]}{customer.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {customer.companyName || `${customer.firstName} ${customer.lastName}`}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {customer.email}
                        {customer.phone && ` • ${customer.phone}`}
                      </div>
                    </div>
                  </Button>
                ))
        )}
      </div>

      {/* Quick Add Customer Dialog */}
      {showQuickAdd && (
        <QuickAddCustomerForm
          onCustomerAdded={(customer) => {
            setCustomers(prev => [customer, ...prev]);
            onSelect(customer);
            setShowQuickAdd(false);
            onClose();
          }}
          onCancel={() => setShowQuickAdd(false)}
        />
      )}
    </div>
  );
}

// Quick Add Customer Form Component
function QuickAddCustomerForm({
  onCustomerAdded,
  onCancel
}: {
  onCustomerAdded: (customer: Customer) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    customerType: 'individual' as 'individual' | 'business'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Generate customer code
      const customerCode = `CUST-${Date.now()}`;
      
      // Prepare customer data
      const customerData = {
        customerCode,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        companyName: formData.companyName || undefined,
        address: {
          street: 'TBD',
          city: 'TBD',
          state: 'TBD',
          zipCode: 'TBD',
          country: 'TBD'
        },
        customerType: formData.customerType,
        creditLimit: 0,
        paymentTerms: 30,
        notes: 'Quick added from POS',
        tags: ['pos-quick-add']
      };

      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });

      const result = await response.json();

      if (result.success) {
        onCustomerAdded(result.data);
      } else {
        setError(result.error || 'Failed to create customer');
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      setError('Failed to create customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Quick Add Customer</h3>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="firstName" className="text-sm">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                className="h-9"
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-sm">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                className="h-9"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-sm">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="h-9"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="phone" className="text-sm">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="h-9"
              />
            </div>
            <div>
              <Label htmlFor="companyName" className="text-sm">Company</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="h-9"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm">Customer Type</Label>
            <Select 
              value={formData.customerType} 
              onValueChange={(value: 'individual' | 'business') => setFormData({ ...formData, customerType: value })}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 h-9"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-9"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                'Create Customer'
              )}
            </Button>
          </div>
        </form>
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
  onCancel,
  isProcessing
}: {
  total: number;
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onProcessPayment: () => void;
  onCancel: () => void;
  isProcessing: boolean;
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
          disabled={isProcessing || (paymentMethod === 'cash' && amountPaid < total)}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            'Process Payment'
          )}
        </Button>
      </div>
    </div>
  );
}