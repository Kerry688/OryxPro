'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Save, 
  X, 
  Package, 
  DollarSign, 
  MapPin, 
  User, 
  Settings,
  Calendar,
  QrCode,
  Building,
  Tag
} from 'lucide-react';
import { Asset, AssetType, AssetStatus, AssetCondition, AssetLifecycleStage, DepreciationMethod } from '@/lib/models/asset';
import { useToast } from '@/hooks/use-toast';

interface AssetFormProps {
  asset?: Asset | null;
  onSave: (asset: Asset) => void;
  onCancel: () => void;
}

export function AssetForm({ asset, onSave, onCancel }: AssetFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Asset>>({
    assetId: '',
    name: '',
    description: '',
    category: '',
    subcategory: '',
    assetType: AssetType.IT_EQUIPMENT,
    purchaseDate: new Date(),
    purchaseCost: 0,
    currentValue: 0,
    supplier: '',
    invoiceNumber: '',
    warrantyPeriod: 12,
    location: '',
    department: '',
    assignedEmployee: '',
    costCenter: '',
    serialNumber: '',
    model: '',
    manufacturer: '',
    specifications: {},
    barcode: '',
    rfidTag: '',
    parentAsset: '',
    depreciationMethod: DepreciationMethod.STRAIGHT_LINE,
    usefulLife: 5,
    salvageValue: 0,
    status: AssetStatus.ACTIVE,
    condition: AssetCondition.GOOD,
    lifecycleStage: AssetLifecycleStage.ACQUISITION,
    maintenanceInterval: 90,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'current-user',
    updatedBy: 'current-user'
  });

  useEffect(() => {
    if (asset) {
      setFormData(asset);
    } else {
      // Generate new asset ID
      generateAssetId();
    }
  }, [asset]);

  const generateAssetId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const assetId = `AST-${timestamp}-${random}`;
    setFormData(prev => ({ ...prev, assetId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.assetId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const assetData: Asset = {
        ...formData,
        _id: asset?._id || undefined,
        assetId: formData.assetId!,
        name: formData.name!,
        purchaseDate: formData.purchaseDate!,
        purchaseCost: formData.purchaseCost!,
        currentValue: formData.currentValue || formData.purchaseCost!,
        usefulLife: formData.usefulLife!,
        salvageValue: formData.salvageValue!,
        status: formData.status!,
        condition: formData.condition!,
        lifecycleStage: formData.lifecycleStage!,
        depreciationMethod: formData.depreciationMethod!,
        assetType: formData.assetType!,
        createdAt: asset?.createdAt || new Date(),
        updatedAt: new Date(),
        createdBy: asset?.createdBy || 'current-user',
        updatedBy: 'current-user'
      } as Asset;

      // TODO: Implement API call to save asset
      // const response = await fetch(asset?._id ? `/api/assets/${asset._id}` : '/api/assets', {
      //   method: asset?._id ? 'PUT' : 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(assetData)
      // });
      
      // if (!response.ok) throw new Error('Failed to save asset');
      
      // const savedAsset = await response.json();
      
      // Simulate API call
      const savedAsset = { ...assetData, _id: asset?._id || Date.now().toString() };
      
      onSave(savedAsset);
      
      toast({
        title: "Success",
        description: asset ? "Asset updated successfully" : "Asset created successfully",
      });
    } catch (error) {
      console.error('Error saving asset:', error);
      toast({
        title: "Error",
        description: "Failed to save asset. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderBasicInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="assetId">Asset ID *</Label>
            <Input
              id="assetId"
              value={formData.assetId || ''}
              onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
              placeholder="AST-001"
              required
            />
          </div>
          <div>
            <Label htmlFor="name">Asset Name *</Label>
            <Input
              id="name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter asset name"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter asset description"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="IT Equipment"
              required
            />
          </div>
          <div>
            <Label htmlFor="subcategory">Subcategory</Label>
            <Input
              id="subcategory"
              value={formData.subcategory || ''}
              onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
              placeholder="Desktop Computers"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="assetType">Asset Type *</Label>
            <Select value={formData.assetType} onValueChange={(value) => setFormData({ ...formData, assetType: value as AssetType })}>
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
            <Label htmlFor="status">Status *</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as AssetStatus })}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={AssetStatus.ACTIVE}>Active</SelectItem>
                <SelectItem value={AssetStatus.INACTIVE}>Inactive</SelectItem>
                <SelectItem value={AssetStatus.UNDER_MAINTENANCE}>Under Maintenance</SelectItem>
                <SelectItem value={AssetStatus.DISPOSED}>Disposed</SelectItem>
                <SelectItem value={AssetStatus.RETIRED}>Retired</SelectItem>
                <SelectItem value={AssetStatus.LOST}>Lost</SelectItem>
                <SelectItem value={AssetStatus.STOLEN}>Stolen</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="condition">Condition *</Label>
            <Select value={formData.condition} onValueChange={(value) => setFormData({ ...formData, condition: value as AssetCondition })}>
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={AssetCondition.EXCELLENT}>Excellent</SelectItem>
                <SelectItem value={AssetCondition.GOOD}>Good</SelectItem>
                <SelectItem value={AssetCondition.FAIR}>Fair</SelectItem>
                <SelectItem value={AssetCondition.POOR}>Poor</SelectItem>
                <SelectItem value={AssetCondition.CRITICAL}>Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="lifecycleStage">Lifecycle Stage *</Label>
            <Select value={formData.lifecycleStage} onValueChange={(value) => setFormData({ ...formData, lifecycleStage: value as AssetLifecycleStage })}>
              <SelectTrigger>
                <SelectValue placeholder="Select lifecycle stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={AssetLifecycleStage.ACQUISITION}>Acquisition</SelectItem>
                <SelectItem value={AssetLifecycleStage.COMMISSIONING}>Commissioning</SelectItem>
                <SelectItem value={AssetLifecycleStage.OPERATIONAL}>Operational</SelectItem>
                <SelectItem value={AssetLifecycleStage.MAINTENANCE}>Maintenance</SelectItem>
                <SelectItem value={AssetLifecycleStage.RETIREMENT}>Retirement</SelectItem>
                <SelectItem value={AssetLifecycleStage.DISPOSAL}>Disposal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderFinancialInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Financial Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="purchaseDate">Purchase Date *</Label>
            <Input
              id="purchaseDate"
              type="date"
              value={formData.purchaseDate ? new Date(formData.purchaseDate).toISOString().split('T')[0] : ''}
              onChange={(e) => setFormData({ ...formData, purchaseDate: new Date(e.target.value) })}
              required
            />
          </div>
          <div>
            <Label htmlFor="purchaseCost">Purchase Cost *</Label>
            <Input
              id="purchaseCost"
              type="number"
              value={formData.purchaseCost || ''}
              onChange={(e) => setFormData({ ...formData, purchaseCost: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="currentValue">Current Value</Label>
            <Input
              id="currentValue"
              type="number"
              value={formData.currentValue || ''}
              onChange={(e) => setFormData({ ...formData, currentValue: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label htmlFor="salvageValue">Salvage Value</Label>
            <Input
              id="salvageValue"
              type="number"
              value={formData.salvageValue || ''}
              onChange={(e) => setFormData({ ...formData, salvageValue: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="supplier">Supplier</Label>
            <Input
              id="supplier"
              value={formData.supplier || ''}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              placeholder="Supplier name"
            />
          </div>
          <div>
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input
              id="invoiceNumber"
              value={formData.invoiceNumber || ''}
              onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
              placeholder="INV-001"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="depreciationMethod">Depreciation Method *</Label>
            <Select value={formData.depreciationMethod} onValueChange={(value) => setFormData({ ...formData, depreciationMethod: value as DepreciationMethod })}>
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
          <div>
            <Label htmlFor="usefulLife">Useful Life (Years) *</Label>
            <Input
              id="usefulLife"
              type="number"
              value={formData.usefulLife || ''}
              onChange={(e) => setFormData({ ...formData, usefulLife: parseInt(e.target.value) || 0 })}
              placeholder="5"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="warrantyPeriod">Warranty Period (Months)</Label>
          <Input
            id="warrantyPeriod"
            type="number"
            value={formData.warrantyPeriod || ''}
            onChange={(e) => setFormData({ ...formData, warrantyPeriod: parseInt(e.target.value) || 0 })}
            placeholder="12"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderLocationAssignment = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location & Assignment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Office Floor 1"
              required
            />
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={formData.department || ''}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="IT Department"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="assignedEmployee">Assigned Employee</Label>
            <Input
              id="assignedEmployee"
              value={formData.assignedEmployee || ''}
              onChange={(e) => setFormData({ ...formData, assignedEmployee: e.target.value })}
              placeholder="John Doe"
            />
          </div>
          <div>
            <Label htmlFor="costCenter">Cost Center</Label>
            <Input
              id="costCenter"
              value={formData.costCenter || ''}
              onChange={(e) => setFormData({ ...formData, costCenter: e.target.value })}
              placeholder="IT-001"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderTechnicalDetails = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Technical Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="serialNumber">Serial Number</Label>
            <Input
              id="serialNumber"
              value={formData.serialNumber || ''}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              placeholder="ABC123456789"
            />
          </div>
          <div>
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={formData.model || ''}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              placeholder="OptiPlex 7090"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="manufacturer">Manufacturer</Label>
          <Input
            id="manufacturer"
            value={formData.manufacturer || ''}
            onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
            placeholder="Dell Technologies"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="barcode">Barcode</Label>
            <Input
              id="barcode"
              value={formData.barcode || ''}
              onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
              placeholder="123456789012"
            />
          </div>
          <div>
            <Label htmlFor="rfidTag">RFID Tag</Label>
            <Input
              id="rfidTag"
              value={formData.rfidTag || ''}
              onChange={(e) => setFormData({ ...formData, rfidTag: e.target.value })}
              placeholder="RFID123456789"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="maintenanceInterval">Maintenance Interval (Days)</Label>
          <Input
            id="maintenanceInterval"
            type="number"
            value={formData.maintenanceInterval || ''}
            onChange={(e) => setFormData({ ...formData, maintenanceInterval: parseInt(e.target.value) || 0 })}
            placeholder="90"
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          {renderBasicInfo()}
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          {renderFinancialInfo()}
        </TabsContent>

        <TabsContent value="location" className="space-y-4">
          {renderLocationAssignment()}
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          {renderTechnicalDetails()}
        </TabsContent>
      </Tabs>

      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : (asset ? 'Update Asset' : 'Create Asset')}
        </Button>
      </div>
    </form>
  );
}
