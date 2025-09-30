'use client';

import React from 'react';
import { SimpleQuickAccess } from '@/components/navigation/SimpleQuickAccess';
import { SimpleAllPagesMenu } from '@/components/navigation/SimpleAllPagesMenu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Navigation, 
  Zap, 
  Grid3X3, 
  Star, 
  Pin, 
  Clock, 
  Settings,
  Layers,
  Search,
  Bookmark
} from 'lucide-react';

export default function NavigationPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Navigation className="h-6 w-6" />
          <h1 className="text-3xl font-bold">System Navigation</h1>
        </div>
        <p className="text-muted-foreground">
          Enhanced navigation system with quick access, favorites, and comprehensive page management
        </p>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-yellow-500" />
              Quick Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Configure frequently used pages with usage tracking and shortcuts
            </CardDescription>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="secondary">8 items</Badge>
              <Badge variant="outline">Auto-sort</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Grid3X3 className="h-5 w-5 text-blue-500" />
              All Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Browse and search all pages in the system with categories and filters
            </CardDescription>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="secondary">50+ pages</Badge>
              <Badge variant="outline">Search</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="h-5 w-5 text-purple-500" />
              Favorites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Star your favorite pages for quick access and organization
            </CardDescription>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="secondary">Personalized</Badge>
              <Badge variant="outline">Persistent</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Pin className="h-5 w-5 text-green-500" />
              Pinned Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Pin important pages to keep them easily accessible at the top
            </CardDescription>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="secondary">Priority</Badge>
              <Badge variant="outline">Sticky</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Navigation Component */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Enhanced Navigation System
          </CardTitle>
          <CardDescription>
            Complete navigation solution with search, favorites, recent items, and customization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <SimpleQuickAccess />
              <SimpleAllPagesMenu />
            </div>
            <div className="text-center py-8 text-muted-foreground">
              <p>Enhanced navigation components with quick access and comprehensive page browsing</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Discovery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium">Global Search</h4>
              <p className="text-sm text-muted-foreground">
                Search across all pages, descriptions, and tags with instant results
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Category Filtering</h4>
              <p className="text-sm text-muted-foreground">
                Filter by categories like Sales, HR, Products, Analytics, and more
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Smart Sorting</h4>
              <p className="text-sm text-muted-foreground">
                Sort by name, category, popularity, or recently added
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Customization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium">Personal Preferences</h4>
              <p className="text-sm text-muted-foreground">
                Customize view modes, show/hide sections, and set display options
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Usage Tracking</h4>
              <p className="text-sm text-muted-foreground">
                Automatic tracking of page visits and usage statistics
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Persistent Storage</h4>
              <p className="text-sm text-muted-foreground">
                All preferences and favorites are saved locally for consistency
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Navigation Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Total Pages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-sm text-muted-foreground">Quick Access</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">10</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">3</div>
              <div className="text-sm text-muted-foreground">View Modes</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
