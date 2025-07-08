"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/use-auth-context";
import { CONFIG } from "@/config-global";

// ----------------------------------------------------------------------

export function GuestGuard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  // const searchParams = useSearchParams();

  const { loading, authenticated } = useAuthContext();

  const [isChecking, setIsChecking] = useState(true);

  // const returnTo = searchParams.get("returnTo");

  // const newSearchParams = new URLSearchParams();
  // for (const key of searchParams.keys()) {
  //   if (key !== "returnTo") {
  //     newSearchParams.append(key, searchParams.get(key) || "");
  //   }
  // }
  // const newQueryString = newSearchParams.toString();

  const checkPermissions = async () => {
    if (loading) {
      return;
    }

    if (authenticated) {
      router.replace(CONFIG.auth.redirectPath);
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
