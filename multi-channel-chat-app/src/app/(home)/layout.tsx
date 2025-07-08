// ----------------------------------------------------------------------

import { AuthSplitLayout } from "@/layouts/auth-split";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthSplitLayout>{children}</AuthSplitLayout>;
}
