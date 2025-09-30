'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Save, 
  Send,
  User,
  Calendar,
  FileText,
  AlertTriangle,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { CreateSeparationRequestDTO } from '@/lib/models/separation';

export default function NewSeparationRequestPage() {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [formData, setFormData] = useState<CreateSeparationRequestDTO>({
    employeeId: '',
    separationType: 'resignation',
    separationReason: '',
    lastWorkingDate: new Date(),
    noticePeriodDays: 30,
    resignationReason: '',
    terminationReason: ''
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      // Mock employees data
      const mockEmployees = [
        { employeeId: 'EMP001', name: 'Ahmed Mahmoud', position: 'CEO', department: 'Executive' },
        { employeeId: 'EMP002', name: 'Fatma Hassan', position: 'HR Manager', department: 'Human Resources' },
        { employeeId: 'EMP003', name: 'Youssef El Abbasi', position: 'IT Specialist', department: 'IT' },
        { employeeId: 'EMP004', name: 'Mariam Hassan', position: 'Sales Manager', department: 'Sales' },
        { employeeId: 'EMP005', name: 'Omar Farouk', position: 'Marketing Manager', department: 'Marketing' }
      ];
      setEmployees(mockEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleInputChange = (field: keyof CreateSeparationRequestDTO, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (status: 'draft' | 'submit') => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/hr/separation/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          status: status
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        if (status === 'submit') {
          alert('Separation request submitted successfully!');
        } else {
          alert('Separation request saved as draft!');
        }
        // Use window.location for navigation to avoid router issues
        window.location.href = '/hr/separation';
      } else {
        alert('Failed to create separation request: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating separation request:', error);
      alert('Failed to create separation request');
    } finally {
      setLoading(false);
    }
  };

  const selectedEmployee = employees.find(emp => emp.employeeId === formData.employeeId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/hr/separation">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Separations
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">New Separation Request</h1>
            <p className="text-muted-foreground">
              Create a new employee separation request
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSubmit('draft')} disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </>
            )}
          </Button>
          <Button onClick={() => handleSubmit('submit')} disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Request
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Employee Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Employee Information
              </CardTitle>
              <CardDescription>
                Select the employee for separation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee</Label>
                <select
                  id="employeeId"
                  value={formData.employeeId}
                  onChange={(e) => handleInputChange('employeeId', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((employee) => (
                    <option key={employee.employeeId} value={employee.employeeId}>
                      {employee.name} - {employee.position} ({employee.department})
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedEmployee && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Selected Employee</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Name:</span>
                      <span className="ml-2 font-medium">{selectedEmployee.name}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Position:</span>
                      <span className="ml-2 font-medium">{selectedEmployee.position}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Department:</span>
                      <span className="ml-2 font-medium">{selectedEmployee.department}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Employee ID:</span>
                      <span className="ml-2 font-medium">{selectedEmployee.employeeId}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Separation Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Separation Details
              </CardTitle>
              <CardDescription>
                Provide separation type and reason
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="separationType">Separation Type</Label>
                  <select
                    id="separationType"
                    value={formData.separationType}
                    onChange={(e) => handleInputChange('separationType', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="resignation">Resignation</option>
                    <option value="termination">Termination</option>
                    <option value="retirement">Retirement</option>
                    <option value="end_of_contract">End of Contract</option>
                    <option value="redundancy">Redundancy</option>
                    <option value="mutual_agreement">Mutual Agreement</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="noticePeriodDays">Notice Period (Days)</Label>
                  <Input
                    id="noticePeriodDays"
                    type="number"
                    value={formData.noticePeriodDays}
                    onChange={(e) => handleInputChange('noticePeriodDays', parseInt(e.target.value) || 30)}
                    min="1"
                    max="365"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="separationReason">Separation Reason</Label>
                <Textarea
                  id="separationReason"
                  value={formData.separationReason}
                  onChange={(e) => handleInputChange('separationReason', e.target.value)}
                  placeholder="Provide a detailed reason for the separation..."
                  rows={4}
                  required
                />
              </div>

              {formData.separationType === 'resignation' && (
                <div className="space-y-2">
                  <Label htmlFor="resignationReason">Specific Resignation Reason</Label>
                  <select
                    id="resignationReason"
                    value={formData.resignationReason}
                    onChange={(e) => handleInputChange('resignationReason', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select reason</option>
                    <option value="better_opportunity">Better Opportunity</option>
                    <option value="career_change">Career Change</option>
                    <option value="personal_reasons">Personal Reasons</option>
                    <option value="relocation">Relocation</option>
                    <option value="family_commitments">Family Commitments</option>
                    <option value="health_reasons">Health Reasons</option>
                    <option value="work_environment">Work Environment</option>
                    <option value="compensation">Compensation</option>
                    <option value="management_issues">Management Issues</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              )}

              {formData.separationType === 'termination' && (
                <div className="space-y-2">
                  <Label htmlFor="terminationReason">Specific Termination Reason</Label>
                  <select
                    id="terminationReason"
                    value={formData.terminationReason}
                    onChange={(e) => handleInputChange('terminationReason', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select reason</option>
                    <option value="performance">Performance Issues</option>
                    <option value="misconduct">Misconduct</option>
                    <option value="violation_of_policy">Policy Violation</option>
                    <option value="attendance">Attendance Issues</option>
                    <option value="behavioral">Behavioral Issues</option>
                    <option value="probation_failure">Probation Failure</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Important Dates
              </CardTitle>
              <CardDescription>
                Set separation and notice period dates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lastWorkingDate">Last Working Date</Label>
                <Input
                  id="lastWorkingDate"
                  type="date"
                  value={formData.lastWorkingDate ? new Date(formData.lastWorkingDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleInputChange('lastWorkingDate', new Date(e.target.value))}
                  required
                />
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Notice Period Calculation</span>
                </div>
                <div className="text-sm text-yellow-700">
                  <p>Notice period will start from today and end {formData.noticePeriodDays} days later.</p>
                  <p className="mt-1">
                    <strong>Notice Period:</strong> {new Date().toLocaleDateString()} to{' '}
                    {new Date(Date.now() + formData.noticePeriodDays * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Process Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Process Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Manager Review</h4>
                    <p className="text-xs text-muted-foreground">
                      Direct manager will review and approve the request
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">HR Review</h4>
                    <p className="text-xs text-muted-foreground">
                      HR team will process the separation request
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Exit Interview</h4>
                    <p className="text-xs text-muted-foreground">
                      Schedule and conduct exit interview
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Clearance Process</h4>
                    <p className="text-xs text-muted-foreground">
                      Complete clearance checklist and final settlement
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Important Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Ensure all required information is provided before submission</p>
                <p>• The employee will be notified once the request is approved</p>
                <p>• Exit interview and clearance process will be initiated automatically</p>
                <p>• Final settlement will be calculated based on company policies</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
