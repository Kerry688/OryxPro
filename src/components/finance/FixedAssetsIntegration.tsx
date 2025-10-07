'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Plus, TrendingDown, Settings } from 'lucide-react';

export function FixedAssetsIntegration() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Fixed Assets Integration</h2>
          <p className="text-muted-foreground">Asset capitalization and depreciation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Depreciation Rules
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Capitalize Asset
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Asset Depreciation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <TrendingDown className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Fixed assets integration will appear here</p>
            <p className="text-sm">Asset capitalization and depreciation management</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
