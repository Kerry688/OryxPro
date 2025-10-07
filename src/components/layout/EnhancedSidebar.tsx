'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useSidebar } from '@/contexts/sidebar-context';
import { useLanguage } from '@/contexts/language-context';
import { useTranslation } from '@/hooks/use-translation';
import { useAuth } from '@/contexts/AuthContext';
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
  LogOut,
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
  ChevronDown,
  ChevronRight,
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
  Pin,
  PinOff,
  Star as StarIcon,
  StarOff,
  MoreHorizontal,
  Filter,
  Grid3X3,
  List,
  Layout,
  Maximize2,
  Minimize2,
  Zap,
  Bookmark,
  History,
  Globe,
  Moon,
  Sun,
  Palette,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: NavItem[];
  isFavorite?: boolean;
  isPinned?: boolean;
  category?: string;
  description?: string;
  lastAccessed?: Date;
}

interface QuickAccessItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

interface SidebarSettings {
  showFavorites: boolean;
  showRecent: boolean;
  showPinned: boolean;
  showCategories: boolean;
  compactMode: boolean;
  showDescriptions: boolean;
  theme: 'light' | 'dark' | 'auto';
  layout: 'grid' | 'list' | 'compact';
}

export function EnhancedSidebar() {
  const { isCollapsed, isMobileOpen, toggleMobileOpen } = useSidebar();
  const { isRTL } = useLanguage();
  const { t } = useTranslation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [settings, setSettings] = useState<SidebarSettings>({
    showFavorites: true,
    showRecent: true,
    showPinned: true,
    showCategories: true,
    compactMode: false,
    showDescriptions: true,
    theme: 'auto',
    layout: 'list'
  });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [pinned, setPinned] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  // Load settings and data from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('sidebar-settings');
    const savedFavorites = localStorage.getItem('sidebar-favorites');
    const savedPinned = localStorage.getItem('sidebar-pinned');
    const savedRecent = localStorage.getItem('sidebar-recent');
    const savedCategories = localStorage.getItem('sidebar-categories');

    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedPinned) setPinned(JSON.parse(savedPinned));
    if (savedRecent) setRecent(JSON.parse(savedRecent));
    if (savedCategories) setCustomCategories(JSON.parse(savedCategories));
  }, []);

  // Save settings and data to localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('sidebar-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('sidebar-pinned', JSON.stringify(pinned));
  }, [pinned]);

  useEffect(() => {
    localStorage.setItem('sidebar-recent', JSON.stringify(recent));
  }, [recent]);

  useEffect(() => {
    localStorage.setItem('sidebar-categories', JSON.stringify(customCategories));
  }, [customCategories]);

  // Track page visits for recent items
  useEffect(() => {
    if (pathname && !pathname.includes('/api/')) {
      const newRecent = [pathname, ...recent.filter(item => item !== pathname)].slice(0, 10);
      setRecent(newRecent);
    }
  }, [pathname]);

  // Enhanced navigation items with categories and descriptions
  const navigationItems: NavItem[] = [
    // === CORE ===
    {
      href: '/',
      label: t('dashboard') || 'Dashboard',
      icon: Home,
      category: 'Core',
      description: 'Main dashboard and overview'
    },
    {
      href: '/overview',
      label: t('overview') || 'Overview',
      icon: Eye,
      category: 'Core',
      description: 'System overview and quick access'
    },

    // === SALES & CUSTOMERS ===
    {
      href: '/orders',
      label: t('sales') || 'Sales',
      icon: ShoppingCart,
      category: 'Sales',
      description: 'Order management and sales tracking',
      children: [
        { href: '/orders', label: t('allOrders') || 'All Orders', icon: FileText, category: 'Sales' },
        { href: '/orders/create', label: t('createOrder') || 'Create Order', icon: Plus, category: 'Sales' },
        { href: '/orders/pipeline', label: t('orderPipeline') || 'Order Pipeline', icon: Workflow, category: 'Sales' },
        { href: '/orders/status', label: t('statusTracking') || 'Status Tracking', icon: Activity, category: 'Sales' },
        { href: '/orders/templates', label: t('orderTemplates') || 'Order Templates', icon: FileText, category: 'Sales' },
        { href: '/pos', label: t('pointOfSale') || 'Point Of Sale', icon: ShoppingCart, category: 'Sales' },
        { href: '/track-order', label: t('trackOrder') || 'Track Order', icon: Search, category: 'Sales' },
      ]
    },
    {
      href: '/customers',
      label: t('customers') || 'Customers',
      icon: Users,
      category: 'Sales',
      description: 'Customer management and relationships',
      children: [
        { href: '/customers', label: t('allCustomers') || 'All Customers', icon: Users, category: 'Sales' },
        { href: '/customers/balance', label: t('accountBalances') || 'Account Balances', icon: CreditCard, category: 'Sales' },
        { href: '/customers/analytics', label: t('analytics') || 'Analytics', icon: TrendingUp, category: 'Sales' },
        { href: '/customers/notes', label: t('notesAndCommunication') || 'Notes And Communication', icon: MessageSquare, category: 'Sales' },
      ]
    },

    // === PRODUCTS & CATALOG ===
    {
      href: '/products',
      label: t('products') || 'Products',
      icon: Package,
      category: 'Products',
      description: 'Product catalog and inventory management',
      children: [
        { href: '/products', label: t('allProducts') || 'All Products', icon: Package, category: 'Products' },
        { href: '/products/manage', label: t('manageProducts') || 'Manage Products', icon: Package, category: 'Products' },
        { href: '/products/types', label: t('productTypes') || 'Product Types', icon: Package, category: 'Products' },
        { href: '/products/kits-bundles', label: t('kitsBundles') || 'Kits And Bundles', icon: Package, category: 'Products' },
        { href: '/categories', label: t('categories') || 'Categories', icon: Tag, category: 'Products' },
        { href: '/brands', label: t('brands') || 'Brands', icon: Building2, category: 'Products' },
      ]
    },
    {
      href: '/price-lists',
      label: t('priceLists') || 'Price Lists',
      icon: DollarSign,
      category: 'Products',
      description: 'Pricing management and bulk editing',
      children: [
        { href: '/price-lists', label: t('allPriceLists') || 'All Price Lists', icon: DollarSign, category: 'Products' },
        { href: '/price-lists/bulk-editor', label: t('bulkEditor') || 'Bulk Editor', icon: TrendingUp, category: 'Products' },
      ]
    },

    // === INVENTORY & WAREHOUSE ===
    {
      href: '/inventory',
      label: t('inventory') || 'Inventory',
      icon: Package2,
      category: 'Inventory',
      description: 'Stock management and warehouse operations',
      children: [
        { href: '/inventory', label: t('stockOverview') || 'Stock Overview', icon: Package2, category: 'Inventory' },
        { href: '/warehouse', label: t('warehouseOperations') || 'Warehouse Operations', icon: Warehouse, category: 'Inventory' },
      ]
    },

    // === PURCHASING & SUPPLIERS ===
    {
      href: '/vendors',
      label: t('purchasing') || 'Purchasing',
      icon: Building2,
      category: 'Purchasing',
      description: 'Vendor management and purchase orders',
      children: [
        { href: '/vendors', label: t('allVendors') || 'All Vendors', icon: Building2, category: 'Purchasing' },
        { href: '/vendors/balance', label: t('accountBalances') || 'Account Balances', icon: CreditCard, category: 'Purchasing' },
        { href: '/vendors/analytics', label: t('performanceAnalytics') || 'Performance Analytics', icon: TrendingUp, category: 'Purchasing' },
        { href: '/vendors/notes', label: t('notesAndCommunication') || 'Notes And Communication', icon: MessageSquare, category: 'Purchasing' },
        { href: '/warehouse/purchase-orders', label: t('purchaseOrders') || 'Purchase Orders', icon: FileText, category: 'Purchasing' },
        { href: '/purchase-orders/create', label: t('createPurchaseOrder') || 'Create Purchase Order', icon: Plus, category: 'Purchasing' },
        { href: '/warehouse/goods-receipts', label: t('goodsReceipts') || 'Goods Receipts', icon: Truck, category: 'Purchasing' },
      ]
    },

    // === LOCATIONS & FACILITIES ===
    {
      href: '/stores',
      label: t('stores') || 'Stores',
      icon: Store,
      category: 'Locations',
      description: 'Store management and operations',
      children: [
        { href: '/stores', label: t('allStores') || 'All Stores', icon: Store, category: 'Locations' },
        { href: '/stores/dashboard', label: t('storeDashboard') || 'Dashboard', icon: BarChart3, category: 'Locations' },
        { href: '/stores/analytics', label: t('storeAnalytics') || 'Analytics', icon: TrendingUp, category: 'Locations' },
      ]
    },
    {
      href: '/warehouses',
      label: t('warehouses') || 'Warehouses',
      icon: Warehouse,
      category: 'Locations',
      description: 'Warehouse management and operations',
      children: [
        { href: '/warehouses', label: t('allWarehouses') || 'All Warehouses', icon: Warehouse, category: 'Locations' },
      ]
    },
    {
      href: '/branches',
      label: t('branches') || 'Branches',
      icon: MapPin,
      category: 'Locations',
      description: 'Branch management and locations'
    },

    // === ANALYTICS & REPORTS ===
    {
      href: '/analytics',
      label: t('analytics') || 'Analytics',
      icon: BarChart3,
      category: 'Analytics',
      description: 'Business intelligence and reporting',
      children: [
        { href: '/products/dashboard', label: t('productDashboard') || 'Product Dashboard', icon: BarChart3, category: 'Analytics' },
        { href: '/products/analytics', label: t('productAnalytics') || 'Product Analytics', icon: TrendingUp, category: 'Analytics' },
        { href: '/customers/analytics', label: t('customerAnalytics') || 'Customer Analytics', icon: TrendingUp, category: 'Analytics' },
        { href: '/vendors/analytics', label: t('vendorAnalytics') || 'Vendor Analytics', icon: TrendingUp, category: 'Analytics' },
        { href: '/stores/analytics', label: t('storeAnalytics') || 'Store Analytics', icon: TrendingUp, category: 'Analytics' },
      ]
    },

    // === HUMAN RESOURCES ===
    {
      href: '/hr',
      label: t('humanResources') || 'Human Resources',
      icon: Users,
      category: 'HR',
      description: 'Employee management and HR operations',
      children: [
        { href: '/hr', label: t('hrDashboard') || 'HR Dashboard', icon: BarChart3, category: 'HR' },
        { href: '/hr/employees', label: t('employees') || 'Employees', icon: UserPlus, category: 'HR' },
        { href: '/hr/departments', label: t('departments') || 'Departments', icon: Building2, category: 'HR' },
        { href: '/hr/organization-chart', label: t('organizationChart') || 'Organization Chart', icon: Network, category: 'HR' },
        { href: '/hr/leave', label: t('leaveManagement') || 'Leave Management', icon: CalendarDays, category: 'HR' },
        { href: '/hr/payroll', label: t('payroll') || 'Payroll', icon: DollarSign, category: 'HR' },
        { href: '/hr/performance', label: t('performance') || 'Performance', icon: TrendingUp, category: 'HR' },
        { href: '/hr/recruitment', label: t('recruitment') || 'Recruitment', icon: Briefcase, category: 'HR' },
        { href: '/hr/policies', label: t('policies') || 'Policies', icon: ClipboardList, category: 'HR' },
        { href: '/hr/separation', label: t('separationOffboarding') || 'Separation & Offboarding', icon: UserX, category: 'HR' },
        { href: '/hr/attendance', label: t('attendanceTimeTracking') || 'Attendance & Time Tracking', icon: Clock, category: 'HR' },
      ]
    },

    // === TRAINING & DEVELOPMENT ===
    {
      href: '/hr/training',
      label: t('trainingDevelopment') || 'Training & Development',
      icon: GraduationCap,
      category: 'Training',
      description: 'Employee training and skill development',
      children: [
        { href: '/hr/training', label: t('trainingDashboard') || 'Training Dashboard', icon: BarChart3, category: 'Training' },
        { href: '/hr/training/programs', label: t('trainingPrograms') || 'Training Programs', icon: BookOpen, category: 'Training' },
        { href: '/hr/training/schedules', label: t('trainingSchedules') || 'Training Schedules', icon: Calendar, category: 'Training' },
        { href: '/hr/training/certifications', label: t('certifications') || 'Certifications', icon: Award, category: 'Training' },
        { href: '/hr/training/skill-gaps', label: t('skillGapAnalysis') || 'Skill Gap Analysis', icon: Target, category: 'Training' },
      ]
    },

    // === EMPLOYEE SELF-SERVICE ===
    {
      href: '/employee',
      label: t('employeePortal') || 'Employee Portal',
      icon: User,
      category: 'Employee',
      description: 'Employee self-service portal',
      children: [
        { href: '/employee', label: t('employeeDashboard') || 'Dashboard', icon: BarChart3, category: 'Employee' },
        { href: '/employee/profile', label: t('profileManagement') || 'Profile', icon: User, category: 'Employee' },
        { href: '/employee/payslips', label: t('payslips') || 'Payslips', icon: DollarSign, category: 'Employee' },
        { href: '/employee/leave', label: t('leaveRequests') || 'Leave', icon: Calendar, category: 'Employee' },
        { href: '/employee/announcements', label: t('announcements') || 'Announcements', icon: Bell, category: 'Employee' },
        { href: '/employee/messages', label: t('messages') || 'Messages', icon: MessageSquare, category: 'Employee' },
      ]
    },

    // === SYSTEM & ADMINISTRATION ===
    {
      href: '/users',
      label: t('userManagement') || 'User Management',
      icon: User,
      category: 'Admin',
      description: 'User accounts and permissions',
      children: [
        { href: '/users', label: t('allUsers') || 'All Users', icon: User, category: 'Admin' },
        { href: '/users/roles', label: t('rolesAndPermissions') || 'Roles And Permissions', icon: UserCheck, category: 'Admin' },
        { href: '/users/activity', label: t('activityLogs') || 'Activity Logs', icon: Activity, category: 'Admin' },
        { href: '/users/security', label: t('security') || 'Security', icon: Shield, category: 'Admin' },
      ]
    },
    {
      href: '/admin',
      label: t('admin') || 'Admin',
      icon: Settings,
      category: 'Admin',
      description: 'System administration and maintenance',
      children: [
        { href: '/admin/seed-brands', label: t('seedBrands') || 'Seed Demo Data', icon: Package, category: 'Admin' },
      ]
    },
    {
      href: '/settings',
      label: t('settings') || 'Settings',
      icon: Settings,
      category: 'Admin',
      description: 'System configuration and preferences',
      children: [
        { href: '/settings/company', label: t('companySettings') || 'Company Settings', icon: Building2, category: 'Admin' },
        { href: '/settings', label: t('generalSettings') || 'General Settings', icon: Settings, category: 'Admin' },
      ]
    },

    // === PERSONAL ===
    {
      href: '/profile',
      label: t('profile') || 'Profile',
      icon: User,
      category: 'Personal',
      description: 'User profile and account settings'
    },
    {
      href: '/notifications',
      label: t('notifications') || 'Notifications',
      icon: Bell,
      category: 'Personal',
      description: 'System notifications and alerts'
    },
    {
      href: '/help',
      label: t('help') || 'Help',
      icon: HelpCircle,
      category: 'Personal',
      description: 'Help center and documentation'
    },
  ];

  // Quick access items
  const quickAccessItems: QuickAccessItem[] = [
    { href: '/orders/create', label: 'Create Order', icon: Plus, description: 'Quick order creation' },
    { href: '/products/manage', label: 'Manage Products', icon: Package, description: 'Product management' },
    { href: '/customers', label: 'All Customers', icon: Users, description: 'Customer overview' },
    { href: '/inventory', label: 'Stock Overview', icon: Package2, description: 'Inventory status' },
    { href: '/hr/employees', label: 'Employees', icon: UserPlus, description: 'Employee management' },
    { href: '/analytics', label: 'Analytics', icon: BarChart3, description: 'Business insights' },
    { href: '/settings', label: 'Settings', icon: Settings, description: 'System settings' },
    { href: '/help', label: 'Help', icon: HelpCircle, description: 'Documentation' },
  ];

  // Filter navigation items based on search
  const filteredItems = navigationItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.children?.some(child => 
      child.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Get favorites, pinned, and recent items
  const favoriteItems = navigationItems.filter(item => 
    favorites.includes(item.href) || 
    item.children?.some(child => favorites.includes(child.href))
  );

  const pinnedItems = navigationItems.filter(item => 
    pinned.includes(item.href) || 
    item.children?.some(child => pinned.includes(child.href))
  );

  const recentItems = recent.map(href => 
    navigationItems.find(item => 
      item.href === href || 
      item.children?.find(child => child.href === href)
    )
  ).filter(Boolean) as NavItem[];

  // Helper functions
  const toggleExpanded = (href: string) => {
    setExpandedItems(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  const toggleFavorite = (href: string) => {
    setFavorites(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  const togglePinned = (href: string) => {
    setPinned(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const hasActiveChild = (item: NavItem) => {
    return item.children?.some(child => isActive(child.href)) || false;
  };

  // Render navigation item
  const renderNavItem = (item: NavItem, level = 0) => {
    const isExpanded = expandedItems.includes(item.href);
    const hasChildren = item.children && item.children.length > 0;
    const isItemActive = isActive(item.href) || hasActiveChild(item);
    const isFavorited = favorites.includes(item.href);
    const isPinnedItem = pinned.includes(item.href);

    return (
      <div key={item.href} className="group">
        <div className={cn(
          "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors relative",
          level > 0 && "ml-4",
          isItemActive && "bg-accent text-accent-foreground",
          !isItemActive && "hover:bg-accent/50"
        )}>
          <Link 
            href={item.href} 
            className="flex items-center gap-2 flex-1 min-w-0"
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!isCollapsed && (
              <>
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {item.badge}
                  </Badge>
                )}
              </>
            )}
          </Link>
          
          {!isCollapsed && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(item.href);
                }}
              >
                {isFavorited ? (
                  <StarIcon className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                ) : (
                  <StarOff className="h-3 w-3" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.preventDefault();
                  togglePinned(item.href);
                }}
              >
                {isPinnedItem ? (
                  <Pin className="h-3 w-3 fill-blue-500 text-blue-500" />
                ) : (
                  <PinOff className="h-3 w-3" />
                )}
              </Button>

              {hasChildren && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleExpanded(item.href);
                  }}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </Button>
              )}
            </div>
          )}
        </div>

        {hasChildren && isExpanded && !isCollapsed && (
          <div className="mt-1 space-y-1">
            {item.children?.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Render section header
  const renderSectionHeader = (title: string, icon?: React.ComponentType<{ className?: string }>) => (
    <div className="flex items-center gap-2 px-2 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
      {icon && <icon className="h-3 w-3" />}
      {!isCollapsed && <span>{title}</span>}
    </div>
  );

  return (
    <div className={cn(
      "flex h-full flex-col border-r bg-background transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      isRTL && "border-l border-r-0"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Package className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-sm">OryxPro</h2>
              <p className="text-xs text-muted-foreground">Business Suite</p>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-1">
          {/* Search */}
          {!isCollapsed && (
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-7 text-xs"
              />
            </div>
          )}

          {/* Settings Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Sidebar Settings</DialogTitle>
                <DialogDescription>
                  Customize your sidebar experience
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Layout</label>
                  <Select
                    value={settings.layout}
                    onValueChange={(value: 'grid' | 'list' | 'compact') => 
                      setSettings(prev => ({ ...prev, layout: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="list">
                        <div className="flex items-center gap-2">
                          <List className="h-4 w-4" />
                          List
                        </div>
                      </SelectItem>
                      <SelectItem value="grid">
                        <div className="flex items-center gap-2">
                          <Grid3X3 className="h-4 w-4" />
                          Grid
                        </div>
                      </SelectItem>
                      <SelectItem value="compact">
                        <div className="flex items-center gap-2">
                          <Minimize2 className="h-4 w-4" />
                          Compact
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Show Favorites</label>
                    <Switch
                      checked={settings.showFavorites}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, showFavorites: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Show Recent</label>
                    <Switch
                      checked={settings.showRecent}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, showRecent: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Show Pinned</label>
                    <Switch
                      checked={settings.showPinned}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, showPinned: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Show Categories</label>
                    <Switch
                      checked={settings.showCategories}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, showCategories: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Compact Mode</label>
                    <Switch
                      checked={settings.compactMode}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, compactMode: checked }))
                      }
                    />
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Navigation Content */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {/* Quick Access */}
        {!isCollapsed && (
          <div className="space-y-1">
            {renderSectionHeader('Quick Access', Zap)}
            <div className="grid grid-cols-2 gap-1">
              {quickAccessItems.slice(0, 6).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-md text-xs hover:bg-accent/50 transition-colors",
                    isActive(item.href) && "bg-accent text-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-center leading-tight">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Favorites */}
        {settings.showFavorites && favorites.length > 0 && !isCollapsed && (
          <div className="space-y-1">
            {renderSectionHeader('Favorites', StarIcon)}
            {favoriteItems.map(item => renderNavItem(item))}
          </div>
        )}

        {/* Pinned */}
        {settings.showPinned && pinned.length > 0 && !isCollapsed && (
          <div className="space-y-1">
            {renderSectionHeader('Pinned', Pin)}
            {pinnedItems.map(item => renderNavItem(item))}
          </div>
        )}

        {/* Recent */}
        {settings.showRecent && recentItems.length > 0 && !isCollapsed && (
          <div className="space-y-1">
            {renderSectionHeader('Recent', History)}
            {recentItems.slice(0, 5).map(item => renderNavItem(item))}
          </div>
        )}

        <Separator />

        {/* Main Navigation */}
        <div className="space-y-1">
          {!isCollapsed && renderSectionHeader('All Modules', Layers)}
          
          {/* Group by categories if enabled */}
          {settings.showCategories && !isCollapsed ? (
            <div className="space-y-3">
              {['Core', 'Sales', 'Products', 'Inventory', 'Purchasing', 'Locations', 'Analytics', 'HR', 'Training', 'Employee', 'Admin', 'Personal'].map(category => {
                const categoryItems = filteredItems.filter(item => item.category === category);
                if (categoryItems.length === 0) return null;
                
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      <span>{category}</span>
                    </div>
                    {categoryItems.map(item => renderNavItem(item))}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map(item => renderNavItem(item))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={() => signOut()}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
