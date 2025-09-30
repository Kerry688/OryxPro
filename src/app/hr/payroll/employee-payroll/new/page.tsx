'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Save, 
  Users,
  Calendar,
  DollarSign,
  Plus,
  X,
  Calculator,
  TrendingUp,
  TrendingDown
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

interface SalaryStructure {
  structureId: string;
  name: string;
  basic: { amount: number; currency: string };
  allowances: Array<{
    name: string;
    type: string;
    amount?: number;
    percentage?: number;
    taxable: boolean;
  }>;
  deductions: Array<{
    name: string;
    type: string;
    amount?: number;
    percentage?: number;
  }>;
}

export default function NewEmployeePayrollPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [salaryStructures, setSalaryStructures] = useState<SalaryStructure[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedStructure, setSelectedStructure] = useState<SalaryStructure | null>(null);
  const [formData, setFormData] = useState({
    employeeId: '',
    payPeriod: {
      startDate: '',
      endDate: '',
      month: '',
      year: ''
    },
    overtime: {
      hours: 0,
      rate: 0,
      amount: 0
    },
    bonuses: [{
      name: '',
      amount: 0,
      type: 'performance',
      description: ''
    }],
    bankDetails: {
      accountNumber: '',
      bankName: '',
      branchCode: '',
      accountHolderName: ''
    },
    notes: ''
  });

  useEffect(() => {
    fetchEmployees();
    fetchSalaryStructures();
  }, []);

  useEffect(() => {
    if (selectedEmployee && selectedStructure) {
      setFormData(prev => ({
        ...prev,
        overtime: {
          ...prev.overtime,
          rate: selectedStructure.basic.amount / 160 // Hourly rate based on monthly salary
        }
      }));
    }
  }, [selectedEmployee, selectedStructure]);

  const fetchEmployees = async () => {
    try {
      // Mock employee data
      const mockEmployees: Employee[] = [
        {
          employeeId: 'EMP009',
          name: 'Ahmed Mahmoud',
          department: 'Executive',
          position: 'CEO',
          salaryStructure: 'SAL001',
          basicSalary: 20000
        },
        {
          employeeId: 'EMP010',
          name: 'Fatma Hassan',
          department: 'Sales',
          position: 'Sales Manager',
          salaryStructure: 'SAL002',
          basicSalary: 12000
        },
        {
          employeeId: 'EMP011',
          name: 'Mohamed Ali',
          department: 'Marketing',
          position: 'Marketing Specialist',
          salaryStructure: 'SAL003',
          basicSalary: 6000
        }
      ];
      setEmployees(mockEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchSalaryStructures = async () => {
    try {
      // Mock salary structure data
      const mockStructures: SalaryStructure[] = [
        {
          structureId: 'SAL001',
          name: 'Senior Management',
          basic: { amount: 20000, currency: 'EGP' },
          allowances: [
            { name: 'Transportation', type: 'fixed', amount: 2000, taxable: true },
            { name: 'Housing', type: 'fixed', amount: 5000, taxable: false }
          ],
          deductions: [
            { name: 'Health Insurance', type: 'fixed', amount: 500 },
            { name: 'Social Insurance', type: 'percentage', percentage: 11 }
          ]
        },
        {
          structureId: 'SAL002',
          name: 'Middle Management',
          basic: { amount: 12000, currency: 'EGP' },
          allowances: [
            { name: 'Transportation', type: 'fixed', amount: 1500, taxable: true },
            { name: 'Housing', type: 'fixed', amount: 3000, taxable: false }
          ],
          deductions: [
            { name: 'Health Insurance', type: 'fixed', amount: 300 },
            { name: 'Social Insurance', type: 'percentage', percentage: 11 }
          ]
        }
      ];
      setSalaryStructures(mockStructures);
    } catch (error) {
      console.error('Error fetching salary structures:', error);
    }
  };

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

  const handleEmployeeChange = (employeeId: string) => {
    const employee = employees.find(emp => emp.employeeId === employeeId);
    setSelectedEmployee(employee || null);
    setFormData(prev => ({ ...prev, employeeId }));
    
    if (employee) {
      const structure = salaryStructures.find(struct => struct.structureId === employee.salaryStructure);
      setSelectedStructure(structure || null);
    }
  };

  const handleBonusChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      bonuses: prev.bonuses.map((bonus, i) => 
        i === index ? { ...bonus, [field]: value } : bonus
      )
    }));
  };

  const addBonus = () => {
    setFormData(prev => ({
      ...prev,
      bonuses: [...prev.bonuses, {
        name: '',
        amount: 0,
        type: 'performance',
        description: ''
      }]
    }));
  };

  const removeBonus = (index: number) => {
    setFormData(prev => ({
      ...prev,
      bonuses: prev.bonuses.filter((_, i) => i !== index)
    }));
  };

  const calculatePayroll = () => {
    if (!selectedEmployee || !selectedStructure) return null;

    const basicSalary = selectedStructure.basic.amount;
    const allowancesTotal = selectedStructure.allowances.reduce((sum, allowance) => {
      if (allowance.type === 'fixed') {
        return sum + (allowance.amount || 0);
      } else if (allowance.type === 'percentage') {
        return sum + (basicSalary * (allowance.percentage || 0) / 100);
      }
      return sum;
    }, 0);

    const deductionsTotal = selectedStructure.deductions.reduce((sum, deduction) => {
      if (deduction.type === 'fixed') {
        return sum + (deduction.amount || 0);
      } else if (deduction.type === 'percentage') {
        return sum + (basicSalary * (deduction.percentage || 0) / 100);
      }
      return sum;
    }, 0);

    const overtimeAmount = formData.overtime.hours * formData.overtime.rate;
    const bonusesTotal = formData.bonuses.reduce((sum, bonus) => sum + bonus.amount, 0);

    const grossSalary = basicSalary + allowancesTotal + overtimeAmount + bonusesTotal - deductionsTotal;

    // Tax calculations (simplified)
    const taxRate = 0.15;
    const socialInsuranceRate = 0.11;
    const healthInsuranceRate = 0.025;

    const incomeTax = Math.max(0, (grossSalary - 9000) * taxRate); // Personal exemption
    const socialInsurance = Math.min(grossSalary * socialInsuranceRate, 15000);
    const healthInsurance = grossSalary * healthInsuranceRate;

    const totalTaxes = incomeTax + socialInsurance + healthInsurance;
    const netSalary = grossSalary - totalTaxes;

    return {
      basicSalary,
      allowances: selectedStructure.allowances,
      deductions: selectedStructure.deductions,
      allowancesTotal,
      deductionsTotal,
      overtimeAmount,
      bonusesTotal,
      grossSalary,
      incomeTax,
      socialInsurance,
      healthInsurance,
      totalTaxes,
      netSalary
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployee || !selectedStructure) {
      alert('Please select an employee and salary structure');
      return;
    }

    setLoading(true);

    try {
      const payrollCalculation = calculatePayroll();
      if (!payrollCalculation) return;

      const payrollData = {
        ...formData,
        payPeriod: {
          startDate: new Date(formData.payPeriod.startDate),
          endDate: new Date(formData.payPeriod.endDate),
          month: new Date(formData.payPeriod.startDate).getMonth() + 1,
          year: new Date(formData.payPeriod.startDate).getFullYear()
        },
        salaryStructureId: selectedStructure.structureId,
        basicSalary: payrollCalculation.basicSalary,
        allowances: payrollCalculation.allowances.map(allowance => ({
          id: `ALLOW_${Math.random().toString(36).substr(2, 9)}`,
          name: allowance.name,
          amount: allowance.type === 'fixed' ? (allowance.amount || 0) : 
                  (payrollCalculation.basicSalary * (allowance.percentage || 0) / 100),
          taxable: allowance.taxable,
          description: allowance.name
        })),
        deductions: payrollCalculation.deductions.map(deduction => ({
          id: `DED_${Math.random().toString(36).substr(2, 9)}`,
          name: deduction.name,
          amount: deduction.type === 'fixed' ? (deduction.amount || 0) : 
                  (payrollCalculation.basicSalary * (deduction.percentage || 0) / 100),
          description: deduction.name
        })),
        overtime: {
          hours: formData.overtime.hours,
          rate: formData.overtime.rate,
          amount: payrollCalculation.overtimeAmount
        },
        bonuses: formData.bonuses.filter(bonus => bonus.name.trim() !== '').map(bonus => ({
          id: `BONUS_${Math.random().toString(36).substr(2, 9)}`,
          ...bonus
        })),
        grossSalary: payrollCalculation.grossSalary,
        taxDeductions: {
          incomeTax: payrollCalculation.incomeTax,
          socialInsurance: payrollCalculation.socialInsurance,
          healthInsurance: payrollCalculation.healthInsurance,
          pension: 0,
          otherTaxes: 0,
          totalTaxes: payrollCalculation.totalTaxes
        },
        netSalary: payrollCalculation.netSalary
      };

      const response = await fetch('/api/hr/payroll/employee-payroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payrollData),
      });

      if (response.ok) {
        router.push('/hr/payroll/employee-payroll');
      } else {
        console.error('Failed to create employee payroll record');
      }
    } catch (error) {
      console.error('Error creating employee payroll record:', error);
    } finally {
      setLoading(false);
    }
  };

  const payrollCalculation = calculatePayroll();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/hr/payroll/employee-payroll">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Employee Payroll
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Employee Payroll</h1>
            <p className="text-muted-foreground">
              Create a payroll record for an individual employee
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Employee Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Employee Selection
                </CardTitle>
                <CardDescription>
                  Select the employee for this payroll record
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee *</Label>
                  <select
                    id="employeeId"
                    value={formData.employeeId}
                    onChange={(e) => handleEmployeeChange(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map((employee) => (
                      <option key={employee.employeeId} value={employee.employeeId}>
                        {employee.name} ({employee.employeeId}) - {employee.position}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedEmployee && (
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <h4 className="font-medium text-blue-900">{selectedEmployee.name}</h4>
                    <p className="text-sm text-blue-700">
                      {selectedEmployee.employeeId} • {selectedEmployee.department} • {selectedEmployee.position}
                    </p>
                    <p className="text-sm text-blue-700">
                      Salary Structure: {selectedStructure?.name || 'Loading...'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pay Period */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Pay Period
                </CardTitle>
                <CardDescription>
                  Define the pay period for this payroll record
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
              </CardContent>
            </Card>

            {/* Overtime */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Overtime
                </CardTitle>
                <CardDescription>
                  Record overtime hours and calculate overtime pay
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="overtimeHours">Overtime Hours</Label>
                    <Input
                      id="overtimeHours"
                      type="number"
                      value={formData.overtime.hours}
                      onChange={(e) => handleInputChange('overtime.hours', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="overtimeRate">Hourly Rate (EGP)</Label>
                    <Input
                      id="overtimeRate"
                      type="number"
                      value={formData.overtime.rate}
                      onChange={(e) => handleInputChange('overtime.rate', e.target.value)}
                      placeholder="0"
                      disabled
                    />
                  </div>
                </div>
                {payrollCalculation && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-green-800">Overtime Amount:</span>
                      <span className="font-medium text-green-900">
                        {payrollCalculation.overtimeAmount.toLocaleString()} EGP
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bonuses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Bonuses
                </CardTitle>
                <CardDescription>
                  Add performance bonuses and other incentives
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.bonuses.map((bonus, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Bonus {index + 1}</h4>
                      {formData.bonuses.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeBonus(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Bonus Name</Label>
                        <Input
                          value={bonus.name}
                          onChange={(e) => handleBonusChange(index, 'name', e.target.value)}
                          placeholder="e.g., Performance Bonus"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Amount (EGP)</Label>
                        <Input
                          type="number"
                          value={bonus.amount}
                          onChange={(e) => handleBonusChange(index, 'amount', e.target.value)}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input
                        value={bonus.description}
                        onChange={(e) => handleBonusChange(index, 'description', e.target.value)}
                        placeholder="Description of the bonus"
                      />
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addBonus}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Bonus
                </Button>
              </CardContent>
            </Card>

            {/* Bank Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Bank Details
                </CardTitle>
                <CardDescription>
                  Employee bank account information for salary transfer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      value={formData.bankDetails.accountNumber}
                      onChange={(e) => handleInputChange('bankDetails.accountNumber', e.target.value)}
                      placeholder="Account number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={formData.bankDetails.bankName}
                      onChange={(e) => handleInputChange('bankDetails.bankName', e.target.value)}
                      placeholder="Bank name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="branchCode">Branch Code</Label>
                    <Input
                      id="branchCode"
                      value={formData.bankDetails.branchCode}
                      onChange={(e) => handleInputChange('bankDetails.branchCode', e.target.value)}
                      placeholder="Branch code"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountHolderName">Account Holder Name</Label>
                    <Input
                      id="accountHolderName"
                      value={formData.bankDetails.accountHolderName}
                      onChange={(e) => handleInputChange('bankDetails.accountHolderName', e.target.value)}
                      placeholder="Account holder name"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Calculation Summary */}
          <div className="space-y-6">
            {payrollCalculation && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Payroll Calculation
                  </CardTitle>
                  <CardDescription>
                    Summary of salary calculations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Basic Salary:</span>
                      <span className="font-medium">{payrollCalculation.basicSalary.toLocaleString()} EGP</span>
                    </div>
                    
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-green-600">
                        <span>Allowances:</span>
                        <span>+{payrollCalculation.allowancesTotal.toLocaleString()} EGP</span>
                      </div>
                      {payrollCalculation.allowances.map((allowance, index) => (
                        <div key={index} className="ml-4 text-sm text-green-600">
                          • {allowance.name}: {allowance.type === 'fixed' ? 
                            (allowance.amount || 0).toLocaleString() : 
                            `${allowance.percentage}%`} EGP
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-3">
                      <div className="flex justify-between text-red-600">
                        <span>Deductions:</span>
                        <span>-{payrollCalculation.deductionsTotal.toLocaleString()} EGP</span>
                      </div>
                      {payrollCalculation.deductions.map((deduction, index) => (
                        <div key={index} className="ml-4 text-sm text-red-600">
                          • {deduction.name}: {deduction.type === 'fixed' ? 
                            (deduction.amount || 0).toLocaleString() : 
                            `${deduction.percentage}%`} EGP
                        </div>
                      ))}
                    </div>

                    {payrollCalculation.overtimeAmount > 0 && (
                      <div className="flex justify-between text-blue-600">
                        <span>Overtime:</span>
                        <span>+{payrollCalculation.overtimeAmount.toLocaleString()} EGP</span>
                      </div>
                    )}

                    {payrollCalculation.bonusesTotal > 0 && (
                      <div className="flex justify-between text-purple-600">
                        <span>Bonuses:</span>
                        <span>+{payrollCalculation.bonusesTotal.toLocaleString()} EGP</span>
                      </div>
                    )}

                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Gross Salary:</span>
                        <span className="font-medium">{payrollCalculation.grossSalary.toLocaleString()} EGP</span>
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <div className="flex justify-between text-red-600">
                        <span>Taxes:</span>
                        <span>-{payrollCalculation.totalTaxes.toLocaleString()} EGP</span>
                      </div>
                      <div className="ml-4 text-sm text-red-600">
                        • Income Tax: {payrollCalculation.incomeTax.toLocaleString()} EGP
                      </div>
                      <div className="ml-4 text-sm text-red-600">
                        • Social Insurance: {payrollCalculation.socialInsurance.toLocaleString()} EGP
                      </div>
                      <div className="ml-4 text-sm text-red-600">
                        • Health Insurance: {payrollCalculation.healthInsurance.toLocaleString()} EGP
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="font-bold text-green-600">Net Salary:</span>
                        <span className="font-bold text-green-600">{payrollCalculation.netSalary.toLocaleString()} EGP</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" asChild>
            <Link href="/hr/payroll/employee-payroll">Cancel</Link>
          </Button>
          <Button type="submit" disabled={loading || !selectedEmployee || !selectedStructure}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Payroll Record
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
