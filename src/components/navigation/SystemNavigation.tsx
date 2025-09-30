'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/hooks/use-translation';
import { AllPagesMenu } from './AllPagesMenu';
import { QuickAccess } from './QuickAccess';
import { 
  Search,
  Star,
  Pin,
  Clock,
  History,
  Bookmark,
  Grid3X3,
  List,
  Layers,
  Zap,
  Star as StarIcon,
  Pin as PinIcon,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Settings,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  EyeOff,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  ArrowRight,
  Menu,
  Home,
  Package,
  Users,
  Building2,
  Warehouse,
  Store,
  ShoppingCart,
  BarChart3,
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
  Workflow,
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
  UserX,
  Clock as ClockIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  category: string;
  subcategory?: string;
  isFavorite?: boolean;
  isPinned?: boolean;
  isRecent?: boolean;
  lastAccessed?: Date;
  accessCount?: number;
}

interface SystemNavigationProps {
  className?: string;
}

export function SystemNavigation({ className }: SystemNavigationProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavorites, setShowFavorites] = useState(true);
  const [showPinned, setShowPinned] = useState(true);
  const [showRecent, setShowRecent] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('list');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [pinned, setPinned] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Load saved data from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('system-nav-favorites');
    const savedPinned = localStorage.getItem('system-nav-pinned');
    const savedRecent = localStorage.getItem('system-nav-recent');
    const savedSettings = localStorage.getItem('system-nav-settings');

    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedPinned) setPinned(JSON.parse(savedPinned));
    if (savedRecent) setRecent(JSON.parse(savedRecent));
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setShowFavorites(settings.showFavorites);
      setShowPinned(settings.showPinned);
      setShowRecent(settings.showRecent);
      setViewMode(settings.viewMode);
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('system-nav-settings', JSON.stringify({
      showFavorites,
      showPinned,
      showRecent,
      viewMode
    }));
  }, [showFavorites, showPinned, showRecent, viewMode]);

  // Track page visits for recent items
  useEffect(() => {
    if (pathname && !pathname.includes('/api/')) {
      const newRecent = [pathname, ...recent.filter(item => item !== pathname)].slice(0, 10);
      setRecent(newRecent);
      localStorage.setItem('system-nav-recent', JSON.stringify(newRecent));
    }
  }, [pathname]);

  // Comprehensive navigation items
  const navigationItems: NavigationItem[] = [
    // Core
    { href: '/', label: 'Dashboard', icon: Home, category: 'Core', description: 'Main dashboard' },
    { href: '/overview', label: 'Overview', icon: Eye, category: 'Core', description: 'System overview' },
    
    // Sales
    { href: '/orders', label: 'All Orders', icon: FileText, category: 'Sales', description: 'Sales orders' },
    { href: '/orders/create', label: 'Create Order', icon: Plus, category: 'Sales', description: 'New order' },
    { href: '/orders/pipeline', label: 'Order Pipeline', icon: Workflow, category: 'Sales', description: 'Order workflow' },
    { href: '/pos', label: 'Point of Sale', icon: ShoppingCart, category: 'Sales', description: 'POS system' },
    { href: '/customers', label: 'Customers', icon: Users, category: 'Sales', description: 'Customer management' },
    
    // Products
    { href: '/products', label: 'Products', icon: Package, category: 'Products', description: 'Product catalog' },
    { href: '/products/manage', label: 'Manage Products', icon: Package, category: 'Products', description: 'Product management' },
    { href: '/categories', label: 'Categories', icon: Tag, category: 'Products', description: 'Product categories' },
    { href: '/brands', label: 'Brands', icon: Building2, category: 'Products', description: 'Product brands' },
    { href: '/price-lists', label: 'Price Lists', icon: DollarSign, category: 'Products', description: 'Pricing management' },
    
    // Inventory
    { href: '/inventory', label: 'Inventory', icon: Package2, category: 'Inventory', description: 'Stock management' },
    { href: '/warehouse', label: 'Warehouse', icon: Warehouse, category: 'Inventory', description: 'Warehouse ops' },
    
    // Purchasing
    { href: '/vendors', label: 'Vendors', icon: Building2, category: 'Purchasing', description: 'Vendor management' },
    { href: '/purchase-orders/create', label: 'Create PO', icon: Plus, category: 'Purchasing', description: 'Purchase order' },
    { href: '/warehouse/purchase-orders', label: 'Purchase Orders', icon: FileText, category: 'Purchasing', description: 'PO management' },
    
    // Locations
    { href: '/stores', label: 'Stores', icon: Store, category: 'Locations', description: 'Store management' },
    { href: '/warehouses', label: 'Warehouses', icon: Warehouse, category: 'Locations', description: 'Warehouse locations' },
    { href: '/branches', label: 'Branches', icon: MapPin, category: 'Locations', description: 'Branch offices' },
    
    // Analytics
    { href: '/analytics', label: 'Analytics', icon: BarChart3, category: 'Analytics', description: 'Business intelligence' },
    { href: '/products/analytics', label: 'Product Analytics', icon: TrendingUp, category: 'Analytics', description: 'Product insights' },
    { href: '/customers/analytics', label: 'Customer Analytics', icon: TrendingUp, category: 'Analytics', description: 'Customer insights' },
    
    // HR
    { href: '/hr', label: 'HR Dashboard', icon: BarChart3, category: 'HR', description: 'HR overview' },
    { href: '/hr/employees', label: 'Employees', icon: UserPlus, category: 'HR', description: 'Employee management' },
    { href: '/hr/departments', label: 'Departments', icon: Building2, category: 'HR', description: 'Department structure' },
    { href: '/hr/organization-chart', label: 'Org Chart', icon: Network, category: 'HR', description: 'Organization structure' },
    { href: '/hr/leave', label: 'Leave Management', icon: CalendarDays, category: 'HR', description: 'Leave requests' },
    { href: '/hr/payroll', label: 'Payroll', icon: DollarSign, category: 'HR', description: 'Employee payroll' },
    { href: '/hr/separation', label: 'Separation', icon: UserX, category: 'HR', description: 'Exit process' },
    { href: '/hr/attendance', label: 'Attendance', icon: ClockIcon, category: 'HR', description: 'Time tracking' },
    
    // Training
    { href: '/hr/training', label: 'Training', icon: GraduationCap, category: 'Training', description: 'Training programs' },
    { href: '/hr/training/programs', label: 'Training Programs', icon: BookOpen, category: 'Training', description: 'Course management' },
    { href: '/hr/training/certifications', label: 'Certifications', icon: Award, category: 'Training', description: 'Skill tracking' },
    
    // Employee Portal
    { href: '/employee', label: 'Employee Portal', icon: User, category: 'Employee', description: 'Self-service portal' },
    { href: '/employee/profile', label: 'Profile', icon: User, category: 'Employee', description: 'Personal profile' },
    { href: '/employee/payslips', label: 'Payslips', icon: DollarSign, category: 'Employee', description: 'Salary documents' },
    { href: '/employee/leave', label: 'Leave Requests', icon: Calendar, category: 'Employee', description: 'Personal leave' },
    
    // Admin
    { href: '/users', label: 'User Management', icon: User, category: 'Admin', description: 'System users' },
    { href: '/users/roles', label: 'Roles & Permissions', icon: UserCheck, category: 'Admin', description: 'Access control' },
    { href: '/settings', label: 'Settings', icon: Settings, category: 'Admin', description: 'System configuration' },
    
    // Personal
    { href: '/profile', label: 'Profile', icon: User, category: 'Personal', description: 'User profile' },
    { href: '/notifications', label: 'Notifications', icon: Bell, category: 'Personal', description: 'System alerts' },
    { href: '/help', label: 'Help', icon: HelpCircle, category: 'Personal', description: 'Documentation' },
  ];

  // Filter items based on search and categories
  const filteredItems = navigationItems.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  // Get favorites, pinned, and recent items
  const favoriteItems = filteredItems.filter(item => favorites.includes(item.href));
  const pinnedItems = filteredItems.filter(item => pinned.includes(item.href));
  const recentItems = recent
    .map(href => filteredItems.find(item => item.href === href))
    .filter(Boolean) as NavigationItem[];

  const toggleFavorite = (href: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href];
      localStorage.setItem('system-nav-favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const togglePinned = (href: string) => {
    setPinned(prev => {
      const newPinned = prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href];
      localStorage.setItem('system-nav-pinned', JSON.stringify(newPinned));
      return newPinned;
    });
  };

  const isActive = (href: string) => pathname === href;

  // Render navigation item
  const renderNavItem = (item: NavigationItem, showActions = true) => {
    const isItemActive = isActive(item.href);
    const isFavorited = favorites.includes(item.href);
    const isPinnedItem = pinned.includes(item.href);

    return (
      <div
        key={item.href}
        className={cn(
          "group flex items-center gap-3 p-2 rounded-lg transition-colors",
          isItemActive ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
        )}
      >
        <Link href={item.href} className="flex items-center gap-3 flex-1 min-w-0">
          <div className={cn(
            "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
            isItemActive ? "bg-primary text-primary-foreground" : "bg-muted"
          )}>
            <item.icon className="h-4 w-4" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm truncate">{item.label}</span>
              {isPinnedItem && <PinIcon className="h-3 w-3 text-blue-500" />}
            </div>
            <p className="text-xs text-muted-foreground truncate">{item.description}</p>
          </div>
        </Link>

        {showActions && (
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
                <StarIcon className="h-3 w-3" />
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
                <PinIcon className="h-3 w-3 fill-blue-500 text-blue-500" />
              ) : (
                <PinIcon className="h-3 w-3" />
              )}
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">System Navigation</h2>
          <Badge variant="outline" className="text-xs">
            {filteredItems.length} items
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <QuickAccess />
          <AllPagesMenu />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>View Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setViewMode('list')}>
                <List className="mr-2 h-4 w-4" />
                List View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode('grid')}>
                <Grid3X3 className="mr-2 h-4 w-4" />
                Grid View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode('compact')}>
                <Layers className="mr-2 h-4 w-4" />
                Compact View
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowFavorites(!showFavorites)}>
                {showFavorites ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}
                {showFavorites ? 'Hide' : 'Show'} Favorites
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowPinned(!showPinned)}>
                {showPinned ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}
                {showPinned ? 'Hide' : 'Show'} Pinned
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowRecent(!showRecent)}>
                {showRecent ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}
                {showRecent ? 'Hide' : 'Show'} Recent
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search all pages and features..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Navigation Content */}
      <div className="space-y-4">
        {/* Favorites */}
        {showFavorites && favoriteItems.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <StarIcon className="h-4 w-4" />
              Favorites ({favoriteItems.length})
            </div>
            <div className="space-y-1">
              {favoriteItems.map(item => renderNavItem(item))}
            </div>
          </div>
        )}

        {/* Pinned */}
        {showPinned && pinnedItems.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <PinIcon className="h-4 w-4" />
              Pinned ({pinnedItems.length})
            </div>
            <div className="space-y-1">
              {pinnedItems.map(item => renderNavItem(item))}
            </div>
          </div>
        )}

        {/* Recent */}
        {showRecent && recentItems.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Clock className="h-4 w-4" />
              Recent ({recentItems.length})
            </div>
            <div className="space-y-1">
              {recentItems.slice(0, 5).map(item => renderNavItem(item))}
            </div>
          </div>
        )}

        {/* All Items */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Layers className="h-4 w-4" />
            All Modules
          </div>
          
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex flex-col gap-3 p-4 border rounded-lg transition-colors hover:shadow-sm",
                    isActive(item.href) ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className={cn(
                      "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
                      isActive(item.href) ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    
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
                        <StarIcon className="h-3 w-3" />
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
                        <PinIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{item.label}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {item.description}
                    </p>
                    <Badge variant="outline" className="text-xs mt-2">
                      {item.category}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map(item => renderNavItem(item))}
            </div>
          )}
        </div>

        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No items found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
