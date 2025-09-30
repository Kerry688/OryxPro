'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Database, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function SeedRolesPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{
    success: boolean;
    message: string;
    count?: number;
  } | null>(null);

  const handleSeedRoles = async () => {
    try {
      setIsSeeding(true);
      setSeedResult(null);

      const response = await fetch('/api/users/roles/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        setSeedResult({
          success: true,
          message: result.message,
          count: result.data?.insertedCount
        });
        toast.success('Roles seeded successfully!');
      } else {
        setSeedResult({
          success: false,
          message: result.error || 'Failed to seed roles'
        });
        toast.error('Failed to seed roles');
      }
    } catch (error) {
      console.error('Error seeding roles:', error);
      setSeedResult({
        success: false,
        message: 'An unexpected error occurred'
      });
      toast.error('Failed to seed roles');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Seed Demo Roles</h1>
          <p className="text-muted-foreground">
            Create demo role data for testing the role and permissions system
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Demo Roles Data
            </CardTitle>
            <CardDescription>
              This will create sample roles with different permission levels for testing purposes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">What will be created:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Super Admin - Full system access</li>
                <li>Admin - Administrative access</li>
                <li>Sales Manager - Sales department management</li>
                <li>HR Manager - Human resources management</li>
                <li>Inventory Manager - Warehouse and inventory management</li>
                <li>Sales Representative - Order and customer management</li>
                <li>Customer Service - Customer support access</li>
                <li>Accountant - Financial and reporting access</li>
                <li>Employee - Standard employee access</li>
                <li>Viewer - Read-only access</li>
                <li>Guest - Limited external access</li>
                <li>Temporary Access - Contractor access (inactive)</li>
              </ul>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> This will replace all existing roles. Make sure to backup your data before proceeding.
              </AlertDescription>
            </Alert>

            {seedResult && (
              <Alert className={seedResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                {seedResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={seedResult.success ? 'text-green-800' : 'text-red-800'}>
                  {seedResult.message}
                  {seedResult.count && (
                    <span className="block mt-1 text-sm">
                      {seedResult.count} roles created successfully.
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4">
              <Button
                onClick={handleSeedRoles}
                disabled={isSeeding}
                className="flex items-center gap-2"
              >
                {isSeeding ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Seeding Roles...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4" />
                    Seed Demo Roles
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => window.location.href = '/users/roles'}
                disabled={isSeeding}
              >
                Go to Roles Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
