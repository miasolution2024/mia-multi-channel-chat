/* eslint-disable @typescript-eslint/no-explicit-any */
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

// ----------------------------------------------------------------------

export function FormResendCode({
  value,
  disabled,
  onResendCode,
  sx,
  ...other
}: any) {
  return (
    <Box
      sx={{
        mt: 3,
        typography: "body2",
        alignSelf: "center",
        ...sx,
      }}
      {...other}
    >
      {`Don’t have a code? `}
      <Link
        variant="subtitle2"
        onClick={onResendCode}
        sx={{
          cursor: "pointer",
          ...(disabled && {
            color: "text.disabled",
            pointerEvents: "none",
          }),
        }}
      >
        Resend {disabled && value && value > 0 && `(${value}s)`}
      </Link>
    </Box>
  );
}
