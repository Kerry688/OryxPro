'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Building2, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  UserPlus,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
  Plus,
  Eye,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils/date';

interface HRStats {
  totalEmployees: number;
  activeEmployees: number;
  totalDepartments: number;
  pendingLeaveRequests: number;
  totalPayroll: number;
  newHiresThisMonth: number;
  upcomingBirthdays: number;
  expiringContracts: number;
}

interface RecentActivity {
  id: string;
  type: 'new_hire' | 'leave_request' | 'payroll' | 'department_change';
  title: string;
  description: string;
  timestamp: Date;
  status?: 'pending' | 'approved' | 'completed';
}

export default function HRDashboard() {
  const [stats, setStats] = useState<HRStats>({
    totalEmployees: 0,
    activeEmployees: 0,
    totalDepartments: 0,
    pendingLeaveRequests: 0,
    totalPayroll: 0,
    newHiresThisMonth: 0,
    upcomingBirthdays: 0,
    expiringContracts: 0
  });

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHRStats();
    fetchRecentActivities();
  }, []);

  const fetchHRStats = async () => {
    try {
      // Mock data for now - replace with actual API calls
      setStats({
        totalEmployees: 156,
        activeEmployees: 142,
        totalDepartments: 12,
        pendingLeaveRequests: 8,
        totalPayroll: 125000,
        newHiresThisMonth: 5,
        upcomingBirthdays: 12,
        expiringContracts: 3
      });
    } catch (error) {
      console.error('Error fetching HR stats:', error);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      // Mock data for now - replace with actual API calls
      setRecentActivities([
        {
          id: '1',
          type: 'new_hire',
          title: 'New Employee Onboarded',
          description: 'Sarah Johnson joined the Marketing team',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          status: 'completed'
        },
        {
          id: '2',
          type: 'leave_request',
          title: 'Leave Request Submitted',
          description: 'Mike Chen requested 5 days annual leave',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          status: 'pending'
        },
        {
          id: '3',
          type: 'payroll',
          title: 'Payroll Processed',
          description: 'January payroll completed for 142 employees',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          status: 'completed'
        },
        {
          id: '4',
          type: 'department_change',
          title: 'Department Transfer',
          description: 'Alex Rodriguez moved to Engineering team',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          status: 'completed'
        }
      ]);
    } catch (error) {
      console.error('Error fetching recent activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'new_hire': return <UserPlus className="h-4 w-4" />;
      case 'leave_request': return <Calendar className="h-4 w-4" />;
      case 'payroll': return <DollarSign className="h-4 w-4" />;
      case 'department_change': return <Building2 className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="text-yellow-600">Pending</Badge>;
      case 'approved': return <Badge variant="outline" className="text-green-600">Approved</Badge>;
      case 'completed': return <Badge variant="outline" className="text-blue-600">Completed</Badge>;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading HR Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">HR Dashboard</h1>
          <p className="text-muted-foreground">Manage your human resources effectively</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/hr/employees/new">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Employee
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/hr/analytics">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeEmployees} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDepartments}</div>
            <p className="text-xs text-muted-foreground">
              Across all locations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Leave</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingLeaveRequests}</div>
            <p className="text-xs text-muted-foreground">
              Requires approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalPayroll.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total compensation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common HR tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/hr/employees">
                <Users className="mr-2 h-4 w-4" />
                Manage Employees
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/hr/departments">
                <Building2 className="mr-2 h-4 w-4" />
                Manage Departments
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/hr/leave-requests">
                <Calendar className="mr-2 h-4 w-4" />
                Leave Requests
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/hr/payroll">
                <DollarSign className="mr-2 h-4 w-4" />
                Payroll Management
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Alerts & Reminders</CardTitle>
            <CardDescription>Important notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.upcomingBirthdays > 0 && (
              <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Upcoming Birthdays</p>
                  <p className="text-xs text-muted-foreground">{stats.upcomingBirthdays} this week</p>
                </div>
              </div>
            )}
            {stats.expiringContracts > 0 && (
              <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-lg">
                <Clock className="h-4 w-4 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Expiring Contracts</p>
                  <p className="text-xs text-muted-foreground">{stats.expiringContracts} need renewal</p>
                </div>
              </div>
            )}
            {stats.pendingLeaveRequests > 0 && (
              <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Leave Requests</p>
                  <p className="text-xs text-muted-foreground">{stats.pendingLeaveRequests} pending approval</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest HR updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-muted-foreground">
                        {formatDate(activity.timestamp)}
                      </p>
                      {getStatusBadge(activity.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Employee Growth</CardTitle>
            <CardDescription>Hiring trends this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">+{stats.newHiresThisMonth}</div>
            <p className="text-sm text-muted-foreground">New hires this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workforce Distribution</CardTitle>
            <CardDescription>Active vs inactive employees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Active</span>
                <span>{stats.activeEmployees}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${(stats.activeEmployees / stats.totalEmployees) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Inactive</span>
                <span>{stats.totalEmployees - stats.activeEmployees}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
