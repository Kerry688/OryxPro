'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowLeft, 
  Save, 
  Calculator,
  Calendar,
  Users,
  DollarSign,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

interface Employee {
  employeeId: string;
  name: string;
  department: string;
  position: string;
  salaryStructure: string;
  basicSalary: number;
}

export default function NewPayrollBatchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    payPeriod: {
      startDate: '',
      endDate: '',
      month: '',
      year: ''
    },
    options: {
      generatePayslips: true,
      processBankTransfer: true,
      sendNotifications: true
    }
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      // Mock employee data
      const mockEmployees: Employee[] = [
        {
          employeeId: 'EMP009',
          name: 'Ahmed Mahmoud',
          department: 'Executive',
          position: 'CEO',
          salaryStructure: 'Senior Management',
          basicSalary: 20000
        },
        {
          employeeId: 'EMP010',
          name: 'Fatma Hassan',
          department: 'Sales',
          position: 'Sales Manager',
          salaryStructure: 'Middle Management',
          basicSalary: 12000
        },
        {
          employeeId: 'EMP011',
          name: 'Mohamed Ali',
          department: 'Marketing',
          position: 'Marketing Specialist',
          salaryStructure: 'Junior Staff',
          basicSalary: 6000
        },
        {
          employeeId: 'EMP012',
          name: 'Nora El Sharif',
          department: 'HR',
          position: 'HR Manager',
          salaryStructure: 'Middle Management',
          basicSalary: 12000
        },
        {
          employeeId: 'EMP013',
          name: 'Youssef El Abbasi',
          department: 'IT',
          position: 'IT Specialist',
          salaryStructure: 'Junior Staff',
          basicSalary: 6000
        }
      ];
      setEmployees(mockEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleEmployeeSelection = (employeeId: string, checked: boolean) => {
    if (checked) {
      setSelectedEmployees(prev => [...prev, employeeId]);
    } else {
      setSelectedEmployees(prev => prev.filter(id => id !== employeeId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(employees.map(emp => emp.employeeId));
    } else {
      setSelectedEmployees([]);
    }
  };

  const calculateTotals = () => {
    const selectedEmpData = employees.filter(emp => selectedEmployees.includes(emp.employeeId));
    const totalGrossSalary = selectedEmpData.reduce((sum, emp) => sum + emp.basicSalary, 0);
    const estimatedNetSalary = totalGrossSalary * 0.8; // Rough estimate
    const estimatedTaxes = totalGrossSalary * 0.2;
    
    return {
      totalEmployees: selectedEmpData.length,
      totalGrossSalary,
      estimatedNetSalary,
      estimatedTaxes
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedEmployees.length === 0) {
      alert('Please select at least one employee');
      return;
    }

    setLoading(true);

    try {
      const startDate = new Date(formData.payPeriod.startDate);
      const endDate = new Date(formData.payPeriod.endDate);
      
      const batchData = {
        ...formData,
        payPeriod: {
          startDate,
          endDate,
          month: startDate.getMonth() + 1,
          year: startDate.getFullYear()
        },
        employeeIds: selectedEmployees
      };

      const response = await fetch('/api/hr/payroll/batches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batchData),
      });

      if (response.ok) {
        router.push('/hr/payroll/batches');
      } else {
        console.error('Failed to create payroll batch');
      }
    } catch (error) {
      console.error('Error creating payroll batch:', error);
    } finally {
      setLoading(false);
    }
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/hr/payroll/batches">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Batches
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Payroll Batch</h1>
            <p className="text-muted-foreground">
              Create a new payroll batch for processing employee salaries
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Batch Information
                </CardTitle>
                <CardDescription>
                  Enter the basic details of the payroll batch
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Batch Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., December 2024 Payroll"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="month">Pay Period Month *</Label>
                    <select
                      id="month"
                      value={formData.payPeriod.month}
                      onChange={(e) => handleInputChange('payPeriod.month', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">Select Month</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                        <option key={month} value={month}>
                          {new Date(2024, month - 1).toLocaleString('default', { month: 'long' })}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Pay Period Year *</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.payPeriod.year}
                      onChange={(e) => handleInputChange('payPeriod.year', e.target.value)}
                      placeholder="e.g., 2024"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.payPeriod.startDate}
                      onChange={(e) => handleInputChange('payPeriod.startDate', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.payPeriod.endDate}
                    onChange={(e) => handleInputChange('payPeriod.endDate', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Optional description for this payroll batch..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Employee Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Employee Selection
                </CardTitle>
                <CardDescription>
                  Select employees to include in this payroll batch
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="selectAll"
                      checked={selectedEmployees.length === employees.length}
                      onCheckedChange={handleSelectAll}
                    />
                    <Label htmlFor="selectAll" className="font-medium">
                      Select All Employees ({employees.length})
                    </Label>
                  </div>

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {employees.map((employee) => (
                      <div key={employee.employeeId} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Checkbox
                          id={employee.employeeId}
                          checked={selectedEmployees.includes(employee.employeeId)}
                          onCheckedChange={(checked) => handleEmployeeSelection(employee.employeeId, checked as boolean)}
                        />
                        <div className="flex-1">
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {employee.employeeId} • {employee.department} • {employee.position}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {employee.salaryStructure} • {employee.basicSalary.toLocaleString()} EGP
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Processing Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Processing Options
                </CardTitle>
                <CardDescription>
                  Configure what should be processed with this batch
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="generatePayslips"
                    checked={formData.options.generatePayslips}
                    onCheckedChange={(checked) => handleInputChange('options.generatePayslips', checked)}
                  />
                  <Label htmlFor="generatePayslips">Generate Payslips</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="processBankTransfer"
                    checked={formData.options.processBankTransfer}
                    onCheckedChange={(checked) => handleInputChange('options.processBankTransfer', checked)}
                  />
                  <Label htmlFor="processBankTransfer">Process Bank Transfer</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sendNotifications"
                    checked={formData.options.sendNotifications}
                    onCheckedChange={(checked) => handleInputChange('options.sendNotifications', checked)}
                  />
                  <Label htmlFor="sendNotifications">Send Email Notifications</Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Batch Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Batch Summary
                </CardTitle>
                <CardDescription>
                  Overview of the payroll batch
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Selected Employees:</span>
                    <span className="font-medium">{totals.totalEmployees}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Gross Salary:</span>
                    <span className="font-medium">{totals.totalGrossSalary.toLocaleString()} EGP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Taxes:</span>
                    <span className="font-medium text-red-600">{totals.estimatedTaxes.toLocaleString()} EGP</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="font-medium">Estimated Net Salary:</span>
                    <span className="font-bold text-green-600">{totals.estimatedNetSalary.toLocaleString()} EGP</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pay Period Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Pay Period
                </CardTitle>
              </CardHeader>
              <CardContent>
                {formData.payPeriod.startDate && formData.payPeriod.endDate ? (
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Start:</span> {new Date(formData.payPeriod.startDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">End:</span> {new Date(formData.payPeriod.endDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Duration: {Math.ceil((new Date(formData.payPeriod.endDate).getTime() - new Date(formData.payPeriod.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Select pay period dates
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Warnings */}
            {selectedEmployees.length === 0 && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">No employees selected</span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    Please select at least one employee to create the batch.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" asChild>
            <Link href="/hr/payroll/batches">Cancel</Link>
          </Button>
          <Button type="submit" disabled={loading || selectedEmployees.length === 0}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Batch
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
