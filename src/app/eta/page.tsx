'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  FileText, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Users,
  DollarSign,
  Package,
  Settings,
  Download,
  Upload
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ETAPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    syncedProducts: 0,
    pendingProducts: 0,
    totalInvoices: 0,
    syncedInvoices: 0,
    pendingInvoices: 0,
    rejectedInvoices: 0,
    totalRevenue: 0
  });

  // Fetch ETA statistics
  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch products stats
      const productsResponse = await fetch('/api/eta/products');
      const productsData = await productsResponse.json();
      
      // Fetch invoices stats
      const invoicesResponse = await fetch('/api/eta/invoices');
      const invoicesData = await invoicesResponse.json();
      
      if (productsData.success && invoicesData.success) {
        const products = productsData.data || [];
        const invoices = invoicesData.data || [];
        
        const syncedProducts = products.filter(p => p.syncStatus === 'success').length;
        const pendingProducts = products.filter(p => p.syncStatus === 'pending').length;
        
        const syncedInvoices = invoices.filter(i => i.syncStatus === 'success').length;
        const pendingInvoices = invoices.filter(i => i.syncStatus === 'pending').length;
        const rejectedInvoices = invoices.filter(i => i.status === 'rejected').length;
        
        const totalRevenue = invoices
          .filter(i => i.syncStatus === 'success')
          .reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);
        
        setStats({
          totalProducts: products.length,
          syncedProducts,
          pendingProducts,
          totalInvoices: invoices.length,
          syncedInvoices,
          pendingInvoices,
          rejectedInvoices,
          totalRevenue
        });
      }
    } catch (error) {
      console.error('Error fetching ETA stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch ETA statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Sync all pending items
  const syncAllPending = async () => {
    try {
      toast({
        title: "Sync Started",
        description: "Syncing all pending items with ETA...",
      });

      // Sync products
      const productsResponse = await fetch('/api/eta/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityType: 'product' })
      });
      
      // Sync invoices
      const invoicesResponse = await fetch('/api/eta/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityType: 'invoice' })
      });

      const productsResult = await productsResponse.json();
      const invoicesResult = await invoicesResponse.json();

      if (productsResult.success && invoicesResult.success) {
        toast({
          title: "Sync Completed",
          description: `Products: ${productsResult.data.syncedCount} synced, ${productsResult.data.failedCount} failed. Invoices: ${invoicesResult.data.syncedCount} synced, ${invoicesResult.data.failedCount} failed.`,
        });
        fetchStats(); // Refresh stats
      } else {
        toast({
          title: "Sync Error",
          description: "Some items failed to sync. Check the logs for details.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error syncing with ETA:', error);
      toast({
        title: "Sync Error",
        description: "Failed to sync with ETA. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, description }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    description?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Egyptian Tax Authority (ETA)</h1>
          <p className="text-muted-foreground">
            Manage ETA compliance, sync products with EGS codes, and submit sales invoices
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={fetchStats}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={syncAllPending}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync All Pending
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          color="bg-blue-500"
          description="Products registered with ETA"
        />
        <StatCard
          title="Synced Products"
          value={stats.syncedProducts}
          icon={CheckCircle}
          color="bg-green-500"
          description={`${stats.pendingProducts} pending`}
        />
        <StatCard
          title="Total Invoices"
          value={stats.totalInvoices}
          icon={FileText}
          color="bg-purple-500"
          description="Invoices submitted to ETA"
        />
        <StatCard
          title="Synced Invoices"
          value={stats.syncedInvoices}
          icon={TrendingUp}
          color="bg-orange-500"
          description={`${stats.pendingInvoices} pending, ${stats.rejectedInvoices} rejected`}
        />
      </div>

      {/* Revenue and Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Revenue Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              EGP {stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Total revenue from synced invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Sync Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Products Sync Rate</span>
                <Badge variant={stats.totalProducts > 0 && stats.syncedProducts / stats.totalProducts > 0.8 ? "default" : "destructive"}>
                  {stats.totalProducts > 0 ? Math.round((stats.syncedProducts / stats.totalProducts) * 100) : 0}%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Invoices Sync Rate</span>
                <Badge variant={stats.totalInvoices > 0 && stats.syncedInvoices / stats.totalInvoices > 0.8 ? "default" : "destructive"}>
                  {stats.totalInvoices > 0 ? Math.round((stats.syncedInvoices / stats.totalInvoices) * 100) : 0}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="sync">Sync Logs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common ETA management tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Product Catalog
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download ETA Reports
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure ETA Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest ETA synchronization activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Products synced successfully</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Invoice submission pending</p>
                      <p className="text-xs text-muted-foreground">5 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Product validation failed</p>
                      <p className="text-xs text-muted-foreground">10 minutes ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>
                Manage products and their EGS codes for ETA compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Product Management</h3>
                <p className="text-muted-foreground mb-4">
                  Manage your product catalog and EGS codes for ETA compliance
                </p>
                <Button>
                  <Package className="h-4 w-4 mr-2" />
                  Go to Products
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Management</CardTitle>
              <CardDescription>
                Submit and track sales invoices with ETA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Invoice Management</h3>
                <p className="text-muted-foreground mb-4">
                  Submit sales invoices to ETA and track their status
                </p>
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Go to Invoices
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sync">
          <Card>
            <CardHeader>
              <CardTitle>Sync Logs</CardTitle>
              <CardDescription>
                View synchronization logs and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <RefreshCw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sync Logs</h3>
                <p className="text-muted-foreground mb-4">
                  Monitor synchronization activities and troubleshoot issues
                </p>
                <Button>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  View Sync Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>ETA Settings</CardTitle>
              <CardDescription>
                Configure ETA integration settings and API credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">ETA Settings</h3>
                <p className="text-muted-foreground mb-4">
                  Configure your ETA integration settings and API credentials
                </p>
                <Button>
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
