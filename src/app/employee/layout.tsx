import EmployeePortalLayout from '@/components/layout/EmployeePortalLayout';

export default function EmployeePortalLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EmployeePortalLayout>
      {children}
    </EmployeePortalLayout>
  );
}
