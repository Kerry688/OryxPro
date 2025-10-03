'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  WarrantyCard, 
  CreateWarrantyCardData, 
  WarrantyType, 
  WarrantyStatus 
} from '@/lib/models/warranty-client';
import { Product } from '@/lib/models/product';
import { Customer } from '@/lib/models/customer';
import { Order } from '@/lib/models/order';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { 
  Shield, 
  Package, 
  User, 
  Calendar, 
  DollarSign, 
  FileText,
  Upload,
  X
} from 'lucide-react';

const warrantyFormSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  customerId: z.string().min(1, 'Customer is required'),
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().optional(),
  orderId: z.string().optional(),
  orderNumber: z.string().optional(),
  warrantyType: z.enum(['manufacturer', 'extended', 'service', 'replacement', 'repair']),
  duration: z.number().min(1, 'Duration must be at least 1 month'),
  terms: z.string().min(1, 'Terms are required'),
  coverage: z.object({
    parts: z.boolean(),
    labor: z.boolean(),
    shipping: z.boolean(),
    replacement: z.boolean(),
    repair: z.boolean(),
    exclusions: z.array(z.string()),
    conditions: z.array(z.string()),
    limitations: z.object({
      maxClaims: z.number().optional(),
      maxClaimAmount: z.number().optional(),
      deductible: z.number().optional(),
      timeLimit: z.number().optional()
    })
  }),
  serialNumber: z.string().optional(),
  batchNumber: z.string().optional(),
  purchaseDate: z.string().min(1, 'Purchase date is required'),
  purchasePrice: z.number().min(0, 'Purchase price must be positive'),
  vendor: z.string().optional(),
  provider: z.object({
    name: z.string().min(1, 'Provider name is required'),
    contact: z.object({
      phone: z.string().min(1, 'Provider phone is required'),
      email: z.string().email('Valid provider email is required'),
      website: z.string().optional(),
      address: z.string().optional()
    })
  }),
  notes: z.string().optional(),
  attachments: z.array(z.string()),
  isTransferable: z.boolean(),
  transferFee: z.number().optional()
});

type WarrantyFormData = z.infer<typeof warrantyFormSchema>;

interface WarrantyCardFormProps {
  warranty?: WarrantyCard;
  onSave: (data: CreateWarrantyCardData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function WarrantyCardForm({ 
  warranty, 
  onSave, 
  onCancel, 
  isLoading = false 
}: WarrantyCardFormProps) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [exclusions, setExclusions] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [newExclusion, setNewExclusion] = useState('');
  const [newCondition, setNewCondition] = useState('');

  const form = useForm<WarrantyFormData>({
    resolver: zodResolver(warrantyFormSchema),
    defaultValues: {
      productId: warranty?.productId?.toString() || '',
      customerId: warranty?.customerId?.toString() || '',
      customerName: warranty?.customerName || '',
      customerEmail: warranty?.customerEmail || '',
      customerPhone: warranty?.customerPhone || '',
      orderId: warranty?.orderId?.toString() || '',
      orderNumber: warranty?.orderNumber || '',
      warrantyType: warranty?.warrantyType || 'manufacturer',
      duration: warranty?.duration || 12,
      terms: warranty?.terms || '',
      coverage: {
        parts: warranty?.coverage?.parts || false,
        labor: warranty?.coverage?.labor || false,
        shipping: warranty?.coverage?.shipping || false,
        replacement: warranty?.coverage?.replacement || false,
        repair: warranty?.coverage?.repair || false,
        exclusions: warranty?.coverage?.exclusions || [],
        conditions: warranty?.coverage?.conditions || [],
        limitations: warranty?.coverage?.limitations || {}
      },
      serialNumber: warranty?.serialNumber || '',
      batchNumber: warranty?.batchNumber || '',
      purchaseDate: warranty?.purchaseDate ? new Date(warranty.purchaseDate).toISOString().split('T')[0] : '',
      purchasePrice: warranty?.purchasePrice || 0,
      vendor: warranty?.vendor || '',
      provider: {
        name: warranty?.provider?.name || '',
        contact: {
          phone: warranty?.provider?.contact?.phone || '',
          email: warranty?.provider?.contact?.email || '',
          website: warranty?.provider?.contact?.website || '',
          address: warranty?.provider?.contact?.address || ''
        }
      },
      notes: warranty?.notes || '',
      attachments: warranty?.attachments || [],
      isTransferable: warranty?.isTransferable || false,
      transferFee: warranty?.transferFee || 0
    }
  });

  // Load data on component mount
  useEffect(() => {
    loadProducts();
    loadCustomers();
    loadOrders();
  }, []);

  // Set exclusions and conditions from form data
  useEffect(() => {
    const coverage = form.getValues('coverage');
    setExclusions(coverage.exclusions || []);
    setConditions(coverage.conditions || []);
  }, [form]);

  // Update selected product when productId changes
  useEffect(() => {
    const productId = form.getValues('productId');
    if (productId) {
      const product = products.find(p => p._id?.toString() === productId);
      setSelectedProduct(product || null);
    }
  }, [form.watch('productId'), products]);

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      const data = await response.json();
      if (data.success) {
        setCustomers(data.data);
      }
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const addExclusion = () => {
    if (newExclusion.trim()) {
      const updated = [...exclusions, newExclusion.trim()];
      setExclusions(updated);
      form.setValue('coverage.exclusions', updated);
      setNewExclusion('');
    }
  };

  const removeExclusion = (index: number) => {
    const updated = exclusions.filter((_, i) => i !== index);
    setExclusions(updated);
    form.setValue('coverage.exclusions', updated);
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      const updated = [...conditions, newCondition.trim()];
      setConditions(updated);
      form.setValue('coverage.conditions', updated);
      setNewCondition('');
    }
  };

  const removeCondition = (index: number) => {
    const updated = conditions.filter((_, i) => i !== index);
    setConditions(updated);
    form.setValue('coverage.conditions', updated);
  };

  const onSubmit = (data: WarrantyFormData) => {
    if (!user?._id) {
      toast({
        title: 'Error',
        description: 'User not authenticated',
        variant: 'destructive'
      });
      return;
    }

    const warrantyData: CreateWarrantyCardData = {
      productId: new ObjectId(data.productId),
      customerId: new ObjectId(data.customerId),
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      orderId: data.orderId ? new ObjectId(data.orderId) : undefined,
      orderNumber: data.orderNumber,
      warrantyType: data.warrantyType,
      duration: data.duration,
      terms: data.terms,
      coverage: data.coverage,
      serialNumber: data.serialNumber,
      batchNumber: data.batchNumber,
      purchaseDate: new Date(data.purchaseDate),
      purchasePrice: data.purchasePrice,
      vendor: data.vendor,
      provider: data.provider,
      notes: data.notes,
      attachments: data.attachments,
      isTransferable: data.isTransferable,
      transferFee: data.transferFee,
      createdBy: new ObjectId(user._id)
    };

    onSave(warrantyData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {warranty ? 'Edit Warranty Card' : 'Create Warranty Card'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Product Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Product Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="productId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product._id?.toString()} value={product._id?.toString() || ''}>
                                {product.name} ({product.sku})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedProduct && (
                    <div className="space-y-2">
                      <Label>Selected Product Details</Label>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="font-medium">{selectedProduct.name}</p>
                        <p className="text-sm text-gray-600">SKU: {selectedProduct.sku}</p>
                        <p className="text-sm text-gray-600">Category: {selectedProduct.category}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="serialNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Serial Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter serial number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="batchNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Batch Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter batch number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="customerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select customer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {customers.map((customer) => (
                              <SelectItem key={customer._id?.toString()} value={customer._id?.toString() || ''}>
                                {customer.name} ({customer.email})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter customer name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Email *</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="Enter customer email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Phone</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter customer phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Warranty Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Warranty Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="warrantyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Warranty Type *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select warranty type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="manufacturer">Manufacturer</SelectItem>
                            <SelectItem value="extended">Extended</SelectItem>
                            <SelectItem value="service">Service</SelectItem>
                            <SelectItem value="replacement">Replacement</SelectItem>
                            <SelectItem value="repair">Repair</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (months) *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            min="1"
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="purchaseDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purchase Date *</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="purchasePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purchase Price *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            step="0.01"
                            min="0"
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vendor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vendor</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter vendor name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Coverage Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Coverage Details</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <FormField
                    control={form.control}
                    name="coverage.parts"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                        <FormLabel>Parts</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="coverage.labor"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                        <FormLabel>Labor</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="coverage.shipping"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                        <FormLabel>Shipping</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="coverage.replacement"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                        <FormLabel>Replacement</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="coverage.repair"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                        <FormLabel>Repair</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Exclusions */}
                <div className="space-y-2">
                  <Label>Exclusions</Label>
                  <div className="space-y-2">
                    {exclusions.map((exclusion, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="secondary">{exclusion}</Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExclusion(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        value={newExclusion}
                        onChange={(e) => setNewExclusion(e.target.value)}
                        placeholder="Add exclusion"
                      />
                      <Button type="button" onClick={addExclusion} size="sm">
                        Add
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Conditions */}
                <div className="space-y-2">
                  <Label>Conditions</Label>
                  <div className="space-y-2">
                    {conditions.map((condition, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="outline">{condition}</Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCondition(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        value={newCondition}
                        onChange={(e) => setNewCondition(e.target.value)}
                        placeholder="Add condition"
                      />
                      <Button type="button" onClick={addCondition} size="sm">
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Provider Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Provider Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="provider.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provider Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter provider name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="provider.contact.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provider Phone *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter provider phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="provider.contact.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provider Email *</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="Enter provider email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="provider.contact.website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provider Website</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter provider website" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="provider.contact.address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provider Address</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Enter provider address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Additional Information</h3>
                
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Terms & Conditions *</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Enter warranty terms" rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Enter additional notes" rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="isTransferable"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                        <FormLabel>Transferable Warranty</FormLabel>
                      </FormItem>
                    )}
                  />

                  {form.watch('isTransferable') && (
                    <FormField
                      control={form.control}
                      name="transferFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transfer Fee</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              step="0.01"
                              min="0"
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : warranty ? 'Update Warranty' : 'Create Warranty'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
