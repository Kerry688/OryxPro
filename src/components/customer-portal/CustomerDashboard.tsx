'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  FileText, 
  Truck, 
  CreditCard,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
  Bell,
  Download,
  Eye
} from 'lucide-react';

// Mock data
const mockDashboardData = {
  summary: {
    pendingOrders: 3,
    outstandingInvoices: 2,
    totalOutstanding: 15750,
    recentShipments: 5
  },
  recentOrders: [
    {
      id: 'ORD-2024-001',
      date: '2024-04-15',
      status: 'processing',
      total: 5250,
      items: 3
    },
    {
      id: 'ORD-2024-002',
      date: '2024-04-12',
      status: 'shipped',
      total: 3200,
      items: 2
    },
    {
      id: 'ORD-2024-003',
      date: '2024-04-10',
      status: 'pending',
      total: 1800,
      items: 1
    }
  ],
  outstandingInvoices: [
    {
      id: 'INV-2024-001',
      date: '2024-04-01',
      dueDate: '2024-04-30',
      amount: 8750,
      status: 'overdue'
    },
    {
      id: 'INV-2024-002',
      date: '2024-04-10',
      dueDate: '2024-05-10',
      amount: 7000,
      status: 'pending'
    }
  ],
  recentShipments: [
    {
      id: 'SH-2024-001',
      orderNumber: 'ORD-2024-001',
      carrier: 'DHL Express',
      trackingNumber: 'DHL1234567890',
      status: 'in_transit',
      estimatedDelivery: '2024-04-18'
    },
    {
      id: 'SH-2024-002',
      orderNumber: 'ORD-2024-002',
      carrier: 'FedEx',
      trackingNumber: 'FEDX9876543210',
      status: 'delivered',
      estimatedDelivery: '2024-04-15'
    }
  ],
  notifications: [
    {
      id: 1,
      type: 'order',
      title: 'Order ORD-2024-001 Status Update',
      message: 'Your order has been shipped and is on its way',
      timestamp: '2024-04-15T10:30:00Z',
      read: false
    },
    {
      id: 2,
      type: 'invoice',
      title: 'New Invoice Available',
      message: 'Invoice INV-2024-002 has been generated',
      timestamp: '2024-04-14T14:20:00Z',
      read: false
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment for Invoice INV-2024-001 has been processed',
      timestamp: '2024-04-13T09:15:00Z',
      read: true
    }
  ]
};

export function CustomerDashboard() {
  const [notifications, setNotifications] = useState(mockDashboardData.notifications);

  const getStatusBadge = (status: string) => {
    const configs = {
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'delivered': 'bg-green-100 text-green-800',
      'in_transit': 'bg-blue-100 text-blue-800',
      'overdue': 'bg-red-100 text-red-800'
    };
    return configs[status as keyof typeof configs] || 'bg-gray-100 text-gray-800';
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, John Smith!</h2>
        <p className="text-blue-100">Here's what's happening with your account today.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardData.summary.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              Orders being processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardData.summary.outstandingInvoices}</div>
            <p className="text-xs text-muted-foreground">
              EGP {mockDashboardData.summary.totalOutstanding.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Shipments</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardData.summary.recentShipments}</div>
            <p className="text-xs text-muted-foreground">
              Active shipments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground">
              Credit limit: EGP 50,000
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockDashboardData.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">{order.id}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(order.date)} • {order.items} items
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">EGP {order.total.toLocaleString()}</div>
                    <Badge className={getStatusBadge(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Outstanding Invoices */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Outstanding Invoices</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockDashboardData.outstandingInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium">{invoice.id}</div>
                      <div className="text-sm text-muted-foreground">
                        Due: {formatDate(invoice.dueDate)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">EGP {invoice.amount.toLocaleString()}</div>
                    <Badge className={getStatusBadge(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Shipments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Shipments</CardTitle>
            <Button variant="outline" size="sm">
              Track All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockDashboardData.recentShipments.map((shipment) => (
                <div key={shipment.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{shipment.trackingNumber}</div>
                    <Badge className={getStatusBadge(shipment.status)}>
                      {shipment.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Order: {shipment.orderNumber} • {shipment.carrier}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      Est. Delivery: {formatDate(shipment.estimatedDelivery)}
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Track
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Notifications</CardTitle>
            <Button variant="outline" size="sm">
              Mark All Read
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.slice(0, 3).map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    !notification.read ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      !notification.read ? 'bg-blue-600' : 'bg-gray-300'
                    }`}></div>
                    <div className="flex-1">
                      <div className="font-medium">{notification.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {formatDate(notification.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <ShoppingCart className="h-6 w-6 mb-2" />
              <span className="text-sm">New Order</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <FileText className="h-6 w-6 mb-2" />
              <span className="text-sm">Download Invoice</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <CreditCard className="h-6 w-6 mb-2" />
              <span className="text-sm">Make Payment</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Truck className="h-6 w-6 mb-2" />
              <span className="text-sm">Track Shipment</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
