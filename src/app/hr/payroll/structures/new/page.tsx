'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Save, 
  Building2,
  Plus,
  X,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users
} from 'lucide-react';
import Link from 'next/link';

export default function NewSalaryStructurePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    grade: '',
    level: '',
    components: {
      basic: {
        amount: '',
        currency: 'EGP',
        percentage: ''
      },
      allowances: [{
        name: '',
        type: 'fixed',
        amount: '',
        percentage: '',
        basedOn: 'basic',
        conditions: [''],
        taxable: true,
        description: ''
      }],
      deductions: [{
        name: '',
        type: 'fixed',
        amount: '',
        percentage: '',
        basedOn: 'basic',
        conditions: [''],
        description: ''
      }]
    },
    benefits: {
      healthInsurance: {
        provided: false,
        amount: '',
        currency: 'EGP',
        coverageType: 'individual'
      },
      retirementPlan: {
        provided: false,
        employeeContribution: '',
        employerContribution: '',
        currency: 'EGP'
      },
      otherBenefits: [{
        name: '',
        type: 'cash',
        value: '',
        currency: 'EGP',
        description: ''
      }]
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
        components: {
          ...formData.components,
          basic: {
            ...formData.components.basic,
            amount: parseFloat(formData.components.basic.amount) || 0,
            percentage: formData.components.basic.percentage ? parseFloat(formData.components.basic.percentage) : undefined
          },
          allowances: formData.components.allowances
            .filter(allowance => allowance.name.trim() !== '')
            .map(allowance => ({
              ...allowance,
              amount: allowance.amount ? parseFloat(allowance.amount) : undefined,
              percentage: allowance.percentage ? parseFloat(allowance.percentage) : undefined,
              conditions: allowance.conditions.filter(c => c.trim() !== '')
            })),
          deductions: formData.components.deductions
            .filter(deduction => deduction.name.trim() !== '')
            .map(deduction => ({
              ...deduction,
              amount: deduction.amount ? parseFloat(deduction.amount) : undefined,
              percentage: deduction.percentage ? parseFloat(deduction.percentage) : undefined,
              conditions: deduction.conditions.filter(c => c.trim() !== '')
            }))
        },
        benefits: {
          ...formData.benefits,
          healthInsurance: {
            ...formData.benefits.healthInsurance,
            amount: formData.benefits.healthInsurance.amount ? parseFloat(formData.benefits.healthInsurance.amount) : undefined
          },
          retirementPlan: {
            ...formData.benefits.retirementPlan,
            employeeContribution: formData.benefits.retirementPlan.employeeContribution ? parseFloat(formData.benefits.retirementPlan.employeeContribution) : undefined,
            employerContribution: formData.benefits.retirementPlan.employerContribution ? parseFloat(formData.benefits.retirementPlan.employerContribution) : undefined
          },
          otherBenefits: formData.benefits.otherBenefits
            .filter(benefit => benefit.name.trim() !== '')
            .map(benefit => ({
              ...benefit,
              value: parseFloat(benefit.value) || 0
            }))
        }
      };

      const response = await fetch('/api/hr/payroll/structures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });

      if (response.ok) {
        router.push('/hr/payroll/structures');
      } else {
        console.error('Failed to create salary structure');
      }
    } catch (error) {
      console.error('Error creating salary structure:', error);
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
            <Link href="/hr/payroll/structures">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Structures
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Salary Structure</h1>
            <p className="text-muted-foreground">
              Define a new salary structure for your organization
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Enter the basic details of the salary structure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Structure Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Senior Management"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">Grade *</Label>
                <Input
                  id="grade"
                  value={formData.grade}
                  onChange={(e) => handleInputChange('grade', e.target.value)}
                  placeholder="e.g., A, B, C"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level">Level *</Label>
                <Input
                  id="level"
                  value={formData.level}
                  onChange={(e) => handleInputChange('level', e.target.value)}
                  placeholder="e.g., Senior, Middle, Junior"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  value={formData.components.basic.currency}
                  onChange={(e) => handleInputChange('components.basic.currency', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="EGP">EGP</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the salary structure and its purpose..."
                rows={3}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Basic Salary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Basic Salary
            </CardTitle>
            <CardDescription>
              Set the base salary amount
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basicAmount">Basic Salary Amount *</Label>
                <Input
                  id="basicAmount"
                  type="number"
                  value={formData.components.basic.amount}
                  onChange={(e) => handleInputChange('components.basic.amount', e.target.value)}
                  placeholder="e.g., 15000"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="basicPercentage">Percentage of Total (Optional)</Label>
                <Input
                  id="basicPercentage"
                  type="number"
                  value={formData.components.basic.percentage}
                  onChange={(e) => handleInputChange('components.basic.percentage', e.target.value)}
                  placeholder="e.g., 70"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Allowances */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Allowances
            </CardTitle>
            <CardDescription>
              Add salary allowances and benefits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.components.allowances.map((allowance, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Allowance {index + 1}</h4>
                  {formData.components.allowances.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('components.allowances', index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Allowance Name *</Label>
                    <Input
                      value={allowance.name}
                      onChange={(e) => handleArrayChange('components.allowances', index, 'name', e.target.value)}
                      placeholder="e.g., Transportation Allowance"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <select
                      value={allowance.type}
                      onChange={(e) => handleArrayChange('components.allowances', index, 'type', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="fixed">Fixed Amount</option>
                      <option value="percentage">Percentage</option>
                      <option value="performance-based">Performance Based</option>
                      <option value="conditional">Conditional</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Amount (if fixed)</Label>
                    <Input
                      type="number"
                      value={allowance.amount}
                      onChange={(e) => handleArrayChange('components.allowances', index, 'amount', e.target.value)}
                      placeholder="e.g., 2000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Percentage (if percentage)</Label>
                    <Input
                      type="number"
                      value={allowance.percentage}
                      onChange={(e) => handleArrayChange('components.allowances', index, 'percentage', e.target.value)}
                      placeholder="e.g., 15"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={allowance.description}
                    onChange={(e) => handleArrayChange('components.allowances', index, 'description', e.target.value)}
                    placeholder="Description of the allowance"
                  />
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem('components.allowances', {
                name: '',
                type: 'fixed',
                amount: '',
                percentage: '',
                basedOn: 'basic',
                conditions: [''],
                taxable: true,
                description: ''
              })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Allowance
            </Button>
          </CardContent>
        </Card>

        {/* Deductions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Deductions
            </CardTitle>
            <CardDescription>
              Add salary deductions and contributions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.components.deductions.map((deduction, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Deduction {index + 1}</h4>
                  {formData.components.deductions.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('components.deductions', index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Deduction Name *</Label>
                    <Input
                      value={deduction.name}
                      onChange={(e) => handleArrayChange('components.deductions', index, 'name', e.target.value)}
                      placeholder="e.g., Health Insurance"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <select
                      value={deduction.type}
                      onChange={(e) => handleArrayChange('components.deductions', index, 'type', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="fixed">Fixed Amount</option>
                      <option value="percentage">Percentage</option>
                      <option value="conditional">Conditional</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Amount (if fixed)</Label>
                    <Input
                      type="number"
                      value={deduction.amount}
                      onChange={(e) => handleArrayChange('components.deductions', index, 'amount', e.target.value)}
                      placeholder="e.g., 500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Percentage (if percentage)</Label>
                    <Input
                      type="number"
                      value={deduction.percentage}
                      onChange={(e) => handleArrayChange('components.deductions', index, 'percentage', e.target.value)}
                      placeholder="e.g., 11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={deduction.description}
                    onChange={(e) => handleArrayChange('components.deductions', index, 'description', e.target.value)}
                    placeholder="Description of the deduction"
                  />
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem('components.deductions', {
                name: '',
                type: 'fixed',
                amount: '',
                percentage: '',
                basedOn: 'basic',
                conditions: [''],
                description: ''
              })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Deduction
            </Button>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" asChild>
            <Link href="/hr/payroll/structures">Cancel</Link>
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
                Create Structure
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
