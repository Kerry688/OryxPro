'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Building2, 
  Users, 
  UserCheck, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  ArrowRight,
  Shield,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { LoginPortal, UserType } from '@/lib/models/user';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [activePortal, setActivePortal] = useState<LoginPortal>(LoginPortal.ERP_SYSTEM);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password, activePortal, rememberMe);
      if (!success) {
        setError('Login failed. Please check your credentials.');
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
          description: 'Access the full enterprise resource planning system',
          icon: Building2,
          color: 'bg-blue-600',
          features: ['Complete ERP Access', 'All Modules', 'Admin Controls', 'System Management']
        };
      case LoginPortal.EMPLOYEE_PORTAL:
        return {
          title: 'Employee Portal',
          description: 'Self-service portal for employees',
          icon: Users,
          color: 'bg-green-600',
          features: ['Personal Dashboard', 'Payslips & Documents', 'Leave Management', 'Announcements']
        };
      case LoginPortal.CUSTOMER_PORTAL:
        return {
          title: 'Customer Portal',
          description: 'Self-service portal for customers',
          icon: UserCheck,
          color: 'bg-purple-600',
          features: ['Order Tracking', 'Invoice Management', 'Payment Processing', 'Account Management']
        };
      default:
        return {
          title: 'Login',
          description: 'Access your account',
          icon: Shield,
          color: 'bg-gray-600',
          features: []
        };
    }
  };

  const portalConfig = getPortalConfig(activePortal);
  const PortalIcon = portalConfig.icon;

  const demoAccounts = [
    { role: 'ERP Admin', email: 'admin@oryxpro.com', password: 'admin123', portal: LoginPortal.ERP_SYSTEM, color: 'bg-red-50 text-red-700 border-red-200' },
    { role: 'Employee', email: 'john.employee@oryxpro.com', password: 'employee123', portal: LoginPortal.EMPLOYEE_PORTAL, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { role: 'Customer', email: 'ahmed.customer@techsolutions.com', password: 'customer123', portal: LoginPortal.CUSTOMER_PORTAL, color: 'bg-green-50 text-green-700 border-green-200' },
  ];

  const fillDemoAccount = (accountEmail: string, accountPassword: string, accountPortal: LoginPortal) => {
    setEmail(accountEmail);
    setPassword(accountPassword);
    setActivePortal(accountPortal);
    setError('');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:flex-1 relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Oryx Pro®</h1>
                <p className="text-blue-100 text-sm">Enterprise Solutions</p>
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Welcome to Your
              <br />
              <span className="text-yellow-300">Business Hub</span>
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Streamline your operations with our comprehensive ERP solution. 
              Manage inventory, orders, customers, and more from one powerful platform.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-yellow-300 rounded-full"></div>
              <span className="text-blue-100">Multi-portal access system</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-yellow-300 rounded-full"></div>
              <span className="text-blue-100">Advanced order management</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-yellow-300 rounded-full"></div>
              <span className="text-blue-100">Comprehensive analytics</span>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 left-20 w-24 h-24 bg-yellow-300/20 rounded-full blur-lg"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white/5 rounded-full blur-md"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-gray-900">OryxPro</h1>
                <p className="text-gray-600 text-sm">Smart Solutions</p>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-600">Sign in to your account to continue</p>
          </div>

          {/* Portal Selection */}
          <div className="mb-6">
            <Label className="text-sm font-semibold text-gray-700 mb-3 block">Select Portal</Label>
            <div className="space-y-2">
              {Object.values(LoginPortal).map((portal) => {
                const config = getPortalConfig(portal);
                const Icon = config.icon;
                const isActive = activePortal === portal;
                
                return (
                  <button
                    key={portal}
                    onClick={() => setActivePortal(portal)}
                    className={cn(
                      "w-full p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3",
                      isActive 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                    )}
                  >
                    <div className={`w-8 h-8 rounded-lg ${config.color} flex items-center justify-center`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-sm text-gray-900">{config.title}</div>
                      <div className="text-xs text-gray-600">{config.description}</div>
                    </div>
                    {isActive && (
                      <ArrowRight className="h-4 w-4 text-blue-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="animate-in fade-in-0 slide-in-from-top-2 duration-300">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 pr-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      required
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      disabled={isLoading}
                      className="rounded"
                    />
                    <Label htmlFor="rememberMe" className="text-sm text-gray-600">
                      Remember me
                    </Label>
                  </div>
                  <Link
                    href="/forgot-password"
                    className="text-sm px-0 text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-5 w-5" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>

              {/* Demo Accounts Section */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">Demo Accounts</span>
                  </div>
                </div>

                <div className="mt-6 space-y-2 max-w-xs mx-auto">
                  {demoAccounts.map((account, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md",
                        account.color
                      )}
                      onClick={() => fillDemoAccount(account.email, account.password, account.portal)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-xs">{account.role}</div>
                          <div className="text-xs opacity-80">{account.email}</div>
                        </div>
                        <Sparkles className="h-3 w-3" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-700 font-semibold">
                Contact administrator
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
