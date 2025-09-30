'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ArrowLeft,
  Edit, 
  Copy, 
  Trash2, 
  Download,
  Upload,
  TrendingUp,
  DollarSign,
  Package,
  Calendar,
  Users,
  Globe,
  FileText,
  Eye,
  EyeOff
} from 'lucide-react';
import Link from 'next/link';
import { PriceList } from '@/lib/models/priceList';

export default function PriceListDetailPage() {
  const params = useParams();
  const priceListId = params.id as string;
  
  const [priceList, setPriceList] = useState<PriceList | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    const fetchPriceList = async () => {
      try {
        const response = await fetch(`/api/price-lists/${priceListId}`);
        if (response.ok) {
          const data = await response.json();
          setPriceList(data);
        } else {
          console.error('Failed to fetch price list');
        }
      } catch (error) {
        console.error('Error fetching price list:', error);
      } finally {
        setLoading(false);
      }
    };

    if (priceListId) {
      fetchPriceList();
    }
  }, [priceListId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <div className="w-3 h-3 bg-green-500 rounded-full" />;
      case 'inactive':
        return <div className="w-3 h-3 bg-red-500 rounded-full" />;
      case 'draft':
        return <div className="w-3 h-3 bg-yellow-500 rounded-full" />;
      case 'archived':
        return <div className="w-3 h-3 bg-gray-500 rounded-full" />;
      default:
        return <div className="w-3 h-3 bg-gray-500 rounded-full" />;
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'standard': 'bg-blue-100 text-blue-800',
      'bulk': 'bg-purple-100 text-purple-800',
      'promotional': 'bg-pink-100 text-pink-800',
      'wholesale': 'bg-green-100 text-green-800',
      'retail': 'bg-orange-100 text-orange-800',
      'seasonal': 'bg-indigo-100 text-indigo-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-red-100 text-red-800',
      'draft': 'bg-yellow-100 text-yellow-800',
      'archived': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: priceList?.currency || 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  const filteredItems = priceList?.items.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.productSku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.productName.includes(selectedCategory);
    const matchesVisibility = showInactive || item.isActive;
    return matchesSearch && matchesCategory && matchesVisibility;
  }) || [];

  const categories = [...new Set(priceList?.items.map(item => item.productName.split(' ')[0]) || [])];

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this price list?')) return;
    
    try {
      const response = await fetch(`/api/price-lists/${priceListId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error);
        return;
      }
      
      // Redirect to price lists page
      window.location.href = '/price-lists';
    } catch (error) {
      console.error('Error deleting price list:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!priceList) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Price List Not Found</h1>
          <p className="text-muted-foreground">The requested price list could not be found.</p>
          <Link href="/price-lists">
            <Button className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Price Lists
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/price-lists">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{priceList.name}</h1>
            <p className="text-muted-foreground">{priceList.code}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Link href={`/price-lists/bulk-editor?priceListId=${priceListId}`}>
            <Button variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              Bulk Edit
            </Button>
          </Link>
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Price List Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Basic Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Type</span>
              <Badge className={getTypeColor(priceList.type)}>
                {priceList.type.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              <div className="flex items-center space-x-2">
                {getStatusIcon(priceList.status)}
                <Badge className={getStatusColor(priceList.status)}>
                  {priceList.status.toUpperCase()}
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Currency</span>
              <span className="text-sm">{priceList.currency}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tax Inclusive</span>
              <span className="text-sm">{priceList.taxInclusive ? 'Yes' : 'No'}</span>
            </div>
            {priceList.isDefault && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Default List</span>
                <Badge variant="secondary">Yes</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Validity Period</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Valid From</span>
              <span className="text-sm">{formatDate(priceList.validFrom)}</span>
            </div>
            {priceList.validTo && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Valid To</span>
                <span className="text-sm">{formatDate(priceList.validTo)}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Created</span>
              <span className="text-sm">{formatDate(priceList.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Last Updated</span>
              <span className="text-sm">{formatDate(priceList.updatedAt)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Products</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Products</span>
              <span className="text-sm font-bold">{priceList.items.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Products</span>
              <span className="text-sm">
                {priceList.items.filter(item => item.isActive).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Average Price</span>
              <span className="text-sm">
                {formatCurrency(
                  priceList.items.reduce((sum, item) => sum + item.price, 0) / priceList.items.length
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Average Discount</span>
              <span className="text-sm">
                {priceList.items.length > 0 
                  ? (priceList.items.reduce((sum, item) => sum + (item.discountPercentage || 0), 0) / priceList.items.length).toFixed(1)
                  : 0}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Targeting Information */}
      {(priceList.customerTypes?.length || priceList.regions?.length || priceList.countries?.length) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Targeting</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {priceList.customerTypes?.length && (
                <div>
                  <h4 className="font-medium mb-2">Customer Types</h4>
                  <div className="flex flex-wrap gap-2">
                    {priceList.customerTypes.map((type) => (
                      <Badge key={type} variant="outline">{type}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {priceList.regions?.length && (
                <div>
                  <h4 className="font-medium mb-2">Regions</h4>
                  <div className="flex flex-wrap gap-2">
                    {priceList.regions.map((region) => (
                      <Badge key={region} variant="outline">{region}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {priceList.countries?.length && (
                <div>
                  <h4 className="font-medium mb-2">Countries</h4>
                  <div className="flex flex-wrap gap-2">
                    {priceList.countries.map((country) => (
                      <Badge key={country} variant="outline">{country}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Description */}
      {priceList.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{priceList.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredItems.length})</CardTitle>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <Button
              variant={showInactive ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowInactive(!showInactive)}
            >
              {showInactive ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showInactive ? 'Hide Inactive' : 'Show Inactive'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Quantity Range</TableHead>
                  <TableHead>Valid Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.productName}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {item.productSku}
                      </code>
                    </TableCell>
                    <TableCell>{formatCurrency(item.basePrice)}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(item.price)}</TableCell>
                    <TableCell>
                      {item.discountPercentage && item.discountPercentage > 0 ? (
                        <Badge variant="outline" className="text-green-600">
                          -{item.discountPercentage}%
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">No discount</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.minQuantity && (
                        <span className="text-sm">
                          {item.minQuantity}
                          {item.maxQuantity ? ` - ${item.maxQuantity}` : '+'}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatDate(item.effectiveDate)}</div>
                        {item.expiryDate && (
                          <div className="text-muted-foreground">
                            to {formatDate(item.expiryDate)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.isActive ? 'default' : 'secondary'}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.notes && (
                        <span className="text-sm text-muted-foreground">
                          {item.notes.length > 50 ? `${item.notes.substring(0, 50)}...` : item.notes}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
