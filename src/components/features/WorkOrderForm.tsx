'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  WorkOrder, 
  CreateWorkOrderData,
  LaborEntry,
  PartsEntry,
  ServiceEntry
} from '@/lib/models/service-request';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { 
  Wrench, 
  User, 
  Package, 
  Plus,
  Trash2,
  DollarSign,
  Clock
} from 'lucide-react';

const workOrderFormSchema = z.object({
  serviceRequestId: z.string().min(1, 'Service request is required'),
  assignedTo: z.string().min(1, 'Assigned technician is required'),
  estimatedDuration: z.number().min(1, 'Estimated duration must be at least 1 hour'),
  notes: z.string().optional(),
});

interface WorkOrderFormProps {
  order?: WorkOrder | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function WorkOrderForm({ order, onSave, onCancel }: WorkOrderFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [laborEntries, setLaborEntries] = useState<LaborEntry[]>(order?.laborEntries || []);
  const [partsUsed, setPartsUsed] = useState<PartsEntry[]>(order?.partsUsed || []);
  const [services, setServices] = useState<ServiceEntry[]>(order?.services || []);

  const form = useForm<CreateWorkOrderData>({
    resolver: zodResolver(workOrderFormSchema),
    defaultValues: {
      serviceRequestId: order?.serviceRequestId || '',
      assignedTo: order?.assignedTo || '',
      estimatedDuration: order?.estimatedDuration || 1,
      notes: order?.notes || '',
      createdBy: user?.id || '',
    },
  });

  useEffect(() => {
    loadServiceRequests();
    loadTechnicians();
  }, []);

  const loadServiceRequests = async () => {
    try {
      const response = await fetch('/api/service-requests');
      const data = await response.json();
      if (data.success) {
        setServiceRequests(data.data);
      }
    } catch (error) {
      console.error('Error loading service requests:', error);
    }
  };

  const loadTechnicians = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      if (data.success) {
        // Filter for technicians or users with service roles
        setTechnicians(data.data.filter((user: any) => 
          user.role === 'technician' || user.role === 'service' || user.role === 'admin'
        ));
      }
    } catch (error) {
      console.error('Error loading technicians:', error);
    }
  };

  const addLaborEntry = () => {
    const newEntry: LaborEntry = {
      id: Date.now().toString(),
      description: '',
      technician: form.getValues('assignedTo'),
      startTime: new Date(),
      endTime: new Date(),
      duration: 0,
      hourlyRate: 0,
      totalCost: 0,
      isWarrantyCovered: false,
      category: 'diagnosis',
    };
    setLaborEntries([...laborEntries, newEntry]);
  };

  const updateLaborEntry = (id: string, updates: Partial<LaborEntry>) => {
    setLaborEntries(laborEntries.map(entry => 
      entry.id === id ? { ...entry, ...updates } : entry
    ));
  };

  const removeLaborEntry = (id: string) => {
    setLaborEntries(laborEntries.filter(entry => entry.id !== id));
  };

  const addPartsEntry = () => {
    const newEntry: PartsEntry = {
      id: Date.now().toString(),
      partNumber: '',
      partName: '',
      description: '',
      quantity: 1,
      unitCost: 0,
      totalCost: 0,
      isWarrantyCovered: false,
      category: 'replacement',
    };
    setPartsUsed([...partsUsed, newEntry]);
  };

  const updatePartsEntry = (id: string, updates: Partial<PartsEntry>) => {
    setPartsUsed(partsUsed.map(entry => 
      entry.id === id ? { ...entry, ...updates } : entry
    ));
  };

  const removePartsEntry = (id: string) => {
    setPartsUsed(partsUsed.filter(entry => entry.id !== id));
  };

  const addServiceEntry = () => {
    const newEntry: ServiceEntry = {
      id: Date.now().toString(),
      serviceName: '',
      description: '',
      cost: 0,
      isWarrantyCovered: false,
      category: 'diagnostic',
    };
    setServices([...services, newEntry]);
  };

  const updateServiceEntry = (id: string, updates: Partial<ServiceEntry>) => {
    setServices(services.map(entry => 
      entry.id === id ? { ...entry, ...updates } : entry
    ));
  };

  const removeServiceEntry = (id: string) => {
    setServices(services.filter(entry => entry.id !== id));
  };

  const calculateTotalCost = () => {
    const laborTotal = laborEntries.reduce((sum, entry) => sum + entry.totalCost, 0);
    const partsTotal = partsUsed.reduce((sum, entry) => sum + entry.totalCost, 0);
    const servicesTotal = services.reduce((sum, entry) => sum + entry.cost, 0);
    return laborTotal + partsTotal + servicesTotal;
  };

  const calculateWarrantyCoveredCost = () => {
    const laborWarranty = laborEntries
      .filter(entry => entry.isWarrantyCovered)
      .reduce((sum, entry) => sum + entry.totalCost, 0);
    const partsWarranty = partsUsed
      .filter(entry => entry.isWarrantyCovered)
      .reduce((sum, entry) => sum + entry.totalCost, 0);
    const servicesWarranty = services
      .filter(entry => entry.isWarrantyCovered)
      .reduce((sum, entry) => sum + entry.cost, 0);
    return laborWarranty + partsWarranty + servicesWarranty;
  };

  const onSubmit = async (data: CreateWorkOrderData) => {
    try {
      setLoading(true);
      
      const workOrderData = {
        ...data,
        laborEntries,
        partsUsed,
        services,
        totalCost: calculateTotalCost(),
        warrantyCoveredCost: calculateWarrantyCoveredCost(),
        billableCost: calculateTotalCost() - calculateWarrantyCoveredCost(),
      };

      await onSave(workOrderData);
      toast({
        title: 'Success',
        description: 'Work order saved successfully',
      });
    } catch (error) {
      console.error('Error saving work order:', error);
      toast({
        title: 'Error',
        description: 'Failed to save work order',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Work Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="serviceRequestId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Request</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service request" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {serviceRequests.map((request) => (
                          <SelectItem key={request._id} value={request._id}>
                            {request.requestNumber} - {request.customerName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned Technician</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select technician" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {technicians.map((tech) => (
                          <SelectItem key={tech._id} value={tech._id}>
                            {tech.name} ({tech.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimatedDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Duration (hours)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min="1"
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Additional notes..."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Cost Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Cost Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium text-gray-600">Total Cost</p>
                  <p className="text-lg font-bold">${calculateTotalCost().toFixed(2)}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-md">
                  <p className="text-sm font-medium text-gray-600">Warranty Covered</p>
                  <p className="text-lg font-bold text-green-600">${calculateWarrantyCoveredCost().toFixed(2)}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-md">
                  <p className="text-sm font-medium text-gray-600">Billable</p>
                  <p className="text-lg font-bold text-blue-600">${(calculateTotalCost() - calculateWarrantyCoveredCost()).toFixed(2)}</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-md">
                  <p className="text-sm font-medium text-gray-600">Labor Entries</p>
                  <p className="text-lg font-bold">{laborEntries.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Labor Entries */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Labor Entries
              </CardTitle>
              <Button type="button" onClick={addLaborEntry} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Labor
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {laborEntries.map((entry, index) => (
                <div key={entry.id} className="p-4 border rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={entry.description}
                        onChange={(e) => updateLaborEntry(entry.id, { description: e.target.value })}
                        placeholder="Labor description"
                      />
                    </div>
                    <div>
                      <Label>Duration (hours)</Label>
                      <Input
                        type="number"
                        value={entry.duration}
                        onChange={(e) => {
                          const duration = parseFloat(e.target.value) || 0;
                          const totalCost = duration * entry.hourlyRate;
                          updateLaborEntry(entry.id, { duration, totalCost });
                        }}
                      />
                    </div>
                    <div>
                      <Label>Hourly Rate</Label>
                      <Input
                        type="number"
                        value={entry.hourlyRate}
                        onChange={(e) => {
                          const hourlyRate = parseFloat(e.target.value) || 0;
                          const totalCost = entry.duration * hourlyRate;
                          updateLaborEntry(entry.id, { hourlyRate, totalCost });
                        }}
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label>Warranty Covered</Label>
                        <Select
                          value={entry.isWarrantyCovered ? 'yes' : 'no'}
                          onValueChange={(value) => updateLaborEntry(entry.id, { isWarrantyCovered: value === 'yes' })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no">No</SelectItem>
                            <SelectItem value="yes">Yes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLaborEntry(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 text-right">
                    <span className="font-medium">Total: ${entry.totalCost.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Parts Used */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Parts Used
              </CardTitle>
              <Button type="button" onClick={addPartsEntry} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Parts
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {partsUsed.map((entry, index) => (
                <div key={entry.id} className="p-4 border rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <Label>Part Name</Label>
                      <Input
                        value={entry.partName}
                        onChange={(e) => updatePartsEntry(entry.id, { partName: e.target.value })}
                        placeholder="Part name"
                      />
                    </div>
                    <div>
                      <Label>Part Number</Label>
                      <Input
                        value={entry.partNumber}
                        onChange={(e) => updatePartsEntry(entry.id, { partNumber: e.target.value })}
                        placeholder="Part number"
                      />
                    </div>
                    <div>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={entry.quantity}
                        onChange={(e) => {
                          const quantity = parseInt(e.target.value) || 0;
                          const totalCost = quantity * entry.unitCost;
                          updatePartsEntry(entry.id, { quantity, totalCost });
                        }}
                      />
                    </div>
                    <div>
                      <Label>Unit Cost</Label>
                      <Input
                        type="number"
                        value={entry.unitCost}
                        onChange={(e) => {
                          const unitCost = parseFloat(e.target.value) || 0;
                          const totalCost = entry.quantity * unitCost;
                          updatePartsEntry(entry.id, { unitCost, totalCost });
                        }}
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label>Warranty</Label>
                        <Select
                          value={entry.isWarrantyCovered ? 'yes' : 'no'}
                          onValueChange={(value) => updatePartsEntry(entry.id, { isWarrantyCovered: value === 'yes' })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no">No</SelectItem>
                            <SelectItem value="yes">Yes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removePartsEntry(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 text-right">
                    <span className="font-medium">Total: ${entry.totalCost.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Services
              </CardTitle>
              <Button type="button" onClick={addServiceEntry} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.map((entry, index) => (
                <div key={entry.id} className="p-4 border rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Service Name</Label>
                      <Input
                        value={entry.serviceName}
                        onChange={(e) => updateServiceEntry(entry.id, { serviceName: e.target.value })}
                        placeholder="Service name"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={entry.description}
                        onChange={(e) => updateServiceEntry(entry.id, { description: e.target.value })}
                        placeholder="Service description"
                      />
                    </div>
                    <div>
                      <Label>Cost</Label>
                      <Input
                        type="number"
                        value={entry.cost}
                        onChange={(e) => updateServiceEntry(entry.id, { cost: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label>Warranty</Label>
                        <Select
                          value={entry.isWarrantyCovered ? 'yes' : 'no'}
                          onValueChange={(value) => updateServiceEntry(entry.id, { isWarrantyCovered: value === 'yes' })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no">No</SelectItem>
                            <SelectItem value="yes">Yes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeServiceEntry(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Work Order'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
