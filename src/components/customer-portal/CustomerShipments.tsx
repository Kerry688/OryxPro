'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Truck, 
  Search, 
  MapPin,
  Calendar,
  Package,
  Eye,
  Download,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertTriangle,
  Navigation
} from 'lucide-react';

// Mock data
const mockShipments = [
  {
    id: 'SH-2024-001',
    shipmentNumber: 'SH-2024-001',
    orderNumber: 'ORD-2024-001',
    carrier: 'DHL Express',
    trackingNumber: 'DHL1234567890',
    status: 'in_transit',
    shippingDate: '2024-04-14',
    estimatedDelivery: '2024-04-18',
    actualDelivery: null,
    totalWeight: 15.5,
    totalValue: 5250,
    deliveryAddress: '123 Business District, Cairo, Egypt',
    items: [
      {
        id: '1',
        productName: 'Industrial Printer HP LaserJet',
        productCode: 'HP-LJ-001',
        quantity: 1,
        unitWeight: 12.5,
        totalWeight: 12.5
      },
      {
        id: '2',
        productName: 'Office Chair Ergonomic',
        productCode: 'OC-ERG-001',
        quantity: 2,
        unitWeight: 1.5,
        totalWeight: 3.0
      }
    ],
    locationHistory: [
      {
        location: 'Origin Facility - Cairo',
        timestamp: '2024-04-14T08:00:00Z',
        status: 'Picked up',
        notes: 'Package picked up from sender'
      },
      {
        location: 'Sorting Facility - Alexandria',
        timestamp: '2024-04-14T16:30:00Z',
        status: 'In transit',
        notes: 'Package sorted and dispatched'
      },
      {
        location: 'Distribution Center - Cairo',
        timestamp: '2024-04-15T10:15:00Z',
        status: 'In transit',
        notes: 'Package arrived at distribution center'
      }
    ]
  },
  {
    id: 'SH-2024-002',
    shipmentNumber: 'SH-2024-002',
    orderNumber: 'ORD-2024-002',
    carrier: 'FedEx',
    trackingNumber: 'FEDX9876543210',
    status: 'delivered',
    shippingDate: '2024-04-10',
    estimatedDelivery: '2024-04-15',
    actualDelivery: '2024-04-15',
    totalWeight: 8.2,
    totalValue: 3200,
    deliveryAddress: '456 Industrial Zone, Alexandria, Egypt',
    signatureReceived: true,
    items: [
      {
        id: '1',
        productName: 'Network Switch 24-Port',
        productCode: 'NS-24-001',
        quantity: 1,
        unitWeight: 5.2,
        totalWeight: 5.2
      },
      {
        id: '2',
        productName: 'CAT6 Ethernet Cable',
        productCode: 'CAT6-100',
        quantity: 2,
        unitWeight: 1.5,
        totalWeight: 3.0
      }
    ],
    locationHistory: [
      {
        location: 'Origin Facility - Alexandria',
        timestamp: '2024-04-10T09:00:00Z',
        status: 'Picked up',
        notes: 'Package picked up from sender'
      },
      {
        location: 'Sorting Facility - Cairo',
        timestamp: '2024-04-11T14:20:00Z',
        status: 'In transit',
        notes: 'Package sorted and dispatched'
      },
      {
        location: 'Out for delivery',
        timestamp: '2024-04-15T07:30:00Z',
        status: 'Out for delivery',
        notes: 'Package is out for delivery'
      },
      {
        location: 'Delivered',
        timestamp: '2024-04-15T15:45:00Z',
        status: 'Delivered',
        notes: 'Package delivered successfully'
      }
    ]
  },
  {
    id: 'SH-2024-003',
    shipmentNumber: 'SH-2024-003',
    orderNumber: 'ORD-2024-003',
    carrier: 'Aramex',
    trackingNumber: 'ARX4567891234',
    status: 'pending',
    shippingDate: null,
    estimatedDelivery: '2024-04-20',
    actualDelivery: null,
    totalWeight: 2.0,
    totalValue: 1800,
    deliveryAddress: '123 Business District, Cairo, Egypt',
    items: [
      {
        id: '1',
        productName: 'Wireless Mouse Logitech',
        productCode: 'WM-LOG-001',
        quantity: 10,
        unitWeight: 0.2,
        totalWeight: 2.0
      }
    ],
    locationHistory: []
  }
];

export function CustomerShipments() {
  const [shipments, setShipments] = useState(mockShipments);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [isTrackingDialogOpen, setIsTrackingDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusBadge = (status: string) => {
    const configs = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'picked_up': 'bg-blue-100 text-blue-800',
      'in_transit': 'bg-blue-100 text-blue-800',
      'out_for_delivery': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'failed_delivery': 'bg-red-100 text-red-800',
      'returned': 'bg-gray-100 text-gray-800'
    };
    return configs[status as keyof typeof configs] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'picked_up':
      case 'in_transit':
        return <Truck className="h-4 w-4 text-blue-600" />;
      case 'out_for_delivery':
        return <Navigation className="h-4 w-4 text-purple-600" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed_delivery':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateOnly = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleTrackShipment = (shipment: any) => {
    setSelectedShipment(shipment);
    setIsTrackingDialogOpen(true);
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.carrier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeShipments = shipments.filter(s => ['pending', 'picked_up', 'in_transit', 'out_for_delivery'].includes(s.status)).length;
  const deliveredShipments = shipments.filter(s => s.status === 'delivered').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Shipments & Tracking</h2>
          <p className="text-muted-foreground">Track your orders and monitor delivery status</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh All
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeShipments}</div>
            <p className="text-xs text-muted-foreground">
              Currently in transit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{deliveredShipments}</div>
            <p className="text-xs text-muted-foreground">
              Successfully delivered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shipments.length}</div>
            <p className="text-xs text-muted-foreground">
              All time shipments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by tracking number, order, or carrier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="failed_delivery">Failed Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipments List */}
      <div className="space-y-4">
        {filteredShipments.map((shipment) => (
          <Card key={shipment.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    {getStatusIcon(shipment.status)}
                  </div>
                  <div>
                    <div className="font-medium">{shipment.trackingNumber}</div>
                    <div className="text-sm text-muted-foreground">
                      {shipment.carrier} • Order: {shipment.orderNumber}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium">{shipment.totalWeight} kg</div>
                    <div className="text-sm text-muted-foreground">
                      {shipment.items.length} items
                    </div>
                  </div>
                  <Badge className={getStatusBadge(shipment.status)}>
                    {shipment.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-muted-foreground">
                    {shipment.shippingDate ? 'Shipped:' : 'Expected:'}
                  </span>
                  <span>
                    {shipment.shippingDate 
                      ? formatDateOnly(shipment.shippingDate)
                      : formatDateOnly(shipment.estimatedDelivery)
                    }
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-muted-foreground">Deliver to:</span>
                  <span className="truncate">{shipment.deliveryAddress}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Package className="h-4 w-4 text-gray-400" />
                  <span className="text-muted-foreground">Value:</span>
                  <span>EGP {shipment.totalValue.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleTrackShipment(shipment)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Track Package
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Delivery Note
                  </Button>
                </div>
                {shipment.status === 'delivered' && (
                  <Button variant="outline" size="sm">
                    Request Return
                  </Button>
                )}
                {shipment.status === 'failed_delivery' && (
                  <Button variant="outline" size="sm">
                    Reschedule Delivery
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tracking Dialog */}
      <Dialog open={isTrackingDialogOpen} onOpenChange={setIsTrackingDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Package Tracking - {selectedShipment?.trackingNumber}</DialogTitle>
            <DialogDescription>
              Real-time tracking information for your shipment
            </DialogDescription>
          </DialogHeader>
          
          {selectedShipment && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Shipment Details</h4>
                  <div className="space-y-2 text-sm">
                    <div>Tracking Number: {selectedShipment.trackingNumber}</div>
                    <div>Carrier: {selectedShipment.carrier}</div>
                    <div>Order Number: {selectedShipment.orderNumber}</div>
                    <div>Status: <Badge className={getStatusBadge(selectedShipment.status)}>{selectedShipment.status.replace('_', ' ')}</Badge></div>
                    <div>Total Weight: {selectedShipment.totalWeight} kg</div>
                    <div>Total Value: EGP {selectedShipment.totalValue.toLocaleString()}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Delivery Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>Delivery Address: {selectedShipment.deliveryAddress}</div>
                    {selectedShipment.shippingDate && <div>Shipped Date: {formatDateOnly(selectedShipment.shippingDate)}</div>}
                    <div>Estimated Delivery: {formatDateOnly(selectedShipment.estimatedDelivery)}</div>
                    {selectedShipment.actualDelivery && <div>Actual Delivery: {formatDateOnly(selectedShipment.actualDelivery)}</div>}
                    {selectedShipment.signatureReceived && <div>Signature: Received</div>}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Package Contents</h4>
                <div className="space-y-4">
                  {selectedShipment.items.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-sm text-muted-foreground">{item.productCode}</div>
                        <div className="text-sm">Quantity: {item.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{item.totalWeight} kg</div>
                        <div className="text-sm text-muted-foreground">total weight</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Tracking History</h4>
                {selectedShipment.locationHistory.length > 0 ? (
                  <div className="space-y-4">
                    {selectedShipment.locationHistory.map((location: any, index: number) => (
                      <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          {getStatusIcon(location.status.toLowerCase().replace(' ', '_'))}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{location.location}</div>
                          <div className="text-sm text-muted-foreground mb-1">
                            {formatDate(location.timestamp)}
                          </div>
                          <div className="text-sm">
                            <Badge className={getStatusBadge(location.status.toLowerCase().replace(' ', '_'))}>
                              {location.status}
                            </Badge>
                          </div>
                          {location.notes && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {location.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No tracking information available yet
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Last updated: {selectedShipment.locationHistory.length > 0 
                    ? formatDate(selectedShipment.locationHistory[selectedShipment.locationHistory.length - 1].timestamp)
                    : 'No updates yet'
                  }
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Tracking
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Details
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
