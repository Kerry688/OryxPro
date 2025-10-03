'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewDepartmentPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">New Department</h1>
          <p className="text-gray-600">Create a new department</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Department Form</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              Department form coming soon...
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}