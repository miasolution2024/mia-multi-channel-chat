// ----------------------------------------------------------------------

import { GuestGuard } from "@/auth/guard/guest-guard";
import { AuthSplitLayout } from "@/layouts/auth-split";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GuestGuard>
      <AuthSplitLayout>{children}</AuthSplitLayout>
    </GuestGuard>
  );
}
