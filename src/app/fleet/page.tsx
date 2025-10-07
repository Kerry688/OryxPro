'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Car, 
  Plus, 
  Users, 
  MapPin,
  Fuel,
  Wrench,
  Circle,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  Settings,
  Navigation,
  FileText,
  Activity
} from 'lucide-react';
import { VehicleRegistry } from '@/components/fleet/VehicleRegistry';
import { DriverManagement } from '@/components/fleet/DriverManagement';
import { TripTracking } from '@/components/fleet/TripTracking';
import { FuelManagement } from '@/components/fleet/FuelManagement';
import { FleetMaintenance } from '@/components/fleet/FleetMaintenance';
import { TireManagement } from '@/components/fleet/TireManagement';
import { FleetAnalytics } from '@/components/fleet/FleetAnalytics';

export default function FleetPage() {
  const [activeTab, setActiveTab] = useState('vehicles');
  const [fleetData, setFleetData] = useState({
    totalVehicles: 0,
    activeVehicles: 0,
    totalDrivers: 0,
    activeTrips: 0,
    maintenanceDue: 0,
    fuelCosts: 0,
    complianceRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFleetData();
  }, []);

  const loadFleetData = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call to fetch fleet data
      // const response = await fetch('/api/fleet/analytics');
      // const data = await response.json();
      // setFleetData(data);
      
      // Mock data for now
      setFleetData({
        totalVehicles: 45,
        activeVehicles: 42,
        totalDrivers: 38,
        activeTrips: 8,
        maintenanceDue: 12,
        fuelCosts: 15680,
        complianceRate: 94
      });
    } catch (error) {
      console.error('Error loading fleet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOverviewCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
          <Car className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{fleetData.totalVehicles}</div>
          <p className="text-xs text-muted-foreground">
            {fleetData.activeVehicles} active
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{fleetData.totalDrivers}</div>
          <p className="text-xs text-muted-foreground">
            {fleetData.activeTrips} on trips
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Maintenance Due</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{fleetData.maintenanceDue}</div>
          <p className="text-xs text-muted-foreground">
            Vehicles need service
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Fuel Cost</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${fleetData.fuelCosts.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Compliance: {fleetData.complianceRate}%
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderQuickActions = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <Plus className="h-6 w-6" />
            <span>Add Vehicle</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <Navigation className="h-6 w-6" />
            <span>Start Trip</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <Fuel className="h-6 w-6" />
            <span>Record Fuel</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <Wrench className="h-6 w-6" />
            <span>Schedule Service</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderAlerts = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Fleet Alerts & Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="font-medium">3 Vehicles Overdue for Maintenance</p>
                <p className="text-sm text-gray-600">Critical maintenance tasks are overdue</p>
              </div>
            </div>
            <Button variant="outline" size="sm">View Details</Button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="font-medium">5 Driver Licenses Expiring Soon</p>
                <p className="text-sm text-gray-600">Renewal required within 30 days</p>
              </div>
            </div>
            <Button variant="outline" size="sm">View Details</Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">2 Vehicle Registrations Expiring</p>
                <p className="text-sm text-gray-600">Registration renewal required</p>
              </div>
            </div>
            <Button variant="outline" size="sm">View Details</Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Circle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="font-medium">4 Vehicles Need Tire Inspection</p>
                <p className="text-sm text-gray-600">Tire wear approaching replacement threshold</p>
              </div>
            </div>
            <Button variant="outline" size="sm">View Details</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderFleetStatus = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Fleet Status Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Vehicle Status</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Active</span>
                </div>
                <Badge className="bg-green-100 text-green-800">{fleetData.activeVehicles}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Under Maintenance</span>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">3</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-sm">Out of Service</span>
                </div>
                <Badge className="bg-gray-100 text-gray-800">2</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Driver Status</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Available</span>
                </div>
                <Badge className="bg-green-100 text-green-800">30</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">On Trip</span>
                </div>
                <Badge className="bg-blue-100 text-blue-800">{fleetData.activeTrips}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Off Duty</span>
                </div>
                <Badge className="bg-orange-100 text-orange-800">8</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Compliance</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">License Valid</span>
                </div>
                <Badge className="bg-green-100 text-green-800">94%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Registration Current</span>
                </div>
                <Badge className="bg-green-100 text-green-800">98%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Insurance Active</span>
                </div>
                <Badge className="bg-green-100 text-green-800">100%</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fleet Management</h1>
          <p className="text-muted-foreground">
            Manage your vehicle fleet, drivers, trips, and maintenance operations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Reports
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      {renderOverviewCards()}

      {/* Quick Actions */}
      {renderQuickActions()}

      {/* Fleet Status */}
      {renderFleetStatus()}

      {/* Alerts */}
      {renderAlerts()}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="vehicles" className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            Vehicles
          </TabsTrigger>
          <TabsTrigger value="drivers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Drivers
          </TabsTrigger>
          <TabsTrigger value="trips" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Trips
          </TabsTrigger>
          <TabsTrigger value="fuel" className="flex items-center gap-2">
            <Fuel className="h-4 w-4" />
            Fuel
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Maintenance
          </TabsTrigger>
          <TabsTrigger value="tires" className="flex items-center gap-2">
            <Circle className="h-4 w-4" />
            Tires
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vehicles" className="mt-6">
          <VehicleRegistry />
        </TabsContent>

        <TabsContent value="drivers" className="mt-6">
          <DriverManagement />
        </TabsContent>

        <TabsContent value="trips" className="mt-6">
          <TripTracking />
        </TabsContent>

        <TabsContent value="fuel" className="mt-6">
          <FuelManagement />
        </TabsContent>

        <TabsContent value="maintenance" className="mt-6">
          <FleetMaintenance />
        </TabsContent>

        <TabsContent value="tires" className="mt-6">
          <TireManagement />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <FleetAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
