'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Combobox, ComboboxItem } from '@/components/ui/combobox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Package2,
  Printer,
  Wrench,
  Layers,
  Building2
} from 'lucide-react';
import { Product, ProductType } from '@/lib/models/product';
import { ProductForm } from '@/components/features/ProductForm';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/use-translation';

export default function ProductManagementPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ProductType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productTypes, setProductTypes] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);
      if (selectedType !== 'all') params.append('type', selectedType);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      
      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch product types and categories
  const fetchMetadata = async () => {
    try {
      const [typesResponse, productsResponse] = await Promise.all([
        fetch('/api/products/types'),
        fetch('/api/products')
      ]);
      
      if (typesResponse.ok) {
        const typesData = await typesResponse.json();
        setProductTypes(typesData);
      }
      
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        const uniqueCategories = [...new Set(productsData.products.map((p: Product) => p.category))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedType, selectedCategory]);

  const handleAddProduct = async (productData: any) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...productData,
          createdBy: user?.id
        })
      });

      if (!response.ok) throw new Error('Failed to create product');
      
      setShowAddDialog(false);
      fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleEditProduct = async (productData: any) => {
    if (!editingProduct) return;
    
    try {
      const response = await fetch(`/api/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...productData,
          updatedBy: user?.id
        })
      });

      if (!response.ok) throw new Error('Failed to update product');
      
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete product');
      
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const getProductTypeIcon = (type: ProductType) => {
    const icons = {
      'sales_product': Package,
      'print_item': Printer,
      'service': Wrench,
      'raw_material': Package2,
      'kit_bundle': Layers,
      'asset': Building2
    };
    return icons[type];
  };

  const getProductTypeColor = (type: ProductType) => {
    const colors = {
      'sales_product': 'bg-blue-100 text-blue-800',
      'print_item': 'bg-purple-100 text-purple-800',
      'service': 'bg-green-100 text-green-800',
      'raw_material': 'bg-orange-100 text-orange-800',
      'kit_bundle': 'bg-pink-100 text-pink-800',
      'asset': 'bg-gray-100 text-gray-800'
    };
    return colors[type];
  };

  const getStockStatus = (product: Product) => {
    if (product.type === 'service') return null; // Services don't have stock
    
    const stock = (product as any).stock || 0;
    const minStock = (product as any).minStock || 0;
    
    if (stock <= 0) return { status: 'out', icon: XCircle, color: 'text-red-500' };
    if (stock <= minStock) return { status: 'low', icon: AlertTriangle, color: 'text-yellow-500' };
    return { status: 'good', icon: CheckCircle, color: 'text-green-500' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">
            Manage all your products across different types and categories
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="!max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <ProductForm
              onSubmit={handleAddProduct}
              onCancel={() => setShowAddDialog(false)}
              productTypes={productTypes}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {productTypes.map((type) => {
          const IconComponent = getProductTypeIcon(type.type);
          return (
            <Card key={type.type}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{type.name}</p>
                    <p className="text-2xl font-bold">{type.totalCount}</p>
                    <p className="text-xs text-muted-foreground">
                      {type.activeCount} active
                    </p>
                  </div>
                  <IconComponent className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

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
            <Combobox 
              value={selectedType} 
              onValueChange={(value) => setSelectedType(value as ProductType | 'all')}
              placeholder="Product Type"
              searchPlaceholder="Search product types..."
              emptyText="No product type found."
            >
              <ComboboxItem value="all">All Types</ComboboxItem>
              {productTypes.map((type) => (
                <ComboboxItem key={type.type} value={type.type}>
                  {type.name}
                </ComboboxItem>
              ))}
            </Combobox>
            <Combobox 
              value={selectedCategory} 
              onValueChange={setSelectedCategory}
              placeholder="Category"
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
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({products.length})</CardTitle>
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
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => {
                    const TypeIcon = getProductTypeIcon(product.type);
                    const stockStatus = getStockStatus(product);
                    const price = (product as any).price || (product as any).basePrice || 0;
                    
                    return (
                      <TableRow key={product._id?.toString()}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <TypeIcon className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">{product.sku}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getProductTypeColor(product.type)}>
                            {productTypes.find(t => t.type === product.type)?.name || product.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>${price.toFixed(2)}</TableCell>
                        <TableCell>
                          {product.type !== 'service' && stockStatus && (
                            <div className="flex items-center space-x-1">
                              <stockStatus.icon className={`h-4 w-4 ${stockStatus.color}`} />
                              <span>{(product as any).stock || 0}</span>
                            </div>
                          )}
                          {product.type === 'service' && <span className="text-muted-foreground">N/A</span>}
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.isActive ? 'default' : 'secondary'}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingProduct(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteProduct(product._id!.toString())}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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

      {/* Edit Product Dialog */}
      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="!max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <ProductForm
              product={editingProduct}
              onSubmit={handleEditProduct}
              onCancel={() => setEditingProduct(null)}
              productTypes={productTypes}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}