'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Edit, 
  Download, 
  QrCode,
  MapPin,
  User,
  Building,
  Calendar,
  DollarSign,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  History,
  Wrench,
  BarChart3,
  FileText
} from 'lucide-react';
import { Asset, AssetStatus, AssetCondition, AssetLifecycleStage } from '@/lib/models/asset';

interface AssetDetailViewProps {
  asset: Asset;
  onEdit: () => void;
  onClose: () => void;
}

export function AssetDetailView({ asset, onEdit, onClose }: AssetDetailViewProps) {
  const [maintenanceHistory, setMaintenanceHistory] = useState([]);
  const [depreciationHistory, setDepreciationHistory] = useState([]);

  useEffect(() => {
    loadAssetDetails();
  }, [asset._id]);

  const loadAssetDetails = async () => {
    try {
      // TODO: Load maintenance history and depreciation records
      // const [maintenanceRes, depreciationRes] = await Promise.all([
      //   fetch(`/api/assets/${asset._id}/maintenance`),
      //   fetch(`/api/assets/${asset._id}/depreciation`)
      // ]);
      // const maintenanceData = await maintenanceRes.json();
      // const depreciationData = await depreciationRes.json();
      // setMaintenanceHistory(maintenanceData);
      // setDepreciationHistory(depreciationData);
    } catch (error) {
      console.error('Error loading asset details:', error);
    }
  };

  const getStatusBadge = (status: AssetStatus) => {
    const statusConfig = {
      [AssetStatus.ACTIVE]: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      [AssetStatus.INACTIVE]: { color: 'bg-gray-100 text-gray-800', icon: Clock },
      [AssetStatus.UNDER_MAINTENANCE]: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
      [AssetStatus.DISPOSED]: { color: 'bg-red-100 text-red-800', icon: Package },
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(asset.currentValue)}</div>
          <p className="text-xs text-muted-foreground">
            Purchase: {formatCurrency(asset.purchaseCost)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Depreciation</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(asset.purchaseCost - asset.currentValue)}
          </div>
          <p className="text-xs text-muted-foreground">
            {asset.depreciationMethod.replace('_', ' ')}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Age</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.floor((Date.now() - new Date(asset.purchaseDate).getTime()) / (1000 * 60 * 60 * 24 * 365))} years
          </div>
          <p className="text-xs text-muted-foreground">
            Purchased: {formatDate(asset.purchaseDate)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Useful Life</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{asset.usefulLife} years</div>
          <p className="text-xs text-muted-foreground">
            Remaining: {Math.max(0, asset.usefulLife - Math.floor((Date.now() - new Date(asset.purchaseDate).getTime()) / (1000 * 60 * 60 * 24 * 365)))} years
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderBasicInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Asset ID</label>
            <p className="text-sm">{asset.assetId}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Name</label>
            <p className="text-sm">{asset.name}</p>
          </div>
        </div>

        {asset.description && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Description</label>
            <p className="text-sm">{asset.description}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Category</label>
            <p className="text-sm">{asset.category}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Asset Type</label>
            <p className="text-sm">{asset.assetType.replace('_', ' ')}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            <div className="mt-1">{getStatusBadge(asset.status)}</div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Condition</label>
            <div className="mt-1">{getConditionBadge(asset.condition)}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Lifecycle Stage</label>
            <p className="text-sm">{asset.lifecycleStage.replace('_', ' ')}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Created</label>
            <p className="text-sm">{formatDate(asset.createdAt)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderFinancialInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle>Financial Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Purchase Cost</label>
            <p className="text-sm font-medium">{formatCurrency(asset.purchaseCost)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Current Value</label>
            <p className="text-sm font-medium">{formatCurrency(asset.currentValue)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Salvage Value</label>
            <p className="text-sm">{formatCurrency(asset.salvageValue)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Useful Life</label>
            <p className="text-sm">{asset.usefulLife} years</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Depreciation Method</label>
            <p className="text-sm">{asset.depreciationMethod.replace('_', ' ')}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Purchase Date</label>
            <p className="text-sm">{formatDate(asset.purchaseDate)}</p>
          </div>
        </div>

        {asset.supplier && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Supplier</label>
              <p className="text-sm">{asset.supplier}</p>
            </div>
            {asset.invoiceNumber && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Invoice Number</label>
                <p className="text-sm">{asset.invoiceNumber}</p>
              </div>
            )}
          </div>
        )}

        {asset.warrantyPeriod && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Warranty Period</label>
            <p className="text-sm">{asset.warrantyPeriod} months</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderLocationInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle>Location & Assignment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Location</label>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              <p className="text-sm">{asset.location}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Department</label>
            <div className="flex items-center gap-1 mt-1">
              <Building className="h-3 w-3" />
              <p className="text-sm">{asset.department || 'Not assigned'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Assigned Employee</label>
            <div className="flex items-center gap-1 mt-1">
              <User className="h-3 w-3" />
              <p className="text-sm">{asset.assignedEmployee || 'Not assigned'}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Cost Center</label>
            <p className="text-sm">{asset.costCenter || 'Not assigned'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderTechnicalInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle>Technical Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Serial Number</label>
            <p className="text-sm">{asset.serialNumber || 'Not available'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Model</label>
            <p className="text-sm">{asset.model || 'Not available'}</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground">Manufacturer</label>
          <p className="text-sm">{asset.manufacturer || 'Not available'}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Barcode</label>
            <p className="text-sm font-mono">{asset.barcode || 'Not available'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">RFID Tag</label>
            <p className="text-sm font-mono">{asset.rfidTag || 'Not available'}</p>
          </div>
        </div>

        {asset.maintenanceInterval && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Maintenance Interval</label>
            <p className="text-sm">{asset.maintenanceInterval} days</p>
          </div>
        )}

        {asset.lastMaintenanceDate && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Maintenance</label>
              <p className="text-sm">{formatDate(asset.lastMaintenanceDate)}</p>
            </div>
            {asset.nextMaintenanceDate && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Next Maintenance</label>
                <p className="text-sm">{formatDate(asset.nextMaintenanceDate)}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderMaintenanceHistory = () => (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No maintenance history available</p>
          <p className="text-sm">Maintenance records will appear here</p>
        </div>
      </CardContent>
    </Card>
  );

  const renderDepreciationHistory = () => (
    <Card>
      <CardHeader>
        <CardTitle>Depreciation History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No depreciation history available</p>
          <p className="text-sm">Depreciation records will appear here</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{asset.name}</h2>
          <p className="text-muted-foreground">
            {asset.assetId} • {asset.category}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <QrCode className="h-4 w-4 mr-2" />
            Generate QR
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      {renderOverview()}

      {/* Main Content */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          {renderBasicInfo()}
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          {renderFinancialInfo()}
          {renderDepreciationHistory()}
        </TabsContent>

        <TabsContent value="location" className="space-y-4">
          {renderLocationInfo()}
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          {renderTechnicalInfo()}
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          {renderMaintenanceHistory()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
