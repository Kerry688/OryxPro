'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Combobox, ComboboxItem } from '@/components/ui/combobox';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { Brand } from '@/lib/models/brand';

interface BrandFormProps {
  brand?: Brand | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function BrandForm({ brand, onSubmit, onCancel }: BrandFormProps) {
  const [formData, setFormData] = useState({
    // Basic fields
    name: '',
    code: '',
    description: '',
    logo: '',
    website: '',
    email: '',
    phone: '',
    category: 'other' as any,
    status: 'active' as any,
    establishedYear: '',
    countryOfOrigin: '',
    certifications: [] as string[],
    isActive: true,
    
    // Address
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    
    // Social Media
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
      youtube: ''
    },
    
    // Contact Person
    contactPerson: {
      name: '',
      email: '',
      phone: '',
      position: ''
    },
    
    // Terms
    terms: {
      paymentTerms: '',
      returnPolicy: '',
      warrantyTerms: '',
      minimumOrder: 0
    }
  });

  const [newCertification, setNewCertification] = useState('');

  const categories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'food_beverage', label: 'Food & Beverage' },
    { value: 'beauty', label: 'Beauty' },
    { value: 'home_garden', label: 'Home & Garden' },
    { value: 'sports', label: 'Sports' },
    { value: 'books', label: 'Books' },
    { value: 'toys', label: 'Toys' },
    { value: 'health', label: 'Health' },
    { value: 'office', label: 'Office' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'other', label: 'Other' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'discontinued', label: 'Discontinued' }
  ];

  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name,
        code: brand.code,
        description: brand.description || '',
        logo: brand.logo || '',
        website: brand.website || '',
        email: brand.email || '',
        phone: brand.phone || '',
        category: brand.category,
        status: brand.status,
        establishedYear: brand.establishedYear?.toString() || '',
        countryOfOrigin: brand.countryOfOrigin || '',
        certifications: brand.certifications || [],
        isActive: brand.isActive,
        
        address: {
          street: brand.address?.street || '',
          city: brand.address?.city || '',
          state: brand.address?.state || '',
          zipCode: brand.address?.zipCode || '',
          country: brand.address?.country || ''
        },
        
        socialMedia: {
          facebook: brand.socialMedia?.facebook || '',
          instagram: brand.socialMedia?.instagram || '',
          twitter: brand.socialMedia?.twitter || '',
          linkedin: brand.socialMedia?.linkedin || '',
          youtube: brand.socialMedia?.youtube || ''
        },
        
        contactPerson: {
          name: brand.contactPerson?.name || '',
          email: brand.contactPerson?.email || '',
          phone: brand.contactPerson?.phone || '',
          position: brand.contactPerson?.position || ''
        },
        
        terms: {
          paymentTerms: brand.terms?.paymentTerms || '',
          returnPolicy: brand.terms?.returnPolicy || '',
          warrantyTerms: brand.terms?.warrantyTerms || '',
          minimumOrder: brand.terms?.minimumOrder || 0
        }
      });
    }
  }, [brand]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      name: formData.name,
      code: formData.code,
      description: formData.description,
      logo: formData.logo,
      website: formData.website,
      email: formData.email,
      phone: formData.phone,
      category: formData.category,
      status: formData.status,
      establishedYear: formData.establishedYear ? parseInt(formData.establishedYear) : undefined,
      countryOfOrigin: formData.countryOfOrigin,
      certifications: formData.certifications,
      isActive: formData.isActive,
      
      address: Object.values(formData.address).some(val => val.trim()) ? formData.address : undefined,
      socialMedia: Object.values(formData.socialMedia).some(val => val.trim()) ? formData.socialMedia : undefined,
      contactPerson: Object.values(formData.contactPerson).some(val => val.trim()) ? formData.contactPerson : undefined,
      terms: Object.values(formData.terms).some(val => val) ? formData.terms : undefined
    };

    onSubmit(submitData);
  };

  const addCertification = () => {
    if (newCertification && !formData.certifications.includes(newCertification)) {
      setFormData({ ...formData, certifications: [...formData.certifications, newCertification] });
      setNewCertification('');
    }
  };

  const removeCertification = (cert: string) => {
    setFormData({ ...formData, certifications: formData.certifications.filter(c => c !== cert) });
  };

  const renderBasicFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Brand Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="transition-all duration-200 rounded-lg"
          />
        </div>
        <div>
          <Label htmlFor="code">Brand Code *</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="e.g., NIKE, APPLE, SAMSUNG"
            required
            className="transition-all duration-200 rounded-lg"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brand description and background..."
          className="transition-all duration-200 rounded-lg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category *</Label>
          <Combobox 
            value={formData.category} 
            onValueChange={(value) => setFormData({ ...formData, category: value })}
            placeholder="Select category"
            searchPlaceholder="Search categories..."
            emptyText="No category found."
          >
            {categories.map((category) => (
              <ComboboxItem key={category.value} value={category.value}>
                {category.label}
              </ComboboxItem>
            ))}
          </Combobox>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Combobox 
            value={formData.status} 
            onValueChange={(value) => setFormData({ ...formData, status: value })}
            placeholder="Select status"
            searchPlaceholder="Search status..."
            emptyText="No status found."
          >
            {statusOptions.map((status) => (
              <ComboboxItem key={status.value} value={status.value}>
                {status.label}
              </ComboboxItem>
            ))}
          </Combobox>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="establishedYear">Established Year</Label>
          <Input
            id="establishedYear"
            type="number"
            value={formData.establishedYear}
            onChange={(e) => setFormData({ ...formData, establishedYear: e.target.value })}
            placeholder="e.g., 1976"
            className="transition-all duration-200 rounded-lg"
          />
        </div>
        <div>
          <Label htmlFor="countryOfOrigin">Country of Origin</Label>
          <Input
            id="countryOfOrigin"
            value={formData.countryOfOrigin}
            onChange={(e) => setFormData({ ...formData, countryOfOrigin: e.target.value })}
            placeholder="e.g., United States"
            className="transition-all duration-200 rounded-lg"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
        <Label htmlFor="isActive">Active Brand</Label>
      </div>
    </div>
  );

  const renderContactFields = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          type="url"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          placeholder="https://www.brand.com"
          className="transition-all duration-200 rounded-lg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="contact@brand.com"
            className="transition-all duration-200 rounded-lg"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
            className="transition-all duration-200 rounded-lg"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="logo">Logo URL</Label>
        <Input
          id="logo"
          type="url"
          value={formData.logo}
          onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
          placeholder="https://example.com/logo.png"
          className="transition-all duration-200 rounded-lg"
        />
      </div>

      <div>
        <Label>Address</Label>
        <div className="space-y-2">
          <Input
            placeholder="Street Address"
            value={formData.address.street}
            onChange={(e) => setFormData({
              ...formData,
              address: { ...formData.address, street: e.target.value }
            })}
            className="transition-all duration-200 rounded-lg"
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="City"
              value={formData.address.city}
              onChange={(e) => setFormData({
                ...formData,
                address: { ...formData.address, city: e.target.value }
              })}
              className="transition-all duration-200 rounded-lg"
            />
            <Input
              placeholder="State"
              value={formData.address.state}
              onChange={(e) => setFormData({
                ...formData,
                address: { ...formData.address, state: e.target.value }
              })}
              className="transition-all duration-200 rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="ZIP Code"
              value={formData.address.zipCode}
              onChange={(e) => setFormData({
                ...formData,
                address: { ...formData.address, zipCode: e.target.value }
              })}
              className="transition-all duration-200 rounded-lg"
            />
            <Input
              placeholder="Country"
              value={formData.address.country}
              onChange={(e) => setFormData({
                ...formData,
                address: { ...formData.address, country: e.target.value }
              })}
              className="transition-all duration-200 rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSocialMediaFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="facebook">Facebook</Label>
          <Input
            id="facebook"
            type="url"
            value={formData.socialMedia.facebook}
            onChange={(e) => setFormData({
              ...formData,
              socialMedia: { ...formData.socialMedia, facebook: e.target.value }
            })}
            placeholder="https://facebook.com/brand"
            className="transition-all duration-200 rounded-lg"
          />
        </div>
        <div>
          <Label htmlFor="instagram">Instagram</Label>
          <Input
            id="instagram"
            type="url"
            value={formData.socialMedia.instagram}
            onChange={(e) => setFormData({
              ...formData,
              socialMedia: { ...formData.socialMedia, instagram: e.target.value }
            })}
            placeholder="https://instagram.com/brand"
            className="transition-all duration-200 rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="twitter">Twitter</Label>
          <Input
            id="twitter"
            type="url"
            value={formData.socialMedia.twitter}
            onChange={(e) => setFormData({
              ...formData,
              socialMedia: { ...formData.socialMedia, twitter: e.target.value }
            })}
            placeholder="https://twitter.com/brand"
            className="transition-all duration-200 rounded-lg"
          />
        </div>
        <div>
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            type="url"
            value={formData.socialMedia.linkedin}
            onChange={(e) => setFormData({
              ...formData,
              socialMedia: { ...formData.socialMedia, linkedin: e.target.value }
            })}
            placeholder="https://linkedin.com/company/brand"
            className="transition-all duration-200 rounded-lg"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="youtube">YouTube</Label>
        <Input
          id="youtube"
          type="url"
          value={formData.socialMedia.youtube}
          onChange={(e) => setFormData({
            ...formData,
            socialMedia: { ...formData.socialMedia, youtube: e.target.value }
          })}
          placeholder="https://youtube.com/c/brand"
          className="transition-all duration-200 rounded-lg"
        />
      </div>
    </div>
  );

  const renderContactPersonFields = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="contactName">Contact Person Name</Label>
        <Input
          id="contactName"
          value={formData.contactPerson.name}
          onChange={(e) => setFormData({
            ...formData,
            contactPerson: { ...formData.contactPerson, name: e.target.value }
          })}
          placeholder="John Doe"
          className="transition-all duration-200 rounded-lg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contactEmail">Contact Email</Label>
          <Input
            id="contactEmail"
            type="email"
            value={formData.contactPerson.email}
            onChange={(e) => setFormData({
              ...formData,
              contactPerson: { ...formData.contactPerson, email: e.target.value }
            })}
            placeholder="john@brand.com"
            className="transition-all duration-200 rounded-lg"
          />
        </div>
        <div>
          <Label htmlFor="contactPhone">Contact Phone</Label>
          <Input
            id="contactPhone"
            value={formData.contactPerson.phone}
            onChange={(e) => setFormData({
              ...formData,
              contactPerson: { ...formData.contactPerson, phone: e.target.value }
            })}
            placeholder="+1 (555) 123-4567"
            className="transition-all duration-200 rounded-lg"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="contactPosition">Position</Label>
        <Input
          id="contactPosition"
          value={formData.contactPerson.position}
          onChange={(e) => setFormData({
            ...formData,
            contactPerson: { ...formData.contactPerson, position: e.target.value }
          })}
          placeholder="Brand Manager"
          className="transition-all duration-200 rounded-lg"
        />
      </div>
    </div>
  );

  const renderTermsFields = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="paymentTerms">Payment Terms</Label>
        <Input
          id="paymentTerms"
          value={formData.terms.paymentTerms}
          onChange={(e) => setFormData({
            ...formData,
            terms: { ...formData.terms, paymentTerms: e.target.value }
          })}
          placeholder="Net 30, COD, etc."
          className="transition-all duration-200 rounded-lg"
        />
      </div>

      <div>
        <Label htmlFor="returnPolicy">Return Policy</Label>
        <Textarea
          id="returnPolicy"
          value={formData.terms.returnPolicy}
          onChange={(e) => setFormData({
            ...formData,
            terms: { ...formData.terms, returnPolicy: e.target.value }
          })}
          placeholder="Return policy details..."
          className="transition-all duration-200 rounded-lg"
        />
      </div>

      <div>
        <Label htmlFor="warrantyTerms">Warranty Terms</Label>
        <Textarea
          id="warrantyTerms"
          value={formData.terms.warrantyTerms}
          onChange={(e) => setFormData({
            ...formData,
            terms: { ...formData.terms, warrantyTerms: e.target.value }
          })}
          placeholder="Warranty terms and conditions..."
          className="transition-all duration-200 rounded-lg"
        />
      </div>

      <div>
        <Label htmlFor="minimumOrder">Minimum Order Value</Label>
        <Input
          id="minimumOrder"
          type="number"
          step="0.01"
          value={formData.terms.minimumOrder}
          onChange={(e) => setFormData({
            ...formData,
            terms: { ...formData.terms, minimumOrder: parseFloat(e.target.value) || 0 }
          })}
          placeholder="0.00"
          className="transition-all duration-200 rounded-lg"
        />
      </div>
    </div>
  );

  const renderCertificationsFields = () => (
    <div className="space-y-4">
      <div>
        <Label>Certifications</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.certifications.map((cert) => (
            <Badge key={cert} variant="secondary" className="flex items-center gap-1">
              {cert}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeCertification(cert)} />
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newCertification}
            onChange={(e) => setNewCertification(e.target.value)}
            placeholder="Add certification (e.g., ISO 9001)"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
            className="transition-all duration-200 rounded-lg"
          />
          <Button type="button" onClick={addCertification} className="transition-all duration-200 rounded-lg">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="person">Contact Person</TabsTrigger>
          <TabsTrigger value="terms">Terms</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              {renderBasicFields()}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              {renderContactFields()}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
            </CardHeader>
            <CardContent>
              {renderSocialMediaFields()}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="person" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Person</CardTitle>
            </CardHeader>
            <CardContent>
              {renderContactPersonFields()}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="terms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Terms</CardTitle>
            </CardHeader>
            <CardContent>
              {renderTermsFields()}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="certifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              {renderCertificationsFields()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel} className="transition-all duration-200 rounded-lg">
          Cancel
        </Button>
        <Button type="submit" className="transition-all duration-200 rounded-lg">
          {brand ? 'Update Brand' : 'Create Brand'}
        </Button>
      </div>
    </form>
  );
}
