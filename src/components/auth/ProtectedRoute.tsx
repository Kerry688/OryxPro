'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermissions?: string[];
}

export function ProtectedRoute({ children, requiredRole, requiredPermissions }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!isLoading && isAuthenticated) {
      // Check role requirement
      if (requiredRole && role?.name !== requiredRole) {
        router.push('/');
        return;
      }

      // Check permissions requirement
      if (requiredPermissions && requiredPermissions.length > 0) {
        const hasPermission = requiredPermissions.some(permission => 
          role?.permissions?.includes(permission)
        );
        
        if (!hasPermission) {
          router.push('/');
          return;
        }
      }
    }
  }, [isAuthenticated, isLoading, user, role, requiredRole, requiredPermissions, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to sign in
  }

  return <>{children}</>;
}