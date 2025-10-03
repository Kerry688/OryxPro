'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DepartmentsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Departments</h1>
          <p className="text-gray-600">Manage company departments</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Departments Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              Departments management coming soon...
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}