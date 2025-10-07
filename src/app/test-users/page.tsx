'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  ShoppingCart, 
  UserCheck,
  Copy,
  CheckCircle,
  RefreshCw,
  Mail,
  Key,
  Shield,
  Briefcase,
  Database,
  Eye,
  EyeOff
} from 'lucide-react';
import { UserType, LoginPortal, UserRole } from '@/lib/models/user';
import { toast } from 'sonner';

interface TestUserCredentials {
  name: string;
  email: string;
  password: string;
  userType: UserType;
  loginPortal: LoginPortal;
  role: UserRole;
}

export default function TestUsersPage() {
  const [credentials, setCredentials] = useState<TestUserCredentials[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});

  const loadCredentials = async () => {
    try {
      const response = await fetch('/api/auth/seed-test-users');
      const data = await response.json();
      
      if (data.success) {
        setCredentials(data.credentials);
      }
    } catch (error) {
      console.error('Error loading credentials:', error);
    }
  };

  const createTestUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/seed-test-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Test users created successfully!');
        await loadCredentials();
      } else {
        toast.error(data.message || 'Failed to create test users');
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
      setCopiedItem(text);
      toast.success(`${type} copied to clipboard!`);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const togglePasswordVisibility = (email: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [email]: !prev[email]
    }));
  };

  const getPortalConfig = (portal: LoginPortal) => {
    switch (portal) {
      case LoginPortal.ERP_SYSTEM:
        return {
          title: 'ERP System',
          icon: Building2,
          color: 'bg-blue-100 text-blue-800',
          bgColor: 'bg-blue-50'
        };
      case LoginPortal.EMPLOYEE_PORTAL:
        return {
          title: 'Employee Portal',
          icon: Users,
          color: 'bg-green-100 text-green-800',
          bgColor: 'bg-green-50'
        };
      case LoginPortal.CUSTOMER_PORTAL:
        return {
          title: 'Customer Portal',
          icon: ShoppingCart,
          color: 'bg-purple-100 text-purple-800',
          bgColor: 'bg-purple-50'
        };
      default:
        return {
          title: 'System',
          icon: Shield,
          color: 'bg-gray-100 text-gray-800',
          bgColor: 'bg-gray-50'
        };
    }
  };

  const getUserTypeConfig = (userType: UserType) => {
    switch (userType) {
      case UserType.ERP_USER:
        return { icon: Building2, color: 'bg-blue-100 text-blue-800', name: 'ERP User' };
      case UserType.EMPLOYEE:
        return { icon: Briefcase, color: 'bg-green-100 text-green-800', name: 'Employee' };
      case UserType.CUSTOMER:
        return { icon: ShoppingCart, color: 'bg-purple-100 text-purple-800', name: 'Customer' };
      default:
        return { icon: UserCheck, color: 'bg-gray-100 text-gray-800', name: 'User' };
    }
  };

  useEffect(() => {
    loadCredentials();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Test User Credentials</h1>
          <p className="text-gray-600 mt-2">
            Create and manage test users for all portals
          </p>
        </div>
        <Button 
          onClick={createTestUsers} 
          disabled={isLoading}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Creating...' : 'Create Test Users'}</span>
        </Button>
      </div>

      {credentials.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Database className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Test Users Found</h3>
            <p className="text-gray-600 text-center mb-6">
              Create test users to access all portals and test the authentication system.
            </p>
            <Button onClick={createTestUsers} disabled={isLoading}>
              Create Test Users
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {credentials.map((user) => {
            const portalConfig = getPortalConfig(user.loginPortal);
            const userTypeConfig = getUserTypeConfig(user.userType);
            const PortalIcon = portalConfig.icon;
            const UserTypeIcon = userTypeConfig.icon;
            const showPassword = showPasswords[user.email];
            
            return (
              <Card key={user.email} className={`${portalConfig.bgColor} border-l-4 border-l-blue-500`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <UserTypeIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{user.name}</CardTitle>
                        <CardDescription>{portalConfig.title}</CardDescription>
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
                        <code className="text-xs bg-white px-2 py-1 rounded">
                          {user.email}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(user.email, 'Email')}
                          className="h-6 w-6 p-0"
                        >
                          {copiedItem === user.email ? (
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
                        <code className="text-xs bg-white px-2 py-1 rounded">
                          {showPassword ? user.password : '••••••••'}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => togglePasswordVisibility(user.email)}
                          className="h-6 w-6 p-0"
                        >
                          {showPassword ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(user.password, 'Password')}
                          className="h-6 w-6 p-0"
                        >
                          {copiedItem === user.password ? (
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
                        <span className="text-sm font-medium">Role:</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {user.role.replace('_', ' ')}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <UserCheck className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">Type:</span>
                      </div>
                      <Badge className={userTypeConfig.color}>
                        {userTypeConfig.name}
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <Button asChild className="w-full" size="sm">
                      <a href="/login">
                        Login to {portalConfig.title}
                      </a>
                    </Button>
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
            <Shield className="h-5 w-5" />
            <span>Portal Access Information</span>
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
              <p className="text-sm text-blue-700 mb-2">
                Full access to all ERP modules and functionality
              </p>
              <Badge className="bg-blue-100 text-blue-800">
                ERP Users Only
              </Badge>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Employee Portal
              </h4>
              <p className="text-sm text-green-700 mb-2">
                Self-service portal for employees
              </p>
              <Badge className="bg-green-100 text-green-800">
                Employees + ERP Users
              </Badge>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2 flex items-center">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Customer Portal
              </h4>
              <p className="text-sm text-purple-700 mb-2">
                Self-service portal for customers
              </p>
              <Badge className="bg-purple-100 text-purple-800">
                Customers + ERP Users
              </Badge>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">Quick Start Guide</h4>
            <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
              <li>Click "Create Test Users" to generate test accounts</li>
              <li>Use the provided credentials to log in to different portals</li>
              <li>Test the split login system by selecting different portals</li>
              <li>Verify role-based access control across all modules</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
