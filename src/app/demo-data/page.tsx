'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  Users, 
  Building2, 
  Package, 
  Tag, 
  Camera, 
  Briefcase, 
  Network, 
  UserCheck, 
  Calendar,
  DollarSign,
  Trash2,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Settings,
  BarChart3,
  FileText,
  Shield,
  Clock,
  TrendingUp,
  Globe,
  Heart,
  Star,
  Zap,
  Target,
  Award,
  BookOpen,
  GraduationCap,
  UserPlus,
  UserMinus,
  CreditCard,
  Receipt,
  PieChart,
  Activity,
  MessageCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SeedStatus {
  name: string;
  endpoint: string;
  count: number;
  seeded: boolean;
  loading: boolean;
  category: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export default function DemoDataManagementPage() {
  const [seedStatuses, setSeedStatuses] = useState<SeedStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Initialize all seed statuses
  const initializeSeedStatuses = () => [
    // User Management
    {
      name: 'Demo Users',
      endpoint: '/api/users/seed',
      count: 0,
      seeded: false,
      loading: false,
      category: 'User Management',
      description: 'Create demo users with different roles and permissions',
      icon: <Users className="h-5 w-5" />,
      color: 'bg-blue-500'
    },
    {
      name: 'User Roles',
      endpoint: '/api/users/roles/seed',
      count: 0,
      seeded: false,
      loading: false,
      category: 'User Management',
      description: 'Create role-based access control system',
      icon: <Shield className="h-5 w-5" />,
      color: 'bg-blue-600'
    },
    {
      name: 'Demo Customers',
      endpoint: '/api/customers/seed-demo',
      count: 0,
      seeded: false,
      loading: false,
      category: 'Customer Management',
      description: 'Create demo customers for testing customer management',
      icon: <UserCheck className="h-5 w-5" />,
      color: 'bg-green-500'
    },
    {
      name: 'Demo Orders',
      endpoint: '/api/orders/seed-demo',
      count: 0,
      seeded: false,
      loading: false,
      category: 'Order Management',
      description: 'Create demo orders with items and payment details',
      icon: <Receipt className="h-5 w-5" />,
      color: 'bg-green-600'
    },

    // Photography Industry Data
    {
      name: 'Photography Brands',
      endpoint: '/api/brands/seed-photography',
      count: 0,
      seeded: false,
      loading: false,
      category: 'Photography Industry',
      description: 'Add photography equipment brands (Canon, Nikon, Sony, etc.)',
      icon: <Building2 className="h-5 w-5" />,
      color: 'bg-purple-500'
    },
    {
      name: 'Product Categories',
      endpoint: '/api/categories/seed-photography',
      count: 0,
      seeded: false,
      loading: false,
      category: 'Photography Industry',
      description: 'Add photography product categories and subcategories',
      icon: <Tag className="h-5 w-5" />,
      color: 'bg-purple-600'
    },
    {
      name: 'Photography Products',
      endpoint: '/api/products/seed-photography',
      count: 0,
      seeded: false,
      loading: false,
      category: 'Photography Industry',
      description: 'Add photography equipment and services',
      icon: <Package className="h-5 w-5" />,
      color: 'bg-purple-700'
    },

    // HR Management
    {
      name: 'HR Departments',
      endpoint: '/api/hr/departments/seed-egyptian',
      count: 0,
      seeded: false,
      loading: false,
      category: 'HR Management',
      description: 'Create Egyptian organizational departments',
      icon: <Briefcase className="h-5 w-5" />,
      color: 'bg-orange-500'
    },
    {
      name: 'HR Employees',
      endpoint: '/api/hr/employees/seed-egyptian',
      count: 0,
      seeded: false,
      loading: false,
      category: 'HR Management',
      description: 'Create Egyptian employees with authentic names',
      icon: <UserPlus className="h-5 w-5" />,
      color: 'bg-orange-600'
    },
    {
      name: 'Organization Chart',
      endpoint: '/api/hr/organization-chart/seed-egyptian',
      count: 0,
      seeded: false,
      loading: false,
      category: 'HR Management',
      description: 'Create hierarchical organization structure',
      icon: <Network className="h-5 w-5" />,
      color: 'bg-orange-700'
    },
    {
      name: 'HR Attendance',
      endpoint: '/api/hr/attendance/seed',
      count: 0,
      seeded: false,
      loading: false,
      category: 'HR Management',
      description: 'Create attendance records and time tracking data',
      icon: <Clock className="h-5 w-5" />,
      color: 'bg-orange-800'
    },
    {
      name: 'Leave Management',
      endpoint: '/api/hr/leave/seed',
      count: 0,
      seeded: false,
      loading: false,
      category: 'HR Management',
      description: 'Create leave requests and holiday data',
      icon: <Calendar className="h-5 w-5" />,
      color: 'bg-orange-900'
    },
    {
      name: 'Payroll Data',
      endpoint: '/api/hr/payroll/seed',
      count: 0,
      seeded: false,
      loading: false,
      category: 'HR Management',
      description: 'Create payroll structures and salary data',
      icon: <DollarSign className="h-5 w-5" />,
      color: 'bg-yellow-500'
    },
    {
      name: 'Training Programs',
      endpoint: '/api/hr/training/seed',
      count: 0,
      seeded: false,
      loading: false,
      category: 'HR Management',
      description: 'Create training programs and certifications',
      icon: <GraduationCap className="h-5 w-5" />,
      color: 'bg-yellow-600'
    },
    {
      name: 'Employee Separation',
      endpoint: '/api/hr/separation/seed',
      count: 0,
      seeded: false,
      loading: false,
      category: 'HR Management',
      description: 'Create separation and exit interview data',
      icon: <UserMinus className="h-5 w-5" />,
      color: 'bg-yellow-700'
    },

    // Infrastructure
    {
      name: 'Demo Branches',
      endpoint: '/api/branches/seed-demo',
      count: 0,
      seeded: false,
      loading: false,
      category: 'Infrastructure',
      description: 'Create demo branches and locations',
      icon: <Globe className="h-5 w-5" />,
      color: 'bg-indigo-500'
    },
    {
      name: 'Employee Data',
      endpoint: '/api/employee/seed',
      count: 0,
      seeded: false,
      loading: false,
      category: 'Infrastructure',
      description: 'Create employee portal demo data',
      icon: <UserCheck className="h-5 w-5" />,
      color: 'bg-indigo-600'
    },

    // Task Management
    {
      name: 'Demo Tasks',
      endpoint: '/api/tasks/seed-demo',
      count: 0,
      seeded: false,
      loading: false,
      category: 'Task Management',
      description: 'Create demo tasks with various statuses, priorities, and assignments',
      icon: <Target className="h-5 w-5" />,
      color: 'bg-cyan-500'
    },

    // Communication
    {
      name: 'Demo Chats',
      endpoint: '/api/chats/seed-demo',
      count: 0,
      seeded: false,
      loading: false,
      category: 'Communication',
      description: 'Create demo chats, channels, and messages for team communication',
      icon: <MessageCircle className="h-5 w-5" />,
      color: 'bg-blue-500'
    },

    // Tax Compliance
    {
      name: 'ETA Demo Data',
      endpoint: '/api/eta/seed-demo',
      count: 0,
      seeded: false,
      loading: false,
      category: 'Tax Compliance',
      description: 'Create demo ETA products and invoices for Egyptian Tax Authority compliance',
      icon: <Building2 className="h-5 w-5" />,
      color: 'bg-red-500'
    }
  ];

  // Fetch status for all seeds
  const fetchAllStatuses = async () => {
    setLoading(true);
    const statuses = initializeSeedStatuses();
    
    try {
      const promises = statuses.map(async (status) => {
        try {
          const response = await fetch(status.endpoint);
          const data = await response.json();
          
          return {
            ...status,
            count: data.count || data.data?.count || 0,
            seeded: (data.count || data.data?.count || 0) > 0
          };
        } catch (error) {
          console.error(`Error fetching status for ${status.name}:`, error);
          return status;
        }
      });

      const updatedStatuses = await Promise.all(promises);
      setSeedStatuses(updatedStatuses);
    } catch (error) {
      console.error('Error fetching seed statuses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Seed specific data
  const seedData = async (status: SeedStatus) => {
    setSeedStatuses(prev => prev.map(s => 
      s.name === status.name ? { ...s, loading: true } : s
    ));

    try {
      const response = await fetch(status.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success!",
          description: `${status.name} seeded successfully`,
        });
        
        // Update the specific status
        setSeedStatuses(prev => prev.map(s => 
          s.name === status.name 
            ? { ...s, seeded: true, count: data.insertedCount || data.count || 0, loading: false }
            : s
        ));
      } else {
        toast({
          title: "Error",
          description: data.error || `Failed to seed ${status.name}`,
          variant: "destructive",
        });
        
        setSeedStatuses(prev => prev.map(s => 
          s.name === status.name ? { ...s, loading: false } : s
        ));
      }
    } catch (error) {
      console.error(`Error seeding ${status.name}:`, error);
      toast({
        title: "Error",
        description: `Failed to seed ${status.name}`,
        variant: "destructive",
      });
      
      setSeedStatuses(prev => prev.map(s => 
        s.name === status.name ? { ...s, loading: false } : s
      ));
    }
  };

  // Clear specific data
  const clearData = async (status: SeedStatus) => {
    if (!confirm(`Are you sure you want to delete all ${status.name.toLowerCase()}? This action cannot be undone.`)) {
      return;
    }

    setSeedStatuses(prev => prev.map(s => 
      s.name === status.name ? { ...s, loading: true } : s
    ));

    try {
      const response = await fetch(status.endpoint, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success!",
          description: `${status.name} cleared successfully`,
        });
        
        setSeedStatuses(prev => prev.map(s => 
          s.name === status.name 
            ? { ...s, seeded: false, count: 0, loading: false }
            : s
        ));
      } else {
        toast({
          title: "Error",
          description: data.error || `Failed to clear ${status.name}`,
          variant: "destructive",
        });
        
        setSeedStatuses(prev => prev.map(s => 
          s.name === status.name ? { ...s, loading: false } : s
        ));
      }
    } catch (error) {
      console.error(`Error clearing ${status.name}:`, error);
      toast({
        title: "Error",
        description: `Failed to clear ${status.name}`,
        variant: "destructive",
      });
      
      setSeedStatuses(prev => prev.map(s => 
        s.name === status.name ? { ...s, loading: false } : s
      ));
    }
  };

  // Seed all data in a category
  const seedCategory = async (category: string) => {
    const categorySeeds = seedStatuses.filter(s => s.category === category && !s.seeded);
    
    for (const seed of categorySeeds) {
      await seedData(seed);
      // Small delay between seeds to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  // Clear all data in a category
  const clearCategory = async (category: string) => {
    if (!confirm(`Are you sure you want to clear all ${category.toLowerCase()} data? This action cannot be undone.`)) {
      return;
    }

    const categorySeeds = seedStatuses.filter(s => s.category === category && s.seeded);
    
    for (const seed of categorySeeds) {
      await clearData(seed);
      // Small delay between clears
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  // Get categories
  const categories = Array.from(new Set(seedStatuses.map(s => s.category)));

  // Calculate totals
  const totalSeeds = seedStatuses.length;
  const seededCount = seedStatuses.filter(s => s.seeded).length;
  const totalRecords = seedStatuses.reduce((sum, s) => sum + s.count, 0);

  useEffect(() => {
    fetchAllStatuses();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading demo data status...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Demo Data Management</h1>
        <p className="text-muted-foreground">
          Comprehensive demo data management for testing all system features
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Seeds</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSeeds}</div>
            <p className="text-xs text-muted-foreground">Available seed types</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seeded</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{seededCount}</div>
            <p className="text-xs text-muted-foreground">Completed seeds</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRecords.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Demo records created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((seededCount / totalSeeds) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Completion rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Tabs */}
      <Tabs defaultValue={categories[0]} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category} value={category} className="space-y-6">
            {/* Category Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{category}</h2>
                <p className="text-muted-foreground">
                  Manage {category.toLowerCase()} demo data
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => seedCategory(category)}
                  disabled={seedStatuses.filter(s => s.category === category && !s.seeded).length === 0}
                  className="flex items-center gap-2"
                >
                  <Database className="h-4 w-4" />
                  Seed All {category}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => clearCategory(category)}
                  disabled={seedStatuses.filter(s => s.category === category && s.seeded).length === 0}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All {category}
                </Button>
              </div>
            </div>

            {/* Seed Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {seedStatuses
                .filter(s => s.category === category)
                .map((status) => (
                  <Card key={status.name}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <div className={`p-2 rounded-full ${status.color} text-white`}>
                          {status.icon}
                        </div>
                        {status.name}
                      </CardTitle>
                      <Badge variant={status.seeded ? "default" : "secondary"}>
                        {status.seeded ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {status.seeded ? 'Seeded' : 'Not Seeded'}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {status.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Records: {status.count.toLocaleString()}
                        </span>
                        {status.seeded && (
                          <Badge variant="outline" className="text-green-600">
                            Active
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => seedData(status)}
                          disabled={status.loading || status.seeded}
                          size="sm"
                          className="flex-1"
                        >
                          {status.loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Database className="h-4 w-4" />
                          )}
                          {status.loading ? 'Seeding...' : 'Seed'}
                        </Button>
                        
                        {status.seeded && (
                          <Button
                            onClick={() => clearData(status)}
                            disabled={status.loading}
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                          >
                            {status.loading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            Clear
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => {
                seedStatuses.forEach(status => {
                  if (!status.seeded) {
                    seedData(status);
                  }
                });
              }}
              disabled={seedStatuses.filter(s => !s.seeded).length === 0}
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              Seed All Missing Data
            </Button>
            
            <Button
              variant="outline"
              onClick={fetchAllStatuses}
              className="flex items-center gap-2"
            >
              <Activity className="h-4 w-4" />
              Refresh Status
            </Button>
            
            <Button
              variant="destructive"
              onClick={() => {
                if (confirm('Are you sure you want to clear ALL demo data? This action cannot be undone.')) {
                  seedStatuses.forEach(status => {
                    if (status.seeded) {
                      clearData(status);
                    }
                  });
                }
              }}
              disabled={seedStatuses.filter(s => s.seeded).length === 0}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Information */}
      <Alert className="mt-8">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Demo Data Management:</strong> This page allows you to manage all demo data for testing the system. 
          Each category contains related seed data that can be created or cleared independently. 
          Use the category tabs to organize and manage different types of demo data.
        </AlertDescription>
      </Alert>
    </div>
  );
}

