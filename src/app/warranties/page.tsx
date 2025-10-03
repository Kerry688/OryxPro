'use client';

import React, { useState } from 'react';
import { WarrantyCardList } from '@/components/features/WarrantyCardList';
import { WarrantyCard } from '@/lib/models/warranty-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  User,
  Package,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

export default function WarrantiesPage() {
  const [selectedWarranty, setSelectedWarranty] = useState<WarrantyCard | null>(null);
  const [activeTab, setActiveTab] = useState('list');

  const handleWarrantySelect = (warranty: WarrantyCard) => {
    setSelectedWarranty(warranty);
    setActiveTab('details');
  };

  const handleClaimCreate = (warranty: WarrantyCard) => {
    setSelectedWarranty(warranty);
    setActiveTab('claims');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'expired':
        return <Clock className="h-4 w-4 text-gray-500" />;
      case 'void':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'claimed':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'under_review':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      case 'void':
        return 'bg-red-100 text-red-800';
      case 'claimed':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Warranty Management</h1>
            <p className="text-gray-600">Manage warranty cards, claims, and analytics</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Warranties</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <Shield className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Claims</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold">0%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Warranty Cards</TabsTrigger>
            <TabsTrigger value="claims">Claims</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            {selectedWarranty && (
              <TabsTrigger value="details">Details</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="list">
            <WarrantyCardList 
              onWarrantySelect={handleWarrantySelect}
              onClaimCreate={handleClaimCreate}
            />
          </TabsContent>

          <TabsContent value="claims">
            <Card>
              <CardHeader>
                <CardTitle>Warranty Claims</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Claims management coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Warranty Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Analytics dashboard coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {selectedWarranty && (
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getStatusIcon(selectedWarranty.status)}
                        Warranty Details
                      </CardTitle>
                      <p className="text-gray-600">{selectedWarranty.warrantyNumber}</p>
                    </div>
                    <Badge className={getStatusColor(selectedWarranty.status)}>
                      {selectedWarranty.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Product Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Product Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Product Name</label>
                        <p className="text-sm">{selectedWarranty.productName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">SKU</label>
                        <p className="text-sm">{selectedWarranty.productSku}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Serial Number</label>
                        <p className="text-sm">{selectedWarranty.serialNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Batch Number</label>
                        <p className="text-sm">{selectedWarranty.batchNumber || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Customer Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Customer Name</label>
                        <p className="text-sm">{selectedWarranty.customerName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Email</label>
                        <p className="text-sm">{selectedWarranty.customerEmail}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Phone</label>
                        <p className="text-sm">{selectedWarranty.customerPhone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Warranty Details */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Warranty Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Warranty Type</label>
                        <p className="text-sm">{selectedWarranty.warrantyType}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Duration</label>
                        <p className="text-sm">{selectedWarranty.duration} months</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Start Date</label>
                        <p className="text-sm">{new Date(selectedWarranty.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">End Date</label>
                        <p className="text-sm">{new Date(selectedWarranty.endDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Purchase Price</label>
                        <p className="text-sm">${selectedWarranty.purchasePrice}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Total Claims</label>
                        <p className="text-sm">{selectedWarranty.totalClaims}</p>
                      </div>
                    </div>
                  </div>

                  {/* Coverage Details */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Coverage Details</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${selectedWarranty.coverage.parts ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-sm">Parts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${selectedWarranty.coverage.labor ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-sm">Labor</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${selectedWarranty.coverage.shipping ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-sm">Shipping</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${selectedWarranty.coverage.replacement ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-sm">Replacement</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${selectedWarranty.coverage.repair ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-sm">Repair</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <Button onClick={() => handleClaimCreate(selectedWarranty)}>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Create Claim
                    </Button>
                    <Button variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      View Claims
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
