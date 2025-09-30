'use client';

import { useSidebar } from '@/contexts/sidebar-context';
import { useLanguage } from '@/contexts/language-context';
import { cn } from '@/lib/utils';

interface MainContentProps {
  children: React.ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  const { isCollapsed, isMobileOpen } = useSidebar();
  const { isRTL } = useLanguage();

  return (
    <div
      className={cn(
        "flex-1 flex flex-col transition-all duration-300 min-h-screen bg-[#FCFCFC] main-content",
        // Desktop: adjust margin based on sidebar state and direction
        isRTL 
          ? (isCollapsed ? "lg:mr-20" : "lg:mr-64")
          : (isCollapsed ? "lg:ml-20" : "lg:ml-64"),
        // Mobile: full width when sidebar is closed
        "ml-0 mr-0"
      )}
    >
      {/* Main content area with proper spacing for fixed header */}
      <div className="pt-16 flex-1">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
