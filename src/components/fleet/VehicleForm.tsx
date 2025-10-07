'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Save, 
  X, 
  Car, 
  DollarSign, 
  MapPin, 
  User, 
  Settings,
  Calendar,
  FileText,
  Fuel,
  Wrench
} from 'lucide-react';
import { 
  Vehicle, 
  VehicleType, 
  VehicleStatus, 
  VehicleCategory,
  FuelType,
  TransmissionType,
  OwnershipType
} from '@/lib/models/fleet';
import { useToast } from '@/hooks/use-toast';

interface VehicleFormProps {
  vehicle?: Vehicle | null;
  onSave: (vehicle: Vehicle) => void;
  onCancel: () => void;
}

export function VehicleForm({ vehicle, onSave, onCancel }: VehicleFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Vehicle>>({
    vehicleId: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    vin: '',
    licensePlate: '',
    color: '',
    vehicleType: VehicleType.CAR,
    category: VehicleCategory.PASSENGER,
    fuelType: FuelType.GASOLINE,
    transmission: TransmissionType.AUTOMATIC,
    ownershipType: OwnershipType.OWNED,
    registrationNumber: '',
    registrationExpiry: new Date(),
    insuranceProvider: '',
    insurancePolicyNumber: '',
    insuranceExpiry: new Date(),
    status: VehicleStatus.ACTIVE,
    isAvailable: true,
    purchasePrice: 0,
    currentValue: 0,
    totalMileage: 0,
    currentMileage: 0,
    lastOdometerReading: 0,
    lastOdometerReadingDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'current-user',
    updatedBy: 'current-user'
  });

  useEffect(() => {
    if (vehicle) {
      setFormData(vehicle);
    } else {
      // Generate new vehicle ID
      generateVehicleId();
    }
  }, [vehicle]);

  const generateVehicleId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const vehicleId = `VH-${timestamp}-${random}`;
    setFormData(prev => ({ ...prev, vehicleId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.make || !formData.model || !formData.vehicleId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const vehicleData: Vehicle = {
        ...formData,
        _id: vehicle?._id || undefined,
        vehicleId: formData.vehicleId!,
        make: formData.make!,
        model: formData.model!,
        year: formData.year!,
        vin: formData.vin!,
        licensePlate: formData.licensePlate!,
        vehicleType: formData.vehicleType!,
        category: formData.category!,
        fuelType: formData.fuelType!,
        transmission: formData.transmission!,
        ownershipType: formData.ownershipType!,
        registrationNumber: formData.registrationNumber!,
        registrationExpiry: formData.registrationExpiry!,
        status: formData.status!,
        isAvailable: formData.isAvailable!,
        purchasePrice: formData.purchasePrice!,
        currentValue: formData.currentValue!,
        totalMileage: formData.totalMileage!,
        currentMileage: formData.currentMileage!,
        lastOdometerReading: formData.lastOdometerReading!,
        lastOdometerReadingDate: formData.lastOdometerReadingDate!,
        createdAt: vehicle?.createdAt || new Date(),
        updatedAt: new Date(),
        createdBy: vehicle?.createdBy || 'current-user',
        updatedBy: 'current-user'
      } as Vehicle;

      // TODO: Implement API call to save vehicle
      // const response = await fetch(vehicle?._id ? `/api/fleet/vehicles/${vehicle._id}` : '/api/fleet/vehicles', {
      //   method: vehicle?._id ? 'PUT' : 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(vehicleData)
      // });
      
      // if (!response.ok) throw new Error('Failed to save vehicle');
      
      // const savedVehicle = await response.json();
      
      // Simulate API call
      const savedVehicle = { ...vehicleData, _id: vehicle?._id || Date.now().toString() };
      
      onSave(savedVehicle);
      
      toast({
        title: "Success",
        description: vehicle ? "Vehicle updated successfully" : "Vehicle created successfully",
      });
    } catch (error) {
      console.error('Error saving vehicle:', error);
      toast({
        title: "Error",
        description: "Failed to save vehicle. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderBasicInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="vehicleId">Vehicle ID *</Label>
            <Input
              id="vehicleId"
              value={formData.vehicleId || ''}
              onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
              placeholder="VH-001"
              required
            />
          </div>
          <div>
            <Label htmlFor="year">Year *</Label>
            <Input
              id="year"
              type="number"
              value={formData.year || ''}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })}
              placeholder="2023"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="make">Make *</Label>
            <Input
              id="make"
              value={formData.make || ''}
              onChange={(e) => setFormData({ ...formData, make: e.target.value })}
              placeholder="Toyota"
              required
            />
          </div>
          <div>
            <Label htmlFor="model">Model *</Label>
            <Input
              id="model"
              value={formData.model || ''}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              placeholder="Camry"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="vin">VIN *</Label>
            <Input
              id="vin"
              value={formData.vin || ''}
              onChange={(e) => setFormData({ ...formData, vin: e.target.value.toUpperCase() })}
              placeholder="1HGBH41JXMN109186"
              required
            />
          </div>
          <div>
            <Label htmlFor="licensePlate">License Plate *</Label>
            <Input
              id="licensePlate"
              value={formData.licensePlate || ''}
              onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
              placeholder="ABC-123"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            value={formData.color || ''}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            placeholder="Silver"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="vehicleType">Vehicle Type *</Label>
            <Select value={formData.vehicleType} onValueChange={(value) => setFormData({ ...formData, vehicleType: value as VehicleType })}>
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={VehicleType.CAR}>Car</SelectItem>
                <SelectItem value={VehicleType.TRUCK}>Truck</SelectItem>
                <SelectItem value={VehicleType.VAN}>Van</SelectItem>
                <SelectItem value={VehicleType.SUV}>SUV</SelectItem>
                <SelectItem value={VehicleType.MOTORCYCLE}>Motorcycle</SelectItem>
                <SelectItem value={VehicleType.BUS}>Bus</SelectItem>
                <SelectItem value={VehicleType.FORKLIFT}>Forklift</SelectItem>
                <SelectItem value={VehicleType.TRACTOR}>Tractor</SelectItem>
                <SelectItem value={VehicleType.TRAILER}>Trailer</SelectItem>
                <SelectItem value={VehicleType.OTHER}>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value as VehicleCategory })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={VehicleCategory.PASSENGER}>Passenger</SelectItem>
                <SelectItem value={VehicleCategory.COMMERCIAL}>Commercial</SelectItem>
                <SelectItem value={VehicleCategory.CONSTRUCTION}>Construction</SelectItem>
                <SelectItem value={VehicleCategory.AGRICULTURAL}>Agricultural</SelectItem>
                <SelectItem value={VehicleCategory.EMERGENCY}>Emergency</SelectItem>
                <SelectItem value={VehicleCategory.GOVERNMENT}>Government</SelectItem>
                <SelectItem value={VehicleCategory.OTHER}>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fuelType">Fuel Type *</Label>
            <Select value={formData.fuelType} onValueChange={(value) => setFormData({ ...formData, fuelType: value as FuelType })}>
              <SelectTrigger>
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={FuelType.GASOLINE}>Gasoline</SelectItem>
                <SelectItem value={FuelType.DIESEL}>Diesel</SelectItem>
                <SelectItem value={FuelType.ELECTRIC}>Electric</SelectItem>
                <SelectItem value={FuelType.HYBRID}>Hybrid</SelectItem>
                <SelectItem value={FuelType.LPG}>LPG</SelectItem>
                <SelectItem value={FuelType.CNG}>CNG</SelectItem>
                <SelectItem value={FuelType.OTHER}>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="transmission">Transmission *</Label>
            <Select value={formData.transmission} onValueChange={(value) => setFormData({ ...formData, transmission: value as TransmissionType })}>
              <SelectTrigger>
                <SelectValue placeholder="Select transmission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TransmissionType.MANUAL}>Manual</SelectItem>
                <SelectItem value={TransmissionType.AUTOMATIC}>Automatic</SelectItem>
                <SelectItem value={TransmissionType.CVT}>CVT</SelectItem>
                <SelectItem value={TransmissionType.SEMI_AUTOMATIC}>Semi-Automatic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderRegistrationInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Registration & Insurance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ownershipType">Ownership Type *</Label>
            <Select value={formData.ownershipType} onValueChange={(value) => setFormData({ ...formData, ownershipType: value as OwnershipType })}>
              <SelectTrigger>
                <SelectValue placeholder="Select ownership type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={OwnershipType.OWNED}>Owned</SelectItem>
                <SelectItem value={OwnershipType.LEASED}>Leased</SelectItem>
                <SelectItem value={OwnershipType.RENTED}>Rented</SelectItem>
                <SelectItem value={OwnershipType.COMPANY}>Company</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="registrationNumber">Registration Number *</Label>
            <Input
              id="registrationNumber"
              value={formData.registrationNumber || ''}
              onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
              placeholder="REG-001"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="registrationExpiry">Registration Expiry *</Label>
          <Input
            id="registrationExpiry"
            type="date"
            value={formData.registrationExpiry ? new Date(formData.registrationExpiry).toISOString().split('T')[0] : ''}
            onChange={(e) => setFormData({ ...formData, registrationExpiry: new Date(e.target.value) })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="insuranceProvider">Insurance Provider</Label>
            <Input
              id="insuranceProvider"
              value={formData.insuranceProvider || ''}
              onChange={(e) => setFormData({ ...formData, insuranceProvider: e.target.value })}
              placeholder="State Farm"
            />
          </div>
          <div>
            <Label htmlFor="insurancePolicyNumber">Insurance Policy Number</Label>
            <Input
              id="insurancePolicyNumber"
              value={formData.insurancePolicyNumber || ''}
              onChange={(e) => setFormData({ ...formData, insurancePolicyNumber: e.target.value })}
              placeholder="SF-123456"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="insuranceExpiry">Insurance Expiry</Label>
          <Input
            id="insuranceExpiry"
            type="date"
            value={formData.insuranceExpiry ? new Date(formData.insuranceExpiry).toISOString().split('T')[0] : ''}
            onChange={(e) => setFormData({ ...formData, insuranceExpiry: new Date(e.target.value) })}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderFinancialInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Financial Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="purchasePrice">Purchase Price</Label>
            <Input
              id="purchasePrice"
              type="number"
              value={formData.purchasePrice || ''}
              onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label htmlFor="currentValue">Current Value</Label>
            <Input
              id="currentValue"
              type="number"
              value={formData.currentValue || ''}
              onChange={(e) => setFormData({ ...formData, currentValue: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
            />
          </div>
        </div>

        {formData.ownershipType === OwnershipType.LEASED && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="leaseRate">Monthly Lease Rate</Label>
              <Input
                id="leaseRate"
                type="number"
                value={formData.leaseRate || ''}
                onChange={(e) => setFormData({ ...formData, leaseRate: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="leaseEndDate">Lease End Date</Label>
              <Input
                id="leaseEndDate"
                type="date"
                value={formData.leaseEndDate ? new Date(formData.leaseEndDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({ ...formData, leaseEndDate: new Date(e.target.value) })}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderMileageInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fuel className="h-5 w-5" />
          Mileage Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="totalMileage">Total Mileage</Label>
            <Input
              id="totalMileage"
              type="number"
              value={formData.totalMileage || ''}
              onChange={(e) => setFormData({ ...formData, totalMileage: parseInt(e.target.value) || 0 })}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="currentMileage">Current Mileage</Label>
            <Input
              id="currentMileage"
              type="number"
              value={formData.currentMileage || ''}
              onChange={(e) => setFormData({ ...formData, currentMileage: parseInt(e.target.value) || 0 })}
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="lastOdometerReading">Last Odometer Reading</Label>
            <Input
              id="lastOdometerReading"
              type="number"
              value={formData.lastOdometerReading || ''}
              onChange={(e) => setFormData({ ...formData, lastOdometerReading: parseInt(e.target.value) || 0 })}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="lastOdometerReadingDate">Last Reading Date</Label>
            <Input
              id="lastOdometerReadingDate"
              type="date"
              value={formData.lastOdometerReadingDate ? new Date(formData.lastOdometerReadingDate).toISOString().split('T')[0] : ''}
              onChange={(e) => setFormData({ ...formData, lastOdometerReadingDate: new Date(e.target.value) })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStatusInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Status & Availability
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="status">Status *</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as VehicleStatus })}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={VehicleStatus.ACTIVE}>Active</SelectItem>
              <SelectItem value={VehicleStatus.INACTIVE}>Inactive</SelectItem>
              <SelectItem value={VehicleStatus.UNDER_MAINTENANCE}>Under Maintenance</SelectItem>
              <SelectItem value={VehicleStatus.OUT_OF_SERVICE}>Out of Service</SelectItem>
              <SelectItem value={VehicleStatus.RETIRED}>Retired</SelectItem>
              <SelectItem value={VehicleStatus.SOLD}>Sold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isAvailable"
            checked={formData.isAvailable || false}
            onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
          />
          <Label htmlFor="isAvailable">Vehicle is available for use</Label>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="registration">Registration</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="mileage">Mileage</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          {renderBasicInfo()}
        </TabsContent>

        <TabsContent value="registration" className="space-y-4">
          {renderRegistrationInfo()}
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          {renderFinancialInfo()}
        </TabsContent>

        <TabsContent value="mileage" className="space-y-4">
          {renderMileageInfo()}
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          {renderStatusInfo()}
        </TabsContent>
      </Tabs>

      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : (vehicle ? 'Update Vehicle' : 'Create Vehicle')}
        </Button>
      </div>
    </form>
  );
}
