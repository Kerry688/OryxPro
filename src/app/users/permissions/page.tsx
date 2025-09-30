'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Shield,
  CheckCircle,
  Key,
  Filter,
  RefreshCw,
  Info,
  Lock,
  Unlock
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Types
interface Permission {
  key: string;
  label: string;
  description: string;
  category: string;
}

interface PermissionCategory {
  category: string;
  permissions: {
    key: string;
    label: string;
    description: string;
  }[];
}

interface PermissionsData {
  categories: PermissionCategory[];
  allPermissions: Permission[];
  totalPermissions: number;
}

export default function PermissionsManagementPage() {
  // State management
  const [permissionsData, setPermissionsData] = useState<PermissionsData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Load permissions
  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);

      const response = await fetch(`/api/users/permissions?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setPermissionsData(result.data);
      } else {
        toast.error('Failed to load permissions');
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
      toast.error('Failed to load permissions');
    } finally {
      setIsLoading(false);
    }
  };

  // Reload when filters change
  useEffect(() => {
    if (permissionsData) {
      loadPermissions();
    }
  }, [searchTerm, selectedCategory]);

  // Get unique categories for filter
  const categories = permissionsData?.categories.map(cat => cat.category) || [];

  // Filter permissions based on search and category
  const filteredCategories = permissionsData?.categories.filter(category => {
    const matchesCategory = selectedCategory === 'all' || category.category === selectedCategory;
    return matchesCategory;
  }) || [];

  const getPermissionIcon = (permission: string) => {
    if (permission.includes('create')) return <Unlock className="h-4 w-4 text-green-500" />;
    if (permission.includes('read')) return <Info className="h-4 w-4 text-blue-500" />;
    if (permission.includes('update')) return <RefreshCw className="h-4 w-4 text-yellow-500" />;
    if (permission.includes('delete')) return <Lock className="h-4 w-4 text-red-500" />;
    return <Shield className="h-4 w-4 text-gray-500" />;
  };

  const getPermissionColor = (permission: string) => {
    if (permission.includes('create')) return 'bg-green-100 text-green-800 border-green-200';
    if (permission.includes('read')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (permission.includes('update')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (permission.includes('delete')) return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Permissions Management</h1>
          <p className="text-muted-foreground">View and manage system permissions</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadPermissions}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Permissions</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{permissionsData?.totalPermissions || 0}</div>
            <p className="text-xs text-muted-foreground">
              All system permissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              Permission categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Create Permissions</CardTitle>
            <Unlock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {permissionsData?.allPermissions.filter(p => p.key.includes('create')).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Creation permissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delete Permissions</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {permissionsData?.allPermissions.filter(p => p.key.includes('delete')).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Deletion permissions
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
                  placeholder="Search permissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label>Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permissions by Category */}
      <div className="space-y-6">
        {isLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>Loading permissions...</span>
            </CardContent>
          </Card>
        ) : filteredCategories.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No permissions found matching your criteria.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredCategories.map(category => (
            <Card key={category.category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {category.category}
                </CardTitle>
                <CardDescription>
                  {category.permissions.length} permissions in this category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.permissions.map(permission => (
                    <div
                      key={permission.key}
                      className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getPermissionIcon(permission.key)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{permission.label}</h4>
                          <Badge 
                            variant="outline" 
                            className={cn("text-xs", getPermissionColor(permission.key))}
                          >
                            {permission.key.split('.').pop()}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {permission.description}
                        </p>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {permission.key}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Permission Usage Guide */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Permission Usage Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Unlock className="h-4 w-4 text-green-500" />
              <div>
                <p className="font-medium text-sm">Create</p>
                <p className="text-xs text-muted-foreground">Add new items</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Info className="h-4 w-4 text-blue-500" />
              <div>
                <p className="font-medium text-sm">Read</p>
                <p className="text-xs text-muted-foreground">View information</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="font-medium text-sm">Update</p>
                <p className="text-xs text-muted-foreground">Modify existing items</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-red-500" />
              <div>
                <p className="font-medium text-sm">Delete</p>
                <p className="text-xs text-muted-foreground">Remove items</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
