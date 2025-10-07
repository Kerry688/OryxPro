'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Building, 
  Package,
  DollarSign,
  Calendar,
  Settings
} from 'lucide-react';
import { AssetCategory, AssetType, DepreciationMethod } from '@/lib/models/asset';

export function AssetCategories() {
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AssetCategory | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call to fetch categories
      // const response = await fetch('/api/asset-categories');
      // const data = await response.json();
      // setCategories(data);
      
      // Mock data for now
      setCategories([
        {
          _id: '1',
          name: 'IT Equipment',
          code: 'IT',
          description: 'Computers, servers, networking equipment',
          assetType: AssetType.IT_EQUIPMENT,
          depreciationMethod: DepreciationMethod.STRAIGHT_LINE,
          defaultUsefulLife: 5,
          defaultSalvageValue: 200,
          isActive: true,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date()
        },
        {
          _id: '2',
          name: 'Office Furniture',
          code: 'OF',
          description: 'Desks, chairs, cabinets',
          assetType: AssetType.FURNITURE,
          depreciationMethod: DepreciationMethod.STRAIGHT_LINE,
          defaultUsefulLife: 10,
          defaultSalvageValue: 100,
          isActive: true,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date()
        },
        {
          _id: '3',
          name: 'Vehicles',
          code: 'VEH',
          description: 'Company cars, trucks, vans',
          assetType: AssetType.VEHICLE,
          depreciationMethod: DepreciationMethod.DECLINING_BALANCE,
          defaultUsefulLife: 8,
          defaultSalvageValue: 5000,
          isActive: true,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date()
        }
      ]);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = (category: AssetCategory) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        // TODO: Implement API call to delete category
        // await fetch(`/api/asset-categories/${categoryId}`, { method: 'DELETE' });
        setCategories(categories.filter(cat => cat._id !== categoryId));
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const CategoryForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Category Name *</Label>
          <Input
            id="name"
            defaultValue={editingCategory?.name || ''}
            placeholder="IT Equipment"
            required
          />
        </div>
        <div>
          <Label htmlFor="code">Category Code *</Label>
          <Input
            id="code"
            defaultValue={editingCategory?.code || ''}
            placeholder="IT"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          defaultValue={editingCategory?.description || ''}
          placeholder="Category description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="assetType">Asset Type *</Label>
          <Select defaultValue={editingCategory?.assetType || AssetType.IT_EQUIPMENT}>
            <SelectTrigger>
              <SelectValue placeholder="Select asset type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={AssetType.IT_EQUIPMENT}>IT Equipment</SelectItem>
              <SelectItem value={AssetType.VEHICLE}>Vehicle</SelectItem>
              <SelectItem value={AssetType.MACHINERY}>Machinery</SelectItem>
              <SelectItem value={AssetType.FURNITURE}>Furniture</SelectItem>
              <SelectItem value={AssetType.BUILDING}>Building</SelectItem>
              <SelectItem value={AssetType.LAND}>Land</SelectItem>
              <SelectItem value={AssetType.INTANGIBLE}>Intangible</SelectItem>
              <SelectItem value={AssetType.OTHER}>Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="depreciationMethod">Depreciation Method *</Label>
          <Select defaultValue={editingCategory?.depreciationMethod || DepreciationMethod.STRAIGHT_LINE}>
            <SelectTrigger>
              <SelectValue placeholder="Select depreciation method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={DepreciationMethod.STRAIGHT_LINE}>Straight Line</SelectItem>
              <SelectItem value={DepreciationMethod.DECLINING_BALANCE}>Declining Balance</SelectItem>
              <SelectItem value={DepreciationMethod.UNITS_OF_PRODUCTION}>Units of Production</SelectItem>
              <SelectItem value={DepreciationMethod.SUM_OF_YEARS_DIGITS}>Sum of Years Digits</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="usefulLife">Default Useful Life (Years) *</Label>
          <Input
            id="usefulLife"
            type="number"
            defaultValue={editingCategory?.defaultUsefulLife || 5}
            placeholder="5"
            required
          />
        </div>
        <div>
          <Label htmlFor="salvageValue">Default Salvage Value *</Label>
          <Input
            id="salvageValue"
            type="number"
            defaultValue={editingCategory?.defaultSalvageValue || 0}
            placeholder="0"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={() => setShowForm(false)}>
          Cancel
        </Button>
        <Button onClick={() => {
          // TODO: Implement save logic
          setShowForm(false);
          setEditingCategory(null);
        }}>
          {editingCategory ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Asset Categories</h2>
          <p className="text-muted-foreground">
            Manage asset categories and their default settings
          </p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </DialogTitle>
            </DialogHeader>
            <CategoryForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Categories ({categories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Asset Type</TableHead>
                <TableHead>Depreciation Method</TableHead>
                <TableHead>Useful Life</TableHead>
                <TableHead>Salvage Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell className="font-medium">{category.code}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{category.name}</div>
                      {category.description && (
                        <div className="text-sm text-muted-foreground">
                          {category.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {category.assetType.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {category.depreciationMethod.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{category.defaultUsefulLife} years</TableCell>
                  <TableCell>${category.defaultSalvageValue}</TableCell>
                  <TableCell>
                    <Badge className={category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(category._id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
