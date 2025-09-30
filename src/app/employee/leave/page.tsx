'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Calendar, 
  Plus, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { LeaveRequestSummary, LeaveBalanceSummary } from '@/lib/models/employee-portal';

export default function EmployeeLeavePage() {
  const [requests, setRequests] = useState<LeaveRequestSummary[]>([]);
  const [balances, setBalances] = useState<LeaveBalanceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests');

  useEffect(() => {
    // Mock employee ID - in real app, this would come from auth context
    const employeeId = 'EMP009';
    fetchLeaveData(employeeId);
  }, []);

  const fetchLeaveData = async (employeeId: string) => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockRequests: LeaveRequestSummary[] = [
        {
          requestId: 'LR001',
          leaveTypeId: 'LT001',
          leaveTypeName: 'Annual Leave',
          startDate: new Date('2025-01-15'),
          endDate: new Date('2025-01-19'),
          totalDays: 5,
          reason: 'Family vacation to Sharm El Sheikh',
          status: 'pending',
          priority: 'medium',
          submittedDate: new Date('2024-12-20'),
          approvedBy: undefined,
          comments: undefined,
          isHalfDay: false
        },
        {
          requestId: 'LR002',
          leaveTypeId: 'LT002',
          leaveTypeName: 'Sick Leave',
          startDate: new Date('2024-12-10'),
          endDate: new Date('2024-12-11'),
          totalDays: 2,
          reason: 'Medical appointment and recovery',
          status: 'approved',
          priority: 'high',
          submittedDate: new Date('2024-12-08'),
          approvedDate: new Date('2024-12-09'),
          approvedBy: 'Ahmed Mahmoud',
          isHalfDay: false
        },
        {
          requestId: 'LR003',
          leaveTypeId: 'LT003',
          leaveTypeName: 'Personal Leave',
          startDate: new Date('2024-11-20'),
          endDate: new Date('2024-11-20'),
          totalDays: 1,
          reason: 'Wedding anniversary celebration',
          status: 'approved',
          priority: 'low',
          submittedDate: new Date('2024-11-18'),
          approvedDate: new Date('2024-11-19'),
          approvedBy: 'Fatma Hassan',
          isHalfDay: false
        }
      ];

      const mockBalances: LeaveBalanceSummary[] = [
        {
          leaveTypeId: 'LT001',
          leaveTypeName: 'Annual Leave',
          leaveTypeCode: 'ANNUAL',
          allocatedDays: 21,
          usedDays: 5,
          pendingDays: 3,
          availableDays: 13,
          carriedForwardDays: 2,
          utilizationPercentage: 38
        },
        {
          leaveTypeId: 'LT002',
          leaveTypeName: 'Sick Leave',
          leaveTypeCode: 'SICK',
          allocatedDays: 10,
          usedDays: 2,
          pendingDays: 0,
          availableDays: 8,
          carriedForwardDays: 0,
          utilizationPercentage: 20
        },
        {
          leaveTypeId: 'LT003',
          leaveTypeName: 'Personal Leave',
          leaveTypeCode: 'PERSONAL',
          allocatedDays: 5,
          usedDays: 1,
          pendingDays: 0,
          availableDays: 4,
          carriedForwardDays: 0,
          utilizationPercentage: 20
        }
      ];

      setRequests(mockRequests);
      setBalances(mockBalances);
    } catch (error) {
      console.error('Error fetching leave data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { 
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <Clock className="h-3 w-3" />
      },
      'approved': { 
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle className="h-3 w-3" />
      },
      'rejected': { 
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: <XCircle className="h-3 w-3" />
      },
      'cancelled': { 
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <XCircle className="h-3 w-3" />
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <div className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'low': { className: 'bg-blue-100 text-blue-800 border-blue-200' },
      'medium': { className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'high': { className: 'bg-orange-100 text-orange-800 border-orange-200' },
      'urgent': { className: 'bg-red-100 text-red-800 border-red-200' }
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;
    
    return (
      <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
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

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-orange-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading leave information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leave Management</h1>
          <p className="text-muted-foreground">
            Track your leave requests and balances
          </p>
        </div>
        <Button asChild>
          <Link href="/employee/leave/request">
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
            <p className="text-xs text-muted-foreground">
              All time requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {requests.filter(r => r.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Days</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {balances.reduce((sum, b) => sum + b.availableDays, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Days remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(balances.reduce((sum, b) => sum + b.utilizationPercentage, 0) / balances.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average usage
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests">Leave Requests</TabsTrigger>
          <TabsTrigger value="balances">Leave Balances</TabsTrigger>
        </TabsList>

        {/* Leave Requests Tab */}
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Leave Requests
              </CardTitle>
              <CardDescription>
                Your leave request history and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {requests.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No leave requests found</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't submitted any leave requests yet.
                  </p>
                  <Button asChild>
                    <Link href="/employee/leave/request">
                      <Plus className="h-4 w-4 mr-2" />
                      Submit Request
                    </Link>
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Leave Type</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.requestId}>
                        <TableCell>
                          <div className="font-medium">{request.leaveTypeName}</div>
                          <div className="text-sm text-muted-foreground">
                            {request.reason}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDate(request.startDate)} - {formatDate(request.endDate)}
                          </div>
                          {request.isHalfDay && (
                            <div className="text-xs text-muted-foreground">
                              Half day ({request.halfDayType})
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <span className="font-medium">{request.totalDays}</span>
                            <div className="text-xs text-muted-foreground">days</div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDate(request.submittedDate)}
                          </div>
                          {request.approvedBy && (
                            <div className="text-xs text-muted-foreground">
                              by {request.approvedBy}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/employee/leave/requests/${request.requestId}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leave Balances Tab */}
        <TabsContent value="balances">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Leave Balances
              </CardTitle>
              <CardDescription>
                Your current leave balances and utilization
              </CardDescription>
            </CardHeader>
            <CardContent>
              {balances.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No leave balances found</h3>
                  <p className="text-muted-foreground">
                    Contact HR to set up your leave entitlements.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {balances.map((balance) => (
                    <div key={balance.leaveTypeId} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium text-lg">{balance.leaveTypeName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {balance.leaveTypeCode} • {balance.allocatedDays} days allocated
                          </p>
                        </div>
                        <div className={`text-2xl font-bold ${getUtilizationColor(balance.utilizationPercentage)}`}>
                          {balance.utilizationPercentage}%
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{balance.availableDays}</div>
                          <div className="text-xs text-muted-foreground">Available</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">{balance.usedDays}</div>
                          <div className="text-xs text-muted-foreground">Used</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600">{balance.pendingDays}</div>
                          <div className="text-xs text-muted-foreground">Pending</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{balance.carriedForwardDays}</div>
                          <div className="text-xs text-muted-foreground">Carried Forward</div>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            balance.utilizationPercentage >= 90 ? 'bg-red-500' :
                            balance.utilizationPercentage >= 70 ? 'bg-orange-500' :
                            balance.utilizationPercentage >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(balance.utilizationPercentage, 100)}%` }}
                        ></div>
                      </div>
                      
                      {balance.expiresAt && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Expires: {formatDate(balance.expiresAt)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}