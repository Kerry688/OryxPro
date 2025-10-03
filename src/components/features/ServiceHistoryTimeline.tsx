'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ServiceHistoryForm } from './ServiceHistoryForm';
import { 
  ServiceHistoryEntry, 
  ServiceHistoryType,
  ServiceHistoryStatus,
  ServicePriority,
  ServiceOutcome
} from '@/lib/models/service-history';
import { 
  Clock, 
  User, 
  MapPin, 
  Wrench, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Shield,
  Star,
  FileText,
  Download,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface ServiceHistoryTimelineProps {
  productId: string;
  productName: string;
  onServiceCreate?: (data: any) => void;
  onServiceUpdate?: (data: any) => void;
  onServiceDelete?: (service: ServiceHistoryEntry) => void;
  onServiceView?: (service: ServiceHistoryEntry) => void;
}

export function ServiceHistoryTimeline({
  productId,
  productName,
  onServiceCreate,
  onServiceUpdate,
  onServiceDelete,
  onServiceView
}: ServiceHistoryTimelineProps) {
  const [serviceHistory, setServiceHistory] = useState<ServiceHistoryEntry[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<ServiceHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceHistoryEntry | null>(null);
  const [editingService, setEditingService] = useState<ServiceHistoryEntry | null>(null);
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadServiceHistory();
  }, [productId]);

  useEffect(() => {
    filterServiceHistory();
  }, [serviceHistory, searchQuery, typeFilter, statusFilter, priorityFilter]);

  const loadServiceHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/service-history?productId=${productId}&limit=100`);
      const data = await response.json();

      if (data.success) {
        setServiceHistory(data.data);
      }
    } catch (error) {
      console.error('Error loading service history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterServiceHistory = () => {
    let filtered = serviceHistory;

    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.technicianName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(service => service.serviceType === typeFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(service => service.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(service => service.priority === priorityFilter);
    }

    setFilteredHistory(filtered);
  };

  const handleCreateService = async (data: any) => {
    try {
      const response = await fetch('/api/service-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          productId,
          productName,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setShowForm(false);
        loadServiceHistory();
        onServiceCreate?.(result.data);
      } else {
        console.error('Error creating service:', result.error);
      }
    } catch (error) {
      console.error('Error creating service:', error);
    }
  };

  const handleUpdateService = async (data: any) => {
    if (!editingService?._id) return;

    try {
      const response = await fetch(`/api/service-history/${editingService._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setShowForm(false);
        setEditingService(null);
        loadServiceHistory();
        onServiceUpdate?.(result.data);
      } else {
        console.error('Error updating service:', result.error);
      }
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  const handleDeleteService = async (service: ServiceHistoryEntry) => {
    if (!service._id) return;

    if (!confirm('Are you sure you want to delete this service record?')) {
      return;
    }

    try {
      const response = await fetch(`/api/service-history/${service._id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        loadServiceHistory();
        onServiceDelete?.(service);
      } else {
        console.error('Error deleting service:', result.error);
      }
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const toggleExpanded = (serviceId: string) => {
    const newExpanded = new Set(expandedServices);
    if (newExpanded.has(serviceId)) {
      newExpanded.delete(serviceId);
    } else {
      newExpanded.add(serviceId);
    }
    setExpandedServices(newExpanded);
  };

  const getTypeIcon = (type: ServiceHistoryType) => {
    switch (type) {
      case 'installation':
        return <Wrench className="h-4 w-4" />;
      case 'maintenance':
        return <Clock className="h-4 w-4" />;
      case 'repair':
        return <AlertTriangle className="h-4 w-4" />;
      case 'warranty_claim':
        return <Shield className="h-4 w-4" />;
      case 'inspection':
        return <Eye className="h-4 w-4" />;
      case 'upgrade':
        return <CheckCircle className="h-4 w-4" />;
      case 'replacement':
        return <XCircle className="h-4 w-4" />;
      case 'calibration':
        return <Clock className="h-4 w-4" />;
      case 'cleaning':
        return <Wrench className="h-4 w-4" />;
      case 'diagnostic':
        return <AlertTriangle className="h-4 w-4" />;
      case 'emergency_repair':
        return <AlertTriangle className="h-4 w-4" />;
      case 'preventive_maintenance':
        return <Clock className="h-4 w-4" />;
      case 'warranty_service':
        return <Shield className="h-4 w-4" />;
      case 'recall':
        return <AlertTriangle className="h-4 w-4" />;
      case 'end_of_life':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Wrench className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: ServiceHistoryType) => {
    switch (type) {
      case 'installation':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'repair':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warranty_claim':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'inspection':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'upgrade':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'replacement':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'calibration':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'cleaning':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'diagnostic':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'emergency_repair':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'preventive_maintenance':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warranty_service':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'recall':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'end_of_life':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: ServiceHistoryStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'on_hold':
        return 'bg-orange-100 text-orange-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: ServicePriority) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Service History Timeline</h2>
          <p className="text-gray-600">{productName}</p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Service Record
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingService ? 'Edit Service Record' : 'Add Service Record'}
              </DialogTitle>
            </DialogHeader>
            <ServiceHistoryForm
              service={editingService}
              onSave={editingService ? handleUpdateService : handleCreateService}
              onCancel={() => {
                setShowForm(false);
                setEditingService(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search service history..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="installation">Installation</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="warranty_claim">Warranty Claim</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                  <SelectItem value="upgrade">Upgrade</SelectItem>
                  <SelectItem value="replacement">Replacement</SelectItem>
                  <SelectItem value="calibration">Calibration</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="diagnostic">Diagnostic</SelectItem>
                  <SelectItem value="emergency_repair">Emergency Repair</SelectItem>
                  <SelectItem value="preventive_maintenance">Preventive Maintenance</SelectItem>
                  <SelectItem value="warranty_service">Warranty Service</SelectItem>
                  <SelectItem value="recall">Recall</SelectItem>
                  <SelectItem value="end_of_life">End of Life</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              No service history found
            </CardContent>
          </Card>
        ) : (
          filteredHistory.map((service, index) => (
            <Card key={service._id?.toString() || index} className="relative">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div className={`p-2 rounded-full border-2 ${getTypeColor(service.serviceType)}`}>
                        {getTypeIcon(service.serviceType)}
                      </div>
                      {index < filteredHistory.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-200 mt-2"></div>
                      )}
                    </div>

                    {/* Service content */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{service.title}</h3>
                          <Badge className={getTypeColor(service.serviceType)}>
                            {service.serviceType.replace('_', ' ')}
                          </Badge>
                          <Badge className={getStatusColor(service.status)}>
                            {service.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={getPriorityColor(service.priority)}>
                            {service.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedService(service)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingService(service);
                              setShowForm(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteService(service)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-gray-600">{service.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{formatDate(service.createdAt)}</span>
                        </div>
                        {service.technicianName && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span>{service.technicianName}</span>
                          </div>
                        )}
                        {service.serviceLocation && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span>{service.serviceLocation}</span>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        {service.estimatedDuration && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>Duration: {formatDuration(service.estimatedDuration)}</span>
                          </div>
                        )}
                        {service.totalCost > 0 && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <span>Cost: ${service.totalCost.toFixed(2)}</span>
                          </div>
                        )}
                        {service.warrantyCoverage > 0 && (
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-gray-500" />
                            <span>Warranty: ${service.warrantyCoverage.toFixed(2)}</span>
                          </div>
                        )}
                        {service.customerRating && (
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-gray-500" />
                            <span>Rating: {service.customerRating}/5</span>
                          </div>
                        )}
                      </div>

                      {/* Expandable details */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(service._id || '')}
                        className="flex items-center gap-2"
                      >
                        {expandedServices.has(service._id || '') ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        {expandedServices.has(service._id || '') ? 'Hide Details' : 'Show Details'}
                      </Button>

                      {expandedServices.has(service._id || '') && (
                        <div className="space-y-4 p-4 bg-gray-50 rounded-md">
                          {/* Service Items */}
                          {service.serviceItems.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Service Items</h4>
                              <div className="space-y-2">
                                {service.serviceItems.map((item, itemIndex) => (
                                  <div key={itemIndex} className="flex justify-between items-center p-2 bg-white rounded">
                                    <span>{item.name} x{item.quantity}</span>
                                    <span>${item.totalCost.toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Parts Used */}
                          {service.partsUsed.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Parts Used</h4>
                              <div className="space-y-2">
                                {service.partsUsed.map((part, partIndex) => (
                                  <div key={partIndex} className="flex justify-between items-center p-2 bg-white rounded">
                                    <span>{part.partName} x{part.quantity}</span>
                                    <span>${part.totalCost.toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Notes */}
                          {service.notes && (
                            <div>
                              <h4 className="font-medium mb-2">Notes</h4>
                              <p className="text-sm text-gray-600">{service.notes}</p>
                            </div>
                          )}

                          {/* Recommendations */}
                          {service.recommendations && (
                            <div>
                              <h4 className="font-medium mb-2">Recommendations</h4>
                              <p className="text-sm text-gray-600">{service.recommendations}</p>
                            </div>
                          )}

                          {/* Attachments */}
                          {service.attachments.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Attachments</h4>
                              <div className="space-y-2">
                                {service.attachments.map((attachment, attachmentIndex) => (
                                  <div key={attachmentIndex} className="flex items-center gap-2 p-2 bg-white rounded">
                                    <FileText className="h-4 w-4" />
                                    <span className="flex-1">{attachment.name}</span>
                                    <Button variant="ghost" size="sm">
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
