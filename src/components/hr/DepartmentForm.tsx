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
  Building2,
  DollarSign,
  MapPin,
  Phone,
  Clock,
  Save,
  X
} from 'lucide-react';
import { CreateDepartmentDTO, UpdateDepartmentDTO } from '@/lib/models/department';

interface DepartmentFormProps {
  initialData?: Partial<CreateDepartmentDTO>;
  onSubmit: (data: CreateDepartmentDTO | UpdateDepartmentDTO) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  title?: string;
  submitLabel?: string;
}

export default function DepartmentForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  title = "Department Information",
  submitLabel = "Save Department"
}: DepartmentFormProps) {
  const [formData, setFormData] = useState<CreateDepartmentDTO>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    code: initialData?.code || '',
    parentDepartmentId: initialData?.parentDepartmentId || 'none',
    managerId: initialData?.managerId || 'none',
    budget: {
      annualBudget: initialData?.budget?.annualBudget || 0,
      currency: initialData?.budget?.currency || 'USD',
      fiscalYear: initialData?.budget?.fiscalYear || new Date().getFullYear()
    },
    location: {
      building: initialData?.location?.building || '',
      floor: initialData?.location?.floor || '',
      room: initialData?.location?.room || '',
      address: initialData?.location?.address || ''
    },
    contactInfo: {
      phone: initialData?.contactInfo?.phone || '',
      email: initialData?.contactInfo?.email || '',
      extension: initialData?.contactInfo?.extension || ''
    },
    policies: {
      workingHours: initialData?.policies?.workingHours || '',
      dressCode: initialData?.policies?.dressCode || '',
      remoteWorkPolicy: initialData?.policies?.remoteWorkPolicy || ''
    }
  });

  const handleInputChange = (field: string, value: string | number) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof CreateDepartmentDTO],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert "none" values back to empty strings for API
    const submitData = {
      ...formData,
      parentDepartmentId: formData.parentDepartmentId === 'none' ? '' : formData.parentDepartmentId,
      managerId: formData.managerId === 'none' ? '' : formData.managerId
    };
    
    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Basic Information</span>
          </CardTitle>
          <CardDescription>
            Essential department details and identification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Department Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Engineering, Marketing, Sales"
                required
              />
            </div>
            <div>
              <Label htmlFor="code">Department Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                placeholder="e.g., ENG, MKT, SAL"
                maxLength={10}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the department's purpose and responsibilities"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="parentDepartmentId">Parent Department</Label>
              <Select value={formData.parentDepartmentId} onValueChange={(value) => handleInputChange('parentDepartmentId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select parent department (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Parent Department</SelectItem>
                  <SelectItem value="DEP001">Engineering</SelectItem>
                  <SelectItem value="DEP002">Marketing</SelectItem>
                  <SelectItem value="DEP003">Sales</SelectItem>
                  <SelectItem value="DEP004">Human Resources</SelectItem>
                  <SelectItem value="DEP005">Finance</SelectItem>
                  <SelectItem value="DEP006">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="managerId">Department Manager</Label>
              <Select value={formData.managerId} onValueChange={(value) => handleInputChange('managerId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select manager (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Manager Assigned</SelectItem>
                  <SelectItem value="EMP001">John Doe - Engineering Manager</SelectItem>
                  <SelectItem value="EMP002">Jane Smith - Marketing Manager</SelectItem>
                  <SelectItem value="EMP003">Bob Johnson - Sales Manager</SelectItem>
                  <SelectItem value="EMP004">Alice Brown - HR Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Budget Information</span>
          </CardTitle>
          <CardDescription>
            Financial allocation and budget details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="annualBudget">Annual Budget *</Label>
              <Input
                id="annualBudget"
                type="number"
                value={formData.budget.annualBudget}
                onChange={(e) => handleInputChange('budget.annualBudget', parseFloat(e.target.value) || 0)}
                placeholder="500000"
                required
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency *</Label>
              <Select value={formData.budget.currency} onValueChange={(value) => handleInputChange('budget.currency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="fiscalYear">Fiscal Year *</Label>
              <Input
                id="fiscalYear"
                type="number"
                value={formData.budget.fiscalYear}
                onChange={(e) => handleInputChange('budget.fiscalYear', parseInt(e.target.value) || new Date().getFullYear())}
                min="2020"
                max="2030"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Location Information</span>
          </CardTitle>
          <CardDescription>
            Physical location and address details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="building">Building *</Label>
              <Input
                id="building"
                value={formData.location.building}
                onChange={(e) => handleInputChange('location.building', e.target.value)}
                placeholder="e.g., Tech Building, Business Building"
                required
              />
            </div>
            <div>
              <Label htmlFor="floor">Floor *</Label>
              <Input
                id="floor"
                value={formData.location.floor}
                onChange={(e) => handleInputChange('location.floor', e.target.value)}
                placeholder="e.g., 3rd Floor, Ground Floor"
                required
              />
            </div>
            <div>
              <Label htmlFor="room">Room</Label>
              <Input
                id="room"
                value={formData.location.room}
                onChange={(e) => handleInputChange('location.room', e.target.value)}
                placeholder="e.g., 301, Conference Room A"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Full Address *</Label>
            <Textarea
              id="address"
              value={formData.location.address}
              onChange={(e) => handleInputChange('location.address', e.target.value)}
              placeholder="123 Tech Street, Silicon Valley, CA 94000"
              rows={2}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Phone className="h-5 w-5" />
            <span>Contact Information</span>
          </CardTitle>
          <CardDescription>
            Department contact details and communication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.contactInfo.phone}
                onChange={(e) => handleInputChange('contactInfo.phone', e.target.value)}
                placeholder="+1-555-0100"
                required
              />
            </div>
            <div>
              <Label htmlFor="extension">Extension</Label>
              <Input
                id="extension"
                value={formData.contactInfo.extension}
                onChange={(e) => handleInputChange('contactInfo.extension', e.target.value)}
                placeholder="100"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.contactInfo.email}
                onChange={(e) => handleInputChange('contactInfo.email', e.target.value)}
                placeholder="engineering@company.com"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Policies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Department Policies</span>
          </CardTitle>
          <CardDescription>
            Working policies and guidelines for the department
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="workingHours">Working Hours *</Label>
              <Input
                id="workingHours"
                value={formData.policies.workingHours}
                onChange={(e) => handleInputChange('policies.workingHours', e.target.value)}
                placeholder="e.g., 9 AM - 5 PM PST"
                required
              />
            </div>
            <div>
              <Label htmlFor="dressCode">Dress Code *</Label>
              <Select value={formData.policies.dressCode} onValueChange={(value) => handleInputChange('policies.dressCode', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select dress code" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Casual">Casual</SelectItem>
                  <SelectItem value="Business Casual">Business Casual</SelectItem>
                  <SelectItem value="Business Professional">Business Professional</SelectItem>
                  <SelectItem value="Uniform Required">Uniform Required</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="remoteWorkPolicy">Remote Work Policy *</Label>
              <Select value={formData.policies.remoteWorkPolicy} onValueChange={(value) => handleInputChange('policies.remoteWorkPolicy', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select remote work policy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Office Only">Office Only</SelectItem>
                  <SelectItem value="Hybrid (2 days office)">Hybrid (2 days office)</SelectItem>
                  <SelectItem value="Hybrid (3 days office)">Hybrid (3 days office)</SelectItem>
                  <SelectItem value="Remote Friendly">Remote Friendly</SelectItem>
                  <SelectItem value="Fully Remote">Fully Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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
          {loading ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
