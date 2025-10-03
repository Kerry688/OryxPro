'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BulkEditorPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Bulk Editor</h1>
          <p className="text-gray-600">Bulk edit price lists</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bulk Price List Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              Bulk editor coming soon...
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}