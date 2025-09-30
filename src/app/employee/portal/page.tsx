'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  FileText, 
  Calendar, 
  Bell, 
  Download, 
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Eye,
  Plus,
  Settings,
  CreditCard,
  CalendarDays,
  MessageSquare,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { EmployeeDashboard, PayslipRecord, LeaveRequestSummary, Announcement } from '@/lib/models/employee-portal';

export default function EmployeePortalPage() {
  const [dashboard, setDashboard] = useState<EmployeeDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockDashboard: EmployeeDashboard = {
        employeeId: 'EMP010',
        employeeName: 'Fatma Hassan',
        profile: {
          employeeId: 'EMP010',
          personalInfo: {
            firstName: 'Fatma',
            lastName: 'Hassan',
            email: 'fatma.hassan@oryxpro.com',
            phone: '+201234567890',
            dateOfBirth: new Date('1985-06-15'),
            gender: 'female',
            maritalStatus: 'married',
            nationality: 'Egyptian',
            nationalId: '28506151234567',
            emergencyContact: {
              name: 'Ahmed Hassan',
              relationship: 'Husband',
              phone: '+201234567891',
              email: 'ahmed.hassan@email.com'
            }
          },
          addressInfo: {
            currentAddress: {
              street: '123 Nile Street',
              city: 'Cairo',
              state: 'Cairo',
              postalCode: '11511',
              country: 'Egypt'
            }
          },
          employmentInfo: {
            employeeNumber: 'EMP010',
            position: 'Sales Manager',
            department: 'Sales',
            manager: 'Ahmed Mahmoud',
            hireDate: new Date('2022-03-01'),
            employmentType: 'full-time',
            employmentStatus: 'active',
            workLocation: 'Cairo Office',
            workSchedule: '9:00 AM - 5:00 PM',
            salaryStructure: 'Middle Management',
            benefits: ['Health Insurance', 'Life Insurance', 'Annual Bonus']
          },
          bankInfo: {
            bankName: 'National Bank of Egypt',
            accountNumber: '1234567890123456',
            accountHolderName: 'Fatma Hassan',
            branchCode: '001'
          },
          documents: {
            profilePicture: '/images/employees/fatma-hassan.jpg'
          },
          preferences: {
            language: 'en',
            timezone: 'Africa/Cairo',
            notificationSettings: {
              email: true,
              sms: false,
              push: true,
              announcements: true,
              payslips: true,
              leaveUpdates: true
            }
          },
          lastUpdated: new Date(),
          updatedBy: 'EMP010'
        },
        recentPayslips: [
          {
            payslipId: 'PSL002',
            employeeId: 'EMP010',
            employeeName: 'Fatma Hassan',
            payPeriod: {
              startDate: new Date('2024-12-01'),
              endDate: new Date('2024-12-31'),
              month: 12,
              year: 2024
            },
            basicSalary: 12000,
            allowances: [
              { name: 'Transportation', amount: 1500, taxable: true },
              { name: 'Housing', amount: 3000, taxable: false }
            ],
            deductions: [
              { name: 'Health Insurance', amount: 300, type: 'fixed' },
              { name: 'Social Insurance', amount: 1320, type: 'percentage' }
            ],
            overtime: { hours: 0, rate: 0, amount: 0 },
            bonuses: [],
            grossSalary: 15220,
            taxDeductions: {
              incomeTax: 0,
              socialInsurance: 1320,
              healthInsurance: 380,
              pension: 0,
              otherTaxes: 0,
              totalTaxes: 1700
            },
            netSalary: 13520,
            bankTransfer: {
              accountNumber: '1234567890123456',
              transferDate: new Date('2024-12-31'),
              transferAmount: 13520,
              reference: 'SAL202412',
              status: 'completed'
            },
            status: 'downloaded',
            generatedDate: new Date('2024-12-31'),
            sentDate: new Date('2024-12-31'),
            viewedDate: new Date('2025-01-01'),
            downloadedDate: new Date('2025-01-01'),
            payslipUrl: '/payslips/PSL002.pdf'
          }
        ],
        recentLeaveRequests: [
          {
            requestId: 'LR002',
            leaveTypeName: 'Sick Leave',
            leaveTypeCode: 'SICK',
            startDate: new Date('2025-01-10'),
            endDate: new Date('2025-01-11'),
            totalDays: 2,
            status: 'approved',
            priority: 'high',
            submittedDate: new Date('2024-12-18'),
            reason: 'Medical appointment and recovery',
            approvers: [{
              name: 'Ahmed Mahmoud',
              role: 'CEO',
              status: 'approved',
              actionDate: new Date('2024-12-19')
            }],
            currentApprover: undefined
          }
        ],
        recentAnnouncements: [
          {
            announcementId: 'ANN001',
            title: 'New Year Holiday Schedule',
            content: 'Please note the upcoming holidays for January 2025...',
            type: 'general',
            priority: 'medium',
            authorId: 'EMP009',
            authorName: 'Ahmed Mahmoud',
            authorRole: 'CEO',
            targetAudience: {
              allEmployees: true,
              departments: [],
              positions: [],
              employeeIds: []
            },
            attachments: [],
            isActive: true,
            publishDate: new Date('2024-12-20'),
            createdDate: new Date('2024-12-20'),
            lastModifiedDate: new Date('2024-12-20'),
            readBy: [],
            totalViews: 25,
            totalReads: 20
          }
        ],
        leaveBalances: [
          {
            leaveTypeId: 'LT001',
            leaveTypeName: 'Annual Leave',
            leaveTypeCode: 'ANNUAL',
            allocatedDays: 21,
            usedDays: 8,
            pendingDays: 2,
            availableDays: 12,
            carryForwardDays: 1,
            utilizationPercentage: 48
          },
          {
            leaveTypeId: 'LT002',
            leaveTypeName: 'Sick Leave',
            leaveTypeCode: 'SICK',
            allocatedDays: 10,
            usedDays: 1,
            pendingDays: 0,
            availableDays: 9,
            carryForwardDays: 0,
            utilizationPercentage: 10
          }
        ],
        upcomingHolidays: [
          {
            name: 'New Year\'s Day',
            date: new Date('2025-01-01'),
            type: 'national',
            isPublicHoliday: true
          },
          {
            name: 'Coptic Christmas',
            date: new Date('2025-01-07'),
            type: 'religious',
            isPublicHoliday: true
          }
        ],
        unreadAnnouncements: 2,
        pendingApprovals: 0,
        upcomingPayslips: 1,
        leaveReminders: 0,
        totalLeaveDaysUsed: 9,
        totalLeaveDaysRemaining: 21,
        nextPayrollDate: new Date('2025-01-31'),
        lastLoginDate: new Date(),
        lastUpdated: new Date()
      };
      
      setDashboard(mockDashboard);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { className: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <Clock className="h-3 w-3" /> },
      'approved': { className: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle className="h-3 w-3" /> },
      'rejected': { className: 'bg-red-100 text-red-800 border-red-200', icon: <AlertCircle className="h-3 w-3" /> },
      'downloaded': { className: 'bg-blue-100 text-blue-800 border-blue-200', icon: <Download className="h-3 w-3" /> }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <div className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your portal...</p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Unable to load portal</h3>
        <p className="text-muted-foreground">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employee Portal</h1>
          <p className="text-muted-foreground">
            Welcome back, {dashboard.employeeName}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/employee/profile">
              <Settings className="h-4 w-4 mr-2" />
              Profile Settings
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/employee/announcements">
              <Bell className="h-4 w-4 mr-2" />
              Announcements ({dashboard.unreadAnnouncements})
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leave Balance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.totalLeaveDaysRemaining}</div>
            <p className="text-xs text-muted-foreground">
              Days remaining this year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payroll</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDate(dashboard.nextPayrollDate)}</div>
            <p className="text-xs text-muted-foreground">
              Expected payment date
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.unreadAnnouncements}</div>
            <p className="text-xs text-muted-foreground">
              New announcements
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile & Quick Actions */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">{dashboard.profile.personalInfo.firstName} {dashboard.profile.personalInfo.lastName}</div>
                  <div className="text-sm text-muted-foreground">{dashboard.profile.employmentInfo.position}</div>
                  <div className="text-sm text-muted-foreground">{dashboard.profile.employmentInfo.department}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Employee ID:</span>
                  <span className="font-medium">{dashboard.employeeId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Hire Date:</span>
                  <span className="font-medium">{formatDate(dashboard.profile.employmentInfo.hireDate)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Manager:</span>
                  <span className="font-medium">{dashboard.profile.employmentInfo.manager}</span>
                </div>
              </div>
              
              <Button className="w-full" asChild>
                <Link href="/employee/profile">
                  <Settings className="h-4 w-4 mr-2" />
                  Update Profile
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/employee/leave/request">
                  <Calendar className="h-4 w-4 mr-2" />
                  Request Leave
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/employee/payslips">
                  <FileText className="h-4 w-4 mr-2" />
                  View Payslips
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/employee/documents">
                  <Download className="h-4 w-4 mr-2" />
                  My Documents
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/employee/announcements">
                  <Bell className="h-4 w-4 mr-2" />
                  Announcements
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Leave Balance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Leave Balance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dashboard.leaveBalances.map((balance) => (
                <div key={balance.leaveTypeId} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{balance.leaveTypeName}</span>
                    <span className="text-sm text-muted-foreground">{balance.availableDays}/{balance.allocatedDays}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        balance.utilizationPercentage >= 80 ? 'bg-red-500' :
                        balance.utilizationPercentage >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${balance.utilizationPercentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/employee/leave/balance">
                  View All Balances
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Payslips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Payslips
              </CardTitle>
              <CardDescription>
                Your latest salary statements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboard.recentPayslips.map((payslip) => (
                  <div key={payslip.payslipId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {payslip.payPeriod.month}/{payslip.payPeriod.year} Payslip
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(payslip.payPeriod.startDate)} - {formatDate(payslip.payPeriod.endDate)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-medium">{payslip.netSalary.toLocaleString()} EGP</div>
                        <div className="text-sm text-muted-foreground">Net Salary</div>
                      </div>
                      {getStatusBadge(payslip.status)}
                      <Button variant="outline" size="sm" asChild>
                        <Link href={payslip.payslipUrl} target="_blank">
                          <Download className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/employee/payslips">
                    View All Payslips
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Leave Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Leave Requests
              </CardTitle>
              <CardDescription>
                Your leave request history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboard.recentLeaveRequests.map((request) => (
                  <div key={request.requestId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{request.leaveTypeName}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(request.startDate)} - {formatDate(request.endDate)} ({request.totalDays} days)
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Submitted: {formatDate(request.submittedDate)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(request.status)}
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/employee/leave/requests/${request.requestId}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/employee/leave/requests">
                    View All Requests
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Announcements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Announcements
              </CardTitle>
              <CardDescription>
                Latest company updates and news
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboard.recentAnnouncements.map((announcement) => (
                  <div key={announcement.announcementId} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{announcement.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {announcement.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {announcement.content.substring(0, 100)}...
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>By {announcement.authorName}</span>
                          <span>{formatDate(announcement.publishDate)}</span>
                          <span>{announcement.totalViews} views</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/employee/announcements/${announcement.announcementId}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/employee/announcements">
                    View All Announcements
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
