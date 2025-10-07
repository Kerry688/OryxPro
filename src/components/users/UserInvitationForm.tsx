'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  Send, 
  UserPlus, 
  Building2, 
  Briefcase, 
  ShoppingCart,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { UserType, LoginPortal, UserRole } from '@/lib/models/user';
import { toast } from 'sonner';

interface InvitationFormData {
  firstName: string;
  lastName: string;
  email: string;
  userType: UserType;
  role: UserRole;
  loginPortal: LoginPortal;
  
  // Customer-specific fields
  customerId?: string;
  companyName?: string;
  
  // Employee-specific fields
  employeeId?: string;
  department?: string;
  position?: string;
  
  // Additional fields
  phone?: string;
}

interface UserInvitationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function UserInvitationForm({ onSuccess, onCancel }: UserInvitationFormProps) {
  const [formData, setFormData] = useState<InvitationFormData>({
    firstName: '',
    lastName: '',
    email: '',
    userType: UserType.ERP_USER,
    role: UserRole.ADMIN,
    loginPortal: LoginPortal.ERP_SYSTEM,
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [invitationUrl, setInvitationUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/users/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        setInvitationUrl(data.invitationUrl || '');
        toast.success('User invitation sent successfully!');
        onSuccess?.();
      } else {
        toast.error(data.message || 'Failed to send invitation');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserTypeChange = (userType: UserType) => {
    const roleOptions = getRoleOptions(userType);
    const portalOptions = getPortalOptions(userType);
    
    setFormData(prev => ({
      ...prev,
      userType,
      role: roleOptions[0]?.value || UserRole.ADMIN,
      loginPortal: portalOptions[0]?.value || LoginPortal.ERP_SYSTEM
    }));
  };

  const getRoleOptions = (userType: UserType) => {
    switch (userType) {
      case UserType.ERP_USER:
        return [
          { value: UserRole.SUPER_ADMIN, label: 'Super Admin' },
          { value: UserRole.ADMIN, label: 'Admin' },
          { value: UserRole.MANAGER, label: 'Manager' },
          { value: UserRole.BRANCH_MANAGER, label: 'Branch Manager' },
          { value: UserRole.WAREHOUSE_MANAGER, label: 'Warehouse Manager' },
          { value: UserRole.SALES_REP, label: 'Sales Rep' }
        ];
      case UserType.EMPLOYEE:
        return [
          { value: UserRole.EMPLOYEE_ADMIN, label: 'Employee Admin' },
          { value: UserRole.HR_MANAGER, label: 'HR Manager' },
          { value: UserRole.EMPLOYEE, label: 'Employee' }
        ];
      case UserType.CUSTOMER:
        return [
          { value: UserRole.CUSTOMER_ADMIN, label: 'Customer Admin' },
          { value: UserRole.CUSTOMER, label: 'Customer' }
        ];
      default:
        return [];
    }
  };

  const getPortalOptions = (userType: UserType) => {
    switch (userType) {
      case UserType.ERP_USER:
        return [
          { value: LoginPortal.ERP_SYSTEM, label: 'ERP System' },
          { value: LoginPortal.EMPLOYEE_PORTAL, label: 'Employee Portal' },
          { value: LoginPortal.CUSTOMER_PORTAL, label: 'Customer Portal' }
        ];
      case UserType.EMPLOYEE:
        return [
          { value: LoginPortal.EMPLOYEE_PORTAL, label: 'Employee Portal' }
        ];
      case UserType.CUSTOMER:
        return [
          { value: LoginPortal.CUSTOMER_PORTAL, label: 'Customer Portal' }
        ];
      default:
        return [];
    }
  };

  const getUserTypeIcon = (userType: UserType) => {
    switch (userType) {
      case UserType.ERP_USER:
        return Building2;
      case UserType.EMPLOYEE:
        return Briefcase;
      case UserType.CUSTOMER:
        return ShoppingCart;
      default:
        return UserPlus;
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-green-900 mb-2">Invitation Sent Successfully!</h3>
          <p className="text-gray-600">
            An invitation email has been sent to <strong>{formData.email}</strong>
          </p>
        </div>

        {invitationUrl && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800 mb-2">
                  Development Mode - Invitation Link:
                </p>
                <code className="text-xs bg-white px-2 py-1 rounded border break-all">
                  {invitationUrl}
                </code>
                <p className="text-xs text-blue-600 mt-1">
                  Copy this link to test the invitation flow
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Invitation Details</h4>
          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Type:</strong> {formData.userType.replace('_', ' ')}</p>
            <p><strong>Role:</strong> {formData.role.replace('_', ' ')}</p>
            <p><strong>Portal:</strong> {formData.loginPortal.replace('_', ' ')}</p>
            {formData.companyName && (
              <p><strong>Company:</strong> {formData.companyName}</p>
            )}
            {formData.department && (
              <p><strong>Department:</strong> {formData.department}</p>
            )}
            {formData.position && (
              <p><strong>Position:</strong> {formData.position}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Close
          </Button>
          <Button onClick={() => {
            setIsSuccess(false);
            setFormData({
              firstName: '',
              lastName: '',
              email: '',
              userType: UserType.ERP_USER,
              role: UserRole.ADMIN,
              loginPortal: LoginPortal.ERP_SYSTEM,
              phone: ''
            });
          }}>
            Send Another Invitation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="access">Access & Roles</TabsTrigger>
          <TabsTrigger value="details">Additional Details</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="Enter first name"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Enter phone number"
            />
          </div>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <div>
            <Label htmlFor="userType">User Type</Label>
            <Select value={formData.userType} onValueChange={handleUserTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserType.ERP_USER}>ERP User</SelectItem>
                <SelectItem value={UserType.EMPLOYEE}>Employee</SelectItem>
                <SelectItem value={UserType.CUSTOMER}>Customer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as UserRole }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {getRoleOptions(formData.userType).map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="loginPortal">Login Portal</Label>
            <Select 
              value={formData.loginPortal} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, loginPortal: value as LoginPortal }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select portal" />
              </SelectTrigger>
              <SelectContent>
                {getPortalOptions(formData.userType).map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {formData.userType === UserType.CUSTOMER && (
            <>
              <div>
                <Label htmlFor="customerId">Customer ID (Optional)</Label>
                <Input
                  id="customerId"
                  value={formData.customerId}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerId: e.target.value }))}
                  placeholder="Enter customer ID"
                />
              </div>
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder="Enter company name"
                />
              </div>
            </>
          )}

          {formData.userType === UserType.EMPLOYEE && (
            <>
              <div>
                <Label htmlFor="employeeId">Employee ID (Optional)</Label>
                <Input
                  id="employeeId"
                  value={formData.employeeId}
                  onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                  placeholder="Enter employee ID"
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="Enter department"
                />
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  placeholder="Enter position"
                />
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Invitation Process</p>
            <ul className="space-y-1 text-blue-700">
              <li>• An email invitation will be sent to the user</li>
              <li>• User will receive a secure invitation link</li>
              <li>• User can set their password and complete registration</li>
              <li>• Invitation expires after 7 days</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Sending...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Send className="h-4 w-4" />
              <span>Send Invitation</span>
            </div>
          )}
        </Button>
      </div>
    </form>
  );
}
