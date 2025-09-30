'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  User, 
  Mail, 
  Shield, 
  Key, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface DemoUser {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  password: string;
}

export default function DemoUsersPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [demoUsers, setDemoUsers] = useState<DemoUser[]>([]);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  const handleCreateDemoUsers = async () => {
    try {
      setIsCreating(true);
      
      const response = await fetch('/api/auth/demo-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        setDemoUsers(result.data.users);
        toast.success('Demo users created successfully!');
      } else {
        toast.error(result.error || 'Failed to create demo users');
        if (result.existingUsers) {
          setDemoUsers(result.existingUsers.map((u: any) => ({
            ...u,
            role: 'Unknown',
            password: 'Already exists'
          })));
        }
      }
    } catch (error) {
      console.error('Error creating demo users:', error);
      toast.error('Failed to create demo users. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Super Admin':
        return 'bg-red-100 text-red-800';
      case 'Manager':
        return 'bg-blue-100 text-blue-800';
      case 'Employee':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            Demo Users for Testing
          </h1>
          <p className="text-muted-foreground">
            Create demo users to test the authentication system
          </p>
        </div>
        <Button 
          onClick={handleCreateDemoUsers}
          disabled={isCreating}
          className="flex items-center gap-2"
        >
          {isCreating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <User className="h-4 w-4" />
              Create Demo Users
            </>
          )}
        </Button>
      </div>

      {/* Instructions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Authentication Testing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              These demo users are created specifically for testing the authentication system. 
              Each user has different roles and permissions to test various access levels.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Full system access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Role-based permissions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Profile management</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Users */}
      {demoUsers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoUsers.map((user) => (
            <Card key={user._id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {user.firstName} {user.lastName}
                  </CardTitle>
                  <Badge className={cn("text-xs", getRoleColor(user.role))}>
                    {user.role}
                  </Badge>
                </div>
                <CardDescription>
                  @{user.username}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Email</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(user.email, 'Email')}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">{user.email}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Password</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePasswordVisibility(user._id)}
                        className="h-6 w-6 p-0"
                      >
                        {showPasswords[user._id] ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(user.password, 'Password')}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6 font-mono">
                    {showPasswords[user._id] ? user.password : '••••••••••••'}
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    className="w-full" 
                    onClick={() => window.location.href = '/signin'}
                  >
                    Sign In as {user.firstName}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Sign In Links */}
      {demoUsers.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Sign In</CardTitle>
            <CardDescription>
              Click any button below to automatically fill the sign-in form
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {demoUsers.map((user) => (
                <Button
                  key={user._id}
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => {
                    // Store credentials in localStorage for auto-fill
                    localStorage.setItem('demo_username', user.username);
                    localStorage.setItem('demo_password', user.password);
                    window.location.href = '/signin';
                  }}
                >
                  <User className="h-5 w-5" />
                  <div className="text-center">
                    <p className="font-medium">{user.firstName}</p>
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
