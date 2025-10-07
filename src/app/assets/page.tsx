'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  QrCode,
  BarChart3,
  Wrench,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  User,
  Building,
  Settings,
  TrendingUp
} from 'lucide-react';
import { AssetRegistry } from '@/components/assets/AssetRegistry';
import { AssetCategories } from '@/components/assets/AssetCategories';
import { DepreciationManagement } from '@/components/assets/DepreciationManagement';
import { MaintenanceScheduling } from '@/components/assets/MaintenanceScheduling';
import { MaintenanceTracking } from '@/components/assets/MaintenanceTracking';
import { SparePartsInventory } from '@/components/assets/SparePartsInventory';
import { AssetAnalytics } from '@/components/assets/AssetAnalytics';
import { AssetLifecycleTracking } from '@/components/assets/AssetLifecycleTracking';
import { AssetReportingDashboards } from '@/components/assets/AssetReportingDashboards';

export default function AssetsPage() {
  const [activeTab, setActiveTab] = useState('registry');
  const [searchTerm, setSearchTerm] = useState('');
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load assets data
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call to fetch assets
      // const response = await fetch('/api/assets');
      // const data = await response.json();
      // setAssets(data);
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // TODO: Implement search functionality
  };

  const renderOverviewCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,234</div>
          <p className="text-xs text-muted-foreground">
            +12% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Asset Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$2,456,789</div>
          <p className="text-xs text-muted-foreground">
            +8% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Maintenance Due</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">23</div>
          <p className="text-xs text-muted-foreground">
            Overdue: 5 items
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">94%</div>
          <p className="text-xs text-muted-foreground">
            +2% from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderQuickActions = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <Plus className="h-6 w-6" />
            <span>Add Asset</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <QrCode className="h-6 w-6" />
            <span>Scan Barcode</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <Wrench className="h-6 w-6" />
            <span>Create Work Order</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <Calendar className="h-6 w-6" />
            <span>Schedule Maintenance</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderAlerts = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Alerts & Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="font-medium">5 Assets Overdue for Maintenance</p>
                <p className="text-sm text-gray-600">Critical maintenance tasks are overdue</p>
              </div>
            </div>
            <Button variant="outline" size="sm">View Details</Button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">12 Assets Due This Week</p>
                <p className="text-sm text-gray-600">Preventive maintenance scheduled</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Schedule</Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="font-medium">3 Assets Under Maintenance</p>
                <p className="text-sm text-gray-600">Assets currently out of service</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Track Progress</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Asset Management</h1>
          <p className="text-muted-foreground">
            Manage your company's assets, maintenance, and lifecycle tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      {renderOverviewCards()}

      {/* Quick Actions */}
      {renderQuickActions()}

      {/* Alerts */}
      {renderAlerts()}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="registry" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Registry
          </TabsTrigger>
          <TabsTrigger value="lifecycle" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Lifecycle
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="depreciation" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Depreciation
          </TabsTrigger>
          <TabsTrigger value="maintenance-schedule" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Maintenance
          </TabsTrigger>
          <TabsTrigger value="work-orders" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Work Orders
          </TabsTrigger>
          <TabsTrigger value="spare-parts" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Spare Parts
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="registry" className="mt-6">
          <AssetRegistry />
        </TabsContent>

        <TabsContent value="lifecycle" className="mt-6">
          <AssetLifecycleTracking />
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <AssetCategories />
        </TabsContent>

        <TabsContent value="depreciation" className="mt-6">
          <DepreciationManagement />
        </TabsContent>

        <TabsContent value="maintenance-schedule" className="mt-6">
          <MaintenanceScheduling />
        </TabsContent>

        <TabsContent value="work-orders" className="mt-6">
          <MaintenanceTracking />
        </TabsContent>

        <TabsContent value="spare-parts" className="mt-6">
          <SparePartsInventory />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <AssetReportingDashboards />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <AssetAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
