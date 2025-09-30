'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  FileText, 
  History, 
  Shield, 
  Heart, 
  Download, 
  Upload, 
  Plus,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  User,
  FileCheck,
  GraduationCap,
  Stethoscope,
  Building2
} from 'lucide-react';
import { Employee } from '@/lib/models/employee';
import { formatDate } from '@/lib/utils/date';

// Badge functionality now handled inline in getStatusBadge function

interface EmployeeDetailTabsProps {
  employee: Employee;
  onEdit?: () => void;
}

export default function EmployeeDetailTabs({ employee, onEdit }: EmployeeDetailTabsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Ensure all required fields exist with defaults
  const safeEmployee = {
    ...employee,
    employmentInfo: {
      ...safeEmployee.employmentInfo,
      employmentStatus: safeEmployee.employmentInfo?.employmentStatus || 'active',
      hireDate: safeEmployee.employmentInfo?.hireDate || new Date(),
      employmentHistory: safeEmployee.employmentInfo?.employmentHistory || []
    },
    documents: safeEmployee.documents || { 
      otherDocuments: [],
      resume: safeEmployee.documents?.resume,
      contract: safeEmployee.documents?.contract,
      idDocument: safeEmployee.documents?.idDocument,
      passport: safeEmployee.documents?.passport,
      workPermit: safeEmployee.documents?.workPermit,
      visa: safeEmployee.documents?.visa,
      healthInsurance: safeEmployee.documents?.healthInsurance,
      birthCertificate: safeEmployee.documents?.birthCertificate,
      marriageCertificate: safeEmployee.documents?.marriageCertificate
    },
    skills: safeEmployee.skills || { 
      technicalSkills: [], 
      softSkills: [], 
      certifications: [], 
      languages: [] 
    },
    performance: safeEmployee.performance || { 
      goals: [], 
      achievements: [] 
    },
    leave: safeEmployee.leave || { 
      totalLeaveDays: 21, 
      usedLeaveDays: 0, 
      remainingLeaveDays: 21, 
      leaveHistory: [] 
    },
    healthInsurance: safeEmployee.healthInsurance || {
      provider: 'Not specified',
      policyNumber: 'Not specified',
      coverageType: 'individual',
      startDate: new Date(),
      premium: {
        amount: 0,
        currency: 'EGP',
        frequency: 'monthly'
      },
      beneficiaries: [],
      medicalHistory: []
    },
    compliance: safeEmployee.compliance || {
      laborLawCompliance: {
        workPermitValid: false,
        visaValid: false,
        socialInsurance: false,
        taxRegistration: false
      },
      requiredDocuments: [],
      complianceChecks: [],
      trainingCompliance: []
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'valid': { className: 'bg-green-100 text-green-800 border-green-200' },
      'expired': { className: 'bg-red-100 text-red-800 border-red-200' },
      'missing': { className: 'bg-gray-100 text-gray-800 border-gray-200' },
      'pending-renewal': { className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'compliant': { className: 'bg-green-100 text-green-800 border-green-200' },
      'non-compliant': { className: 'bg-red-100 text-red-800 border-red-200' },
      'pending': { className: 'bg-yellow-100 text-yellow-800 border-yellow-200' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className}`}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </div>
    );
  };

  const getComplianceStatus = () => {
    const documents = safeEmployee.compliance?.requiredDocuments || [];
    const expired = documents.filter(d => d.status === 'expired').length;
    const missing = documents.filter(d => d.status === 'missing').length;
    const pending = documents.filter(d => d.status === 'pending-renewal').length;
    
    if (expired > 0 || missing > 0) return { status: 'non-compliant', count: expired + missing };
    if (pending > 0) return { status: 'pending', count: pending };
    return { status: 'compliant', count: 0 };
  };

  const complianceStatus = getComplianceStatus();

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="employment">Employment History</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="compliance">
            Compliance
            {complianceStatus.count > 0 && (
              <div className="ml-2 h-5 w-5 p-0 text-xs bg-red-100 text-red-800 border-red-200 border rounded-full flex items-center justify-center text-xs font-semibold">
                {complianceStatus.count}
              </div>
            )}
          </TabsTrigger>
          <TabsTrigger value="health">Health Insurance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="font-medium">
                      {safeEmployee.personalInfo.firstName} {safeEmployee.personalInfo.middleName} {safeEmployee.personalInfo.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Employee ID</label>
                    <p className="font-medium">{safeEmployee.employeeId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                    <p className="font-medium">{formatDate(safeEmployee.personalInfo.dateOfBirth)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nationality</label>
                    <p className="font-medium">{safeEmployee.personalInfo.nationality}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="font-medium">{safeEmployee.personalInfo.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="font-medium">{safeEmployee.personalInfo.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Current Employment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Position</label>
                    <p className="font-medium">{safeEmployee.employmentInfo.jobTitle}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Department</label>
                    <p className="font-medium">{safeEmployee.employmentInfo.departmentId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Hire Date</label>
                    <p className="font-medium">{formatDate(safeEmployee.employmentInfo.hireDate)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Employment Type</label>
                    <p className="font-medium capitalize">{safeEmployee.employmentInfo.employmentType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Work Location</label>
                    <p className="font-medium">{safeEmployee.employmentInfo.workLocation}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Salary</label>
                    <p className="font-medium">
                      {safeEmployee.employmentInfo.salary.baseSalary.toLocaleString()} {safeEmployee.employmentInfo.salary.currency}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Compliance Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                {getStatusBadge(complianceStatus.status)}
                <span className="text-sm text-muted-foreground">
                  {complianceStatus.count > 0 
                    ? `${complianceStatus.count} issue${complianceStatus.count > 1 ? 's' : ''} require attention`
                    : 'All compliance requirements met'
                  }
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Employment History Tab */}
        <TabsContent value="employment" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Employment History
                </CardTitle>
                <CardDescription>
                  Complete employment history within the organization
                </CardDescription>
              </div>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Position
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Position</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Reason for Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {safeEmployee.employmentInfo.employmentHistory?.map((history) => (
                    <TableRow key={history.id}>
                      <TableCell className="font-medium">{history.position}</TableCell>
                      <TableCell>{history.departmentId}</TableCell>
                      <TableCell>{formatDate(history.startDate)}</TableCell>
                      <TableCell>{history.endDate ? formatDate(history.endDate) : 'Current'}</TableCell>
                      <TableCell>
                        {history.salary.baseSalary.toLocaleString()} {history.salary.currency}
                      </TableCell>
                      <TableCell>{history.reasonForChange || '-'}</TableCell>
                    </TableRow>
                  )) || (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No employment history available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Document Management
                </CardTitle>
                <CardDescription>
                  Manage employee documents and certifications
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Required Documents */}
                <div className="space-y-4">
                  <h4 className="font-medium">Required Documents</h4>
                  <div className="space-y-3">
                    {safeEmployee.documents.contract && (
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileCheck className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">Employment Contract</p>
                            <p className="text-sm text-muted-foreground">Contract document</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    
                    {safeEmployee.documents.idDocument && (
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileCheck className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">ID Document</p>
                            <p className="text-sm text-muted-foreground">National ID</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {safeEmployee.documents.passport && (
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileCheck className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">Passport</p>
                            <p className="text-sm text-muted-foreground">Passport document</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {safeEmployee.documents.workPermit && (
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileCheck className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">Work Permit</p>
                            <p className="text-sm text-muted-foreground">Work authorization</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {safeEmployee.documents.visa && (
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileCheck className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">Visa</p>
                            <p className="text-sm text-muted-foreground">Visa document</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {safeEmployee.documents.healthInsurance && (
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileCheck className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">Health Insurance</p>
                            <p className="text-sm text-muted-foreground">Insurance policy</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Other Documents */}
                <div className="space-y-4">
                  <h4 className="font-medium">Other Documents</h4>
                  <div className="space-y-3">
                    {safeEmployee.documents.otherDocuments?.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {doc.type} • {doc.documentNumber && `#${doc.documentNumber}`}
                            </p>
                            {doc.expiryDate && (
                              <p className="text-xs text-muted-foreground">
                                Expires: {formatDate(doc.expiryDate)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(doc.status || 'valid')}
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )) || (
                      <p className="text-center text-muted-foreground py-4">
                        No additional documents
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Labor Law Compliance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Labor Law Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Work Permit</span>
                    <div className="flex items-center gap-2">
                      {safeEmployee.compliance?.laborLawCompliance?.workPermitValid ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      {safeEmployee.compliance?.laborLawCompliance?.workPermitExpiry && (
                        <span className="text-xs text-muted-foreground">
                          Expires: {formatDate(safeEmployee.compliance.laborLawCompliance.workPermitExpiry)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Visa Status</span>
                    <div className="flex items-center gap-2">
                      {safeEmployee.compliance?.laborLawCompliance?.visaValid ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      {safeEmployee.compliance?.laborLawCompliance?.visaExpiry && (
                        <span className="text-xs text-muted-foreground">
                          Expires: {formatDate(safeEmployee.compliance.laborLawCompliance.visaExpiry)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Social Insurance</span>
                    <div className="flex items-center gap-2">
                      {safeEmployee.compliance?.laborLawCompliance?.socialInsurance ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      {safeEmployee.compliance?.laborLawCompliance?.socialInsuranceNumber && (
                        <span className="text-xs text-muted-foreground">
                          #{safeEmployee.compliance.laborLawCompliance.socialInsuranceNumber}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tax Registration</span>
                    <div className="flex items-center gap-2">
                      {safeEmployee.compliance?.laborLawCompliance?.taxRegistration ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      {safeEmployee.compliance?.laborLawCompliance?.taxNumber && (
                        <span className="text-xs text-muted-foreground">
                          #{safeEmployee.compliance.laborLawCompliance.taxNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Required Documents Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5" />
                  Required Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {safeEmployee.compliance?.requiredDocuments?.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{doc.documentType}</p>
                        {doc.expiryDate && (
                          <p className="text-xs text-muted-foreground">
                            Expires: {formatDate(doc.expiryDate)}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(doc.status)}
                      </div>
                    </div>
                  )) || (
                    <p className="text-center text-muted-foreground py-4">
                      No compliance documents configured
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Compliance Checks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Compliance Checks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Check Type</TableHead>
                    <TableHead>Last Check</TableHead>
                    <TableHead>Next Check</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Checked By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {safeEmployee.compliance?.complianceChecks?.map((check) => (
                    <TableRow key={check.id}>
                      <TableCell className="font-medium">{check.checkType.replace('-', ' ')}</TableCell>
                      <TableCell>{formatDate(check.checkDate)}</TableCell>
                      <TableCell>{formatDate(check.nextCheckDate)}</TableCell>
                      <TableCell>{getStatusBadge(check.status)}</TableCell>
                      <TableCell>{check.checkedBy}</TableCell>
                    </TableRow>
                  )) || (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No compliance checks scheduled
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Training Compliance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Training Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Training Name</TableHead>
                    <TableHead>Completion Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Certificate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {safeEmployee.compliance?.trainingCompliance?.map((training) => (
                    <TableRow key={training.id}>
                      <TableCell className="font-medium">{training.trainingName}</TableCell>
                      <TableCell>{formatDate(training.completionDate)}</TableCell>
                      <TableCell>{training.expiryDate ? formatDate(training.expiryDate) : 'N/A'}</TableCell>
                      <TableCell>{getStatusBadge(training.status)}</TableCell>
                      <TableCell>
                        {training.certificate ? (
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        ) : (
                          <span className="text-muted-foreground">No certificate</span>
                        )}
                      </TableCell>
                    </TableRow>
                  )) || (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No training records
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Health Insurance Tab */}
        <TabsContent value="health" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Insurance Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Insurance Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Provider</label>
                    <p className="font-medium">{safeEmployee.healthInsurance?.provider || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Policy Number</label>
                    <p className="font-medium">{safeEmployee.healthInsurance?.policyNumber || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Coverage Type</label>
                    <p className="font-medium capitalize">{safeEmployee.healthInsurance?.coverageType || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Start Date</label>
                    <p className="font-medium">
                      {safeEmployee.healthInsurance?.startDate ? formatDate(safeEmployee.healthInsurance.startDate) : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">End Date</label>
                    <p className="font-medium">
                      {safeEmployee.healthInsurance?.endDate ? formatDate(safeEmployee.healthInsurance.endDate) : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Premium</label>
                    <p className="font-medium">
                      {safeEmployee.healthInsurance?.premium ? 
                        `${safeEmployee.healthInsurance.premium.amount} ${safeEmployee.healthInsurance.premium.currency}/${safeEmployee.healthInsurance.premium.frequency}` : 
                        'Not specified'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Beneficiaries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Beneficiaries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {safeEmployee.healthInsurance?.beneficiaries?.map((beneficiary, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{beneficiary.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {beneficiary.relationship} • Born: {formatDate(beneficiary.dateOfBirth)}
                        </p>
                      </div>
                      <div>
                        {beneficiary.covered ? (
                          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 border-green-200">
                            Covered
                          </div>
                        ) : (
                          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-800 border-gray-200">
                            Not Covered
                          </div>
                        )}
                      </div>
                    </div>
                  )) || (
                    <p className="text-center text-muted-foreground py-4">
                      No beneficiaries added
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Medical History */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Medical History
                </CardTitle>
                <CardDescription>
                  Track medical visits and treatments
                </CardDescription>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Record
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Covered</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {safeEmployee.healthInsurance?.medicalHistory?.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{formatDate(record.date)}</TableCell>
                      <TableCell className="capitalize">{record.type}</TableCell>
                      <TableCell>{record.description}</TableCell>
                      <TableCell>{record.provider}</TableCell>
                      <TableCell>
                        {record.cost ? `${record.cost} EGP` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {record.covered ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </TableCell>
                    </TableRow>
                  )) || (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No medical history records
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
