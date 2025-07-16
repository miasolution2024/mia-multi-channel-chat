// ----------------------------------------------------------------------

import AuthGuard from "@/auth/guard/auth-guard";
import { DashboardLayout } from "@/layouts/dashboard";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
