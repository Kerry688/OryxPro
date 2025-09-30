'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function SeedUsersPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{
    success: boolean;
    message: string;
    count?: number;
  } | null>(null);

  const handleSeedUsers = async () => {
    try {
      setIsSeeding(true);
      setSeedResult(null);

      const response = await fetch('/api/users/seed', {
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
        toast.success('Users seeded successfully!');
      } else {
        setSeedResult({
          success: false,
          message: result.error || 'Failed to seed users'
        });
        toast.error('Failed to seed users');
      }
    } catch (error) {
      console.error('Error seeding users:', error);
      setSeedResult({
        success: false,
        message: 'An unexpected error occurred'
      });
      toast.error('Failed to seed users');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Seed Demo Users</h1>
          <p className="text-muted-foreground">
            Create demo user data for testing the user management system
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Demo Users Data
            </CardTitle>
            <CardDescription>
              This will create sample users with different roles and statuses for testing purposes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">What will be created:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Admin user (admin@oryxpro.com)</li>
                <li>Sales Manager and Representatives</li>
                <li>HR Manager and Specialist</li>
                <li>Accountant and Inventory Manager</li>
                <li>Customer Service Representative</li>
                <li>Marketing Manager (inactive)</li>
                <li>Pending user for approval testing</li>
              </ul>
            </div>

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
                      {seedResult.count} users created successfully.
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4">
              <Button
                onClick={handleSeedUsers}
                disabled={isSeeding}
                className="flex items-center gap-2"
              >
                {isSeeding ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Seeding Users...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4" />
                    Seed Demo Users
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => window.location.href = '/users/enhanced'}
                disabled={isSeeding}
              >
                Go to Users Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
