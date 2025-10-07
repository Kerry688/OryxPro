'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Eye,
  Edit,
  Trash2,
  MapPin,
  User,
  Car,
  AlertTriangle,
  CheckCircle,
  Clock,
  Fuel,
  Wrench,
  FileText,
  MoreHorizontal,
  Calendar,
  DollarSign
} from 'lucide-react';
import { VehicleForm } from './VehicleForm';
import { VehicleDetailView } from './VehicleDetailView';
import { 
  Vehicle, 
  VehicleStatus, 
  VehicleType, 
  FuelType, 
  OwnershipType,
  VehicleCategory
} from '@/lib/models/fleet';

export function VehicleRegistry() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [showVehicleDetail, setShowVehicleDetail] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call to fetch vehicles
      // const response = await fetch('/api/fleet/vehicles');
      // const data = await response.json();
      // setVehicles(data);
      
      // Mock data for now
      setVehicles([
        {
          _id: '1',
          vehicleId: 'VH-001',
          make: 'Toyota',
          model: 'Camry',
          year: 2022,
          vin: '1HGBH41JXMN109186',
          licensePlate: 'ABC-123',
          color: 'Silver',
          vehicleType: VehicleType.CAR,
          category: VehicleCategory.PASSENGER,
          fuelType: FuelType.GASOLINE,
          transmission: 'AUTOMATIC' as any,
          ownershipType: OwnershipType.OWNED,
          registrationNumber: 'REG-001',
          registrationExpiry: new Date('2024-12-31'),
          insuranceProvider: 'State Farm',
          insurancePolicyNumber: 'SF-123456',
          insuranceExpiry: new Date('2024-06-30'),
          status: VehicleStatus.ACTIVE,
          isAvailable: true,
          purchasePrice: 28000,
          currentValue: 22000,
          totalMileage: 45000,
          currentMileage: 45000,
          lastOdometerReading: 45000,
          lastOdometerReadingDate: new Date(),
          createdAt: new Date('2022-01-15'),
          updatedAt: new Date(),
          createdBy: 'admin',
          updatedBy: 'admin'
        },
        {
          _id: '2',
          vehicleId: 'VH-002',
          make: 'Ford',
          model: 'Transit',
          year: 2021,
          vin: '1FTBW2CM8FKA12345',
          licensePlate: 'XYZ-789',
          color: 'White',
          vehicleType: VehicleType.VAN,
          category: VehicleCategory.COMMERCIAL,
          fuelType: FuelType.DIESEL,
          transmission: 'MANUAL' as any,
          ownershipType: OwnershipType.OWNED,
          registrationNumber: 'REG-002',
          registrationExpiry: new Date('2024-11-30'),
          insuranceProvider: 'Progressive',
          insurancePolicyNumber: 'PG-789012',
          insuranceExpiry: new Date('2024-05-31'),
          status: VehicleStatus.ACTIVE,
          isAvailable: false,
          currentDriver: 'driver-001',
          purchasePrice: 35000,
          currentValue: 28000,
          totalMileage: 78000,
          currentMileage: 78000,
          lastOdometerReading: 78000,
          lastOdometerReadingDate: new Date(),
          createdAt: new Date('2021-03-20'),
          updatedAt: new Date(),
          createdBy: 'admin',
          updatedBy: 'admin'
        }
      ]);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    const matchesType = typeFilter === 'all' || vehicle.vehicleType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: VehicleStatus) => {
    const statusConfig = {
      [VehicleStatus.ACTIVE]: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      [VehicleStatus.INACTIVE]: { color: 'bg-gray-100 text-gray-800', icon: Clock },
      [VehicleStatus.UNDER_MAINTENANCE]: { color: 'bg-yellow-100 text-yellow-800', icon: Wrench },
      [VehicleStatus.OUT_OF_SERVICE]: { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
      [VehicleStatus.RETIRED]: { color: 'bg-orange-100 text-orange-800', icon: Clock },
      [VehicleStatus.SOLD]: { color: 'bg-purple-100 text-purple-800', icon: DollarSign }
    };
    
    const config = statusConfig[status];
    
    // Fallback for undefined status
    if (!config) {
      return (
        <Badge className="bg-gray-100 text-gray-800 flex items-center gap-1">
          <Car className="h-3 w-3" />
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

  const getVehicleTypeBadge = (type: VehicleType) => {
    const typeConfig = {
      [VehicleType.CAR]: { color: 'bg-blue-100 text-blue-800', label: 'Car' },
      [VehicleType.TRUCK]: { color: 'bg-orange-100 text-orange-800', label: 'Truck' },
      [VehicleType.VAN]: { color: 'bg-green-100 text-green-800', label: 'Van' },
      [VehicleType.SUV]: { color: 'bg-purple-100 text-purple-800', label: 'SUV' },
      [VehicleType.MOTORCYCLE]: { color: 'bg-red-100 text-red-800', label: 'Motorcycle' },
      [VehicleType.BUS]: { color: 'bg-yellow-100 text-yellow-800', label: 'Bus' },
      [VehicleType.FORKLIFT]: { color: 'bg-gray-100 text-gray-800', label: 'Forklift' },
      [VehicleType.TRACTOR]: { color: 'bg-indigo-100 text-indigo-800', label: 'Tractor' },
      [VehicleType.TRAILER]: { color: 'bg-pink-100 text-pink-800', label: 'Trailer' },
      [VehicleType.OTHER]: { color: 'bg-gray-100 text-gray-800', label: 'Other' }
    };
    
    const config = typeConfig[type] || typeConfig[VehicleType.OTHER];
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getFuelTypeBadge = (fuelType: FuelType) => {
    const fuelConfig = {
      [FuelType.GASOLINE]: { color: 'bg-blue-100 text-blue-800', label: 'Gasoline' },
      [FuelType.DIESEL]: { color: 'bg-green-100 text-green-800', label: 'Diesel' },
      [FuelType.ELECTRIC]: { color: 'bg-purple-100 text-purple-800', label: 'Electric' },
      [FuelType.HYBRID]: { color: 'bg-yellow-100 text-yellow-800', label: 'Hybrid' },
      [FuelType.LPG]: { color: 'bg-orange-100 text-orange-800', label: 'LPG' },
      [FuelType.CNG]: { color: 'bg-cyan-100 text-cyan-800', label: 'CNG' },
      [FuelType.OTHER]: { color: 'bg-gray-100 text-gray-800', label: 'Other' }
    };
    
    const config = fuelConfig[fuelType] || fuelConfig[FuelType.OTHER];
    
    return (
      <Badge className={config.color}>
        {config.label}
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

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowVehicleForm(true);
  };

  const handleViewVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowVehicleDetail(true);
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      try {
        // TODO: Implement API call to delete vehicle
        // await fetch(`/api/fleet/vehicles/${vehicleId}`, { method: 'DELETE' });
        setVehicles(vehicles.filter(vehicle => vehicle._id !== vehicleId));
      } catch (error) {
        console.error('Error deleting vehicle:', error);
      }
    }
  };

  const handleVehicleSaved = (savedVehicle: Vehicle) => {
    if (editingVehicle) {
      setVehicles(vehicles.map(vehicle => vehicle._id === savedVehicle._id ? savedVehicle : vehicle));
    } else {
      setVehicles([...vehicles, savedVehicle]);
    }
    setShowVehicleForm(false);
    setEditingVehicle(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Vehicle Registry</h2>
          <p className="text-muted-foreground">
            Manage and track your vehicle fleet
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
          <Button onClick={() => setShowVehicleForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search vehicles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={VehicleStatus.ACTIVE}>Active</SelectItem>
                  <SelectItem value={VehicleStatus.INACTIVE}>Inactive</SelectItem>
                  <SelectItem value={VehicleStatus.UNDER_MAINTENANCE}>Under Maintenance</SelectItem>
                  <SelectItem value={VehicleStatus.OUT_OF_SERVICE}>Out of Service</SelectItem>
                  <SelectItem value={VehicleStatus.RETIRED}>Retired</SelectItem>
                  <SelectItem value={VehicleStatus.SOLD}>Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Vehicle Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value={VehicleType.CAR}>Car</SelectItem>
                  <SelectItem value={VehicleType.TRUCK}>Truck</SelectItem>
                  <SelectItem value={VehicleType.VAN}>Van</SelectItem>
                  <SelectItem value={VehicleType.SUV}>SUV</SelectItem>
                  <SelectItem value={VehicleType.MOTORCYCLE}>Motorcycle</SelectItem>
                  <SelectItem value={VehicleType.BUS}>Bus</SelectItem>
                  <SelectItem value={VehicleType.FORKLIFT}>Forklift</SelectItem>
                  <SelectItem value={VehicleType.OTHER}>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicles Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Vehicles ({filteredVehicles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle ID</TableHead>
                <TableHead>Make/Model</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>License Plate</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Fuel Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Mileage</TableHead>
                <TableHead>Current Value</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle._id}>
                  <TableCell className="font-medium">{vehicle.vehicleId}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{vehicle.make} {vehicle.model}</div>
                      <div className="text-sm text-muted-foreground">
                        VIN: {vehicle.vin}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{vehicle.year}</TableCell>
                  <TableCell className="font-mono">{vehicle.licensePlate}</TableCell>
                  <TableCell>{getVehicleTypeBadge(vehicle.vehicleType)}</TableCell>
                  <TableCell>{getFuelTypeBadge(vehicle.fuelType)}</TableCell>
                  <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Fuel className="h-3 w-3" />
                      {vehicle.currentMileage.toLocaleString()} mi
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {formatCurrency(vehicle.currentValue || 0)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewVehicle(vehicle)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditVehicle(vehicle)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteVehicle(vehicle._id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Vehicle Form Dialog */}
      <Dialog open={showVehicleForm} onOpenChange={setShowVehicleForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
            </DialogTitle>
          </DialogHeader>
          <VehicleForm
            vehicle={editingVehicle}
            onSave={handleVehicleSaved}
            onCancel={() => {
              setShowVehicleForm(false);
              setEditingVehicle(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Vehicle Detail Dialog */}
      <Dialog open={showVehicleDetail} onOpenChange={setShowVehicleDetail}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vehicle Details</DialogTitle>
          </DialogHeader>
          {selectedVehicle && (
            <VehicleDetailView
              vehicle={selectedVehicle}
              onEdit={() => {
                setShowVehicleDetail(false);
                handleEditVehicle(selectedVehicle);
              }}
              onClose={() => setShowVehicleDetail(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
