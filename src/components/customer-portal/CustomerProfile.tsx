'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  MapPin, 
  Bell, 
  Shield, 
  Save,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff
} from 'lucide-react';

// Mock data
const mockProfile = {
  customerId: 'CUST-001',
  companyName: 'Tech Solutions Ltd.',
  contactPerson: 'John Smith',
  email: 'john.smith@techsolutions.com',
  phone: '+20 123 456 7890',
  primaryAddress: {
    type: 'both',
    isDefault: true,
    label: 'Head Office',
    companyName: 'Tech Solutions Ltd.',
    contactPerson: 'John Smith',
    addressLine1: '123 Business District',
    addressLine2: 'Floor 5, Office 501',
    city: 'Cairo',
    state: 'Cairo',
    postalCode: '11511',
    country: 'Egypt',
    phone: '+20 123 456 7890',
    email: 'john.smith@techsolutions.com'
  },
  shippingAddresses: [
    {
      id: '1',
      type: 'shipping',
      isDefault: false,
      label: 'Warehouse',
      companyName: 'Tech Solutions Ltd.',
      contactPerson: 'Ahmed Hassan',
      addressLine1: '456 Industrial Zone',
      addressLine2: 'Building B, Unit 12',
      city: 'Alexandria',
      state: 'Alexandria',
      postalCode: '21500',
      country: 'Egypt',
      phone: '+20 456 789 0123',
      email: 'warehouse@techsolutions.com'
    }
  ],
  billingAddresses: [],
  taxNumber: '123-456-789',
  vatNumber: 'EG123456789',
  businessRegistration: 'BR-2020-001',
  industry: 'Technology',
  currency: 'EGP',
  paymentTerms: 'Net 30',
  creditLimit: 50000,
  currentBalance: 15750,
  outstandingBalance: 15750,
  preferences: {
    language: 'en',
    timezone: 'Africa/Cairo',
    dateFormat: 'DD/MM/YYYY',
    currency: 'EGP',
    theme: 'light',
    dashboardLayout: 'detailed',
    emailNotifications: true,
    smsNotifications: false,
    orderConfirmations: true,
    shipmentUpdates: true,
    invoiceNotifications: true,
    marketingEmails: false
  },
  notifications: {
    newOrders: true,
    orderUpdates: true,
    shipmentUpdates: true,
    invoices: true,
    payments: true,
    quotes: true,
    supportTickets: true,
    marketing: false,
    frequency: 'immediate'
  },
  accountStatus: 'active',
  lastLogin: '2024-04-15T10:30:00Z'
};

export function CustomerProfile() {
  const [profile, setProfile] = useState(mockProfile);
  const [showPassword, setShowPassword] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);

  const handleSaveProfile = () => {
    // Save profile logic
    console.log('Saving profile:', profile);
  };

  const handleAddAddress = (type: 'shipping' | 'billing') => {
    const newAddress = {
      id: Date.now().toString(),
      type: type,
      isDefault: false,
      label: '',
      companyName: profile.companyName,
      contactPerson: profile.contactPerson,
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Egypt',
      phone: profile.phone,
      email: profile.email
    };

    if (type === 'shipping') {
      setProfile(prev => ({
        ...prev,
        shippingAddresses: [...prev.shippingAddresses, newAddress]
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        billingAddresses: [...prev.billingAddresses, newAddress]
      }));
    }
    setEditingAddress(newAddress.id);
  };

  const handleDeleteAddress = (id: string, type: 'shipping' | 'billing') => {
    if (type === 'shipping') {
      setProfile(prev => ({
        ...prev,
        shippingAddresses: prev.shippingAddresses.filter(addr => addr.id !== id)
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        billingAddresses: prev.billingAddresses.filter(addr => addr.id !== id)
      }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Account Profile</h2>
          <p className="text-muted-foreground">Manage your account information and preferences</p>
        </div>
        <Button onClick={handleSaveProfile}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={profile.companyName}
                    onChange={(e) => setProfile(prev => ({ ...prev, companyName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    value={profile.contactPerson}
                    onChange={(e) => setProfile(prev => ({ ...prev, contactPerson: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="taxNumber">Tax Number</Label>
                  <Input
                    id="taxNumber"
                    value={profile.taxNumber}
                    onChange={(e) => setProfile(prev => ({ ...prev, taxNumber: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="vatNumber">VAT Number</Label>
                  <Input
                    id="vatNumber"
                    value={profile.vatNumber}
                    onChange={(e) => setProfile(prev => ({ ...prev, vatNumber: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="businessRegistration">Business Registration</Label>
                  <Input
                    id="businessRegistration"
                    value={profile.businessRegistration}
                    onChange={(e) => setProfile(prev => ({ ...prev, businessRegistration: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={profile.industry} onValueChange={(value) => setProfile(prev => ({ ...prev, industry: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">EGP {profile.creditLimit.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Credit Limit</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">EGP {profile.currentBalance.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Current Balance</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">EGP {(profile.creditLimit - profile.currentBalance).toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Available Credit</div>
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                Last login: {formatDate(profile.lastLogin)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addresses" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Addresses
                </CardTitle>
                <Button size="sm" onClick={() => handleAddAddress('shipping')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Address
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.shippingAddresses.map((address) => (
                    <div key={address.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{address.label || 'Unnamed Address'}</div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteAddress(address.id, 'shipping')}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div>{address.companyName}</div>
                        <div>{address.addressLine1}</div>
                        {address.addressLine2 && <div>{address.addressLine2}</div>}
                        <div>{address.city}, {address.state} {address.postalCode}</div>
                        <div>{address.country}</div>
                        <div>{address.phone}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Billing Addresses
                </CardTitle>
                <Button size="sm" onClick={() => handleAddAddress('billing')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Address
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.billingAddresses.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No billing addresses added yet
                    </div>
                  ) : (
                    profile.billingAddresses.map((address) => (
                      <div key={address.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{address.label || 'Unnamed Address'}</div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDeleteAddress(address.id, 'billing')}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div>{address.companyName}</div>
                          <div>{address.addressLine1}</div>
                          {address.addressLine2 && <div>{address.addressLine2}</div>}
                          <div>{address.city}, {address.state} {address.postalCode}</div>
                          <div>{address.country}</div>
                          <div>{address.phone}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-muted-foreground">Receive notifications via email</div>
                  </div>
                  <Switch
                    checked={profile.preferences.emailNotifications}
                    onCheckedChange={(checked) => setProfile(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, emailNotifications: checked }
                    }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">SMS Notifications</div>
                    <div className="text-sm text-muted-foreground">Receive notifications via SMS</div>
                  </div>
                  <Switch
                    checked={profile.preferences.smsNotifications}
                    onCheckedChange={(checked) => setProfile(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, smsNotifications: checked }
                    }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Order Confirmations</div>
                    <div className="text-sm text-muted-foreground">Get notified when orders are confirmed</div>
                  </div>
                  <Switch
                    checked={profile.preferences.orderConfirmations}
                    onCheckedChange={(checked) => setProfile(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, orderConfirmations: checked }
                    }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Shipment Updates</div>
                    <div className="text-sm text-muted-foreground">Get notified about shipment status changes</div>
                  </div>
                  <Switch
                    checked={profile.preferences.shipmentUpdates}
                    onCheckedChange={(checked) => setProfile(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, shipmentUpdates: checked }
                    }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Invoice Notifications</div>
                    <div className="text-sm text-muted-foreground">Get notified when new invoices are available</div>
                  </div>
                  <Switch
                    checked={profile.preferences.invoiceNotifications}
                    onCheckedChange={(checked) => setProfile(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, invoiceNotifications: checked }
                    }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Marketing Emails</div>
                    <div className="text-sm text-muted-foreground">Receive promotional offers and updates</div>
                  </div>
                  <Switch
                    checked={profile.preferences.marketingEmails}
                    onCheckedChange={(checked) => setProfile(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, marketingEmails: checked }
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                />
              </div>
              <Button>Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
