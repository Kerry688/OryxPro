'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { 
  Bell, 
  Sun, 
  Moon, 
  Settings, 
  User, 
  LogOut,
  Menu,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  CreditCard,
  Shield,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Clock,
  Package,
  Truck,
  DollarSign,
  Star,
  StarOff,
  Home,
  ShoppingCart,
  Users,
  Building2,
  Warehouse,
  Store,
  MapPin,
  BarChart3,
  Eye,
  Heart,
  Bookmark,
  Layers,
  FileText,
  ClipboardList,
  TrendingUp,
  Calendar,
  UserPlus,
  Network,
  Briefcase,
  ClipboardCheck,
  FileSpreadsheet,
  Hash,
  Camera,
  Printer,
  Wrench,
  Palette,
  Globe,
  Mail,
  Phone,
  Map,
  PieChart,
  LineChart,
  Activity,
  Target,
  Award,
  Crown,
  UserCheck,
  CalendarDays,
  Calculator,
  TrendingDown,
  AlertTriangle,
  Info,
  ExternalLink,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Filter,
  Grid,
  List,
  MoreHorizontal,
  Database
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/language-context';
import { useTranslation } from '@/hooks/use-translation';
import { useSidebar } from '@/contexts/sidebar-context';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { cn } from '@/lib/utils';

export function Header() {
  const { user, signOut } = useAuth();
  const { isRTL } = useLanguage();
  const { t } = useTranslation();
  const { isCollapsed, toggleCollapsed } = useSidebar();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Define favorite pages - these would typically come from user preferences or be customizable
  const favoritePages = [
    {
      href: '/',
      label: 'Dashboard',
      icon: Home,
      category: 'Overview'
    },
    {
      href: '/overview',
      label: 'System Overview',
      icon: Eye,
      category: 'Overview'
    },
    {
      href: '/orders',
      label: 'All Orders',
      icon: ShoppingCart,
      category: 'Sales'
    },
    {
      href: '/orders/create',
      label: 'Create Order',
      icon: ShoppingCart,
      category: 'Sales'
    },
    {
      href: '/customers',
      label: 'Customers',
      icon: Users,
      category: 'Sales'
    },
    {
      href: '/products/manage',
      label: 'Manage Products',
      icon: Package,
      category: 'Products'
    },
    {
      href: '/inventory',
      label: 'Stock Overview',
      icon: Package,
      category: 'Inventory'
    },
    {
      href: '/stores',
      label: 'Stores',
      icon: Store,
      category: 'Locations'
    },
    {
      href: '/warehouses',
      label: 'Warehouses',
      icon: Warehouse,
      category: 'Locations'
    },
    {
      href: '/branches',
      label: 'Branches',
      icon: MapPin,
      category: 'Locations'
    },
    {
      href: '/vendors',
      label: 'Vendors',
      icon: Building2,
      category: 'Purchasing'
    },
    {
      href: '/analytics',
      label: 'Analytics',
      icon: BarChart3,
      category: 'Reports'
    }
  ];

  // Group favorites by category
  const favoritesByCategory = favoritePages.reduce((acc, page) => {
    if (!acc[page.category]) {
      acc[page.category] = [];
    }
    acc[page.category].push(page);
    return acc;
  }, {} as Record<string, typeof favoritePages>);

  // Sample notification data
  const notifications = [
    {
      id: 1,
      type: 'order',
      title: 'New Order Received',
      message: 'Order #12345 has been placed by John Smith',
      time: '2 minutes ago',
      icon: Package,
      unread: true,
      priority: 'high'
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Processed',
      message: 'Payment of $299.99 received for Order #12344',
      time: '15 minutes ago',
      icon: DollarSign,
      unread: true,
      priority: 'normal'
    },
    {
      id: 3,
      type: 'delivery',
      title: 'Package Delivered',
      message: 'Order #12340 has been successfully delivered',
      time: '1 hour ago',
      icon: Truck,
      unread: true,
      priority: 'normal'
    },
    {
      id: 4,
      type: 'system',
      title: 'System Update',
      message: 'New features available in the dashboard',
      time: '2 hours ago',
      icon: Settings,
      unread: false,
      priority: 'low'
    },
    {
      id: 5,
      type: 'alert',
      title: 'Low Stock Alert',
      message: 'Business cards are running low (50 remaining)',
      time: '3 hours ago',
      icon: AlertCircle,
      unread: false,
      priority: 'high'
    }
  ];

  // Sample chat/message data
  const messages = [
    {
      id: 1,
      sender: 'Sarah Johnson',
      senderRole: 'Customer',
      message: 'Hi, I need help with my order status. Can you check?',
      time: '5 minutes ago',
      unread: true,
      avatar: 'SJ'
    },
    {
      id: 2,
      sender: 'Mike Chen',
      senderRole: 'Sales Rep',
      message: 'The quarterly report is ready for review',
      time: '1 hour ago',
      unread: true,
      avatar: 'MC'
    },
    {
      id: 3,
      sender: 'Emma Wilson',
      senderRole: 'Support',
      message: 'Thanks for the quick response on the printing issue!',
      time: '2 hours ago',
      unread: false,
      avatar: 'EW'
    },
    {
      id: 4,
      sender: 'David Brown',
      senderRole: 'Manager',
      message: 'Team meeting moved to 3 PM today',
      time: '3 hours ago',
      unread: false,
      avatar: 'DB'
    }
  ];

  const unreadNotifications = notifications.filter(n => n.unread).length;
  const unreadMessages = messages.filter(m => m.unread).length;

  return (
    <header 
      className={cn(
        "fixed top-0 z-50 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b transition-all duration-300",
        isRTL 
          ? (isCollapsed ? "lg:right-20 left-0" : "lg:right-64 left-0")
          : (isCollapsed ? "lg:left-20 right-0" : "lg:left-64 right-0")
      )}
    >
      <div className="flex h-full items-center justify-between px-4 min-w-0 overflow-hidden">
        {/* Left Section - Sidebar Toggle, Favorites & Search */}
        <div className="flex items-center space-x-4">
          {/* Sidebar Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-accent"
            onClick={toggleCollapsed}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>

          {/* Main Menu - All Pages */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden lg:flex items-center space-x-2 px-3 h-8 hover:bg-accent"
              >
                <Layers className="h-4 w-4" />
                <span className="text-sm font-medium">All Pages</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-96 p-0" align="start" sideOffset={8}>
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center space-x-2">
                    <Grid className="h-4 w-4 text-primary" />
                    <span>System Navigation</span>
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    All Modules
                  </Badge>
                </div>
              </div>
              <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 scroll-smooth">
                
                {/* Dashboard & Overview */}
                <div className="border-b last:border-b-0">
                  <div className="px-4 py-2 bg-muted/30">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Dashboard & Overview
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 gap-1 p-2">
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <Home className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Dashboard</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/overview" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <Eye className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">System Overview</span>
                      </a>
                    </DropdownMenuItem>
                  </div>
                </div>

                {/* Sales & Customers */}
                <div className="border-b last:border-b-0">
                  <div className="px-4 py-2 bg-muted/30">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Sales & Customers
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 gap-1 p-2">
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/orders" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <ShoppingCart className="h-4 w-4 text-green-500" />
                        <span className="text-sm">All Orders</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/orders/create" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <Plus className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Create Order</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/orders/pipeline" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <Activity className="h-4 w-4 text-orange-500" />
                        <span className="text-sm">Order Pipeline</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/orders/templates" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <FileText className="h-4 w-4 text-indigo-500" />
                        <span className="text-sm">Templates</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/customers" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <Users className="h-4 w-4 text-cyan-500" />
                        <span className="text-sm">Customers</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/pos" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <CreditCard className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm">Point of Sale</span>
                      </a>
                    </DropdownMenuItem>
                  </div>
                </div>

                {/* Products & Catalog */}
                <div className="border-b last:border-b-0">
                  <div className="px-4 py-2 bg-muted/30">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Products & Catalog
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 gap-1 p-2">
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/products/manage" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <Package className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Manage Products</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/products/types/sales" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <ShoppingCart className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Sales Products</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/products/types/print" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <Printer className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">Print Items</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/products/types/services" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <Wrench className="h-4 w-4 text-orange-500" />
                        <span className="text-sm">Services</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/products/types/raw-materials" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <Package className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Raw Materials</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/products/kits-bundles" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <Layers className="h-4 w-4 text-indigo-500" />
                        <span className="text-sm">Kits & Bundles</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/products/types/assets" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <Building2 className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Assets</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/categories" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <List className="h-4 w-4 text-teal-500" />
                        <span className="text-sm">Categories</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/brands" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <Award className="h-4 w-4 text-pink-500" />
                        <span className="text-sm">Brands</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/price-lists" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Price Lists</span>
                      </a>
                    </DropdownMenuItem>
                  </div>
                </div>

                {/* Inventory & Warehouse */}
                <div className="border-b last:border-b-0">
                  <div className="px-4 py-2 bg-muted/30">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Inventory & Warehouse
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 gap-1 p-2">
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/inventory" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <Package className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Stock Overview</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/warehouses" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <Warehouse className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">Warehouses</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/warehouse/operations" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <Truck className="h-4 w-4 text-orange-500" />
                        <span className="text-sm">Operations</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/warehouse/goods-receipts" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <Download className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Goods Receipts</span>
                      </a>
                    </DropdownMenuItem>
                  </div>
                </div>

                {/* Purchasing & Suppliers */}
                <div className="border-b last:border-b-0">
                  <div className="px-4 py-2 bg-muted/30">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Purchasing & Suppliers
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 gap-1 p-2">
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/vendors" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <Building2 className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Vendors</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/purchase-orders" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <FileText className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Purchase Orders</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/purchase-orders/create" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <Plus className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Create PO</span>
                      </a>
                    </DropdownMenuItem>
                  </div>
                </div>

                {/* Locations & Facilities */}
                <div className="border-b last:border-b-0">
                  <div className="px-4 py-2 bg-muted/30">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Locations & Facilities
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 gap-1 p-2">
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/stores" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <Store className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Stores</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/branches" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <MapPin className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">Branches</span>
                      </a>
                    </DropdownMenuItem>
                  </div>
                </div>

                {/* Human Resources */}
                <div className="border-b last:border-b-0">
                  <div className="px-4 py-2 bg-muted/30">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Human Resources
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 gap-1 p-2">
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/hr" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <BarChart3 className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">HR Dashboard</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/hr/employees" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <UserPlus className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Employees</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/hr/departments" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <Building2 className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">Departments</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/hr/organization-chart" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <Network className="h-4 w-4 text-indigo-500" />
                        <span className="text-sm">Org Chart</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/hr/leave-requests" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <Calendar className="h-4 w-4 text-orange-500" />
                        <span className="text-sm">Leave Requests</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/hr/payroll" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Payroll</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/hr/performance" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <TrendingUp className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Performance</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/hr/recruitment" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <Briefcase className="h-4 w-4 text-cyan-500" />
                        <span className="text-sm">Recruitment</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/hr/policies" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <ClipboardList className="h-4 w-4 text-pink-500" />
                        <span className="text-sm">Policies</span>
                      </a>
                    </DropdownMenuItem>
                  </div>
                </div>

                {/* Analytics & Reports */}
                <div className="border-b last:border-b-0">
                  <div className="px-4 py-2 bg-muted/30">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Analytics & Reports
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 gap-1 p-2">
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/analytics" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <BarChart3 className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Analytics</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/reports" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <FileSpreadsheet className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Reports</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/dashboard" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <PieChart className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">Dashboard</span>
                      </a>
                    </DropdownMenuItem>
                  </div>
                </div>

                {/* System & Administration */}
                <div className="border-b last:border-b-0">
                  <div className="px-4 py-2 bg-muted/30">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      System & Administration
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 gap-1 p-2">
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/users" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Users</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/settings" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <Settings className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Settings</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <a href="/admin/seed-brands" className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer rounded">
                        <Database className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Seed Data</span>
                      </a>
                    </DropdownMenuItem>
                  </div>
                </div>

              </div>
              <div className="p-3 border-t bg-muted/30">
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" className="text-xs">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Quick Access
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Settings className="h-3 w-3 mr-1" />
                    Customize
                  </Button>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Favorites Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden lg:flex items-center space-x-2 px-3 h-8 hover:bg-accent"
              >
                <Heart className="h-4 w-4" />
                <span className="text-sm font-medium">Favorites</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-0" align="start" sideOffset={8}>
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>Favorite Pages</span>
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {favoritePages.length} pages
                  </Badge>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 scroll-smooth">
                {Object.entries(favoritesByCategory).map(([category, pages]) => (
                  <div key={category} className="border-b last:border-b-0">
                    <div className="px-4 py-2 bg-muted/30">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        {category}
                      </h4>
                    </div>
                    {pages.map((page, index) => (
                      <DropdownMenuItem key={index} asChild className="p-0">
                        <a 
                          href={page.href}
                          className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-accent/50 transition-colors cursor-pointer"
                        >
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <page.icon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">
                              {page.label}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {page.href}
                            </p>
                          </div>
                          <Star className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                        </a>
                      </DropdownMenuItem>
                    ))}
                  </div>
                ))}
                {favoritePages.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    No favorite pages yet
                  </div>
                )}
              </div>
              <div className="p-3 border-t bg-muted/30">
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Settings className="h-3 w-3 mr-1" />
                    Manage Favorites
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Eye className="h-3 w-3 mr-1" />
                    View All Pages
                  </Button>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Search Bar */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('search') || 'Search...'}
              className="pl-10 pr-4 py-2 w-48 xl:w-64 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Right Section - Actions & User Menu */}
        <div className="flex items-center space-x-1 flex-shrink-0">
          {/* Mobile Menu Button - Hidden on larger screens */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 lg:hidden flex items-center justify-center"
            onClick={() => {/* Add mobile menu logic */}}
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          {/* Language Switcher - Hidden on smaller screens */}
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>

          {/* Theme Toggle - Hidden on smaller screens */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleDarkMode}
            className="h-10 w-10 p-0 hidden md:flex items-center justify-center"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Chat/Messages */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative h-10 w-10 p-0 flex items-center justify-center [&[data-state=open]>svg:last-child]:hidden">
                <MessageCircle className="h-5 w-5" />
                {unreadMessages > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white rounded-full">
                    {unreadMessages}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-0" align="end" sideOffset={8}>
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Messages</h3>
                  <Button variant="ghost" size="sm" className="text-xs">
                    New Message
                  </Button>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 scroll-smooth">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={cn(
                      "p-4 border-b hover:bg-accent/50 transition-colors cursor-pointer",
                      message.unread && "bg-green-50/50"
                    )}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-primary">
                          {message.avatar}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-foreground">
                            {message.sender}
                          </p>
                          {message.unread && (
                            <div className="h-2 w-2 bg-green-500 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {message.senderRole}
                        </p>
                        <p className="text-sm text-muted-foreground mb-1 line-clamp-2">
                          {message.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {message.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {messages.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    No messages
                  </div>
                )}
              </div>
              <div className="p-3 border-t bg-muted/30">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  View All Messages
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative h-10 w-10 p-0 flex items-center justify-center [&[data-state=open]>svg:last-child]:hidden">
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white rounded-full">
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-0" align="end" sideOffset={8}>
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{t('notifications') || 'Notifications'}</h3>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Mark all read
                  </Button>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 scroll-smooth">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={cn(
                      "p-4 border-b hover:bg-accent/50 transition-colors cursor-pointer",
                      notification.unread && "bg-blue-50/50"
                    )}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                        notification.priority === 'high' ? "bg-red-100 text-red-600" :
                        notification.priority === 'normal' ? "bg-blue-100 text-blue-600" :
                        "bg-gray-100 text-gray-600"
                      )}>
                        <notification.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-foreground">
                            {notification.title}
                          </p>
                          {notification.unread && (
                            <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    No notifications
                  </div>
                )}
              </div>
              <div className="p-3 border-t bg-muted/30">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  View All Notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 p-0 rounded-full flex items-center justify-center">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
                </Button>
              </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
              <div className="p-2 border-b">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                    </div>
                  </div>
                </div>
              
              <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 scroll-smooth">
                <DropdownMenuItem className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{t('profile') || 'Profile'}</span>
                </DropdownMenuItem>

                <DropdownMenuItem className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>{t('settings') || 'Settings'}</span>
                </DropdownMenuItem>

                <DropdownMenuItem className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Billing</span>
                </DropdownMenuItem>

                <DropdownMenuItem className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>{t('security') || 'Security'}</span>
                </DropdownMenuItem>

                <DropdownMenuItem className="flex items-center space-x-2">
                  <HelpCircle className="h-4 w-4" />
                  <span>Help</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  className="flex items-center space-x-2 text-destructive focus:text-destructive"
                  onClick={signOut}
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('signOut') || 'Sign Out'}</span>
                </DropdownMenuItem>
              </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
    </header>
  );
}
