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
  MessageSquare
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
      { href: '/products/manage', label: 'Manage Products', icon: Package },
      { href: '/products/dashboard', label: 'Product Dashboard', icon: BarChart3 },
      { href: '/products/analytics', label: 'Product Analytics', icon: BarChart3 },
      { href: '/products/types', label: 'Product Types', icon: Package },
      { href: '/products/kits-bundles', label: 'Kits & Bundles', icon: Package },
      { href: '/brands', label: 'Brands', icon: Package },
      { href: '/categories', label: 'Categories', icon: Package },
      { href: '/price-lists', label: 'Price Lists', icon: Package }
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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">OryxPro ERP Overview</h1>
        <p className="text-xl text-gray-600">
          Complete system navigation - Access all modules and features from this central hub
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Modules</p>
                <p className="text-3xl font-bold text-gray-900">{navigationModules.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Total Links</p>
                <p className="text-3xl font-bold text-gray-900">
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
                <p className="text-sm font-medium text-gray-600">Active Systems</p>
                <p className="text-3xl font-bold text-gray-900">
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
                <p className="text-sm font-medium text-gray-600">System Status</p>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                  All Systems Operational
                </Badge>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Database className="h-6 w-6 text-green-600" />
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
              <p className="text-sm text-gray-600 mt-2">{module.description}</p>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-2">
                {module.links.map((link, index) => (
                  <Link key={index} href={link.href}>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start h-auto p-3 hover:bg-gray-50"
                    >
                      <link.icon className="h-4 w-4 mr-3 text-gray-500" />
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
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div>
            <strong>Total Pages:</strong> {navigationModules.reduce((total, module) => total + module.links.length, 0)}
          </div>
          <div>
            <strong>Modules:</strong> {navigationModules.length}
          </div>
          <div>
            <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US')}
          </div>
        </div>
      </div>
    </div>
  );
}