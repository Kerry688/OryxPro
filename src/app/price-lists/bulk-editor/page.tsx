'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  TrendingUp, 
  Search, 
  Save, 
  Download, 
  Upload,
  DollarSign,
  Package,
  Filter,
  Calculator,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Combobox, ComboboxItem } from '@/components/ui/combobox';
import { PriceList } from '@/lib/models/priceList';
import { useAuth } from '@/contexts/AuthContext';

interface ProductPriceItem {
  _id: string;
  name: string;
  sku: string;
  category: string;
  basePrice: number;
  currentPrice: number;
  newPrice: number;
  discountPercentage: number;
  changeAmount: number;
  changePercentage: number;
  minQuantity?: number;
  maxQuantity?: number;
  notes?: string;
  isActive: boolean;
}

export default function BulkPriceEditorPage() {
  const { user } = useAuth();
  
  const [priceLists, setPriceLists] = useState<PriceList[]>([]);
  const [selectedPriceList, setSelectedPriceList] = useState<PriceList | null>(null);
  const [products, setProducts] = useState<ProductPriceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [bulkUpdateType, setBulkUpdateType] = useState<'percentage' | 'amount' | 'fixed'>('percentage');
  const [bulkUpdateValue, setBulkUpdateValue] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Fetch price lists
  useEffect(() => {
    const fetchPriceLists = async () => {
      try {
        const response = await fetch('/api/price-lists?status=active');
        if (response.ok) {
          const data = await response.json();
          setPriceLists(data.priceLists);
        }
      } catch (error) {
        console.error('Error fetching price lists:', error);
      }
    };

    fetchPriceLists();
  }, []);

  // Load products when price list is selected
  useEffect(() => {
    if (selectedPriceList) {
      loadProductsForPriceList();
    }
  }, [selectedPriceList]);

  const loadProductsForPriceList = async () => {
    if (!selectedPriceList) return;

    setLoading(true);
    try {
      // Fetch sales products
      const productsResponse = await fetch('/api/products/sales');
      if (!productsResponse.ok) throw new Error('Failed to fetch products');
      
      const productsData = await productsResponse.json();
      
      // Map price list items with product details
      const productsWithPricing = selectedPriceList.items.map(item => {
        const product = productsData.products.find((p: any) => 
          p._id.toString() === item.productId.toString()
        );
        
        if (!product) return null;

        const currentPrice = item.price;
        const changeAmount = 0; // Will be calculated when user makes changes
        const changePercentage = 0;

        return {
          _id: product._id,
          name: product.name,
          sku: product.sku,
          category: product.category,
          basePrice: product.basePrice,
          currentPrice: currentPrice,
          newPrice: currentPrice,
          discountPercentage: item.discountPercentage || 0,
          changeAmount,
          changePercentage,
          minQuantity: item.minQuantity,
          maxQuantity: item.maxQuantity,
          notes: item.notes,
          isActive: item.isActive
        };
      }).filter(Boolean) as ProductPriceItem[];

      setProducts(productsWithPricing);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (productId: string, newPrice: number) => {
    setProducts(products.map(product => {
      if (product._id === productId) {
        const changeAmount = newPrice - product.currentPrice;
        const changePercentage = product.currentPrice > 0 ? (changeAmount / product.currentPrice) * 100 : 0;
        
        return {
          ...product,
          newPrice,
          changeAmount,
          changePercentage
        };
      }
      return product;
    }));
  };

  const handleBulkUpdate = () => {
    if (!bulkUpdateValue || selectedProducts.length === 0) {
      alert('Please select products and enter a value for bulk update');
      return;
    }

    const value = parseFloat(bulkUpdateValue);
    if (isNaN(value)) {
      alert('Please enter a valid number');
      return;
    }

    setProducts(products.map(product => {
      if (selectedProducts.includes(product._id)) {
        let newPrice = product.newPrice;
        
        switch (bulkUpdateType) {
          case 'percentage':
            newPrice = product.currentPrice * (1 + value / 100);
            break;
          case 'amount':
            newPrice = product.currentPrice + value;
            break;
          case 'fixed':
            newPrice = value;
            break;
        }

        const changeAmount = newPrice - product.currentPrice;
        const changePercentage = product.currentPrice > 0 ? (changeAmount / product.currentPrice) * 100 : 0;

        return {
          ...product,
          newPrice: Math.max(0, newPrice), // Ensure price is not negative
          changeAmount,
          changePercentage
        };
      }
      return product;
    }));

    // Clear bulk update fields
    setBulkUpdateValue('');
    setSelectedProducts([]);
  };

  const handleSaveChanges = async () => {
    if (!selectedPriceList) return;

    setSaving(true);
    try {
      const updates = products
        .filter(product => product.newPrice !== product.currentPrice)
        .map(product => ({
          productId: product._id,
          price: product.newPrice,
          discountPercentage: product.discountPercentage,
          minQuantity: product.minQuantity,
          maxQuantity: product.maxQuantity,
          notes: product.notes,
          isActive: product.isActive
        }));

      if (updates.length === 0) {
        alert('No changes to save');
        setSaving(false);
        return;
      }

      const response = await fetch(`/api/price-lists/${selectedPriceList._id}/bulk-update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceListId: selectedPriceList._id,
          updates,
          updatedBy: user?.id
        })
      });

      if (!response.ok) throw new Error('Failed to update prices');

      alert(`Successfully updated ${updates.length} products`);
      loadProductsForPriceList(); // Reload to get updated prices
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p._id));
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const changedProducts = products.filter(p => p.newPrice !== p.currentPrice);
  const totalChange = changedProducts.reduce((sum, p) => sum + p.changeAmount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedPriceList?.currency || 'USD'
    }).format(amount);
  };

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bulk Price Editor</h1>
          <p className="text-muted-foreground">
            Easily update prices for multiple products at once
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      {/* Price List Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Price List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="priceList">Price List</Label>
              <Combobox 
                value={selectedPriceList?._id?.toString() || ''} 
                onValueChange={(value) => {
                  const priceList = priceLists.find(p => p._id?.toString() === value);
                  setSelectedPriceList(priceList || null);
                }}
                placeholder="Select a price list to edit"
                searchPlaceholder="Search price lists..."
                emptyText="No price list found."
              >
                {priceLists.map((priceList) => (
                  <ComboboxItem key={priceList._id?.toString()} value={priceList._id?.toString() || ''}>
                    {priceList.name} ({priceList.items.length} products)
                  </ComboboxItem>
                ))}
              </Combobox>
            </div>
            {selectedPriceList && (
              <div className="flex items-end space-x-2">
                <Badge variant="outline">{selectedPriceList.type}</Badge>
                <Badge variant={selectedPriceList.status === 'active' ? 'default' : 'secondary'}>
                  {selectedPriceList.status}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedPriceList && (
        <>
          {/* Bulk Update Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span>Bulk Update</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Update Type</Label>
                  <select 
                    value={bulkUpdateType} 
                    onChange={(e) => setBulkUpdateType(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="percentage">Percentage Change</option>
                    <option value="amount">Amount Change</option>
                    <option value="fixed">Fixed Price</option>
                  </select>
                </div>
                <div>
                  <Label>Value</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={bulkUpdateValue}
                    onChange={(e) => setBulkUpdateValue(e.target.value)}
                    placeholder={bulkUpdateType === 'percentage' ? '10' : '5.00'}
                  />
                </div>
                <div>
                  <Label>Selected Products</Label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{selectedProducts.length}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                    >
                      {selectedProducts.length === filteredProducts.length ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>
                </div>
                <div className="flex items-end">
                  <Button onClick={handleBulkUpdate} disabled={!bulkUpdateValue || selectedProducts.length === 0}>
                    Apply Update
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          {changedProducts.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                      <span className="font-medium">{changedProducts.length} products changed</span>
                    </div>
                    <Badge variant="outline">
                      Total Change: {formatCurrency(totalChange)}
                    </Badge>
                  </div>
                  <Button onClick={handleSaveChanges} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Products Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Products ({filteredProducts.length})</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    Changed: {changedProducts.length}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <input
                            type="checkbox"
                            checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                            onChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Base Price</TableHead>
                        <TableHead>Current Price</TableHead>
                        <TableHead>New Price</TableHead>
                        <TableHead>Change</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => {
                        const isSelected = selectedProducts.includes(product._id);
                        const hasChanged = product.newPrice !== product.currentPrice;
                        
                        return (
                          <TableRow key={product._id} className={hasChanged ? 'bg-yellow-50' : ''}>
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleSelectProduct(product._id)}
                              />
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{product.category}</Badge>
                            </TableCell>
                            <TableCell>{formatCurrency(product.basePrice)}</TableCell>
                            <TableCell>{formatCurrency(product.currentPrice)}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="0.01"
                                value={product.newPrice}
                                onChange={(e) => handlePriceChange(product._id, parseFloat(e.target.value) || 0)}
                                className="w-24"
                              />
                            </TableCell>
                            <TableCell>
                              {hasChanged ? (
                                <div className="flex items-center space-x-1">
                                  <span className={`text-sm ${product.changeAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.changeAmount >= 0 ? '+' : ''}{formatCurrency(product.changeAmount)}
                                  </span>
                                  <span className={`text-xs ${product.changeAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    ({product.changeAmount >= 0 ? '+' : ''}{product.changePercentage.toFixed(1)}%)
                                  </span>
                                </div>
                              ) : (
                                <span className="text-sm text-muted-foreground">No change</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={product.isActive ? 'default' : 'secondary'}>
                                {product.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
