'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Building2, 
  Key, 
  Globe, 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Save,
  RefreshCw,
  TestTube,
  Database,
  FileText,
  Bell,
  Lock,
  Unlock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ETASettings {
  // API Configuration
  apiEndpoint: string;
  apiKey: string;
  apiSecret: string;
  environment: 'sandbox' | 'production';
  
  // Authentication
  clientId: string;
  clientSecret: string;
  accessToken: string;
  tokenExpiry: string;
  
  // Sync Configuration
  autoSync: boolean;
  syncInterval: number; // in minutes
  batchSize: number;
  retryAttempts: number;
  retryDelay: number; // in seconds
  
  // Notification Settings
  emailNotifications: boolean;
  smsNotifications: boolean;
  notificationEmail: string;
  notificationPhone: string;
  
  // Security Settings
  encryptionEnabled: boolean;
  auditLogging: boolean;
  sessionTimeout: number; // in minutes
  
  // Business Information
  companyName: string;
  taxNumber: string;
  businessType: string;
  address: string;
  phone: string;
  email: string;
  
  // Advanced Settings
  debugMode: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  maxConcurrentRequests: number;
  requestTimeout: number; // in seconds
}

export default function ETASettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  
  const [settings, setSettings] = useState<ETASettings>({
    // API Configuration
    apiEndpoint: 'https://api.eta.gov.eg/api/v1',
    apiKey: '',
    apiSecret: '',
    environment: 'sandbox',
    
    // Authentication
    clientId: '',
    clientSecret: '',
    accessToken: '',
    tokenExpiry: '',
    
    // Sync Configuration
    autoSync: true,
    syncInterval: 30,
    batchSize: 100,
    retryAttempts: 3,
    retryDelay: 5,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    notificationEmail: '',
    notificationPhone: '',
    
    // Security Settings
    encryptionEnabled: true,
    auditLogging: true,
    sessionTimeout: 30,
    
    // Business Information
    companyName: '',
    taxNumber: '',
    businessType: 'individual',
    address: '',
    phone: '',
    email: '',
    
    // Advanced Settings
    debugMode: false,
    logLevel: 'info',
    maxConcurrentRequests: 10,
    requestTimeout: 30
  });

  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'testing'>('disconnected');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would fetch from your API
      // const response = await fetch('/api/eta/settings');
      // const data = await response.json();
      // setSettings(data);
      
      // For demo purposes, we'll use the default settings
      setLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch ETA settings",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // In a real implementation, this would save to your API
      // await fetch('/api/eta/settings', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // });
      
      toast({
        title: "Settings Saved",
        description: "ETA settings have been updated successfully",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save ETA settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      setTesting(true);
      setConnectionStatus('testing');
      
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would test the actual ETA API
      const success = Math.random() > 0.3; // Simulate 70% success rate
      
      if (success) {
        setConnectionStatus('connected');
        toast({
          title: "Connection Successful",
          description: "Successfully connected to ETA API",
        });
      } else {
        setConnectionStatus('disconnected');
        toast({
          title: "Connection Failed",
          description: "Failed to connect to ETA API. Please check your credentials.",
          variant: "destructive"
        });
      }
    } catch (error) {
      setConnectionStatus('disconnected');
      toast({
        title: "Connection Error",
        description: "An error occurred while testing the connection",
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };

  const getConnectionStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Connected</Badge>;
      case 'testing':
        return <Badge className="bg-yellow-500"><RefreshCw className="h-3 w-3 mr-1 animate-spin" />Testing</Badge>;
      default:
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Disconnected</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ETA Settings</h1>
          <p className="text-muted-foreground">
            Configure Egyptian Tax Authority integration settings
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {getConnectionStatusBadge()}
          <Button onClick={handleTestConnection} disabled={testing}>
            <TestTube className="h-4 w-4 mr-2" />
            {testing ? 'Testing...' : 'Test Connection'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="api" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="api">API Configuration</TabsTrigger>
          <TabsTrigger value="sync">Sync Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="business">Business Info</TabsTrigger>
        </TabsList>

        {/* API Configuration */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                API Configuration
              </CardTitle>
              <CardDescription>
                Configure your ETA API connection settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="apiEndpoint">API Endpoint</Label>
                  <Input
                    id="apiEndpoint"
                    value={settings.apiEndpoint}
                    onChange={(e) => setSettings({...settings, apiEndpoint: e.target.value})}
                    placeholder="https://api.eta.gov.eg/api/v1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="environment">Environment</Label>
                  <Select value={settings.environment} onValueChange={(value: 'sandbox' | 'production') => setSettings({...settings, environment: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sandbox">Sandbox</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={settings.apiKey}
                  onChange={(e) => setSettings({...settings, apiKey: e.target.value})}
                  placeholder="Enter your ETA API key"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apiSecret">API Secret</Label>
                <Input
                  id="apiSecret"
                  type="password"
                  value={settings.apiSecret}
                  onChange={(e) => setSettings({...settings, apiSecret: e.target.value})}
                  placeholder="Enter your ETA API secret"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="h-5 w-5 mr-2" />
                Authentication
              </CardTitle>
              <CardDescription>
                Configure OAuth and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientId">Client ID</Label>
                  <Input
                    id="clientId"
                    value={settings.clientId}
                    onChange={(e) => setSettings({...settings, clientId: e.target.value})}
                    placeholder="Enter your client ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientSecret">Client Secret</Label>
                  <Input
                    id="clientSecret"
                    type="password"
                    value={settings.clientSecret}
                    onChange={(e) => setSettings({...settings, clientSecret: e.target.value})}
                    placeholder="Enter your client secret"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accessToken">Access Token</Label>
                <Input
                  id="accessToken"
                  type="password"
                  value={settings.accessToken}
                  onChange={(e) => setSettings({...settings, accessToken: e.target.value})}
                  placeholder="Enter your access token"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sync Settings */}
        <TabsContent value="sync" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <RefreshCw className="h-5 w-5 mr-2" />
                Synchronization Settings
              </CardTitle>
              <CardDescription>
                Configure how data is synchronized with ETA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Sync</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically sync data with ETA
                  </p>
                </div>
                <Switch
                  checked={settings.autoSync}
                  onCheckedChange={(checked) => setSettings({...settings, autoSync: checked})}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="syncInterval">Sync Interval (minutes)</Label>
                  <Input
                    id="syncInterval"
                    type="number"
                    value={settings.syncInterval}
                    onChange={(e) => setSettings({...settings, syncInterval: parseInt(e.target.value) || 30})}
                    min="1"
                    max="1440"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batchSize">Batch Size</Label>
                  <Input
                    id="batchSize"
                    type="number"
                    value={settings.batchSize}
                    onChange={(e) => setSettings({...settings, batchSize: parseInt(e.target.value) || 100})}
                    min="1"
                    max="1000"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="retryAttempts">Retry Attempts</Label>
                  <Input
                    id="retryAttempts"
                    type="number"
                    value={settings.retryAttempts}
                    onChange={(e) => setSettings({...settings, retryAttempts: parseInt(e.target.value) || 3})}
                    min="0"
                    max="10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retryDelay">Retry Delay (seconds)</Label>
                  <Input
                    id="retryDelay"
                    type="number"
                    value={settings.retryDelay}
                    onChange={(e) => setSettings({...settings, retryDelay: parseInt(e.target.value) || 5})}
                    min="1"
                    max="300"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure how you receive notifications about ETA activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via SMS
                  </p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, smsNotifications: checked})}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="notificationEmail">Notification Email</Label>
                <Input
                  id="notificationEmail"
                  type="email"
                  value={settings.notificationEmail}
                  onChange={(e) => setSettings({...settings, notificationEmail: e.target.value})}
                  placeholder="Enter notification email address"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notificationPhone">Notification Phone</Label>
                <Input
                  id="notificationPhone"
                  type="tel"
                  value={settings.notificationPhone}
                  onChange={(e) => setSettings({...settings, notificationPhone: e.target.value})}
                  placeholder="Enter notification phone number"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Encryption Enabled</Label>
                  <p className="text-sm text-muted-foreground">
                    Encrypt sensitive data in transit and at rest
                  </p>
                </div>
                <Switch
                  checked={settings.encryptionEnabled}
                  onCheckedChange={(checked) => setSettings({...settings, encryptionEnabled: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Audit Logging</Label>
                  <p className="text-sm text-muted-foreground">
                    Log all ETA API activities for audit purposes
                  </p>
                </div>
                <Switch
                  checked={settings.auditLogging}
                  onCheckedChange={(checked) => setSettings({...settings, auditLogging: checked})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value) || 30})}
                  min="5"
                  max="480"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Information */}
        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Business Information
              </CardTitle>
              <CardDescription>
                Configure your business details for ETA compliance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={settings.companyName}
                    onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                    placeholder="Enter company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxNumber">Tax Number</Label>
                  <Input
                    id="taxNumber"
                    value={settings.taxNumber}
                    onChange={(e) => setSettings({...settings, taxNumber: e.target.value})}
                    placeholder="Enter tax registration number"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type</Label>
                <Select value={settings.businessType} onValueChange={(value) => setSettings({...settings, businessType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="ngo">NGO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={settings.address}
                  onChange={(e) => setSettings({...settings, address: e.target.value})}
                  placeholder="Enter business address"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => setSettings({...settings, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({...settings, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}

