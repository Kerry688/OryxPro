'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Calculator, 
  TrendingDown,
  Calendar,
  BarChart3,
  FileText,
  Settings
} from 'lucide-react';

export function DepreciationManagement() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Depreciation Management</h2>
          <p className="text-muted-foreground">
            Track asset depreciation using multiple methods
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calculator className="h-4 w-4 mr-2" />
            Calculate Depreciation
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Configure Rules
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Depreciation</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$245,678</div>
            <p className="text-xs text-muted-foreground">
              This month: $12,345
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assets Depreciating</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              Active assets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Methods Used</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              Different methods
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Calculation</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Dec 31</div>
            <p className="text-xs text-muted-foreground">
              Month end
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Depreciation Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Depreciation Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Straight Line</h3>
                <Badge className="bg-blue-100 text-blue-800">Most Used</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Equal depreciation each year
              </p>
              <div className="text-sm">
                <span className="font-medium">Assets:</span> 856
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Declining Balance</h3>
                <Badge className="bg-green-100 text-green-800">Fast</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Higher depreciation in early years
              </p>
              <div className="text-sm">
                <span className="font-medium">Assets:</span> 234
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Units of Production</h3>
                <Badge className="bg-orange-100 text-orange-800">Usage Based</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Based on actual usage
              </p>
              <div className="text-sm">
                <span className="font-medium">Assets:</span> 123
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Sum of Years Digits</h3>
                <Badge className="bg-purple-100 text-purple-800">Accelerated</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Accelerated depreciation method
              </p>
              <div className="text-sm">
                <span className="font-medium">Assets:</span> 21
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Depreciation Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Depreciation Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Depreciation entries will appear here</p>
            <p className="text-sm">Monthly depreciation calculations and reports</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
