'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Calendar, 
  DollarSign, 
  Bell, 
  MessageSquare, 
  FileText,
  Download,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Settings,
  Mail,
  Phone,
  MapPin,
  Clock3,
  Users,
  Building2
} from 'lucide-react';
import Link from 'next/link';
import { DashboardStats, EmployeeProfile } from '@/lib/models/employee-portal';

export default function EmployeePortalPage() {
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock employee ID - in real app, this would come from auth context
    const employeeId = 'EMP009'; // Ahmed Mahmoud
    fetchEmployeeData(employeeId);
  }, []);

  const fetchEmployeeData = async (employeeId: string) => {
    try {
      setLoading(true);
      
      // Fetch profile
      const profileResponse = await fetch(`/api/employee/profile?employeeId=${employeeId}`);
      const profileData = await profileResponse.json();
      
      if (profileData.success) {
        setProfile(profileData.data);
      }
      
      // Fetch dashboard stats
      const statsResponse = await fetch(`/api/employee/dashboard?employeeId=${employeeId}`);
      const statsData = await statsResponse.json();
      
      if (statsData.success) {
        setStats(statsData.data);
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employee Self-Service Portal</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.personalInfo.firstName} {profile?.personalInfo.lastName}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/employee/profile">
              <Settings className="h-4 w-4 mr-2" />
              Profile Settings
            </Link>
          </Button>
        </div>
      </div>

      {/* Profile Summary */}
      {profile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {profile.personalInfo.firstName} {profile.personalInfo.lastName}
                  </h3>
                  <p className="text-muted-foreground">{profile.workInfo.position}</p>
                  <p className="text-sm text-muted-foreground">{profile.workInfo.department}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile.personalInfo.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile.personalInfo.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile.workInfo.workLocation}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Employee #{profile.workInfo.employeeNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Since {new Date(profile.workInfo.hireDate).getFullYear()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Manager: {profile.workInfo.managerName}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leave Requests</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.leaveRequests.total}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={stats.leaveRequests.pending > 0 ? 'default' : 'secondary'}>
                  {stats.leaveRequests.pending} Pending
                </Badge>
                <Badge variant="outline" className="text-green-600">
                  {stats.leaveRequests.approved} Approved
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Leave</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.leaveBalances.totalAvailableDays}</div>
              <p className="text-xs text-muted-foreground">
                {stats.leaveBalances.utilizationPercentage}% utilized
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payslips</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.payslips.totalPayslips}</div>
              {stats.payslips.lastPayslipAmount && (
                <p className="text-xs text-muted-foreground">
                  Last: {stats.payslips.lastPayslipAmount.toLocaleString()} EGP
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.messages.unreadCount}</div>
              <p className="text-xs text-muted-foreground">
                {stats.messages.urgentCount} urgent
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Leave Management
            </CardTitle>
            <CardDescription>
              Request leave and track your balances
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" asChild>
              <Link href="/employee/leave/request">
                <FileText className="h-4 w-4 mr-2" />
                New Leave Request
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/employee/leave">
                <Eye className="h-4 w-4 mr-2" />
                View Leave Status
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/employee/leave/balance">
                <BarChart3 className="h-4 w-4 mr-2" />
                Leave Balances
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Payslips & Documents
            </CardTitle>
            <CardDescription>
              Download payslips and tax documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" asChild>
              <Link href="/employee/payslips">
                <Download className="h-4 w-4 mr-2" />
                View Payslips
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/employee/documents">
                <FileText className="h-4 w-4 mr-2" />
                Tax Documents
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/employee/payslips/current">
                <Eye className="h-4 w-4 mr-2" />
                Current Payslip
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Communications
            </CardTitle>
            <CardDescription>
              View announcements and messages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" asChild>
              <Link href="/employee/announcements">
                <Bell className="h-4 w-4 mr-2" />
                Announcements
                {stats?.announcements.unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {stats.announcements.unreadCount}
                  </Badge>
                )}
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/employee/messages">
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
                {stats?.messages.unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {stats.messages.unreadCount}
                  </Badge>
                )}
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/employee/messages/compose">
                <Mail className="h-4 w-4 mr-2" />
                Compose Message
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Leave Requests
            </CardTitle>
            <CardDescription>
              Your latest leave activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: 'Annual Leave', days: 5, status: 'pending', date: '2 days ago' },
                { type: 'Sick Leave', days: 2, status: 'approved', date: '1 week ago' },
                { type: 'Personal Leave', days: 1, status: 'approved', date: '2 weeks ago' }
              ].map((request, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{request.type}</div>
                    <div className="text-sm text-muted-foreground">
                      {request.days} days • {request.date}
                    </div>
                  </div>
                  <Badge variant={
                    request.status === 'approved' ? 'default' :
                    request.status === 'pending' ? 'secondary' : 'destructive'
                  }>
                    {request.status}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/employee/leave">
                  View All Leave Requests
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Announcements
            </CardTitle>
            <CardDescription>
              Latest company updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: 'Holiday Schedule 2025', priority: 'urgent', date: '1 day ago' },
                { title: 'New HR Policies Update', priority: 'high', date: '3 days ago' },
                { title: 'Company All-Hands Meeting', priority: 'medium', date: '1 week ago' }
              ].map((announcement, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{announcement.title}</div>
                    <div className="text-sm text-muted-foreground">{announcement.date}</div>
                  </div>
                  <Badge variant={
                    announcement.priority === 'urgent' ? 'destructive' :
                    announcement.priority === 'high' ? 'default' : 'secondary'
                  }>
                    {announcement.priority}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-4">
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
  );
}
