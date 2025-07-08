"use client";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/use-auth-context";
import { useRouter } from "next/navigation";
import { paths } from "@/routes/path";

export default function AuthGuard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { authenticated, loading } = useAuthContext();
  const [isChecking, setIsChecking] = useState(true);

  const checkPermissions = async () => {
    if (loading) {
      return;
    }

    if (!authenticated) {
      const href = paths.auth.signIn;

      router.replace(href);
      return;
    }

    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, loading]);

  if (isChecking) {
    return <></>;
  }

  return <>{children}</>;
}
