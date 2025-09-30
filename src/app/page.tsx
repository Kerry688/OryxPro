'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ChartCard, DonutChart, LineChart } from '@/components/dashboard/ChartCard';
import { DataTable, ProjectsTable } from '@/components/dashboard/DataTable';
import { 
  Clock, 
  MapPin, 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow,
  TrendingUp, 
  TrendingDown,
  Package,
  Users,
  DollarSign,
  ShoppingCart,
  Bell,
  Settings,
  Plus,
  Eye,
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle,
  Star,
  Zap,
  Target,
  BarChart3,
  Building2,
  FileText,
  Truck,
  CreditCard,
  TrendingUp as TrendingUpIcon,
  MessageSquare,
  Shield,
  UserCheck,
  Search,
  Tag,
  Warehouse,
  Workflow,
  Home,
  Menu,
  ChevronRight,
  ArrowRight,
  Star as StarIcon,
  Award,
  Trophy,
  TrendingDown as TrendingDownIcon,
  MoreHorizontal
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/use-translation';
import { 
  products, 
  customers, 
  stockLevels, 
  branches, 
  vendors, 
  salesOrders, 
  orderPipelineInstances,
  users 
} from '@/lib/data';
import Link from 'next/link';

interface WeatherData {
  temperature: number;
  condition: string;
  location: string;
  humidity: number;
  windSpeed: number;
}

export default function HomePage() {
  const { user, role, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [greeting, setGreeting] = useState('');

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Set greeting based on time
  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 12) {
      setGreeting(t('goodMorning'));
    } else if (hour < 17) {
      setGreeting(t('goodAfternoon'));
    } else {
      setGreeting(t('goodEvening'));
    }
  }, [currentTime, t]);

  // Mock weather data (in a real app, you'd fetch this from a weather API)
  useEffect(() => {
    const mockWeather: WeatherData = {
      temperature: 22,
      condition: 'partly-cloudy',
      location: 'New York, NY',
      humidity: 65,
      windSpeed: 12
    };
    setWeather(mockWeather);
  }, []);

  // Calculate comprehensive stats
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const totalCustomers = customers.length;
  const totalVendors = vendors.length;
  const activeVendors = vendors.filter(v => v.status === 'active').length;
  const lowStockItems = stockLevels.filter(stock => stock.availableQuantity <= stock.quantity * 0.2).length;
  const totalBranches = branches.length;
  const totalOrders = salesOrders.length;
  const activeOrders = salesOrders.filter(o => !['completed', 'cancelled'].includes(o.status)).length;
  const completedOrders = salesOrders.filter(o => o.status === 'completed').length;
  const totalRevenue = salesOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const todayRevenue = salesOrders
    .filter(order => new Date(order.orderDate).toDateString() === new Date().toDateString())
    .reduce((sum, order) => sum + order.totalAmount, 0);
  const pipelineOrders = orderPipelineInstances.length;
  const activePipelineOrders = orderPipelineInstances.filter(i => !i.isCompleted).length;

  // Get weather icon
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="h-6 w-6 text-gray-500" />;
      case 'partly-cloudy':
        return <Cloud className="h-6 w-6 text-blue-400" />;
      case 'rainy':
        return <CloudRain className="h-6 w-6 text-blue-600" />;
      case 'snowy':
        return <CloudSnow className="h-6 w-6 text-blue-300" />;
      default:
        return <Sun className="h-6 w-6 text-yellow-500" />;
    }
  };

  // Role-based menu items
  const getMenuItems = () => {
    const baseItems = [
      { name: 'Dashboard', icon: Home, href: '/', color: 'bg-blue-500' },
      { name: 'Products', icon: Package, href: '/products', color: 'bg-green-500' },
      { name: 'Orders', icon: FileText, href: '/orders', color: 'bg-purple-500' },
      { name: 'Customers', icon: Users, href: '/customers', color: 'bg-orange-500' },
    ];

    // Add role-specific items
    if (role?.name === 'Super Admin' || role?.name === 'Branch Manager') {
      baseItems.push(
        { name: 'Vendors', icon: Building2, href: '/vendors', color: 'bg-indigo-500' },
        { name: 'Users', icon: UserCheck, href: '/users', color: 'bg-red-500' },
        { name: 'Warehouse', icon: Warehouse, href: '/warehouse', color: 'bg-cyan-500' },
        { name: 'Inventory', icon: Package, href: '/inventory', color: 'bg-yellow-500' }
      );
    }

    if (role?.name === 'Super Admin') {
      baseItems.push(
        { name: 'Analytics', icon: BarChart3, href: '/dashboard', color: 'bg-pink-500' },
        { name: 'Settings', icon: Settings, href: '/profile', color: 'bg-gray-500' }
      );
    }

    return baseItems;
  };

  // Quick actions based on user role
  const quickActions = [
    { name: t('createOrder'), icon: ShoppingCart, href: '/orders/create', color: 'bg-blue-500' },
    { name: t('addProduct'), icon: Package, href: '/products/manage', color: 'bg-green-500' },
    { name: t('newCustomer'), icon: Users, href: '/customers', color: 'bg-purple-500' },
    { name: t('posSystem'), icon: ShoppingCart, href: '/pos', color: 'bg-orange-500' },
    { name: t('orderPipeline'), icon: Workflow, href: '/orders/pipeline', color: 'bg-indigo-500' },
    { name: t('trackOrder'), icon: Search, href: '/track-order', color: 'bg-cyan-500' },
  ];

  // Recent activities (mock data)
  const recentActivities = [
    { id: 1, type: 'order', message: 'New order #12345 received', time: '2 minutes ago', icon: ShoppingCart },
    { id: 2, type: 'customer', message: 'Customer TechCorp Solutions updated', time: '15 minutes ago', icon: Users },
    { id: 3, type: 'vendor', message: 'Payment made to Premium Paper Co.', time: '30 minutes ago', icon: Building2 },
    { id: 4, type: 'inventory', message: 'Low stock alert: Business Cards', time: '1 hour ago', icon: AlertTriangle },
    { id: 5, type: 'payment', message: 'Payment received from Marketing Pro Agency', time: '2 hours ago', icon: DollarSign },
  ];

  if (!isAuthenticated) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to OryxPro ERP</h1>
          <p className="text-xl text-gray-600 mb-8">Your comprehensive business management solution</p>
          <div className="space-x-4">
            <Link href="/auth/login">
              <Button size="lg">Sign In</Button>
                </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline">Get Started</Button>
                </Link>
          </div>
        </div>
      </div>
    );
  }

  // Sample data for charts and tables
  const earningsData = [
    { label: 'Leaf CRM', value: 7660, color: '#3b82f6' },
    { label: 'Mivy App', value: 2820, color: '#10b981' },
    { label: 'Others', value: 45257, color: '#f59e0b' },
  ];

  const performanceData = [
    { label: '9 AM', value: 120 },
    { label: '10 AM', value: 180 },
    { label: '11 AM', value: 220 },
    { label: '12 PM', value: 190 },
    { label: '1 PM', value: 250 },
    { label: '2 PM', value: 280 },
    { label: '3 PM', value: 320 },
    { label: '4 PM', value: 290 },
    { label: '5 PM', value: 240 },
    { label: '6 PM', value: 200 },
  ];

  const projectsData = [
    { name: 'Mivy App', manager: 'Jane Cooper', budget: '$32,400', progress: 85, status: 'in-progress' as const, trend: 9.2 },
    { name: 'Avionica', manager: 'Esther Howard', budget: '$256,910', progress: 45, status: 'on-hold' as const, trend: -0.4 },
    { name: 'Charto CRM', manager: 'Jenny Wilson', budget: '$8,220', progress: 92, status: 'in-progress' as const, trend: 9.2 },
    { name: 'Tower Hill', manager: 'Cody Fisher', budget: '$74,000', progress: 100, status: 'completed' as const, trend: 9.2 },
    { name: '9 Degree', manager: 'Savannah Nguyen', budget: '$183,300', progress: 78, status: 'in-progress' as const, trend: -0.4 },
  ];

  return (
    <div className="min-h-screen bg-background w-full max-w-full overflow-x-hidden">
      <div className="w-full max-w-full px-4 py-6 space-y-6" style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
        {/* Welcome Section */}
        <div className="flex items-center justify-between w-full max-w-full overflow-x-hidden">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold tracking-tight">
              {greeting}, {user?.firstName}!
            </h1>
            <p className="text-muted-foreground">
              {user?.department} • {user?.branch?.name || 'Main Branch'}
            </p>
          </div>
          <div className="flex items-center space-x-4 flex-shrink-0">
            <div className="text-right">
              <div className="flex items-center space-x-2 text-lg font-semibold">
                <Clock className="h-5 w-5" />
                <span>{currentTime.toLocaleTimeString()}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            {weather && (
              <Card className="w-48 flex-shrink-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{weather.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        {getWeatherIcon(weather.condition)}
                        <span className="text-2xl font-bold">{weather.temperature}°C</span>
                      </div>
                      <p className="text-xs text-muted-foreground capitalize">
                        {weather.condition.replace('-', ' ')}
                      </p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <p>Humidity: {weather.humidity}%</p>
                      <p>Wind: {weather.windSpeed} km/h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title={t('totalOrders')}
            value={totalOrders}
            subtitle={`${activeOrders} ${t('active')}, ${completedOrders} ${t('completed')}`}
            trend={{ value: 12.5, isPositive: true }}
            icon={<FileText className="h-4 w-4" />}
            color="blue"
          />
          <StatsCard
            title={t('todaysRevenue')}
            value={`$${todayRevenue.toLocaleString()}`}
            subtitle={`Total: $${totalRevenue.toLocaleString()}`}
            trend={{ value: 8.2, isPositive: true }}
            icon={<DollarSign className="h-4 w-4" />}
            color="green"
          />
          <StatsCard
            title={t('pipelineOrders')}
            value={pipelineOrders}
            subtitle={`${activePipelineOrders} ${t('inProgress')}`}
            trend={{ value: 15.3, isPositive: true }}
            icon={<Workflow className="h-4 w-4" />}
            color="purple"
          />
          <StatsCard
            title={t('lowStockAlert')}
            value={lowStockItems}
            subtitle={t('itemsNeedRestocking')}
            trend={{ value: -5.2, isPositive: false }}
            icon={<AlertTriangle className="h-4 w-4" />}
            color="orange"
          />
        </div>

        {/* Charts and Data Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Earnings Chart */}
          <ChartCard
            title="Projects Earnings in April"
            value="$69,700"
            trend={{ value: 2.2, isPositive: true, label: "vs last month" }}
            actions={
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            }
          >
            <div className="flex items-center justify-center">
              <DonutChart data={earningsData} size={200} />
            </div>
            <div className="mt-4 space-y-2">
              {earningsData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <span className="text-sm font-medium">${item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Performance Chart */}
          <ChartCard
            title="Performance"
            subtitle="1,046 Inbound Calls today"
            value="$8,550"
            trend={{ value: 2.2, isPositive: true, label: "Average cost per interaction" }}
            actions={
              <div className="flex space-x-1">
                <Button variant="outline" size="sm">Month</Button>
                <Button variant="ghost" size="sm">Week</Button>
              </div>
            }
          >
            <LineChart data={performanceData} height={200} color="#10b981" />
          </ChartCard>

          {/* Active Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>69 Active Projects</span>
                <Badge variant="secondary">43 Pending</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm font-medium">72%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '72%' }} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">69</div>
                    <div className="text-xs text-muted-foreground">Active</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">43</div>
                    <div className="text-xs text-muted-foreground">Pending</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Table */}
        <ProjectsTable data={projectsData} />

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title={t('products')}
            value={totalProducts}
            subtitle={`${activeProducts} ${t('activeProducts')}`}
            icon={<Package className="h-4 w-4" />}
            color="indigo"
          />
          <StatsCard
            title={t('customers')}
            value={totalCustomers}
            subtitle={t('activeCustomerBase')}
            icon={<Users className="h-4 w-4" />}
            color="blue"
          />
          <StatsCard
            title={t('vendors')}
            value={totalVendors}
            subtitle={`${activeVendors} ${t('activeVendors')}`}
            icon={<Building2 className="h-4 w-4" />}
            color="purple"
          />
        </div>
      </div>
    </div>
  );
}