'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Save, 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Globe, 
  Shield, 
  Bell,
  Camera,
  Plus,
  X,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { EmployeeProfile, UpdateProfileDTO } from '@/lib/models/employee-portal';

export default function EmployeeProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    // Mock employee ID - in real app, this would come from auth context
    const employeeId = 'EMP009';
    fetchProfile(employeeId);
  }, []);

  const fetchProfile = async (employeeId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/employee/profile?employeeId=${employeeId}`);
      const data = await response.json();
      
      if (data.success) {
        setProfile(data.data);
        setFormData({
          personalInfo: data.data.personalInfo,
          contactInfo: data.data.contactInfo,
          skills: data.data.skills || [],
          preferences: data.data.preferences
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section: string, subsection: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const addSkill = () => {
    setFormData((prev: any) => ({
      ...prev,
      skills: [
        ...prev.skills,
        {
          skillId: `SKILL_${Date.now()}`,
          skillName: '',
          level: 'beginner',
          category: '',
          verified: false
        }
      ]
    }));
  };

  const removeSkill = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      skills: prev.skills.filter((_: any, i: number) => i !== index)
    }));
  };

  const updateSkill = (index: number, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      skills: prev.skills.map((skill: any, i: number) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const handleSave = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      const updateData: UpdateProfileDTO = {
        personalInfo: formData.personalInfo,
        contactInfo: formData.contactInfo,
        skills: formData.skills,
        preferences: formData.preferences
      };

      const response = await fetch('/api/employee/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: profile.employeeId,
          ...updateData
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Show success message or redirect
        alert('Profile updated successfully!');
        router.push('/employee');
      } else {
        alert('Failed to update profile: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/employee">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Portal
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Profile Management</h1>
            <p className="text-muted-foreground">
              Manage your personal and professional information
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and emergency contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <Camera className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    JPG, PNG up to 2MB
                  </p>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.personalInfo?.firstName || ''}
                    onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.personalInfo?.lastName || ''}
                    onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Personal Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.personalInfo?.email || ''}
                    onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.personalInfo?.phone || ''}
                    onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.personalInfo?.dateOfBirth ? 
                      new Date(formData.personalInfo.dateOfBirth).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', new Date(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    value={formData.personalInfo?.nationality || ''}
                    onChange={(e) => handleInputChange('personalInfo', 'nationality', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maritalStatus">Marital Status</Label>
                  <select
                    id="maritalStatus"
                    value={formData.personalInfo?.maritalStatus || 'single'}
                    onChange={(e) => handleInputChange('personalInfo', 'maritalStatus', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={formData.personalInfo?.address?.street || ''}
                      onChange={(e) => handleNestedInputChange('personalInfo', 'address', 'street', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.personalInfo?.address?.city || ''}
                      onChange={(e) => handleNestedInputChange('personalInfo', 'address', 'city', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      value={formData.personalInfo?.address?.state || ''}
                      onChange={(e) => handleNestedInputChange('personalInfo', 'address', 'state', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Postal Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.personalInfo?.address?.zipCode || ''}
                      onChange={(e) => handleNestedInputChange('personalInfo', 'address', 'zipCode', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.personalInfo?.address?.country || ''}
                      onChange={(e) => handleNestedInputChange('personalInfo', 'address', 'country', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyName">Contact Name</Label>
                    <Input
                      id="emergencyName"
                      value={formData.personalInfo?.emergencyContact?.name || ''}
                      onChange={(e) => handleNestedInputChange('personalInfo', 'emergencyContact', 'name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyRelationship">Relationship</Label>
                    <Input
                      id="emergencyRelationship"
                      value={formData.personalInfo?.emergencyContact?.relationship || ''}
                      onChange={(e) => handleNestedInputChange('personalInfo', 'emergencyContact', 'relationship', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Phone Number</Label>
                    <Input
                      id="emergencyPhone"
                      value={formData.personalInfo?.emergencyContact?.phone || ''}
                      onChange={(e) => handleNestedInputChange('personalInfo', 'emergencyContact', 'phone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyEmail">Email (Optional)</Label>
                    <Input
                      id="emergencyEmail"
                      type="email"
                      value={formData.personalInfo?.emergencyContact?.email || ''}
                      onChange={(e) => handleNestedInputChange('personalInfo', 'emergencyContact', 'email', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Information Tab */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
              <CardDescription>
                Update your work contact details and location information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workPhone">Work Phone</Label>
                  <Input
                    id="workPhone"
                    value={formData.contactInfo?.workPhone || ''}
                    onChange={(e) => handleInputChange('contactInfo', 'workPhone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="extension">Extension</Label>
                  <Input
                    id="extension"
                    value={formData.contactInfo?.extension || ''}
                    onChange={(e) => handleInputChange('contactInfo', 'extension', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deskLocation">Desk Location</Label>
                <Input
                  id="deskLocation"
                  value={formData.contactInfo?.deskLocation || ''}
                  onChange={(e) => handleInputChange('contactInfo', 'deskLocation', e.target.value)}
                  placeholder="e.g., Building A, Floor 2, Desk 205"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Skills & Competencies
              </CardTitle>
              <CardDescription>
                Manage your professional skills and competencies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.skills?.map((skill: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Skill {index + 1}</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeSkill(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Skill Name</Label>
                      <Input
                        value={skill.skillName}
                        onChange={(e) => updateSkill(index, 'skillName', e.target.value)}
                        placeholder="e.g., JavaScript, Project Management"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Input
                        value={skill.category}
                        onChange={(e) => updateSkill(index, 'category', e.target.value)}
                        placeholder="e.g., Technical, Management"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Skill Level</Label>
                    <select
                      value={skill.level}
                      onChange={(e) => updateSkill(index, 'level', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addSkill}>
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Preferences & Settings
              </CardTitle>
              <CardDescription>
                Configure your notification and privacy preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    value={formData.preferences?.language || 'en'}
                    onChange={(e) => handleInputChange('preferences', 'language', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="en">English</option>
                    <option value="ar">العربية</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    value={formData.preferences?.timezone || 'Africa/Cairo'}
                    onChange={(e) => handleInputChange('preferences', 'timezone', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Africa/Cairo">Africa/Cairo (GMT+2)</option>
                    <option value="UTC">UTC (GMT+0)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.preferences?.notifications?.email || false}
                      onChange={(e) => handleNestedInputChange('preferences', 'notifications', 'email', e.target.checked)}
                      className="h-4 w-4"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.preferences?.notifications?.sms || false}
                      onChange={(e) => handleNestedInputChange('preferences', 'notifications', 'sms', e.target.checked)}
                      className="h-4 w-4"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.preferences?.notifications?.push || true}
                      onChange={(e) => handleNestedInputChange('preferences', 'notifications', 'push', e.target.checked)}
                      className="h-4 w-4"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Privacy Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show Profile Picture</Label>
                      <p className="text-sm text-muted-foreground">Allow others to see your profile picture</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.preferences?.privacy?.showProfilePicture || true}
                      onChange={(e) => handleNestedInputChange('preferences', 'privacy', 'showProfilePicture', e.target.checked)}
                      className="h-4 w-4"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show Contact Information</Label>
                      <p className="text-sm text-muted-foreground">Allow others to see your contact details</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.preferences?.privacy?.showContactInfo || true}
                      onChange={(e) => handleNestedInputChange('preferences', 'privacy', 'showContactInfo', e.target.checked)}
                      className="h-4 w-4"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show Skills</Label>
                      <p className="text-sm text-muted-foreground">Allow others to see your skills</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.preferences?.privacy?.showSkills || true}
                      onChange={(e) => handleNestedInputChange('preferences', 'privacy', 'showSkills', e.target.checked)}
                      className="h-4 w-4"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}