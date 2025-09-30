'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Shield,
  Users,
  CheckCircle,
  XCircle,
  Eye,
  MoreHorizontal,
  RefreshCw,
  Settings,
  Key,
  AlertTriangle,
  Copy,
  Download,
  Upload
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Types
interface Role {
  _id?: string;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

interface Permission {
  category: string;
  permissions: {
    key: string;
    label: string;
    description: string;
  }[];
}

// Permission categories and their permissions
const PERMISSION_CATEGORIES: Permission[] = [
  {
    category: 'User Management',
    permissions: [
      { key: 'users.create', label: 'Create Users', description: 'Create new user accounts' },
      { key: 'users.read', label: 'View Users', description: 'View user information' },
      { key: 'users.update', label: 'Update Users', description: 'Modify user information' },
      { key: 'users.delete', label: 'Delete Users', description: 'Remove user accounts' },
      { key: 'users.manage_roles', label: 'Manage User Roles', description: 'Assign roles to users' },
    ]
  },
  {
    category: 'Role & Permission Management',
    permissions: [
      { key: 'roles.create', label: 'Create Roles', description: 'Create new roles' },
      { key: 'roles.read', label: 'View Roles', description: 'View role information' },
      { key: 'roles.update', label: 'Update Roles', description: 'Modify role permissions' },
      { key: 'roles.delete', label: 'Delete Roles', description: 'Remove roles' },
    ]
  },
  {
    category: 'Employee Management',
    permissions: [
      { key: 'employees.create', label: 'Create Employees', description: 'Add new employees' },
      { key: 'employees.read', label: 'View Employees', description: 'View employee information' },
      { key: 'employees.update', label: 'Update Employees', description: 'Modify employee data' },
      { key: 'employees.delete', label: 'Delete Employees', description: 'Remove employees' },
      { key: 'employees.manage_hr', label: 'HR Management', description: 'Access HR features' },
    ]
  },
  {
    category: 'Product Management',
    permissions: [
      { key: 'products.create', label: 'Create Products', description: 'Add new products' },
      { key: 'products.read', label: 'View Products', description: 'View product information' },
      { key: 'products.update', label: 'Update Products', description: 'Modify product data' },
      { key: 'products.delete', label: 'Delete Products', description: 'Remove products' },
      { key: 'products.manage_categories', label: 'Manage Categories', description: 'Manage product categories' },
      { key: 'products.manage_brands', label: 'Manage Brands', description: 'Manage product brands' },
    ]
  },
  {
    category: 'Order Management',
    permissions: [
      { key: 'orders.create', label: 'Create Orders', description: 'Create new orders' },
      { key: 'orders.read', label: 'View Orders', description: 'View order information' },
      { key: 'orders.update', label: 'Update Orders', description: 'Modify order data' },
      { key: 'orders.delete', label: 'Delete Orders', description: 'Remove orders' },
      { key: 'orders.manage_status', label: 'Manage Order Status', description: 'Change order status' },
    ]
  },
  {
    category: 'Customer Management',
    permissions: [
      { key: 'customers.create', label: 'Create Customers', description: 'Add new customers' },
      { key: 'customers.read', label: 'View Customers', description: 'View customer information' },
      { key: 'customers.update', label: 'Update Customers', description: 'Modify customer data' },
      { key: 'customers.delete', label: 'Delete Customers', description: 'Remove customers' },
    ]
  },
  {
    category: 'Inventory Management',
    permissions: [
      { key: 'inventory.read', label: 'View Inventory', description: 'View inventory levels' },
      { key: 'inventory.update', label: 'Update Inventory', description: 'Modify inventory levels' },
      { key: 'inventory.manage_stock', label: 'Manage Stock', description: 'Manage stock movements' },
      { key: 'inventory.manage_warehouses', label: 'Manage Warehouses', description: 'Manage warehouse locations' },
    ]
  },
  {
    category: 'Analytics & Reports',
    permissions: [
      { key: 'analytics.read', label: 'View Analytics', description: 'Access analytics dashboard' },
      { key: 'reports.read', label: 'View Reports', description: 'Generate and view reports' },
      { key: 'reports.create', label: 'Create Reports', description: 'Create custom reports' },
      { key: 'reports.export', label: 'Export Reports', description: 'Export reports to various formats' },
    ]
  },
  {
    category: 'System Administration',
    permissions: [
      { key: 'settings.read', label: 'View Settings', description: 'View system settings' },
      { key: 'settings.update', label: 'Update Settings', description: 'Modify system settings' },
      { key: 'system.backup', label: 'System Backup', description: 'Create system backups' },
      { key: 'system.maintenance', label: 'System Maintenance', description: 'Perform system maintenance' },
    ]
  },
  {
    category: 'Branch Management',
    permissions: [
      { key: 'branches.create', label: 'Create Branches', description: 'Add new branches' },
      { key: 'branches.read', label: 'View Branches', description: 'View branch information' },
      { key: 'branches.update', label: 'Update Branches', description: 'Modify branch data' },
      { key: 'branches.delete', label: 'Delete Branches', description: 'Remove branches' },
    ]
  }
];

export default function RoleManagementPage() {
  // State management
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Dialog states
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
    isActive: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load roles
  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/users/roles');
      const result = await response.json();
      
      if (result.success) {
        setRoles(result.data || []);
      } else {
        toast.error('Failed to load roles');
      }
    } catch (error) {
      console.error('Error loading roles:', error);
      toast.error('Failed to load roles');
    } finally {
      setIsLoading(false);
    }
  };

  // CRUD Operations
  const handleCreateRole = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setIsSaving(true);
      
      const response = await fetch('/api/users/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Role created successfully!');
        setIsAddDialogOpen(false);
        resetForm();
        loadRoles();
      } else {
        toast.error(result.error || 'Failed to create role');
      }
    } catch (error) {
      console.error('Error creating role:', error);
      toast.error('Failed to create role');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedRole?._id || !validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setIsSaving(true);
      
      const response = await fetch(`/api/users/roles/${selectedRole._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Role updated successfully!');
        setIsEditDialogOpen(false);
        setSelectedRole(null);
        resetForm();
        loadRoles();
      } else {
        toast.error(result.error || 'Failed to update role');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRole = async () => {
    if (!roleToDelete?._id) return;

    try {
      setIsDeleting(true);
      
      const response = await fetch(`/api/users/roles/${roleToDelete._id}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Role deleted successfully!');
        setIsDeleteDialogOpen(false);
        setRoleToDelete(null);
        loadRoles();
      } else {
        toast.error(result.error || 'Failed to delete role');
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      toast.error('Failed to delete role');
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper functions
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Role name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (formData.permissions.length === 0) {
      newErrors.permissions = 'At least one permission must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      permissions: [],
      isActive: true
    });
    setErrors({});
  };

  const openEditDialog = (role: Role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      isActive: role.isActive
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (role: Role) => {
    setSelectedRole(role);
    setIsViewDialogOpen(true);
  };

  const togglePermission = (permissionKey: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionKey)
        ? prev.permissions.filter(p => p !== permissionKey)
        : [...prev.permissions, permissionKey]
    }));
  };

  const selectAllPermissions = () => {
    const allPermissions = PERMISSION_CATEGORIES.flatMap(cat => 
      cat.permissions.map(p => p.key)
    );
    setFormData(prev => ({
      ...prev,
      permissions: allPermissions
    }));
  };

  const clearAllPermissions = () => {
    setFormData(prev => ({
      ...prev,
      permissions: []
    }));
  };

  // Filter roles
  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && role.isActive) ||
                         (selectedStatus === 'inactive' && !role.isActive);
    
    return matchesSearch && matchesStatus;
  });

  // Calculate metrics
  const totalRoles = roles.length;
  const activeRoles = roles.filter(r => r.isActive).length;
  const inactiveRoles = roles.filter(r => !r.isActive).length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Role & Permissions Management</h1>
          <p className="text-muted-foreground">Manage user roles and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Role
          </Button>
          <Button
            variant="outline"
            onClick={loadRoles}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRoles}</div>
            <p className="text-xs text-muted-foreground">
              All defined roles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Roles</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeRoles}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Roles</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{inactiveRoles}</div>
            <p className="text-xs text-muted-foreground">
              Disabled roles
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label>Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Roles ({filteredRoles.length})</CardTitle>
          <CardDescription>
            Manage user roles and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>Loading roles...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map(role => (
                  <TableRow key={role._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{role.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {role.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {role.permissions.length} permissions
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={role.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {role.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {role.createdAt ? new Date(role.createdAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openViewDialog(role)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(role)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Role
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => {
                              setRoleToDelete(role);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Role
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Role Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
            <DialogDescription>
              Create a new role with specific permissions
            </DialogDescription>
          </DialogHeader>
          
          <RoleForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            onSave={handleCreateRole}
            onCancel={() => {
              setIsAddDialogOpen(false);
              resetForm();
            }}
            isSaving={isSaving}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Update role information and permissions
            </DialogDescription>
          </DialogHeader>
          
          <RoleForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            onSave={handleUpdateRole}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setSelectedRole(null);
              resetForm();
            }}
            isSaving={isSaving}
          />
        </DialogContent>
      </Dialog>

      {/* View Role Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Role Details</DialogTitle>
            <DialogDescription>
              View role information and permissions
            </DialogDescription>
          </DialogHeader>
          
          {selectedRole && <RoleDetails role={selectedRole} />}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete role "{roleToDelete?.name}"? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRole}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Role
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Role Form Component
function RoleForm({ 
  formData, 
  setFormData, 
  errors, 
  onSave, 
  onCancel, 
  isSaving 
}: {
  formData: any;
  setFormData: (data: any) => void;
  errors: Record<string, string>;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const togglePermission = (permissionKey: string) => {
    setFormData((prev: any) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionKey)
        ? prev.permissions.filter((p: string) => p !== permissionKey)
        : [...prev.permissions, permissionKey]
    }));
  };

  const selectAllPermissions = () => {
    const allPermissions = PERMISSION_CATEGORIES.flatMap(cat => 
      cat.permissions.map(p => p.key)
    );
    setFormData((prev: any) => ({
      ...prev,
      permissions: allPermissions
    }));
  };

  const clearAllPermissions = () => {
    setFormData((prev: any) => ({
      ...prev,
      permissions: []
    }));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="name">Role Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? 'border-red-500' : ''}
                placeholder="Enter role name"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={errors.description ? 'border-red-500' : ''}
                placeholder="Enter role description"
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Permissions</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAllPermissions}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={clearAllPermissions}>
                Clear All
              </Button>
            </div>
          </div>

          {errors.permissions && (
            <p className="text-sm text-red-500">{errors.permissions}</p>
          )}

          <ScrollArea className="h-96">
            <div className="space-y-6">
              {PERMISSION_CATEGORIES.map(category => (
                <Card key={category.category}>
                  <CardHeader>
                    <CardTitle className="text-base">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3">
                      {category.permissions.map(permission => (
                        <div key={permission.key} className="flex items-start space-x-3">
                          <Checkbox
                            id={permission.key}
                            checked={formData.permissions.includes(permission.key)}
                            onCheckedChange={() => togglePermission(permission.key)}
                          />
                          <div className="flex-1">
                            <Label 
                              htmlFor={permission.key}
                              className="font-medium cursor-pointer"
                            >
                              {permission.label}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            'Save Role'
          )}
        </Button>
      </div>
    </div>
  );
}

// Role Details Component
function RoleDetails({ role }: { role: Role }) {
  const getPermissionCategory = (permissionKey: string) => {
    for (const category of PERMISSION_CATEGORIES) {
      if (category.permissions.some(p => p.key === permissionKey)) {
        return category.category;
      }
    }
    return 'Other';
  };

  const groupedPermissions = role.permissions.reduce((acc, permission) => {
    const category = getPermissionCategory(permission);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(permission);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm font-medium">Role Name</Label>
              <p className="text-sm text-muted-foreground">{role.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <p className="text-sm text-muted-foreground">{role.description}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Status</Label>
              <Badge className={role.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {role.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium">Total Permissions</Label>
              <p className="text-sm text-muted-foreground">{role.permissions.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Timestamps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm font-medium">Created</Label>
              <p className="text-sm text-muted-foreground">
                {role.createdAt ? new Date(role.createdAt).toLocaleString() : 'N/A'}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Last Updated</Label>
              <p className="text-sm text-muted-foreground">
                {role.updatedAt ? new Date(role.updatedAt).toLocaleString() : 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Permissions by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(groupedPermissions).map(([category, permissions]) => (
              <div key={category}>
                <h4 className="font-medium mb-2">{category}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {permissions.map(permission => {
                    const permissionInfo = PERMISSION_CATEGORIES
                      .flatMap(cat => cat.permissions)
                      .find(p => p.key === permission);
                    
                    return (
                      <div key={permission} className="flex items-center space-x-2 p-2 bg-muted rounded">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{permissionInfo?.label || permission}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}