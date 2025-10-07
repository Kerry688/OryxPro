'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  DollarSign,
  CheckCircle,
  UserPlus,
  Shield,
  Monitor
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Employee } from '@/lib/models/employee';
import Link from 'next/link';
import { formatDate } from '@/lib/utils/date';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Portal invitation state
  const [invitationDialogOpen, setInvitationDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedPortal, setSelectedPortal] = useState('');
  const [invitationMessage, setInvitationMessage] = useState('');
  const [sendingInvitation, setSendingInvitation] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchEmployees();
  }, [currentPage, searchQuery, departmentFilter, statusFilter]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/hr/employees');
      const data = await response.json();

      if (data.success) {
        // Add default values for missing fields
        const employeesWithDefaults = data.data.map((emp: any) => ({
          ...emp,
          employmentInfo: {
            ...emp.employmentInfo,
            employmentStatus: emp.employmentInfo?.employmentStatus || 'active',
            hireDate: emp.employmentInfo?.hireDate || new Date(),
            employmentHistory: emp.employmentInfo?.employmentHistory || []
          },
          documents: emp.documents || { 
            otherDocuments: [],
            resume: emp.documents?.resume,
            contract: emp.documents?.contract,
            idDocument: emp.documents?.idDocument,
            passport: emp.documents?.passport,
            workPermit: emp.documents?.workPermit,
            visa: emp.documents?.visa,
            healthInsurance: emp.documents?.healthInsurance,
            birthCertificate: emp.documents?.birthCertificate,
            marriageCertificate: emp.documents?.marriageCertificate
          },
          skills: emp.skills || { 
            technicalSkills: [], 
            softSkills: [], 
            certifications: [], 
            languages: [] 
          },
          performance: emp.performance || { 
            goals: [], 
            achievements: [] 
          },
          leave: emp.leave || { 
            totalLeaveDays: 21, 
            usedLeaveDays: 0, 
            remainingLeaveDays: 21, 
            leaveHistory: [] 
          },
          healthInsurance: emp.healthInsurance || {
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
          compliance: emp.compliance || {
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
        }));
        setEmployees(employeesWithDefaults);
        setTotalPages(data.pagination?.pages || 1);
      } else {
        console.error('Error fetching employees:', data.error);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      inactive: { variant: 'secondary' as const, className: 'bg-gray-100 text-gray-800' },
      terminated: { variant: 'destructive' as const, className: 'bg-red-100 text-red-800' },
      'on-leave': { variant: 'outline' as const, className: 'bg-yellow-100 text-yellow-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </Badge>
    );
  };

  const getEmploymentTypeBadge = (type: string) => {
    return (
      <Badge variant="outline">
        {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
      </Badge>
    );
  };

  // Portal invitation functions
  const handleSendInvitation = async (employee: Employee) => {
    setSelectedEmployee(employee);
    setInvitationDialogOpen(true);
    setSelectedPortal('employee_portal'); // Auto-set to employee portal
    setInvitationMessage(`Hello ${employee.personalInfo.firstName},\n\nWe're excited to invite you to join our employee portal where you can access your personal information, payslips, leave requests, and more.\n\nPlease use your employee credentials to log in.\n\nBest regards,\nHR Team`);
  };

  const handleSubmitInvitation = async () => {
    if (!selectedEmployee) {
      alert('Employee information is missing');
      return;
    }

    // Always use employee portal with employee role
    const portal = 'employee_portal';
    const role = 'employee';

    setSendingInvitation(true);
    try {
      const response = await fetch('/api/users/send-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: selectedEmployee.personalInfo.email,
          firstName: selectedEmployee.personalInfo.firstName,
          lastName: selectedEmployee.personalInfo.lastName,
          portal: portal,
          role: role,
          employeeId: selectedEmployee.employeeId,
          message: invitationMessage
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Invitation sent successfully!');
        setInvitationDialogOpen(false);
        setSelectedEmployee(null);
        setSelectedPortal('');
        setInvitationMessage('');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('Failed to send invitation. Please try again.');
    } finally {
      setSendingInvitation(false);
    }
  };

  const getPortalAccessBadge = (employee: Employee) => {
    // Check if employee has portal access (this would come from user data)
    // For now, we'll show a default state
    const hasAccess = false; // This would be determined by checking if user exists
    
    if (hasAccess) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <Shield className="w-3 h-3 mr-1" />
          Has Access
        </Badge>
      );
    }
    
    return (
      <Badge variant="secondary" className="bg-gray-100 text-gray-600">
        <UserPlus className="w-3 h-3 mr-1" />
        No Access
      </Badge>
    );
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = searchQuery === '' || 
      employee.personalInfo.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.personalInfo.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.personalInfo.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.employmentInfo.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment = departmentFilter === '' || departmentFilter === 'all' || 
      employee.employmentInfo.departmentId === departmentFilter;

    const matchesStatus = statusFilter === '' || statusFilter === 'all' || 
      employee.employmentInfo.employmentStatus === statusFilter;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Employees</h1>
          <p className="text-muted-foreground">Manage your workforce</p>
        </div>
        <Button asChild>
          <Link href="/hr/employees/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {employees.filter(e => e.employmentInfo.employmentStatus === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {employees.filter(e => e.employmentInfo.employmentStatus === 'on-leave').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(employees.map(e => e.employmentInfo.departmentId)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
          <CardDescription>Search and filter your employees</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="DEP001">Engineering</SelectItem>
                <SelectItem value="DEP002">Marketing</SelectItem>
                <SelectItem value="DEP003">Sales</SelectItem>
                <SelectItem value="DEP004">HR</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Employees Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Hire Date</TableHead>
                  <TableHead>Portal Access</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.employeeId}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {employee.personalInfo.firstName[0]}{employee.personalInfo.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">
                            {employee.personalInfo.firstName} {employee.personalInfo.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">{employee.personalInfo.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{employee.employmentInfo.jobTitle}</div>
                        <div className="text-sm text-muted-foreground">{employee.employmentInfo.position}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span>Department {employee.employmentInfo.departmentId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(employee.employmentInfo.employmentStatus)}
                    </TableCell>
                    <TableCell>
                      {getEmploymentTypeBadge(employee.employmentInfo.employmentType)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(employee.employmentInfo.hireDate)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getPortalAccessBadge(employee)}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendInvitation(employee)}
                          className="h-6 px-2 text-xs"
                        >
                          <UserPlus className="w-3 h-3 mr-1" />
                          Send Invite
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/hr/employees/${employee.employeeId}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/hr/employees/${employee.employeeId}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredEmployees.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No employees found</h3>
              <p className="text-muted-foreground">
                {searchQuery || departmentFilter || statusFilter 
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first employee'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Portal Invitation Dialog */}
      <Dialog open={invitationDialogOpen} onOpenChange={setInvitationDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5" />
              <span>Send Portal Invitation</span>
            </DialogTitle>
            <DialogDescription>
              Send a portal access invitation to {selectedEmployee?.personalInfo.firstName} {selectedEmployee?.personalInfo.lastName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="portal">Portal Access</Label>
              <div className="flex items-center justify-center p-4 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50">
                <div className="text-center">
                  <Monitor className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-blue-900">Employee Portal</h3>
                  <p className="text-sm text-blue-700">Self-service portal with employee role</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Invitation will grant access to employee self-service portal
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Invitation Message</Label>
              <Textarea
                id="message"
                value={invitationMessage}
                onChange={(e) => setInvitationMessage(e.target.value)}
                className="min-h-[120px]"
                placeholder="Enter your invitation message..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setInvitationDialogOpen(false)}
              disabled={sendingInvitation}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitInvitation}
              disabled={sendingInvitation}
            >
              {sendingInvitation ? 'Sending...' : 'Send Invitation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
