'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  DollarSign, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Copy,
  Archive,
  TrendingUp,
  Calendar,
  Users,
  Globe,
  CheckCircle,
  XCircle,
  Clock,
  FileText
} from 'lucide-react';
import { PriceList, PriceListType, PriceListStatus } from '@/lib/models/priceList';
import { PriceListForm } from '@/components/features/PriceListForm';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/use-translation';
import Link from 'next/link';

export default function PriceListsPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const [priceLists, setPriceLists] = useState<PriceList[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<PriceListType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<PriceListStatus | 'all'>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingPriceList, setEditingPriceList] = useState<PriceList | null>(null);

  // Fetch price lists
  const fetchPriceLists = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);
      if (selectedType !== 'all') params.append('type', selectedType);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      
      const response = await fetch(`/api/price-lists?${params}`);
      if (!response.ok) throw new Error('Failed to fetch price lists');
      
      const data = await response.json();
      setPriceLists(data.priceLists);
    } catch (error) {
      console.error('Error fetching price lists:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceLists();
  }, [searchQuery, selectedType, selectedStatus]);

  const handleAddPriceList = async (priceListData: any) => {
    try {
      const response = await fetch('/api/price-lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...priceListData,
          createdBy: user?.id
        })
      });

      if (!response.ok) throw new Error('Failed to create price list');
      
      setShowAddDialog(false);
      fetchPriceLists();
    } catch (error) {
      console.error('Error creating price list:', error);
    }
  };

  const handleEditPriceList = async (priceListData: any) => {
    if (!editingPriceList) return;
    
    try {
      const response = await fetch(`/api/price-lists/${editingPriceList._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...priceListData,
          updatedBy: user?.id
        })
      });

      if (!response.ok) throw new Error('Failed to update price list');
      
      setEditingPriceList(null);
      fetchPriceLists();
    } catch (error) {
      console.error('Error updating price list:', error);
    }
  };

  const handleDeletePriceList = async (priceListId: string) => {
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
      
      fetchPriceLists();
    } catch (error) {
      console.error('Error deleting price list:', error);
    }
  };

  const handleDuplicatePriceList = async (priceList: PriceList) => {
    try {
      const duplicateData = {
        ...priceList,
        name: `${priceList.name} (Copy)`,
        code: `${priceList.code}_COPY_${Date.now()}`,
        status: 'draft' as PriceListStatus,
        isDefault: false,
        createdBy: user?.id
      };
      delete duplicateData._id;
      delete duplicateData.createdAt;
      delete duplicateData.updatedAt;

      const response = await fetch('/api/price-lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicateData)
      });

      if (!response.ok) throw new Error('Failed to duplicate price list');
      
      fetchPriceLists();
    } catch (error) {
      console.error('Error duplicating price list:', error);
    }
  };

  const getStatusIcon = (status: PriceListStatus) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'draft':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'archived':
        return <Archive className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: PriceListStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: PriceListType) => {
    const colors = {
      'standard': 'bg-blue-100 text-blue-800',
      'bulk': 'bg-purple-100 text-purple-800',
      'promotional': 'bg-pink-100 text-pink-800',
      'wholesale': 'bg-green-100 text-green-800',
      'retail': 'bg-orange-100 text-orange-800',
      'seasonal': 'bg-indigo-100 text-indigo-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Price Lists</h1>
          <p className="text-muted-foreground">
            Manage pricing for all sales products and items
          </p>
        </div>
        <div className="flex space-x-2">
          <Link href="/price-lists/bulk-editor">
            <Button variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              Bulk Editor
            </Button>
          </Link>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Price List
              </Button>
            </DialogTrigger>
            <DialogContent className="!max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Price List</DialogTitle>
              </DialogHeader>
              <PriceListForm
                onSubmit={handleAddPriceList}
                onCancel={() => setShowAddDialog(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Price Lists</p>
                <p className="text-2xl font-bold">{priceLists.length}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Lists</p>
                <p className="text-2xl font-bold">
                  {priceLists.filter(p => p.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Draft Lists</p>
                <p className="text-2xl font-bold">
                  {priceLists.filter(p => p.status === 'draft').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">
                  {priceLists.reduce((sum, list) => sum + list.items.length, 0)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search price lists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value as PriceListType | 'all')}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Types</option>
              <option value="standard">Standard</option>
              <option value="bulk">Bulk</option>
              <option value="promotional">Promotional</option>
              <option value="wholesale">Wholesale</option>
              <option value="retail">Retail</option>
              <option value="seasonal">Seasonal</option>
            </select>
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value as PriceListStatus | 'all')}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Price Lists Table */}
      <Card>
        <CardHeader>
          <CardTitle>Price Lists ({priceLists.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Price List</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Valid Period</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {priceLists.map((priceList) => (
                    <TableRow key={priceList._id?.toString()}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{priceList.name}</p>
                          <p className="text-sm text-muted-foreground">{priceList.code}</p>
                          {priceList.isDefault && (
                            <Badge variant="secondary" className="mt-1">Default</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(priceList.type)}>
                          {priceList.type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(priceList.status)}
                          <Badge className={getStatusColor(priceList.status)}>
                            {priceList.status.toUpperCase()}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>{priceList.items.length}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span>{formatDate(priceList.validFrom)}</span>
                          </div>
                          {priceList.validTo && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span>{formatDate(priceList.validTo)}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Link href={`/price-lists/${priceList._id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingPriceList(priceList)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDuplicatePriceList(priceList)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePriceList(priceList._id!.toString())}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Price List Dialog */}
      {editingPriceList && (
        <Dialog open={!!editingPriceList} onOpenChange={() => setEditingPriceList(null)}>
          <DialogContent className="!max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Price List</DialogTitle>
            </DialogHeader>
            <PriceListForm
              priceList={editingPriceList}
              onSubmit={handleEditPriceList}
              onCancel={() => setEditingPriceList(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
