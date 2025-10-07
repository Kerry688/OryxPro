'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Edit, 
  Download, 
  Car,
  MapPin,
  User,
  Calendar,
  DollarSign,
  Fuel,
  FileText,
  Wrench,
  BarChart3,
  Settings
} from 'lucide-react';
import { Vehicle, VehicleStatus, VehicleType, FuelType } from '@/lib/models/fleet';

interface VehicleDetailViewProps {
  vehicle: Vehicle;
  onEdit: () => void;
  onClose: () => void;
}

export function VehicleDetailView({ vehicle, onEdit, onClose }: VehicleDetailViewProps) {
  const getStatusBadge = (status: VehicleStatus) => {
    const statusConfig = {
      [VehicleStatus.ACTIVE]: { color: 'bg-green-100 text-green-800' },
      [VehicleStatus.INACTIVE]: { color: 'bg-gray-100 text-gray-800' },
      [VehicleStatus.UNDER_MAINTENANCE]: { color: 'bg-yellow-100 text-yellow-800' },
      [VehicleStatus.OUT_OF_SERVICE]: { color: 'bg-red-100 text-red-800' },
      [VehicleStatus.RETIRED]: { color: 'bg-orange-100 text-orange-800' },
      [VehicleStatus.SOLD]: { color: 'bg-purple-100 text-purple-800' }
    };
    
    const config = statusConfig[status];
    
    return (
      <Badge className={config?.color || 'bg-gray-100 text-gray-800'}>
        {status.replace('_', ' ')}
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{vehicle.make} {vehicle.model}</h2>
          <p className="text-muted-foreground">
            {vehicle.vehicleId} • {vehicle.year} • {vehicle.licensePlate}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="trips">Trips</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(vehicle.currentValue || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  Purchase: {formatCurrency(vehicle.purchasePrice || 0)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mileage</CardTitle>
                <Fuel className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{vehicle.currentMileage.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Total: {vehicle.totalMileage.toLocaleString()} mi
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="mb-2">{getStatusBadge(vehicle.status)}</div>
                <p className="text-xs text-muted-foreground">
                  {vehicle.isAvailable ? 'Available' : 'Not Available'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Registration</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatDate(vehicle.registrationExpiry)}</div>
                <p className="text-xs text-muted-foreground">
                  Expires {formatDate(vehicle.registrationExpiry)}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Make/Model</label>
                    <p className="text-sm">{vehicle.make} {vehicle.model}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Year</label>
                    <p className="text-sm">{vehicle.year}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">VIN</label>
                    <p className="text-sm font-mono">{vehicle.vin}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">License Plate</label>
                    <p className="text-sm font-mono">{vehicle.licensePlate}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Color</label>
                    <p className="text-sm">{vehicle.color || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Vehicle Type</label>
                    <p className="text-sm">{vehicle.vehicleType.replace('_', ' ')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technical Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Fuel Type</label>
                    <p className="text-sm">{vehicle.fuelType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Transmission</label>
                    <p className="text-sm">{vehicle.transmission}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Category</label>
                    <p className="text-sm">{vehicle.category}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Ownership</label>
                    <p className="text-sm">{vehicle.ownershipType}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No maintenance records available</p>
                <p className="text-sm">Maintenance history will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trips" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trip History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No trip records available</p>
                <p className="text-sm">Trip history will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No documents uploaded</p>
                <p className="text-sm">Vehicle documents will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
