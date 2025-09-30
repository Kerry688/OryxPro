'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { 
  Users,
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Shield,
  Key,
  Link,
  Search,
  Plus,
  Check,
  X,
  Eye,
  Edit,
  Calendar,
  Briefcase,
  DollarSign,
  FileText,
  AlertCircle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';

// Types
interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  roleId: string;
  branchId?: string;
  department: string;
  position: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  twoFactorEnabled: boolean;
  employeeId?: string; // Link to employee
}

interface Employee {
  _id: string;
  employeeId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  employmentInfo: {
    position: string;
    jobTitle: string;
    departmentId: string;
    employmentStatus: string;
  };
}

interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface Branch {
  _id: string;
  name: string;
  address: string;
}

interface Department {
  _id: string;
  name: string;
  description: string;
}

interface EnhancedUserFormProps {
  user?: User | null;
  onSave: (userData: any) => void;
  onCancel: () => void;
  roles: Role[];
  branches: Branch[];
  departments: Department[];
  employeesData: Employee[];
}

export function EnhancedUserForm({ 
  user, 
  onSave, 
  onCancel, 
  roles, 
  branches, 
  departments,
  employeesData
}: EnhancedUserFormProps) {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    status: user?.status || 'active',
    roleId: user?.roleId || '',
    branchId: user?.branchId || 'none',
    department: user?.department || '',
    position: user?.position || '',
    isEmailVerified: user?.isEmailVerified ?? false,
    isPhoneVerified: user?.isPhoneVerified ?? false,
    twoFactorEnabled: user?.twoFactorEnabled ?? false,
    employeeId: user?.employeeId || '',
    password: '',
    confirmPassword: '',
  });

  const [isEmployee, setIsEmployee] = useState(!!user?.employeeId);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Debug: Log form data changes
  useEffect(() => {
    console.log('Form data updated:', formData);
  }, [formData]);

  // Debug: Log props changes
  useEffect(() => {
    console.log('EnhancedUserForm props:', { roles: roles?.length, branches: branches?.length, departments: departments?.length, employeesData: employeesData?.length });
  }, [roles, branches, departments, employeesData]);


  // Auto-fill form data when employee is selected
  useEffect(() => {
    if (selectedEmployee) {
      setFormData(prev => ({
        ...prev,
        firstName: selectedEmployee.personalInfo.firstName,
        lastName: selectedEmployee.personalInfo.lastName,
        email: selectedEmployee.personalInfo.email,
        phone: selectedEmployee.personalInfo.phone,
        position: selectedEmployee.employmentInfo.position,
        employeeId: selectedEmployee.employeeId,
      }));
    }
  }, [selectedEmployee]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.roleId) newErrors.roleId = 'Role is required';
    if (!user && !formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const userData = {
        ...formData,
        isEmployee,
        linkedEmployee: selectedEmployee,
      };
      console.log('Form validation passed, calling onSave with:', userData);
      onSave(userData);
    } else {
      console.log('Form validation failed with errors:', newErrors);
    }
  };

  const filteredEmployees = employeesData.filter(emp =>
    emp.personalInfo.firstName.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
    emp.personalInfo.lastName.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
    emp.personalInfo.email.toLowerCase().includes(employeeSearchTerm.toLowerCase())
  );

  const getRole = (roleId: string) => roles.find(r => r._id === roleId);
  const getBranch = (branchId: string) => branches.find(b => b._id === branchId);
  const getDepartment = (departmentId: string) => departments.find(d => d._id === departmentId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {user ? 'Edit User' : 'Add New User'}
          </h2>
          <p className="text-muted-foreground">
            {user ? 'Update user information and permissions' : 'Create a new user account with employee linking'}
          </p>
        </div>
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="employee">Employee Link</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Enter the user's basic personal and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className={cn(errors.firstName && "border-red-500")}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className={cn(errors.lastName && "border-red-500")}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">Username *</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className={cn(errors.username && "border-red-500")}
                    />
                    {errors.username && (
                      <p className="text-sm text-red-500 mt-1">{errors.username}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={cn(errors.email && "border-red-500")}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    />
                  </div>
                </div>

                {!user && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className={cn(errors.password && "border-red-500")}
                      />
                      <PasswordStrengthIndicator 
                        password={formData.password}
                        className="mt-2"
                      />
                      {errors.password && (
                        <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className={cn(errors.confirmPassword && "border-red-500")}
                      />
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Employee Linking Tab */}
          <TabsContent value="employee" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  Employee Linking
                </CardTitle>
                <CardDescription>
                  Link this user account to an existing employee record
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isEmployee"
                    checked={isEmployee}
                    onCheckedChange={setIsEmployee}
                  />
                  <Label htmlFor="isEmployee" className="text-base font-medium">
                    This user is an employee
                  </Label>
                </div>

                {isEmployee && (
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Info className="h-4 w-4" />
                      <span>Linking to an employee will auto-fill personal information</span>
                    </div>

                    {!selectedEmployee ? (
                      <div className="space-y-4">
                        <div>
                          <Label>Search Employee</Label>
                          <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search by name, ID, or email..."
                              value={employeeSearchTerm}
                              onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>

                        <div className="max-h-60 overflow-y-auto space-y-2">
                          {isLoading ? (
                            <div className="text-center py-4 text-muted-foreground">
                              Loading employees...
                            </div>
                          ) : filteredEmployees.length > 0 ? (
                            filteredEmployees?.map((employee) => (
                              <div
                                key={employee._id}
                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer"
                                onClick={() => setSelectedEmployee(employee)}
                              >
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback>
                                      {employee.personalInfo.firstName[0]}{employee.personalInfo.lastName[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">
                                      {employee.personalInfo.firstName} {employee.personalInfo.lastName}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {employee.employeeId} • {employee.employmentInfo.jobTitle}
                                    </div>
                                  </div>
                                </div>
                                <Button size="sm" variant="outline">
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-4 text-muted-foreground">
                              No employees found
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>
                                {selectedEmployee.personalInfo.firstName[0]}{selectedEmployee.personalInfo.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {selectedEmployee.personalInfo.firstName} {selectedEmployee.personalInfo.lastName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {selectedEmployee.employeeId} • {selectedEmployee.employmentInfo.jobTitle}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-green-700 bg-green-100">
                              <Check className="h-3 w-3 mr-1" />
                              Linked
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedEmployee(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <Label className="text-muted-foreground">Employee ID</Label>
                            <p className="font-medium">{selectedEmployee.employeeId}</p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Department</Label>
                            <p className="font-medium">
                              {getDepartment(selectedEmployee.employmentInfo.departmentId)?.name || 'Unknown'}
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Position</Label>
                            <p className="font-medium">{selectedEmployee.employmentInfo.jobTitle}</p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Status</Label>
                            <p className="font-medium capitalize">
                              {selectedEmployee.employmentInfo.employmentStatus}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Role & Permissions
                </CardTitle>
                <CardDescription>
                  Assign role and organizational information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Role *</Label>
                    <Select 
                      value={formData.roleId} 
                      onValueChange={(value) => setFormData({ ...formData, roleId: value })}
                    >
                      <SelectTrigger className={cn(errors.roleId && "border-red-500")}>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles?.map(role => (
                          <SelectItem key={role._id} value={role._id}>
                            <div>
                              <div className="font-medium">{role.name}</div>
                              <div className="text-sm text-muted-foreground">{role.description}</div>
                            </div>
                          </SelectItem>
                        )) || []}
                      </SelectContent>
                    </Select>
                    {errors.roleId && (
                      <p className="text-sm text-red-500 mt-1">{errors.roleId}</p>
                    )}
                  </div>
                  <div>
                    <Label>Branch</Label>
                    <Select 
                      value={formData.branchId} 
                      onValueChange={(value) => setFormData({ ...formData, branchId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Branch</SelectItem>
                        {branches?.map(branch => (
                          <SelectItem key={branch._id} value={branch._id}>
                            <div>
                              <div className="font-medium">{branch.name}</div>
                              <div className="text-sm text-muted-foreground">{branch.address}</div>
                            </div>
                          </SelectItem>
                        )) || []}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.roleId && (
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h4 className="font-medium mb-2">Role Permissions</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {getRole(formData.roleId)?.permissions?.map((permission, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Check className="h-3 w-3 text-green-500" />
                          <span>{permission}</span>
                        </div>
                      )) || []}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure security and verification settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="isEmailVerified" className="text-base font-medium">
                        Email Verified
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Mark email as verified
                      </p>
                    </div>
                    <Switch
                      id="isEmailVerified"
                      checked={formData.isEmailVerified}
                      onCheckedChange={(checked) => setFormData({ ...formData, isEmailVerified: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="isPhoneVerified" className="text-base font-medium">
                        Phone Verified
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Mark phone number as verified
                      </p>
                    </div>
                    <Switch
                      id="isPhoneVerified"
                      checked={formData.isPhoneVerified}
                      onCheckedChange={(checked) => setFormData({ ...formData, isPhoneVerified: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="twoFactorEnabled" className="text-base font-medium">
                        Two-Factor Authentication
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Enable 2FA for enhanced security
                      </p>
                    </div>
                    <Switch
                      id="twoFactorEnabled"
                      checked={formData.twoFactorEnabled}
                      onCheckedChange={(checked) => setFormData({ ...formData, twoFactorEnabled: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Form Actions */}
        <div className="flex justify-end space-x-2 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {user ? 'Update User' : 'Create User'}
          </Button>
        </div>
      </form>
    </div>
  );
}
