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
  Warehouse,
  MapPin,
  Phone,
  Mail,
  Users,
  Settings,
  Clock,
  Package,
  Building2,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Warehouse as WarehouseType } from '@/lib/models/warehouse';

interface WarehouseFormProps {
  warehouse: WarehouseType | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function WarehouseForm({ warehouse, onClose, onSuccess }: WarehouseFormProps) {
  const [formData, setFormData] = useState({
    name: warehouse?.name || '',
    code: warehouse?.code || '',
    branchId: warehouse?.branchId?.toString() || '',
    type: warehouse?.type || 'main',
    address: warehouse?.address || '',
    city: warehouse?.city || '',
    state: warehouse?.state || '',
    zipCode: warehouse?.zipCode || '',
    country: warehouse?.country || 'USA',
    capacity: warehouse?.capacity || 1000,
    currentCapacity: warehouse?.currentCapacity || 0,
    manager: warehouse?.manager || '',
    phone: warehouse?.phone || '',
    email: warehouse?.email || '',
    features: warehouse?.features || [],
    operatingHours: {
      monday: warehouse?.operatingHours?.monday || { open: '06:00', close: '18:00', isOpen: true },
      tuesday: warehouse?.operatingHours?.tuesday || { open: '06:00', close: '18:00', isOpen: true },
      wednesday: warehouse?.operatingHours?.wednesday || { open: '06:00', close: '18:00', isOpen: true },
      thursday: warehouse?.operatingHours?.thursday || { open: '06:00', close: '18:00', isOpen: true },
      friday: warehouse?.operatingHours?.friday || { open: '06:00', close: '18:00', isOpen: true },
      saturday: warehouse?.operatingHours?.saturday || { open: '08:00', close: '16:00', isOpen: true },
      sunday: warehouse?.operatingHours?.sunday || { open: '08:00', close: '16:00', isOpen: false },
    },
    isActive: warehouse?.isActive ?? true,
  });

  const [branches, setBranches] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  const { toast } = useToast();

  // Available features
  const availableFeatures = [
    'climate_control',
    'security_system',
    'forklift_access',
    'loading_dock',
    'fire_suppression',
    'backup_generator',
    'cctv_surveillance',
    'access_control',
    'temperature_monitoring',
    'humidity_control',
    'automated_racking',
    'conveyor_system',
    'cold_storage',
    'hazardous_material_storage',
    'refrigerated_storage',
    'frozen_storage'
  ];

  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch('/api/branches');
        if (response.ok) {
          const data = await response.json();
          setBranches(data);
        }
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    fetchBranches();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = warehouse ? `/api/warehouses/${warehouse._id}` : '/api/warehouses';
      const method = warehouse ? 'PUT' : 'POST';
      
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
          description: warehouse ? 'Warehouse updated successfully' : 'Warehouse created successfully',
        });
        onSuccess();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save warehouse');
      }
    } catch (error) {
      console.error('Error saving warehouse:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save warehouse',
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

  const getFeatureDescription = (feature: string) => {
    const descriptions: { [key: string]: string } = {
      'climate_control': 'Temperature and humidity control systems',
      'security_system': '24/7 security monitoring and alarms',
      'forklift_access': 'Forklift-friendly layout and equipment',
      'loading_dock': 'Dedicated loading and unloading areas',
      'fire_suppression': 'Automatic fire suppression systems',
      'backup_generator': 'Backup power generation capability',
      'cctv_surveillance': 'Closed-circuit television monitoring',
      'access_control': 'Restricted access control systems',
      'temperature_monitoring': 'Continuous temperature monitoring',
      'humidity_control': 'Humidity control systems',
      'automated_racking': 'Automated storage and retrieval systems',
      'conveyor_system': 'Conveyor belt systems for material handling',
      'cold_storage': 'Refrigerated storage capabilities',
      'hazardous_material_storage': 'Specialized storage for hazardous materials',
      'refrigerated_storage': 'Temperature-controlled storage',
      'frozen_storage': 'Sub-zero temperature storage'
    };
    return descriptions[feature] || feature.replace('_', ' ');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="contact">Contact & Hours</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="capacity">Capacity</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Warehouse className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Warehouse name, type, and location details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Warehouse Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="code">Warehouse Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., WH001"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Warehouse Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as any })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select warehouse type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">Main Warehouse</SelectItem>
                      <SelectItem value="storage">Storage Facility</SelectItem>
                      <SelectItem value="retail">Retail Warehouse</SelectItem>
                      <SelectItem value="distribution">Distribution Center</SelectItem>
                      <SelectItem value="cold_storage">Cold Storage</SelectItem>
                      <SelectItem value="hazardous">Hazardous Material</SelectItem>
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
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
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
                Warehouse contact details and manager information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1-555-0123"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="warehouse@company.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="manager">Manager</Label>
                <Input
                  id="manager"
                  value={formData.manager}
                  onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                  placeholder="Manager name"
                  required
                />
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
                Set warehouse operating hours for each day
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
                <Settings className="h-5 w-5" />
                Warehouse Features
              </CardTitle>
              <CardDescription>
                Select available features and capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Selected Features</Label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.features.map(feature => (
                    <Badge key={feature} variant="outline" className="flex items-center gap-1">
                      {getFeatureDescription(feature)}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeFeature(feature)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Available Features</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableFeatures.map(feature => (
                    <div key={feature} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={feature}
                        checked={formData.features.includes(feature)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              features: [...formData.features, feature]
                            });
                          } else {
                            removeFeature(feature);
                          }
                        }}
                        className="rounded"
                      />
                      <Label htmlFor={feature} className="text-sm">
                        {getFeatureDescription(feature)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Add Custom Feature</Label>
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Enter custom feature"
                  />
                  <Button type="button" onClick={addFeature} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capacity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Capacity Management
              </CardTitle>
              <CardDescription>
                Set warehouse capacity and current usage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="capacity">Total Capacity (m³)</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                    min="0"
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Maximum storage capacity in cubic meters
                  </p>
                </div>
                <div>
                  <Label htmlFor="currentCapacity">Current Usage (m³)</Label>
                  <Input
                    id="currentCapacity"
                    type="number"
                    value={formData.currentCapacity}
                    onChange={(e) => setFormData({ ...formData, currentCapacity: parseInt(e.target.value) || 0 })}
                    min="0"
                    max={formData.capacity}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Currently used storage space
                  </p>
                </div>
              </div>

              {formData.capacity > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Capacity Utilization</span>
                    <span>{((formData.currentCapacity / formData.capacity) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className={`h-4 rounded-full ${
                        (formData.currentCapacity / formData.capacity) >= 0.9 ? 'bg-red-600' :
                        (formData.currentCapacity / formData.capacity) >= 0.75 ? 'bg-orange-600' :
                        (formData.currentCapacity / formData.capacity) >= 0.5 ? 'bg-yellow-600' : 'bg-green-600'
                      }`}
                      style={{ width: `${Math.min((formData.currentCapacity / formData.capacity) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>90%</span>
                    <span>100%</span>
                  </div>
                </div>
              )}

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Capacity Guidelines
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>0-50%:</strong> Optimal capacity for efficient operations</li>
                  <li>• <strong>50-75%:</strong> Good utilization, monitor for growth</li>
                  <li>• <strong>75-90%:</strong> High utilization, consider expansion</li>
                  <li>• <strong>90%+:</strong> Critical capacity, immediate action needed</li>
                </ul>
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
              {warehouse ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            warehouse ? 'Update Warehouse' : 'Create Warehouse'
          )}
        </Button>
      </div>
    </form>
  );
}
