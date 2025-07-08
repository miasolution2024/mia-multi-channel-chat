// ----------------------------------------------------------------------

import { Iconify } from "@/components/iconify";
import { ReactElement } from "react";

export interface NavItemtype {
  title: string;
  path: string;
  icon: ReactElement;
  isAuthenticated: boolean;
  children?: NavItemtype[];
}

export const navData: NavItemtype[] = [
  {
    title: "Home",
    path: "/",
    icon: <Iconify width={22} icon="solar:home-2-bold-duotone" />,
    isAuthenticated: false,
  },
];
