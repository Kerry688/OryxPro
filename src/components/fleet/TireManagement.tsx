'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Circle, 
  Plus, 
  AlertTriangle,
  CheckCircle,
  Car,
  BarChart3,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  Clock,
  User,
  Settings,
  DollarSign,
  RotateCcw
} from 'lucide-react';
import { Tire, TirePosition, TireStatus, Vehicle } from '@/lib/models/fleet';

// Mock data
const mockTires: Tire[] = [
  {
    id: '1',
    serialNumber: 'TYR001-2024',
    brand: 'Michelin',
    model: 'Primacy 4',
    size: '225/55R17',
    position: TirePosition.FRONT_LEFT,
    vehicleId: 'V001',
    vehicleName: 'Toyota Camry - ABC123',
    installationDate: new Date('2024-01-15'),
    mileageAtInstallation: 120000,
    currentMileage: 125000,
    expectedLifeMileage: 50000,
    status: TireStatus.ACTIVE,
    condition: 'Good',
    treadDepth: 7.2,
    pressure: 32,
    recommendedPressure: 32,
    cost: 180.00,
    supplier: 'TireMax',
    notes: 'Excellent traction, good wear pattern',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    serialNumber: 'TYR002-2024',
    brand: 'Michelin',
    model: 'Primacy 4',
    size: '225/55R17',
    position: TirePosition.FRONT_RIGHT,
    vehicleId: 'V001',
    vehicleName: 'Toyota Camry - ABC123',
    installationDate: new Date('2024-01-15'),
    mileageAtInstallation: 120000,
    currentMileage: 125000,
    expectedLifeMileage: 50000,
    status: TireStatus.ACTIVE,
    condition: 'Good',
    treadDepth: 7.0,
    pressure: 31,
    recommendedPressure: 32,
    cost: 180.00,
    supplier: 'TireMax',
    notes: 'Slight uneven wear on outer edge',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '3',
    serialNumber: 'TYR003-2023',
    brand: 'Bridgestone',
    model: 'Ecopia EP150',
    size: '215/65R16',
    position: TirePosition.REAR_LEFT,
    vehicleId: 'V002',
    vehicleName: 'Ford Transit - DEF456',
    installationDate: new Date('2023-08-20'),
    mileageAtInstallation: 85000,
    currentMileage: 89000,
    expectedLifeMileage: 60000,
    status: TireStatus.NEEDS_REPLACEMENT,
    condition: 'Worn',
    treadDepth: 2.1,
    pressure: 30,
    recommendedPressure: 35,
    cost: 165.00,
    supplier: 'Fleet Tires',
    notes: 'Tread depth below legal limit, replace soon',
    createdAt: new Date('2023-08-20'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '4',
    serialNumber: 'TYR004-2023',
    brand: 'Bridgestone',
    model: 'Ecopia EP150',
    size: '215/65R16',
    position: TirePosition.REAR_RIGHT,
    vehicleId: 'V002',
    vehicleName: 'Ford Transit - DEF456',
    installationDate: new Date('2023-08-20'),
    mileageAtInstallation: 85000,
    currentMileage: 89000,
    expectedLifeMileage: 60000,
    status: TireStatus.NEEDS_REPLACEMENT,
    condition: 'Worn',
    treadDepth: 2.0,
    pressure: 29,
    recommendedPressure: 35,
    cost: 165.00,
    supplier: 'Fleet Tires',
    notes: 'Critical tread depth, immediate replacement required',
    createdAt: new Date('2023-08-20'),
    updatedAt: new Date('2024-01-15')
  }
];

const mockVehicles: Vehicle[] = [
  { id: 'V001', licensePlate: 'ABC123', make: 'Toyota', model: 'Camry', year: 2022 },
  { id: 'V002', licensePlate: 'DEF456', make: 'Ford', model: 'Transit', year: 2021 },
  { id: 'V003', licensePlate: 'GHI789', make: 'Nissan', model: 'Patrol', year: 2023 }
];

export function TireManagement() {
  const [tires, setTires] = useState<Tire[]>(mockTires);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [selectedTire, setSelectedTire] = useState<Tire | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredTires = tires.filter(tire => {
    const matchesSearch = 
      tire.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tire.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tire.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tire.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tire.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || tire.status === statusFilter;
    const matchesPosition = positionFilter === 'all' || tire.position === positionFilter;
    
    return matchesSearch && matchesStatus && matchesPosition;
  });

  const getStatusBadge = (status: TireStatus) => {
    const configs = {
      [TireStatus.ACTIVE]: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      [TireStatus.NEEDS_REPLACEMENT]: { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
      [TireStatus.INSPECTION_DUE]: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      [TireStatus.DAMAGED]: { color: 'bg-orange-100 text-orange-800', icon: AlertTriangle },
      [TireStatus.RETIRED]: { color: 'bg-gray-100 text-gray-800', icon: Circle }
    };

    const config = configs[status];
    if (!config) {
      return <Badge variant="secondary">Unknown</Badge>;
    }

    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPositionBadge = (position: TirePosition) => {
    const configs = {
      [TirePosition.FRONT_LEFT]: { color: 'bg-blue-100 text-blue-800', text: 'FL' },
      [TirePosition.FRONT_RIGHT]: { color: 'bg-blue-100 text-blue-800', text: 'FR' },
      [TirePosition.REAR_LEFT]: { color: 'bg-green-100 text-green-800', text: 'RL' },
      [TirePosition.REAR_RIGHT]: { color: 'bg-green-100 text-green-800', text: 'RR' },
      [TirePosition.SPARE]: { color: 'bg-gray-100 text-gray-800', text: 'SPARE' }
    };

    const config = configs[position];
    if (!config) {
      return <Badge variant="secondary">Unknown</Badge>;
    }

    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  const totalTires = tires.length;
  const needsReplacement = tires.filter(tire => tire.status === TireStatus.NEEDS_REPLACEMENT).length;
  const inspectionDue = tires.filter(tire => tire.status === TireStatus.INSPECTION_DUE).length;
  const averageLife = tires.length > 0 ? 
    Math.round(tires.reduce((sum, tire) => sum + tire.expectedLifeMileage, 0) / tires.length) : 0;

  const getTreadDepthColor = (treadDepth: number) => {
    if (treadDepth >= 5) return 'text-green-600';
    if (treadDepth >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPressureColor = (current: number, recommended: number) => {
    const diff = Math.abs(current - recommended);
    if (diff <= 2) return 'text-green-600';
    if (diff <= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tire Management</h2>
          <p className="text-muted-foreground">Track tire inventory and lifecycle</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Rotate Tires
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Tires
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tires</CardTitle>
            <Circle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTires}</div>
            <p className="text-xs text-muted-foreground">In inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Need Replacement</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{needsReplacement}</div>
            <p className="text-xs text-muted-foreground">Tires worn out</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inspection Due</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inspectionDue}</div>
            <p className="text-xs text-muted-foreground">Need inspection</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Life</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageLife}K</div>
            <p className="text-xs text-muted-foreground">Miles average</p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {(needsReplacement > 0 || inspectionDue > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Critical Tire Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tires
                .filter(tire => tire.status === TireStatus.NEEDS_REPLACEMENT || tire.status === TireStatus.INSPECTION_DUE)
                .map((tire) => (
                  <div key={tire.id} className={`flex items-center justify-between p-3 border rounded-lg ${
                    tire.status === TireStatus.NEEDS_REPLACEMENT 
                      ? 'bg-red-50 border-red-200' 
                      : 'bg-yellow-50 border-yellow-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <Circle className={`h-5 w-5 ${
                        tire.status === TireStatus.NEEDS_REPLACEMENT ? 'text-red-500' : 'text-yellow-500'
                      }`} />
                      <div>
                        <p className="font-medium">{tire.vehicleName} - {getPositionBadge(tire.position).props.children}</p>
                        <p className="text-sm text-gray-600">{tire.brand} {tire.model} - {tire.size}</p>
                        <p className="text-sm text-gray-600">
                          Tread: {tire.treadDepth}mm • Pressure: {tire.pressure}psi
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        {tire.status === TireStatus.NEEDS_REPLACEMENT ? 'Replace' : 'Inspect'}
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Tire Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by serial number, brand, model, vehicle, or supplier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value={TireStatus.ACTIVE}>Active</SelectItem>
                  <SelectItem value={TireStatus.NEEDS_REPLACEMENT}>Needs Replacement</SelectItem>
                  <SelectItem value={TireStatus.INSPECTION_DUE}>Inspection Due</SelectItem>
                  <SelectItem value={TireStatus.DAMAGED}>Damaged</SelectItem>
                  <SelectItem value={TireStatus.RETIRED}>Retired</SelectItem>
                </SelectContent>
              </Select>
              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  <SelectItem value={TirePosition.FRONT_LEFT}>Front Left</SelectItem>
                  <SelectItem value={TirePosition.FRONT_RIGHT}>Front Right</SelectItem>
                  <SelectItem value={TirePosition.REAR_LEFT}>Rear Left</SelectItem>
                  <SelectItem value={TirePosition.REAR_RIGHT}>Rear Right</SelectItem>
                  <SelectItem value={TirePosition.SPARE}>Spare</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tires Table */}
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium">Tire Info</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Vehicle & Position</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Condition</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Tread Depth</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Pressure</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTires.map((tire) => (
                    <tr key={tire.id} className="border-b">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{tire.brand} {tire.model}</div>
                          <div className="text-sm text-muted-foreground">{tire.size}</div>
                          <div className="text-xs text-muted-foreground">SN: {tire.serialNumber}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{tire.vehicleName}</div>
                          <div className="flex items-center gap-2 mt-1">
                            {getPositionBadge(tire.position)}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-medium">{tire.condition}</div>
                        <div className="text-xs text-muted-foreground">
                          {tire.currentMileage.toLocaleString()} km
                        </div>
                      </td>
                      <td className="p-4">
                        <div className={`text-sm font-medium ${getTreadDepthColor(tire.treadDepth)}`}>
                          {tire.treadDepth}mm
                        </div>
                      </td>
                      <td className="p-4">
                        <div className={`text-sm font-medium ${getPressureColor(tire.pressure, tire.recommendedPressure)}`}>
                          {tire.pressure}psi
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Rec: {tire.recommendedPressure}psi
                        </div>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(tire.status)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedTire(tire);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedTire(tire);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
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

      {/* View Tire Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tire Details</DialogTitle>
            <DialogDescription>
              Complete information for tire {selectedTire?.serialNumber}
            </DialogDescription>
          </DialogHeader>
          
          {selectedTire && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Tire Details</TabsTrigger>
                <TabsTrigger value="condition">Condition</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Serial Number</Label>
                    <div className="text-sm font-medium">{selectedTire.serialNumber}</div>
                  </div>
                  <div>
                    <Label>Brand & Model</Label>
                    <div className="text-sm font-medium">{selectedTire.brand} {selectedTire.model}</div>
                  </div>
                  <div>
                    <Label>Size</Label>
                    <div className="text-sm font-medium">{selectedTire.size}</div>
                  </div>
                  <div>
                    <Label>Position</Label>
                    <div>{getPositionBadge(selectedTire.position)}</div>
                  </div>
                  <div>
                    <Label>Vehicle</Label>
                    <div className="text-sm font-medium">{selectedTire.vehicleName}</div>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div>{getStatusBadge(selectedTire.status)}</div>
                  </div>
                  <div>
                    <Label>Installation Date</Label>
                    <div className="text-sm font-medium">{selectedTire.installationDate.toLocaleDateString()}</div>
                  </div>
                  <div>
                    <Label>Supplier</Label>
                    <div className="text-sm font-medium">{selectedTire.supplier}</div>
                  </div>
                  <div>
                    <Label>Cost</Label>
                    <div className="text-sm font-medium">${selectedTire.cost.toFixed(2)}</div>
                  </div>
                  <div>
                    <Label>Expected Life</Label>
                    <div className="text-sm font-medium">{selectedTire.expectedLifeMileage.toLocaleString()} km</div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="condition" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Current Condition</Label>
                    <div className="text-sm font-medium">{selectedTire.condition}</div>
                  </div>
                  <div>
                    <Label>Tread Depth</Label>
                    <div className={`text-sm font-medium ${getTreadDepthColor(selectedTire.treadDepth)}`}>
                      {selectedTire.treadDepth}mm
                    </div>
                  </div>
                  <div>
                    <Label>Current Pressure</Label>
                    <div className={`text-sm font-medium ${getPressureColor(selectedTire.pressure, selectedTire.recommendedPressure)}`}>
                      {selectedTire.pressure} psi
                    </div>
                  </div>
                  <div>
                    <Label>Recommended Pressure</Label>
                    <div className="text-sm font-medium">{selectedTire.recommendedPressure} psi</div>
                  </div>
                  <div>
                    <Label>Mileage at Installation</Label>
                    <div className="text-sm font-medium">{selectedTire.mileageAtInstallation.toLocaleString()} km</div>
                  </div>
                  <div>
                    <Label>Current Mileage</Label>
                    <div className="text-sm font-medium">{selectedTire.currentMileage.toLocaleString()} km</div>
                  </div>
                  <div className="col-span-2">
                    <Label>Notes</Label>
                    <div className="text-sm text-muted-foreground">{selectedTire.notes || 'No notes available'}</div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4">
                <div>
                  <Label>Installation History</Label>
                  <div className="mt-2 space-y-2">
                    <div className="p-3 border rounded">
                      <div className="font-medium">Initial Installation</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedTire.installationDate.toLocaleDateString()} - {selectedTire.mileageAtInstallation.toLocaleString()} km
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Installed on {selectedTire.vehicleName} at {getPositionBadge(selectedTire.position).props.children} position
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsViewDialogOpen(false);
              setIsEditDialogOpen(true);
            }}>
              Edit Tire
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Tire Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Tire</DialogTitle>
            <DialogDescription>
              Add a new tire to the fleet inventory
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Tire Details</TabsTrigger>
              <TabsTrigger value="installation">Installation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Input id="serialNumber" placeholder="TYR001-2024" />
                </div>
                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Input id="brand" placeholder="Michelin" />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" placeholder="Primacy 4" />
                </div>
                <div>
                  <Label htmlFor="size">Size</Label>
                  <Input id="size" placeholder="225/55R17" />
                </div>
                <div>
                  <Label htmlFor="cost">Cost</Label>
                  <Input id="cost" type="number" placeholder="180.00" />
                </div>
                <div>
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input id="supplier" placeholder="TireMax" />
                </div>
                <div>
                  <Label htmlFor="expectedLife">Expected Life (km)</Label>
                  <Input id="expectedLife" type="number" placeholder="50000" />
                </div>
                <div>
                  <Label htmlFor="recommendedPressure">Recommended Pressure</Label>
                  <Input id="recommendedPressure" type="number" placeholder="32" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input id="notes" placeholder="Additional notes about the tire" />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="installation" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vehicle">Vehicle</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockVehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TirePosition.FRONT_LEFT}>Front Left</SelectItem>
                      <SelectItem value={TirePosition.FRONT_RIGHT}>Front Right</SelectItem>
                      <SelectItem value={TirePosition.REAR_LEFT}>Rear Left</SelectItem>
                      <SelectItem value={TirePosition.REAR_RIGHT}>Rear Right</SelectItem>
                      <SelectItem value={TirePosition.SPARE}>Spare</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="installationDate">Installation Date</Label>
                  <Input id="installationDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="mileageAtInstallation">Mileage at Installation</Label>
                  <Input id="mileageAtInstallation" type="number" placeholder="120000" />
                </div>
                <div>
                  <Label htmlFor="currentMileage">Current Mileage</Label>
                  <Input id="currentMileage" type="number" placeholder="120000" />
                </div>
                <div>
                  <Label htmlFor="initialPressure">Initial Pressure</Label>
                  <Input id="initialPressure" type="number" placeholder="32" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAddDialogOpen(false)}>
              Add Tire
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}