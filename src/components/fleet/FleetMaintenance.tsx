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
  Wrench, 
  Plus, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Car,
  DollarSign,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  User,
  MapPin,
  FileText,
  Settings,
  BarChart3,
  Zap
} from 'lucide-react';
import { VehicleMaintenance, MaintenanceType, MaintenanceStatus, Vehicle } from '@/lib/models/fleet';

// Mock data
const mockMaintenanceRecords: VehicleMaintenance[] = [
  {
    id: '1',
    vehicleId: 'V001',
    vehicleName: 'Toyota Camry - ABC123',
    maintenanceType: MaintenanceType.PREVENTIVE,
    description: 'Regular oil change and filter replacement',
    scheduledDate: new Date('2024-01-20'),
    completedDate: new Date('2024-01-20'),
    status: MaintenanceStatus.COMPLETED,
    mileageAtService: 125000,
    nextServiceMileage: 130000,
    cost: 85.50,
    serviceProvider: 'AutoCare Center',
    serviceProviderContact: '+20 100 123 4567',
    technician: 'Ahmed Hassan',
    notes: 'All fluids checked, brakes inspected',
    partsUsed: [
      { part: 'Engine Oil 5W-30', quantity: 5, cost: 45.00 },
      { part: 'Oil Filter', quantity: 1, cost: 12.50 },
      { part: 'Air Filter', quantity: 1, cost: 28.00 }
    ],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    vehicleId: 'V002',
    vehicleName: 'Ford Transit - DEF456',
    maintenanceType: MaintenanceType.CORRECTIVE,
    description: 'Brake pad replacement and rotor resurfacing',
    scheduledDate: new Date('2024-01-22'),
    completedDate: null,
    status: MaintenanceStatus.IN_PROGRESS,
    mileageAtService: 89000,
    nextServiceMileage: 95000,
    cost: 0,
    serviceProvider: 'Fleet Service Center',
    serviceProviderContact: '+20 101 234 5678',
    technician: 'Mohamed Ali',
    notes: 'Emergency brake service required',
    partsUsed: [
      { part: 'Brake Pads (Front)', quantity: 1, cost: 65.00 },
      { part: 'Brake Rotors (Front)', quantity: 2, cost: 120.00 }
    ],
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: '3',
    vehicleId: 'V003',
    vehicleName: 'Nissan Patrol - GHI789',
    maintenanceType: MaintenanceType.PREVENTIVE,
    description: 'Annual inspection and safety check',
    scheduledDate: new Date('2024-01-25'),
    completedDate: null,
    status: MaintenanceStatus.SCHEDULED,
    mileageAtService: 45000,
    nextServiceMileage: 50000,
    cost: 0,
    serviceProvider: 'Nissan Service Center',
    serviceProviderContact: '+20 102 345 6789',
    technician: 'TBD',
    notes: 'Annual safety inspection required',
    partsUsed: [],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  }
];

const mockVehicles: Vehicle[] = [
  { id: 'V001', licensePlate: 'ABC123', make: 'Toyota', model: 'Camry', year: 2022 },
  { id: 'V002', licensePlate: 'DEF456', make: 'Ford', model: 'Transit', year: 2021 },
  { id: 'V003', licensePlate: 'GHI789', make: 'Nissan', model: 'Patrol', year: 2023 }
];

export function FleetMaintenance() {
  const [maintenanceRecords, setMaintenanceRecords] = useState<VehicleMaintenance[]>(mockMaintenanceRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<VehicleMaintenance | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredRecords = maintenanceRecords.filter(record => {
    const matchesSearch = 
      record.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.serviceProvider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.technician.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesType = typeFilter === 'all' || record.maintenanceType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: MaintenanceStatus) => {
    const configs = {
      [MaintenanceStatus.SCHEDULED]: { color: 'bg-blue-100 text-blue-800', icon: Calendar },
      [MaintenanceStatus.IN_PROGRESS]: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      [MaintenanceStatus.COMPLETED]: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      [MaintenanceStatus.CANCELLED]: { color: 'bg-red-100 text-red-800', icon: AlertTriangle }
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

  const getTypeBadge = (type: MaintenanceType) => {
    const configs = {
      [MaintenanceType.PREVENTIVE]: { color: 'bg-blue-100 text-blue-800', text: 'Preventive' },
      [MaintenanceType.CORRECTIVE]: { color: 'bg-red-100 text-red-800', text: 'Corrective' },
      [MaintenanceType.EMERGENCY]: { color: 'bg-orange-100 text-orange-800', text: 'Emergency' }
    };

    const config = configs[type];
    if (!config) {
      return <Badge variant="secondary">Unknown</Badge>;
    }

    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  const dueForService = maintenanceRecords.filter(record => 
    record.status === MaintenanceStatus.SCHEDULED && 
    record.scheduledDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  ).length;

  const underMaintenance = maintenanceRecords.filter(record => 
    record.status === MaintenanceStatus.IN_PROGRESS
  ).length;

  const monthlyCost = maintenanceRecords
    .filter(record => 
      record.status === MaintenanceStatus.COMPLETED && 
      record.completedDate && 
      record.completedDate >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    )
    .reduce((sum, record) => sum + record.cost, 0);

  const completedOnTime = maintenanceRecords.filter(record => 
    record.status === MaintenanceStatus.COMPLETED && 
    record.completedDate && 
    record.scheduledDate &&
    record.completedDate <= record.scheduledDate
  ).length;

  const totalCompleted = maintenanceRecords.filter(record => 
    record.status === MaintenanceStatus.COMPLETED
  ).length;

  const complianceRate = totalCompleted > 0 ? Math.round((completedOnTime / totalCompleted) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Fleet Maintenance</h2>
          <p className="text-muted-foreground">Schedule and track vehicle maintenance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Work Order
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due for Service</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dueForService}</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{underMaintenance}</div>
            <p className="text-xs text-muted-foreground">Active work orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceRate}%</div>
            <p className="text-xs text-muted-foreground">On-time service</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Maintenance Alerts */}
      {dueForService > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Upcoming Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {maintenanceRecords
                .filter(record => 
                  record.status === MaintenanceStatus.SCHEDULED && 
                  record.scheduledDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                )
                .map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Car className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="font-medium">{record.vehicleName}</p>
                        <p className="text-sm text-gray-600">{record.description}</p>
                        <p className="text-sm text-gray-600">Scheduled: {record.scheduledDate.toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Wrench className="h-4 w-4 mr-2" />
                        Start Service
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
          <CardTitle>Maintenance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by vehicle, description, service provider, or technician..."
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
                  <SelectItem value={MaintenanceStatus.SCHEDULED}>Scheduled</SelectItem>
                  <SelectItem value={MaintenanceStatus.IN_PROGRESS}>In Progress</SelectItem>
                  <SelectItem value={MaintenanceStatus.COMPLETED}>Completed</SelectItem>
                  <SelectItem value={MaintenanceStatus.CANCELLED}>Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value={MaintenanceType.PREVENTIVE}>Preventive</SelectItem>
                  <SelectItem value={MaintenanceType.CORRECTIVE}>Corrective</SelectItem>
                  <SelectItem value={MaintenanceType.EMERGENCY}>Emergency</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Maintenance Records Table */}
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium">Vehicle</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Description</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Cost</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="border-b">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{record.vehicleName}</div>
                          <div className="text-sm text-muted-foreground">{record.mileageAtService.toLocaleString()} km</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{record.description}</div>
                          <div className="text-sm text-muted-foreground">{record.serviceProvider}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        {getTypeBadge(record.maintenanceType)}
                      </td>
                      <td className="p-4">
                        {getStatusBadge(record.status)}
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {record.scheduledDate.toLocaleDateString()}
                          {record.completedDate && (
                            <div className="text-xs text-muted-foreground">
                              Completed: {record.completedDate.toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-medium">
                          {record.cost > 0 ? `$${record.cost.toFixed(2)}` : 'TBD'}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedRecord(record);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedRecord(record);
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

      {/* View Maintenance Record Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Maintenance Record Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedRecord?.vehicleName} maintenance
            </DialogDescription>
          </DialogHeader>
          
          {selectedRecord && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Service Details</TabsTrigger>
                <TabsTrigger value="parts">Parts & Costs</TabsTrigger>
                <TabsTrigger value="schedule">Schedule Info</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Vehicle</Label>
                    <div className="text-sm font-medium">{selectedRecord.vehicleName}</div>
                  </div>
                  <div>
                    <Label>Maintenance Type</Label>
                    <div>{getTypeBadge(selectedRecord.maintenanceType)}</div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <div className="text-sm font-medium">{selectedRecord.description}</div>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div>{getStatusBadge(selectedRecord.status)}</div>
                  </div>
                  <div>
                    <Label>Service Provider</Label>
                    <div className="text-sm font-medium">{selectedRecord.serviceProvider}</div>
                  </div>
                  <div>
                    <Label>Contact</Label>
                    <div className="text-sm font-medium">{selectedRecord.serviceProviderContact}</div>
                  </div>
                  <div>
                    <Label>Technician</Label>
                    <div className="text-sm font-medium">{selectedRecord.technician}</div>
                  </div>
                  <div>
                    <Label>Mileage at Service</Label>
                    <div className="text-sm font-medium">{selectedRecord.mileageAtService.toLocaleString()} km</div>
                  </div>
                  <div className="col-span-2">
                    <Label>Notes</Label>
                    <div className="text-sm text-muted-foreground">{selectedRecord.notes || 'No notes available'}</div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="parts" className="space-y-4">
                <div>
                  <Label>Parts Used</Label>
                  {selectedRecord.partsUsed.length > 0 ? (
                    <div className="mt-2 space-y-2">
                      {selectedRecord.partsUsed.map((part, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border rounded">
                          <div>
                            <div className="font-medium">{part.part}</div>
                            <div className="text-sm text-muted-foreground">Qty: {part.quantity}</div>
                          </div>
                          <div className="font-medium">${part.cost.toFixed(2)}</div>
                        </div>
                      ))}
                      <div className="flex justify-between items-center p-2 bg-muted rounded font-medium">
                        <div>Total Cost</div>
                        <div>${selectedRecord.cost.toFixed(2)}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground mt-2">No parts recorded</div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="schedule" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Scheduled Date</Label>
                    <div className="text-sm font-medium">{selectedRecord.scheduledDate.toLocaleDateString()}</div>
                  </div>
                  <div>
                    <Label>Completed Date</Label>
                    <div className="text-sm font-medium">
                      {selectedRecord.completedDate ? selectedRecord.completedDate.toLocaleDateString() : 'Not completed'}
                    </div>
                  </div>
                  <div>
                    <Label>Next Service Mileage</Label>
                    <div className="text-sm font-medium">{selectedRecord.nextServiceMileage.toLocaleString()} km</div>
                  </div>
                  <div>
                    <Label>Cost</Label>
                    <div className="text-sm font-medium">
                      {selectedRecord.cost > 0 ? `$${selectedRecord.cost.toFixed(2)}` : 'TBD'}
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
              Edit Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Maintenance Record Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Maintenance</DialogTitle>
            <DialogDescription>
              Create a new maintenance record for a vehicle
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Service Details</TabsTrigger>
              <TabsTrigger value="parts">Parts & Costs</TabsTrigger>
              <TabsTrigger value="schedule">Schedule Info</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
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
                  <Label htmlFor="maintenanceType">Maintenance Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={MaintenanceType.PREVENTIVE}>Preventive</SelectItem>
                      <SelectItem value={MaintenanceType.CORRECTIVE}>Corrective</SelectItem>
                      <SelectItem value={MaintenanceType.EMERGENCY}>Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="Oil change and filter replacement" />
                </div>
                <div>
                  <Label htmlFor="serviceProvider">Service Provider</Label>
                  <Input id="serviceProvider" placeholder="AutoCare Center" />
                </div>
                <div>
                  <Label htmlFor="contact">Contact</Label>
                  <Input id="contact" placeholder="+20 100 123 4567" />
                </div>
                <div>
                  <Label htmlFor="technician">Technician</Label>
                  <Input id="technician" placeholder="Ahmed Hassan" />
                </div>
                <div>
                  <Label htmlFor="mileage">Current Mileage</Label>
                  <Input id="mileage" type="number" placeholder="125000" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input id="notes" placeholder="Additional notes about the service" />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="parts" className="space-y-4">
              <div>
                <Label>Parts Used</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex gap-2">
                    <Input placeholder="Part name" />
                    <Input placeholder="Qty" type="number" className="w-20" />
                    <Input placeholder="Cost" type="number" className="w-24" />
                    <Button variant="outline" size="sm">Add</Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Parts will be added to the maintenance record
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="schedule" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="scheduledDate">Scheduled Date</Label>
                  <Input id="scheduledDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="nextServiceMileage">Next Service Mileage</Label>
                  <Input id="nextServiceMileage" type="number" placeholder="130000" />
                </div>
                <div>
                  <Label htmlFor="estimatedCost">Estimated Cost</Label>
                  <Input id="estimatedCost" type="number" placeholder="85.50" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAddDialogOpen(false)}>
              Schedule Maintenance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}