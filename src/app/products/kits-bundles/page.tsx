'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Copy,
  Settings,
  Calculator,
  Info,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  DollarSign
} from 'lucide-react';
import { ProductForm } from '@/components/features/ProductForm';
import { Product } from '@/lib/models/product';
import Link from 'next/link';

export default function KitBundlePage() {
  const [kitBundles, setKitBundles] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingKitBundle, setEditingKitBundle] = useState<Product | null>(null);

  // Fetch kit/bundle products
  const fetchKitBundles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products?type=kit_bundle');
      if (!response.ok) throw new Error('Failed to fetch kit bundles');
      
      const data = await response.json();
      setKitBundles(data.products || []);
    } catch (error) {
      console.error('Error fetching kit bundles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKitBundles();
  }, []);

  const handleAddKitBundle = async (kitBundleData: any) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(kitBundleData)
      });

      if (!response.ok) throw new Error('Failed to create kit bundle');
      
      setShowAddDialog(false);
      fetchKitBundles();
    } catch (error) {
      console.error('Error creating kit bundle:', error);
    }
  };

  const handleEditKitBundle = async (kitBundleData: any) => {
    if (!editingKitBundle) return;
    
    try {
      const response = await fetch(`/api/products/${editingKitBundle._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(kitBundleData)
      });

      if (!response.ok) throw new Error('Failed to update kit bundle');
      
      setEditingKitBundle(null);
      fetchKitBundles();
    } catch (error) {
      console.error('Error updating kit bundle:', error);
    }
  };

  const handleDeleteKitBundle = async (kitBundleId: string) => {
    if (!confirm('Are you sure you want to delete this kit/bundle?')) return;
    
    try {
      const response = await fetch(`/api/products/${kitBundleId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete kit bundle');
      
      fetchKitBundles();
    } catch (error) {
      console.error('Error deleting kit bundle:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kit & Bundle Products</h1>
          <p className="text-muted-foreground">
            Create and manage product bundles and kits with multiple components
          </p>
        </div>
        <div className="flex space-x-2">
          <Link href="/products/manage">
            <Button variant="outline">
              <Package className="w-4 h-4 mr-2" />
              All Products
            </Button>
          </Link>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Kit/Bundle
              </Button>
            </DialogTrigger>
            <DialogContent className="!max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Kit/Bundle Product</DialogTitle>
              </DialogHeader>
              <ProductForm
                onSubmit={handleAddKitBundle}
                onCancel={() => setShowAddDialog(false)}
                productTypes={[
                  { type: 'kit_bundle', name: 'Kit/Bundle' }
                ]}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5 text-blue-600" />
              <span>What are Kit/Bundle Products?</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <p className="text-sm font-medium text-blue-900 mb-2">
                <strong>Kit/Bundle = Existing Products Combined</strong>
              </p>
              <p className="text-sm text-blue-700">
                A kit or bundle is a combination of products that already exist in your system, 
                sold together as a single unit with special pricing.
              </p>
            </div>
            <ul className="text-sm space-y-2">
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Combine existing products from your inventory</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Set special bundle pricing (discounts or premiums)</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Configure required vs optional components</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Track inventory of individual components</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-orange-600" />
              <span>Configuration Options</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Badge variant="outline">Required Components</Badge>
                <span className="text-sm text-muted-foreground">Must be included</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">Optional Components</Badge>
                <span className="text-sm text-muted-foreground">Customer choice</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">Configurable</Badge>
                <span className="text-sm text-muted-foreground">Customizable</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">Fixed Bundle</Badge>
                <span className="text-sm text-muted-foreground">Pre-defined</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="h-5 w-5 text-green-600" />
              <span>Pricing Strategies</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm">Component Total + Markup</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm">Fixed Bundle Price</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm">Volume Discounts</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm">Dynamic Pricing</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Step-by-Step Guide */}
      <Card>
        <CardHeader>
          <CardTitle>How to Create a Kit/Bundle Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-2">Prerequisites: Have Existing Products</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Before creating a kit/bundle, ensure you have products already in your system.</strong>
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Go to <strong>Products → Manage</strong> to add individual products first</li>
                  <li>• Create products like "Office Chair", "Desk", "Computer", etc.</li>
                  <li>• Set prices, stock levels, and categories for each product</li>
                  <li>• Only then can you combine them into kits/bundles</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-2">Select Existing Products as Components</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Choose from the products already in your system to create your kit/bundle.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Search through your existing product catalog</li>
                  <li>• Filter by category to find related products</li>
                  <li>• Click "Add to Bundle" to include existing products</li>
                  <li>• Set quantities for each existing product</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-2">Configure Components</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Set up each component with specific requirements and pricing adjustments.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Set quantities for each component</li>
                  <li>• Mark components as required or optional</li>
                  <li>• Add price adjustments (discounts or premiums)</li>
                  <li>• Add notes for special instructions</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium">
                4
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-2">Set Bundle Pricing</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Configure the pricing strategy for your kit/bundle product.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Set base price for the bundle</li>
                  <li>• Apply markup percentage</li>
                  <li>• Review calculated total price</li>
                  <li>• Enable configurable option if customers can modify</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium">
                5
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-2">Packaging & Assembly</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Define packaging requirements and assembly instructions.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Set packaging dimensions and weight</li>
                  <li>• Choose packaging type (box, envelope, etc.)</li>
                  <li>• Add assembly instructions if needed</li>
                  <li>• Consider shipping requirements</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-4 border-t">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium">Important:</span>
              <span className="text-sm text-muted-foreground">
                Kit/Bundles are combinations of existing products. You must have products in your system before creating bundles.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kit/Bundle Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Kit/Bundle Products ({kitBundles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : kitBundles.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Kit/Bundle Products Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first kit/bundle by combining existing products.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mb-4 max-w-md mx-auto">
                <p className="text-sm text-blue-800">
                  <strong>Remember:</strong> Kit/Bundles are made from products already in your system. 
                  Make sure you have individual products created first.
                </p>
              </div>
              <div className="flex space-x-2 justify-center">
                <Link href="/products/manage">
                  <Button variant="outline">
                    <Package className="w-4 h-4 mr-2" />
                    Add Products First
                  </Button>
                </Link>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Kit/Bundle
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Components</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Configurable</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kitBundles.map((kitBundle) => (
                    <TableRow key={kitBundle._id?.toString()}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{kitBundle.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {kitBundle.description?.substring(0, 50)}...
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {kitBundle.sku}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span>{(kitBundle as any).components?.length || 0} items</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {formatCurrency((kitBundle as any).basePrice || 0)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={(kitBundle as any).isConfigurable ? 'default' : 'secondary'}>
                          {(kitBundle as any).isConfigurable ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={kitBundle.isActive ? 'default' : 'secondary'}>
                          {kitBundle.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingKitBundle(kitBundle)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteKitBundle(kitBundle._id!.toString())}
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

      {/* Edit Kit Bundle Dialog */}
      {editingKitBundle && (
        <Dialog open={!!editingKitBundle} onOpenChange={() => setEditingKitBundle(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Kit/Bundle Product</DialogTitle>
            </DialogHeader>
            <ProductForm
              product={editingKitBundle}
              onSubmit={handleEditKitBundle}
              onCancel={() => setEditingKitBundle(null)}
              productTypes={[
                { type: 'kit_bundle', name: 'Kit/Bundle' }
              ]}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
