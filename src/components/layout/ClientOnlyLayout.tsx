'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MainContent } from '@/components/layout/MainContent';
import { SidebarProvider } from '@/contexts/sidebar-context';
import { LanguageProvider } from '@/contexts/language-context';
import { Loader2 } from 'lucide-react';

interface ClientOnlyLayoutProps {
  children: React.ReactNode;
}

export default function ClientOnlyLayout({ children }: ClientOnlyLayoutProps) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  
  // Check if current path is an auth page
  const isAuthPage = pathname.startsWith('/auth') || pathname.startsWith('/login') || pathname.startsWith('/forgot-password') || pathname.startsWith('/reset-password');
  
  // Check if current path is customer portal
  const isCustomerPortal = pathname.startsWith('/customer-portal');
  
  // Check if current path is employee portal
  const isEmployeePortal = pathname.startsWith('/employee');
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // If it's an auth page, render children directly without sidebar/header
  if (isAuthPage) {
    return <>{children}</>;
  }
  
  // If it's customer portal, let the customer portal layout handle it
  if (isCustomerPortal) {
    return <>{children}</>;
  }
  
  // If it's employee portal, let the employee portal layout handle it (if we create one)
  if (isEmployeePortal) {
    return <>{children}</>;
  }
  
  // Show loading state until component is mounted (prevents SSR issues)
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  // For ERP pages, render the layout with sidebar/header
  return (
    <LanguageProvider>
      <SidebarProvider>
        <div className="relative flex min-h-screen w-full">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <MainContent>
              <main className="flex-1">
                {children}
              </main>
            </MainContent>
          </div>
        </div>
      </SidebarProvider>
    </LanguageProvider>
  );
}
