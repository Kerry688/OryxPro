'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2,
  Plus,
  X,
  Store,
  MapPin,
  Phone,
  Mail,
  Users,
  Settings,
  Clock,
  CreditCard,
  Gift
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Store as StoreType } from '@/lib/models/store';

interface StoreFormProps {
  store: StoreType | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function StoreForm({ store, onClose, onSuccess }: StoreFormProps) {
  const [formData, setFormData] = useState({
    name: store?.name || '',
    code: store?.code || '',
    type: store?.type || 'retail',
    branchId: store?.branchId?.toString() || '',
    address: {
      street: store?.address?.street || '',
      city: store?.address?.city || '',
      state: store?.address?.state || '',
      zipCode: store?.address?.zipCode || '',
      country: store?.address?.country || 'USA',
    },
    contact: {
      phone: store?.contact?.phone || '',
      email: store?.contact?.email || '',
      website: store?.contact?.website || '',
    },
    manager: store?.manager?.toString() || '',
    staff: store?.staff?.map(id => id.toString()) || [],
    operatingHours: {
      monday: store?.operatingHours?.monday || { open: '09:00', close: '17:00', isOpen: true },
      tuesday: store?.operatingHours?.tuesday || { open: '09:00', close: '17:00', isOpen: true },
      wednesday: store?.operatingHours?.wednesday || { open: '09:00', close: '17:00', isOpen: true },
      thursday: store?.operatingHours?.thursday || { open: '09:00', close: '17:00', isOpen: true },
      friday: store?.operatingHours?.friday || { open: '09:00', close: '17:00', isOpen: true },
      saturday: store?.operatingHours?.saturday || { open: '10:00', close: '16:00', isOpen: true },
      sunday: store?.operatingHours?.sunday || { open: '10:00', close: '16:00', isOpen: false },
    },
    features: store?.features || ['pos_system', 'inventory_tracking'],
    services: store?.services || ['printing'],
    paymentMethods: store?.paymentMethods || ['cash', 'card'],
    settings: {
      allowReturns: store?.settings?.allowReturns ?? true,
      returnPeriod: store?.settings?.returnPeriod || 30,
      allowExchanges: store?.settings?.allowExchanges ?? true,
      exchangePeriod: store?.settings?.exchangePeriod || 30,
      requireReceipt: store?.settings?.requireReceipt ?? true,
      maxDiscountPercentage: store?.settings?.maxDiscountPercentage || 20,
      loyaltyProgramEnabled: store?.settings?.loyaltyProgramEnabled ?? false,
      inventorySync: store?.settings?.inventorySync ?? true,
      autoReorder: store?.settings?.autoReorder ?? false,
      lowStockThreshold: store?.settings?.lowStockThreshold || 10,
    },
    isActive: store?.isActive ?? true,
  });

  const [branches, setBranches] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  const [newService, setNewService] = useState('');
  const [newPaymentMethod, setNewPaymentMethod] = useState('');
  const { toast } = useToast();

  // Fetch branches and users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [branchesRes, usersRes] = await Promise.all([
          fetch('/api/branches'),
          fetch('/api/users')
        ]);
        
        if (branchesRes.ok) {
          const branchesData = await branchesRes.json();
          setBranches(branchesData);
        }
        
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = store ? `/api/stores/${store._id}` : '/api/stores';
      const method = store ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          createdBy: '507f1f77bcf86cd799439011', // TODO: Get from auth context
          updatedBy: '507f1f77bcf86cd799439011', // TODO: Get from auth context
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: store ? 'Store updated successfully' : 'Store created successfully',
        });
        onSuccess();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save store');
      }
    } catch (error) {
      console.error('Error saving store:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save store',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addFeature = () => {
    if (newFeature && !formData.features.includes(newFeature)) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setFormData({
      ...formData,
      features: formData.features.filter(f => f !== feature)
    });
  };

  const addService = () => {
    if (newService && !formData.services.includes(newService)) {
      setFormData({
        ...formData,
        services: [...formData.services, newService]
      });
      setNewService('');
    }
  };

  const removeService = (service: string) => {
    setFormData({
      ...formData,
      services: formData.services.filter(s => s !== service)
    });
  };

  const addPaymentMethod = () => {
    if (newPaymentMethod && !formData.paymentMethods.includes(newPaymentMethod)) {
      setFormData({
        ...formData,
        paymentMethods: [...formData.paymentMethods, newPaymentMethod]
      });
      setNewPaymentMethod('');
    }
  };

  const removePaymentMethod = (method: string) => {
    setFormData({
      ...formData,
      paymentMethods: formData.paymentMethods.filter(pm => pm !== method)
    });
  };

  const updateOperatingHours = (day: string, field: string, value: any) => {
    setFormData({
      ...formData,
      operatingHours: {
        ...formData.operatingHours,
        [day]: {
          ...formData.operatingHours[day as keyof typeof formData.operatingHours],
          [field]: value
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="contact">Contact & Hours</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Store name, type, and location details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Store Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="code">Store Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., STORE001"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Store Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as any })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select store type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="wholesale">Wholesale</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="popup">Popup</SelectItem>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                      <SelectItem value="showroom">Showroom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="branchId">Branch</Label>
                  <Select value={formData.branchId} onValueChange={(value) => setFormData({ ...formData, branchId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map(branch => (
                        <SelectItem key={branch._id} value={branch._id.toString()}>
                          {branch.name} ({branch.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={formData.address.street}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        address: { ...formData.address, street: e.target.value } 
                      })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.address.city}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          address: { ...formData.address, city: e.target.value } 
                        })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.address.state}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          address: { ...formData.address, state: e.target.value } 
                        })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={formData.address.zipCode}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          address: { ...formData.address, zipCode: e.target.value } 
                        })}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
              <CardDescription>
                Store contact details and staff assignment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.contact.phone}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      contact: { ...formData.contact, phone: e.target.value } 
                    })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      contact: { ...formData.contact, email: e.target.value } 
                    })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.contact.website}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    contact: { ...formData.contact, website: e.target.value } 
                  })}
                  placeholder="https://example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="manager">Manager</Label>
                  <Select value={formData.manager} onValueChange={(value) => setFormData({ ...formData, manager: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map(user => (
                        <SelectItem key={user._id} value={user._id.toString()}>
                          {user.firstName} {user.lastName} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Operating Hours
              </CardTitle>
              <CardDescription>
                Set store operating hours for each day
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(formData.operatingHours).map(([day, hours]) => (
                <div key={day} className="flex items-center gap-4">
                  <div className="w-20">
                    <Label className="capitalize">{day}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={hours.isOpen}
                      onCheckedChange={(checked) => updateOperatingHours(day, 'isOpen', checked)}
                    />
                    <span className="text-sm text-muted-foreground">
                      {hours.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  {hours.isOpen && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={hours.open}
                        onChange={(e) => updateOperatingHours(day, 'open', e.target.value)}
                        className="w-32"
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={hours.close}
                        onChange={(e) => updateOperatingHours(day, 'close', e.target.value)}
                        className="w-32"
                      />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Store Features
              </CardTitle>
              <CardDescription>
                Available features and capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Features</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.features.map(feature => (
                    <Badge key={feature} variant="outline" className="flex items-center gap-1">
                      {feature.replace('_', ' ')}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeFeature(feature)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add new feature"
                  />
                  <Button type="button" onClick={addFeature} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label>Services</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.services.map(service => (
                    <Badge key={service} variant="secondary" className="flex items-center gap-1">
                      {service}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeService(service)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    placeholder="Add new service"
                  />
                  <Button type="button" onClick={addService} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payment Methods
                </Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.paymentMethods.map(method => (
                    <Badge key={method} variant="outline" className="flex items-center gap-1">
                      {method}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removePaymentMethod(method)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newPaymentMethod}
                    onChange={(e) => setNewPaymentMethod(e.target.value)}
                    placeholder="Add payment method"
                  />
                  <Button type="button" onClick={addPaymentMethod} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Store Settings
              </CardTitle>
              <CardDescription>
                Configure store policies and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Return & Exchange Policy</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="allowReturns"
                      checked={formData.settings.allowReturns}
                      onCheckedChange={(checked) => setFormData({
                        ...formData,
                        settings: { ...formData.settings, allowReturns: checked }
                      })}
                    />
                    <Label htmlFor="allowReturns">Allow Returns</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="allowExchanges"
                      checked={formData.settings.allowExchanges}
                      onCheckedChange={(checked) => setFormData({
                        ...formData,
                        settings: { ...formData.settings, allowExchanges: checked }
                      })}
                    />
                    <Label htmlFor="allowExchanges">Allow Exchanges</Label>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="returnPeriod">Return Period (days)</Label>
                    <Input
                      id="returnPeriod"
                      type="number"
                      value={formData.settings.returnPeriod}
                      onChange={(e) => setFormData({
                        ...formData,
                        settings: { ...formData.settings, returnPeriod: parseInt(e.target.value) || 30 }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="exchangePeriod">Exchange Period (days)</Label>
                    <Input
                      id="exchangePeriod"
                      type="number"
                      value={formData.settings.exchangePeriod}
                      onChange={(e) => setFormData({
                        ...formData,
                        settings: { ...formData.settings, exchangePeriod: parseInt(e.target.value) || 30 }
                      })}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="requireReceipt"
                    checked={formData.settings.requireReceipt}
                    onCheckedChange={(checked) => setFormData({
                      ...formData,
                      settings: { ...formData.settings, requireReceipt: checked }
                    })}
                  />
                  <Label htmlFor="requireReceipt">Require Receipt for Returns</Label>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Discount & Loyalty</h4>
                <div>
                  <Label htmlFor="maxDiscountPercentage">Max Discount Percentage</Label>
                  <Input
                    id="maxDiscountPercentage"
                    type="number"
                    value={formData.settings.maxDiscountPercentage}
                    onChange={(e) => setFormData({
                      ...formData,
                      settings: { ...formData.settings, maxDiscountPercentage: parseInt(e.target.value) || 20 }
                    })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="loyaltyProgramEnabled"
                    checked={formData.settings.loyaltyProgramEnabled}
                    onCheckedChange={(checked) => setFormData({
                      ...formData,
                      settings: { ...formData.settings, loyaltyProgramEnabled: checked }
                    })}
                  />
                  <Label htmlFor="loyaltyProgramEnabled">Enable Loyalty Program</Label>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Inventory Management</h4>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="inventorySync"
                    checked={formData.settings.inventorySync}
                    onCheckedChange={(checked) => setFormData({
                      ...formData,
                      settings: { ...formData.settings, inventorySync: checked }
                    })}
                  />
                  <Label htmlFor="inventorySync">Sync with Central Inventory</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoReorder"
                    checked={formData.settings.autoReorder}
                    onCheckedChange={(checked) => setFormData({
                      ...formData,
                      settings: { ...formData.settings, autoReorder: checked }
                    })}
                  />
                  <Label htmlFor="autoReorder">Enable Auto Reorder</Label>
                </div>

                <div>
                  <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    value={formData.settings.lowStockThreshold}
                    onChange={(e) => setFormData({
                      ...formData,
                      settings: { ...formData.settings, lowStockThreshold: parseInt(e.target.value) || 10 }
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {store ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            store ? 'Update Store' : 'Create Store'
          )}
        </Button>
      </div>
    </form>
  );
}
