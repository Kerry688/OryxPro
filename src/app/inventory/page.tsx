'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Search, 
  Package, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  ArrowUpDown,
  MapPin,
  History,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { products, stockLevels, stockMovements, warehouses, branches } from '@/lib/data';
import type { Product, StockLevel, StockMovement, Warehouse, Branch } from '@/lib/data';

export default function InventoryManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [isMovementDialogOpen, setIsMovementDialogOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<StockMovement | null>(null);

  // Filter stock levels based on search and filters
  const filteredStockLevels = stockLevels.filter(stock => {
    const product = products.find(p => p.id === stock.productId);
    if (!product) return false;

    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBranch = selectedBranch === 'all' || stock.branchId === selectedBranch;
    const matchesLocation = selectedLocation === 'all' || stock.locationId === selectedLocation;
    const matchesProduct = selectedProduct === 'all' || stock.productId === selectedProduct;

    return matchesSearch && matchesBranch && matchesLocation && matchesProduct;
  });

  // Get product details
  const getProduct = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  // Get location details
  const getLocation = (locationId: string) => {
    return warehouses.find(w => w.id === locationId);
  };

  // Get branch details
  const getBranch = (branchId: string) => {
    return branches.find(b => b.id === branchId);
  };

  // Get warehouses for a specific branch
  const getBranchWarehouses = (branchId: string) => {
    return warehouses.filter(w => w.branchId === branchId);
  };

  // Check if stock is low
  const isLowStock = (stock: StockLevel) => {
    const product = getProduct(stock.productId);
    if (!product) return false;
    return stock.availableQuantity <= product.reorderPoint;
  };

  // Get low stock items
  const getLowStockItems = () => {
    return filteredStockLevels.filter(stock => isLowStock(stock));
  };

  // Calculate total inventory value
  const getTotalInventoryValue = () => {
    return filteredStockLevels.reduce((total, stock) => {
      const product = getProduct(stock.productId);
      if (product) {
        return total + (stock.quantity * product.costPrice);
      }
      return total;
    }, 0);
  };

  // Get recent movements
  const getRecentMovements = () => {
    return stockMovements
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Inventory Management</h1>
          <p className="text-muted-foreground">Track stock levels and movements across all locations</p>
        </div>
        <Dialog open={isMovementDialogOpen} onOpenChange={setIsMovementDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Stock Movement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Record Stock Movement</DialogTitle>
              <DialogDescription>
                Add inbound, outbound, or adjustment movements
              </DialogDescription>
            </DialogHeader>
            <StockMovementForm 
              movement={selectedMovement} 
              onClose={() => {
                setIsMovementDialogOpen(false);
                setSelectedMovement(null);
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredStockLevels.length}</div>
            <p className="text-xs text-muted-foreground">
              Products in stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${getTotalInventoryValue().toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Total cost value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{getLowStockItems().length}</div>
            <p className="text-xs text-muted-foreground">
              Need reordering
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warehouses.length}</div>
            <p className="text-xs text-muted-foreground">
              Stock locations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label>Branch</Label>
              <Select value={selectedBranch} onValueChange={(value) => {
                setSelectedBranch(value);
                setSelectedLocation('all'); // Reset location when branch changes
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branches.map(branch => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name} ({branch.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Warehouse</Label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="All Warehouses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Warehouses</SelectItem>
                  {(selectedBranch === 'all' ? warehouses : getBranchWarehouses(selectedBranch)).map(warehouse => {
                    const branch = getBranch(warehouse.branchId);
                    return (
                      <SelectItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.name} ({branch?.code})
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Product</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="All Products" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  {products.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList>
          <TabsTrigger value="inventory">Current Stock</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
          <TabsTrigger value="low-stock">Low Stock Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Current Stock Levels</CardTitle>
              <CardDescription>
                Real-time inventory across all locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Reserved</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStockLevels.map(stock => {
                    const product = getProduct(stock.productId);
                    const location = getLocation(stock.locationId);
                    const branch = getBranch(stock.branchId);
                    const isLow = isLowStock(stock);
                    
                    if (!product || !location || !branch) return null;

                    return (
                      <TableRow key={stock.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{branch.name}</div>
                            <div className="text-sm text-muted-foreground">{branch.code}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{location.name}</div>
                            <div className="text-sm text-muted-foreground">{location.type}</div>
                          </div>
                        </TableCell>
                        <TableCell>{stock.quantity}</TableCell>
                        <TableCell>{stock.reservedQuantity}</TableCell>
                        <TableCell>{stock.availableQuantity}</TableCell>
                        <TableCell>
                          {isLow ? (
                            <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                              <AlertTriangle className="h-3 w-3" />
                              Low Stock
                            </Badge>
                          ) : (
                            <Badge variant="secondary">In Stock</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setSelectedMovement({
                                  id: '',
                                  productId: stock.productId,
                                  branchId: stock.branchId,
                                  locationId: stock.locationId,
                                  type: 'adjustment',
                                  quantity: 0,
                                  reference: '',
                                  createdAt: new Date().toISOString(),
                                  createdBy: 'current-user'
                                });
                                setIsMovementDialogOpen(true);
                              }}>
                                <ArrowUpDown className="mr-2 h-4 w-4" />
                                Adjust Stock
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <History className="mr-2 h-4 w-4" />
                                View History
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements">
          <Card>
            <CardHeader>
              <CardTitle>Recent Stock Movements</CardTitle>
              <CardDescription>
                Latest inventory transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getRecentMovements().map(movement => {
                    const product = getProduct(movement.productId);
                    const location = getLocation(movement.locationId);
                    const branch = getBranch(movement.branchId);
                    
                    if (!product || !location || !branch) return null;

                    return (
                      <TableRow key={movement.id}>
                        <TableCell>
                          {new Date(movement.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{branch.name}</div>
                            <div className="text-sm text-muted-foreground">{branch.code}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{location.name}</div>
                            <div className="text-sm text-muted-foreground">{location.type}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              movement.type === 'inbound' ? 'default' :
                              movement.type === 'outbound' ? 'destructive' :
                              movement.type === 'adjustment' ? 'secondary' : 'outline'
                            }
                          >
                            {movement.type}
                          </Badge>
                        </TableCell>
                        <TableCell className={movement.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                          {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                        </TableCell>
                        <TableCell>{movement.reference}</TableCell>
                        <TableCell>{movement.notes}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="low-stock">
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Alerts</CardTitle>
              <CardDescription>
                Products that need reordering
              </CardDescription>
            </CardHeader>
            <CardContent>
              {getLowStockItems().length === 0 ? (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold">No Low Stock Items</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    All products are above their reorder points.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getLowStockItems().map(stock => {
                    const product = getProduct(stock.productId);
                    const location = getLocation(stock.locationId);
                    
                    if (!product || !location) return null;

                    return (
                      <div key={stock.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div>
                              <h3 className="font-semibold">{product.name}</h3>
                              <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                            </div>
                            <Badge variant="destructive" className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Low Stock
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>Location: {location.name}</span>
                            <span>Current: {stock.availableQuantity}</span>
                            <span>Reorder Point: {product.reorderPoint}</span>
                            <span>Min Level: {product.minStockLevel}</span>
                          </div>
                        </div>
                        <Button size="sm" asChild>
                          <a href="/purchase-orders/create">
                            Create PO
                          </a>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Stock Movement Form Component
function StockMovementForm({ movement, onClose }: { movement: StockMovement | null; onClose: () => void }) {
  const [formData, setFormData] = useState({
    productId: movement?.productId || '',
    branchId: movement?.branchId || '',
    locationId: movement?.locationId || '',
    type: movement?.type || 'inbound',
    quantity: movement?.quantity || 0,
    reference: movement?.reference || '',
    notes: movement?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the movement
    console.log('Saving movement:', formData);
    onClose();
  };

  // Get warehouses for selected branch
  const getBranchWarehouses = (branchId: string) => {
    return warehouses.filter(w => w.branchId === branchId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Product</Label>
          <Select value={formData.productId} onValueChange={(value) => setFormData({ ...formData, productId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              {products.map(product => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name} ({product.sku})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Branch</Label>
          <Select value={formData.branchId} onValueChange={(value) => {
            setFormData({ ...formData, branchId: value, locationId: '' }); // Reset location when branch changes
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              {branches.map(branch => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name} ({branch.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Warehouse</Label>
        <Select 
          value={formData.locationId} 
          onValueChange={(value) => setFormData({ ...formData, locationId: value })}
          disabled={!formData.branchId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select warehouse" />
          </SelectTrigger>
          <SelectContent>
            {formData.branchId && getBranchWarehouses(formData.branchId).map(warehouse => (
              <SelectItem key={warehouse.id} value={warehouse.id}>
                {warehouse.name} ({warehouse.type})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Movement Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as any })}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inbound">Inbound</SelectItem>
              <SelectItem value="outbound">Outbound</SelectItem>
              <SelectItem value="adjustment">Adjustment</SelectItem>
              <SelectItem value="transfer">Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="reference">Reference</Label>
        <Input
          id="reference"
          value={formData.reference}
          onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
          placeholder="PO number, SO number, etc."
          required
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes..."
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Record Movement
        </Button>
      </div>
    </form>
  );
}
