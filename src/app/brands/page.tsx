'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Combobox, ComboboxItem } from '@/components/ui/combobox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Package,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { Brand } from '@/lib/models/brand';
import { BrandForm } from '@/components/features/BrandForm';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/use-translation';

export default function BrandsPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const [brands, setBrands] = useState<(Brand & { productCount: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [categories] = useState([
    'electronics', 'clothing', 'automotive', 'food_beverage', 'beauty', 
    'home_garden', 'sports', 'books', 'toys', 'health', 'office', 
    'industrial', 'photography', 'other'
  ]);

  // Fetch brands
  const fetchBrands = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      
      const response = await fetch(`/api/brands?${params}`);
      if (!response.ok) throw new Error('Failed to fetch brands');
      
      const data = await response.json();
      setBrands(data.brands);
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [searchQuery, selectedCategory, selectedStatus]);

  const handleAddBrand = async (brandData: any) => {
    try {
      const response = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...brandData,
          createdBy: user?.id
        })
      });

      if (!response.ok) throw new Error('Failed to create brand');
      
      setShowAddDialog(false);
      fetchBrands();
    } catch (error) {
      console.error('Error creating brand:', error);
    }
  };

  const handleEditBrand = async (brandData: any) => {
    if (!editingBrand) return;
    
    try {
      const response = await fetch(`/api/brands/${editingBrand._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...brandData,
          updatedBy: user?.id
        })
      });

      if (!response.ok) throw new Error('Failed to update brand');
      
      setEditingBrand(null);
      fetchBrands();
    } catch (error) {
      console.error('Error updating brand:', error);
    }
  };

  const handleDeleteBrand = async (brandId: string) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;
    
    try {
      const response = await fetch(`/api/brands/${brandId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error);
        return;
      }
      
      fetchBrands();
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'discontinued':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'discontinued':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'electronics': 'bg-blue-100 text-blue-800',
      'clothing': 'bg-pink-100 text-pink-800',
      'automotive': 'bg-gray-100 text-gray-800',
      'food_beverage': 'bg-green-100 text-green-800',
      'beauty': 'bg-purple-100 text-purple-800',
      'home_garden': 'bg-emerald-100 text-emerald-800',
      'sports': 'bg-orange-100 text-orange-800',
      'books': 'bg-indigo-100 text-indigo-800',
      'toys': 'bg-yellow-100 text-yellow-800',
      'health': 'bg-red-100 text-red-800',
      'office': 'bg-slate-100 text-slate-800',
      'industrial': 'bg-zinc-100 text-zinc-800',
      'other': 'bg-neutral-100 text-neutral-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Brand Management</h1>
          <p className="text-muted-foreground">
            Manage your brand portfolio and brand information
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Brand
            </Button>
          </DialogTrigger>
          <DialogContent className="!max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Brand</DialogTitle>
            </DialogHeader>
            <BrandForm
              onSubmit={handleAddBrand}
              onCancel={() => setShowAddDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Brands</p>
                <p className="text-2xl font-bold">{brands.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Brands</p>
                <p className="text-2xl font-bold">
                  {brands.filter(b => b.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">
                  {brands.filter(b => b.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">
                  {brands.reduce((sum, brand) => sum + brand.productCount, 0)}
                </p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
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
                  {category.replace('_', ' ').toUpperCase()}
                </ComboboxItem>
              ))}
            </Combobox>
            <Combobox 
              value={selectedStatus} 
              onValueChange={setSelectedStatus}
              placeholder="Status"
              searchPlaceholder="Search status..."
              emptyText="No status found."
            >
              <ComboboxItem value="all">All Status</ComboboxItem>
              <ComboboxItem value="active">Active</ComboboxItem>
              <ComboboxItem value="inactive">Inactive</ComboboxItem>
              <ComboboxItem value="pending">Pending</ComboboxItem>
              <ComboboxItem value="discontinued">Discontinued</ComboboxItem>
            </Combobox>
          </div>
        </CardContent>
      </Card>

      {/* Brands Table */}
      <Card>
        <CardHeader>
          <CardTitle>Brands ({brands.length})</CardTitle>
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
                    <TableHead>Brand</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brands.map((brand) => (
                    <TableRow key={brand._id?.toString()}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {brand.logo && (
                            <img 
                              src={brand.logo} 
                              alt={brand.name}
                              className="h-8 w-8 rounded object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium">{brand.name}</p>
                            <p className="text-sm text-muted-foreground">{brand.code}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(brand.category)}>
                          {brand.category.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(brand.status)}
                          <Badge className={getStatusColor(brand.status)}>
                            {brand.status.toUpperCase()}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span>{brand.productCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {brand.email && (
                            <div className="flex items-center space-x-1 text-sm">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">{brand.email}</span>
                            </div>
                          )}
                          {brand.phone && (
                            <div className="flex items-center space-x-1 text-sm">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">{brand.phone}</span>
                            </div>
                          )}
                          {brand.website && (
                            <div className="flex items-center space-x-1 text-sm">
                              <Globe className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">Website</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingBrand(brand)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBrand(brand._id!.toString())}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Brand Dialog */}
      {editingBrand && (
        <Dialog open={!!editingBrand} onOpenChange={() => setEditingBrand(null)}>
          <DialogContent className="!max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Brand</DialogTitle>
            </DialogHeader>
            <BrandForm
              brand={editingBrand}
              onSubmit={handleEditBrand}
              onCancel={() => setEditingBrand(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
