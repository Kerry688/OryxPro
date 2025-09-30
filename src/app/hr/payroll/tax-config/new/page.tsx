'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Save, 
  FileText,
  Plus,
  X,
  DollarSign,
  Shield,
  Users,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

export default function NewTaxConfigurationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    country: 'Egypt',
    currency: 'EGP',
    taxYear: new Date().getFullYear(),
    brackets: [{
      minIncome: 0,
      maxIncome: '',
      rate: 0,
      description: ''
    }],
    exemptions: [{
      name: '',
      amount: '',
      currency: 'EGP',
      type: 'personal',
      maxAmount: ''
    }],
    socialInsurance: {
      employeeRate: 11,
      employerRate: 18.75,
      maxContribution: 15000,
      currency: 'EGP'
    },
    healthInsurance: {
      employeeRate: 2.5,
      employerRate: 2.5,
      currency: 'EGP'
    },
    pension: {
      employeeRate: 5,
      employerRate: 5,
      currency: 'EGP'
    }
  });

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child, grandchild] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: grandchild ? {
            ...(prev[parent as keyof typeof prev] as any)[child],
            [grandchild]: value
          } : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleArrayChange = (field: string, index: number, subField: string, value: any) => {
    setFormData(prev => {
      const array = [...(prev[field as keyof typeof prev] as any[])];
      array[index] = {
        ...array[index],
        [subField]: value
      };
      return {
        ...prev,
        [field]: array
      };
    });
  };

  const addArrayItem = (field: string, template: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof typeof prev] as any[]), template]
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => {
      const array = [...(prev[field as keyof typeof prev] as any[])];
      array.splice(index, 1);
      return {
        ...prev,
        [field]: array
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clean up the data before sending
      const cleanedData = {
        ...formData,
        taxYear: parseInt(formData.taxYear.toString()),
        brackets: formData.brackets
          .filter(bracket => bracket.minIncome !== undefined)
          .map(bracket => ({
            ...bracket,
            minIncome: parseFloat(bracket.minIncome.toString()),
            maxIncome: bracket.maxIncome ? parseFloat(bracket.maxIncome.toString()) : undefined,
            rate: parseFloat(bracket.rate.toString())
          })),
        exemptions: formData.exemptions
          .filter(exemption => exemption.name.trim() !== '')
          .map(exemption => ({
            ...exemption,
            amount: parseFloat(exemption.amount.toString()),
            maxAmount: exemption.maxAmount ? parseFloat(exemption.maxAmount.toString()) : undefined
          })),
        socialInsurance: {
          ...formData.socialInsurance,
          employeeRate: parseFloat(formData.socialInsurance.employeeRate.toString()),
          employerRate: parseFloat(formData.socialInsurance.employerRate.toString()),
          maxContribution: parseFloat(formData.socialInsurance.maxContribution.toString())
        },
        healthInsurance: {
          ...formData.healthInsurance,
          employeeRate: parseFloat(formData.healthInsurance.employeeRate.toString()),
          employerRate: parseFloat(formData.healthInsurance.employerRate.toString())
        },
        pension: {
          ...formData.pension,
          employeeRate: parseFloat(formData.pension.employeeRate.toString()),
          employerRate: parseFloat(formData.pension.employerRate.toString())
        }
      };

      const response = await fetch('/api/hr/payroll/tax-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });

      if (response.ok) {
        router.push('/hr/payroll/tax-config');
      } else {
        console.error('Failed to create tax configuration');
      }
    } catch (error) {
      console.error('Error creating tax configuration:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/hr/payroll/tax-config">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Configurations
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Tax Configuration</h1>
            <p className="text-muted-foreground">
              Configure tax rates and compliance settings for your country
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Enter the basic details of the tax configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Configuration Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Egypt Tax Configuration 2024"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="e.g., Egypt"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency *</Label>
                <select
                  id="currency"
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="EGP">EGP</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxYear">Tax Year *</Label>
                <Input
                  id="taxYear"
                  type="number"
                  value={formData.taxYear}
                  onChange={(e) => handleInputChange('taxYear', e.target.value)}
                  placeholder="e.g., 2024"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tax Brackets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tax Brackets
            </CardTitle>
            <CardDescription>
              Define progressive tax brackets and rates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.brackets.map((bracket, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Tax Bracket {index + 1}</h4>
                  {formData.brackets.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('brackets', index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Minimum Income *</Label>
                    <Input
                      type="number"
                      value={bracket.minIncome}
                      onChange={(e) => handleArrayChange('brackets', index, 'minIncome', e.target.value)}
                      placeholder="e.g., 0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Maximum Income (Optional)</Label>
                    <Input
                      type="number"
                      value={bracket.maxIncome}
                      onChange={(e) => handleArrayChange('brackets', index, 'maxIncome', e.target.value)}
                      placeholder="e.g., 15000 (leave empty for highest bracket)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tax Rate (%) *</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={bracket.rate}
                      onChange={(e) => handleArrayChange('brackets', index, 'rate', e.target.value)}
                      placeholder="e.g., 15"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={bracket.description}
                    onChange={(e) => handleArrayChange('brackets', index, 'description', e.target.value)}
                    placeholder="e.g., First tax bracket"
                  />
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem('brackets', {
                minIncome: 0,
                maxIncome: '',
                rate: 0,
                description: ''
              })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Tax Bracket
            </Button>
          </CardContent>
        </Card>

        {/* Exemptions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Tax Exemptions
            </CardTitle>
            <CardDescription>
              Define tax exemptions and deductions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.exemptions.map((exemption, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Exemption {index + 1}</h4>
                  {formData.exemptions.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('exemptions', index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Exemption Name *</Label>
                    <Input
                      value={exemption.name}
                      onChange={(e) => handleArrayChange('exemptions', index, 'name', e.target.value)}
                      placeholder="e.g., Personal Exemption"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <select
                      value={exemption.type}
                      onChange={(e) => handleArrayChange('exemptions', index, 'type', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="personal">Personal</option>
                      <option value="spouse">Spouse</option>
                      <option value="children">Children</option>
                      <option value="medical">Medical</option>
                      <option value="education">Education</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Amount *</Label>
                    <Input
                      type="number"
                      value={exemption.amount}
                      onChange={(e) => handleArrayChange('exemptions', index, 'amount', e.target.value)}
                      placeholder="e.g., 9000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Maximum Amount (Optional)</Label>
                    <Input
                      type="number"
                      value={exemption.maxAmount}
                      onChange={(e) => handleArrayChange('exemptions', index, 'maxAmount', e.target.value)}
                      placeholder="e.g., 18000"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem('exemptions', {
                name: '',
                amount: '',
                currency: 'EGP',
                type: 'personal',
                maxAmount: ''
              })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Exemption
            </Button>
          </CardContent>
        </Card>

        {/* Social Insurance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Social Insurance
            </CardTitle>
            <CardDescription>
              Configure social insurance rates and contributions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeRate">Employee Rate (%)</Label>
                <Input
                  id="employeeRate"
                  type="number"
                  step="0.01"
                  value={formData.socialInsurance.employeeRate}
                  onChange={(e) => handleInputChange('socialInsurance.employeeRate', e.target.value)}
                  placeholder="e.g., 11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employerRate">Employer Rate (%)</Label>
                <Input
                  id="employerRate"
                  type="number"
                  step="0.01"
                  value={formData.socialInsurance.employerRate}
                  onChange={(e) => handleInputChange('socialInsurance.employerRate', e.target.value)}
                  placeholder="e.g., 18.75"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxContribution">Max Contribution</Label>
                <Input
                  id="maxContribution"
                  type="number"
                  value={formData.socialInsurance.maxContribution}
                  onChange={(e) => handleInputChange('socialInsurance.maxContribution', e.target.value)}
                  placeholder="e.g., 15000"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Insurance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Health Insurance
            </CardTitle>
            <CardDescription>
              Configure health insurance rates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="healthEmployeeRate">Employee Rate (%)</Label>
                <Input
                  id="healthEmployeeRate"
                  type="number"
                  step="0.01"
                  value={formData.healthInsurance.employeeRate}
                  onChange={(e) => handleInputChange('healthInsurance.employeeRate', e.target.value)}
                  placeholder="e.g., 2.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="healthEmployerRate">Employer Rate (%)</Label>
                <Input
                  id="healthEmployerRate"
                  type="number"
                  step="0.01"
                  value={formData.healthInsurance.employerRate}
                  onChange={(e) => handleInputChange('healthInsurance.employerRate', e.target.value)}
                  placeholder="e.g., 2.5"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pension */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Pension
            </CardTitle>
            <CardDescription>
              Configure pension contribution rates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pensionEmployeeRate">Employee Rate (%)</Label>
                <Input
                  id="pensionEmployeeRate"
                  type="number"
                  step="0.01"
                  value={formData.pension.employeeRate}
                  onChange={(e) => handleInputChange('pension.employeeRate', e.target.value)}
                  placeholder="e.g., 5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pensionEmployerRate">Employer Rate (%)</Label>
                <Input
                  id="pensionEmployerRate"
                  type="number"
                  step="0.01"
                  value={formData.pension.employerRate}
                  onChange={(e) => handleInputChange('pension.employerRate', e.target.value)}
                  placeholder="e.g., 5"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" asChild>
            <Link href="/hr/payroll/tax-config">Cancel</Link>
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Configuration
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
