import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ClientOnlyLayout from '@/components/layout/ClientOnlyLayout';

export const metadata: Metadata = {
  title: 'Oryx ONE',
  description: 'High-quality printing services for business cards, flyers, banners, and more. Customize and order online with PrintPoint.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={cn(
          'min-h-screen w-full font-body antialiased overflow-x-hidden bg-background text-foreground'
        )}
        style={{ 
          width: '100%', 
          maxWidth: '100%', 
          overflowX: 'hidden',
          margin: 0,
          padding: 0
        }}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <AuthProvider>
            <ClientOnlyLayout>
              {children}
            </ClientOnlyLayout>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
