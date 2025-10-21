// ----------------------------------------------------------------------
"use client";
import AuthGuard from "@/auth/guard/auth-guard";
import { CONFIG } from "@/config-global";
import { DashboardLayout } from "@/layouts/dashboard";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  if (CONFIG.auth.skip) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  return (
    <AuthGuard>
        <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
