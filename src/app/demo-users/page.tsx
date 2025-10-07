'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  UserCheck, 
  RefreshCw,
  Copy,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Key,
  Shield,
  Briefcase,
  ShoppingCart
} from 'lucide-react';
import { UserType, LoginPortal, UserRole } from '@/lib/models/user';
import { toast } from 'sonner';

interface DemoUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: UserType;
  loginPortal: LoginPortal;
  role: UserRole;
  isActive: boolean;
}

export default function DemoUsersPage() {
  const [demoUsers, setDemoUsers] = useState<DemoUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const loadDemoUsers = async () => {
    try {
      const response = await fetch('/api/auth/demo-users');
      const data = await response.json();
      
      if (data.success) {
        setDemoUsers(data.users);
      }
    } catch (error) {
      console.error('Error loading demo users:', error);
    }
  };

  const createDemoUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/demo-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Demo users created successfully!');
        await loadDemoUsers();
      } else {
        toast.error(data.message || 'Failed to create demo users');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedEmail(text);
      toast.success(`${type} copied to clipboard!`);
      setTimeout(() => setCopiedEmail(null), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const getPortalConfig = (portal: LoginPortal) => {
    switch (portal) {
      case LoginPortal.ERP_SYSTEM:
        return {
          title: 'ERP System',
          icon: Building2,
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          bgColor: 'bg-blue-50'
        };
      case LoginPortal.EMPLOYEE_PORTAL:
        return {
          title: 'Employee Portal',
          icon: Users,
          color: 'bg-green-100 text-green-800 border-green-200',
          bgColor: 'bg-green-50'
        };
      case LoginPortal.CUSTOMER_PORTAL:
        return {
          title: 'Customer Portal',
          icon: UserCheck,
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          bgColor: 'bg-purple-50'
        };
      default:
        return {
          title: 'Unknown',
          icon: Shield,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          bgColor: 'bg-gray-50'
        };
    }
  };

  const getUserTypeIcon = (userType: UserType) => {
    switch (userType) {
      case UserType.ERP_USER:
        return Building2;
      case UserType.EMPLOYEE:
        return Users;
      case UserType.CUSTOMER:
        return UserCheck;
      default:
        return User;
    }
  };

  const getDefaultPassword = (email: string) => {
    if (email.includes('admin')) return 'admin123';
    if (email.includes('manager')) return 'manager123';
    if (email.includes('sales')) return 'sales123';
    if (email.includes('hr')) return 'hr123';
    if (email.includes('employee')) return 'employee123';
    if (email.includes('customer')) return 'customer123';
    if (email.includes('business')) return 'business123';
    if (email.includes('erp')) return 'erp123';
    return 'password123';
  };

  useEffect(() => {
    loadDemoUsers();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Demo Users</h1>
          <p className="text-gray-600 mt-2">
            Pre-configured test accounts for all portals
          </p>
        </div>
        <Button 
          onClick={createDemoUsers} 
          disabled={isLoading}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Creating...' : 'Create Demo Users'}</span>
        </Button>
      </div>

      {demoUsers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Demo Users Found</h3>
            <p className="text-gray-600 text-center mb-6">
              Create demo users to test the split login system across all portals.
            </p>
            <Button onClick={createDemoUsers} disabled={isLoading}>
              Create Demo Users
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoUsers.map((user) => {
            const portalConfig = getPortalConfig(user.loginPortal);
            const UserTypeIcon = getUserTypeIcon(user.userType);
            const PortalIcon = portalConfig.icon;
            const password = getDefaultPassword(user.email);

            return (
              <Card key={user._id} className={`${portalConfig.bgColor} border-l-4 border-l-blue-500`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <UserTypeIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{user.firstName} {user.lastName}</CardTitle>
                        <CardDescription className="text-sm">{user.role.replace('_', ' ')}</CardDescription>
                      </div>
                    </div>
                    <Badge className={portalConfig.color}>
                      <PortalIcon className="h-3 w-3 mr-1" />
                      {portalConfig.title}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">Email:</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {user.email}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(user.email, 'Email')}
                          className="h-6 w-6 p-0"
                        >
                          {copiedEmail === user.email ? (
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Key className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">Password:</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {password}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(password, 'Password')}
                          className="h-6 w-6 p-0"
                        >
                          {copiedEmail === password ? (
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">Type:</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {user.userType.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>Status:</span>
                      <div className="flex items-center space-x-1">
                        {user.isActive ? (
                          <>
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span className="text-green-600">Active</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3 text-red-600" />
                            <span className="text-red-600">Inactive</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5" />
            <span>Portal Access Rules</span>
          </CardTitle>
          <CardDescription>
            Understanding which users can access which portals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                <Building2 className="h-4 w-4 mr-2" />
                ERP System
              </h4>
              <p className="text-sm text-blue-700">
                Full access to all ERP modules and functionality
              </p>
              <Badge className="mt-2 bg-blue-100 text-blue-800">
                ERP Users Only
              </Badge>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Employee Portal
              </h4>
              <p className="text-sm text-green-700">
                Self-service portal for employees
              </p>
              <Badge className="mt-2 bg-green-100 text-green-800">
                Employees + ERP Users
              </Badge>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2 flex items-center">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Customer Portal
              </h4>
              <p className="text-sm text-purple-700">
                Self-service portal for customers
              </p>
              <Badge className="mt-2 bg-purple-100 text-purple-800">
                Customers + ERP Users
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}