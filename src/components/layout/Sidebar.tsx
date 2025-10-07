'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSidebar } from '@/contexts/sidebar-context';
import { useLanguage } from '@/contexts/language-context';
import { useTranslation } from '@/hooks/use-translation';
import { useAuth } from '@/contexts/AuthContext';
import { SimpleQuickAccess } from '@/components/navigation/SimpleQuickAccess';
import { SimpleAllPagesMenu } from '@/components/navigation/SimpleAllPagesMenu';
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
  Share2,
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
  Zap,
  Database,
  RotateCcw,
  Kanban,
  ListTodo,
  Folder,
  RefreshCw,
  Wrench,
  Car,
  Circle,
  Fuel,
  Navigation
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: NavItem[];
}

export function Sidebar() {
  const { isCollapsed, isMobileOpen, toggleMobileOpen } = useSidebar();
  const { isRTL } = useLanguage();
  const { t } = useTranslation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const pathname = usePathname();
  const { user, signOut, isLoading } = useAuth();

  // Show loading state while auth is initializing
  if (isLoading) {
    return (
      <div className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        isCollapsed ? "w-16" : "w-64"
      )}>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-sm text-slate-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Navigation items with translations
  const navigationItems: NavItem[] = [
    // === DASHBOARD ===
    {
      href: '/',
      label: t('dashboard') || 'Dashboard',
      icon: Home,
    },
    {
      href: '/overview',
      label: t('overview') || 'Overview',
      icon: Eye,
    },
    {
      href: '/navigation',
      label: t('navigation') || 'Navigation',
      icon: Grid3X3,
    },

    // === SALES & CUSTOMERS ===
    {
      href: '/orders',
      label: t('sales') || 'Sales',
      icon: ShoppingCart,
      children: [
        { href: '/orders', label: t('allOrders') || 'All Orders', icon: FileText },
        { href: '/orders/daily', label: t('dailyOrders') || 'Daily Orders', icon: Calendar },
        { href: '/orders/create', label: t('createOrder') || 'Create Order', icon: Plus },
        { href: '/orders/pipeline', label: t('orderPipeline') || 'Order Pipeline', icon: Workflow },
        { href: '/orders/status', label: t('statusTracking') || 'Status Tracking', icon: Activity },
        { href: '/orders/templates', label: t('orderTemplates') || 'Order Templates', icon: FileText },
        { href: '/pos', label: t('pointOfSale') || 'Point Of Sale', icon: ShoppingCart },
        { href: '/track-order', label: t('trackOrder') || 'Track Order', icon: Search },
      ]
    },
    {
      href: '/return-orders',
      label: t('returnOrders') || 'Return Orders',
      icon: RotateCcw,
      children: [
        { href: '/return-orders', label: t('allReturns') || 'All Returns', icon: RotateCcw },
        { href: '/return-orders/create', label: t('createReturn') || 'Create Return', icon: Plus },
      ]
    },
    {
      href: '/customers',
      label: t('customers') || 'Customers',
      icon: Users,
      children: [
        { href: '/customers', label: t('allCustomers') || 'All Customers', icon: Users },
        { href: '/customers/balance', label: t('accountBalances') || 'Account Balances', icon: CreditCard },
        { href: '/customers/analytics', label: t('analytics') || 'Analytics', icon: TrendingUp },
        { href: '/customers/notes', label: t('notesAndCommunication') || 'Notes And Communication', icon: MessageSquare },
      ]
    },

    // === CRM & SALES ===
    {
      href: '/crm',
      label: t('crm') || 'CRM',
      icon: Users,
      children: [
        { href: '/crm/leads', label: t('leads') || 'Leads', icon: UserPlus },
        { href: '/crm/deals', label: t('deals') || 'Deals', icon: Target },
        { href: '/crm/quotations', label: t('quotations') || 'Quotations', icon: FileText },
        { href: '/crm/activities', label: t('salesActivities') || 'Sales Activities', icon: Activity },
        { href: '/crm/pipeline', label: t('salesPipeline') || 'Sales Pipeline', icon: Workflow },
      ]
    },

    // === PRODUCTS & CATALOG ===
    {
      href: '/products',
      label: t('products') || 'Products',
      icon: Package,
      children: [
        { href: '/products', label: t('allProducts') || 'All Products', icon: Package },
        { href: '/products/types', label: t('productTypes') || 'Product Types', icon: Package },
        { href: '/products/kits-bundles', label: t('kitsBundles') || 'Kits And Bundles', icon: Package },
        { href: '/products/service-history', label: t('serviceHistory') || 'Service History', icon: Clock },
        { href: '/categories', label: t('categories') || 'Categories', icon: Tag },
        { href: '/brands', label: t('brands') || 'Brands', icon: Building2 },
      ]
    },
    {
      href: '/warranties',
      label: t('warranties') || 'Warranties',
      icon: Shield,
      children: [
        { href: '/warranties', label: t('warrantyCards') || 'Warranty Cards', icon: Shield },
        { href: '/warranties/claims', label: t('warrantyClaims') || 'Warranty Claims', icon: AlertTriangle },
      ]
    },
    {
      href: '/documents',
      label: t('documents') || 'Document Center',
      icon: FileText,
    },

    // === ASSET MANAGEMENT ===
    {
      href: '/assets',
      label: t('assetManagement') || 'Asset Management',
      icon: Package,
      children: [
        { href: '/assets', label: t('assetRegistry') || 'Asset Registry', icon: Package },
        { href: '/assets/categories', label: t('assetCategories') || 'Categories', icon: Tag },
        { href: '/assets/depreciation', label: t('depreciationManagement') || 'Depreciation', icon: DollarSign },
        { href: '/assets/maintenance', label: t('maintenanceScheduling') || 'Maintenance', icon: Wrench },
        { href: '/assets/analytics', label: t('assetAnalytics') || 'Analytics', icon: BarChart3 },
      ]
    },

    // === FLEET MANAGEMENT ===
    {
      href: '/fleet',
      label: t('fleetManagement') || 'Fleet Management',
      icon: Car,
      children: [
        { href: '/fleet', label: t('vehicleRegistry') || 'Vehicle Registry', icon: Car },
        { href: '/fleet/drivers', label: t('driverManagement') || 'Driver Management', icon: Users },
        { href: '/fleet/trips', label: t('tripTracking') || 'Trip Tracking', icon: Navigation },
        { href: '/fleet/fuel', label: t('fuelManagement') || 'Fuel Management', icon: Fuel },
        { href: '/fleet/maintenance', label: t('fleetMaintenance') || 'Maintenance', icon: Wrench },
        { href: '/fleet/tires', label: t('tireManagement') || 'Tire Management', icon: Circle },
        { href: '/fleet/analytics', label: t('fleetAnalytics') || 'Analytics', icon: BarChart3 },
      ]
    },

    // === FINANCE & ACCOUNTING ===
    {
      href: '/finance',
      label: t('financeAccounting') || 'Finance & Accounting',
      icon: DollarSign,
      children: [
        { href: '/finance', label: t('chartOfAccounts') || 'Chart of Accounts', icon: DollarSign },
        { href: '/finance/journal-entries', label: t('journalEntries') || 'Journal Entries', icon: FileText },
        { href: '/finance/periods', label: t('periodManagement') || 'Period Management', icon: Calendar },
        { href: '/finance/currency', label: t('multiCurrency') || 'Multi-Currency', icon: DollarSign },
        { href: '/finance/payables', label: t('accountsPayable') || 'Accounts Payable', icon: CreditCard },
        { href: '/finance/receivables', label: t('accountsReceivable') || 'Accounts Receivable', icon: FileText },
        { href: '/finance/cash-bank', label: t('cashBankManagement') || 'Cash & Bank', icon: Building2 },
        { href: '/finance/assets', label: t('fixedAssetsIntegration') || 'Fixed Assets', icon: Package },
        { href: '/finance/budgeting', label: t('budgetingPlanning') || 'Budgeting & Planning', icon: TrendingUp },
        { href: '/finance/reports', label: t('financialReports') || 'Financial Reports', icon: BarChart3 },
      ]
    },

    {
      href: '/service-requests',
      label: t('serviceRequests') || 'Service Requests',
      icon: Wrench,
      children: [
        { href: '/service-requests', label: t('allServiceRequests') || 'All Service Requests', icon: Wrench },
        { href: '/service-requests/work-orders', label: t('workOrders') || 'Work Orders', icon: ClipboardList },
        { href: '/service-requests/schedule', label: t('technicianSchedule') || 'Technician Schedule', icon: CalendarDays },
        { href: '/service-requests/analytics', label: t('serviceAnalytics') || 'Service Analytics', icon: BarChart3 },
      ]
    },
    {
      href: '/price-lists',
      label: t('priceLists') || 'Price Lists',
      icon: DollarSign,
      children: [
        { href: '/price-lists', label: t('allPriceLists') || 'All Price Lists', icon: DollarSign },
        { href: '/price-lists/bulk-editor', label: t('bulkEditor') || 'Bulk Editor', icon: TrendingUp },
      ]
    },

    // === INVENTORY & WAREHOUSE ===
    {
      href: '/inventory',
      label: t('inventory') || 'Inventory',
      icon: Package2,
      children: [
        { href: '/inventory', label: t('stockOverview') || 'Stock Overview', icon: Package2 },
        { href: '/warehouse', label: t('warehouseOperations') || 'Warehouse Operations', icon: Warehouse },
      ]
    },

    // === PURCHASING & SUPPLIERS ===
    {
      href: '/vendors',
      label: t('purchasing') || 'Purchasing',
      icon: Building2,
      children: [
        { href: '/vendors', label: t('allVendors') || 'All Vendors', icon: Building2 },
        { href: '/vendors/balance', label: t('accountBalances') || 'Account Balances', icon: CreditCard },
        { href: '/vendors/analytics', label: t('performanceAnalytics') || 'Performance Analytics', icon: TrendingUp },
        { href: '/vendors/notes', label: t('notesAndCommunication') || 'Notes And Communication', icon: MessageSquare },
        { href: '/warehouse/purchase-orders', label: t('purchaseOrders') || 'Purchase Orders', icon: FileText },
        { href: '/purchase-orders/create', label: t('createPurchaseOrder') || 'Create Purchase Order', icon: Plus },
        { href: '/warehouse/goods-receipts', label: t('goodsReceipts') || 'Goods Receipts', icon: Truck },
      ]
    },

    // === LOCATIONS & FACILITIES ===
    {
      href: '/stores',
      label: t('stores') || 'Stores',
      icon: Store,
      children: [
        { href: '/stores', label: t('allStores') || 'All Stores', icon: Store },
        { href: '/stores/dashboard', label: t('storeDashboard') || 'Dashboard', icon: BarChart3 },
        { href: '/stores/analytics', label: t('storeAnalytics') || 'Analytics', icon: TrendingUp },
      ]
    },
    {
      href: '/warehouses',
      label: t('warehouses') || 'Warehouses',
      icon: Warehouse,
      children: [
        { href: '/warehouses', label: t('allWarehouses') || 'All Warehouses', icon: Warehouse },
      ]
    },
    {
      href: '/branches',
      label: t('branches') || 'Branches',
      icon: MapPin,
    },

    // === ANALYTICS & REPORTS ===
    {
      href: '/analytics',
      label: t('analytics') || 'Analytics',
      icon: BarChart3,
      children: [
        { href: '/products/dashboard', label: t('productDashboard') || 'Product Dashboard', icon: BarChart3 },
        { href: '/products/analytics', label: t('productAnalytics') || 'Product Analytics', icon: TrendingUp },
        { href: '/customers/analytics', label: t('customerAnalytics') || 'Customer Analytics', icon: TrendingUp },
        { href: '/vendors/analytics', label: t('vendorAnalytics') || 'Vendor Analytics', icon: TrendingUp },
        { href: '/stores/analytics', label: t('storeAnalytics') || 'Store Analytics', icon: TrendingUp },
      ]
    },

    // === HUMAN RESOURCES ===
    {
      href: '/hr',
      label: t('humanResources') || 'Human Resources',
      icon: Users,
      children: [
        { href: '/hr', label: t('hrDashboard') || 'HR Dashboard', icon: BarChart3 },
        { href: '/hr/employees', label: t('employees') || 'Employees', icon: UserPlus },
        { href: '/hr/departments', label: t('departments') || 'Departments', icon: Building2 },
        { href: '/hr/organization-chart', label: t('organizationChart') || 'Organization Chart', icon: Network },
        { href: '/hr/leave', label: t('leaveManagement') || 'Leave Management', icon: CalendarDays },
        { href: '/hr/payroll', label: t('payroll') || 'Payroll', icon: DollarSign },
        { href: '/hr/performance', label: t('performance') || 'Performance', icon: TrendingUp },
        { href: '/hr/recruitment', label: t('recruitment') || 'Recruitment', icon: Briefcase },
        { href: '/hr/policies', label: t('policies') || 'Policies', icon: ClipboardList },
        { href: '/hr/separation', label: t('separationOffboarding') || 'Separation & Offboarding', icon: UserX },
        { href: '/hr/attendance', label: t('attendanceTimeTracking') || 'Attendance & Time Tracking', icon: Clock },
      ]
    },

    // === TRAINING & DEVELOPMENT ===
    {
      href: '/hr/training',
      label: t('trainingDevelopment') || 'Training & Development',
      icon: GraduationCap,
      children: [
        { href: '/hr/training', label: t('trainingDashboard') || 'Training Dashboard', icon: BarChart3 },
        { href: '/hr/training/programs', label: t('trainingPrograms') || 'Training Programs', icon: BookOpen },
        { href: '/hr/training/schedules', label: t('trainingSchedules') || 'Training Schedules', icon: Calendar },
        { href: '/hr/training/certifications', label: t('certifications') || 'Certifications', icon: Award },
        { href: '/hr/training/skill-gaps', label: t('skillGapAnalysis') || 'Skill Gap Analysis', icon: Target },
      ]
    },

    // === EMPLOYEE SELF-SERVICE ===
    {
      href: '/employee',
      label: t('employeePortal') || 'Employee Portal',
      icon: User,
      children: [
        { href: '/employee', label: t('employeeDashboard') || 'Dashboard', icon: BarChart3 },
        { href: '/employee/profile', label: t('profileManagement') || 'Profile', icon: User },
        { href: '/employee/payslips', label: t('payslips') || 'Payslips', icon: DollarSign },
        { href: '/employee/leave', label: t('leaveRequests') || 'Leave', icon: Calendar },
        { href: '/employee/announcements', label: t('announcements') || 'Announcements', icon: Bell },
        { href: '/employee/messages', label: t('messages') || 'Messages', icon: MessageSquare },
      ]
    },

    // === TASK MANAGEMENT ===
    {
      href: '/tasks',
      label: t('taskManagement') || 'Task Management',
      icon: CheckSquare,
      children: [
        { href: '/tasks', label: t('allTasks') || 'All Tasks', icon: ListTodo },
        { href: '/tasks/kanban', label: t('kanbanBoard') || 'Kanban Board', icon: Kanban },
        { href: '/tasks/calendar', label: t('taskCalendar') || 'Task Calendar', icon: Calendar },
        { href: '/tasks/my-tasks', label: t('myTasks') || 'My Tasks', icon: User },
        { href: '/tasks/team', label: t('teamTasks') || 'Team Tasks', icon: Users },
        { href: '/tasks/projects', label: t('projects') || 'Projects', icon: Folder },
        { href: '/tasks/reports', label: t('taskReports') || 'Task Reports', icon: BarChart3 },
      ]
    },

    // === SYSTEM & ADMINISTRATION ===
    {
      href: '/users',
      label: t('userManagement') || 'User Management',
      icon: User,
      children: [
        { href: '/profile', label: t('myProfile') || 'My Profile', icon: User },
        { href: '/users/enhanced', label: t('allUsers') || 'All Users', icon: Users },
        { href: '/users/add', label: t('addUser') || 'Add User', icon: UserPlus },
        { href: '/users/seed', label: t('seedUsers') || 'Seed Demo Users', icon: Database },
        { href: '/demo-users', label: t('demoUsers') || 'Demo Users', icon: Users },
        { href: '/test-auth', label: 'Test Auth', icon: Shield },
        { href: '/users/roles', label: t('rolesAndPermissions') || 'Roles And Permissions', icon: UserCheck },
        { href: '/users/permissions', label: t('permissions') || 'Permissions', icon: Shield },
        { href: '/users/roles/seed', label: t('seedRoles') || 'Seed Demo Roles', icon: Database },
        { href: '/users/test-api', label: t('testApi') || 'Test API', icon: Database },
        { href: '/users/activity', label: t('activityLogs') || 'Activity Logs', icon: Activity },
        { href: '/users/security', label: t('security') || 'Security', icon: Shield },
      ]
    },
    {
      href: '/admin',
      label: t('admin') || 'Admin',
      icon: Settings,
      children: [
        { href: '/admin/seed-brands', label: t('seedBrands') || 'Seed Demo Data', icon: Package },
        { href: '/demo-data', label: t('demoDataManagement') || 'Demo Data Management', icon: Database },
      ]
    },
    {
      href: '/settings',
      label: t('settings') || 'Settings',
      icon: Settings,
      children: [
        { href: '/settings/company', label: t('companySettings') || 'Company Settings', icon: Building2 },
        { href: '/settings', label: t('generalSettings') || 'General Settings', icon: Settings },
      ]
    },

    // === PERSONAL ===
    {
      href: '/profile',
      label: t('profile') || 'Profile',
      icon: User,
    },
    {
      href: '/customer-portal',
      label: t('customerPortal') || 'Customer Portal',
      icon: UserCheck,
    },
    {
      href: '/notifications',
      label: t('notifications') || 'Notifications',
      icon: Bell,
    },
    {
      href: '/help',
      label: t('helpAndSupport') || 'Help And Support',
      icon: HelpCircle,
    },

    // === COMMUNICATION ===
    {
      href: '/chat',
      label: t('chat') || 'Chat',
      icon: MessageSquare,
    },

    // === TAX COMPLIANCE ===
    {
      href: '/eta',
      label: t('eta') || 'ETA',
      icon: Building2,
      children: [
        { href: '/eta', label: t('etaDashboard') || 'ETA Dashboard', icon: Building2 },
        { href: '/eta/products', label: t('etaProducts') || 'ETA Products', icon: Package },
        { href: '/eta/invoices', label: t('etaInvoices') || 'ETA Invoices', icon: FileText },
        { href: '/eta/sync', label: t('etaSync') || 'ETA Sync', icon: RefreshCw },
        { href: '/eta/settings', label: t('etaSettings') || 'ETA Settings', icon: Settings },
      ]
    },
  ];

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  // Filter navigation items based on search query
  const filteredNavigationItems = navigationItems.filter(item => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const matchesLabel = item.label.toLowerCase().includes(query);
    const matchesChildren = item.children?.some(child => 
      child.label.toLowerCase().includes(query)
    );
    
    return matchesLabel || matchesChildren;
  });

  // Auto-expand parent items when children match search
  const getExpandedItemsForSearch = () => {
    if (!searchQuery.trim()) return expandedItems;
    
    const query = searchQuery.toLowerCase();
    const itemsToExpand = navigationItems
      .filter(item => 
        item.children?.some(child => 
          child.label.toLowerCase().includes(query)
        )
      )
      .map(item => item.href);
    
    return [...new Set([...expandedItems, ...itemsToExpand])];
  };

  const displayExpandedItems = getExpandedItemsForSearch();

  // Helper function to render section divider
  const renderSectionDivider = (label: string) => (
    <div className="px-3 py-2">
      <div className="flex items-center space-x-2">
        <div className="h-px bg-slate-700 flex-1"></div>
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {label}
        </span>
        <div className="h-px bg-slate-700 flex-1"></div>
      </div>
    </div>
  );

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const NavItem = ({ item, level = 0 }: { item: NavItem; level?: number }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = displayExpandedItems.includes(item.href);
    const active = isActive(item.href);

    return (
      <div>
        <div
          className={cn(
            "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 cursor-pointer group",
            active
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-300 hover:bg-slate-800 hover:text-white",
            level > 0 && (isRTL ? "mr-4" : "ml-4"),
            isCollapsed ? "justify-center" : "justify-between"
          )}
        >
          <Link 
            href={item.href} 
            className={cn(
              "flex items-center flex-1 transition-all duration-200",
              isCollapsed ? "justify-center" : (isRTL ? "space-x-reverse space-x-3" : "space-x-3")
            )}
            onClick={() => toggleMobileOpen()}
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon className={cn(
              "h-4 w-4 flex-shrink-0 transition-all duration-200",
              active ? "text-white" : "text-slate-400 group-hover:text-white"
            )} />
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
          
          {hasChildren && !isCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-slate-700 text-slate-400 hover:text-white"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
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

        {hasChildren && isExpanded && !isCollapsed && (
          <div className={cn(
            "mt-1 space-y-1",
            isRTL ? "mr-2" : "ml-2"
          )}>
            {item.children?.map((child) => (
              <NavItem key={child.href} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => toggleMobileOpen()}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 z-50 h-full border-r border-sidebar-border transition-all duration-300 ease-in-out shadow-lg",
        "bg-sidebar",
        isRTL ? "right-0" : "left-0",
        isCollapsed ? "w-20" : "w-64",
        isMobileOpen 
          ? "translate-x-0" 
          : isRTL 
            ? "translate-x-full lg:translate-x-0" 
            : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className={cn(
            "flex items-center border-b border-slate-700 p-4 transition-all duration-300",
            isCollapsed ? "justify-center" : "justify-between"
          )}>
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">O</span>
                </div>
                <div>
                   <h1 className="text-lg font-bold text-white">Oryx PRO</h1> 
                  <p className="text-xs text-slate-400">Enterprise Solutions</p>
                </div>
              </div>
            )}
            {isCollapsed && (
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">O</span>
              </div>
            )}
          </div>

          {/* Search Section */}
          {!isCollapsed ? (
            <div className="p-4 border-b border-slate-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 border-b border-slate-700">
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-10 p-0 flex items-center justify-center hover:bg-slate-700/50 text-slate-400 hover:text-white"
                title="Search pages"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Quick Access & All Pages */}
          {!isCollapsed && (
            <div className="p-4 border-b border-slate-700 space-y-2">
              <div className="flex items-center gap-2">
                <SimpleQuickAccess />
              </div>
              <div className="flex items-center gap-2">
                <SimpleAllPagesMenu />
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className={cn(
            "flex-1 p-4 space-y-1 scroll-smooth",
            isCollapsed ? "overflow-y-visible" : "overflow-y-auto sidebar-scrollbar"
          )}>
            {searchQuery && (
              <div className="mb-4 p-2 bg-slate-700/50 rounded-lg">
                <p className="text-xs text-slate-300">
                  {filteredNavigationItems.length} result(s) for "{searchQuery}"
                </p>
              </div>
            )}
            {filteredNavigationItems.map((item, index) => {
              // Add section dividers (only when not collapsed)
              const showDivider = () => {
                if (isCollapsed) return null;
                if (index === 1) return renderSectionDivider('Sales & Customers');
                if (index === 3) return renderSectionDivider('Products & Catalog');
                if (index === 5) return renderSectionDivider('Asset Management');
                if (index === 6) return renderSectionDivider('Fleet Management');
                if (index === 8) return renderSectionDivider('Inventory & Warehouse');
                if (index === 10) return renderSectionDivider('Purchasing & Suppliers');
                if (index === 13) return renderSectionDivider('Locations & Facilities');
                if (index === 17) return renderSectionDivider('Analytics & Reports');
                if (index === 19) return renderSectionDivider('Human Resources');
                if (index === 20) return renderSectionDivider('System & Administration');
                if (index === 22) return renderSectionDivider('Personal');
                return null;
              };

              return (
                <React.Fragment key={item.href}>
                  {showDivider()}
                  <NavItem item={item} />
                </React.Fragment>
              );
            })}
          </nav>

          {/* Footer */}
          {user && (
            <div className="p-4 border-t border-slate-700">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200",
                  isCollapsed ? "justify-center" : "justify-start"
                )}
                onClick={() => signOut()}
                title={isCollapsed ? t('signOut') || 'Sign Out' : undefined}
              >
                <LogOut className="h-4 w-4" />
                {!isCollapsed && (
                  <span className={cn(
                    isRTL ? "mr-3" : "ml-3"
                  )}>
                    {t('signOut') || 'Sign Out'}
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

