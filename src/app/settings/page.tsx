'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Globe,
  Database,
  Key,
  Palette
} from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const settingsCategories = [
    {
      title: 'Company Settings',
      description: 'Manage your holding company information and preferences',
      href: '/settings/company',
      icon: Building2,
      status: 'active',
      features: ['Company Details', 'Contact Information', 'Business Preferences']
    },
    {
      title: 'General Settings',
      description: 'Configure general application settings and preferences',
      href: '/settings/general',
      icon: Settings,
      status: 'coming-soon',
      features: ['Theme Settings', 'Language Preferences', 'Default Values']
    },
    {
      title: 'User Management',
      description: 'Manage user accounts, roles, and permissions',
      href: '/users',
      icon: User,
      status: 'active',
      features: ['User Accounts', 'Roles & Permissions', 'Security Settings']
    },
    {
      title: 'Security Settings',
      description: 'Configure security policies and authentication',
      href: '/settings/security',
      icon: Shield,
      status: 'coming-soon',
      features: ['Authentication', 'Password Policies', 'Access Control']
    },
    {
      title: 'Notifications',
      description: 'Manage notification preferences and alerts',
      href: '/settings/notifications',
      icon: Bell,
      status: 'coming-soon',
      features: ['Email Notifications', 'Push Alerts', 'SMS Settings']
    },
    {
      title: 'Integrations',
      description: 'Configure third-party integrations and APIs',
      href: '/settings/integrations',
      icon: Globe,
      status: 'coming-soon',
      features: ['API Keys', 'Webhooks', 'External Services']
    },
    {
      title: 'Database',
      description: 'Database configuration and maintenance',
      href: '/settings/database',
      icon: Database,
      status: 'coming-soon',
      features: ['Backup Settings', 'Maintenance', 'Performance']
    },
    {
      title: 'API Keys',
      description: 'Manage API keys and authentication tokens',
      href: '/settings/api-keys',
      icon: Key,
      status: 'coming-soon',
      features: ['Generate Keys', 'Access Control', 'Usage Analytics']
    },
    {
      title: 'Appearance',
      description: 'Customize the application appearance and branding',
      href: '/settings/appearance',
      icon: Palette,
      status: 'coming-soon',
      features: ['Theme Customization', 'Logo Settings', 'Color Schemes']
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'coming-soon':
        return <Badge variant="secondary">Coming Soon</Badge>;
      default:
        return <Badge variant="outline">Inactive</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your application settings and preferences
        </p>
      </div>

      {/* Settings Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsCategories.map((category) => (
          <Card key={category.href} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    {getStatusBadge(category.status)}
                  </div>
                </div>
              </div>
              <CardDescription className="mt-2">
                {category.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Features:</h4>
                <ul className="text-sm space-y-1">
                  {category.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="h-1 w-1 bg-muted-foreground rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <Button 
                  asChild 
                  variant={category.status === 'active' ? 'default' : 'outline'}
                  disabled={category.status === 'coming-soon'}
                  className="w-full"
                >
                  <Link href={category.href}>
                    {category.status === 'coming-soon' ? 'Coming Soon' : 'Configure'}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common settings and configuration tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="h-auto p-4">
              <Link href="/settings/company" className="flex flex-col items-center gap-2">
                <Building2 className="h-6 w-6" />
                <span>Company Details</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4" disabled>
              <Link href="/settings/general" className="flex flex-col items-center gap-2">
                <Settings className="h-6 w-6" />
                <span>General Settings</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4">
              <Link href="/users" className="flex flex-col items-center gap-2">
                <User className="h-6 w-6" />
                <span>User Management</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
