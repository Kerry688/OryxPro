'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Building2,
  Users,
  ShoppingCart,
  UserCheck,
  CheckCircle,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Clock
} from 'lucide-react';
import { UserType, LoginPortal, UserRole } from '@/lib/models/user';
import { toast } from 'sonner';

interface InvitationData {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: UserType;
  role: UserRole;
  loginPortal: LoginPortal;
  customerId?: string;
  companyName?: string;
  employeeId?: string;
  department?: string;
  position?: string;
  phone?: string;
  expiresAt: string;
  status: string;
}

export default function InviteAcceptancePage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (token) {
      verifyInvitation();
    }
  }, [token]);

  const verifyInvitation = async () => {
    try {
      const response = await fetch(`/api/users/invite/verify?token=${token}`);
      const data = await response.json();
      
      if (data.success) {
        setInvitation(data.invitation);
        
        // Check if invitation is expired
        if (new Date(data.invitation.expiresAt) < new Date()) {
          setIsExpired(true);
        }
      } else {
        setError(data.message || 'Invalid invitation token');
      }
    } catch (error) {
      setError('Failed to verify invitation');
    }
  };

  const handleAcceptInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/users/invite/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        toast.success('Account created successfully! You can now sign in.');
      } else {
        setError(data.message || 'Failed to accept invitation');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPortalConfig = (portal: LoginPortal) => {
    switch (portal) {
      case LoginPortal.ERP_SYSTEM:
        return {
          title: 'ERP System',
          icon: Building2,
          color: 'bg-blue-100 text-blue-800',
          description: 'Enterprise Resource Planning'
        };
      case LoginPortal.EMPLOYEE_PORTAL:
        return {
          title: 'Employee Portal',
          icon: Users,
          color: 'bg-green-100 text-green-800',
          description: 'Employee Self-Service'
        };
      case LoginPortal.CUSTOMER_PORTAL:
        return {
          title: 'Customer Portal',
          icon: ShoppingCart,
          color: 'bg-purple-100 text-purple-800',
          description: 'Customer Self-Service'
        };
      default:
        return {
          title: 'System',
          icon: UserCheck,
          color: 'bg-gray-100 text-gray-800',
          description: 'User Portal'
        };
    }
  };

  const getUserTypeConfig = (userType: UserType) => {
    switch (userType) {
      case UserType.ERP_USER:
        return { name: 'ERP User', color: 'bg-blue-100 text-blue-800' };
      case UserType.EMPLOYEE:
        return { name: 'Employee', color: 'bg-green-100 text-green-800' };
      case UserType.CUSTOMER:
        return { name: 'Customer', color: 'bg-purple-100 text-purple-800' };
      default:
        return { name: 'User', color: 'bg-gray-100 text-gray-800' };
    }
  };

  if (isSuccess && invitation) {
    const portalConfig = getPortalConfig(invitation.loginPortal);
    const PortalIcon = portalConfig.icon;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-900">Welcome to OryxPro!</CardTitle>
              <CardDescription>
                Your account has been successfully created
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  You can now sign in to the {portalConfig.title} with your email and password.
                </AlertDescription>
              </Alert>

              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg ${portalConfig.color} flex items-center justify-center`}>
                    <PortalIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{portalConfig.title}</h3>
                    <p className="text-sm text-gray-600">{portalConfig.description}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Account Details</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>Name:</strong> {invitation.firstName} {invitation.lastName}</p>
                  <p><strong>Email:</strong> {invitation.email}</p>
                  <p><strong>Role:</strong> {invitation.role.replace('_', ' ')}</p>
                  {invitation.companyName && (
                    <p><strong>Company:</strong> {invitation.companyName}</p>
                  )}
                  {invitation.department && (
                    <p><strong>Department:</strong> {invitation.department}</p>
                  )}
                  {invitation.position && (
                    <p><strong>Position:</strong> {invitation.position}</p>
                  )}
                </div>
              </div>

              <Button asChild className="w-full">
                <a href="/login">
                  Sign In to {portalConfig.title}
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isExpired || error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-red-900">
                {isExpired ? 'Invitation Expired' : 'Invalid Invitation'}
              </CardTitle>
              <CardDescription>
                {isExpired ? 'This invitation has expired' : 'This invitation link is invalid or has been used'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error || 'This invitation is no longer valid'}</AlertDescription>
              </Alert>

              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Please contact your administrator for a new invitation.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <a href="/login">
                    Go to Login Page
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Verifying invitation...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const portalConfig = getPortalConfig(invitation.loginPortal);
  const userTypeConfig = getUserTypeConfig(invitation.userType);
  const PortalIcon = portalConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PortalIcon className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Complete Your Registration</CardTitle>
            <CardDescription>
              Set up your password to access the {portalConfig.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-4 rounded-lg border mb-6">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg ${portalConfig.color} flex items-center justify-center`}>
                  <PortalIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{portalConfig.title}</h3>
                  <p className="text-sm text-gray-600">{portalConfig.description}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Account Information</h4>
              <div className="text-sm text-gray-700 space-y-1">
                <p><strong>Name:</strong> {invitation.firstName} {invitation.lastName}</p>
                <p><strong>Email:</strong> {invitation.email}</p>
                <p><strong>Role:</strong> {invitation.role.replace('_', ' ')}</p>
                <p><strong>Type:</strong> <span className={`px-2 py-1 rounded text-xs ${userTypeConfig.color}`}>{userTypeConfig.name}</span></p>
                {invitation.companyName && (
                  <p><strong>Company:</strong> {invitation.companyName}</p>
                )}
                {invitation.department && (
                  <p><strong>Department:</strong> {invitation.department}</p>
                )}
                {invitation.position && (
                  <p><strong>Position:</strong> {invitation.position}</p>
                )}
              </div>
            </div>

            <form onSubmit={handleAcceptInvitation} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Password Requirements:</strong>
                </p>
                <ul className="text-xs text-blue-700 mt-1 space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Mix of letters, numbers, and symbols</li>
                  <li>• Not easily guessable</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Clock className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Expires:</p>
                    <p>{new Date(invitation.expiresAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Accept Invitation</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
