// ----------------------------------------------------------------------
"use client";
import AuthGuard from "@/auth/guard/auth-guard";
import { RoleBasedGuard } from "@/auth/guard/role-based-guard";
import { useAuthContext } from "@/auth/hooks/use-auth-context";
import { CONFIG } from "@/config-global";
import { DashboardLayout } from "@/layouts/dashboard";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useAuthContext();

  if (CONFIG.auth.skip) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  return (
    <AuthGuard>
      <RoleBasedGuard
        hasContent
        currentRole={user?.role?.name ?? "user"}
        acceptRoles={["Administrator", "Admin", "Employee"]}
        sx={{ py: 10 }}
      >
        <DashboardLayout>{children}</DashboardLayout>
      </RoleBasedGuard>
    </AuthGuard>
  );
}
