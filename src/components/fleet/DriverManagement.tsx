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
  Users, 
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
  Phone,
  Mail,
  IdCard,
  Clock,
  UserCheck
} from 'lucide-react';
import { Driver, DriverStatus, Vehicle } from '@/lib/models/fleet';

// Mock data
const mockDrivers: Driver[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    firstName: 'Ahmed',
    lastName: 'Hassan',
    email: 'ahmed.hassan@company.com',
    phone: '+20 100 123 4567',
    licenseNumber: 'EG123456789',
    licenseType: 'B',
    licenseExpiry: new Date('2024-12-31'),
    licenseClass: 'Private Car',
    address: 'Cairo, Egypt',
    emergencyContact: '+20 100 987 6543',
    hireDate: new Date('2023-01-15'),
    status: DriverStatus.ACTIVE,
    assignedVehicleId: 'V001',
    assignedVehicleName: 'Toyota Camry - ABC123',
    notes: 'Excellent driving record, specializes in city routes',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    employeeId: 'EMP002',
    firstName: 'Mohamed',
    lastName: 'Ali',
    email: 'mohamed.ali@company.com',
    phone: '+20 101 234 5678',
    licenseNumber: 'EG987654321',
    licenseType: 'C',
    licenseExpiry: new Date('2024-06-15'),
    licenseClass: 'Commercial Truck',
    address: 'Alexandria, Egypt',
    emergencyContact: '+20 101 876 5432',
    hireDate: new Date('2023-03-20'),
    status: DriverStatus.ACTIVE,
    assignedVehicleId: 'V002',
    assignedVehicleName: 'Ford Transit - DEF456',
    notes: 'Experienced in long-haul deliveries',
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '3',
    employeeId: 'EMP003',
    firstName: 'Fatma',
    lastName: 'Mahmoud',
    email: 'fatma.mahmoud@company.com',
    phone: '+20 102 345 6789',
    licenseNumber: 'EG456789123',
    licenseType: 'B',
    licenseExpiry: new Date('2024-02-28'),
    licenseClass: 'Private Car',
    address: 'Giza, Egypt',
    emergencyContact: '+20 102 765 4321',
    hireDate: new Date('2023-06-10'),
    status: DriverStatus.ON_LEAVE,
    assignedVehicleId: null,
    assignedVehicleName: null,
    notes: 'Currently on maternity leave',
    createdAt: new Date('2023-06-10'),
    updatedAt: new Date('2024-01-15')
  }
];

const mockVehicles: Vehicle[] = [
  { id: 'V001', licensePlate: 'ABC123', make: 'Toyota', model: 'Camry', year: 2022 },
  { id: 'V002', licensePlate: 'DEF456', make: 'Ford', model: 'Transit', year: 2021 },
  { id: 'V003', licensePlate: 'GHI789', make: 'Nissan', model: 'Patrol', year: 2023 }
];

export function DriverManagement() {
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = 
      driver.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: DriverStatus) => {
    const configs = {
      [DriverStatus.ACTIVE]: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      [DriverStatus.INACTIVE]: { color: 'bg-gray-100 text-gray-800', icon: AlertTriangle },
      [DriverStatus.ON_LEAVE]: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      [DriverStatus.SUSPENDED]: { color: 'bg-red-100 text-red-800', icon: AlertTriangle }
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

  const getLicenseExpiryStatus = (expiryDate: Date) => {
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'expired', color: 'text-red-600' };
    if (diffDays <= 30) return { status: 'expiring', color: 'text-yellow-600' };
    return { status: 'valid', color: 'text-green-600' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Driver Management</h2>
          <p className="text-muted-foreground">Manage drivers, licenses, and vehicle assignments</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Driver
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{drivers.length}</div>
            <p className="text-xs text-muted-foreground">Active drivers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Licenses Expiring</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {drivers.filter(d => getLicenseExpiryStatus(d.licenseExpiry).status === 'expiring').length}
            </div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Vehicles</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {drivers.filter(d => d.assignedVehicleId).length}
            </div>
            <p className="text-xs text-muted-foreground">Currently assigned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Drivers</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {drivers.filter(d => !d.assignedVehicleId && d.status === DriverStatus.ACTIVE).length}
            </div>
            <p className="text-xs text-muted-foreground">Not assigned</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Driver Registry</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search drivers by name, email, or license number..."
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
                  <SelectItem value={DriverStatus.ACTIVE}>Active</SelectItem>
                  <SelectItem value={DriverStatus.INACTIVE}>Inactive</SelectItem>
                  <SelectItem value={DriverStatus.ON_LEAVE}>On Leave</SelectItem>
                  <SelectItem value={DriverStatus.SUSPENDED}>Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Drivers Table */}
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium">Driver</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">License</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Assigned Vehicle</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">License Expiry</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDrivers.map((driver) => {
                    const expiryStatus = getLicenseExpiryStatus(driver.licenseExpiry);
                    return (
                      <tr key={driver.id} className="border-b">
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{driver.firstName} {driver.lastName}</div>
                            <div className="text-sm text-muted-foreground">{driver.email}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{driver.licenseNumber}</div>
                            <div className="text-sm text-muted-foreground">{driver.licenseClass}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          {driver.assignedVehicleName ? (
                            <div className="flex items-center gap-2">
                              <Car className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{driver.assignedVehicleName}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">Not assigned</span>
                          )}
                        </td>
                        <td className="p-4">
                          {getStatusBadge(driver.status)}
                        </td>
                        <td className="p-4">
                          <div className={`text-sm ${expiryStatus.color}`}>
                            {driver.licenseExpiry.toLocaleDateString()}
                            {expiryStatus.status === 'expiring' && (
                              <div className="text-xs text-yellow-600">Expiring soon</div>
                            )}
                            {expiryStatus.status === 'expired' && (
                              <div className="text-xs text-red-600">Expired</div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedDriver(driver);
                                setIsViewDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedDriver(driver);
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Driver Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Driver Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedDriver?.firstName} {selectedDriver?.lastName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedDriver && (
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="license">License Details</TabsTrigger>
                <TabsTrigger value="assignment">Vehicle Assignment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Employee ID</Label>
                    <div className="text-sm font-medium">{selectedDriver.employeeId}</div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <div className="text-sm font-medium">{selectedDriver.email}</div>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <div className="text-sm font-medium">{selectedDriver.phone}</div>
                  </div>
                  <div>
                    <Label>Emergency Contact</Label>
                    <div className="text-sm font-medium">{selectedDriver.emergencyContact}</div>
                  </div>
                  <div className="col-span-2">
                    <Label>Address</Label>
                    <div className="text-sm font-medium">{selectedDriver.address}</div>
                  </div>
                  <div>
                    <Label>Hire Date</Label>
                    <div className="text-sm font-medium">{selectedDriver.hireDate.toLocaleDateString()}</div>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div>{getStatusBadge(selectedDriver.status)}</div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="license" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>License Number</Label>
                    <div className="text-sm font-medium">{selectedDriver.licenseNumber}</div>
                  </div>
                  <div>
                    <Label>License Type</Label>
                    <div className="text-sm font-medium">{selectedDriver.licenseType}</div>
                  </div>
                  <div>
                    <Label>License Class</Label>
                    <div className="text-sm font-medium">{selectedDriver.licenseClass}</div>
                  </div>
                  <div>
                    <Label>Expiry Date</Label>
                    <div className="text-sm font-medium">{selectedDriver.licenseExpiry.toLocaleDateString()}</div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="assignment" className="space-y-4">
                <div>
                  <Label>Assigned Vehicle</Label>
                  {selectedDriver.assignedVehicleName ? (
                    <div className="flex items-center gap-2 mt-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{selectedDriver.assignedVehicleName}</span>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">No vehicle assigned</div>
                  )}
                </div>
                <div>
                  <Label>Notes</Label>
                  <div className="text-sm text-muted-foreground mt-2">{selectedDriver.notes || 'No notes available'}</div>
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
              Edit Driver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Driver Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Driver</DialogTitle>
            <DialogDescription>
              Enter the driver's information to add them to the system
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="license">License Details</TabsTrigger>
              <TabsTrigger value="assignment">Vehicle Assignment</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input id="employeeId" placeholder="EMP001" />
                </div>
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Ahmed" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Hassan" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="ahmed.hassan@company.com" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="+20 100 123 4567" />
                </div>
                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input id="emergencyContact" placeholder="+20 100 987 6543" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Cairo, Egypt" />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="license" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input id="licenseNumber" placeholder="EG123456789" />
                </div>
                <div>
                  <Label htmlFor="licenseType">License Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select license type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A - Motorcycle</SelectItem>
                      <SelectItem value="B">B - Private Car</SelectItem>
                      <SelectItem value="C">C - Commercial Truck</SelectItem>
                      <SelectItem value="D">D - Bus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="licenseClass">License Class</Label>
                  <Input id="licenseClass" placeholder="Private Car" />
                </div>
                <div>
                  <Label htmlFor="licenseExpiry">Expiry Date</Label>
                  <Input id="licenseExpiry" type="date" />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="assignment" className="space-y-4">
              <div>
                <Label htmlFor="assignedVehicle">Assign Vehicle</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No assignment</SelectItem>
                    {mockVehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input id="notes" placeholder="Additional notes about the driver" />
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAddDialogOpen(false)}>
              Add Driver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}