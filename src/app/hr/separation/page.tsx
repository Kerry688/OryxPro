'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserX, 
  FileText, 
  CheckSquare, 
  BarChart3, 
  Plus,
  Eye,
  Edit,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  Building2,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { SeparationRequest, SeparationAnalytics } from '@/lib/models/separation';

export default function SeparationOffboardingPage() {
  const [separationRequests, setSeparationRequests] = useState<SeparationRequest[]>([]);
  const [analytics, setAnalytics] = useState<SeparationAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch separation requests
      const requestsResponse = await fetch('/api/hr/separation/requests');
      const requestsData = await requestsResponse.json();
      
      if (requestsData.success) {
        setSeparationRequests(requestsData.data);
      }
      
      // Fetch analytics
      const analyticsResponse = await fetch('/api/hr/separation/analytics');
      const analyticsData = await analyticsResponse.json();
      
      if (analyticsData.success) {
        setAnalytics(analyticsData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'draft': { 
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <Edit className="h-3 w-3" />
      },
      'submitted': { 
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <FileText className="h-3 w-3" />
      },
      'under_review': { 
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
      'completed': { 
        className: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: <CheckSquare className="h-3 w-3" />
      },
      'cancelled': { 
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <XCircle className="h-3 w-3" />
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <div className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </div>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      'resignation': { className: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Resignation' },
      'termination': { className: 'bg-red-100 text-red-800 border-red-200', label: 'Termination' },
      'retirement': { className: 'bg-green-100 text-green-800 border-green-200', label: 'Retirement' },
      'end_of_contract': { className: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'End of Contract' },
      'redundancy': { className: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Redundancy' },
      'mutual_agreement': { className: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Mutual Agreement' }
    };

    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.resignation;
    
    return (
      <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className}`}>
        {config.label}
      </div>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'low': { className: 'bg-gray-100 text-gray-800 border-gray-200' },
      'medium': { className: 'bg-blue-100 text-blue-800 border-blue-200' },
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
          <p className="text-muted-foreground">Loading separation data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Separation & Offboarding</h1>
          <p className="text-muted-foreground">
            Manage employee separations, exit interviews, and clearance processes
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/hr/separation/requests/new">
              <Plus className="h-4 w-4 mr-2" />
              New Separation
            </Link>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requests">Separation Requests</TabsTrigger>
          <TabsTrigger value="interviews">Exit Interviews</TabsTrigger>
          <TabsTrigger value="clearance">Clearance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          {/* Key Metrics */}
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Separations</CardTitle>
                  <UserX className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalSeparations}</div>
                  <p className="text-xs text-muted-foreground">
                    This year
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Exit Interviews</CardTitle>
                  <FileText className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{analytics.exitInterviewCompletion}%</div>
                  <p className="text-xs text-muted-foreground">
                    Completion rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clearance Process</CardTitle>
                  <CheckSquare className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{analytics.clearanceCompletion}%</div>
                  <p className="text-xs text-muted-foreground">
                    Completion rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
                  <Clock className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{analytics.averageSeparationDuration}</div>
                  <p className="text-xs text-muted-foreground">
                    Days to complete
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Separation Types */}
          {analytics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Separations by Type
                  </CardTitle>
                  <CardDescription>
                    Breakdown of separation reasons
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(analytics.separationsByType).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getTypeBadge(type)}
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{count}</div>
                          <div className="text-sm text-muted-foreground">
                            {analytics.totalSeparations > 0 ? 
                              Math.round((count / analytics.totalSeparations) * 100) : 0}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Separations by Department
                  </CardTitle>
                  <CardDescription>
                    Department-wise separation trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.separationsByDepartment.slice(0, 5).map((dept) => (
                      <div key={dept.department} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{dept.department}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{dept.count}</div>
                          <div className="text-sm text-muted-foreground">{dept.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recent Separations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Separation Requests
              </CardTitle>
              <CardDescription>
                Latest separation requests requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {separationRequests.length === 0 ? (
                <div className="text-center py-8">
                  <UserX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No separation requests found</h3>
                  <p className="text-muted-foreground mb-4">
                    No separation requests have been submitted yet.
                  </p>
                  <Button asChild>
                    <Link href="/hr/separation/requests/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Request
                    </Link>
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Working Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {separationRequests.slice(0, 5).map((request) => (
                      <TableRow key={request.separationId}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{request.employeeName}</div>
                              <div className="text-sm text-muted-foreground">{request.employeePosition}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(request.separationType)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            {request.employeeDepartment}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {formatDate(request.lastWorkingDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/hr/separation/requests/${request.separationId}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Separation Requests Tab */}
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserX className="h-5 w-5" />
                Separation Requests
              </CardTitle>
              <CardDescription>
                Manage all employee separation requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {separationRequests.length === 0 ? (
                <div className="text-center py-8">
                  <UserX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No separation requests found</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by creating a new separation request.
                  </p>
                  <Button asChild>
                    <Link href="/hr/separation/requests/new">
                      <Plus className="h-4 w-4 mr-2" />
                      New Separation Request
                    </Link>
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Last Working Date</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {separationRequests.map((request) => (
                      <TableRow key={request.separationId}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{request.employeeName}</div>
                              <div className="text-sm text-muted-foreground">{request.employeePosition}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(request.separationType)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            {request.employeeDepartment}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {formatDate(request.lastWorkingDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {formatDate(request.submittedDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/hr/separation/requests/${request.separationId}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/hr/separation/requests/${request.separationId}/edit`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exit Interviews Tab */}
        <TabsContent value="interviews">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Exit Interviews
              </CardTitle>
              <CardDescription>
                Manage exit interviews and feedback collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Exit Interviews</h3>
                <p className="text-muted-foreground mb-4">
                  Exit interview management will be available here.
                </p>
                <Button asChild>
                  <Link href="/hr/separation/interviews">
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Exit Interview
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clearance Tab */}
        <TabsContent value="clearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                Clearance Process
              </CardTitle>
              <CardDescription>
                Track and manage clearance checklists
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Clearance Checklists</h3>
                <p className="text-muted-foreground mb-4">
                  Clearance process management will be available here.
                </p>
                <Button asChild>
                  <Link href="/hr/separation/clearance">
                    <Plus className="h-4 w-4 mr-2" />
                    View Clearance Lists
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
