'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Target,
  FileText,
  Activity,
  TrendingUp,
  DollarSign,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  UserPlus,
  Building,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface CRMStats {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
  totalDeals: number;
  activeDeals: number;
  wonDeals: number;
  totalValue: number;
  wonValue: number;
  totalQuotations: number;
  sentQuotations: number;
  acceptedQuotations: number;
  totalActivities: number;
  completedActivities: number;
  pendingActivities: number;
}

export default function CRMDashboard() {
  const [stats, setStats] = useState<CRMStats>({
    totalLeads: 0,
    newLeads: 0,
    qualifiedLeads: 0,
    convertedLeads: 0,
    totalDeals: 0,
    activeDeals: 0,
    wonDeals: 0,
    totalValue: 0,
    wonValue: 0,
    totalQuotations: 0,
    sentQuotations: 0,
    acceptedQuotations: 0,
    totalActivities: 0,
    completedActivities: 0,
    pendingActivities: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Fetch leads stats
      const leadsResponse = await fetch('/api/leads');
      const leadsData = await leadsResponse.json();
      
      // Fetch deals stats
      const dealsResponse = await fetch('/api/deals');
      const dealsData = await dealsResponse.json();
      
      // Fetch quotations stats
      const quotationsResponse = await fetch('/api/quotations');
      const quotationsData = await quotationsResponse.json();
      
      // Fetch activities stats
      const activitiesResponse = await fetch('/api/sales-activities');
      const activitiesData = await activitiesResponse.json();

      if (leadsData.success && dealsData.success && quotationsData.success && activitiesData.success) {
        const leads = leadsData.data || [];
        const deals = dealsData.data || [];
        const quotations = quotationsData.data || [];
        const activities = activitiesData.data || [];

        setStats({
          totalLeads: leads.length,
          newLeads: leads.filter((l: any) => l.status === 'new').length,
          qualifiedLeads: leads.filter((l: any) => l.status === 'qualified').length,
          convertedLeads: leads.filter((l: any) => l.status === 'converted').length,
          totalDeals: deals.length,
          activeDeals: deals.filter((d: any) => d.status !== 'closed_won' && d.status !== 'closed_lost').length,
          wonDeals: deals.filter((d: any) => d.status === 'closed_won').length,
          totalValue: deals.reduce((sum: number, d: any) => sum + (d.value || 0), 0),
          wonValue: deals.filter((d: any) => d.status === 'closed_won').reduce((sum: number, d: any) => sum + (d.value || 0), 0),
          totalQuotations: quotations.length,
          sentQuotations: quotations.filter((q: any) => q.status === 'sent').length,
          acceptedQuotations: quotations.filter((q: any) => q.status === 'accepted').length,
          totalActivities: activities.length,
          completedActivities: activities.filter((a: any) => a.status === 'completed').length,
          pendingActivities: activities.filter((a: any) => a.status === 'scheduled').length
        });
      }
    } catch (error) {
      console.error('Error fetching CRM stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM Dashboard</h1>
          <p className="text-muted-foreground">
            Customer Relationship Management overview
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={fetchStats}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link href="/crm/leads">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <UserPlus className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">New Lead</p>
                  <p className="text-xs text-muted-foreground">Add a new lead</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/crm/deals">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">New Deal</p>
                  <p className="text-xs text-muted-foreground">Create a deal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/crm/quotations">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">New Quotation</p>
                  <p className="text-xs text-muted-foreground">Create quotation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/crm/activities">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Activity className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">New Activity</p>
                  <p className="text-xs text-muted-foreground">Schedule activity</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Leads Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="outline" className="text-xs">
                New: {stats.newLeads}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Qualified: {stats.qualifiedLeads}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.convertedLeads} converted
            </p>
          </CardContent>
        </Card>

        {/* Deals Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDeals}</div>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="outline" className="text-xs">
                Active: {stats.activeDeals}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Won: {stats.wonDeals}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Total Value: {formatCurrency(stats.totalValue)}
            </p>
          </CardContent>
        </Card>

        {/* Quotations Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quotations</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuotations}</div>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="outline" className="text-xs">
                Sent: {stats.sentQuotations}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Accepted: {stats.acceptedQuotations}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Conversion rate: {stats.totalQuotations > 0 ? Math.round((stats.acceptedQuotations / stats.totalQuotations) * 100) : 0}%
            </p>
          </CardContent>
        </Card>

        {/* Activities Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalActivities}</div>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="outline" className="text-xs">
                Completed: {stats.completedActivities}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Pending: {stats.pendingActivities}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Completion rate: {stats.totalActivities > 0 ? Math.round((stats.completedActivities / stats.totalActivities) * 100) : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
            <CardDescription>Latest leads added to the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <UserPlus className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New lead added</p>
                  <p className="text-xs text-muted-foreground">John Doe from ABC Company</p>
                </div>
                <Badge variant="outline" className="text-xs">New</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Lead qualified</p>
                  <p className="text-xs text-muted-foreground">Jane Smith from XYZ Corp</p>
                </div>
                <Badge variant="outline" className="text-xs">Qualified</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Lead converted</p>
                  <p className="text-xs text-muted-foreground">Mike Johnson from Tech Solutions</p>
                </div>
                <Badge variant="outline" className="text-xs">Converted</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest sales activities and meetings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Phone className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Call completed</p>
                  <p className="text-xs text-muted-foreground">Follow-up call with ABC Company</p>
                </div>
                <Badge variant="outline" className="text-xs">Completed</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Meeting scheduled</p>
                  <p className="text-xs text-muted-foreground">Product demo with XYZ Corp</p>
                </div>
                <Badge variant="outline" className="text-xs">Scheduled</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Mail className="h-4 w-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Email sent</p>
                  <p className="text-xs text-muted-foreground">Quotation sent to Tech Solutions</p>
                </div>
                <Badge variant="outline" className="text-xs">Sent</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Conversion Rate</span>
                <span className="text-sm font-bold">
                  {stats.totalLeads > 0 ? Math.round((stats.convertedLeads / stats.totalLeads) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Win Rate</span>
                <span className="text-sm font-bold">
                  {stats.totalDeals > 0 ? Math.round((stats.wonDeals / stats.totalDeals) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Revenue Generated</span>
                <span className="text-sm font-bold">{formatCurrency(stats.wonValue)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pipeline Value</CardTitle>
            <CardDescription>Current pipeline overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Pipeline</span>
                <span className="text-sm font-bold">{formatCurrency(stats.totalValue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Active Deals</span>
                <span className="text-sm font-bold">{stats.activeDeals}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Average Deal Size</span>
                <span className="text-sm font-bold">
                  {stats.totalDeals > 0 ? formatCurrency(stats.totalValue / stats.totalDeals) : '$0'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
            <CardDescription>Sales rep activity overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Activities</span>
                <span className="text-sm font-bold">{stats.totalActivities}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Completed</span>
                <span className="text-sm font-bold">{stats.completedActivities}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Pending</span>
                <span className="text-sm font-bold">{stats.pendingActivities}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
