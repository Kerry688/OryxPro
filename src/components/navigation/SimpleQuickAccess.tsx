'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from '@/hooks/use-translation';
import { 
  Zap,
  Plus,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  Star,
  ChevronDown,
  Edit,
  Search,
  Clock,
  TrendingUp,
  DollarSign,
  UserPlus,
  Building2,
  Warehouse,
  Store,
  Calendar,
  Bell,
  HelpCircle,
  Star as StarIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickAccessItem {
  id: string;
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  category: string;
  usageCount?: number;
  lastUsed?: Date;
  shortcut?: string;
}

interface QuickAccessSettings {
  maxItems: number;
  showUsageCount: boolean;
  showLastUsed: boolean;
  autoSort: boolean;
}

export function SimpleQuickAccess() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [settings, setSettings] = useState<QuickAccessSettings>({
    maxItems: 8,
    showUsageCount: true,
    showLastUsed: true,
    autoSort: true
  });

  // Default quick access items
  const defaultItems: QuickAccessItem[] = [
    {
      id: 'create-order',
      href: '/orders/create',
      label: 'Create Order',
      icon: Plus,
      description: 'Create new sales order',
      category: 'Sales',
      usageCount: 0,
      shortcut: 'Ctrl+O'
    },
    {
      id: 'manage-products',
      href: '/products/manage',
      label: 'Manage Products',
      icon: Package,
      description: 'Add and edit products',
      category: 'Products',
      usageCount: 0,
      shortcut: 'Ctrl+P'
    },
    {
      id: 'all-customers',
      href: '/customers',
      label: 'All Customers',
      icon: Users,
      description: 'Customer database',
      category: 'Sales',
      usageCount: 0,
      shortcut: 'Ctrl+C'
    },
    {
      id: 'stock-overview',
      href: '/inventory',
      label: 'Stock Overview',
      icon: Package,
      description: 'Inventory levels',
      category: 'Inventory',
      usageCount: 0,
      shortcut: 'Ctrl+I'
    },
    {
      id: 'analytics',
      href: '/analytics',
      label: 'Analytics',
      icon: BarChart3,
      description: 'Business insights',
      category: 'Analytics',
      usageCount: 0,
      shortcut: 'Ctrl+A'
    },
    {
      id: 'employees',
      href: '/hr/employees',
      label: 'Employees',
      icon: UserPlus,
      description: 'Employee management',
      category: 'HR',
      usageCount: 0,
      shortcut: 'Ctrl+E'
    },
    {
      id: 'purchase-orders',
      href: '/purchase-orders/create',
      label: 'Create PO',
      icon: Plus,
      description: 'Create purchase order',
      category: 'Purchasing',
      usageCount: 0,
      shortcut: 'Ctrl+Shift+P'
    },
    {
      id: 'settings',
      href: '/settings',
      label: 'Settings',
      icon: Settings,
      description: 'System settings',
      category: 'Admin',
      usageCount: 0,
      shortcut: 'Ctrl+,'
    }
  ];

  // Additional items for customization
  const availableItems: QuickAccessItem[] = [
    ...defaultItems,
    {
      id: 'pos',
      href: '/pos',
      label: 'Point of Sale',
      icon: ShoppingCart,
      description: 'POS system',
      category: 'Sales',
      usageCount: 0
    },
    {
      id: 'price-lists',
      href: '/price-lists',
      label: 'Price Lists',
      icon: DollarSign,
      description: 'Manage pricing',
      category: 'Products',
      usageCount: 0
    },
    {
      id: 'warehouses',
      href: '/warehouses',
      label: 'Warehouses',
      icon: Warehouse,
      description: 'Warehouse management',
      category: 'Locations',
      usageCount: 0
    },
    {
      id: 'stores',
      href: '/stores',
      label: 'Stores',
      icon: Store,
      description: 'Store management',
      category: 'Locations',
      usageCount: 0
    },
    {
      id: 'branches',
      href: '/branches',
      label: 'Branches',
      icon: Building2,
      description: 'Branch management',
      category: 'Locations',
      usageCount: 0
    },
    {
      id: 'departments',
      href: '/hr/departments',
      label: 'Departments',
      icon: Building2,
      description: 'Department management',
      category: 'HR',
      usageCount: 0
    },
    {
      id: 'leave-management',
      href: '/hr/leave',
      label: 'Leave Management',
      icon: Calendar,
      description: 'Employee leave',
      category: 'HR',
      usageCount: 0
    },
    {
      id: 'payroll',
      href: '/hr/payroll',
      label: 'Payroll',
      icon: DollarSign,
      description: 'Employee payroll',
      category: 'HR',
      usageCount: 0
    },
    {
      id: 'notifications',
      href: '/notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'System alerts',
      category: 'Personal',
      usageCount: 0
    },
    {
      id: 'help',
      href: '/help',
      label: 'Help Center',
      icon: HelpCircle,
      description: 'Documentation',
      category: 'Personal',
      usageCount: 0
    }
  ];

  const [quickAccessItems, setQuickAccessItems] = useState<QuickAccessItem[]>([]);
  const [usageStats, setUsageStats] = useState<Record<string, { count: number; lastUsed: Date }>>({});

  // Load saved quick access items and settings
  useEffect(() => {
    const savedItems = localStorage.getItem('simple-quick-access-items');
    const savedSettings = localStorage.getItem('simple-quick-access-settings');
    const savedUsageStats = localStorage.getItem('simple-quick-access-usage');

    if (savedItems) {
      setQuickAccessItems(JSON.parse(savedItems));
    } else {
      setQuickAccessItems(defaultItems);
    }

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    if (savedUsageStats) {
      setUsageStats(JSON.parse(savedUsageStats));
    }
  }, []);

  // Save settings and items to localStorage
  useEffect(() => {
    localStorage.setItem('simple-quick-access-items', JSON.stringify(quickAccessItems));
  }, [quickAccessItems]);

  useEffect(() => {
    localStorage.setItem('simple-quick-access-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('simple-quick-access-usage', JSON.stringify(usageStats));
  }, [usageStats]);

  // Track page visits for usage statistics
  useEffect(() => {
    if (pathname && !pathname.includes('/api/')) {
      const item = quickAccessItems.find(item => item.href === pathname);
      if (item) {
        setUsageStats(prev => ({
          ...prev,
          [item.id]: {
            count: (prev[item.id]?.count || 0) + 1,
            lastUsed: new Date()
          }
        }));
      }
    }
  }, [pathname, quickAccessItems]);

  // Sort items based on settings
  const sortedItems = React.useMemo(() => {
    let sorted = [...quickAccessItems];

    if (settings.autoSort) {
      sorted.sort((a, b) => {
        const aStats = usageStats[a.id];
        const bStats = usageStats[b.id];
        
        // Sort by usage count first, then by last used
        if (aStats && bStats) {
          if (aStats.count !== bStats.count) {
            return bStats.count - aStats.count;
          }
          return new Date(bStats.lastUsed).getTime() - new Date(aStats.lastUsed).getTime();
        }
        
        if (aStats && !bStats) return -1;
        if (!aStats && bStats) return 1;
        
        return a.label.localeCompare(b.label);
      });
    }

    return sorted.slice(0, settings.maxItems);
  }, [quickAccessItems, usageStats, settings]);

  // Filter available items for customization
  const filteredAvailableItems = availableItems.filter(item => 
    !quickAccessItems.find(selected => selected.id === item.id) &&
    (searchQuery === '' || 
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const isActive = (href: string) => pathname === href;

  const addItem = (item: QuickAccessItem) => {
    setQuickAccessItems(prev => [...prev, item]);
  };

  const removeItem = (itemId: string) => {
    setQuickAccessItems(prev => prev.filter(item => item.id !== itemId));
  };

  return (
    <>
      {/* Quick Access Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <Zap className="h-4 w-4" />
            <span>Quick Access</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-80" align="start">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Quick Access
            <div className="ml-auto">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => setIsCustomizing(true)}
              >
                <Edit className="h-3 w-3" />
              </Button>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuGroup>
            {sortedItems.map((item) => {
              const itemStats = usageStats[item.id];
              const isItemActive = isActive(item.href);
              
              return (
                <DropdownMenuItem key={item.id} asChild>
                  <Link 
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-md cursor-pointer",
                      isItemActive && "bg-accent text-accent-foreground"
                    )}
                  >
                    <div className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                      isItemActive ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">{item.label}</span>
                        {item.shortcut && (
                          <Badge variant="outline" className="text-xs ml-auto">
                            {item.shortcut}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground truncate">
                        {item.description}
                      </p>
                      
                      {settings.showUsageCount && itemStats && (
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <TrendingUp className="h-3 w-3" />
                          <span>{itemStats.count} uses</span>
                          {settings.showLastUsed && itemStats.lastUsed && (
                            <>
                              <span>•</span>
                              <Clock className="h-3 w-3" />
                              <span>{new Date(itemStats.lastUsed).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
          
          {sortedItems.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No quick access items configured
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Customization Dialog - Separate Dialog */}
      <Dialog open={isCustomizing} onOpenChange={setIsCustomizing}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Customize Quick Access
            </DialogTitle>
            <DialogDescription>
              Configure your frequently used pages and features
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxItems">Maximum Items</Label>
                  <Input
                    id="maxItems"
                    type="number"
                    min="4"
                    max="12"
                    value={settings.maxItems}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      maxItems: parseInt(e.target.value) || 8 
                    }))}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showUsageCount">Show Usage Count</Label>
                    <Switch
                      id="showUsageCount"
                      checked={settings.showUsageCount}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, showUsageCount: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showLastUsed">Show Last Used</Label>
                    <Switch
                      id="showLastUsed"
                      checked={settings.showLastUsed}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, showLastUsed: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoSort">Auto Sort by Usage</Label>
                    <Switch
                      id="autoSort"
                      checked={settings.autoSort}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, autoSort: checked }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Current Items */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Current Quick Access Items</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {quickAccessItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <item.icon className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{item.label}</span>
                        {item.shortcut && (
                          <Badge variant="outline" className="text-xs">
                            {item.shortcut}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => removeItem(item.id)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Available Items</h3>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {filteredAvailableItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <item.icon className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-sm">{item.label}</span>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addItem(item)}
                      disabled={quickAccessItems.length >= settings.maxItems}
                    >
                      Add
                    </Button>
                  </div>
                ))}
              </div>

              {filteredAvailableItems.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? 'No items found matching your search' : 'No available items to add'}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
