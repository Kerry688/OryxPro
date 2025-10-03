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
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  ServiceHistoryEntry, 
  CreateServiceHistoryData,
  ServiceHistoryType,
  ServiceHistoryStatus,
  ServicePriority,
  ServiceOutcome,
  ServiceItem,
  ServicePart
} from '@/lib/models/service-history';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { 
  Wrench, 
  Clock, 
  User, 
  MapPin, 
  DollarSign,
  Shield,
  Star,
  FileText,
  Plus,
  Trash2
} from 'lucide-react';

const serviceHistoryFormSchema = z.object({
  serviceType: z.enum([
    'installation', 'maintenance', 'repair', 'warranty_claim', 'inspection',
    'upgrade', 'replacement', 'calibration', 'cleaning', 'diagnostic',
    'emergency_repair', 'preventive_maintenance', 'warranty_service', 'recall', 'end_of_life'
  ]),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled', 'on_hold', 'failed']),
  priority: z.enum(['low', 'medium', 'high', 'urgent', 'critical']),
  scheduledDate: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  estimatedDuration: z.number().min(1, 'Duration must be at least 1 minute'),
  technicianId: z.string().optional(),
  technicianName: z.string().optional(),
  serviceProviderId: z.string().optional(),
  serviceProviderName: z.string().optional(),
  serviceLocation: z.string().optional(),
  customerId: z.string().optional(),
  customerName: z.string().optional(),
  customerContact: z.string().optional(),
  serviceRequestId: z.string().optional(),
  workOrderId: z.string().optional(),
  warrantyClaimId: z.string().optional(),
  invoiceId: z.string().optional(),
  purchaseOrderId: z.string().optional(),
  laborHours: z.number().min(0, 'Labor hours must be non-negative'),
  totalCost: z.number().min(0, 'Total cost must be non-negative'),
  warrantyCoverage: z.number().min(0, 'Warranty coverage must be non-negative'),
  customerCharge: z.number().min(0, 'Customer charge must be non-negative'),
  notes: z.string().optional(),
  recommendations: z.string().optional(),
  followUpRequired: z.boolean(),
  followUpDate: z.string().optional(),
  customerRating: z.number().min(1).max(5).optional(),
  customerFeedback: z.string().optional(),
  technicianNotes: z.string().optional(),
  qualityCheckPassed: z.boolean().optional(),
});

interface ServiceHistoryFormProps {
  service?: ServiceHistoryEntry | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function ServiceHistoryForm({ service, onSave, onCancel }: ServiceHistoryFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [partsUsed, setPartsUsed] = useState<ServicePart[]>([]);

  const form = useForm<CreateServiceHistoryData>({
    resolver: zodResolver(serviceHistoryFormSchema),
    defaultValues: {
      serviceType: service?.serviceType || 'maintenance',
      title: service?.title || '',
      description: service?.description || '',
      status: service?.status || 'pending',
      priority: service?.priority || 'medium',
      scheduledDate: service?.scheduledDate ? new Date(service.scheduledDate).toISOString().split('T')[0] : '',
      startDate: service?.startDate ? new Date(service.startDate).toISOString().split('T')[0] : '',
      endDate: service?.endDate ? new Date(service.endDate).toISOString().split('T')[0] : '',
      estimatedDuration: service?.estimatedDuration || 60,
      technicianId: service?.technicianId || '',
      technicianName: service?.technicianName || '',
      serviceProviderId: service?.serviceProviderId || '',
      serviceProviderName: service?.serviceProviderName || '',
      serviceLocation: service?.serviceLocation || '',
      customerId: service?.customerId || '',
      customerName: service?.customerName || '',
      customerContact: service?.customerContact || '',
      serviceRequestId: service?.serviceRequestId || '',
      workOrderId: service?.workOrderId || '',
      warrantyClaimId: service?.warrantyClaimId || '',
      invoiceId: service?.invoiceId || '',
      purchaseOrderId: service?.purchaseOrderId || '',
      laborHours: service?.laborHours || 0,
      totalCost: service?.totalCost || 0,
      warrantyCoverage: service?.warrantyCoverage || 0,
      customerCharge: service?.customerCharge || 0,
      notes: service?.notes || '',
      recommendations: service?.recommendations || '',
      followUpRequired: service?.followUpRequired || false,
      followUpDate: service?.followUpDate ? new Date(service.followUpDate).toISOString().split('T')[0] : '',
      customerRating: service?.customerRating || undefined,
      customerFeedback: service?.customerFeedback || '',
      technicianNotes: service?.technicianNotes || '',
      qualityCheckPassed: service?.qualityCheckPassed || false,
      createdBy: user?.id || '',
    },
  });

  useEffect(() => {
    if (service) {
      setServiceItems(service.serviceItems || []);
      setPartsUsed(service.partsUsed || []);
    }
  }, [service]);

  const addServiceItem = () => {
    const newItem: ServiceItem = {
      id: Date.now().toString(),
      name: '',
      description: '',
      category: '',
      quantity: 1,
      unitCost: 0,
      totalCost: 0,
      warrantyCovered: false,
    };
    setServiceItems([...serviceItems, newItem]);
  };

  const updateServiceItem = (index: number, field: keyof ServiceItem, value: any) => {
    const updated = [...serviceItems];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'unitCost') {
      updated[index].totalCost = updated[index].quantity * updated[index].unitCost;
    }
    setServiceItems(updated);
  };

  const removeServiceItem = (index: number) => {
    setServiceItems(serviceItems.filter((_, i) => i !== index));
  };

  const addPart = () => {
    const newPart: ServicePart = {
      id: Date.now().toString(),
      partNumber: '',
      partName: '',
      description: '',
      category: '',
      quantity: 1,
      unitCost: 0,
      totalCost: 0,
      warrantyCovered: false,
    };
    setPartsUsed([...partsUsed, newPart]);
  };

  const updatePart = (index: number, field: keyof ServicePart, value: any) => {
    const updated = [...partsUsed];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'unitCost') {
      updated[index].totalCost = updated[index].quantity * updated[index].unitCost;
    }
    setPartsUsed(updated);
  };

  const removePart = (index: number) => {
    setPartsUsed(partsUsed.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const serviceItemsTotal = serviceItems.reduce((sum, item) => sum + item.totalCost, 0);
    const partsTotal = partsUsed.reduce((sum, part) => sum + part.totalCost, 0);
    const laborTotal = form.getValues('laborHours') * 50; // Assuming $50/hour labor rate
    
    const totalCost = serviceItemsTotal + partsTotal + laborTotal;
    const warrantyCoverage = serviceItemsTotal + partsTotal; // Simplified calculation
    const customerCharge = totalCost - warrantyCoverage;
    
    form.setValue('totalCost', totalCost);
    form.setValue('warrantyCoverage', warrantyCoverage);
    form.setValue('customerCharge', customerCharge);
  };

  useEffect(() => {
    calculateTotals();
  }, [serviceItems, partsUsed, form.watch('laborHours')]);

  const onSubmit = async (data: CreateServiceHistoryData) => {
    try {
      setLoading(true);
      
      const serviceData = {
        ...data,
        serviceItems,
        partsUsed,
        scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : undefined,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        followUpDate: data.followUpDate ? new Date(data.followUpDate) : undefined,
      };

      await onSave(serviceData);
      toast({
        title: 'Success',
        description: 'Service record saved successfully',
      });
    } catch (error) {
      console.error('Error saving service record:', error);
      toast({
        title: 'Error',
        description: 'Failed to save service record',
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
                Service Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Service title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Service description..."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="on_hold">On Hold</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Dates and Timing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Dates & Timing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="scheduledDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scheduled Date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="estimatedDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
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
            </CardContent>
          </Card>
        </div>

        {/* Service Provider & Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Service Provider & Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="technicianName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technician Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Technician name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serviceProviderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Provider</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Service provider name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="serviceLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Location</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Service location" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Service Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Service Items
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {serviceItems.map((item, index) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-md">
                <div className="md:col-span-2">
                  <Label>Item Name</Label>
                  <Input
                    value={item.name}
                    onChange={(e) => updateServiceItem(index, 'name', e.target.value)}
                    placeholder="Item name"
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input
                    value={item.category}
                    onChange={(e) => updateServiceItem(index, 'category', e.target.value)}
                    placeholder="Category"
                  />
                </div>
                <div>
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateServiceItem(index, 'quantity', parseInt(e.target.value))}
                    min="1"
                  />
                </div>
                <div>
                  <Label>Unit Cost</Label>
                  <Input
                    type="number"
                    value={item.unitCost}
                    onChange={(e) => updateServiceItem(index, 'unitCost', parseFloat(e.target.value))}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label>Total: ${item.totalCost.toFixed(2)}</Label>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeServiceItem(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            <Button type="button" variant="outline" onClick={addServiceItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add Service Item
            </Button>
          </CardContent>
        </Card>

        {/* Parts Used */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Parts Used
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {partsUsed.map((part, index) => (
              <div key={part.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-md">
                <div className="md:col-span-2">
                  <Label>Part Name</Label>
                  <Input
                    value={part.partName}
                    onChange={(e) => updatePart(index, 'partName', e.target.value)}
                    placeholder="Part name"
                  />
                </div>
                <div>
                  <Label>Part Number</Label>
                  <Input
                    value={part.partNumber}
                    onChange={(e) => updatePart(index, 'partNumber', e.target.value)}
                    placeholder="Part number"
                  />
                </div>
                <div>
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={part.quantity}
                    onChange={(e) => updatePart(index, 'quantity', parseInt(e.target.value))}
                    min="1"
                  />
                </div>
                <div>
                  <Label>Unit Cost</Label>
                  <Input
                    type="number"
                    value={part.unitCost}
                    onChange={(e) => updatePart(index, 'unitCost', parseFloat(e.target.value))}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label>Total: ${part.totalCost.toFixed(2)}</Label>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePart(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            <Button type="button" variant="outline" onClick={addPart}>
              <Plus className="h-4 w-4 mr-2" />
              Add Part
            </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="laborHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Labor Hours</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min="0"
                        step="0.1"
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Cost</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min="0"
                        step="0.01"
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="warrantyCoverage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warranty Coverage</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min="0"
                        step="0.01"
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customerCharge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Charge</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min="0"
                        step="0.01"
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name="followUpRequired"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Follow-up Required</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {form.watch('followUpRequired') && (
              <FormField
                control={form.control}
                name="followUpDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Follow-up Date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        {/* Notes and Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Notes & Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Service notes..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recommendations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recommendations</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Service recommendations..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customerRating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Rating (1-5)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min="1" 
                        max="5"
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="qualityCheckPassed"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Quality Check Passed</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="customerFeedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Feedback</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Customer feedback..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="technicianNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technician Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Technician notes..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Service Record'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
