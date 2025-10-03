'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Plus, 
  Search, 
  Trash2,
  Package,
  User,
  Calendar,
  DollarSign,
  ShoppingCart,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  FileText,
  Save,
  X,
  Minus,
  Plus as PlusIcon,
  RefreshCw,
  Building2,
  UserPlus
} from 'lucide-react';
import { branches } from '@/lib/data';
import type { SalesOrderSource, SalesOrderPriority } from '@/lib/data';
import type { Customer } from '@/lib/models/customer';
import type { Product } from '@/lib/models/product';
import { useToast } from '@/hooks/use-toast';

interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  totalPrice: number;
  customizations?: Record<string, any>;
  notes?: string;
}

export default function CreateOrderPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    customerId: '',
    branchId: 'br_001',
    source: 'pos' as SalesOrderSource,
    priority: 'normal' as SalesOrderPriority,
    requiredDate: '',
    notes: '',
    internalNotes: '',
    paymentTerms: '30', // Default 30 days
    promotionId: 'none',
    shippingMethod: 'pickup' as 'pickup' | 'delivery' | 'shipping',
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    }
  });

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  
  // Product management
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  
  // Customer management
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [showCreateCustomer, setShowCreateCustomer] = useState(false);
  
  // Create customer form
  const [createCustomerForm, setCreateCustomerForm] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    customerType: 'individual' as 'individual' | 'business',
    paymentTerms: 30,
    notes: ''
  });
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  
  // Promotions data
  const [promotions, setPromotions] = useState([
    { id: 'promo-1', name: 'Summer Sale 2024', discount: 15, type: 'percentage' },
    { id: 'promo-2', name: 'Bulk Discount', discount: 10, type: 'percentage' },
    { id: 'promo-3', name: 'New Customer', discount: 20, type: 'percentage' },
    { id: 'promo-4', name: 'Loyalty Reward', discount: 5, type: 'percentage' },
    { id: 'promo-5', name: 'Holiday Special', discount: 25, type: 'percentage' }
  ]);

  // Fetch customers from API
  const fetchCustomers = async () => {
    setIsLoadingCustomers(true);
    try {
      const response = await fetch('/api/customers');
      const result = await response.json();
      if (result.success) {
        setCustomers(result.data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setIsLoadingCustomers(false);
    }
  };

  // Load customers and products on component mount
  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);

  // Fetch products from API
  const fetchProducts = async (searchQuery?: string) => {
    setIsLoadingProducts(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) {
        params.append('query', searchQuery);
      }
      params.append('limit', '50');
      params.append('stockStatus', 'all');
      
      const response = await fetch(`/api/products?${params.toString()}`);
      const result = await response.json();
      if (result.products) {
        setProducts(result.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Create new customer
  const createCustomer = async () => {
    if (!createCustomerForm.firstName || !createCustomerForm.lastName || !createCustomerForm.email) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields (First Name, Last Name, Email)",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingCustomer(true);
    try {
      const customerCode = `CUST-${Date.now()}`;
      const customerData = {
        customerCode,
        firstName: createCustomerForm.firstName,
        lastName: createCustomerForm.lastName,
        companyName: createCustomerForm.companyName || undefined,
        email: createCustomerForm.email,
        phone: createCustomerForm.phone || undefined,
        address: createCustomerForm.address,
        customerType: createCustomerForm.customerType,
        paymentTerms: createCustomerForm.paymentTerms,
        notes: createCustomerForm.notes || undefined,
        tags: []
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
        // Add new customer to the list
        setCustomers(prev => [...prev, result.data]);
        // Select the new customer
        setFormData({ ...formData, customerId: result.data._id?.toString() || '' });
        // Close dialogs and reset form
        setShowCreateCustomer(false);
        setIsCustomerDialogOpen(false);
        setCreateCustomerForm({
          firstName: '',
          lastName: '',
          companyName: '',
          email: '',
          phone: '',
          address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA'
          },
          customerType: 'individual',
          paymentTerms: 30,
          notes: ''
        });
        toast({
          title: "Customer Created Successfully!",
          description: "New customer has been added and selected for this order",
        });
      } else {
        toast({
          title: "Error Creating Customer",
          description: result.error || "Failed to create customer",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      toast({
        title: "Network Error",
        description: "Failed to create customer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingCustomer(false);
    }
  };

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!productSearchTerm) return products;
    const searchLower = productSearchTerm.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(searchLower) ||
      product.sku.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }, [products, productSearchTerm]);

  // Get product availability information
  const getProductAvailability = (product: Product) => {
    if (product.type === 'sales_product' || product.type === 'raw_material') {
      const stock = (product as any).stock || 0;
      const minStock = (product as any).minStock || 0;
      
      if (stock <= 0) {
        return { status: 'out_of_stock', text: 'Out of Stock', color: 'text-red-500' };
      } else if (stock <= minStock) {
        return { status: 'low_stock', text: `Low Stock (${stock})`, color: 'text-orange-500' };
      } else {
        return { status: 'in_stock', text: `In Stock (${stock})`, color: 'text-green-500' };
      }
    } else if (product.type === 'service') {
      return { status: 'available', text: 'Available', color: 'text-blue-500' };
    } else if (product.type === 'print_item') {
      return { status: 'available', text: 'Print Available', color: 'text-purple-500' };
    } else {
      return { status: 'available', text: 'Available', color: 'text-gray-500' };
    }
  };

  // Filter customers based on search
  const filteredCustomers = useMemo(() => {
    if (!customerSearch) return customers;
    const searchLower = customerSearch.toLowerCase();
    return customers.filter(customer => 
      customer.firstName.toLowerCase().includes(searchLower) ||
      customer.lastName.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      (customer.phone && customer.phone.includes(customerSearch)) ||
      (customer.companyName && customer.companyName.toLowerCase().includes(searchLower)) ||
      (customer.customerCode && customer.customerCode.toLowerCase().includes(searchLower))
    );
  }, [customers, customerSearch]);

  // Calculate order totals
  const orderTotals = useMemo(() => {
    const subtotal = orderItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const discountAmount = orderItems.reduce((sum, item) => {
      const itemTotal = item.unitPrice * item.quantity;
      return sum + (itemTotal * (item.discount / 100));
    }, 0);
    const taxAmount = orderItems.reduce((sum, item) => {
      const itemTotal = item.unitPrice * item.quantity;
      const itemDiscount = itemTotal * (item.discount / 100);
      const itemSubtotal = itemTotal - itemDiscount;
      return sum + (itemSubtotal * (item.taxRate / 100));
    }, 0);
    const total = subtotal - discountAmount + taxAmount;

    return {
      subtotal,
      discountAmount,
      taxAmount,
      total
    };
  }, [orderItems]);

  const addProductToOrder = (product: Product) => {
    const existingItem = orderItems.find(item => item.productId === product._id?.toString());
    
    if (existingItem) {
      // Update quantity if product already exists
      setOrderItems(items =>
        items.map(item =>
          item.productId === product._id?.toString()
            ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.unitPrice }
            : item
        )
      );
    } else {
      // Get product price based on type
      let unitPrice = 0;
      if (product.type === 'sales_product') {
        unitPrice = (product as any).price || 0;
      } else if (product.type === 'print_item' || product.type === 'service' || product.type === 'kit_bundle') {
        unitPrice = (product as any).basePrice || 0;
      } else if (product.type === 'raw_material') {
        unitPrice = (product as any).cost || 0;
      } else if (product.type === 'asset') {
        unitPrice = (product as any).currentValue || 0;
      }

      // Add new product
      const newItem: OrderItem = {
        id: `item_${Date.now()}`,
        productId: product._id?.toString() || '',
        product,
        quantity: 1,
        unitPrice,
        discount: 0,
        taxRate: 8, // Default tax rate
        totalPrice: unitPrice,
        customizations: {},
        notes: ''
      };
      setOrderItems([...orderItems, newItem]);
    }
    
    setSelectedProduct(null);
    setProductSearchTerm('');
    setIsAddingProduct(false);
  };

  const updateOrderItem = (itemId: string, updates: Partial<OrderItem>) => {
    setOrderItems(items =>
      items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, ...updates };
          // Recalculate total price
          const itemSubtotal = updatedItem.unitPrice * updatedItem.quantity;
          const discountAmount = itemSubtotal * (updatedItem.discount / 100);
          const taxAmount = (itemSubtotal - discountAmount) * (updatedItem.taxRate / 100);
          updatedItem.totalPrice = itemSubtotal - discountAmount + taxAmount;
          return updatedItem;
        }
        return item;
      })
    );
  };

  const removeOrderItem = (itemId: string) => {
    setOrderItems(items => items.filter(item => item.id !== itemId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerId) {
      toast({
        title: "Customer Required",
        description: "Please select a customer for this order",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.paymentTerms) {
      toast({
        title: "Payment Terms Required",
        description: "Please select payment terms for this order",
        variant: "destructive",
      });
      return;
    }
    
    if (orderItems.length === 0) {
      toast({
        title: "Products Required",
        description: "Please add at least one product to the order",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingOrder(true);
    try {
      // Prepare order data for database
      const orderData = {
        customerId: formData.customerId,
        customerName: selectedCustomer?.firstName && selectedCustomer?.lastName 
          ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}` 
          : selectedCustomer?.companyName || 'Unknown Customer',
        customerEmail: selectedCustomer?.email,
        customerPhone: selectedCustomer?.phone,
        items: orderItems.map(item => ({
          id: item.id,
          productId: item.productId,
          productName: item.product.name,
          productCode: item.product.sku,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          category: item.product.category || 'General',
          brand: item.product.tags?.[0] || 'Unknown'
        })),
        subtotal: orderTotals.subtotal,
        taxAmount: orderTotals.taxAmount,
        discountAmount: orderTotals.discountAmount,
        totalAmount: orderTotals.total,
        paymentMethod: 'pending', // Will be updated when payment is processed
        status: 'draft',
        cashierId: 'user_001', // This would come from auth context
        cashierName: 'Current User', // This would come from auth context
        branchId: formData.branchId,
        branchName: branches.find(b => b.id === formData.branchId)?.name || 'Main Branch',
        notes: formData.notes,
        internalNotes: formData.internalNotes,
        source: formData.source,
        sourceDetails: {
          channel: formData.source === 'online' ? 'Website' : 
                   formData.source === 'phone' ? 'Phone Call' :
                   formData.source === 'email' ? 'Email' :
                   formData.source === 'walk_in' ? 'Walk-in Customer' :
                   formData.source === 'sales_rep' ? 'Sales Representative' : 'Point of Sale'
        },
        paymentTerms: parseInt(formData.paymentTerms),
        promotionId: formData.promotionId !== 'none' ? formData.promotionId : null,
        shippingMethod: formData.shippingMethod,
        shippingAddress: formData.shippingAddress,
        priority: formData.priority,
        requiredDate: formData.requiredDate ? new Date(formData.requiredDate) : null
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
        toast({
          title: "Order Created Successfully!",
          description: `Order Number: ${result.data.orderNumber}`,
        });
        // Reset form
        setFormData({
          customerId: '',
          branchId: 'br_001',
          source: 'pos' as SalesOrderSource,
          priority: 'normal' as SalesOrderPriority,
          requiredDate: '',
          notes: '',
          internalNotes: '',
          paymentTerms: '30',
          promotionId: 'none',
          shippingMethod: 'pickup' as 'pickup' | 'delivery' | 'shipping',
          shippingAddress: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA'
          }
        });
        setOrderItems([]);
        setSelectedCustomer(null);
        setProductSearchTerm('');
      } else {
        toast({
          title: "Error Creating Order",
          description: result.error || "Failed to create order",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Network Error",
        description: "Failed to create order. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Update selected customer when formData.customerId changes
  useEffect(() => {
    if (formData.customerId && customers.length > 0) {
      const customer = customers.find(c => c._id?.toString() === formData.customerId);
      setSelectedCustomer(customer || null);
    } else {
      setSelectedCustomer(null);
    }
  }, [formData.customerId, customers]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Order</h1>
          <p className="text-muted-foreground">
            Create a new sales order for a customer
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isCreatingOrder}>
            {isCreatingOrder ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Creating Order...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Order
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
              <CardDescription>
                Basic order details and customer information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customer">Customer *</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCustomerDialogOpen(true)}
                      className="flex-1 justify-start"
                    >
                      {selectedCustomer ? (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{selectedCustomer.firstName} {selectedCustomer.lastName}</span>
                          {selectedCustomer.companyName && (
                            <span className="text-muted-foreground">({selectedCustomer.companyName})</span>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>Select Customer</span>
                        </div>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={fetchCustomers}
                      disabled={isLoadingCustomers}
                    >
                      <RefreshCw className={`h-4 w-4 ${isLoadingCustomers ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="branch">Branch</Label>
                  <Select value={formData.branchId} onValueChange={(value) => setFormData({ ...formData, branchId: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map(branch => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="source">Source</Label>
                  <Select value={formData.source} onValueChange={(value: SalesOrderSource) => setFormData({ ...formData, source: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pos">POS</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="walk_in">Walk-in</SelectItem>
                      <SelectItem value="sales_rep">Sales Rep</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value: SalesOrderPriority) => setFormData({ ...formData, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="requiredDate">Required Date</Label>
                  <Input
                    id="requiredDate"
                    type="date"
                    value={formData.requiredDate}
                    onChange={(e) => setFormData({ ...formData, requiredDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="paymentTerms">Payment Terms (Days) *</Label>
                  <Select value={formData.paymentTerms} onValueChange={(value) => setFormData({ ...formData, paymentTerms: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Cash on Delivery</SelectItem>
                      <SelectItem value="7">7 Days</SelectItem>
                      <SelectItem value="15">15 Days</SelectItem>
                      <SelectItem value="30">30 Days</SelectItem>
                      <SelectItem value="45">45 Days</SelectItem>
                      <SelectItem value="60">60 Days</SelectItem>
                      <SelectItem value="90">90 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="promotion">Promotion</Label>
                  <Select value={formData.promotionId} onValueChange={(value) => setFormData({ ...formData, promotionId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select promotion (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Promotion</SelectItem>
                      {promotions.map(promo => (
                        <SelectItem key={promo.id} value={promo.id}>
                          {promo.name} ({promo.discount}% off)
                        </SelectItem>
                      ))}
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
                    placeholder="Notes visible to customer..."
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

          {/* Order Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Order Items</CardTitle>
                  <CardDescription>
                    Add products to the order
                  </CardDescription>
                </div>
                <Button onClick={() => setIsAddingProduct(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Product Search */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search products by name, SKU, or description..."
                      value={productSearchTerm}
                      onChange={(e) => {
                        setProductSearchTerm(e.target.value);
                        fetchProducts(e.target.value);
                      }}
                      className="pl-10"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fetchProducts()}
                    disabled={isLoadingProducts}
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoadingProducts ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
                
                {/* Quick Product Selection */}
                {productSearchTerm && filteredProducts.length > 0 && (
                  <div className="mt-3 max-h-48 overflow-y-auto border rounded-lg">
                    <div className="p-2 text-sm text-muted-foreground border-b">
                      Quick Add Products:
                    </div>
                    {filteredProducts.slice(0, 5).map((product) => {
                      const availability = getProductAvailability(product);
                      return (
                        <div
                          key={product._id?.toString()}
                          className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                          onClick={() => addProductToOrder(product)}
                        >
                          <div className="flex-1">
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              SKU: {product.sku} • {product.type.replace('_', ' ')}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`text-sm ${availability.color}`}>
                              {availability.text}
                            </div>
                            <div className="text-sm font-medium">
                              ${formatCurrency((product as any).price || (product as any).basePrice || 0)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              {orderItems.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No items added</h3>
                  <p className="text-muted-foreground mb-4">
                    Add products to create an order
                  </p>
                  <Button onClick={() => setIsAddingProduct(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Product
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Discount %</TableHead>
                        <TableHead>Tax %</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.product.name}</div>
                              <div className="text-sm text-muted-foreground">{item.product.sku}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateOrderItem(item.id, { quantity: Math.max(1, item.quantity - 1) })}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateOrderItem(item.id, { quantity: parseInt(e.target.value) || 1 })}
                                className="w-16 text-center"
                                min="1"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateOrderItem(item.id, { quantity: item.quantity + 1 })}
                              >
                                <PlusIcon className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => updateOrderItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.discount}
                              onChange={(e) => updateOrderItem(item.id, { discount: parseFloat(e.target.value) || 0 })}
                              className="w-16"
                              min="0"
                              max="100"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.taxRate}
                              onChange={(e) => updateOrderItem(item.id, { taxRate: parseFloat(e.target.value) || 0 })}
                              className="w-16"
                              min="0"
                              max="100"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(item.totalPrice)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeOrderItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          {selectedCustomer && (
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {selectedCustomer.firstName} {selectedCustomer.lastName}
                  </span>
                  {selectedCustomer.companyName && (
                    <span className="text-muted-foreground">({selectedCustomer.companyName})</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedCustomer.email}</span>
                </div>
                {selectedCustomer.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedCustomer.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {selectedCustomer.address.city}, {selectedCustomer.address.state}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Balance: {formatCurrency(selectedCustomer.currentBalance)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Payment Terms: {selectedCustomer.paymentTerms} days</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(orderTotals.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>-{formatCurrency(orderTotals.discountAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>{formatCurrency(orderTotals.taxAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{formatCurrency(0)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{formatCurrency(orderTotals.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="shippingMethod">Shipping Method</Label>
                <Select value={formData.shippingMethod} onValueChange={(value: 'pickup' | 'delivery' | 'shipping') => setFormData({ ...formData, shippingMethod: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pickup">Pickup</SelectItem>
                    <SelectItem value="delivery">Delivery</SelectItem>
                    <SelectItem value="shipping">Shipping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.shippingMethod !== 'pickup' && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={formData.shippingAddress.street}
                      onChange={(e) => setFormData({
                        ...formData,
                        shippingAddress: { ...formData.shippingAddress, street: e.target.value }
                      })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.shippingAddress.city}
                        onChange={(e) => setFormData({
                          ...formData,
                          shippingAddress: { ...formData.shippingAddress, city: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.shippingAddress.state}
                        onChange={(e) => setFormData({
                          ...formData,
                          shippingAddress: { ...formData.shippingAddress, state: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={formData.shippingAddress.zipCode}
                        onChange={(e) => setFormData({
                          ...formData,
                          shippingAddress: { ...formData.shippingAddress, zipCode: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={formData.shippingAddress.country}
                        onChange={(e) => setFormData({
                          ...formData,
                          shippingAddress: { ...formData.shippingAddress, country: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Selection Dialog */}
      {isAddingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Select Product</h2>
              <Button variant="outline" onClick={() => setIsAddingProduct(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mb-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search products by name, SKU, or description..."
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value);
                      fetchProducts(e.target.value);
                    }}
                    className="pl-10"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fetchProducts()}
                  disabled={isLoadingProducts}
                >
                  <RefreshCw className={`h-4 w-4 ${isLoadingProducts ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoadingProducts ? (
                <div className="col-span-full flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading products...</span>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No products found</h3>
                  <p className="text-muted-foreground">
                    {productSearch ? 'Try adjusting your search terms' : 'No products available'}
                  </p>
                </div>
              ) : (
                filteredProducts.map((product) => {
                  const availability = getProductAvailability(product);
                  const productPrice = (product as any).price || (product as any).basePrice || 0;
                  
                  return (
                    <Card key={product._id?.toString()} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="capitalize">
                              {product.type.replace('_', ' ')}
                            </Badge>
                            <span className="font-medium">{formatCurrency(productPrice)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className={`text-sm ${availability.color}`}>
                              {availability.text}
                            </div>
                            <Button
                              size="sm"
                              className="w-full"
                              onClick={() => addProductToOrder(product)}
                              disabled={availability.status === 'out_of_stock'}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              {availability.status === 'out_of_stock' ? 'Out of Stock' : 'Add to Order'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Customer Selection Dialog */}
      <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select Customer</DialogTitle>
            <DialogDescription>
              Choose a customer for this order
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, email, phone, company, or customer code..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateCustomer(true)}
                className="flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Create Customer
              </Button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {isLoadingCustomers ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading customers...</span>
                </div>
              ) : filteredCustomers.length === 0 ? (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No customers found</h3>
                  <p className="text-muted-foreground">
                    {customerSearch ? 'Try adjusting your search terms' : 'No customers available'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredCustomers.map((customer) => (
                    <div
                      key={customer._id?.toString()}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setFormData({ ...formData, customerId: customer._id?.toString() || '' });
                        setIsCustomerDialogOpen(false);
                        setCustomerSearch('');
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {customer.firstName} {customer.lastName}
                            {customer.companyName && (
                              <span className="text-muted-foreground ml-2">({customer.companyName})</span>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {customer.email}
                            {customer.phone && ` • ${customer.phone}`}
                          </div>
                          {customer.customerCode && (
                            <div className="text-xs text-muted-foreground">
                              Code: {customer.customerCode}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {formatCurrency(customer.currentBalance)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {customer.paymentTerms} days
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Customer Dialog */}
      <Dialog open={showCreateCustomer} onOpenChange={setShowCreateCustomer}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Customer</DialogTitle>
            <DialogDescription>
              Add a new customer to the system
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={createCustomerForm.firstName}
                  onChange={(e) => setCreateCustomerForm({ ...createCustomerForm, firstName: e.target.value })}
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={createCustomerForm.lastName}
                  onChange={(e) => setCreateCustomerForm({ ...createCustomerForm, lastName: e.target.value })}
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={createCustomerForm.companyName}
                  onChange={(e) => setCreateCustomerForm({ ...createCustomerForm, companyName: e.target.value })}
                  placeholder="Enter company name (optional)"
                />
              </div>
              <div>
                <Label htmlFor="customerType">Customer Type</Label>
                <Select 
                  value={createCustomerForm.customerType} 
                  onValueChange={(value: 'individual' | 'business') => setCreateCustomerForm({ ...createCustomerForm, customerType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={createCustomerForm.email}
                  onChange={(e) => setCreateCustomerForm({ ...createCustomerForm, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={createCustomerForm.phone}
                  onChange={(e) => setCreateCustomerForm({ ...createCustomerForm, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={createCustomerForm.address.street}
                onChange={(e) => setCreateCustomerForm({ 
                  ...createCustomerForm, 
                  address: { ...createCustomerForm.address, street: e.target.value }
                })}
                placeholder="Enter street address"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={createCustomerForm.address.city}
                  onChange={(e) => setCreateCustomerForm({ 
                    ...createCustomerForm, 
                    address: { ...createCustomerForm.address, city: e.target.value }
                  })}
                  placeholder="Enter city"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={createCustomerForm.address.state}
                  onChange={(e) => setCreateCustomerForm({ 
                    ...createCustomerForm, 
                    address: { ...createCustomerForm.address, state: e.target.value }
                  })}
                  placeholder="Enter state"
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={createCustomerForm.address.zipCode}
                  onChange={(e) => setCreateCustomerForm({ 
                    ...createCustomerForm, 
                    address: { ...createCustomerForm.address, zipCode: e.target.value }
                  })}
                  placeholder="Enter ZIP code"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="paymentTerms">Payment Terms (Days)</Label>
                <Select 
                  value={createCustomerForm.paymentTerms.toString()} 
                  onValueChange={(value) => setCreateCustomerForm({ ...createCustomerForm, paymentTerms: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Cash on Delivery</SelectItem>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="15">15 Days</SelectItem>
                    <SelectItem value="30">30 Days</SelectItem>
                    <SelectItem value="45">45 Days</SelectItem>
                    <SelectItem value="60">60 Days</SelectItem>
                    <SelectItem value="90">90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={createCustomerForm.address.country}
                  onChange={(e) => setCreateCustomerForm({ 
                    ...createCustomerForm, 
                    address: { ...createCustomerForm.address, country: e.target.value }
                  })}
                  placeholder="Enter country"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={createCustomerForm.notes}
                onChange={(e) => setCreateCustomerForm({ ...createCustomerForm, notes: e.target.value })}
                placeholder="Enter any additional notes (optional)"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateCustomer(false)}
                disabled={isCreatingCustomer}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={createCustomer}
                disabled={isCreatingCustomer}
              >
                {isCreatingCustomer ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Customer
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

