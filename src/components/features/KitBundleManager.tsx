'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Combobox, ComboboxItem } from '@/components/ui/combobox';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Trash2, 
  Package, 
  Search, 
  Calculator,
  Settings,
  Info,
  AlertCircle
} from 'lucide-react';
import { BundleComponent } from '@/lib/models/product';

interface KitBundleManagerProps {
  components: BundleComponent[];
  onComponentsChange: (components: BundleComponent[]) => void;
  isConfigurable: boolean;
  onConfigurableChange: (configurable: boolean) => void;
  basePrice: number;
  onBasePriceChange: (price: number) => void;
  markup: number;
  onMarkupChange: (markup: number) => void;
}

interface Product {
  _id: string;
  name: string;
  sku: string;
  price: number;
  category: string;
  stock: number;
  isActive: boolean;
}

export function KitBundleManager({
  components,
  onComponentsChange,
  isConfigurable,
  onConfigurableChange,
  basePrice,
  onBasePriceChange,
  markup,
  onMarkupChange
}: KitBundleManagerProps) {
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);

  // Load available products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/products/sales');
        if (response.ok) {
          const data = await response.json();
          setAvailableProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products
  const filteredProducts = availableProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const notAlreadyAdded = !components.some(comp => comp.productId.toString() === product._id);
    
    return matchesSearch && matchesCategory && notAlreadyAdded && product.isActive;
  });

  const categories = [...new Set(availableProducts.map(p => p.category))];

  // Add component to bundle
  const addComponent = (product: Product) => {
    const newComponent: BundleComponent = {
      id: `comp_${Date.now()}`,
      productId: product._id as any,
      productName: product.name,
      quantity: 1,
      isRequired: true,
      priceAdjustment: 0,
      notes: ''
    };

    onComponentsChange([...components, newComponent]);
  };

  // Remove component from bundle
  const removeComponent = (componentId: string) => {
    onComponentsChange(components.filter(comp => comp.id !== componentId));
  };

  // Update component
  const updateComponent = (componentId: string, field: keyof BundleComponent, value: any) => {
    onComponentsChange(components.map(comp => 
      comp.id === componentId ? { ...comp, [field]: value } : comp
    ));
  };

  // Calculate bundle pricing
  const calculateBundlePricing = () => {
    const componentTotal = components.reduce((sum, comp) => {
      const product = availableProducts.find(p => p._id === comp.productId.toString());
      const productPrice = product?.price || 0;
      return sum + (productPrice * comp.quantity) + comp.priceAdjustment;
    }, 0);

    const markupAmount = (componentTotal * markup) / 100;
    const finalPrice = componentTotal + markupAmount;

    return {
      componentTotal,
      markupAmount,
      finalPrice
    };
  };

  const pricing = calculateBundlePricing();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Bundle Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Bundle Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="basePrice">Base Price</Label>
              <Input
                id="basePrice"
                type="number"
                step="0.01"
                value={basePrice}
                onChange={(e) => onBasePriceChange(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="markup">Markup (%)</Label>
              <Input
                id="markup"
                type="number"
                step="0.01"
                value={markup}
                onChange={(e) => onMarkupChange(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isConfigurable"
              checked={isConfigurable}
              onCheckedChange={onConfigurableChange}
            />
            <Label htmlFor="isConfigurable">Configurable Kit (customers can modify components)</Label>
          </div>

          {isConfigurable && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Configurable Kit</p>
                  <p className="text-sm text-blue-700">
                    Customers will be able to add/remove optional components and adjust quantities 
                    when purchasing this bundle.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Select Existing Products for Your Bundle</span>
          </CardTitle>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Kit/Bundle from Existing Products</p>
                <p className="text-sm text-blue-700">
                  A kit or bundle is a combination of products that are already in your system. 
                  Select from the existing products below to create your bundle.
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Combobox 
              value={selectedCategory} 
              onValueChange={setSelectedCategory}
              placeholder="All Categories"
              searchPlaceholder="Search categories..."
              emptyText="No category found."
            >
              <ComboboxItem value="all">All Categories</ComboboxItem>
              {categories.map((category) => (
                <ComboboxItem key={category} value={category}>
                  {category}
                </ComboboxItem>
              ))}
            </Combobox>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => addComponent(product)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{product.name}</p>
                        <Badge variant="secondary" className="text-xs">Existing Product</Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span><strong>SKU:</strong> {product.sku}</span>
                        <span><strong>Price:</strong> {formatCurrency(product.price)}</span>
                        <span><strong>Stock:</strong> {product.stock}</span>
                        <Badge variant="outline">{product.category}</Badge>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Bundle
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No existing products found matching your criteria.</p>
              <p className="text-sm">Try adjusting your search or category filter.</p>
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> You need to have existing products in your system before creating kits/bundles. 
                  Go to <strong>Products → Manage</strong> to add products first.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bundle Components */}
      {components.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Bundle Components ({components.length})</span>
              <div className="flex items-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span className="text-sm font-medium">
                  Total: {formatCurrency(pricing.finalPrice)}
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {components.map((component) => {
                const product = availableProducts.find(p => p._id === component.productId.toString());
                const componentPrice = (product?.price || 0) * component.quantity + component.priceAdjustment;
                
                return (
                  <div key={component.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{component.productName}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>SKU: {product?.sku}</span>
                          <span>Unit Price: {formatCurrency(product?.price || 0)}</span>
                          <span>Component Total: {formatCurrency(componentPrice)}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeComponent(component.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor={`qty-${component.id}`}>Quantity</Label>
                        <Input
                          id={`qty-${component.id}`}
                          type="number"
                          min="1"
                          value={component.quantity}
                          onChange={(e) => updateComponent(
                            component.id, 
                            'quantity', 
                            parseInt(e.target.value) || 1
                          )}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`price-adj-${component.id}`}>Price Adjustment</Label>
                        <Input
                          id={`price-adj-${component.id}`}
                          type="number"
                          step="0.01"
                          value={component.priceAdjustment}
                          onChange={(e) => updateComponent(
                            component.id, 
                            'priceAdjustment', 
                            parseFloat(e.target.value) || 0
                          )}
                          placeholder="+/- amount"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`required-${component.id}`}
                          checked={component.isRequired}
                          onCheckedChange={(checked) => updateComponent(
                            component.id, 
                            'isRequired', 
                            checked
                          )}
                        />
                        <Label htmlFor={`required-${component.id}`}>Required</Label>
                      </div>

                      <div>
                        <Label htmlFor={`notes-${component.id}`}>Notes</Label>
                        <Input
                          id={`notes-${component.id}`}
                          value={component.notes || ''}
                          onChange={(e) => updateComponent(
                            component.id, 
                            'notes', 
                            e.target.value
                          )}
                          placeholder="Optional notes"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pricing Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Bundle Pricing Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Component Total:</span>
                  <span>{formatCurrency(pricing.componentTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Markup ({markup}%):</span>
                  <span>{formatCurrency(pricing.markupAmount)}</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-2">
                  <span>Final Bundle Price:</span>
                  <span>{formatCurrency(pricing.finalPrice)}</span>
                </div>
              </div>
            </div>

            {components.some(comp => !comp.isRequired) && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">Optional Components</p>
                    <p className="text-sm text-yellow-700">
                      Some components are marked as optional. Customers may choose to include or exclude them when purchasing.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {components.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Components Added</h3>
              <p className="text-muted-foreground mb-4">
                Start building your bundle by adding products from the list above.
              </p>
              <p className="text-sm text-muted-foreground">
                Search and click on products to add them to your kit/bundle.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
