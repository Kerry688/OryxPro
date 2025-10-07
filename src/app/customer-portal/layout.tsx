import CustomerPortalLayout from '@/components/layout/CustomerPortalLayout';

export default function CustomerPortalLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CustomerPortalLayout>
      {children}
    </CustomerPortalLayout>
  );
}
