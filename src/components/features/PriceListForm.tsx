'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Combobox, ComboboxItem } from '@/components/ui/combobox';
import { 
  Plus, 
  Trash2, 
  DollarSign, 
  Calendar, 
  Users, 
  Globe, 
  Package,
  Tag,
  Save,
  X
} from 'lucide-react';
import { PriceList, PriceListType, PriceListStatus, CreatePriceListData } from '@/lib/models/priceList';

interface PriceListFormProps {
  priceList?: PriceList;
  onSubmit: (data: CreatePriceListData) => void;
  onCancel: () => void;
}

export function PriceListForm({ priceList, onSubmit, onCancel }: PriceListFormProps) {
  const [formData, setFormData] = useState<CreatePriceListData>({
    name: '',
    code: '',
    description: '',
    type: 'standard',
    status: 'draft',
    currency: 'USD',
    taxInclusive: false,
    taxRate: 0,
    validFrom: new Date(),
    validTo: undefined,
    customerSegments: [],
    customerTypes: [],
    minimumOrderValue: undefined,
    regions: [],
    countries: [],
    productCategories: [],
    productTags: [],
    includeProducts: [],
    excludeProducts: [],
    items: [],
    isDefault: false,
    priority: 0,
    createdBy: '' as any
  });

  const [salesProducts, setSalesProducts] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Price list types and statuses
  const priceListTypes: Array<{ value: PriceListType; label: string }> = [
    { value: 'standard', label: 'Standard' },
    { value: 'bulk', label: 'Bulk' },
    { value: 'promotional', label: 'Promotional' },
    { value: 'wholesale', label: 'Wholesale' },
    { value: 'retail', label: 'Retail' },
    { value: 'seasonal', label: 'Seasonal' }
  ];

  const priceListStatuses: Array<{ value: PriceListStatus; label: string }> = [
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'archived', label: 'Archived' }
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK'];
  const customerTypes = ['retail', 'wholesale', 'vip', 'corporate', 'reseller'];
  const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East', 'Africa'];
  const countries = ['US', 'CA', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'SE', 'NO', 'DK', 'AU', 'JP', 'CN', 'IN', 'BR', 'MX'];

  // Load sales products
  useEffect(() => {
    const fetchSalesProducts = async () => {
      try {
        const response = await fetch('/api/products/sales');
        if (response.ok) {
          const data = await response.json();
          setSalesProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching sales products:', error);
      }
    };

    fetchSalesProducts();
  }, []);

  // Initialize form data when editing
  useEffect(() => {
    if (priceList) {
      setFormData({
        name: priceList.name,
        code: priceList.code,
        description: priceList.description || '',
        type: priceList.type,
        status: priceList.status,
        currency: priceList.currency,
        taxInclusive: priceList.taxInclusive,
        taxRate: priceList.taxRate || 0,
        validFrom: priceList.validFrom,
        validTo: priceList.validTo,
        customerSegments: priceList.customerSegments || [],
        customerTypes: priceList.customerTypes || [],
        minimumOrderValue: priceList.minimumOrderValue,
        regions: priceList.regions || [],
        countries: priceList.countries || [],
        productCategories: priceList.productCategories || [],
        productTags: priceList.productTags || [],
        includeProducts: priceList.includeProducts || [],
        excludeProducts: priceList.excludeProducts || [],
        items: priceList.items.map(item => ({
          productId: item.productId,
          basePrice: item.basePrice,
          price: item.price,
          discountPercentage: item.discountPercentage,
          discountAmount: item.discountAmount,
          minQuantity: item.minQuantity,
          maxQuantity: item.maxQuantity,
          effectiveDate: item.effectiveDate,
          expiryDate: item.expiryDate,
          notes: item.notes,
          isActive: item.isActive
        })),
        isDefault: priceList.isDefault,
        priority: priceList.priority,
        createdBy: '' as any
      });
    }
  }, [priceList]);

  // Filter products based on search
  const filteredProducts = salesProducts.filter(product =>
    product.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(productSearchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate required fields
    if (!formData.name || !formData.code) {
      alert('Please fill in all required fields');
      setLoading(false);
      return;
    }

    onSubmit(formData);
  };

  const addProductToPriceList = (product: any) => {
    const existingItem = formData.items.find(item => 
      item.productId.toString() === product._id.toString()
    );

    if (!existingItem) {
      const newItem = {
        productId: product._id,
        basePrice: product.basePrice,
        price: product.basePrice,
        discountPercentage: 0,
        discountAmount: 0,
        minQuantity: 1,
        maxQuantity: undefined,
        effectiveDate: formData.validFrom,
        expiryDate: formData.validTo,
        notes: '',
        isActive: true
      };

      setFormData({
        ...formData,
        items: [...formData.items, newItem]
      });
    }
  };

  const removeProductFromPriceList = (productId: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter(item => item.productId.toString() !== productId)
    });
  };

  const updatePriceListItem = (productId: string, field: string, value: any) => {
    setFormData({
      ...formData,
      items: formData.items.map(item => {
        if (item.productId.toString() === productId) {
          return { ...item, [field]: value };
        }
        return item;
      })
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: formData.currency
    }).format(amount);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="targeting">Targeting</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>

        {/* Basic Information */}
        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Price list description..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Combobox 
                value={formData.type} 
                onValueChange={(value) => setFormData({ ...formData, type: value as PriceListType })}
                placeholder="Select type"
                searchPlaceholder="Search types..."
                emptyText="No type found."
              >
                {priceListTypes.map((type) => (
                  <ComboboxItem key={type.value} value={type.value}>
                    {type.label}
                  </ComboboxItem>
                ))}
              </Combobox>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Combobox 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value as PriceListStatus })}
                placeholder="Select status"
                searchPlaceholder="Search status..."
                emptyText="No status found."
              >
                {priceListStatuses.map((status) => (
                  <ComboboxItem key={status.value} value={status.value}>
                    {status.label}
                  </ComboboxItem>
                ))}
              </Combobox>
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Combobox 
                value={formData.currency} 
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
                placeholder="Select currency"
                searchPlaceholder="Search currencies..."
                emptyText="No currency found."
              >
                {currencies.map((currency) => (
                  <ComboboxItem key={currency} value={currency}>
                    {currency}
                  </ComboboxItem>
                ))}
              </Combobox>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="validFrom">Valid From</Label>
              <Input
                id="validFrom"
                type="date"
                value={new Date(formData.validFrom).toISOString().split('T')[0]}
                onChange={(e) => setFormData({ ...formData, validFrom: new Date(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="validTo">Valid To (Optional)</Label>
              <Input
                id="validTo"
                type="date"
                value={formData.validTo ? new Date(formData.validTo).toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  validTo: e.target.value ? new Date(e.target.value) : undefined 
                })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="taxInclusive"
                checked={formData.taxInclusive}
                onCheckedChange={(checked) => setFormData({ ...formData, taxInclusive: checked })}
              />
              <Label htmlFor="taxInclusive">Tax Inclusive</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isDefault"
                checked={formData.isDefault}
                onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked })}
              />
              <Label htmlFor="isDefault">Default Price List</Label>
            </div>
          </div>

          {formData.taxInclusive && (
            <div>
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                step="0.01"
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
              />
            </div>
          )}
        </TabsContent>

        {/* Targeting */}
        <TabsContent value="targeting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Customer Targeting</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Customer Types</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {customerTypes.map((type) => (
                    <Badge
                      key={type}
                      variant={formData.customerTypes?.includes(type) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => {
                        const types = formData.customerTypes || [];
                        if (types.includes(type)) {
                          setFormData({ ...formData, customerTypes: types.filter(t => t !== type) });
                        } else {
                          setFormData({ ...formData, customerTypes: [...types, type] });
                        }
                      }}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="minimumOrderValue">Minimum Order Value</Label>
                <Input
                  id="minimumOrderValue"
                  type="number"
                  step="0.01"
                  value={formData.minimumOrderValue || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    minimumOrderValue: e.target.value ? parseFloat(e.target.value) : undefined 
                  })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Geographic Targeting</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Regions</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {regions.map((region) => (
                    <Badge
                      key={region}
                      variant={formData.regions?.includes(region) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => {
                        const regions = formData.regions || [];
                        if (regions.includes(region)) {
                          setFormData({ ...formData, regions: regions.filter(r => r !== region) });
                        } else {
                          setFormData({ ...formData, regions: [...regions, region] });
                        }
                      }}
                    >
                      {region}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Countries</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {countries.map((country) => (
                    <Badge
                      key={country}
                      variant={formData.countries?.includes(country) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => {
                        const countries = formData.countries || [];
                        if (countries.includes(country)) {
                          setFormData({ ...formData, countries: countries.filter(c => c !== country) });
                        } else {
                          setFormData({ ...formData, countries: [...countries, country] });
                        }
                      }}
                    >
                      {country}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products */}
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Add Products</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="productSearch">Search Products</Label>
                <Input
                  id="productSearch"
                  placeholder="Search by name or SKU..."
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                {filteredProducts.map((product) => {
                  const isAdded = formData.items.some(item => 
                    item.productId.toString() === product._id.toString()
                  );
                  
                  return (
                    <div
                      key={product._id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        isAdded ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => !isAdded && addProductToPriceList(product)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            SKU: {product.sku} | Base Price: {formatCurrency(product.basePrice)}
                          </p>
                        </div>
                        {isAdded && (
                          <Badge variant="secondary">Added</Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Selected Products ({formData.items.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {formData.items.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No products selected. Search and click on products above to add them.
                </p>
              ) : (
                <div className="space-y-2">
                  {formData.items.map((item, index) => {
                    const product = salesProducts.find(p => p._id.toString() === item.productId.toString());
                    return (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium">{product?.name}</p>
                          <p className="text-sm text-muted-foreground">SKU: {product?.sku}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProductFromPriceList(item.productId.toString())}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing */}
        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Pricing Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {formData.items.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Add products first to configure pricing.
                </p>
              ) : (
                <div className="space-y-4">
                  {formData.items.map((item, index) => {
                    const product = salesProducts.find(p => p._id.toString() === item.productId.toString());
                    return (
                      <div key={index} className="p-4 border rounded-lg space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{product?.name}</h4>
                            <p className="text-sm text-muted-foreground">SKU: {product?.sku}</p>
                          </div>
                          <Badge variant="outline">
                            Base: {formatCurrency(item.basePrice)}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`price-${index}`}>Price</Label>
                            <Input
                              id={`price-${index}`}
                              type="number"
                              step="0.01"
                              value={item.price}
                              onChange={(e) => updatePriceListItem(
                                item.productId.toString(), 
                                'price', 
                                parseFloat(e.target.value) || 0
                              )}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`discount-${index}`}>Discount (%)</Label>
                            <Input
                              id={`discount-${index}`}
                              type="number"
                              step="0.01"
                              value={item.discountPercentage || 0}
                              onChange={(e) => updatePriceListItem(
                                item.productId.toString(), 
                                'discountPercentage', 
                                parseFloat(e.target.value) || 0
                              )}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`minQty-${index}`}>Min Quantity</Label>
                            <Input
                              id={`minQty-${index}`}
                              type="number"
                              value={item.minQuantity || 1}
                              onChange={(e) => updatePriceListItem(
                                item.productId.toString(), 
                                'minQuantity', 
                                parseInt(e.target.value) || 1
                              )}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`maxQty-${index}`}>Max Quantity</Label>
                            <Input
                              id={`maxQty-${index}`}
                              type="number"
                              value={item.maxQuantity || ''}
                              onChange={(e) => updatePriceListItem(
                                item.productId.toString(), 
                                'maxQuantity', 
                                e.target.value ? parseInt(e.target.value) : undefined
                              )}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor={`notes-${index}`}>Notes</Label>
                          <Textarea
                            id={`notes-${index}`}
                            value={item.notes || ''}
                            onChange={(e) => updatePriceListItem(
                              item.productId.toString(), 
                              'notes', 
                              e.target.value
                            )}
                            placeholder="Optional notes for this pricing..."
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : 'Save Price List'}
        </Button>
      </div>
    </form>
  );
}
