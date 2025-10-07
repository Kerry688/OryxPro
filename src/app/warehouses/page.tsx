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
  Warehouse, 
  MapPin,
  Phone,
  Mail,
  Package,
  TrendingUp,
  MoreHorizontal,
  Clock,
  Settings,
  BarChart3,
  Loader2,
  Eye,
  Building2,
  Users,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Warehouse as WarehouseType } from '@/lib/models/warehouse';
import { WarehouseForm } from '@/components/features/WarehouseForm';

export default function WarehousesManagementPage() {
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  // Fetch warehouses from database
  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/warehouses');
      if (response.ok) {
        const data = await response.json();
        setWarehouses(data);
      } else {
        throw new Error('Failed to fetch warehouses');
      }
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch warehouses',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter warehouses based on search
  const filteredWarehouses = warehouses.filter(warehouse =>
    warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate metrics
  const totalWarehouses = warehouses.length;
  const activeWarehouses = warehouses.filter(w => w.isActive).length;
  const totalCapacity = warehouses.reduce((sum, warehouse) => sum + warehouse.capacity, 0);
  const usedCapacity = warehouses.reduce((sum, warehouse) => sum + (warehouse.currentCapacity || 0), 0);
  const capacityUtilization = totalCapacity > 0 ? (usedCapacity / totalCapacity) * 100 : 0;

  const handleDeleteWarehouse = async (warehouseId: string) => {
    try {
      const response = await fetch(`/api/warehouses/${warehouseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Warehouse deleted successfully',
        });
        await fetchWarehouses();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete warehouse');
      }
    } catch (error) {
      console.error('Error deleting warehouse:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete warehouse',
        variant: 'destructive'
      });
    }
  };

  const getWarehouseTypeColor = (type: string) => {
    switch (type) {
      case 'main': return 'bg-blue-100 text-blue-800';
      case 'storage': return 'bg-green-100 text-green-800';
      case 'retail': return 'bg-purple-100 text-purple-800';
      case 'distribution': return 'bg-orange-100 text-orange-800';
      case 'cold_storage': return 'bg-cyan-100 text-cyan-800';
      case 'hazardous': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWarehouseTypeIcon = (type: string) => {
    switch (type) {
      case 'main': return <Warehouse className="h-4 w-4" />;
      case 'storage': return <Package className="h-4 w-4" />;
      case 'retail': return <Building2 className="h-4 w-4" />;
      case 'distribution': return <TrendingUp className="h-4 w-4" />;
      case 'cold_storage': return <Package className="h-4 w-4" />;
      case 'hazardous': return <AlertTriangle className="h-4 w-4" />;
      default: return <Warehouse className="h-4 w-4" />;
    }
  };

  const getCapacityUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-600';
    if (utilization >= 75) return 'text-orange-600';
    if (utilization >= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Warehouse Management</h1>
          <p className="text-muted-foreground">Manage your warehouses and storage facilities</p>
        </div>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Warehouse
            </Button>
          </DialogTrigger>
          <DialogContent className="!max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}
              </DialogTitle>
              <DialogDescription>
                {selectedWarehouse ? 'Update warehouse information and settings' : 'Create a new warehouse facility'}
              </DialogDescription>
            </DialogHeader>
            <WarehouseForm 
              warehouse={selectedWarehouse} 
              onClose={() => {
                setIsEditDialogOpen(false);
                setSelectedWarehouse(null);
              }}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                setSelectedWarehouse(null);
                fetchWarehouses();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Warehouses</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWarehouses}</div>
            <p className="text-xs text-muted-foreground">
              {activeWarehouses} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCapacity.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Cubic meters
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capacity Utilization</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getCapacityUtilizationColor(capacityUtilization)}`}>
              {capacityUtilization.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {usedCapacity.toLocaleString()} / {totalCapacity.toLocaleString()} used
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Utilization</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {warehouses.filter(w => ((w.currentCapacity || 0) / w.capacity) >= 0.9).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Warehouses at 90%+ capacity
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Warehouse Activity
                </CardTitle>
                <CardDescription>
                  Latest updates from your warehouses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {warehouses.slice(0, 5).map(warehouse => {
                    const utilization = ((warehouse.currentCapacity || 0) / warehouse.capacity) * 100;
                    return (
                      <div key={warehouse._id?.toString()} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{warehouse.name}</h4>
                            <Badge className={getWarehouseTypeColor(warehouse.type)}>
                              <div className="flex items-center gap-1">
                                {getWarehouseTypeIcon(warehouse.type)}
                                {warehouse.type.replace('_', ' ')}
                              </div>
                            </Badge>
                            {!warehouse.isActive && (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {warehouse.city}, {warehouse.state}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Manager: {warehouse.manager} • Capacity: {warehouse.currentCapacity || 0} / {warehouse.capacity}
                          </p>
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${utilization >= 90 ? 'bg-red-600' : utilization >= 75 ? 'bg-orange-600' : utilization >= 50 ? 'bg-yellow-600' : 'bg-green-600'}`}
                                style={{ width: `${Math.min(utilization, 100)}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {utilization.toFixed(1)}% utilized
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Warehouse Types Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Warehouse Types Distribution
                </CardTitle>
                <CardDescription>
                  Breakdown by warehouse type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['main', 'storage', 'retail', 'distribution', 'cold_storage', 'hazardous'].map(type => {
                    const count = warehouses.filter(w => w.type === type).length;
                    const percentage = warehouses.length > 0 ? (count / warehouses.length) * 100 : 0;
                    const totalCapacity = warehouses.filter(w => w.type === type).reduce((sum, w) => sum + w.capacity, 0);
                    
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getWarehouseTypeIcon(type)}
                          <span className="capitalize">{type.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-semibold">{count}</div>
                            <div className="text-xs text-muted-foreground">{totalCapacity.toLocaleString()} m³</div>
                          </div>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="warehouses">
          {/* Search */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Search Warehouses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search warehouses by name, code, city, manager, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Warehouses List */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {filteredWarehouses.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Warehouse className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No warehouses found</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      {searchTerm ? 'No warehouses match your search criteria.' : 'Get started by creating your first warehouse.'}
                    </p>
                    {!searchTerm && (
                      <Button onClick={() => setIsEditDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add First Warehouse
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                filteredWarehouses.map(warehouse => {
                  const utilization = ((warehouse.currentCapacity || 0) / warehouse.capacity) * 100;
                  return (
                    <Card key={warehouse._id?.toString()}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div>
                              <CardTitle className="flex items-center gap-2">
                                {warehouse.name}
                                <Badge variant="outline">{warehouse.code}</Badge>
                                <Badge className={getWarehouseTypeColor(warehouse.type)}>
                                  <div className="flex items-center gap-1">
                                    {getWarehouseTypeIcon(warehouse.type)}
                                    {warehouse.type.replace('_', ' ')}
                                  </div>
                                </Badge>
                                {!warehouse.isActive && (
                                  <Badge variant="secondary">Inactive</Badge>
                                )}
                                {utilization >= 90 && (
                                  <Badge variant="destructive">High Utilization</Badge>
                                )}
                              </CardTitle>
                              <CardDescription className="flex items-center gap-4 mt-1">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {warehouse.city}, {warehouse.state}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {warehouse.manager}
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
                                setSelectedWarehouse(warehouse);
                                setIsEditDialogOpen(true);
                              }}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Warehouse
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
                                Warehouse Settings
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteWarehouse(warehouse._id?.toString() || '')}
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
                            <span className="text-sm">{warehouse.phone || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{warehouse.email || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{warehouse.currentCapacity || 0} / {warehouse.capacity} used</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{utilization.toFixed(1)}% utilized</span>
                          </div>
                        </div>

                        {/* Capacity Utilization */}
                        <div className="mb-6">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Capacity Utilization
                          </h4>
                          <div className="w-full bg-gray-200 rounded-full h-4">
                            <div 
                              className={`h-4 rounded-full ${utilization >= 90 ? 'bg-red-600' : utilization >= 75 ? 'bg-orange-600' : utilization >= 50 ? 'bg-yellow-600' : 'bg-green-600'}`}
                              style={{ width: `${Math.min(utilization, 100)}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-sm text-muted-foreground mt-2">
                            <span>0%</span>
                            <span className="font-semibold">{utilization.toFixed(1)}% utilized</span>
                            <span>100%</span>
                          </div>
                        </div>

                        {/* Warehouse Features */}
                        {warehouse.features && warehouse.features.length > 0 && (
                          <div className="mb-6">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <Settings className="h-4 w-4" />
                              Features
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {warehouse.features.map(feature => (
                                <Badge key={feature} variant="outline">
                                  {feature.replace('_', ' ')}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Warehouse Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="p-4 bg-muted rounded-lg">
                            <div className="text-2xl font-bold">{warehouse.capacity.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">Total Capacity (m³)</div>
                          </div>
                          <div className="p-4 bg-muted rounded-lg">
                            <div className="text-2xl font-bold">{warehouse.currentCapacity || 0}</div>
                            <div className="text-sm text-muted-foreground">Used Capacity (m³)</div>
                          </div>
                          <div className="p-4 bg-muted rounded-lg">
                            <div className={`text-2xl font-bold ${getCapacityUtilizationColor(utilization)}`}>
                              {utilization.toFixed(1)}%
                            </div>
                            <div className="text-sm text-muted-foreground">Utilization</div>
                          </div>
                          <div className="p-4 bg-muted rounded-lg">
                            <div className="text-2xl font-bold">
                              {warehouse.isActive ? (
                                <CheckCircle className="h-6 w-6 text-green-600 mx-auto" />
                              ) : (
                                <AlertTriangle className="h-6 w-6 text-red-600 mx-auto" />
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">Status</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Warehouse Analytics</h3>
              <p className="text-muted-foreground text-center">
                Detailed warehouse analytics and reporting will be available here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
