/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";

import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/auth/hooks/use-auth-context";
import { signOut } from "@/actions/auth";
import { toast } from "@/components/snackbar";

// ----------------------------------------------------------------------

export function SignOutButton({ onClose, ...other }: any) {
  const router = useRouter();

  const { checkUserSession } = useAuthContext();

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      await checkUserSession?.();

      onClose?.();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Unable to logout!");
    }
  }, [checkUserSession, onClose, router]);

  return (
    <Button
      fullWidth
      variant="soft"
      size="large"
      color="error"
      onClick={handleLogout}
      {...other}
    >
      Logout
    </Button>
  );
}
