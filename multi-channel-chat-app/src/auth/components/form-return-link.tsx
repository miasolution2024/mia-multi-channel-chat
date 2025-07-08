/* eslint-disable @typescript-eslint/no-explicit-any */
import { Iconify } from "@/components/iconify";
import { RouterLink } from "@/routes/components";
import Link from "@mui/material/Link";

// ----------------------------------------------------------------------

export function FormReturnLink({ sx, href, label, icon, ...other }: any) {
  return (
    <Link
      component={RouterLink}
      href={href}
      color="inherit"
      variant="subtitle2"
      sx={{
        mt: 3,
        gap: 0.5,
        mx: "auto",
        alignItems: "center",
        display: "inline-flex",
        ...sx,
      }}
      {...other}
    >
      {icon || <Iconify width={16} icon="eva:arrow-ios-back-fill" />}
      {label || "Return to sign in"}
    </Link>
  );
}
