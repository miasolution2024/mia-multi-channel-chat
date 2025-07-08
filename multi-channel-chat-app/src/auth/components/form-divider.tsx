/* eslint-disable @typescript-eslint/no-explicit-any */
import Divider from "@mui/material/Divider";

// ----------------------------------------------------------------------

export function FormDivider({ sx, label = "OR" }: any) {
  return (
    <Divider
      sx={{
        my: 3,
        typography: "overline",
        color: "text.disabled",
        "&::before, :after": { borderTopStyle: "dashed" },
        ...sx,
      }}
    >
      {label}
    </Divider>
  );
}
