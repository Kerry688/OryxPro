'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Calendar,
  Clock,
  AlertCircle,
  Save,
  X
} from 'lucide-react';
import { CreateLeaveRequestDTO, UpdateLeaveRequestDTO } from '@/lib/models/leaveRequest';

interface LeaveRequestFormProps {
  initialData?: Partial<CreateLeaveRequestDTO>;
  onSubmit: (data: CreateLeaveRequestDTO | UpdateLeaveRequestDTO) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  title?: string;
  submitLabel?: string;
  mode?: 'create' | 'edit';
}

export default function LeaveRequestForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  title = "Leave Request Details",
  submitLabel = "Submit Request",
  mode = 'create'
}: LeaveRequestFormProps) {
  const [formData, setFormData] = useState<CreateLeaveRequestDTO>({
    employeeId: initialData?.employeeId || '',
    leaveType: initialData?.leaveType || '',
    startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
    endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
    reason: initialData?.reason || '',
    attachments: initialData?.attachments || []
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const timeDiff = end.getTime() - start.getTime();
      return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    }
    return 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate dates
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      alert('End date cannot be before start date');
      return;
    }

    const submitData = {
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate)
    };
    
    await onSubmit(submitData);
  };

  const leaveTypes = [
    { value: 'annual', label: 'Annual Leave' },
    { value: 'sick', label: 'Sick Leave' },
    { value: 'personal', label: 'Personal Leave' },
    { value: 'maternity', label: 'Maternity Leave' },
    { value: 'paternity', label: 'Paternity Leave' },
    { value: 'unpaid', label: 'Unpaid Leave' },
    { value: 'emergency', label: 'Emergency Leave' },
    { value: 'study', label: 'Study Leave' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>{title}</span>
          </CardTitle>
          <CardDescription>
            {mode === 'create' 
              ? 'Fill in the details for the leave request'
              : 'Update the leave request details'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="employeeId">Employee ID *</Label>
              <Select 
                value={formData.employeeId} 
                onValueChange={(value) => handleInputChange('employeeId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMP001">John Doe - EMP001</SelectItem>
                  <SelectItem value="EMP002">Jane Smith - EMP002</SelectItem>
                  <SelectItem value="EMP003">Bob Johnson - EMP003</SelectItem>
                  <SelectItem value="EMP004">Alice Brown - EMP004</SelectItem>
                  <SelectItem value="EMP005">Mike Wilson - EMP005</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="leaveType">Leave Type *</Label>
              <Select 
                value={formData.leaveType} 
                onValueChange={(value) => handleInputChange('leaveType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  {leaveTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Duration Display */}
          {formData.startDate && formData.endDate && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Total Duration: {calculateDays()} day{calculateDays() !== 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-xs text-blue-700 mt-1">
                From {new Date(formData.startDate).toLocaleDateString()} to {new Date(formData.endDate).toLocaleDateString()}
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="reason">Reason for Leave *</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              placeholder="Please provide a detailed reason for your leave request..."
              rows={4}
              required
            />
          </div>

          {/* Validation Warnings */}
          {formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">Date Error</span>
              </div>
              <p className="text-xs text-red-700 mt-1">
                End date cannot be before start date. Please correct the dates.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Processing...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
