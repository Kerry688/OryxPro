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
  Navigation, 
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
  Route,
  Play,
  Pause,
  Square,
  Timer
} from 'lucide-react';
import { Trip, TripStatus, TripType, Driver, Vehicle } from '@/lib/models/fleet';

// Mock data
const mockTrips: Trip[] = [
  {
    id: '1',
    vehicleId: 'V001',
    vehicleName: 'Toyota Camry - ABC123',
    driverId: '1',
    driverName: 'Ahmed Hassan',
    startLocation: 'Cairo Office',
    endLocation: 'Giza Client Site',
    startTime: new Date('2024-01-15T09:00:00'),
    endTime: new Date('2024-01-15T11:30:00'),
    distance: 45.5,
    duration: 150, // minutes
    fuelConsumed: 3.2,
    tripType: TripType.BUSINESS,
    status: TripStatus.COMPLETED,
    purpose: 'Client meeting',
    notes: 'Successful client presentation',
    mileageStart: 125000,
    mileageEnd: 125045,
    createdAt: new Date('2024-01-15T09:00:00'),
    updatedAt: new Date('2024-01-15T11:30:00')
  },
  {
    id: '2',
    vehicleId: 'V002',
    vehicleName: 'Ford Transit - DEF456',
    driverId: '2',
    driverName: 'Mohamed Ali',
    startLocation: 'Alexandria Warehouse',
    endLocation: 'Cairo Distribution Center',
    startTime: new Date('2024-01-15T14:00:00'),
    endTime: null,
    distance: 0,
    duration: 0,
    fuelConsumed: 0,
    tripType: TripType.BUSINESS,
    status: TripStatus.IN_PROGRESS,
    purpose: 'Delivery route',
    notes: 'Loading goods for delivery',
    mileageStart: 89000,
    mileageEnd: null,
    createdAt: new Date('2024-01-15T14:00:00'),
    updatedAt: new Date('2024-01-15T14:00:00')
  },
  {
    id: '3',
    vehicleId: 'V001',
    vehicleName: 'Toyota Camry - ABC123',
    driverId: '1',
    driverName: 'Ahmed Hassan',
    startLocation: 'Giza Client Site',
    endLocation: 'Cairo Office',
    startTime: new Date('2024-01-15T16:00:00'),
    endTime: new Date('2024-01-15T18:00:00'),
    distance: 35.2,
    duration: 120,
    fuelConsumed: 2.8,
    tripType: TripType.PERSONAL,
    status: TripStatus.COMPLETED,
    purpose: 'Personal errand',
    notes: 'Personal use after work',
    mileageStart: 125045,
    mileageEnd: 125080,
    createdAt: new Date('2024-01-15T16:00:00'),
    updatedAt: new Date('2024-01-15T18:00:00')
  }
];

const mockDrivers: Driver[] = [
  { id: '1', firstName: 'Ahmed', lastName: 'Hassan', licenseNumber: 'EG123456789' },
  { id: '2', firstName: 'Mohamed', lastName: 'Ali', licenseNumber: 'EG987654321' }
];

const mockVehicles: Vehicle[] = [
  { id: 'V001', licensePlate: 'ABC123', make: 'Toyota', model: 'Camry', year: 2022 },
  { id: 'V002', licensePlate: 'DEF456', make: 'Ford', model: 'Transit', year: 2021 },
  { id: 'V003', licensePlate: 'GHI789', make: 'Nissan', model: 'Patrol', year: 2023 }
];

export function TripTracking() {
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isActiveTrip, setIsActiveTrip] = useState(false);

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = 
      trip.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.startLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.endLocation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || trip.status === statusFilter;
    const matchesType = typeFilter === 'all' || trip.tripType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: TripStatus) => {
    const configs = {
      [TripStatus.PLANNED]: { color: 'bg-blue-100 text-blue-800', icon: Calendar },
      [TripStatus.IN_PROGRESS]: { color: 'bg-green-100 text-green-800', icon: Play },
      [TripStatus.COMPLETED]: { color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
      [TripStatus.CANCELLED]: { color: 'bg-red-100 text-red-800', icon: Square }
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

  const getTypeBadge = (type: TripType) => {
    const configs = {
      [TripType.BUSINESS]: { color: 'bg-blue-100 text-blue-800', text: 'Business' },
      [TripType.PERSONAL]: { color: 'bg-green-100 text-green-800', text: 'Personal' },
      [TripType.MIXED]: { color: 'bg-yellow-100 text-yellow-800', text: 'Mixed' }
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

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const activeTrips = trips.filter(trip => trip.status === TripStatus.IN_PROGRESS);
  const completedTrips = trips.filter(trip => trip.status === TripStatus.COMPLETED);
  const totalDistance = completedTrips.reduce((sum, trip) => sum + trip.distance, 0);
  const businessTrips = trips.filter(trip => trip.tripType === TripType.BUSINESS).length;
  const businessPercentage = trips.length > 0 ? Math.round((businessTrips / trips.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Trip Tracking</h2>
          <p className="text-muted-foreground">Track vehicle trips, mileage, and usage patterns</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsActiveTrip(true)}>
            <Play className="h-4 w-4 mr-2" />
            Start Trip
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Record Trip
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
            <Navigation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trips.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDistance.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Kilometers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trips</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTrips.length}</div>
            <p className="text-xs text-muted-foreground">Currently on road</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Business vs Personal</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businessPercentage}%</div>
            <p className="text-xs text-muted-foreground">Business usage</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Trips */}
      {activeTrips.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-green-500" />
              Active Trips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeTrips.map((trip) => (
                <div key={trip.id} className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Car className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">{trip.vehicleName}</p>
                        <p className="text-sm text-gray-600">Driver: {trip.driverName}</p>
                        <p className="text-sm text-gray-600">From: {trip.startLocation}</p>
                        <p className="text-sm text-gray-600">Started: {trip.startTime.toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Track
                    </Button>
                    <Button variant="outline" size="sm">
                      <Pause className="h-4 w-4 mr-2" />
                      End Trip
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
          <CardTitle>Trip History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search trips by vehicle, driver, location, or purpose..."
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
                  <SelectItem value={TripStatus.PLANNED}>Planned</SelectItem>
                  <SelectItem value={TripStatus.IN_PROGRESS}>In Progress</SelectItem>
                  <SelectItem value={TripStatus.COMPLETED}>Completed</SelectItem>
                  <SelectItem value={TripStatus.CANCELLED}>Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value={TripType.BUSINESS}>Business</SelectItem>
                  <SelectItem value={TripType.PERSONAL}>Personal</SelectItem>
                  <SelectItem value={TripType.MIXED}>Mixed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Trips Table */}
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium">Vehicle & Driver</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Route</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Distance</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Duration</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrips.map((trip) => (
                    <tr key={trip.id} className="border-b">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{trip.vehicleName}</div>
                          <div className="text-sm text-muted-foreground">{trip.driverName}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="text-sm font-medium">{trip.startLocation}</div>
                          {trip.endLocation && (
                            <div className="text-sm text-muted-foreground">→ {trip.endLocation}</div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-medium">{trip.distance} km</div>
                        <div className="text-xs text-muted-foreground">{trip.fuelConsumed}L fuel</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-medium">{formatDuration(trip.duration)}</div>
                        <div className="text-xs text-muted-foreground">
                          {trip.startTime.toLocaleTimeString()}
                          {trip.endTime && ` - ${trip.endTime.toLocaleTimeString()}`}
                        </div>
                      </td>
                      <td className="p-4">
                        {getTypeBadge(trip.tripType)}
                      </td>
                      <td className="p-4">
                        {getStatusBadge(trip.status)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedTrip(trip);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedTrip(trip);
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

      {/* View Trip Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Trip Details</DialogTitle>
            <DialogDescription>
              Complete information for trip from {selectedTrip?.startLocation} to {selectedTrip?.endLocation}
            </DialogDescription>
          </DialogHeader>
          
          {selectedTrip && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Trip Details</TabsTrigger>
                <TabsTrigger value="route">Route Info</TabsTrigger>
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Vehicle</Label>
                    <div className="text-sm font-medium">{selectedTrip.vehicleName}</div>
                  </div>
                  <div>
                    <Label>Driver</Label>
                    <div className="text-sm font-medium">{selectedTrip.driverName}</div>
                  </div>
                  <div>
                    <Label>Purpose</Label>
                    <div className="text-sm font-medium">{selectedTrip.purpose}</div>
                  </div>
                  <div>
                    <Label>Trip Type</Label>
                    <div>{getTypeBadge(selectedTrip.tripType)}</div>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div>{getStatusBadge(selectedTrip.status)}</div>
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <div className="text-sm text-muted-foreground">{selectedTrip.notes || 'No notes available'}</div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="route" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Location</Label>
                    <div className="text-sm font-medium">{selectedTrip.startLocation}</div>
                  </div>
                  <div>
                    <Label>End Location</Label>
                    <div className="text-sm font-medium">{selectedTrip.endLocation || 'Trip in progress'}</div>
                  </div>
                  <div>
                    <Label>Start Time</Label>
                    <div className="text-sm font-medium">{selectedTrip.startTime.toLocaleString()}</div>
                  </div>
                  <div>
                    <Label>End Time</Label>
                    <div className="text-sm font-medium">
                      {selectedTrip.endTime ? selectedTrip.endTime.toLocaleString() : 'Trip in progress'}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="metrics" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Distance</Label>
                    <div className="text-sm font-medium">{selectedTrip.distance} km</div>
                  </div>
                  <div>
                    <Label>Duration</Label>
                    <div className="text-sm font-medium">{formatDuration(selectedTrip.duration)}</div>
                  </div>
                  <div>
                    <Label>Fuel Consumed</Label>
                    <div className="text-sm font-medium">{selectedTrip.fuelConsumed} liters</div>
                  </div>
                  <div>
                    <Label>Mileage Start</Label>
                    <div className="text-sm font-medium">{selectedTrip.mileageStart.toLocaleString()}</div>
                  </div>
                  <div>
                    <Label>Mileage End</Label>
                    <div className="text-sm font-medium">
                      {selectedTrip.mileageEnd ? selectedTrip.mileageEnd.toLocaleString() : 'Trip in progress'}
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
              Edit Trip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Trip Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Record New Trip</DialogTitle>
            <DialogDescription>
              Enter trip information to record a completed trip
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Trip Details</TabsTrigger>
              <TabsTrigger value="route">Route Info</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
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
                  <Label htmlFor="driver">Driver</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select driver" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDrivers.map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.firstName} {driver.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="purpose">Purpose</Label>
                  <Input id="purpose" placeholder="Client meeting" />
                </div>
                <div>
                  <Label htmlFor="tripType">Trip Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trip type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TripType.BUSINESS}>Business</SelectItem>
                      <SelectItem value={TripType.PERSONAL}>Personal</SelectItem>
                      <SelectItem value={TripType.MIXED}>Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="route" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startLocation">Start Location</Label>
                  <Input id="startLocation" placeholder="Cairo Office" />
                </div>
                <div>
                  <Label htmlFor="endLocation">End Location</Label>
                  <Input id="endLocation" placeholder="Giza Client Site" />
                </div>
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input id="startTime" type="datetime-local" />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input id="endTime" type="datetime-local" />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="metrics" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="distance">Distance (km)</Label>
                  <Input id="distance" type="number" placeholder="45.5" />
                </div>
                <div>
                  <Label htmlFor="fuelConsumed">Fuel Consumed (L)</Label>
                  <Input id="fuelConsumed" type="number" placeholder="3.2" />
                </div>
                <div>
                  <Label htmlFor="mileageStart">Start Mileage</Label>
                  <Input id="mileageStart" type="number" placeholder="125000" />
                </div>
                <div>
                  <Label htmlFor="mileageEnd">End Mileage</Label>
                  <Input id="mileageEnd" type="number" placeholder="125045" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input id="notes" placeholder="Additional notes about the trip" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAddDialogOpen(false)}>
              Record Trip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}