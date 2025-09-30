import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - OryxPro ERP',
  description: 'Sign in to your OryxPro ERP account',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full">
      {children}
    </div>
  );
}
