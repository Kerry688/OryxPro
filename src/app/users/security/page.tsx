'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Key, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle,
  Lock,
  Unlock,
  Clock,
  User,
  Mail,
  Phone,
  Settings,
  Save,
  RefreshCw
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { users, userActivities } from '@/lib/data';
import type { User } from '@/lib/data';

export default function SecurityManagementPage() {
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
    forceChange: false,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30, // minutes
    maxLoginAttempts: 5,
    lockoutDuration: 15, // minutes
    passwordExpiry: 90, // days
    requireStrongPassword: true,
  });

  const [userStatus, setUserStatus] = useState({
    isActive: true,
    isLocked: false,
    isSuspended: false,
  });

  const selectedUserData = users.find(u => u.id === selectedUser);

  const handlePasswordReset = async () => {
    if (!selectedUser) {
      setMessage({ type: 'error', text: 'Please select a user first.' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long.' });
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: 'success', text: 'Password reset successfully!' });
      setPasswordData({ newPassword: '', confirmPassword: '', forceChange: false });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to reset password. Please try again.' });
    }
  };

  const handleSecuritySettingsSave = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: 'success', text: 'Security settings updated successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update security settings. Please try again.' });
    }
  };

  const handleUserStatusUpdate = async () => {
    if (!selectedUser) {
      setMessage({ type: 'error', text: 'Please select a user first.' });
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: 'success', text: 'User status updated successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update user status. Please try again.' });
    }
  };

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score < 2) return { level: 'Weak', color: 'text-red-600' };
    if (score < 4) return { level: 'Medium', color: 'text-yellow-600' };
    return { level: 'Strong', color: 'text-green-600' };
  };

  const passwordStrength = getPasswordStrength(passwordData.newPassword);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Security Management</h1>
          <p className="text-muted-foreground">Manage user security settings and password policies</p>
        </div>
      </div>

      {message && (
        <Alert className={`mb-6 ${message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
          {message.type === 'error' ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Selection */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Select User</CardTitle>
              <CardDescription>
                Choose a user to manage security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users.map(user => (
                  <div
                    key={user.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedUser === user.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedUser(user.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Security Status */}
          {selectedUserData && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Security Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">Email Verified</span>
                  </div>
                  <Badge variant={selectedUserData.isEmailVerified ? 'default' : 'secondary'}>
                    {selectedUserData.isEmailVerified ? 'Yes' : 'No'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">Phone Verified</span>
                  </div>
                  <Badge variant={selectedUserData.isPhoneVerified ? 'default' : 'secondary'}>
                    {selectedUserData.isPhoneVerified ? 'Yes' : 'No'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm">2FA Enabled</span>
                  </div>
                  <Badge variant={selectedUserData.twoFactorEnabled ? 'default' : 'secondary'}>
                    {selectedUserData.twoFactorEnabled ? 'Yes' : 'No'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Last Login</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {selectedUserData.lastLoginAt ? new Date(selectedUserData.lastLoginAt).toLocaleDateString() : 'Never'}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="password" className="space-y-6">
            <TabsList>
              <TabsTrigger value="password">Password Management</TabsTrigger>
              <TabsTrigger value="settings">Security Settings</TabsTrigger>
              <TabsTrigger value="status">User Status</TabsTrigger>
            </TabsList>

            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Password Management</CardTitle>
                  <CardDescription>
                    Reset passwords and manage password policies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedUserData ? (
                    <form onSubmit={(e) => { e.preventDefault(); handlePasswordReset(); }} className="space-y-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h3 className="font-medium mb-2">Reset Password for: {selectedUserData.firstName} {selectedUserData.lastName}</h3>
                        <p className="text-sm text-muted-foreground">{selectedUserData.email}</p>
                      </div>

                      <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            placeholder="Enter new password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        {passwordData.newPassword && (
                          <p className={`text-sm mt-1 ${passwordStrength.color}`}>
                            Password strength: {passwordStrength.level}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            placeholder="Confirm new password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="forceChange"
                          checked={passwordData.forceChange}
                          onCheckedChange={(checked) => setPasswordData({ ...passwordData, forceChange: checked })}
                        />
                        <Label htmlFor="forceChange">Force password change on next login</Label>
                      </div>

                      <Button type="submit" className="w-full">
                        <Key className="mr-2 h-4 w-4" />
                        Reset Password
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center py-8">
                      <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Select a user to manage their password</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Configure global security policies and settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => { e.preventDefault(); handleSecuritySettingsSave(); }} className="space-y-6">
                    {/* Two-Factor Authentication */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Require 2FA</p>
                          <p className="text-sm text-muted-foreground">
                            Force all users to enable two-factor authentication
                          </p>
                        </div>
                        <Switch
                          checked={securitySettings.twoFactorEnabled}
                          onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorEnabled: checked })}
                        />
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4">Session Management</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                          <Input
                            id="sessionTimeout"
                            type="number"
                            value={securitySettings.sessionTimeout}
                            onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                          <Input
                            id="maxLoginAttempts"
                            type="number"
                            value={securitySettings.maxLoginAttempts}
                            onChange={(e) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: parseInt(e.target.value) })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4">Password Policy</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Require Strong Passwords</p>
                            <p className="text-sm text-muted-foreground">
                              Enforce complex password requirements
                            </p>
                          </div>
                          <Switch
                            checked={securitySettings.requireStrongPassword}
                            onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, requireStrongPassword: checked })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                          <Input
                            id="passwordExpiry"
                            type="number"
                            value={securitySettings.passwordExpiry}
                            onChange={(e) => setSecuritySettings({ ...securitySettings, passwordExpiry: parseInt(e.target.value) })}
                          />
                        </div>
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      <Save className="mr-2 h-4 w-4" />
                      Save Security Settings
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="status">
              <Card>
                <CardHeader>
                  <CardTitle>User Status Management</CardTitle>
                  <CardDescription>
                    Manage user account status and access
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedUserData ? (
                    <form onSubmit={(e) => { e.preventDefault(); handleUserStatusUpdate(); }} className="space-y-6">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h3 className="font-medium mb-2">Managing: {selectedUserData.firstName} {selectedUserData.lastName}</h3>
                        <p className="text-sm text-muted-foreground">{selectedUserData.email}</p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Account Active</p>
                            <p className="text-sm text-muted-foreground">
                              Allow user to log in and access the system
                            </p>
                          </div>
                          <Switch
                            checked={userStatus.isActive}
                            onCheckedChange={(checked) => setUserStatus({ ...userStatus, isActive: checked })}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Account Locked</p>
                            <p className="text-sm text-muted-foreground">
                              Temporarily prevent login due to security concerns
                            </p>
                          </div>
                          <Switch
                            checked={userStatus.isLocked}
                            onCheckedChange={(checked) => setUserStatus({ ...userStatus, isLocked: checked })}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Account Suspended</p>
                            <p className="text-sm text-muted-foreground">
                              Permanently disable account access
                            </p>
                          </div>
                          <Switch
                            checked={userStatus.isSuspended}
                            onCheckedChange={(checked) => setUserStatus({ ...userStatus, isSuspended: checked })}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1">
                          <Save className="mr-2 h-4 w-4" />
                          Update Status
                        </Button>
                        <Button type="button" variant="outline">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Reset to Default
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="text-center py-8">
                      <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Select a user to manage their status</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
