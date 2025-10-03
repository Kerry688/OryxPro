'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Play,
  Pause,
  Square,
  Download,
  Upload,
  Database,
  FileText,
  Package,
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Zap,
  Shield,
  Globe,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface SyncLog {
  id: string;
  timestamp: Date;
  type: 'product' | 'invoice' | 'status_check' | 'bulk_sync';
  status: 'success' | 'error' | 'warning' | 'pending';
  message: string;
  details?: string;
  recordsProcessed?: number;
  recordsTotal?: number;
  duration?: number; // in seconds
}

interface SyncStats {
  totalProducts: number;
  syncedProducts: number;
  pendingProducts: number;
  failedProducts: number;
  totalInvoices: number;
  syncedInvoices: number;
  pendingInvoices: number;
  failedInvoices: number;
  lastSyncDate?: Date;
  nextSyncDate?: Date;
  syncRate: number; // percentage
}

interface SyncJob {
  id: string;
  name: string;
  type: 'products' | 'invoices' | 'status_check' | 'full_sync';
  status: 'running' | 'completed' | 'failed' | 'paused' | 'pending';
  progress: number;
  startTime: Date;
  endTime?: Date;
  recordsProcessed: number;
  recordsTotal: number;
  errorMessage?: string;
}

export default function ETASyncPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [stats, setStats] = useState<SyncStats>({
    totalProducts: 0,
    syncedProducts: 0,
    pendingProducts: 0,
    failedProducts: 0,
    totalInvoices: 0,
    syncedInvoices: 0,
    pendingInvoices: 0,
    failedInvoices: 0,
    syncRate: 0
  });
  
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [activeJobs, setActiveJobs] = useState<SyncJob[]>([]);
  const [autoSync, setAutoSync] = useState(true);
  const [syncInterval, setSyncInterval] = useState(30); // minutes

  useEffect(() => {
    fetchSyncData();
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchSyncData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchSyncData = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would fetch from your API
      // const [statsResponse, logsResponse, jobsResponse] = await Promise.all([
      //   fetch('/api/eta/sync/stats'),
      //   fetch('/api/eta/sync/logs'),
      //   fetch('/api/eta/sync/jobs')
      // ]);
      // const [statsData, logsData, jobsData] = await Promise.all([
      //   statsResponse.json(),
      //   logsResponse.json(),
      //   jobsResponse.json()
      // ]);
      
      // Demo data
      const demoStats: SyncStats = {
        totalProducts: 1250,
        syncedProducts: 1180,
        pendingProducts: 45,
        failedProducts: 25,
        totalInvoices: 3200,
        syncedInvoices: 3100,
        pendingInvoices: 75,
        failedInvoices: 25,
        lastSyncDate: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        nextSyncDate: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
        syncRate: 94.2
      };
      
      const demoSyncLogs: SyncLog[] = [
        {
          id: '1',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          type: 'product',
          status: 'success',
          message: 'Successfully synced 25 products with ETA',
          recordsProcessed: 25,
          recordsTotal: 25,
          duration: 12
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 10 * 60 * 1000),
          type: 'invoice',
          status: 'success',
          message: 'Successfully synced 15 invoices with ETA',
          recordsProcessed: 15,
          recordsTotal: 15,
          duration: 8
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 20 * 60 * 1000),
          type: 'product',
          status: 'error',
          message: 'Failed to sync product with invalid EGS code',
          details: 'Product ID: PROD-12345, EGS Code: INVALID-CODE',
          recordsProcessed: 0,
          recordsTotal: 1,
          duration: 3
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          type: 'status_check',
          status: 'success',
          message: 'Status check completed successfully',
          recordsProcessed: 100,
          recordsTotal: 100,
          duration: 5
        }
      ];
      
      const demoActiveJobs: SyncJob[] = [
        {
          id: 'job-1',
          name: 'Product Sync',
          type: 'products',
          status: 'running',
          progress: 65,
          startTime: new Date(Date.now() - 5 * 60 * 1000),
          recordsProcessed: 13,
          recordsTotal: 20
        },
        {
          id: 'job-2',
          name: 'Invoice Status Check',
          type: 'status_check',
          status: 'pending',
          progress: 0,
          startTime: new Date(Date.now() + 10 * 60 * 1000),
          recordsProcessed: 0,
          recordsTotal: 50
        }
      ];
      
      setStats(demoStats);
      setSyncLogs(demoSyncLogs);
      setActiveJobs(demoActiveJobs);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sync data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch sync data",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const startSync = async (type: 'products' | 'invoices' | 'full') => {
    try {
      setSyncing(true);
      toast({
        title: "Sync Started",
        description: `Starting ${type} synchronization with ETA...`,
      });
      
      // In a real implementation, this would trigger the actual sync
      // await fetch('/api/eta/sync/start', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ type })
      // });
      
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Sync Completed",
        description: `${type} synchronization completed successfully`,
      });
      
      // Refresh data
      await fetchSyncData();
    } catch (error) {
      console.error('Error starting sync:', error);
      toast({
        title: "Sync Error",
        description: "Failed to start synchronization",
        variant: "destructive"
      });
    } finally {
      setSyncing(false);
    }
  };

  const pauseSync = async (jobId: string) => {
    try {
      // In a real implementation, this would pause the sync job
      // await fetch(`/api/eta/sync/jobs/${jobId}/pause`, { method: 'POST' });
      
      setActiveJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, status: 'paused' as const } : job
      ));
      
      toast({
        title: "Sync Paused",
        description: "Synchronization has been paused",
      });
    } catch (error) {
      console.error('Error pausing sync:', error);
      toast({
        title: "Error",
        description: "Failed to pause synchronization",
        variant: "destructive"
      });
    }
  };

  const stopSync = async (jobId: string) => {
    try {
      // In a real implementation, this would stop the sync job
      // await fetch(`/api/eta/sync/jobs/${jobId}/stop`, { method: 'POST' });
      
      setActiveJobs(prev => prev.filter(job => job.id !== jobId));
      
      toast({
        title: "Sync Stopped",
        description: "Synchronization has been stopped",
      });
    } catch (error) {
      console.error('Error stopping sync:', error);
      toast({
        title: "Error",
        description: "Failed to stop synchronization",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500',
      pending: 'bg-blue-500',
      running: 'bg-green-500',
      completed: 'bg-green-500',
      failed: 'bg-red-500',
      paused: 'bg-yellow-500'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-500'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ETA Synchronization</h1>
          <p className="text-muted-foreground">
            Manage synchronization with Egyptian Tax Authority
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => fetchSyncData()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => startSync('full')} disabled={syncing}>
            <Zap className="h-4 w-4 mr-2" />
            {syncing ? 'Syncing...' : 'Full Sync'}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Sync</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.syncedProducts}/{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingProducts} pending, {stats.failedProducts} failed
            </p>
            <Progress value={(stats.syncedProducts / stats.totalProducts) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invoices Sync</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.syncedInvoices}/{stats.totalInvoices}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingInvoices} pending, {stats.failedInvoices} failed
            </p>
            <Progress value={(stats.syncedInvoices / stats.totalInvoices) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sync Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.syncRate}%</div>
            <p className="text-xs text-muted-foreground">
              Overall synchronization success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.lastSyncDate ? format(stats.lastSyncDate, 'HH:mm') : 'Never'}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.nextSyncDate ? `Next: ${format(stats.nextSyncDate, 'HH:mm')}` : 'No scheduled sync'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Active Jobs</TabsTrigger>
          <TabsTrigger value="logs">Sync Logs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Product Synchronization
                </CardTitle>
                <CardDescription>
                  Sync products with EGS codes to ETA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Pending Products</span>
                  <Badge variant="outline">{stats.pendingProducts}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Failed Products</span>
                  <Badge variant="destructive">{stats.failedProducts}</Badge>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => startSync('products')} disabled={syncing} size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Sync Products
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Invoice Synchronization
                </CardTitle>
                <CardDescription>
                  Submit and track invoices with ETA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Pending Invoices</span>
                  <Badge variant="outline">{stats.pendingInvoices}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Failed Invoices</span>
                  <Badge variant="destructive">{stats.failedInvoices}</Badge>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => startSync('invoices')} disabled={syncing} size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Sync Invoices
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Active Jobs */}
        <TabsContent value="jobs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Active Synchronization Jobs
              </CardTitle>
              <CardDescription>
                Monitor and manage running synchronization jobs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeJobs.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Active Jobs</h3>
                  <p className="text-muted-foreground">
                    No synchronization jobs are currently running
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeJobs.map((job) => (
                    <div key={job.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{job.name}</h4>
                          {getStatusBadge(job.status)}
                        </div>
                        <div className="flex space-x-2">
                          {job.status === 'running' && (
                            <Button size="sm" variant="outline" onClick={() => pauseSync(job.id)}>
                              <Pause className="h-4 w-4 mr-1" />
                              Pause
                            </Button>
                          )}
                          {job.status === 'paused' && (
                            <Button size="sm" variant="outline" onClick={() => startSync(job.type as any)}>
                              <Play className="h-4 w-4 mr-1" />
                              Resume
                            </Button>
                          )}
                          <Button size="sm" variant="destructive" onClick={() => stopSync(job.id)}>
                            <Square className="h-4 w-4 mr-1" />
                            Stop
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Progress: {job.recordsProcessed}/{job.recordsTotal}</span>
                          <span>{job.progress}%</span>
                        </div>
                        <Progress value={job.progress} />
                        <div className="text-xs text-muted-foreground">
                          Started: {format(job.startTime, 'MMM dd, yyyy HH:mm')}
                          {job.endTime && ` • Ended: ${format(job.endTime, 'MMM dd, yyyy HH:mm')}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sync Logs */}
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Synchronization Logs
              </CardTitle>
              <CardDescription>
                View detailed logs of all synchronization activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Records</TableHead>
                    <TableHead>Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {syncLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">
                        {format(log.timestamp, 'MMM dd, HH:mm:ss')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(log.status)}
                          {getStatusBadge(log.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{log.message}</div>
                          {log.details && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {log.details}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {log.recordsProcessed !== undefined && log.recordsTotal !== undefined ? (
                          <span className="text-sm">
                            {log.recordsProcessed}/{log.recordsTotal}
                          </span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {log.duration ? `${log.duration}s` : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Synchronization Settings
              </CardTitle>
              <CardDescription>
                Configure automatic synchronization settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Auto Sync</div>
                  <div className="text-sm text-muted-foreground">
                    Automatically sync data with ETA
                  </div>
                </div>
                <Button
                  variant={autoSync ? "default" : "outline"}
                  onClick={() => setAutoSync(!autoSync)}
                >
                  {autoSync ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="font-medium">Sync Interval</div>
                <div className="text-sm text-muted-foreground">
                  How often to automatically sync with ETA
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="5"
                    max="120"
                    value={syncInterval}
                    onChange={(e) => setSyncInterval(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium">{syncInterval} minutes</span>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button onClick={() => startSync('full')} disabled={syncing}>
                  <Zap className="h-4 w-4 mr-2" />
                  {syncing ? 'Syncing...' : 'Start Full Sync Now'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

