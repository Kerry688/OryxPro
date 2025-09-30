'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Plus,
  FileText,
  CalendarDays,
  UserCheck,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';

interface LeaveStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalEmployees: number;
  averageLeaveDays: number;
  upcomingHolidays: number;
  leaveUtilization: number;
}

export default function LeaveManagementPage() {
  const [stats, setStats] = useState<LeaveStats>({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    totalEmployees: 0,
    averageLeaveDays: 0,
    upcomingHolidays: 0,
    leaveUtilization: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaveStats();
  }, []);

  const fetchLeaveStats = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockStats: LeaveStats = {
        totalRequests: 156,
        pendingRequests: 23,
        approvedRequests: 120,
        rejectedRequests: 13,
        totalEmployees: 25,
        averageLeaveDays: 18.5,
        upcomingHolidays: 8,
        leaveUtilization: 78.2
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching leave stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading leave management data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leave & Holiday Management</h1>
          <p className="text-muted-foreground">
            Manage leave requests, approvals, and holiday calendars
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/hr/leave/calendar">
              <CalendarDays className="h-4 w-4 mr-2" />
              View Calendar
            </Link>
          </Button>
          <Button asChild>
            <Link href="/hr/leave/requests/new">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRequests}</div>
            <p className="text-xs text-muted-foreground">
              All time leave requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting manager approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approvedRequests}</div>
            <p className="text-xs text-muted-foreground">
              Successfully approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejectedRequests}</div>
            <p className="text-xs text-muted-foreground">
              Rejected requests
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              Total employees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Leave Days</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageLeaveDays}</div>
            <p className="text-xs text-muted-foreground">
              Days per employee per year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Holidays</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.upcomingHolidays}</div>
            <p className="text-xs text-muted-foreground">
              Next 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leave Utilization</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.leaveUtilization}%</div>
            <p className="text-xs text-muted-foreground">
              Annual leave usage
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Leave Requests
            </CardTitle>
            <CardDescription>
              Manage and approve leave requests
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" asChild>
              <Link href="/hr/leave/requests">
                View All Requests
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/hr/leave/requests/new">
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/hr/leave/approvals">
                <UserCheck className="h-4 w-4 mr-2" />
                Pending Approvals
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Holiday Calendar
            </CardTitle>
            <CardDescription>
              Manage holidays and calendar events
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" asChild>
              <Link href="/hr/leave/calendar">
                View Calendar
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/hr/leave/holidays">
                Manage Holidays
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/hr/leave/holidays/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Holiday
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Reports & Analytics
            </CardTitle>
            <CardDescription>
              View leave reports and analytics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" asChild>
              <Link href="/hr/leave/reports">
                View Reports
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/hr/leave/balances">
                Leave Balances
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/hr/leave/types">
                Leave Types
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Leave Activity
          </CardTitle>
          <CardDescription>
            Latest leave requests and approvals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Ahmed Mahmoud', type: 'Annual Leave', days: 5, status: 'approved', date: '2 hours ago' },
              { name: 'Fatma Hassan', type: 'Sick Leave', days: 2, status: 'pending', date: '4 hours ago' },
              { name: 'Mohamed Ali', type: 'Personal Leave', days: 1, status: 'approved', date: '6 hours ago' },
              { name: 'Nora El Sharif', type: 'Maternity Leave', days: 90, status: 'approved', date: '1 day ago' },
              { name: 'Youssef El Abbasi', type: 'Annual Leave', days: 3, status: 'rejected', date: '2 days ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'approved' ? 'bg-green-500' :
                    activity.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <div className="font-medium">{activity.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {activity.type} • {activity.days} days
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    activity.status === 'approved' ? 'text-green-600' :
                    activity.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">{activity.date}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/hr/leave/requests">
                View All Activity
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
