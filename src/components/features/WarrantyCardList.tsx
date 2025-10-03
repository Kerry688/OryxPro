'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  WarrantyCard, 
  WarrantyStatus, 
  WarrantyType 
} from '@/lib/models/warranty-client';
import { warrantyApiClient } from '@/lib/warranty-api-client';
import { 
  Shield, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  User,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { WarrantyCardForm } from './WarrantyCardForm';
import { WarrantyClaimForm } from './WarrantyClaimForm';

interface WarrantyCardListProps {
  onWarrantySelect?: (warranty: WarrantyCard) => void;
  onClaimCreate?: (warranty: WarrantyCard) => void;
}

export function WarrantyCardList({ onWarrantySelect, onClaimCreate }: WarrantyCardListProps) {
  const [warranties, setWarranties] = useState<WarrantyCard[]>([]);
  const [filteredWarranties, setFilteredWarranties] = useState<WarrantyCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [selectedWarranty, setSelectedWarranty] = useState<WarrantyCard | null>(null);
  const [editingWarranty, setEditingWarranty] = useState<WarrantyCard | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadWarranties();
  }, [currentPage, statusFilter, typeFilter]);

  useEffect(() => {
    filterWarranties();
  }, [warranties, searchQuery, statusFilter, typeFilter]);

  const loadWarranties = async () => {
    try {
      setLoading(true);
      const data = await warrantyApiClient.getWarranties({
        page: currentPage,
        limit: 10,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        warrantyType: typeFilter !== 'all' ? typeFilter : undefined,
      });

      if (data.success) {
        setWarranties(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.totalCount || 0);
      }
    } catch (error) {
      console.error('Error loading warranties:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterWarranties = () => {
    let filtered = warranties;

    if (searchQuery) {
      filtered = filtered.filter(warranty =>
        warranty.warrantyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        warranty.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        warranty.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        warranty.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredWarranties(filtered);
  };

  const handleCreateWarranty = async (data: any) => {
    try {
      const result = await warrantyApiClient.createWarranty(data);

      if (result.success) {
        setShowForm(false);
        loadWarranties();
      } else {
        console.error('Error creating warranty:', result.error);
      }
    } catch (error) {
      console.error('Error creating warranty:', error);
    }
  };

  const handleUpdateWarranty = async (data: any) => {
    if (!editingWarranty?._id) return;

    try {
      const result = await warrantyApiClient.updateWarranty(editingWarranty._id.toString(), data);

      if (result.success) {
        setShowForm(false);
        setEditingWarranty(null);
        loadWarranties();
      } else {
        console.error('Error updating warranty:', result.error);
      }
    } catch (error) {
      console.error('Error updating warranty:', error);
    }
  };

  const handleDeleteWarranty = async (warranty: WarrantyCard) => {
    if (!warranty._id) return;

    if (!confirm('Are you sure you want to delete this warranty?')) {
      return;
    }

    try {
      const result = await warrantyApiClient.deleteWarranty(warranty._id.toString());

      if (result.success) {
        loadWarranties();
      } else {
        console.error('Error deleting warranty:', result.error);
      }
    } catch (error) {
      console.error('Error deleting warranty:', error);
    }
  };

  const handleCreateClaim = async (data: any) => {
    try {
      const result = await warrantyApiClient.createClaim(data);

      if (result.success) {
        setShowClaimForm(false);
        setSelectedWarranty(null);
        loadWarranties();
      } else {
        console.error('Error creating claim:', result.error);
      }
    } catch (error) {
      console.error('Error creating claim:', error);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Warranty Cards</h1>
          <p className="text-gray-600">Manage warranty cards and claims</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Warranty
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingWarranty ? 'Edit Warranty Card' : 'Create Warranty Card'}
                </DialogTitle>
              </DialogHeader>
              <WarrantyCardForm
                warranty={editingWarranty}
                onSave={editingWarranty ? handleUpdateWarranty : handleCreateWarranty}
                onCancel={() => {
                  setShowForm(false);
                  setEditingWarranty(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search warranties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="void">Void</SelectItem>
                  <SelectItem value="claimed">Claimed</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="manufacturer">Manufacturer</SelectItem>
                  <SelectItem value="extended">Extended</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="replacement">Replacement</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warranty Cards Table */}
      <Card>
        <CardHeader>
          <CardTitle>Warranty Cards ({totalCount})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Warranty Number</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Claims</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWarranties.map((warranty) => (
                    <TableRow key={warranty._id?.toString()}>
                      <TableCell className="font-medium">
                        {warranty.warrantyNumber}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{warranty.productName}</div>
                          <div className="text-sm text-gray-500">{warranty.productSku}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{warranty.customerName}</div>
                          <div className="text-sm text-gray-500">{warranty.customerEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(warranty.status)}
                          <Badge className={getStatusColor(warranty.status)}>
                            {warranty.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{warranty.warrantyType}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{warranty.duration} months</div>
                          <div className="text-gray-500">
                            {isExpired(warranty.endDate) ? 'Expired' : 'Valid until'} {new Date(warranty.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{warranty.totalClaims}</span>
                          {warranty.totalClaims > 0 && (
                            <Badge variant="secondary">Has Claims</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onWarrantySelect?.(warranty)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingWarranty(warranty);
                              setShowForm(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedWarranty(warranty);
                              setShowClaimForm(true);
                            }}
                          >
                            <AlertTriangle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteWarranty(warranty)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredWarranties.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No warranty cards found
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Claim Form Dialog */}
      <Dialog open={showClaimForm} onOpenChange={setShowClaimForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Warranty Claim</DialogTitle>
          </DialogHeader>
          <WarrantyClaimForm
            warrantyCard={selectedWarranty}
            onSave={handleCreateClaim}
            onCancel={() => {
              setShowClaimForm(false);
              setSelectedWarranty(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
