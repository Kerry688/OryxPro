'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EnhancedUserForm } from '@/components/users/EnhancedUserForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users,
  ArrowLeft,
  Save,
  UserPlus,
  Building2,
  Shield,
  Link,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

// Types
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

export default function AddUserPage() {
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch roles, branches, departments, and employees in parallel
        const [rolesRes, branchesRes, departmentsRes, employeesRes] = await Promise.all([
          fetch('/api/users/roles'),
          fetch('/api/branches'),
          fetch('/api/hr/departments'),
          fetch('/api/hr/employees?limit=100') // Get more employees for linking
        ]);

        const [rolesData, branchesData, departmentsData, employeesData] = await Promise.all([
          rolesRes.json(),
          branchesRes.json(),
          departmentsRes.json(),
          employeesRes.json()
        ]);

        if (rolesData.success) {
          setRoles(rolesData.data || []);
          console.log('Loaded roles:', rolesData.data?.length || 0);
        } else {
          console.error('Failed to load roles:', rolesData.error);
        }
        
        if (branchesData.success) {
          setBranches(branchesData.data || []);
          console.log('Loaded branches:', branchesData.data?.length || 0);
        } else {
          console.error('Failed to load branches:', branchesData.error);
        }
        
        if (departmentsData.success) {
          setDepartments(departmentsData.data || []);
          console.log('Loaded departments:', departmentsData.data?.length || 0);
        } else {
          console.error('Failed to load departments:', departmentsData.error);
        }
        
        if (employeesData.success) {
          setEmployees(employeesData.data || []);
          console.log('Loaded employees:', employeesData.data?.length || 0);
        } else {
          console.error('Failed to load employees:', employeesData.error);
        }
        
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast.error('Failed to load form data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleSave = async (userData: any) => {
    try {
      setIsSaving(true);
      
      // Prepare user data for API
      const submitData = {
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        status: userData.status,
        roleId: userData.roleId,
        branchId: userData.branchId === 'none' ? null : userData.branchId || null,
        department: userData.department,
        position: userData.position,
        isEmailVerified: userData.isEmailVerified,
        isPhoneVerified: userData.isPhoneVerified,
        twoFactorEnabled: userData.twoFactorEnabled,
        employeeId: userData.employeeId || null,
        password: userData.password,
      };

      console.log('Submitting user data:', submitData);

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      let result;
      try {
        result = await response.json();
        console.log('API Response:', result);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        const textResponse = await response.text();
        console.error('Raw response:', textResponse);
        throw new Error(`Invalid response format: ${textResponse}`);
      }

      if (result.success) {
        // Show success message with details
        const successMessage = userData.isEmployee && userData.linkedEmployee
          ? `User created and linked to employee ${userData.linkedEmployee.employeeId}`
          : 'User created successfully';
        
        toast.success(successMessage, {
          description: `Username: ${userData.username}`,
          duration: 5000,
        });

        // Redirect to enhanced users page
        router.push('/users/enhanced');
      } else {
        console.error('User creation failed:', result);
        toast.error(result.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/users');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading form data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/users')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <UserPlus className="h-8 w-8" />
              Add New User
            </h1>
            <p className="text-muted-foreground">
              Create a new user account with employee linking capabilities
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
            <p className="text-xs text-muted-foreground">
              User roles available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Branches</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{branches.length}</div>
            <p className="text-xs text-muted-foreground">
              Company branches
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
            <p className="text-xs text-muted-foreground">
              HR departments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employee Linking</CardTitle>
            <Link className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              <CheckCircle className="h-6 w-6 inline" />
            </div>
            <p className="text-xs text-muted-foreground">
              Available
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto">
        <EnhancedUserForm
          onSave={handleSave}
          onCancel={handleCancel}
          roles={roles}
          branches={branches}
          departments={departments}
          employeesData={employees}
        />
      </div>

      {/* Help Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Help & Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Employee Linking</h4>
              <p className="text-sm text-muted-foreground mb-2">
                When you link a user to an employee record, the system will automatically:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Fill in personal information from employee data</li>
                <li>• Sync employment details and position</li>
                <li>• Maintain data consistency between systems</li>
                <li>• Enable single sign-on capabilities</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Security Best Practices</h4>
              <p className="text-sm text-muted-foreground mb-2">
                For enhanced security, consider:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Enabling two-factor authentication</li>
                <li>• Verifying email and phone numbers</li>
                <li>• Assigning appropriate roles and permissions</li>
                <li>• Setting strong password requirements</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
