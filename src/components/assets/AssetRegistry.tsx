'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  QrCode,
  Eye,
  Edit,
  Trash2,
  MapPin,
  User,
  Building,
  Calendar,
  DollarSign,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  MoreHorizontal
} from 'lucide-react';
import { AssetForm } from './AssetForm';
import { AssetDetailView } from './AssetDetailView';
import { Asset, AssetStatus, AssetCondition, AssetLifecycleStage } from '@/lib/models/asset';

export function AssetRegistry() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [showAssetDetail, setShowAssetDetail] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call to fetch assets
      // const response = await fetch('/api/assets');
      // const data = await response.json();
      // setAssets(data);
      
      // Mock data for now
      setAssets([
        {
          _id: '1',
          assetId: 'AST-001',
          name: 'Dell OptiPlex 7090',
          description: 'Desktop computer for office use',
          category: 'IT Equipment',
          assetType: AssetType.IT_EQUIPMENT,
          purchaseDate: new Date('2023-01-15'),
          purchaseCost: 1200,
          currentValue: 800,
          supplier: 'Dell Technologies',
          location: 'Office Floor 1',
          department: 'IT',
          assignedEmployee: 'John Doe',
          serialNumber: 'DL123456789',
          model: 'OptiPlex 7090',
          manufacturer: 'Dell',
          barcode: '123456789012',
          status: AssetStatus.ACTIVE,
          condition: AssetCondition.GOOD,
          lifecycleStage: AssetLifecycleStage.OPERATIONAL,
          depreciationMethod: DepreciationMethod.STRAIGHT_LINE,
          usefulLife: 5,
          salvageValue: 200,
          createdAt: new Date('2023-01-15'),
          updatedAt: new Date(),
          createdBy: 'admin',
          updatedBy: 'admin'
        },
        {
          _id: '2',
          assetId: 'AST-002',
          name: 'Canon ImageRUNNER 2525i',
          description: 'Multifunction printer/copier',
          category: 'Office Equipment',
          assetType: AssetType.IT_EQUIPMENT,
          purchaseDate: new Date('2022-06-10'),
          purchaseCost: 2500,
          currentValue: 1500,
          supplier: 'Canon Solutions',
          location: 'Office Floor 2',
          department: 'Administration',
          assignedEmployee: 'Jane Smith',
          serialNumber: 'CN987654321',
          model: 'ImageRUNNER 2525i',
          manufacturer: 'Canon',
          barcode: '987654321098',
          status: AssetStatus.ACTIVE,
          condition: AssetCondition.FAIR,
          lifecycleStage: AssetLifecycleStage.OPERATIONAL,
          depreciationMethod: DepreciationMethod.STRAIGHT_LINE,
          usefulLife: 7,
          salvageValue: 500,
          createdAt: new Date('2022-06-10'),
          updatedAt: new Date(),
          createdBy: 'admin',
          updatedBy: 'admin'
        }
      ]);
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || asset.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status: AssetStatus) => {
    const statusConfig = {
      [AssetStatus.ACTIVE]: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      [AssetStatus.INACTIVE]: { color: 'bg-gray-100 text-gray-800', icon: Clock },
      [AssetStatus.UNDER_MAINTENANCE]: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
      [AssetStatus.DISPOSED]: { color: 'bg-red-100 text-red-800', icon: Trash2 },
      [AssetStatus.LOST]: { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
      [AssetStatus.STOLEN]: { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
      [AssetStatus.RETIRED]: { color: 'bg-orange-100 text-orange-800', icon: Clock }
    };
    
    const config = statusConfig[status];
    
    // Fallback for undefined status
    if (!config) {
      return (
        <Badge className="bg-gray-100 text-gray-800 flex items-center gap-1">
          <Package className="h-3 w-3" />
          {status || 'Unknown'}
        </Badge>
      );
    }
    
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getConditionBadge = (condition: AssetCondition) => {
    const conditionConfig = {
      [AssetCondition.EXCELLENT]: { color: 'bg-green-100 text-green-800' },
      [AssetCondition.GOOD]: { color: 'bg-blue-100 text-blue-800' },
      [AssetCondition.FAIR]: { color: 'bg-yellow-100 text-yellow-800' },
      [AssetCondition.POOR]: { color: 'bg-orange-100 text-orange-800' },
      [AssetCondition.CRITICAL]: { color: 'bg-red-100 text-red-800' }
    };
    
    const config = conditionConfig[condition];
    
    // Fallback for undefined condition
    if (!config) {
      return (
        <Badge className="bg-gray-100 text-gray-800">
          {condition || 'Unknown'}
        </Badge>
      );
    }
    
    return (
      <Badge className={config.color}>
        {condition}
      </Badge>
    );
  };

  const handleEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
    setShowAssetForm(true);
  };

  const handleViewAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowAssetDetail(true);
  };

  const handleDeleteAsset = async (assetId: string) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      try {
        // TODO: Implement API call to delete asset
        // await fetch(`/api/assets/${assetId}`, { method: 'DELETE' });
        setAssets(assets.filter(asset => asset._id !== assetId));
      } catch (error) {
        console.error('Error deleting asset:', error);
      }
    }
  };

  const handleAssetSaved = (savedAsset: Asset) => {
    if (editingAsset) {
      setAssets(assets.map(asset => asset._id === savedAsset._id ? savedAsset : asset));
    } else {
      setAssets([...assets, savedAsset]);
    }
    setShowAssetForm(false);
    setEditingAsset(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Asset Registry</h2>
          <p className="text-muted-foreground">
            Manage and track all company assets
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <QrCode className="h-4 w-4 mr-2" />
            Scan Barcode
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAssetForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="UNDER_MAINTENANCE">Under Maintenance</SelectItem>
                  <SelectItem value="DISPOSED">Disposed</SelectItem>
                  <SelectItem value="RETIRED">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="IT Equipment">IT Equipment</SelectItem>
                  <SelectItem value="Office Equipment">Office Equipment</SelectItem>
                  <SelectItem value="Vehicles">Vehicles</SelectItem>
                  <SelectItem value="Machinery">Machinery</SelectItem>
                  <SelectItem value="Furniture">Furniture</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assets Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Assets ({filteredAssets.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Current Value</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => (
                <TableRow key={asset._id}>
                  <TableCell className="font-medium">{asset.assetId}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{asset.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {asset.model} - {asset.serialNumber}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{asset.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {asset.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {asset.assignedEmployee || 'Unassigned'}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(asset.status)}</TableCell>
                  <TableCell>{getConditionBadge(asset.condition)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      ${asset.currentValue.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewAsset(asset)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditAsset(asset)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAsset(asset._id!)}
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

      {/* Asset Form Dialog */}
      <Dialog open={showAssetForm} onOpenChange={setShowAssetForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAsset ? 'Edit Asset' : 'Add New Asset'}
            </DialogTitle>
          </DialogHeader>
          <AssetForm
            asset={editingAsset}
            onSave={handleAssetSaved}
            onCancel={() => {
              setShowAssetForm(false);
              setEditingAsset(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Asset Detail Dialog */}
      <Dialog open={showAssetDetail} onOpenChange={setShowAssetDetail}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Asset Details</DialogTitle>
          </DialogHeader>
          {selectedAsset && (
            <AssetDetailView
              asset={selectedAsset}
              onEdit={() => {
                setShowAssetDetail(false);
                handleEditAsset(selectedAsset);
              }}
              onClose={() => setShowAssetDetail(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
