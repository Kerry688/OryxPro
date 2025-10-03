'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  WarrantyCard, 
  WarrantyStatus 
} from '@/lib/models/warranty';
import { Product } from '@/lib/models/product';
import { 
  Shield, 
  Calendar, 
  User, 
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Eye
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { WarrantyCardForm } from './WarrantyCardForm';

interface ProductWarrantyInfoProps {
  product: Product;
  onWarrantyCreate?: (warranty: WarrantyCard) => void;
}

export function ProductWarrantyInfo({ product, onWarrantyCreate }: ProductWarrantyInfoProps) {
  const [warranties, setWarranties] = useState<WarrantyCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadWarranties();
  }, [product._id]);

  const loadWarranties = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/warranties?productId=${product._id}`);
      const data = await response.json();

      if (data.success) {
        setWarranties(data.data);
      }
    } catch (error) {
      console.error('Error loading warranties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWarranty = async (data: any) => {
    try {
      const response = await fetch('/api/warranties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setShowForm(false);
        loadWarranties();
        onWarrantyCreate?.(result.data);
      } else {
        console.error('Error creating warranty:', result.error);
      }
    } catch (error) {
      console.error('Error creating warranty:', error);
    }
  };

  const getStatusIcon = (status: WarrantyStatus) => {
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

  const getStatusColor = (status: WarrantyStatus) => {
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

  const isExpired = (endDate: Date) => {
    return new Date() > new Date(endDate);
  };

  const activeWarranties = warranties.filter(w => w.status === 'active' && !isExpired(w.endDate));
  const expiredWarranties = warranties.filter(w => w.status === 'expired' || isExpired(w.endDate));
  const totalClaims = warranties.reduce((sum, w) => sum + w.totalClaims, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Warranty Information
          </CardTitle>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Warranty
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Warranty Card</DialogTitle>
              </DialogHeader>
              <WarrantyCardForm
                onSave={handleCreateWarranty}
                onCancel={() => setShowForm(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Warranty Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{activeWarranties.length}</div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{expiredWarranties.length}</div>
                <div className="text-sm text-gray-600">Expired</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalClaims}</div>
                <div className="text-sm text-gray-600">Total Claims</div>
              </div>
            </div>

            {/* Product Warranty Info */}
            {product.warranty && (
              <div className="p-4 bg-gray-50 rounded-md">
                <h4 className="font-medium mb-2">Product Warranty Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Duration:</span>
                    <p>{product.warranty.period} months</p>
                  </div>
                  <div>
                    <span className="font-medium">Terms:</span>
                    <p className="truncate">{product.warranty.terms}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Warranties */}
            {warranties.length > 0 ? (
              <div>
                <h4 className="font-medium mb-3">Recent Warranty Cards</h4>
                <div className="space-y-2">
                  {warranties.slice(0, 3).map((warranty) => (
                    <div key={warranty._id?.toString()} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(warranty.status)}
                        <div>
                          <div className="font-medium text-sm">{warranty.warrantyNumber}</div>
                          <div className="text-xs text-gray-600">{warranty.customerName}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(warranty.status)}>
                          {warranty.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                {warranties.length > 3 && (
                  <div className="text-center pt-2">
                    <Button variant="outline" size="sm">
                      View All {warranties.length} Warranties
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Shield className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>No warranty cards found for this product</p>
                <p className="text-sm">Create a warranty card to get started</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
