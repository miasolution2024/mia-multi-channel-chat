/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { View403 } from "@/sections/error";

// ----------------------------------------------------------------------

export function RoleBasedGuard({
  children,
  hasContent,
  currentRole,
  acceptRoles,
}: any) {
  if (
    typeof acceptRoles !== "undefined" &&
    !acceptRoles.includes(currentRole)
  ) {
    console.log("acceptRoles", acceptRoles);
    console.log("acceptRoles", acceptRoles);
    return hasContent ? <View403 /> : null;
  }

  return <> {children} </>;
}
