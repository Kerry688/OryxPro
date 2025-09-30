'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  BarChart3,
  Plus,
  Eye,
  Edit,
  Calendar,
  User,
  Building2,
  TrendingUp,
  TrendingDown,
  Fingerprint,
  Smartphone,
  Wifi
} from 'lucide-react';
import Link from 'next/link';
import { AttendanceRecord, AttendanceAnalytics } from '@/lib/models/attendance';

export default function AttendanceTimeTrackingPage() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [analytics, setAnalytics] = useState<AttendanceAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch attendance records
      const recordsResponse = await fetch('/api/hr/attendance/records');
      const recordsData = await recordsResponse.json();
      
      if (recordsData.success) {
        setAttendanceRecords(recordsData.data);
      }
      
      // Fetch analytics
      const analyticsResponse = await fetch('/api/hr/attendance/analytics');
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
      'present': { 
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle className="h-3 w-3" />
      },
      'absent': { 
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: <XCircle className="h-3 w-3" />
      },
      'late': { 
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <AlertTriangle className="h-3 w-3" />
      },
      'half_day': { 
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <Clock className="h-3 w-3" />
      },
      'on_leave': { 
        className: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: <Calendar className="h-3 w-3" />
      },
      'holiday': { 
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <Calendar className="h-3 w-3" />
      },
      'weekend': { 
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <Calendar className="h-3 w-3" />
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.present;
    
    return (
      <div className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </div>
    );
  };

  const getCheckInMethodIcon = (method: string) => {
    switch (method) {
      case 'biometric':
        return <Fingerprint className="h-4 w-4" />;
      case 'rfid':
        return <Smartphone className="h-4 w-4" />;
      case 'online':
        return <Wifi className="h-4 w-4" />;
      case 'mobile_app':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Attendance & Time Tracking</h1>
          <p className="text-muted-foreground">
            Manage employee attendance, work hours, and shift scheduling
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/hr/attendance/checkin">
              <Clock className="h-4 w-4 mr-2" />
              Check In/Out
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/hr/attendance/records/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Record
            </Link>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="records">Attendance Records</TabsTrigger>
          <TabsTrigger value="shifts">Shift Management</TabsTrigger>
          <TabsTrigger value="devices">Biometric Devices</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          {/* Key Metrics */}
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalEmployees}</div>
                  <p className="text-xs text-muted-foreground">
                    Active employees
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{analytics.averageAttendance}%</div>
                  <p className="text-xs text-muted-foreground">
                    This year
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Work Hours</CardTitle>
                  <Clock className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{analytics.totalWorkHours}</div>
                  <p className="text-xs text-muted-foreground">
                    Hours logged
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overtime Hours</CardTitle>
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{analytics.totalOvertimeHours}</div>
                  <p className="text-xs text-muted-foreground">
                    Extra hours
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Attendance Trends */}
          {analytics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Attendance by Department
                  </CardTitle>
                  <CardDescription>
                    Department-wise attendance performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.attendanceByDepartment.slice(0, 5).map((dept) => (
                      <div key={dept.department} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{dept.department}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{dept.averageAttendance}%</div>
                          <div className="text-sm text-muted-foreground">{dept.employees} employees</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Shift Performance
                  </CardTitle>
                  <CardDescription>
                    Attendance performance by shift
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.attendanceByShift.slice(0, 5).map((shift) => (
                      <div key={shift.shiftName} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{shift.shiftName}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{shift.averageAttendance}%</div>
                          <div className="text-sm text-muted-foreground">{shift.employees} employees</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recent Attendance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Attendance Records
              </CardTitle>
              <CardDescription>
                Latest attendance entries requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {attendanceRecords.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No attendance records found</h3>
                  <p className="text-muted-foreground mb-4">
                    No attendance records have been created yet.
                  </p>
                  <Button asChild>
                    <Link href="/hr/attendance/records/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Record
                    </Link>
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceRecords.slice(0, 10).map((record) => (
                      <TableRow key={record.attendanceId}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{record.employeeName}</div>
                              <div className="text-sm text-muted-foreground">{record.employeePosition}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {formatDate(record.workDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {record.checkInTime ? (
                            <div className="flex items-center gap-1">
                              {getCheckInMethodIcon(record.checkInMethod)}
                              {formatTime(record.checkInTime)}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {record.checkOutTime ? (
                            <div className="flex items-center gap-1">
                              {getCheckInMethodIcon(record.checkOutMethod)}
                              {formatTime(record.checkOutTime)}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {record.totalWorkHours.toFixed(1)}h
                            {record.overtimeHours > 0 && (
                              <div className="text-orange-600">+{record.overtimeHours.toFixed(1)}h OT</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
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

        {/* Attendance Records Tab */}
        <TabsContent value="records">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Attendance Records
              </CardTitle>
              <CardDescription>
                Manage all employee attendance records
              </CardDescription>
            </CardHeader>
            <CardContent>
              {attendanceRecords.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No attendance records found</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by creating attendance records or setting up biometric devices.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button asChild>
                      <Link href="/hr/attendance/records/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Record
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/hr/attendance/devices">
                        <Fingerprint className="h-4 w-4 mr-2" />
                        Setup Devices
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceRecords.map((record) => (
                      <TableRow key={record.attendanceId}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{record.employeeName}</div>
                              <div className="text-sm text-muted-foreground">{record.employeePosition}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            {record.employeeDepartment}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {formatDate(record.workDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {record.checkInTime ? (
                            <div className="flex items-center gap-1">
                              {getCheckInMethodIcon(record.checkInMethod)}
                              {formatTime(record.checkInTime)}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {record.checkOutTime ? (
                            <div className="flex items-center gap-1">
                              {getCheckInMethodIcon(record.checkOutMethod)}
                              {formatTime(record.checkOutTime)}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{record.totalWorkHours.toFixed(1)}h</div>
                            {record.overtimeHours > 0 && (
                              <div className="text-orange-600">+{record.overtimeHours.toFixed(1)}h OT</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
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

        {/* Shift Management Tab */}
        <TabsContent value="shifts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Shift Management
              </CardTitle>
              <CardDescription>
                Manage work shifts and scheduling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Shift Management</h3>
                <p className="text-muted-foreground mb-4">
                  Shift management features will be available here.
                </p>
                <Button asChild>
                  <Link href="/hr/attendance/shifts">
                    <Plus className="h-4 w-4 mr-2" />
                    Manage Shifts
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Biometric Devices Tab */}
        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fingerprint className="h-5 w-5" />
                Biometric Devices
              </CardTitle>
              <CardDescription>
                Manage biometric and RFID devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Fingerprint className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Biometric Devices</h3>
                <p className="text-muted-foreground mb-4">
                  Device management features will be available here.
                </p>
                <Button asChild>
                  <Link href="/hr/attendance/devices">
                    <Plus className="h-4 w-4 mr-2" />
                    Manage Devices
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
