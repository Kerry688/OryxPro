'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Key, 
  Copy, 
  CheckCircle,
  AlertCircle,
  Building2,
  Users,
  UserCheck,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface DemoUser {
  email: string;
  name: string;
  portal: string;
  portalIcon: React.ComponentType<any>;
  portalColor: string;
}

const demoUsers: DemoUser[] = [
  {
    email: 'admin@oryxpro.com',
    name: 'Admin User',
    portal: 'ERP System',
    portalIcon: Building2,
    portalColor: 'bg-blue-100 text-blue-800'
  },
  {
    email: 'john.employee@oryxpro.com',
    name: 'John Employee',
    portal: 'Employee Portal',
    portalIcon: Users,
    portalColor: 'bg-green-100 text-green-800'
  },
  {
    email: 'ahmed.customer@techsolutions.com',
    name: 'Ahmed Customer',
    portal: 'Customer Portal',
    portalIcon: UserCheck,
    portalColor: 'bg-purple-100 text-purple-800'
  }
];

export default function TestForgotPasswordPage() {
  const [selectedUser, setSelectedUser] = useState<DemoUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resetLinks, setResetLinks] = useState<{[key: string]: string}>({});
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<string>('');
  const [isTestingResend, setIsTestingResend] = useState(false);

  const testForgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Password reset email sent!');
        if (data.resetUrl) {
          setResetLinks(prev => ({ ...prev, [email]: data.resetUrl }));
        }
      } else {
        toast.error(data.message || 'Failed to send reset email');
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

  const createAllResetLinks = async () => {
    setIsLoading(true);
    const promises = demoUsers.map(user => testForgotPassword(user.email));
    await Promise.all(promises);
    setIsLoading(false);
  };

  const testResendConnection = async () => {
    setIsTestingResend(true);
    setResendStatus('Testing email connection...');
    
    try {
      const response = await fetch('/api/auth/test-resend');
      const data = await response.json();
      
      if (data.success) {
        setResendStatus('✅ Email connection successful!');
        toast.success('Email service is working correctly');
      } else {
        setResendStatus('❌ Email connection failed');
        toast.error('Email connection failed');
      }
    } catch (error) {
      setResendStatus('❌ Email test failed');
      toast.error('Failed to test email connection');
    } finally {
      setIsTestingResend(false);
    }
  };

  const sendTestEmail = async (email: string) => {
    setIsTestingResend(true);
    setResendStatus(`Sending test email to ${email}...`);
    
    try {
      const response = await fetch('/api/auth/test-resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResendStatus(`✅ Test email sent to ${email}!`);
        toast.success('Test email sent successfully');
      } else {
        setResendStatus(`❌ Failed to send test email to ${email}`);
        toast.error('Failed to send test email');
      }
    } catch (error) {
      setResendStatus(`❌ Test email failed for ${email}`);
      toast.error('Failed to send test email');
    } finally {
      setIsTestingResend(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Forgot Password Testing</h1>
          <p className="text-gray-600 mt-2">
            Test the forgot password functionality with Resend SMTP integration
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={testResendConnection}
            disabled={isTestingResend}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isTestingResend ? 'animate-spin' : ''}`} />
            <span>Test Email</span>
          </Button>
          <Button 
            onClick={createAllResetLinks} 
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Sending...' : 'Test All Users'}</span>
          </Button>
        </div>
      </div>

      {/* Resend Status */}
      {resendStatus && (
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Email Status</h3>
                <p className="text-sm text-gray-600">{resendStatus}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {demoUsers.map((user) => {
          const PortalIcon = user.portalIcon;
          const resetLink = resetLinks[user.email];
          
          return (
            <Card key={user.email} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <PortalIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <CardDescription>{user.portal}</CardDescription>
                    </div>
                  </div>
                  <Badge className={user.portalColor}>
                    {user.portal}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
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

                <div className="space-y-2">
                  <Button
                    onClick={() => testForgotPassword(user.email)}
                    disabled={isLoading}
                    className="w-full"
                    variant="outline"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Key className="h-4 w-4" />
                        <span>Send Reset Email</span>
                      </div>
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => sendTestEmail(user.email)}
                    disabled={isTestingResend}
                    className="w-full"
                    variant="secondary"
                  >
                    {isTestingResend ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        <span>Testing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>Test Email</span>
                      </div>
                    )}
                  </Button>
                </div>

                {resetLink && (
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800 mb-2">
                          Reset link generated!
                        </p>
                        <div className="flex items-center space-x-2">
                          <code className="text-xs bg-white px-2 py-1 rounded border flex-1 break-all">
                            {resetLink}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(resetLink, 'Reset Link')}
                            className="h-6 w-6 p-0 flex-shrink-0"
                          >
                            {copiedEmail === resetLink ? (
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-green-600 mt-1">
                          Click to test password reset flow
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>Testing Instructions</span>
          </CardTitle>
          <CardDescription>
            How to test the forgot password functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Step 1: Send Reset Email</h4>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Click "Send Reset Email" for any demo user</li>
                <li>Check the browser console for the reset link</li>
                <li>Copy the reset link from the console output</li>
                <li>Or use the "Test All Users" button for all reset links</li>
              </ol>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Step 2: Test Reset Flow</h4>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Open the reset link in a new tab</li>
                <li>Verify the correct portal is displayed</li>
                <li>Enter a new password (minimum 8 characters)</li>
                <li>Confirm the password matches</li>
                <li>Submit to complete the reset</li>
              </ol>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Resend SMTP Integration</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Real emails sent via Resend SMTP</li>
              <li>• Professional HTML email templates</li>
              <li>• Portal-specific branding and styling</li>
              <li>• Automatic fallback for failed sends</li>
              <li>• Email delivery tracking and logging</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Development Notes</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Reset links expire after 1 hour</li>
              <li>• Each token can only be used once</li>
              <li>• Email delivery status logged to console</li>
              <li>• Password strength indicator shows real-time feedback</li>
              <li>• Portal-specific styling and messaging</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
