'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Upload,
  Download,
  Filter
} from 'lucide-react';
import { ETAProduct, CreateETAProductData, ETAProductStatus, ETASyncStatus } from '@/lib/models/eta';
import { useToast } from '@/hooks/use-toast';

export default function ETAProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<ETAProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [syncStatusFilter, setSyncStatusFilter] = useState<string>('all');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ETAProduct | null>(null);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/eta/products');
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data || []);
      } else {
        toast({
          title: "Error",
          description: data.error || 'Failed to fetch products',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Sync products with ETA
  const syncProducts = async () => {
    try {
      toast({
        title: "Sync Started",
        description: "Syncing products with ETA...",
      });

      const response = await fetch('/api/eta/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityType: 'product' })
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Sync Completed",
          description: `${data.data.syncedCount} products synced, ${data.data.failedCount} failed`,
        });
        fetchProducts(); // Refresh products
      } else {
        toast({
          title: "Sync Error",
          description: data.error || 'Failed to sync products',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error syncing products:', error);
      toast({
        title: "Sync Error",
        description: "Failed to sync products with ETA",
        variant: "destructive",
      });
    }
  };

  // Create new product
  const createProduct = async (productData: CreateETAProductData) => {
    try {
      const response = await fetch('/api/eta/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Product Created",
          description: "ETA product created successfully",
        });
        fetchProducts();
      } else {
        toast({
          title: "Error",
          description: data.error || 'Failed to create product',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    }
  };

  // Delete product
  const deleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/eta/products/${productId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Product Deleted",
          description: "ETA product deleted successfully",
        });
        fetchProducts();
      } else {
        toast({
          title: "Error",
          description: data.error || 'Failed to delete product',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.egsCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.egsDescription.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchesSyncStatus = syncStatusFilter === 'all' || product.syncStatus === syncStatusFilter;
    
    return matchesSearch && matchesStatus && matchesSyncStatus;
  });

  const getStatusBadge = (status: ETAProductStatus) => {
    const statusConfig = {
      active: { variant: 'default' as const, text: 'Active', icon: CheckCircle },
      inactive: { variant: 'secondary' as const, text: 'Inactive', icon: XCircle },
      pending_approval: { variant: 'outline' as const, text: 'Pending Approval', icon: Clock },
      rejected: { variant: 'destructive' as const, text: 'Rejected', icon: XCircle }
    };
    
    const config = statusConfig[status] || statusConfig.pending_approval;
    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <config.icon className="h-3 w-3" />
        <span>{config.text}</span>
      </Badge>
    );
  };

  const getSyncStatusBadge = (syncStatus: ETASyncStatus) => {
    const statusConfig = {
      pending: { variant: 'outline' as const, text: 'Pending', icon: Clock },
      success: { variant: 'default' as const, text: 'Success', icon: CheckCircle },
      failed: { variant: 'destructive' as const, text: 'Failed', icon: XCircle },
      retry: { variant: 'secondary' as const, text: 'Retry', icon: AlertTriangle }
    };
    
    const config = statusConfig[syncStatus] || statusConfig.pending;
    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <config.icon className="h-3 w-3" />
        <span>{config.text}</span>
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ETA Products</h1>
          <p className="text-muted-foreground">
            Manage products and their EGS codes for ETA compliance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={fetchProducts}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={syncProducts}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync with ETA
          </Button>
          <Button onClick={() => window.open('/products', '_blank')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Product
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="rejected">Rejected</option>
              </select>
              <select
                value={syncStatusFilter}
                onChange={(e) => setSyncStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Sync Status</option>
                <option value="pending">Pending</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="retry">Retry</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
          <CardDescription>
            Manage your product catalog with EGS codes for ETA compliance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' || syncStatusFilter !== 'all'
                  ? 'No products match your current filters'
                  : 'Get started by adding your first product'
                }
              </p>
              <Button onClick={() => window.open('/products', '_blank')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Product
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>EGS Code</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Tax Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sync Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product._id.toString()}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.productName}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.productCode}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-mono text-sm">{product.egsCode}</div>
                        <div className="text-xs text-muted-foreground">
                          {product.egsDescription}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{product.category}</div>
                        {product.subcategory && (
                          <div className="text-xs text-muted-foreground">
                            {product.subcategory}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{product.taxRate}%</span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(product.status)}
                    </TableCell>
                    <TableCell>
                      {getSyncStatusBadge(product.syncStatus)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteProduct(product._id.toString())}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Create Product Form Component
function CreateProductForm({ onSubmit }: { onSubmit: (data: CreateETAProductData) => void }) {
  const [formData, setFormData] = useState<CreateETAProductData>({
    productId: '',
    productName: '',
    productCode: '',
    egsCode: '',
    egsDescription: '',
    category: '',
    subcategory: '',
    unitOfMeasure: '',
    taxRate: 14
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Product ID</label>
          <Input
            value={formData.productId}
            onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
            placeholder="Enter product ID"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Product Name</label>
          <Input
            value={formData.productName}
            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            placeholder="Enter product name"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Product Code</label>
          <Input
            value={formData.productCode}
            onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
            placeholder="Enter product code"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">EGS Code</label>
          <Input
            value={formData.egsCode}
            onChange={(e) => setFormData({ ...formData, egsCode: e.target.value })}
            placeholder="Enter EGS code"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="text-sm font-medium">EGS Description</label>
        <Input
          value={formData.egsDescription}
          onChange={(e) => setFormData({ ...formData, egsDescription: e.target.value })}
          placeholder="Enter EGS description"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Category</label>
          <Input
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Enter category"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Subcategory</label>
          <Input
            value={formData.subcategory}
            onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
            placeholder="Enter subcategory"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Unit of Measure</label>
          <Input
            value={formData.unitOfMeasure}
            onChange={(e) => setFormData({ ...formData, unitOfMeasure: e.target.value })}
            placeholder="e.g., piece, kg, liter"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Tax Rate (%)</label>
          <Input
            type="number"
            value={formData.taxRate}
            onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
            placeholder="14"
            required
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">
          Create Product
        </Button>
      </div>
    </form>
  );
}
