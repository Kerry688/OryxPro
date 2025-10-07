'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Building2, 
  Plus, 
  Search,
  Edit,
  Eye,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  MapPin,
  User,
  DollarSign,
  FileText,
  Upload,
  Download,
  ArrowRight,
  ArrowLeft,
  Settings,
  Activity,
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  Package,
  Wrench,
  Truck,
  Users,
  Building,
  CreditCard,
  FileCheck,
  Archive
} from 'lucide-react';
import { 
  Asset,
  AssetAcquisition,
  AssetUsage,
  AssetDisposal,
  AssetDocument,
  AcquisitionType,
  UsageType,
  OperationalStatus,
  DisposalType,
  DocumentType,
  AssetLifecycleStage,
  AssetStatus
} from '@/lib/models/asset';

// Mock data
const mockAssets: Asset[] = [
  {
    _id: '1',
    assetId: 'AST-001',
    name: 'Industrial Printer HP LaserJet',
    description: 'High-speed laser printer for production floor',
    category: 'IT Equipment',
    assetType: 'it_equipment' as any,
    purchaseDate: new Date('2023-01-15'),
    purchaseCost: 25000,
    currentValue: 18000,
    supplier: 'HP Middle East',
    invoiceNumber: 'INV-2023-001',
    warrantyPeriod: 36,
    location: 'Production Floor A',
    department: 'Manufacturing',
    assignedEmployee: 'John Smith',
    costCenter: 'CC-001',
    serialNumber: 'HP123456789',
    model: 'LaserJet Pro 5000',
    manufacturer: 'HP',
    status: 'active' as any,
    condition: 'good' as any,
    lifecycleStage: 'operational' as any,
    depreciationMethod: 'straight_line' as any,
    usefulLife: 5,
    salvageValue: 2500,
    lastMaintenanceDate: new Date('2024-03-15'),
    nextMaintenanceDate: new Date('2024-06-15'),
    maintenanceInterval: 90,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-04-20'),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    _id: '2',
    assetId: 'AST-002',
    name: 'Delivery Van - Ford Transit',
    description: 'Company delivery vehicle',
    category: 'Vehicles',
    assetType: 'vehicle' as any,
    purchaseDate: new Date('2022-06-01'),
    purchaseCost: 45000,
    currentValue: 28000,
    supplier: 'Ford Egypt',
    invoiceNumber: 'INV-2022-045',
    warrantyPeriod: 24,
    location: 'Fleet Garage',
    department: 'Logistics',
    assignedEmployee: 'Ahmed Hassan',
    costCenter: 'CC-002',
    serialNumber: 'VIN123456789',
    model: 'Transit 350',
    manufacturer: 'Ford',
    status: 'active' as any,
    condition: 'good' as any,
    lifecycleStage: 'operational' as any,
    depreciationMethod: 'straight_line' as any,
    usefulLife: 8,
    salvageValue: 5000,
    lastMaintenanceDate: new Date('2024-04-01'),
    nextMaintenanceDate: new Date('2024-07-01'),
    maintenanceInterval: 90,
    createdAt: new Date('2022-06-01'),
    updatedAt: new Date('2024-04-20'),
    createdBy: 'admin',
    updatedBy: 'admin'
  }
];

const mockAcquisitions: AssetAcquisition[] = [
  {
    id: '1',
    assetId: 'AST-001',
    acquisitionType: AcquisitionType.PURCHASE,
    acquisitionDate: new Date('2023-01-15'),
    supplier: 'HP Middle East',
    supplierContact: 'sales@hp-me.com',
    purchaseOrderNumber: 'PO-2023-001',
    invoiceNumber: 'INV-2023-001',
    purchaseCost: 25000,
    additionalCosts: 1500,
    totalCost: 26500,
    commissioningDate: new Date('2023-01-20'),
    commissioningEngineer: 'Technical Team',
    commissioningNotes: 'Installation completed successfully, all tests passed',
    acceptanceTestsPassed: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-20'),
    createdBy: 'admin',
    updatedBy: 'admin'
  }
];

const mockUsage: AssetUsage[] = [
  {
    id: '1',
    assetId: 'AST-001',
    assignedEmployee: 'emp-001',
    assignedEmployeeName: 'John Smith',
    assignedDepartment: 'Manufacturing',
    assignedCostCenter: 'CC-001',
    currentLocation: 'Production Floor A',
    usageStartDate: new Date('2023-01-20'),
    usageType: UsageType.OPERATIONAL,
    utilizationRate: 85,
    operationalStatus: OperationalStatus.RUNNING,
    isAvailable: true,
    hoursOperated: 2840,
    cyclesCompleted: 15600,
    outputProduced: 125000,
    efficiencyRating: 92,
    createdAt: new Date('2023-01-20'),
    updatedAt: new Date('2024-04-20'),
    createdBy: 'admin',
    updatedBy: 'admin'
  }
];

const mockDisposals: AssetDisposal[] = [
  {
    id: '1',
    assetId: 'AST-003',
    disposalType: DisposalType.SALE,
    disposalDate: new Date('2024-02-15'),
    disposalValue: 5000,
    disposalCosts: 200,
    netDisposalValue: 4800,
    buyer: 'ABC Electronics',
    buyerContact: 'contact@abcelectronics.com',
    disposalReason: 'Asset replacement due to obsolescence',
    disposalMethod: 'Direct sale to electronics dealer',
    disposalLocation: 'Company warehouse',
    disposalCompany: 'ABC Electronics',
    disposalCertificate: 'DIS-2024-001',
    environmentalCompliance: true,
    approvedBy: 'Finance Manager',
    approvedDate: new Date('2024-02-10'),
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
    createdBy: 'admin',
    updatedBy: 'admin'
  }
];

export function AssetLifecycleTracking() {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [acquisitions, setAcquisitions] = useState<AssetAcquisition[]>(mockAcquisitions);
  const [usage, setUsage] = useState<AssetUsage[]>(mockUsage);
  const [disposals, setDisposals] = useState<AssetDisposal[]>(mockDisposals);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedAcquisition, setSelectedAcquisition] = useState<AssetAcquisition | null>(null);
  const [selectedUsage, setSelectedUsage] = useState<AssetUsage | null>(null);
  const [selectedDisposal, setSelectedDisposal] = useState<AssetDisposal | null>(null);
  const [isAcquisitionDialogOpen, setIsAcquisitionDialogOpen] = useState(false);
  const [isUsageDialogOpen, setIsUsageDialogOpen] = useState(false);
  const [isDisposalDialogOpen, setIsDisposalDialogOpen] = useState(false);
  const [isViewAssetDialogOpen, setIsViewAssetDialogOpen] = useState(false);

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.serialNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLifecycleStageBadge = (stage: AssetLifecycleStage) => {
    const configs = {
      [AssetLifecycleStage.ACQUISITION]: { color: 'bg-blue-100 text-blue-800', text: 'Acquisition' },
      [AssetLifecycleStage.COMMISSIONING]: { color: 'bg-yellow-100 text-yellow-800', text: 'Commissioning' },
      [AssetLifecycleStage.OPERATIONAL]: { color: 'bg-green-100 text-green-800', text: 'Operational' },
      [AssetLifecycleStage.MAINTENANCE]: { color: 'bg-orange-100 text-orange-800', text: 'Maintenance' },
      [AssetLifecycleStage.RETIREMENT]: { color: 'bg-gray-100 text-gray-800', text: 'Retirement' },
      [AssetLifecycleStage.DISPOSAL]: { color: 'bg-red-100 text-red-800', text: 'Disposal' }
    };

    const config = configs[stage];
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  const getStatusBadge = (status: AssetStatus) => {
    const configs = {
      [AssetStatus.ACTIVE]: { color: 'bg-green-100 text-green-800', text: 'Active' },
      [AssetStatus.INACTIVE]: { color: 'bg-gray-100 text-gray-800', text: 'Inactive' },
      [AssetStatus.UNDER_MAINTENANCE]: { color: 'bg-orange-100 text-orange-800', text: 'Maintenance' },
      [AssetStatus.DISPOSED]: { color: 'bg-red-100 text-red-800', text: 'Disposed' },
      [AssetStatus.LOST]: { color: 'bg-red-100 text-red-800', text: 'Lost' },
      [AssetStatus.STOLEN]: { color: 'bg-red-100 text-red-800', text: 'Stolen' },
      [AssetStatus.RETIRED]: { color: 'bg-gray-100 text-gray-800', text: 'Retired' }
    };

    const config = configs[status];
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  const getAcquisitionTypeBadge = (type: AcquisitionType) => {
    const configs = {
      [AcquisitionType.PURCHASE]: { color: 'bg-green-100 text-green-800', text: 'Purchase' },
      [AcquisitionType.LEASE]: { color: 'bg-blue-100 text-blue-800', text: 'Lease' },
      [AcquisitionType.DONATION]: { color: 'bg-purple-100 text-purple-800', text: 'Donation' },
      [AcquisitionType.TRANSFER]: { color: 'bg-orange-100 text-orange-800', text: 'Transfer' },
      [AcquisitionType.CONSTRUCTION]: { color: 'bg-yellow-100 text-yellow-800', text: 'Construction' },
      [AcquisitionType.DEVELOPMENT]: { color: 'bg-cyan-100 text-cyan-800', text: 'Development' }
    };

    const config = configs[type];
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  const getDisposalTypeBadge = (type: DisposalType) => {
    const configs = {
      [DisposalType.SALE]: { color: 'bg-green-100 text-green-800', text: 'Sale' },
      [DisposalType.DONATION]: { color: 'bg-purple-100 text-purple-800', text: 'Donation' },
      [DisposalType.SCRAPPING]: { color: 'bg-gray-100 text-gray-800', text: 'Scrapping' },
      [DisposalType.DESTRUCTION]: { color: 'bg-red-100 text-red-800', text: 'Destruction' },
      [DisposalType.TRADE_IN]: { color: 'bg-blue-100 text-blue-800', text: 'Trade-in' },
      [DisposalType.TRANSFER]: { color: 'bg-orange-100 text-orange-800', text: 'Transfer' },
      [DisposalType.RETIREMENT]: { color: 'bg-gray-100 text-gray-800', text: 'Retirement' }
    };

    const config = configs[type];
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  const totalAssets = assets.length;
  const operationalAssets = assets.filter(a => a.lifecycleStage === AssetLifecycleStage.OPERATIONAL).length;
  const assetsUnderMaintenance = assets.filter(a => a.status === AssetStatus.UNDER_MAINTENANCE).length;
  const disposedAssets = assets.filter(a => a.status === AssetStatus.DISPOSED).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Asset Lifecycle Tracking</h2>
          <p className="text-muted-foreground">Track assets from acquisition to disposal</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={() => setIsAcquisitionDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Acquisition
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssets}</div>
            <p className="text-xs text-muted-foreground">
              All lifecycle stages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operational</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operationalAssets}</div>
            <p className="text-xs text-muted-foreground">
              Currently in use
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assetsUnderMaintenance}</div>
            <p className="text-xs text-muted-foreground">
              Requiring service
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disposed</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{disposedAssets}</div>
            <p className="text-xs text-muted-foreground">
              End of lifecycle
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="acquisition">Acquisition</TabsTrigger>
          <TabsTrigger value="usage">Usage & Operations</TabsTrigger>
          <TabsTrigger value="disposal">Disposal</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Asset Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Asset Lifecycle Overview</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search assets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium">Asset</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Location</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Lifecycle Stage</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Current Value</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAssets.map((asset) => (
                        <tr key={asset._id} className="border-b">
                          <td className="p-4">
                            <div>
                              <div className="font-medium">{asset.name}</div>
                              <div className="text-sm text-muted-foreground">{asset.assetId}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">{asset.category}</div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span className="text-sm">{asset.location}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            {getLifecycleStageBadge(asset.lifecycleStage)}
                          </td>
                          <td className="p-4">
                            {getStatusBadge(asset.status)}
                          </td>
                          <td className="p-4">
                            <div className="text-sm font-medium">
                              EGP {asset.currentValue.toLocaleString()}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedAsset(asset);
                                  setIsViewAssetDialogOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="acquisition" className="space-y-6">
          {/* Asset Acquisition */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Asset Acquisitions</CardTitle>
                <Button onClick={() => setIsAcquisitionDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Acquisition
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {acquisitions.map((acquisition) => (
                  <div key={acquisition.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">Asset {acquisition.assetId}</h4>
                        <p className="text-sm text-muted-foreground">
                          {acquisition.acquisitionDate.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            EGP {acquisition.totalCost.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {acquisition.supplier}
                          </div>
                        </div>
                        {getAcquisitionTypeBadge(acquisition.acquisitionType)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Purchase Cost</div>
                        <div className="font-medium">EGP {acquisition.purchaseCost.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Additional Costs</div>
                        <div className="font-medium">EGP {acquisition.additionalCosts?.toLocaleString() || '0'}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Commissioning</div>
                        <div className="font-medium">
                          {acquisition.acceptanceTestsPassed ? 'Passed' : 'Pending'}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Invoice</div>
                        <div className="font-medium">{acquisition.invoiceNumber}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          {/* Asset Usage & Operations */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Asset Usage & Operations</CardTitle>
                <Button onClick={() => setIsUsageDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Assign Asset
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usage.map((usageRecord) => (
                  <div key={usageRecord.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">Asset {usageRecord.assetId}</h4>
                        <p className="text-sm text-muted-foreground">
                          Assigned to {usageRecord.assignedEmployeeName}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {usageRecord.utilizationRate}% Utilization
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {usageRecord.operationalStatus}
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">
                          {usageRecord.usageType}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Department</div>
                        <div className="font-medium">{usageRecord.assignedDepartment}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Location</div>
                        <div className="font-medium">{usageRecord.currentLocation}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Hours Operated</div>
                        <div className="font-medium">{usageRecord.hoursOperated?.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Efficiency</div>
                        <div className="font-medium">{usageRecord.efficiencyRating}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disposal" className="space-y-6">
          {/* Asset Disposal */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Asset Disposals</CardTitle>
                <Button onClick={() => setIsDisposalDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Disposal
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {disposals.map((disposal) => (
                  <div key={disposal.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">Asset {disposal.assetId}</h4>
                        <p className="text-sm text-muted-foreground">
                          Disposed on {disposal.disposalDate.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            EGP {disposal.netDisposalValue.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Net disposal value
                          </div>
                        </div>
                        {getDisposalTypeBadge(disposal.disposalType)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Disposal Value</div>
                        <div className="font-medium">EGP {disposal.disposalValue.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Disposal Costs</div>
                        <div className="font-medium">EGP {disposal.disposalCosts?.toLocaleString() || '0'}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Buyer</div>
                        <div className="font-medium">{disposal.buyer || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Approved By</div>
                        <div className="font-medium">{disposal.approvedBy || 'Pending'}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Acquisition Dialog */}
      <Dialog open={isAcquisitionDialogOpen} onOpenChange={setIsAcquisitionDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Asset Acquisition</DialogTitle>
            <DialogDescription>
              Record a new asset acquisition
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assetId">Asset ID</Label>
                <Input id="assetId" placeholder="AST-001" />
              </div>
              <div>
                <Label htmlFor="acquisitionType">Acquisition Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={AcquisitionType.PURCHASE}>Purchase</SelectItem>
                    <SelectItem value={AcquisitionType.LEASE}>Lease</SelectItem>
                    <SelectItem value={AcquisitionType.DONATION}>Donation</SelectItem>
                    <SelectItem value={AcquisitionType.TRANSFER}>Transfer</SelectItem>
                    <SelectItem value={AcquisitionType.CONSTRUCTION}>Construction</SelectItem>
                    <SelectItem value={AcquisitionType.DEVELOPMENT}>Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="acquisitionDate">Acquisition Date</Label>
                <Input id="acquisitionDate" type="date" />
              </div>
              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Input id="supplier" placeholder="Supplier name" />
              </div>
              <div>
                <Label htmlFor="purchaseCost">Purchase Cost</Label>
                <Input id="purchaseCost" type="number" placeholder="0.00" />
              </div>
              <div>
                <Label htmlFor="additionalCosts">Additional Costs</Label>
                <Input id="additionalCosts" type="number" placeholder="0.00" />
              </div>
              <div>
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input id="invoiceNumber" placeholder="INV-2024-001" />
              </div>
              <div>
                <Label htmlFor="purchaseOrderNumber">Purchase Order</Label>
                <Input id="purchaseOrderNumber" placeholder="PO-2024-001" />
              </div>
            </div>
            <div>
              <Label htmlFor="commissioningNotes">Commissioning Notes</Label>
              <Textarea id="commissioningNotes" placeholder="Installation and commissioning details..." />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAcquisitionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAcquisitionDialogOpen(false)}>
              Record Acquisition
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Usage Assignment Dialog */}
      <Dialog open={isUsageDialogOpen} onOpenChange={setIsUsageDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign Asset</DialogTitle>
            <DialogDescription>
              Assign an asset to an employee or department
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assetSelect">Select Asset</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {assets.filter(a => a.status === AssetStatus.ACTIVE).map((asset) => (
                      <SelectItem key={asset._id} value={asset.assetId}>
                        {asset.name} ({asset.assetId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="assignedEmployee">Assigned Employee</Label>
                <Input id="assignedEmployee" placeholder="Employee name" />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input id="department" placeholder="Department" />
              </div>
              <div>
                <Label htmlFor="costCenter">Cost Center</Label>
                <Input id="costCenter" placeholder="Cost center" />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Current location" />
              </div>
              <div>
                <Label htmlFor="usageType">Usage Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select usage type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UsageType.OPERATIONAL}>Operational</SelectItem>
                    <SelectItem value={UsageType.STANDBY}>Standby</SelectItem>
                    <SelectItem value={UsageType.MAINTENANCE}>Maintenance</SelectItem>
                    <SelectItem value={UsageType.TESTING}>Testing</SelectItem>
                    <SelectItem value={UsageType.DEMO}>Demo</SelectItem>
                    <SelectItem value={UsageType.STORAGE}>Storage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUsageDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsUsageDialogOpen(false)}>
              Assign Asset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Disposal Dialog */}
      <Dialog open={isDisposalDialogOpen} onOpenChange={setIsDisposalDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Asset Disposal</DialogTitle>
            <DialogDescription>
              Record asset disposal or retirement
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="disposalAssetSelect">Select Asset</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {assets.filter(a => a.status !== AssetStatus.DISPOSED).map((asset) => (
                      <SelectItem key={asset._id} value={asset.assetId}>
                        {asset.name} ({asset.assetId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="disposalType">Disposal Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select disposal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={DisposalType.SALE}>Sale</SelectItem>
                    <SelectItem value={DisposalType.DONATION}>Donation</SelectItem>
                    <SelectItem value={DisposalType.SCRAPPING}>Scrapping</SelectItem>
                    <SelectItem value={DisposalType.DESTRUCTION}>Destruction</SelectItem>
                    <SelectItem value={DisposalType.TRADE_IN}>Trade-in</SelectItem>
                    <SelectItem value={DisposalType.TRANSFER}>Transfer</SelectItem>
                    <SelectItem value={DisposalType.RETIREMENT}>Retirement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="disposalDate">Disposal Date</Label>
                <Input id="disposalDate" type="date" />
              </div>
              <div>
                <Label htmlFor="disposalValue">Disposal Value</Label>
                <Input id="disposalValue" type="number" placeholder="0.00" />
              </div>
              <div>
                <Label htmlFor="buyer">Buyer/Recipient</Label>
                <Input id="buyer" placeholder="Buyer or recipient name" />
              </div>
              <div>
                <Label htmlFor="disposalCosts">Disposal Costs</Label>
                <Input id="disposalCosts" type="number" placeholder="0.00" />
              </div>
            </div>
            <div>
              <Label htmlFor="disposalReason">Disposal Reason</Label>
              <Textarea id="disposalReason" placeholder="Reason for disposal..." />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDisposalDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsDisposalDialogOpen(false)}>
              Record Disposal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
