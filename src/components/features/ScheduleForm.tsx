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
  TechnicianSchedule, 
  CreateScheduleData,
  ScheduleStatus,
  ScheduleType,
  RecurrenceType
} from '@/lib/models/schedule';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Wrench, 
  AlertTriangle,
  Repeat,
  Settings
} from 'lucide-react';

const scheduleFormSchema = z.object({
  technicianId: z.string().min(1, 'Technician is required'),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  status: z.enum(['available', 'busy', 'unavailable', 'on_break', 'off_duty']),
  type: z.enum(['work', 'break', 'training', 'meeting', 'maintenance', 'emergency']),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  workOrderId: z.string().optional(),
  serviceRequestId: z.string().optional(),
  customerId: z.string().optional(),
  customerName: z.string().optional(),
  location: z.string().optional(),
  isRecurring: z.boolean(),
  recurrenceType: z.enum(['none', 'daily', 'weekly', 'monthly']),
  isAllDay: z.boolean(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  estimatedDuration: z.number().min(1, 'Duration must be at least 1 minute'),
  notes: z.string().optional(),
});

interface ScheduleFormProps {
  schedule?: TechnicianSchedule | null;
  onSave: (data: any) => void;
  onCancel: () => void;
  technicians: any[];
}

export function ScheduleForm({ schedule, onSave, onCancel, technicians }: ScheduleFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [showRecurrence, setShowRecurrence] = useState(false);

  const form = useForm<CreateScheduleData>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      technicianId: schedule?.technicianId || '',
      date: schedule?.date ? new Date(schedule.date).toISOString().split('T')[0] : '',
      startTime: schedule?.startTime ? new Date(schedule.startTime).toTimeString().slice(0, 5) : '',
      endTime: schedule?.endTime ? new Date(schedule.endTime).toTimeString().slice(0, 5) : '',
      status: schedule?.status || 'available',
      type: schedule?.type || 'work',
      title: schedule?.title || '',
      description: schedule?.description || '',
      workOrderId: schedule?.workOrderId || '',
      serviceRequestId: schedule?.serviceRequestId || '',
      customerId: schedule?.customerId || '',
      customerName: schedule?.customerName || '',
      location: schedule?.location || '',
      isRecurring: schedule?.isRecurring || false,
      recurrenceType: schedule?.recurrenceType || 'none',
      isAllDay: schedule?.isAllDay || false,
      priority: schedule?.priority || 'medium',
      estimatedDuration: schedule?.estimatedDuration || 60,
      notes: schedule?.notes || '',
      createdBy: user?.id || '',
    },
  });

  useEffect(() => {
    loadServiceRequests();
    loadWorkOrders();
    loadCustomers();
  }, []);

  useEffect(() => {
    setShowRecurrence(form.watch('isRecurring'));
  }, [form.watch('isRecurring')]);

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

  const loadWorkOrders = async () => {
    try {
      const response = await fetch('/api/service-requests/work-orders');
      const data = await response.json();
      if (data.success) {
        setWorkOrders(data.data);
      }
    } catch (error) {
      console.error('Error loading work orders:', error);
    }
  };

  const loadCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      const data = await response.json();
      if (data.success) {
        setCustomers(data.data);
      }
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const handleServiceRequestChange = (serviceRequestId: string) => {
    if (serviceRequestId === 'none') {
      form.setValue('customerId', '');
      form.setValue('customerName', '');
      form.setValue('title', '');
      form.setValue('description', '');
      return;
    }
    
    const serviceRequest = serviceRequests.find(sr => sr._id === serviceRequestId);
    if (serviceRequest) {
      form.setValue('customerId', serviceRequest.customerId);
      form.setValue('customerName', serviceRequest.customerName);
      form.setValue('title', `Service Request: ${serviceRequest.requestNumber}`);
      form.setValue('description', serviceRequest.issueDescription);
    }
  };

  const handleWorkOrderChange = (workOrderId: string) => {
    if (workOrderId === 'none') {
      form.setValue('customerId', '');
      form.setValue('customerName', '');
      form.setValue('title', '');
      form.setValue('description', '');
      return;
    }
    
    const workOrder = workOrders.find(wo => wo._id === workOrderId);
    if (workOrder) {
      form.setValue('customerId', workOrder.customerId);
      form.setValue('customerName', workOrder.customerName);
      form.setValue('title', `Work Order: ${workOrder.workOrderNumber}`);
    }
  };

  const handleCustomerChange = (customerId: string) => {
    if (customerId === 'none') {
      form.setValue('customerName', '');
      return;
    }
    
    const customer = customers.find(c => c._id === customerId);
    if (customer) {
      form.setValue('customerName', customer.name);
    }
  };

  const calculateDuration = () => {
    const startTime = form.getValues('startTime');
    const endTime = form.getValues('endTime');
    
    if (startTime && endTime) {
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);
      const duration = (end.getTime() - start.getTime()) / (1000 * 60); // in minutes
      form.setValue('estimatedDuration', Math.max(1, duration));
    }
  };

  const onSubmit = async (data: CreateScheduleData) => {
    try {
      setLoading(true);
      
      // Convert date and time strings to Date objects
      const date = new Date(data.date);
      const startTime = new Date(`${data.date}T${data.startTime}`);
      const endTime = new Date(`${data.date}T${data.endTime}`);

      const scheduleData = {
        ...data,
        date,
        startTime,
        endTime,
        technicianName: technicians.find(t => t._id === data.technicianId)?.name || '',
      };

      await onSave(scheduleData);
      toast({
        title: 'Success',
        description: 'Schedule saved successfully',
      });
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to save schedule',
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
                <Calendar className="h-4 w-4" />
                Schedule Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="technicianId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technician</FormLabel>
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
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
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
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="time"
                          onChange={(e) => {
                            field.onChange(e);
                            calculateDuration();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="time"
                          onChange={(e) => {
                            field.onChange(e);
                            calculateDuration();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isAllDay"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>All Day</FormLabel>
                  </FormItem>
                )}
              />

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

          {/* Schedule Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Schedule Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Schedule title" />
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
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="busy">Busy</SelectItem>
                          <SelectItem value="unavailable">Unavailable</SelectItem>
                          <SelectItem value="on_break">On Break</SelectItem>
                          <SelectItem value="off_duty">Off Duty</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="work">Work</SelectItem>
                          <SelectItem value="break">Break</SelectItem>
                          <SelectItem value="training">Training</SelectItem>
                          <SelectItem value="meeting">Meeting</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Location (optional)" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        {/* Related Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Related Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="serviceRequestId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Request</FormLabel>
                    <Select onValueChange={(value) => {
                      field.onChange(value);
                      handleServiceRequestChange(value);
                    }} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service request" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No service request</SelectItem>
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
                name="workOrderId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Order</FormLabel>
                    <Select onValueChange={(value) => {
                      field.onChange(value);
                      handleWorkOrderChange(value);
                    }} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select work order" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No work order</SelectItem>
                        {workOrders.map((order) => (
                          <SelectItem key={order._id} value={order._id}>
                            {order.workOrderNumber} - {order.customerName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <Select onValueChange={(value) => {
                      field.onChange(value);
                      handleCustomerChange(value);
                    }} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No customer</SelectItem>
                        {customers.map((customer) => (
                          <SelectItem key={customer._id} value={customer._id}>
                            {customer.name} ({customer.email})
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
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Customer name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Recurrence Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Repeat className="h-4 w-4" />
              Recurrence Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="isRecurring"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Recurring Schedule</FormLabel>
                </FormItem>
              )}
            />

            {showRecurrence && (
              <FormField
                control={form.control}
                name="recurrenceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recurrence Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select recurrence type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No Recurrence</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        {/* Description and Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Schedule description..."
                      rows={3}
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

        {/* Form Actions */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Schedule'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
