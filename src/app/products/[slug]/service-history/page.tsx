'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ServiceHistoryTimeline } from '@/components/features/ServiceHistoryTimeline';
import { ServiceHistoryEntry } from '@/lib/models/service-history';
import { 
  ArrowLeft,
  Package,
  Calendar,
  DollarSign,
  Shield,
  Star,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function ProductServiceHistoryPage() {
  const params = useParams();
  const productSlug = params.slug as string;
  
  const [product, setProduct] = useState<any>(null);
  const [serviceHistory, setServiceHistory] = useState<ServiceHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    loadProduct();
    loadServiceHistory();
  }, [productSlug]);

  const loadProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productSlug}`);
      const data = await response.json();
      
      if (data.success) {
        setProduct(data.data);
      }
    } catch (error) {
      console.error('Error loading product:', error);
    }
  };

  const loadServiceHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/service-history?productId=${productSlug}&limit=100`);
      const data = await response.json();
      
      if (data.success) {
        setServiceHistory(data.data);
        calculateSummary(data.data);
      }
    } catch (error) {
      console.error('Error loading service history:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (history: ServiceHistoryEntry[]) => {
    const totalServices = history.length;
    const totalCost = history.reduce((sum, service) => sum + service.totalCost, 0);
    const warrantyCosts = history.reduce((sum, service) => sum + service.warrantyCoverage, 0);
    const customerCosts = history.reduce((sum, service) => sum + service.customerCharge, 0);
    const averageRating = history
      .filter(service => service.customerRating)
      .reduce((sum, service) => sum + (service.customerRating || 0), 0) / 
      history.filter(service => service.customerRating).length || 0;
    
    const lastService = history.length > 0 ? history[0] : null;
    const completedServices = history.filter(service => service.status === 'completed').length;
    const reliabilityScore = totalServices > 0 ? (completedServices / totalServices) * 100 : 0;

    setSummary({
      totalServices,
      totalCost,
      warrantyCosts,
      customerCosts,
      averageRating,
      lastService,
      reliabilityScore,
      completedServices
    });
  };

  const handleServiceCreate = (service: ServiceHistoryEntry) => {
    setServiceHistory(prev => [service, ...prev]);
    calculateSummary([service, ...serviceHistory]);
  };

  const handleServiceUpdate = (updatedService: ServiceHistoryEntry) => {
    setServiceHistory(prev => 
      prev.map(service => 
        service._id === updatedService._id ? updatedService : service
      )
    );
    calculateSummary(serviceHistory);
  };

  const handleServiceDelete = (deletedService: ServiceHistoryEntry) => {
    setServiceHistory(prev => 
      prev.filter(service => service._id !== deletedService._id)
    );
    calculateSummary(serviceHistory);
  };

  const handleServiceView = (service: ServiceHistoryEntry) => {
    // Handle service view - could open a modal or navigate to service details
    console.log('View service:', service);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Product not found</p>
        <Link href="/products">
          <Button className="mt-4">Back to Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/products/${productSlug}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Product
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Service History</h1>
          <p className="text-gray-600">{product.name}</p>
        </div>
      </div>

      {/* Product Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Product Name</p>
              <p className="font-medium">{product.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">SKU</p>
              <p className="font-medium">{product.sku}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Category</p>
              <p className="font-medium">{product.category}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Summary */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Services</p>
                  <p className="text-2xl font-bold">{summary.totalServices}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Cost</p>
                  <p className="text-2xl font-bold">${summary.totalCost.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Warranty Coverage</p>
                  <p className="text-2xl font-bold">${summary.warrantyCosts.toFixed(2)}</p>
                </div>
                <Shield className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reliability Score</p>
                  <p className="text-2xl font-bold">{summary.reliabilityScore.toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Service History Timeline */}
      <ServiceHistoryTimeline
        productId={productSlug}
        productName={product.name}
        onServiceCreate={handleServiceCreate}
        onServiceUpdate={handleServiceUpdate}
        onServiceDelete={handleServiceDelete}
        onServiceView={handleServiceView}
      />
    </div>
  );
}
