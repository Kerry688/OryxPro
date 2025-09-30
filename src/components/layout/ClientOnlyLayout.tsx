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

export function ClientOnlyLayout({ children }: ClientOnlyLayoutProps) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  
  // Check if current path is an auth page (including signin)
  const isAuthPage = pathname.startsWith('/auth') || pathname.startsWith('/signin');
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // If it's an auth page, render children directly without sidebar/header
  if (isAuthPage) {
    return <>{children}</>;
  }
  
  // Show loading state until component is mounted (prevents SSR issues)
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFCFC]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  // For non-auth pages, render the layout with sidebar/header
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
