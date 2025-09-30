'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  AlertTriangle,
  CheckSquare
} from 'lucide-react';
import Link from 'next/link';
import { LeaveRequest } from '@/lib/models/leave';

export default function LeaveRequestsPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');

  useEffect(() => {
    fetchRequests();
  }, [searchQuery, statusFilter, priorityFilter, employeeFilter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockRequests: LeaveRequest[] = [
        {
          requestId: 'LR001',
          employeeId: 'EMP009',
          employeeName: 'Ahmed Mahmoud',
          leaveTypeId: 'LT001',
          leaveTypeName: 'Annual Leave',
          leaveTypeCode: 'ANNUAL',
          startDate: new Date('2025-01-15'),
          endDate: new Date('2025-01-19'),
          totalDays: 5,
          reason: 'Family vacation',
          status: 'pending',
          priority: 'medium',
          isHalfDay: false,
          submittedDate: new Date('2024-12-20'),
          lastModifiedDate: new Date('2024-12-20'),
          submittedBy: 'EMP009',
          approvalWorkflow: {
            approvers: [{
              approverId: 'EMP009',
              approverName: 'Ahmed Mahmoud',
              approverRole: 'CEO',
              department: 'Executive',
              level: 1,
              status: 'pending',
              isRequired: true
            }],
            currentLevel: 1,
            isCompleted: false
          },
          comments: [],
          createdAt: new Date('2024-12-20'),
          updatedAt: new Date('2024-12-20'),
          createdBy: 'EMP009',
          updatedBy: 'EMP009'
        },
        {
          requestId: 'LR002',
          employeeId: 'EMP010',
          employeeName: 'Fatma Hassan',
          leaveTypeId: 'LT002',
          leaveTypeName: 'Sick Leave',
          leaveTypeCode: 'SICK',
          startDate: new Date('2025-01-10'),
          endDate: new Date('2025-01-11'),
          totalDays: 2,
          reason: 'Medical appointment',
          status: 'approved',
          priority: 'high',
          isHalfDay: false,
          submittedDate: new Date('2024-12-18'),
          lastModifiedDate: new Date('2024-12-19'),
          submittedBy: 'EMP010',
          approvalWorkflow: {
            approvers: [{
              approverId: 'EMP009',
              approverName: 'Ahmed Mahmoud',
              approverRole: 'CEO',
              department: 'Executive',
              level: 1,
              status: 'approved',
              actionDate: new Date('2024-12-19'),
              isRequired: true
            }],
            currentLevel: 1,
            isCompleted: true,
            completedDate: new Date('2024-12-19')
          },
          comments: [],
          createdAt: new Date('2024-12-18'),
          updatedAt: new Date('2024-12-19'),
          createdBy: 'EMP010',
          updatedBy: 'EMP009'
        }
      ];

      // Apply filters
      let filteredRequests = mockRequests;
      
      if (searchQuery) {
        filteredRequests = filteredRequests.filter(req => 
          req.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          req.leaveTypeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          req.reason.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (statusFilter) {
        filteredRequests = filteredRequests.filter(req => req.status === statusFilter);
      }
      
      if (priorityFilter) {
        filteredRequests = filteredRequests.filter(req => req.priority === priorityFilter);
      }
      
      if (employeeFilter) {
        filteredRequests = filteredRequests.filter(req => 
          req.employeeId.toLowerCase().includes(employeeFilter.toLowerCase())
        );
      }

      setRequests(filteredRequests);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading leave requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leave Requests</h1>
          <p className="text-muted-foreground">
            Manage and approve employee leave requests
          </p>
        </div>
        <Button asChild>
          <Link href="/hr/leave/requests/new">
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>

            <Input
              placeholder="Employee ID"
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Leave Requests ({requests.length})
          </CardTitle>
          <CardDescription>
            All leave requests and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No leave requests found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first leave request.
              </p>
              <Button asChild>
                <Link href="/hr/leave/requests/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Request
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.requestId}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.employeeName}</div>
                        <div className="text-sm text-muted-foreground">
                          {request.employeeId}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: '#3B82F6' }}></div>
                        <span>{request.leaveTypeName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm">
                            {formatDate(request.startDate)} - {formatDate(request.endDate)}
                          </div>
                          {request.isHalfDay && (
                            <div className="text-xs text-muted-foreground">
                              Half day ({request.halfDayType})
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <span className="font-medium">{request.totalDays}</span>
                        <div className="text-xs text-muted-foreground">days</div>
                      </div>
                    </TableCell>
                    <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {formatDate(request.submittedDate)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/hr/leave/requests/${request.requestId}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        {request.status === 'pending' && (
                          <>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/hr/leave/requests/${request.requestId}/approve`}>
                                <CheckCircle className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/hr/leave/requests/${request.requestId}/reject`}>
                                <XCircle className="h-4 w-4" />
                              </Link>
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {requests.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requests.length}</div>
              <p className="text-xs text-muted-foreground">
                All requests
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
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {requests.filter(r => r.status === 'approved').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Successfully approved
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {requests.filter(r => r.status === 'rejected').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Rejected requests
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
