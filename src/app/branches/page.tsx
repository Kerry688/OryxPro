'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Building2, 
  MapPin,
  Phone,
  Mail,
  User,
  MoreHorizontal,
  Warehouse,
  Package,
  Loader2
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Branch } from '@/lib/models/branch';

export default function BranchesManagementPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch branches from database
  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/branches');
      if (response.ok) {
        const data = await response.json();
        setBranches(data);
      } else {
        throw new Error('Failed to fetch branches');
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch branches',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter branches based on search
  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get warehouses for a branch (placeholder - will be implemented with warehouse API)
  const getBranchWarehouses = (branchId: string) => {
    // TODO: Implement warehouse fetching
    return [
      {
        id: '1',
        name: 'Main Warehouse',
        code: 'MAIN',
        type: 'main' as const,
        capacity: 1000,
        isActive: true
      },
      {
        id: '2', 
        name: 'Storage Warehouse',
        code: 'STORAGE',
        type: 'storage' as const,
        capacity: 500,
        isActive: true
      }
    ];
  };

  // Get total inventory value for a branch (placeholder)
  const getBranchInventoryValue = (branchId: string) => {
    // TODO: Implement inventory value calculation
    return Math.floor(Math.random() * 50000) + 10000; // Random value for demo
  };

  // Get total products count for a branch (placeholder)
  const getBranchProductsCount = (branchId: string) => {
    // TODO: Implement product count calculation
    return Math.floor(Math.random() * 200) + 50; // Random count for demo
  };

  // Get low stock items for a branch (placeholder)
  const getBranchLowStockCount = (branchId: string) => {
    // TODO: Implement low stock calculation
    return Math.floor(Math.random() * 10); // Random count for demo
  };

  const handleDeleteBranch = async (branchId: string) => {
    try {
      const response = await fetch(`/api/branches/${branchId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Branch deleted successfully',
        });
        await fetchBranches();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete branch');
      }
    } catch (error) {
      console.error('Error deleting branch:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete branch',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Branch Management</h1>
          <p className="text-muted-foreground">Manage your branches and their warehouses</p>
        </div>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Branch
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {selectedBranch ? 'Edit Branch' : 'Add New Branch'}
              </DialogTitle>
              <DialogDescription>
                {selectedBranch ? 'Update branch information' : 'Create a new branch location'}
              </DialogDescription>
            </DialogHeader>
            <BranchForm 
              branch={selectedBranch} 
              onClose={() => {
                setIsEditDialogOpen(false);
                setSelectedBranch(null);
              }}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                setSelectedBranch(null);
                fetchBranches();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Branches</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{branches.length}</div>
            <p className="text-xs text-muted-foreground">
              {branches.filter(b => b.isActive).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Warehouses</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {branches.reduce((total, branch) => total + getBranchWarehouses(branch._id?.toString() || '').length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all branches
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${branches.reduce((total, branch) => total + getBranchInventoryValue(branch._id?.toString() || ''), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all branches
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {branches.reduce((total, branch) => total + getBranchLowStockCount(branch._id?.toString() || ''), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all branches
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Branches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search branches by name, code, city, or state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Branches List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBranches.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No branches found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchTerm ? 'No branches match your search criteria.' : 'Get started by creating your first branch.'}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setIsEditDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Branch
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredBranches.map(branch => {
              const branchWarehouses = getBranchWarehouses(branch._id?.toString() || '');
              const inventoryValue = getBranchInventoryValue(branch._id?.toString() || '');
              const productsCount = getBranchProductsCount(branch._id?.toString() || '');
              const lowStockCount = getBranchLowStockCount(branch._id?.toString() || '');

              return (
                <Card key={branch._id?.toString()}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {branch.name}
                            <Badge variant="outline">{branch.code}</Badge>
                            {!branch.isActive && (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {branch.city}, {branch.state}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {branch.manager}
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedBranch(branch);
                            setIsEditDialogOpen(true);
                          }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Branch
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Warehouse className="mr-2 h-4 w-4" />
                            Manage Warehouses
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Package className="mr-2 h-4 w-4" />
                            View Inventory
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteBranch(branch._id?.toString() || '')}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{branch.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{branch.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{productsCount} products</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">${inventoryValue.toLocaleString()} value</span>
                      </div>
                    </div>

                    {/* Branch Warehouses */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Warehouse className="h-4 w-4" />
                        Warehouses ({branchWarehouses.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {branchWarehouses.map(warehouse => (
                          <div key={warehouse.id} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium">{warehouse.name}</h5>
                              <Badge variant={
                                warehouse.type === 'main' ? 'default' :
                                warehouse.type === 'retail' ? 'secondary' :
                                warehouse.type === 'distribution' ? 'outline' : 'secondary'
                              }>
                                {warehouse.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {warehouse.code}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Capacity: {warehouse.capacity.toLocaleString()}
                            </p>
                            {!warehouse.isActive && (
                              <Badge variant="secondary" className="mt-2">Inactive</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Branch Stats */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">${inventoryValue.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Inventory Value</div>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{productsCount}</div>
                        <div className="text-sm text-muted-foreground">Products in Stock</div>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{lowStockCount}</div>
                        <div className="text-sm text-muted-foreground">Low Stock Items</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

// Branch Form Component
function BranchForm({ 
  branch, 
  onClose, 
  onSuccess 
}: { 
  branch: Branch | null; 
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    name: branch?.name || '',
    code: branch?.code || '',
    address: branch?.address || '',
    city: branch?.city || '',
    state: branch?.state || '',
    zipCode: branch?.zipCode || '',
    country: branch?.country || 'USA',
    phone: branch?.phone || '',
    email: branch?.email || '',
    manager: branch?.manager || '',
    isActive: branch?.isActive ?? true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = branch ? `/api/branches/${branch._id}` : '/api/branches';
      const method = branch ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          createdBy: '507f1f77bcf86cd799439011', // TODO: Get from auth context
          updatedBy: '507f1f77bcf86cd799439011', // TODO: Get from auth context
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: branch ? 'Branch updated successfully' : 'Branch created successfully',
        });
        onSuccess();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save branch');
      }
    } catch (error) {
      console.error('Error saving branch:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save branch',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Branch Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="code">Branch Code</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            placeholder="e.g., NYC, LAX"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            value={formData.zipCode}
            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="manager">Manager</Label>
        <Input
          id="manager"
          value={formData.manager}
          onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {branch ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            branch ? 'Update Branch' : 'Create Branch'
          )}
        </Button>
      </div>
    </form>
  );
}