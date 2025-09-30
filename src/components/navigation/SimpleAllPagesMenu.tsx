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
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslation } from '@/hooks/use-translation';
import { 
  Grid3X3,
  Search,
  Star as StarIcon,
  ArrowRight,
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
  UserX,
  Clock,
  List
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
  accessLevel?: 'public' | 'private' | 'admin';
}

export function SimpleAllPagesMenu() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('category');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Comprehensive list of all pages in the system
  const allPages: PageItem[] = [
    // Core
    { href: '/', label: 'Dashboard', icon: Home, category: 'Core', description: 'Main dashboard with key metrics and overview', accessLevel: 'public' },
    { href: '/overview', label: 'Overview', icon: Eye, category: 'Core', description: 'System overview and module navigation', accessLevel: 'public' },
    { href: '/navigation', label: 'Navigation', icon: Grid3X3, category: 'Core', description: 'Enhanced navigation system', accessLevel: 'public' },
    
    // Sales
    { href: '/orders', label: 'All Orders', icon: FileText, category: 'Sales', description: 'View and manage all sales orders', accessLevel: 'public' },
    { href: '/orders/create', label: 'Create Order', icon: Plus, category: 'Sales', description: 'Create new sales orders', isPopular: true, accessLevel: 'public' },
    { href: '/orders/pipeline', label: 'Order Pipeline', icon: Workflow, category: 'Sales', description: 'Track orders through the sales pipeline', accessLevel: 'public' },
    { href: '/orders/status', label: 'Status Tracking', icon: Activity, category: 'Sales', description: 'Monitor order status and progress', accessLevel: 'public' },
    { href: '/orders/templates', label: 'Order Templates', icon: FileText, category: 'Sales', description: 'Manage order templates for quick creation', accessLevel: 'public' },
    { href: '/pos', label: 'Point of Sale', icon: ShoppingCart, category: 'Sales', description: 'Point of sale system for retail operations', isPopular: true, accessLevel: 'public' },
    { href: '/track-order', label: 'Track Order', icon: Search, category: 'Sales', description: 'Track order status and location', accessLevel: 'public' },
    { href: '/customers', label: 'All Customers', icon: Users, category: 'Sales', description: 'Manage customer database and relationships', accessLevel: 'public' },
    { href: '/customers/balance', label: 'Account Balances', icon: CreditCard, category: 'Sales', description: 'View customer account balances and payments', accessLevel: 'public' },
    { href: '/customers/analytics', label: 'Customer Analytics', icon: TrendingUp, category: 'Sales', description: 'Customer behavior and sales analytics', accessLevel: 'public' },
    { href: '/customers/notes', label: 'Customer Communication', icon: MessageSquare, category: 'Sales', description: 'Customer notes and communication history', accessLevel: 'public' },
    
    // Products
    { href: '/products', label: 'All Products', icon: Package, category: 'Products', description: 'View and manage product catalog', accessLevel: 'public' },
    { href: '/products/manage', label: 'Manage Products', icon: Package, category: 'Products', description: 'Add, edit, and manage product information', isPopular: true, accessLevel: 'public' },
    { href: '/products/types', label: 'Product Types', icon: Package, category: 'Products', description: 'Manage different product types and categories', accessLevel: 'public' },
    { href: '/products/kits-bundles', label: 'Kits & Bundles', icon: Package, category: 'Products', description: 'Create and manage product bundles', accessLevel: 'public' },
    { href: '/categories', label: 'Product Categories', icon: Tag, category: 'Products', description: 'Organize products into categories', accessLevel: 'public' },
    { href: '/brands', label: 'Brands', icon: Building2, category: 'Products', description: 'Manage product brands and manufacturers', accessLevel: 'public' },
    { href: '/price-lists', label: 'All Price Lists', icon: DollarSign, category: 'Products', description: 'Manage product pricing and price lists', accessLevel: 'public' },
    { href: '/price-lists/bulk-editor', label: 'Bulk Price Editor', icon: TrendingUp, category: 'Products', description: 'Bulk edit product prices and discounts', isPopular: true, accessLevel: 'public' },
    
    // Inventory
    { href: '/inventory', label: 'Stock Overview', icon: Package2, category: 'Inventory', description: 'View inventory levels and stock status', accessLevel: 'public' },
    { href: '/warehouse', label: 'Warehouse Operations', icon: Warehouse, category: 'Inventory', description: 'Manage warehouse operations and logistics', accessLevel: 'public' },
    
    // Purchasing
    { href: '/vendors', label: 'All Vendors', icon: Building2, category: 'Purchasing', description: 'Manage vendor relationships and information', accessLevel: 'public' },
    { href: '/vendors/balance', label: 'Vendor Balances', icon: CreditCard, category: 'Purchasing', description: 'View vendor account balances and payments', accessLevel: 'public' },
    { href: '/vendors/analytics', label: 'Vendor Analytics', icon: TrendingUp, category: 'Purchasing', description: 'Vendor performance and analytics', accessLevel: 'public' },
    { href: '/vendors/notes', label: 'Vendor Communication', icon: MessageSquare, category: 'Purchasing', description: 'Vendor notes and communication history', accessLevel: 'public' },
    { href: '/warehouse/purchase-orders', label: 'Purchase Orders', icon: FileText, category: 'Purchasing', description: 'Manage purchase orders and procurement', accessLevel: 'public' },
    { href: '/purchase-orders/create', label: 'Create Purchase Order', icon: Plus, category: 'Purchasing', description: 'Create new purchase orders', isPopular: true, accessLevel: 'public' },
    { href: '/warehouse/goods-receipts', label: 'Goods Receipts', icon: Truck, category: 'Purchasing', description: 'Process incoming goods and deliveries', accessLevel: 'public' },
    
    // Locations
    { href: '/stores', label: 'All Stores', icon: Store, category: 'Locations', description: 'Manage store locations and operations', accessLevel: 'public' },
    { href: '/stores/dashboard', label: 'Store Dashboard', icon: BarChart3, category: 'Locations', description: 'Store performance dashboard and metrics', accessLevel: 'public' },
    { href: '/stores/analytics', label: 'Store Analytics', icon: TrendingUp, category: 'Locations', description: 'Store sales and performance analytics', accessLevel: 'public' },
    { href: '/warehouses', label: 'All Warehouses', icon: Warehouse, category: 'Locations', description: 'Manage warehouse locations and facilities', accessLevel: 'public' },
    { href: '/branches', label: 'Branches', icon: MapPin, category: 'Locations', description: 'Manage company branches and offices', accessLevel: 'public' },
    
    // Analytics
    { href: '/analytics', label: 'Business Analytics', icon: BarChart3, category: 'Analytics', description: 'Comprehensive business intelligence dashboard', isPopular: true, accessLevel: 'public' },
    { href: '/products/dashboard', label: 'Product Dashboard', icon: BarChart3, category: 'Analytics', description: 'Product performance and analytics dashboard', accessLevel: 'public' },
    { href: '/products/analytics', label: 'Product Analytics', icon: TrendingUp, category: 'Analytics', description: 'Detailed product analytics and insights', accessLevel: 'public' },
    { href: '/customers/analytics', label: 'Customer Analytics', icon: TrendingUp, category: 'Analytics', description: 'Customer behavior and engagement analytics', accessLevel: 'public' },
    { href: '/vendors/analytics', label: 'Vendor Analytics', icon: TrendingUp, category: 'Analytics', description: 'Vendor performance and relationship analytics', accessLevel: 'public' },
    { href: '/stores/analytics', label: 'Store Analytics', icon: TrendingUp, category: 'Analytics', description: 'Store performance and sales analytics', accessLevel: 'public' },
    
    // HR
    { href: '/hr', label: 'HR Dashboard', icon: BarChart3, category: 'HR', description: 'Human resources dashboard and overview', accessLevel: 'private' },
    { href: '/hr/employees', label: 'Employees', icon: UserPlus, category: 'HR', description: 'Employee database and management', isPopular: true, accessLevel: 'private' },
    { href: '/hr/departments', label: 'Departments', icon: Building2, category: 'HR', description: 'Department management and organization', accessLevel: 'private' },
    { href: '/hr/organization-chart', label: 'Organization Chart', icon: Network, category: 'HR', description: 'Company organizational structure', accessLevel: 'private' },
    { href: '/hr/leave', label: 'Leave Management', icon: CalendarDays, category: 'HR', description: 'Employee leave requests and management', accessLevel: 'private' },
    { href: '/hr/payroll', label: 'Payroll', icon: DollarSign, category: 'HR', description: 'Employee payroll and compensation', accessLevel: 'private' },
    { href: '/hr/performance', label: 'Performance Management', icon: TrendingUp, category: 'HR', description: 'Employee performance tracking and reviews', accessLevel: 'private' },
    { href: '/hr/recruitment', label: 'Recruitment', icon: Briefcase, category: 'HR', description: 'Job postings and recruitment process', accessLevel: 'private' },
    { href: '/hr/policies', label: 'HR Policies', icon: ClipboardList, category: 'HR', description: 'Company policies and procedures', accessLevel: 'private' },
    { href: '/hr/separation', label: 'Separation & Offboarding', icon: UserX, category: 'HR', description: 'Employee separation and exit process', accessLevel: 'private' },
    { href: '/hr/attendance', label: 'Attendance & Time Tracking', icon: Clock, category: 'HR', description: 'Employee attendance and time management', isNew: true, accessLevel: 'private' },
    
    // Training
    { href: '/hr/training', label: 'Training Dashboard', icon: BarChart3, category: 'Training', description: 'Training programs and development overview', accessLevel: 'private' },
    { href: '/hr/training/programs', label: 'Training Programs', icon: BookOpen, category: 'Training', description: 'Manage training programs and courses', accessLevel: 'private' },
    { href: '/hr/training/schedules', label: 'Training Schedules', icon: Calendar, category: 'Training', description: 'Schedule and manage training sessions', accessLevel: 'private' },
    { href: '/hr/training/certifications', label: 'Certifications', icon: Award, category: 'Training', description: 'Track employee certifications and skills', accessLevel: 'private' },
    { href: '/hr/training/skill-gaps', label: 'Skill Gap Analysis', icon: Target, category: 'Training', description: 'Analyze skill gaps and training needs', accessLevel: 'private' },
    
    // Employee Portal
    { href: '/employee', label: 'Employee Dashboard', icon: BarChart3, category: 'Employee', description: 'Personal employee dashboard', accessLevel: 'private' },
    { href: '/employee/profile', label: 'Profile Management', icon: User, category: 'Employee', description: 'Manage personal profile and information', accessLevel: 'private' },
    { href: '/employee/payslips', label: 'Payslips', icon: DollarSign, category: 'Employee', description: 'View and download payslips', accessLevel: 'private' },
    { href: '/employee/leave', label: 'Leave Requests', icon: Calendar, category: 'Employee', description: 'Submit and track leave requests', accessLevel: 'private' },
    { href: '/employee/announcements', label: 'Announcements', icon: Bell, category: 'Employee', description: 'Company announcements and updates', accessLevel: 'private' },
    { href: '/employee/messages', label: 'Messages', icon: MessageSquare, category: 'Employee', description: 'Internal messaging system', accessLevel: 'private' },
    
    // Admin
    { href: '/users', label: 'All Users', icon: User, category: 'Admin', description: 'Manage system users and accounts', accessLevel: 'admin' },
    { href: '/users/roles', label: 'Roles & Permissions', icon: UserCheck, category: 'Admin', description: 'Manage user roles and permissions', accessLevel: 'admin' },
    { href: '/users/activity', label: 'Activity Logs', icon: Activity, category: 'Admin', description: 'System activity logs and audit trail', accessLevel: 'admin' },
    { href: '/users/security', label: 'Security', icon: Shield, category: 'Admin', description: 'System security settings and monitoring', accessLevel: 'admin' },
    { href: '/admin/seed-brands', label: 'Seed Demo Data', icon: Package, category: 'Admin', description: 'Initialize system with demo data', accessLevel: 'admin' },
    { href: '/settings/company', label: 'Company Settings', icon: Building2, category: 'Admin', description: 'Company information and configuration', accessLevel: 'admin' },
    { href: '/settings', label: 'General Settings', icon: Settings, category: 'Admin', description: 'General system settings and preferences', accessLevel: 'admin' },
    
    // Personal
    { href: '/profile', label: 'Profile', icon: User, category: 'Personal', description: 'User profile and account settings', accessLevel: 'public' },
    { href: '/notifications', label: 'Notifications', icon: Bell, category: 'Personal', description: 'System notifications and alerts', accessLevel: 'public' },
    { href: '/help', label: 'Help Center', icon: HelpCircle, category: 'Personal', description: 'Help documentation and support', accessLevel: 'public' },
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

  const toggleFavorite = (href: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href];
      localStorage.setItem('all-pages-favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isActive = (href: string) => pathname === href;
  const isFavorited = (href: string) => favorites.includes(href);

  // Load favorites from localStorage
  React.useEffect(() => {
    const savedFavorites = localStorage.getItem('all-pages-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Render page card
  const renderPageCard = (page: PageItem) => {
    const isPageActive = isActive(page.href);
    const isPageFavorited = isFavorited(page.href);

    return (
      <div
        key={page.href}
        className={cn(
          "group relative border rounded-lg p-4 transition-all duration-200 hover:shadow-md",
          isPageActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={cn(
              "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
              isPageActive ? "bg-primary text-primary-foreground" : "bg-muted"
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
              className="h-6 w-6 p-0"
              onClick={() => toggleFavorite(page.href)}
            >
              {isPageFavorited ? (
                <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ) : (
                <StarIcon className="h-4 w-4" />
              )}
            </Button>
            
            <Link href={page.href}>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPages.map(renderPageCard)}
            </div>

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
