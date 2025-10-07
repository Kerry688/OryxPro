'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  House,
  ShoppingCart,
  Users,
  Package,
  Package2,
  Building2,
  Store,
  Warehouse,
  MapPin,
  BarChart3,
  User,
  Settings,
  Database,
  Eye,
  UserPlus,
  Calendar,
  DollarSign,
  TrendingUp,
  Briefcase,
  ClipboardList,
  Network,
  GraduationCap,
  BookOpen,
  Award,
  Target,
  CalendarDays,
  AlertTriangle,
  CheckSquare,
  XCircle,
  TrendingDown,
  Flag,
  Star,
  UserX,
  Clock,
  Grid3X3,
  Bell,
  MessageSquare,
  Car,
  Circle,
  Fuel,
  Navigation,
  Wrench,
  Tag,
  FileText,
  CreditCard,
  UserCheck,
  Truck
} from 'lucide-react';

// Define the navigation structure based on the sidebar
const navigationModules = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Main overview and key metrics',
    icon: House,
    color: 'bg-blue-500',
    links: [
      { href: '/', label: 'Dashboard', icon: House },
      { href: '/overview', label: 'System Overview', icon: Grid3X3 },
      { href: '/navigation', label: 'Navigation', icon: Grid3X3 }
    ]
  },
  {
    id: 'sales-customers',
    title: 'Sales & Customers',
    description: 'Order management and customer relations',
    icon: ShoppingCart,
    color: 'bg-green-500',
    links: [
      { href: '/orders', label: 'All Orders', icon: ShoppingCart },
      { href: '/orders/create', label: 'Create Order', icon: ShoppingCart },
      { href: '/orders/pipeline', label: 'Order Pipeline', icon: ShoppingCart },
      { href: '/orders/status', label: 'Status Tracking', icon: ShoppingCart },
      { href: '/orders/templates', label: 'Order Templates', icon: ShoppingCart },
      { href: '/orders/daily', label: 'Daily Orders', icon: ShoppingCart },
      { href: '/return-orders', label: 'Return Orders', icon: ShoppingCart },
      { href: '/return-orders/create', label: 'Create Return', icon: ShoppingCart },
      { href: '/pos', label: 'Point of Sale', icon: ShoppingCart },
      { href: '/track-order', label: 'Track Order', icon: ShoppingCart },
      { href: '/customers', label: 'All Customers', icon: Users },
      { href: '/customers/balance', label: 'Account Balances', icon: Users },
      { href: '/customers/analytics', label: 'Customer Analytics', icon: Users },
      { href: '/customers/notes', label: 'Notes & Communication', icon: Users }
    ]
  },
  {
    id: 'products-catalog',
    title: 'Products & Catalog',
    description: 'Product management and catalog operations',
    icon: Package,
    color: 'bg-purple-500',
    links: [
      { href: '/products', label: 'All Products', icon: Package },
      { href: '/products/create', label: 'Create Product', icon: Package },
      { href: '/products/dashboard', label: 'Product Dashboard', icon: BarChart3 },
      { href: '/products/analytics', label: 'Product Analytics', icon: BarChart3 },
      { href: '/products/types', label: 'Product Types', icon: Package },
      { href: '/products/kits-bundles', label: 'Kits & Bundles', icon: Package },
      { href: '/products/service-history', label: 'Service History', icon: Package },
      { href: '/brands', label: 'Brands', icon: Package },
      { href: '/categories', label: 'Categories', icon: Package },
      { href: '/price-lists', label: 'Price Lists', icon: Package },
      { href: '/price-lists/bulk-editor', label: 'Bulk Editor', icon: Package }
    ]
  },
  {
    id: 'asset-management',
    title: 'Asset Management',
    description: 'Comprehensive asset lifecycle and maintenance management',
    icon: Package,
    color: 'bg-blue-600',
    links: [
      { href: '/assets', label: 'Asset Registry', icon: Package },
      { href: '/assets/categories', label: 'Asset Categories', icon: Tag },
      { href: '/assets/depreciation', label: 'Depreciation Management', icon: DollarSign },
      { href: '/assets/maintenance', label: 'Maintenance Scheduling', icon: Wrench },
      { href: '/assets/analytics', label: 'Asset Analytics', icon: BarChart3 }
    ]
  },
  {
    id: 'fleet-management',
    title: 'Fleet Management',
    description: 'Vehicle fleet operations, tracking, and maintenance',
    icon: Car,
    color: 'bg-green-600',
    links: [
      { href: '/fleet', label: 'Vehicle Registry', icon: Car },
      { href: '/fleet/drivers', label: 'Driver Management', icon: Users },
      { href: '/fleet/trips', label: 'Trip Tracking', icon: Navigation },
      { href: '/fleet/fuel', label: 'Fuel Management', icon: Fuel },
      { href: '/fleet/maintenance', label: 'Fleet Maintenance', icon: Wrench },
      { href: '/fleet/tires', label: 'Tire Management', icon: Circle },
      { href: '/fleet/analytics', label: 'Fleet Analytics', icon: BarChart3 }
    ]
  },
  {
    id: 'finance-accounting',
    title: 'Finance & Accounting',
    description: 'Comprehensive financial management and accounting system',
    icon: DollarSign,
    color: 'bg-emerald-600',
    links: [
      { href: '/finance', label: 'Chart of Accounts', icon: DollarSign },
      { href: '/finance/journal-entries', label: 'Journal Entries', icon: FileText },
      { href: '/finance/periods', label: 'Period Management', icon: Calendar },
      { href: '/finance/currency', label: 'Multi-Currency', icon: DollarSign },
      { href: '/finance/payables', label: 'Accounts Payable', icon: CreditCard },
      { href: '/finance/receivables', label: 'Accounts Receivable', icon: FileText },
      { href: '/finance/cash-bank', label: 'Cash & Bank Management', icon: Building2 },
      { href: '/finance/assets', label: 'Fixed Assets Integration', icon: Package },
      { href: '/finance/budgeting', label: 'Budgeting & Planning', icon: TrendingUp },
      { href: '/finance/reports', label: 'Financial Reports', icon: BarChart3 }
    ]
  },
  {
    id: 'inventory-warehouse',
    title: 'Inventory & Warehouse',
    description: 'Stock management and warehouse operations',
    icon: Package2,
    color: 'bg-orange-500',
    links: [
      { href: '/inventory', label: 'Stock Overview', icon: Package2 },
      { href: '/warehouse', label: 'Warehouse Operations', icon: Warehouse }
    ]
  },
  {
    id: 'purchasing-suppliers',
    title: 'Purchasing & Suppliers',
    description: 'Vendor management and procurement',
    icon: Building2,
    color: 'bg-indigo-500',
    links: [
      { href: '/vendors', label: 'All Vendors', icon: Building2 },
      { href: '/vendors/balance', label: 'Account Balances', icon: Building2 },
      { href: '/vendors/analytics', label: 'Performance Analytics', icon: Building2 },
      { href: '/vendors/notes', label: 'Notes & Communication', icon: Building2 },
      { href: '/warehouse/purchase-orders', label: 'Purchase Orders', icon: Building2 },
      { href: '/purchase-orders/create', label: 'Create Purchase Order', icon: Building2 },
      { href: '/warehouse/goods-receipts', label: 'Goods Receipts', icon: Building2 }
    ]
  },
  {
    id: 'eta-compliance',
    title: 'ETA Compliance',
    description: 'Egyptian Tax Authority integration and compliance',
    icon: DollarSign,
    color: 'bg-yellow-500',
    links: [
      { href: '/eta', label: 'ETA Dashboard', icon: DollarSign },
      { href: '/eta/products', label: 'ETA Products', icon: Package },
      { href: '/eta/invoices', label: 'ETA Invoices', icon: DollarSign },
      { href: '/eta/sync', label: 'ETA Synchronization', icon: DollarSign },
      { href: '/eta/settings', label: 'ETA Settings', icon: Settings }
    ]
  },
  {
    id: 'locations-facilities',
    title: 'Locations & Facilities',
    description: 'Store, warehouse, and branch management',
    icon: Store,
    color: 'bg-teal-500',
    links: [
      { href: '/stores', label: 'All Stores', icon: Store },
      { href: '/stores/dashboard', label: 'Store Dashboard', icon: BarChart3 },
      { href: '/stores/analytics', label: 'Store Analytics', icon: BarChart3 },
      { href: '/warehouses', label: 'All Warehouses', icon: Warehouse },
      { href: '/branches', label: 'Branches', icon: MapPin }
    ]
  },
  {
    id: 'crm',
    title: 'CRM & Pipeline',
    description: 'Customer relationship management and sales pipeline',
    icon: Users,
    color: 'bg-cyan-500',
    links: [
      { href: '/crm', label: 'CRM Dashboard', icon: BarChart3 },
      { href: '/crm/leads', label: 'Leads', icon: Users },
      { href: '/crm/deals', label: 'Deals', icon: DollarSign },
      { href: '/crm/pipeline', label: 'Sales Pipeline', icon: TrendingUp },
      { href: '/crm/quotations', label: 'Quotations', icon: DollarSign },
      { href: '/crm/activities', label: 'Activities', icon: Calendar }
    ]
  },
  {
    id: 'tasks-projects',
    title: 'Tasks & Projects',
    description: 'Task management and project collaboration',
    icon: ClipboardList,
    color: 'bg-emerald-500',
    links: [
      { href: '/tasks', label: 'Task Management', icon: ClipboardList },
      { href: '/tasks/my-tasks', label: 'My Tasks', icon: User },
      { href: '/tasks/team', label: 'Team Tasks', icon: Users },
      { href: '/tasks/projects', label: 'Projects', icon: Briefcase },
      { href: '/tasks/kanban', label: 'Kanban Board', icon: Grid3X3 },
      { href: '/tasks/calendar', label: 'Task Calendar', icon: Calendar },
      { href: '/tasks/reports', label: 'Task Reports', icon: BarChart3 }
    ]
  },
  {
    id: 'analytics-reports',
    title: 'Analytics & Reports',
    description: 'Business intelligence and reporting',
    icon: BarChart3,
    color: 'bg-red-500',
    links: [
      { href: '/products/dashboard', label: 'Product Dashboard', icon: BarChart3 },
      { href: '/products/analytics', label: 'Product Analytics', icon: BarChart3 },
      { href: '/customers/analytics', label: 'Customer Analytics', icon: BarChart3 },
      { href: '/vendors/analytics', label: 'Vendor Analytics', icon: BarChart3 },
      { href: '/stores/analytics', label: 'Store Analytics', icon: BarChart3 }
    ]
  },
  {
    id: 'human-resources',
    title: 'Human Resources',
    description: 'Employee management and HR operations',
    icon: Users,
    color: 'bg-pink-500',
    links: [
      { href: '/hr', label: 'HR Dashboard', icon: BarChart3 },
      { href: '/hr/employees', label: 'Employees', icon: UserPlus },
      { href: '/hr/departments', label: 'Departments', icon: Building2 },
      { href: '/hr/organization-chart', label: 'Organization Chart', icon: Network },
      { href: '/hr/leave', label: 'Leave Management', icon: CalendarDays },
      { href: '/hr/payroll', label: 'Payroll Management', icon: DollarSign },
      { href: '/hr/performance', label: 'Performance', icon: TrendingUp },
      { href: '/hr/recruitment', label: 'Recruitment', icon: Briefcase },
      { href: '/hr/policies', label: 'Policies', icon: ClipboardList },
      { href: '/hr/separation', label: 'Separation & Offboarding', icon: UserX },
      { href: '/hr/attendance', label: 'Attendance & Time Tracking', icon: Clock }
    ]
  },
  {
    id: 'service-warranty',
    title: 'Service & Warranty',
    description: 'Service requests and warranty management',
    icon: ClipboardList,
    color: 'bg-amber-500',
    links: [
      { href: '/service-requests', label: 'Service Requests', icon: ClipboardList },
      { href: '/service-requests/schedule', label: 'Technician Schedule', icon: Calendar },
      { href: '/service-requests/work-orders', label: 'Work Orders', icon: ClipboardList },
      { href: '/service-requests/analytics', label: 'Service Analytics', icon: BarChart3 },
      { href: '/warranties', label: 'Warranty Management', icon: Award },
      { href: '/warranties/claims', label: 'Warranty Claims', icon: AlertTriangle }
    ]
  },
  {
    id: 'training-development',
    title: 'Training & Development',
    description: 'Training programs, certifications, and skill development',
    icon: GraduationCap,
    color: 'bg-purple-500',
    links: [
      { href: '/hr/training', label: 'Training Dashboard', icon: BarChart3 },
      { href: '/hr/training/programs', label: 'Training Programs', icon: BookOpen },
      { href: '/hr/training/schedules', label: 'Training Schedules', icon: Calendar },
      { href: '/hr/training/certifications', label: 'Certifications', icon: Award },
      { href: '/hr/training/skill-gaps', label: 'Skill Gap Analysis', icon: Target }
    ]
  },
  {
    id: 'employee-portal',
    title: 'Employee Portal',
    description: 'Self-service portal for employees',
    icon: User,
    color: 'bg-teal-500',
    links: [
      { href: '/employee', label: 'Dashboard', icon: BarChart3 },
      { href: '/employee/profile', label: 'Profile Management', icon: User },
      { href: '/employee/payslips', label: 'Payslips & Documents', icon: DollarSign },
      { href: '/employee/leave', label: 'Leave Management', icon: Calendar },
      { href: '/employee/announcements', label: 'Announcements', icon: Bell },
      { href: '/employee/messages', label: 'Messages', icon: MessageSquare }
    ]
  },
  {
    id: 'customer-portal',
    title: 'Customer Portal',
    description: 'Self-service portal for customers',
    icon: UserCheck,
    color: 'bg-indigo-500',
    links: [
      { href: '/customer-portal', label: 'Customer Dashboard', icon: BarChart3 },
      { href: '/customer-portal', label: 'Account Profile', icon: User },
      { href: '/customer-portal', label: 'Orders & Quotes', icon: ShoppingCart },
      { href: '/customer-portal', label: 'Invoices & Payments', icon: FileText },
      { href: '/customer-portal', label: 'Shipments & Tracking', icon: Truck }
    ]
  },
  {
    id: 'system-administration',
    title: 'System & Administration',
    description: 'User management and system settings',
    icon: User,
    color: 'bg-gray-500',
    links: [
      { href: '/users', label: 'All Users', icon: User },
      { href: '/users/roles', label: 'Roles & Permissions', icon: User },
      { href: '/users/activity', label: 'Activity Logs', icon: User },
      { href: '/users/security', label: 'Security', icon: User },
      { href: '/admin/seed-brands', label: 'Seed Demo Data', icon: Database },
      { href: '/settings', label: 'General Settings', icon: Settings },
      { href: '/settings/company', label: 'Company Settings', icon: Settings },
      { href: '/profile', label: 'Profile', icon: User }
    ]
  }
];

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Modules Overview</h1>
          <p className="text-muted-foreground">
            Complete system navigation - Access all modules and features from this central hub
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Modules</p>
                <p className="text-3xl">{navigationModules.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Pages</p>
                <p className="text-3xl">
                  {navigationModules.reduce((total, module) => total + module.links.length, 0)}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Systems</p>
                <p className="text-3xl">
                  {navigationModules.filter(module => module.id !== 'dashboard').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Status</p>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                  All Systems Operational
                </Badge>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckSquare className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {navigationModules.map((module) => (
          <Card key={module.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className={`h-12 w-12 ${module.color} rounded-lg flex items-center justify-center`}>
                  <module.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {module.links.length} links available
                  </CardDescription>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{module.description}</p>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-2">
                {module.links.map((link, index) => (
                  <Link key={index} href={link.href}>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start h-auto p-3 hover:bg-accent/50"
                    >
                      <link.icon className="h-4 w-4 mr-3 text-muted-foreground" />
                      <span className="text-sm">{link.label}</span>
                    </Button>
                  </Link>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <Badge variant="outline" className="text-xs">
                  {module.links.length} Pages
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-6 bg-muted/30 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
          <div>
            <strong>Total Pages:</strong> {navigationModules.reduce((total, module) => total + module.links.length, 0)}
          </div>
          <div>
            <strong>Active Modules:</strong> {navigationModules.length}
          </div>
          <div>
            <strong>System Version:</strong> OryxPro ERP v2.1
          </div>
          <div>
            <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US')}
          </div>
        </div>
      </div>
    </div>
  );
}