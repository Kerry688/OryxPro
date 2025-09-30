'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/hooks/use-translation';
import { 
  Home,
  Package,
  Users,
  Building2,
  Warehouse,
  Store,
  ShoppingCart,
  BarChart3,
  Settings,
  User,
  Bell,
  HelpCircle,
  FileText,
  DollarSign,
  Truck,
  CreditCard,
  TrendingUp,
  MessageSquare,
  Shield,
  Activity,
  UserCheck,
  MapPin,
  Tag,
  Search,
  Package2,
  Plus,
  Workflow,
  Eye,
  UserPlus,
  Calendar,
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
  List,
  Layers,
  Zap,
  Star as StarIcon,
  Pin,
  History,
  Bookmark,
  Globe,
  Filter,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  category: string;
  subcategory?: string;
  isNew?: boolean;
  isPopular?: boolean;
  isBeta?: boolean;
  tags?: string[];
  lastModified?: Date;
  accessLevel?: 'public' | 'private' | 'admin';
}

export function AllPagesMenu() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('category');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentPages, setRecentPages] = useState<string[]>([]);

  // Comprehensive list of all pages in the system
  const allPages: PageItem[] = [
    // === CORE ===
    {
      href: '/',
      label: 'Dashboard',
      icon: Home,
      description: 'Main dashboard with key metrics and overview',
      category: 'Core',
      accessLevel: 'public',
      tags: ['dashboard', 'overview', 'metrics']
    },
    {
      href: '/overview',
      label: 'Overview',
      icon: Eye,
      description: 'System overview and module navigation',
      category: 'Core',
      accessLevel: 'public',
      tags: ['overview', 'modules', 'navigation']
    },

    // === SALES ===
    {
      href: '/orders',
      label: 'All Orders',
      icon: FileText,
      description: 'View and manage all sales orders',
      category: 'Sales',
      subcategory: 'Orders',
      accessLevel: 'public',
      tags: ['orders', 'sales', 'management']
    },
    {
      href: '/orders/create',
      label: 'Create Order',
      icon: Plus,
      description: 'Create new sales orders',
      category: 'Sales',
      subcategory: 'Orders',
      isPopular: true,
      accessLevel: 'public',
      tags: ['orders', 'create', 'sales']
    },
    {
      href: '/orders/pipeline',
      label: 'Order Pipeline',
      icon: Workflow,
      description: 'Track orders through the sales pipeline',
      category: 'Sales',
      subcategory: 'Orders',
      accessLevel: 'public',
      tags: ['pipeline', 'workflow', 'tracking']
    },
    {
      href: '/orders/status',
      label: 'Status Tracking',
      icon: Activity,
      description: 'Monitor order status and progress',
      category: 'Sales',
      subcategory: 'Orders',
      accessLevel: 'public',
      tags: ['status', 'tracking', 'monitoring']
    },
    {
      href: '/orders/templates',
      label: 'Order Templates',
      icon: FileText,
      description: 'Manage order templates for quick creation',
      category: 'Sales',
      subcategory: 'Orders',
      accessLevel: 'public',
      tags: ['templates', 'orders', 'automation']
    },
    {
      href: '/pos',
      label: 'Point of Sale',
      icon: ShoppingCart,
      description: 'Point of sale system for retail operations',
      category: 'Sales',
      subcategory: 'POS',
      isPopular: true,
      accessLevel: 'public',
      tags: ['pos', 'retail', 'point-of-sale']
    },
    {
      href: '/track-order',
      label: 'Track Order',
      icon: Search,
      description: 'Track order status and location',
      category: 'Sales',
      subcategory: 'Tracking',
      accessLevel: 'public',
      tags: ['tracking', 'orders', 'status']
    },
    {
      href: '/customers',
      label: 'All Customers',
      icon: Users,
      description: 'Manage customer database and relationships',
      category: 'Sales',
      subcategory: 'Customers',
      accessLevel: 'public',
      tags: ['customers', 'database', 'relationships']
    },
    {
      href: '/customers/balance',
      label: 'Account Balances',
      icon: CreditCard,
      description: 'View customer account balances and payments',
      category: 'Sales',
      subcategory: 'Customers',
      accessLevel: 'public',
      tags: ['balances', 'payments', 'accounts']
    },
    {
      href: '/customers/analytics',
      label: 'Customer Analytics',
      icon: TrendingUp,
      description: 'Customer behavior and sales analytics',
      category: 'Sales',
      subcategory: 'Analytics',
      accessLevel: 'public',
      tags: ['analytics', 'customers', 'behavior']
    },
    {
      href: '/customers/notes',
      label: 'Customer Communication',
      icon: MessageSquare,
      description: 'Customer notes and communication history',
      category: 'Sales',
      subcategory: 'Communication',
      accessLevel: 'public',
      tags: ['communication', 'notes', 'history']
    },

    // === PRODUCTS ===
    {
      href: '/products',
      label: 'All Products',
      icon: Package,
      description: 'View and manage product catalog',
      category: 'Products',
      subcategory: 'Catalog',
      accessLevel: 'public',
      tags: ['products', 'catalog', 'inventory']
    },
    {
      href: '/products/manage',
      label: 'Manage Products',
      icon: Package,
      description: 'Add, edit, and manage product information',
      category: 'Products',
      subcategory: 'Management',
      isPopular: true,
      accessLevel: 'public',
      tags: ['products', 'management', 'catalog']
    },
    {
      href: '/products/types',
      label: 'Product Types',
      icon: Package,
      description: 'Manage different product types and categories',
      category: 'Products',
      subcategory: 'Types',
      accessLevel: 'public',
      tags: ['types', 'categories', 'classification']
    },
    {
      href: '/products/kits-bundles',
      label: 'Kits & Bundles',
      icon: Package,
      description: 'Create and manage product bundles',
      category: 'Products',
      subcategory: 'Bundles',
      accessLevel: 'public',
      tags: ['bundles', 'kits', 'packages']
    },
    {
      href: '/categories',
      label: 'Product Categories',
      icon: Tag,
      description: 'Organize products into categories',
      category: 'Products',
      subcategory: 'Categories',
      accessLevel: 'public',
      tags: ['categories', 'organization', 'taxonomy']
    },
    {
      href: '/brands',
      label: 'Brands',
      icon: Building2,
      description: 'Manage product brands and manufacturers',
      category: 'Products',
      subcategory: 'Brands',
      accessLevel: 'public',
      tags: ['brands', 'manufacturers', 'suppliers']
    },
    {
      href: '/price-lists',
      label: 'All Price Lists',
      icon: DollarSign,
      description: 'Manage product pricing and price lists',
      category: 'Products',
      subcategory: 'Pricing',
      accessLevel: 'public',
      tags: ['pricing', 'price-lists', 'costs']
    },
    {
      href: '/price-lists/bulk-editor',
      label: 'Bulk Price Editor',
      icon: TrendingUp,
      description: 'Bulk edit product prices and discounts',
      category: 'Products',
      subcategory: 'Pricing',
      isPopular: true,
      accessLevel: 'public',
      tags: ['bulk-edit', 'pricing', 'discounts']
    },

    // === INVENTORY ===
    {
      href: '/inventory',
      label: 'Stock Overview',
      icon: Package2,
      description: 'View inventory levels and stock status',
      category: 'Inventory',
      subcategory: 'Stock',
      accessLevel: 'public',
      tags: ['inventory', 'stock', 'levels']
    },
    {
      href: '/warehouse',
      label: 'Warehouse Operations',
      icon: Warehouse,
      description: 'Manage warehouse operations and logistics',
      category: 'Inventory',
      subcategory: 'Operations',
      accessLevel: 'public',
      tags: ['warehouse', 'operations', 'logistics']
    },

    // === PURCHASING ===
    {
      href: '/vendors',
      label: 'All Vendors',
      icon: Building2,
      description: 'Manage vendor relationships and information',
      category: 'Purchasing',
      subcategory: 'Vendors',
      accessLevel: 'public',
      tags: ['vendors', 'suppliers', 'relationships']
    },
    {
      href: '/vendors/balance',
      label: 'Vendor Balances',
      icon: CreditCard,
      description: 'View vendor account balances and payments',
      category: 'Purchasing',
      subcategory: 'Balances',
      accessLevel: 'public',
      tags: ['balances', 'payments', 'vendors']
    },
    {
      href: '/vendors/analytics',
      label: 'Vendor Analytics',
      icon: TrendingUp,
      description: 'Vendor performance and analytics',
      category: 'Purchasing',
      subcategory: 'Analytics',
      accessLevel: 'public',
      tags: ['analytics', 'performance', 'vendors']
    },
    {
      href: '/vendors/notes',
      label: 'Vendor Communication',
      icon: MessageSquare,
      description: 'Vendor notes and communication history',
      category: 'Purchasing',
      subcategory: 'Communication',
      accessLevel: 'public',
      tags: ['communication', 'notes', 'vendors']
    },
    {
      href: '/warehouse/purchase-orders',
      label: 'Purchase Orders',
      icon: FileText,
      description: 'Manage purchase orders and procurement',
      category: 'Purchasing',
      subcategory: 'Orders',
      accessLevel: 'public',
      tags: ['purchase-orders', 'procurement', 'orders']
    },
    {
      href: '/purchase-orders/create',
      label: 'Create Purchase Order',
      icon: Plus,
      description: 'Create new purchase orders',
      category: 'Purchasing',
      subcategory: 'Orders',
      isPopular: true,
      accessLevel: 'public',
      tags: ['create', 'purchase-orders', 'procurement']
    },
    {
      href: '/warehouse/goods-receipts',
      label: 'Goods Receipts',
      icon: Truck,
      description: 'Process incoming goods and deliveries',
      category: 'Purchasing',
      subcategory: 'Receipts',
      accessLevel: 'public',
      tags: ['receipts', 'deliveries', 'goods']
    },

    // === LOCATIONS ===
    {
      href: '/stores',
      label: 'All Stores',
      icon: Store,
      description: 'Manage store locations and operations',
      category: 'Locations',
      subcategory: 'Stores',
      accessLevel: 'public',
      tags: ['stores', 'locations', 'operations']
    },
    {
      href: '/stores/dashboard',
      label: 'Store Dashboard',
      icon: BarChart3,
      description: 'Store performance dashboard and metrics',
      category: 'Locations',
      subcategory: 'Analytics',
      accessLevel: 'public',
      tags: ['dashboard', 'performance', 'metrics']
    },
    {
      href: '/stores/analytics',
      label: 'Store Analytics',
      icon: TrendingUp,
      description: 'Store sales and performance analytics',
      category: 'Locations',
      subcategory: 'Analytics',
      accessLevel: 'public',
      tags: ['analytics', 'sales', 'performance']
    },
    {
      href: '/warehouses',
      label: 'All Warehouses',
      icon: Warehouse,
      description: 'Manage warehouse locations and facilities',
      category: 'Locations',
      subcategory: 'Warehouses',
      accessLevel: 'public',
      tags: ['warehouses', 'facilities', 'storage']
    },
    {
      href: '/branches',
      label: 'Branches',
      icon: MapPin,
      description: 'Manage company branches and offices',
      category: 'Locations',
      subcategory: 'Branches',
      accessLevel: 'public',
      tags: ['branches', 'offices', 'locations']
    },

    // === ANALYTICS ===
    {
      href: '/analytics',
      label: 'Business Analytics',
      icon: BarChart3,
      description: 'Comprehensive business intelligence dashboard',
      category: 'Analytics',
      subcategory: 'Business',
      isPopular: true,
      accessLevel: 'public',
      tags: ['analytics', 'business-intelligence', 'dashboard']
    },
    {
      href: '/products/dashboard',
      label: 'Product Dashboard',
      icon: BarChart3,
      description: 'Product performance and analytics dashboard',
      category: 'Analytics',
      subcategory: 'Products',
      accessLevel: 'public',
      tags: ['products', 'dashboard', 'analytics']
    },
    {
      href: '/products/analytics',
      label: 'Product Analytics',
      icon: TrendingUp,
      description: 'Detailed product analytics and insights',
      category: 'Analytics',
      subcategory: 'Products',
      accessLevel: 'public',
      tags: ['products', 'analytics', 'insights']
    },
    {
      href: '/customers/analytics',
      label: 'Customer Analytics',
      icon: TrendingUp,
      description: 'Customer behavior and engagement analytics',
      category: 'Analytics',
      subcategory: 'Customers',
      accessLevel: 'public',
      tags: ['customers', 'behavior', 'engagement']
    },
    {
      href: '/vendors/analytics',
      label: 'Vendor Analytics',
      icon: TrendingUp,
      description: 'Vendor performance and relationship analytics',
      category: 'Analytics',
      subcategory: 'Vendors',
      accessLevel: 'public',
      tags: ['vendors', 'performance', 'relationships']
    },
    {
      href: '/stores/analytics',
      label: 'Store Analytics',
      icon: TrendingUp,
      description: 'Store performance and sales analytics',
      category: 'Analytics',
      subcategory: 'Stores',
      accessLevel: 'public',
      tags: ['stores', 'performance', 'sales']
    },

    // === HUMAN RESOURCES ===
    {
      href: '/hr',
      label: 'HR Dashboard',
      icon: BarChart3,
      description: 'Human resources dashboard and overview',
      category: 'HR',
      subcategory: 'Dashboard',
      accessLevel: 'private',
      tags: ['hr', 'dashboard', 'overview']
    },
    {
      href: '/hr/employees',
      label: 'Employees',
      icon: UserPlus,
      description: 'Employee database and management',
      category: 'HR',
      subcategory: 'Employees',
      isPopular: true,
      accessLevel: 'private',
      tags: ['employees', 'database', 'management']
    },
    {
      href: '/hr/departments',
      label: 'Departments',
      icon: Building2,
      description: 'Department management and organization',
      category: 'HR',
      subcategory: 'Departments',
      accessLevel: 'private',
      tags: ['departments', 'organization', 'structure']
    },
    {
      href: '/hr/organization-chart',
      label: 'Organization Chart',
      icon: Network,
      description: 'Company organizational structure',
      category: 'HR',
      subcategory: 'Organization',
      accessLevel: 'private',
      tags: ['organization', 'chart', 'structure']
    },
    {
      href: '/hr/leave',
      label: 'Leave Management',
      icon: CalendarDays,
      description: 'Employee leave requests and management',
      category: 'HR',
      subcategory: 'Leave',
      accessLevel: 'private',
      tags: ['leave', 'requests', 'management']
    },
    {
      href: '/hr/payroll',
      label: 'Payroll',
      icon: DollarSign,
      description: 'Employee payroll and compensation',
      category: 'HR',
      subcategory: 'Payroll',
      accessLevel: 'private',
      tags: ['payroll', 'compensation', 'salary']
    },
    {
      href: '/hr/performance',
      label: 'Performance Management',
      icon: TrendingUp,
      description: 'Employee performance tracking and reviews',
      category: 'HR',
      subcategory: 'Performance',
      accessLevel: 'private',
      tags: ['performance', 'reviews', 'tracking']
    },
    {
      href: '/hr/recruitment',
      label: 'Recruitment',
      icon: Briefcase,
      description: 'Job postings and recruitment process',
      category: 'HR',
      subcategory: 'Recruitment',
      accessLevel: 'private',
      tags: ['recruitment', 'hiring', 'jobs']
    },
    {
      href: '/hr/policies',
      label: 'HR Policies',
      icon: ClipboardList,
      description: 'Company policies and procedures',
      category: 'HR',
      subcategory: 'Policies',
      accessLevel: 'private',
      tags: ['policies', 'procedures', 'guidelines']
    },
    {
      href: '/hr/separation',
      label: 'Separation & Offboarding',
      icon: UserX,
      description: 'Employee separation and exit process',
      category: 'HR',
      subcategory: 'Separation',
      accessLevel: 'private',
      tags: ['separation', 'offboarding', 'exit']
    },
    {
      href: '/hr/attendance',
      label: 'Attendance & Time Tracking',
      icon: Clock,
      description: 'Employee attendance and time management',
      category: 'HR',
      subcategory: 'Attendance',
      isNew: true,
      accessLevel: 'private',
      tags: ['attendance', 'time-tracking', 'clock-in']
    },

    // === TRAINING ===
    {
      href: '/hr/training',
      label: 'Training Dashboard',
      icon: BarChart3,
      description: 'Training programs and development overview',
      category: 'Training',
      subcategory: 'Dashboard',
      accessLevel: 'private',
      tags: ['training', 'development', 'dashboard']
    },
    {
      href: '/hr/training/programs',
      label: 'Training Programs',
      icon: BookOpen,
      description: 'Manage training programs and courses',
      category: 'Training',
      subcategory: 'Programs',
      accessLevel: 'private',
      tags: ['training', 'programs', 'courses']
    },
    {
      href: '/hr/training/schedules',
      label: 'Training Schedules',
      icon: Calendar,
      description: 'Schedule and manage training sessions',
      category: 'Training',
      subcategory: 'Scheduling',
      accessLevel: 'private',
      tags: ['scheduling', 'sessions', 'training']
    },
    {
      href: '/hr/training/certifications',
      label: 'Certifications',
      icon: Award,
      description: 'Track employee certifications and skills',
      category: 'Training',
      subcategory: 'Certifications',
      accessLevel: 'private',
      tags: ['certifications', 'skills', 'tracking']
    },
    {
      href: '/hr/training/skill-gaps',
      label: 'Skill Gap Analysis',
      icon: Target,
      description: 'Analyze skill gaps and training needs',
      category: 'Training',
      subcategory: 'Analysis',
      accessLevel: 'private',
      tags: ['skill-gaps', 'analysis', 'needs']
    },

    // === EMPLOYEE PORTAL ===
    {
      href: '/employee',
      label: 'Employee Dashboard',
      icon: BarChart3,
      description: 'Personal employee dashboard',
      category: 'Employee',
      subcategory: 'Dashboard',
      accessLevel: 'private',
      tags: ['employee', 'dashboard', 'personal']
    },
    {
      href: '/employee/profile',
      label: 'Profile Management',
      icon: User,
      description: 'Manage personal profile and information',
      category: 'Employee',
      subcategory: 'Profile',
      accessLevel: 'private',
      tags: ['profile', 'personal', 'information']
    },
    {
      href: '/employee/payslips',
      label: 'Payslips',
      icon: DollarSign,
      description: 'View and download payslips',
      category: 'Employee',
      subcategory: 'Payroll',
      accessLevel: 'private',
      tags: ['payslips', 'salary', 'documents']
    },
    {
      href: '/employee/leave',
      label: 'Leave Requests',
      icon: Calendar,
      description: 'Submit and track leave requests',
      category: 'Employee',
      subcategory: 'Leave',
      accessLevel: 'private',
      tags: ['leave', 'requests', 'tracking']
    },
    {
      href: '/employee/announcements',
      label: 'Announcements',
      icon: Bell,
      description: 'Company announcements and updates',
      category: 'Employee',
      subcategory: 'Communication',
      accessLevel: 'private',
      tags: ['announcements', 'updates', 'communication']
    },
    {
      href: '/employee/messages',
      label: 'Messages',
      icon: MessageSquare,
      description: 'Internal messaging system',
      category: 'Employee',
      subcategory: 'Communication',
      accessLevel: 'private',
      tags: ['messages', 'communication', 'internal']
    },

    // === ADMIN ===
    {
      href: '/users',
      label: 'All Users',
      icon: User,
      description: 'Manage system users and accounts',
      category: 'Admin',
      subcategory: 'Users',
      accessLevel: 'admin',
      tags: ['users', 'accounts', 'management']
    },
    {
      href: '/users/roles',
      label: 'Roles & Permissions',
      icon: UserCheck,
      description: 'Manage user roles and permissions',
      category: 'Admin',
      subcategory: 'Security',
      accessLevel: 'admin',
      tags: ['roles', 'permissions', 'security']
    },
    {
      href: '/users/activity',
      label: 'Activity Logs',
      icon: Activity,
      description: 'System activity logs and audit trail',
      category: 'Admin',
      subcategory: 'Logs',
      accessLevel: 'admin',
      tags: ['logs', 'activity', 'audit']
    },
    {
      href: '/users/security',
      label: 'Security',
      icon: Shield,
      description: 'System security settings and monitoring',
      category: 'Admin',
      subcategory: 'Security',
      accessLevel: 'admin',
      tags: ['security', 'monitoring', 'settings']
    },
    {
      href: '/admin/seed-brands',
      label: 'Seed Demo Data',
      icon: Package,
      description: 'Initialize system with demo data',
      category: 'Admin',
      subcategory: 'Data',
      accessLevel: 'admin',
      tags: ['demo', 'data', 'initialization']
    },
    {
      href: '/settings/company',
      label: 'Company Settings',
      icon: Building2,
      description: 'Company information and configuration',
      category: 'Admin',
      subcategory: 'Settings',
      accessLevel: 'admin',
      tags: ['company', 'settings', 'configuration']
    },
    {
      href: '/settings',
      label: 'General Settings',
      icon: Settings,
      description: 'General system settings and preferences',
      category: 'Admin',
      subcategory: 'Settings',
      accessLevel: 'admin',
      tags: ['settings', 'preferences', 'configuration']
    },

    // === PERSONAL ===
    {
      href: '/profile',
      label: 'Profile',
      icon: User,
      description: 'User profile and account settings',
      category: 'Personal',
      subcategory: 'Profile',
      accessLevel: 'public',
      tags: ['profile', 'account', 'settings']
    },
    {
      href: '/notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'System notifications and alerts',
      category: 'Personal',
      subcategory: 'Notifications',
      accessLevel: 'public',
      tags: ['notifications', 'alerts', 'messages']
    },
    {
      href: '/help',
      label: 'Help Center',
      icon: HelpCircle,
      description: 'Help documentation and support',
      category: 'Personal',
      subcategory: 'Support',
      accessLevel: 'public',
      tags: ['help', 'documentation', 'support']
    },
  ];

  // Filter and sort pages
  const filteredPages = allPages
    .filter(page => {
      const matchesSearch = searchQuery === '' || 
        page.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || page.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.label.localeCompare(b.label);
        case 'category':
          return a.category.localeCompare(b.category) || a.label.localeCompare(b.label);
        case 'popular':
          if (a.isPopular && !b.isPopular) return -1;
          if (!a.isPopular && b.isPopular) return 1;
          return a.label.localeCompare(b.label);
        case 'new':
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return a.label.localeCompare(b.label);
        default:
          return a.label.localeCompare(b.label);
      }
    });

  // Get unique categories
  const categories = Array.from(new Set(allPages.map(page => page.category))).sort();

  // Render page card
  const renderPageCard = (page: PageItem) => {
    const isActive = pathname === page.href;
    const isFavorited = favorites.includes(page.href);

    return (
      <div
        key={page.href}
        className={cn(
          "group relative border rounded-lg p-4 transition-all duration-200 hover:shadow-md",
          isActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={cn(
              "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
              isActive ? "bg-primary text-primary-foreground" : "bg-muted"
            )}>
              <page.icon className="h-5 w-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-sm truncate">{page.label}</h3>
                {page.isNew && (
                  <Badge variant="secondary" className="text-xs">New</Badge>
                )}
                {page.isPopular && (
                  <Badge variant="default" className="text-xs">Popular</Badge>
                )}
                {page.isBeta && (
                  <Badge variant="outline" className="text-xs">Beta</Badge>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {page.description}
              </p>
              
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {page.category}
                </Badge>
                {page.subcategory && (
                  <Badge variant="outline" className="text-xs">
                    {page.subcategory}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => {
                setFavorites(prev => 
                  prev.includes(page.href) 
                    ? prev.filter(item => item !== page.href)
                    : [...prev, page.href]
                );
              }}
            >
              {isFavorited ? (
                <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ) : (
                <StarIcon className="h-4 w-4" />
              )}
            </Button>
            
            <Link href={page.href}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  // Render page list item
  const renderPageListItem = (page: PageItem) => {
    const isActive = pathname === page.href;
    const isFavorited = favorites.includes(page.href);

    return (
      <div
        key={page.href}
        className={cn(
          "group flex items-center gap-3 p-3 rounded-lg transition-colors",
          isActive ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
        )}
      >
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
          isActive ? "bg-primary text-primary-foreground" : "bg-muted"
        )}>
          <page.icon className="h-4 w-4" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm truncate">{page.label}</h3>
            {page.isNew && (
              <Badge variant="secondary" className="text-xs">New</Badge>
            )}
            {page.isPopular && (
              <Badge variant="default" className="text-xs">Popular</Badge>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground truncate">
            {page.description}
          </p>
          
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              {page.category}
            </Badge>
            {page.subcategory && (
              <Badge variant="outline" className="text-xs">
                {page.subcategory}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => {
              setFavorites(prev => 
                prev.includes(page.href) 
                  ? prev.filter(item => item !== page.href)
                  : [...prev, page.href]
              );
            }}
          >
            {isFavorited ? (
              <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ) : (
              <StarIcon className="h-4 w-4" />
            )}
          </Button>
          
          <Link href={page.href}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Grid3X3 className="h-4 w-4" />
          <span>All Pages</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Grid3X3 className="h-5 w-5" />
            All Pages
          </DialogTitle>
          <DialogDescription>
            Browse and access all pages in the system
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-[60vh]">
          {/* Header Controls */}
          <div className="p-6 pb-4 space-y-4 border-b">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-1 border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 w-8 p-0"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>{filteredPages.length} pages found</span>
              <span>{favorites.length} favorites</span>
              <span>{categories.length} categories</span>
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 p-6">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPages.map(renderPageCard)}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredPages.map(renderPageListItem)}
              </div>
            )}

            {filteredPages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No pages found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
