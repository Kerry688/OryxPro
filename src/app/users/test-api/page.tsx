'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle, XCircle, Database } from 'lucide-react';
import { toast } from 'sonner';

interface ApiTestResult {
  endpoint: string;
  success: boolean;
  data?: any;
  error?: string;
  count?: number;
}

export default function ApiTestPage() {
  const [testResults, setTestResults] = useState<ApiTestResult[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const testEndpoints = async () => {
    setIsTesting(true);
    const results: ApiTestResult[] = [];

    const endpoints = [
      { name: 'Roles', url: '/api/users/roles' },
      { name: 'Branches', url: '/api/branches' },
      { name: 'Departments', url: '/api/hr/departments' },
      { name: 'Employees', url: '/api/hr/employees?limit=10' }
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint.url);
        const data = await response.json();
        
        results.push({
          endpoint: endpoint.name,
          success: data.success !== false,
          data: data,
          count: data.data?.length || 0,
          error: data.success === false ? data.error : undefined
        });
      } catch (error) {
        results.push({
          endpoint: endpoint.name,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    setTestResults(results);
    setIsTesting(false);
    
    const successCount = results.filter(r => r.success).length;
    if (successCount === results.length) {
      toast.success('All API endpoints are working!');
    } else {
      toast.error(`${results.length - successCount} API endpoints failed`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">API Endpoints Test</h1>
          <p className="text-muted-foreground">
            Test the API endpoints used by the Add User page
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              API Endpoints
            </CardTitle>
            <CardDescription>
              Click the button below to test all API endpoints used in the Add User form
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={testEndpoints}
              disabled={isTesting}
              className="flex items-center gap-2"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4" />
                  Test All Endpoints
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {testResults.length > 0 && (
          <div className="space-y-4">
            {testResults.map((result, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {result.success ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      {result.endpoint}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge variant={result.success ? 'default' : 'destructive'}>
                        {result.success ? 'Success' : 'Failed'}
                      </Badge>
                      {result.count !== undefined && (
                        <Badge variant="outline">
                          {result.count} items
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {result.success ? (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        API endpoint is working correctly
                      </p>
                      {result.count !== undefined && (
                        <p className="text-sm">
                          Found {result.count} {result.count === 1 ? 'item' : 'items'}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-red-600 mb-2">
                        Error: {result.error}
                      </p>
                    </div>
                  )}
                  
                  {process.env.NODE_ENV === 'development' && result.data && (
                    <details className="mt-4">
                      <summary className="text-sm font-medium cursor-pointer">
                        Raw Response Data
                      </summary>
                      <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-40">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                If all API endpoints are working correctly, you can:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Go to the Add User page to create new users</li>
                <li>• Seed demo data if needed (roles, branches, departments, employees)</li>
                <li>• Test the user creation functionality</li>
              </ul>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/users/add'}
                >
                  Go to Add User Page
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/users/enhanced'}
                >
                  Go to Users List
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
