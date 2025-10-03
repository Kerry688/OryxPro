'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { WorkOrderForm } from '@/components/features/WorkOrderForm';
import { 
  WorkOrder, 
  WorkOrderStatus,
  BillingStatus 
} from '@/lib/models/service-request';
import { 
  Wrench, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Shield,
  DollarSign,
  FileText,
  User,
  Package
} from 'lucide-react';

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [billingFilter, setBillingFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [editingOrder, setEditingOrder] = useState<WorkOrder | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadWorkOrders();
  }, [currentPage, statusFilter, billingFilter]);

  useEffect(() => {
    filterOrders();
  }, [workOrders, searchQuery, statusFilter, billingFilter]);

  const loadWorkOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });

      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      if (billingFilter !== 'all') {
        params.append('billingStatus', billingFilter);
      }

      const response = await fetch(`/api/service-requests/work-orders?${params}`);
      const data = await response.json();

      if (data.success) {
        setWorkOrders(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotalCount(data.pagination.totalCount);
      }
    } catch (error) {
      console.error('Error loading work orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = workOrders;

    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.workOrderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const handleCreateOrder = async (data: any) => {
    try {
      const response = await fetch('/api/service-requests/work-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setShowForm(false);
        loadWorkOrders();
      } else {
        console.error('Error creating work order:', result.error);
      }
    } catch (error) {
      console.error('Error creating work order:', error);
    }
  };

  const handleUpdateOrder = async (data: any) => {
    if (!editingOrder?._id) return;

    try {
      const response = await fetch(`/api/service-requests/work-orders/${editingOrder._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setShowForm(false);
        setEditingOrder(null);
        loadWorkOrders();
      } else {
        console.error('Error updating work order:', result.error);
      }
    } catch (error) {
      console.error('Error updating work order:', error);
    }
  };

  const handleDeleteOrder = async (order: WorkOrder) => {
    if (!order._id) return;

    if (!confirm('Are you sure you want to delete this work order?')) {
      return;
    }

    try {
      const response = await fetch(`/api/service-requests/work-orders/${order._id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        loadWorkOrders();
      } else {
        console.error('Error deleting work order:', result.error);
      }
    } catch (error) {
      console.error('Error deleting work order:', error);
    }
  };

  const getStatusIcon = (status: WorkOrderStatus) => {
    switch (status) {
      case 'draft':
        return <FileText className="h-4 w-4 text-gray-500" />;
      case 'assigned':
        return <User className="h-4 w-4 text-blue-500" />;
      case 'in_progress':
        return <Wrench className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: WorkOrderStatus) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBillingStatusColor = (status: BillingStatus) => {
    switch (status) {
      case 'warranty_covered':
        return 'bg-green-100 text-green-800';
      case 'billable':
        return 'bg-blue-100 text-blue-800';
      case 'mixed':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending_assessment':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Work Orders</h1>
          <p className="text-gray-600">Manage work orders and service execution</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Work Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingOrder ? 'Edit Work Order' : 'Create Work Order'}
                </DialogTitle>
              </DialogHeader>
              <WorkOrderForm
                order={editingOrder}
                onSave={editingOrder ? handleUpdateOrder : handleCreateOrder}
                onCancel={() => {
                  setShowForm(false);
                  setEditingOrder(null);
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
                  placeholder="Search work orders..."
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
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={billingFilter} onValueChange={setBillingFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Billing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Billing</SelectItem>
                  <SelectItem value="warranty_covered">Warranty Covered</SelectItem>
                  <SelectItem value="billable">Billable</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                  <SelectItem value="pending_assessment">Pending Assessment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Work Orders ({totalCount})</CardTitle>
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
                    <TableHead>Work Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Billing</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order._id?.toString()}>
                      <TableCell className="font-medium">
                        {order.workOrderNumber}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-sm text-gray-500">ID: {order.customerId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.productName}</div>
                          <div className="text-sm text-gray-500">{order.serialNumber || 'No Serial'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{order.assignedTo}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getBillingStatusColor(order.billingStatus)}>
                          {order.billingStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{order.actualDuration || order.estimatedDuration}h</div>
                          <div className="text-gray-500">
                            {order.startDate ? new Date(order.startDate).toLocaleDateString() : 'Not started'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">${order.totalCost.toFixed(2)}</div>
                          <div className="text-gray-500">
                            Warranty: ${order.warrantyCoveredCost.toFixed(2)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingOrder(order);
                              setShowForm(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteOrder(order)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredOrders.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No work orders found
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

      {/* Work Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getStatusIcon(selectedOrder.status)}
                Work Order Details - {selectedOrder.workOrderNumber}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Work Order Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Work Order Number</label>
                  <p className="text-sm">{selectedOrder.workOrderNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedOrder.status)}
                    <Badge className={getStatusColor(selectedOrder.status)}>
                      {selectedOrder.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Assigned To</label>
                  <p className="text-sm">{selectedOrder.assignedTo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Assigned Date</label>
                  <p className="text-sm">{new Date(selectedOrder.assignedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Estimated Duration</label>
                  <p className="text-sm">{selectedOrder.estimatedDuration} hours</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Actual Duration</label>
                  <p className="text-sm">{selectedOrder.actualDuration || 'Not completed'} hours</p>
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
                    <p className="text-sm">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Customer ID</label>
                    <p className="text-sm">{selectedOrder.customerId}</p>
                  </div>
                </div>
              </div>

              {/* Product Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Product Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Product Name</label>
                    <p className="text-sm">{selectedOrder.productName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Serial Number</label>
                    <p className="text-sm">{selectedOrder.serialNumber || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Labor Entries */}
              {selectedOrder.laborEntries.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    Labor Entries
                  </h3>
                  <div className="space-y-2">
                    {selectedOrder.laborEntries.map((labor, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{labor.description}</p>
                            <p className="text-sm text-gray-600">Technician: {labor.technician}</p>
                            <p className="text-sm text-gray-600">Duration: {labor.duration}h</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${labor.totalCost.toFixed(2)}</p>
                            <Badge className={labor.isWarrantyCovered ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                              {labor.isWarrantyCovered ? 'Warranty' : 'Billable'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Parts Used */}
              {selectedOrder.partsUsed.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Parts Used
                  </h3>
                  <div className="space-y-2">
                    {selectedOrder.partsUsed.map((part, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{part.partName}</p>
                            <p className="text-sm text-gray-600">Part #: {part.partNumber}</p>
                            <p className="text-sm text-gray-600">Qty: {part.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${part.totalCost.toFixed(2)}</p>
                            <Badge className={part.isWarrantyCovered ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                              {part.isWarrantyCovered ? 'Warranty' : 'Billable'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cost Summary */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Cost Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium text-gray-600">Total Cost</p>
                    <p className="text-lg font-bold">${selectedOrder.totalCost.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-md">
                    <p className="text-sm font-medium text-gray-600">Warranty Covered</p>
                    <p className="text-lg font-bold text-green-600">${selectedOrder.warrantyCoveredCost.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-md">
                    <p className="text-sm font-medium text-gray-600">Billable</p>
                    <p className="text-lg font-bold text-blue-600">${selectedOrder.billableCost.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Notes</label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">
                    {selectedOrder.notes}
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
