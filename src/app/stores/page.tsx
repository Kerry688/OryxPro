'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Store, 
  MapPin,
  Phone,
  Mail,
  Users,
  TrendingUp,
  Package,
  MoreHorizontal,
  Clock,
  Settings,
  BarChart3,
  Loader2,
  Eye,
  Building2,
  Globe,
  CreditCard,
  Gift
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Store as StoreType } from '@/lib/models/store';
import { StoreForm } from '@/components/features/StoreForm';
import { StoreAnalytics } from '@/components/features/StoreAnalytics';

export default function StoresManagementPage() {
  const [stores, setStores] = useState<StoreType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState<StoreType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  // Fetch stores from database
  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/stores');
      if (response.ok) {
        const data = await response.json();
        setStores(data);
      } else {
        throw new Error('Failed to fetch stores');
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch stores',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter stores based on search
  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate metrics
  const totalStores = stores.length;
  const activeStores = stores.filter(s => s.isActive).length;
  const totalSales = stores.reduce((sum, store) => sum + (store.metrics?.totalSales || 0), 0);
  const totalCustomers = stores.reduce((sum, store) => sum + (store.metrics?.customerCount || 0), 0);

  const handleDeleteStore = async (storeId: string) => {
    try {
      const response = await fetch(`/api/stores/${storeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Store deleted successfully',
        });
        await fetchStores();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete store');
      }
    } catch (error) {
      console.error('Error deleting store:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete store',
        variant: 'destructive'
      });
    }
  };

  const getStoreTypeColor = (type: string) => {
    switch (type) {
      case 'retail': return 'bg-blue-100 text-blue-800';
      case 'wholesale': return 'bg-green-100 text-green-800';
      case 'online': return 'bg-purple-100 text-purple-800';
      case 'popup': return 'bg-orange-100 text-orange-800';
      case 'warehouse': return 'bg-gray-100 text-gray-800';
      case 'showroom': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStoreTypeIcon = (type: string) => {
    switch (type) {
      case 'retail': return <Store className="h-4 w-4" />;
      case 'wholesale': return <Package className="h-4 w-4" />;
      case 'online': return <Globe className="h-4 w-4" />;
      case 'popup': return <Building2 className="h-4 w-4" />;
      case 'warehouse': return <Package className="h-4 w-4" />;
      case 'showroom': return <Store className="h-4 w-4" />;
      default: return <Store className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Store Management</h1>
          <p className="text-muted-foreground">Manage your retail locations and online stores</p>
        </div>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Store
            </Button>
          </DialogTrigger>
          <DialogContent className="!max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedStore ? 'Edit Store' : 'Add New Store'}
              </DialogTitle>
              <DialogDescription>
                {selectedStore ? 'Update store information and settings' : 'Create a new store location'}
              </DialogDescription>
            </DialogHeader>
            <StoreForm 
              store={selectedStore} 
              onClose={() => {
                setIsEditDialogOpen(false);
                setSelectedStore(null);
              }}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                setSelectedStore(null);
                fetchStores();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStores}</div>
            <p className="text-xs text-muted-foreground">
              {activeStores} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all stores
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Customer base
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stores.length > 0 ? (totalSales / stores.reduce((sum, s) => sum + (s.metrics?.totalOrders || 0), 0)).toFixed(2) : '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Per order
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stores">Stores</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Store Activity
                </CardTitle>
                <CardDescription>
                  Latest updates from your stores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stores.slice(0, 5).map(store => (
                    <div key={store._id?.toString()} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{store.name}</h4>
                          <Badge className={getStoreTypeColor(store.type)}>
                            <div className="flex items-center gap-1">
                              {getStoreTypeIcon(store.type)}
                              {store.type}
                            </div>
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {store.address.city}, {store.address.state}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Sales: ${store.metrics?.totalSales?.toLocaleString() || '0'} • Orders: {store.metrics?.totalOrders || '0'}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Store Types Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Store Types Distribution
                </CardTitle>
                <CardDescription>
                  Breakdown by store type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['retail', 'wholesale', 'online', 'popup', 'warehouse', 'showroom'].map(type => {
                    const count = stores.filter(s => s.type === type).length;
                    const percentage = stores.length > 0 ? (count / stores.length) * 100 : 0;
                    
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStoreTypeIcon(type)}
                          <span className="capitalize">{type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-muted-foreground w-8">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stores">
          {/* Search */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Search Stores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search stores by name, code, city, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Stores List */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {filteredStores.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Store className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No stores found</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      {searchTerm ? 'No stores match your search criteria.' : 'Get started by creating your first store.'}
                    </p>
                    {!searchTerm && (
                      <Button onClick={() => setIsEditDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add First Store
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                filteredStores.map(store => (
                  <Card key={store._id?.toString()}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {store.name}
                              <Badge variant="outline">{store.code}</Badge>
                              <Badge className={getStoreTypeColor(store.type)}>
                                <div className="flex items-center gap-1">
                                  {getStoreTypeIcon(store.type)}
                                  {store.type}
                                </div>
                              </Badge>
                              {!store.isActive && (
                                <Badge variant="secondary">Inactive</Badge>
                              )}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-4 mt-1">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {store.address.city}, {store.address.state}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {store.staff.length} staff
                              </span>
                            </CardDescription>
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setSelectedStore(store);
                              setIsEditDialogOpen(true);
                            }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Store
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BarChart3 className="mr-2 h-4 w-4" />
                              View Analytics
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="mr-2 h-4 w-4" />
                              Store Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteStore(store._id?.toString() || '')}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{store.contact.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{store.contact.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">${store.metrics?.totalSales?.toLocaleString() || '0'} sales</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{store.metrics?.customerCount || '0'} customers</span>
                        </div>
                      </div>

                      {/* Store Features */}
                      <div className="mb-6">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Gift className="h-4 w-4" />
                          Features & Services
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {store.features.map(feature => (
                            <Badge key={feature} variant="outline">
                              {feature.replace('_', ' ')}
                            </Badge>
                          ))}
                          {store.services.map(service => (
                            <Badge key={service} variant="secondary">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Store Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold">${store.metrics?.totalSales?.toLocaleString() || '0'}</div>
                          <div className="text-sm text-muted-foreground">Total Sales</div>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold">{store.metrics?.totalOrders || '0'}</div>
                          <div className="text-sm text-muted-foreground">Total Orders</div>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold">${store.metrics?.averageOrderValue?.toFixed(2) || '0'}</div>
                          <div className="text-sm text-muted-foreground">Avg Order Value</div>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold">{store.metrics?.customerCount || '0'}</div>
                          <div className="text-sm text-muted-foreground">Customers</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <StoreAnalytics stores={stores} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
