/* eslint-disable @typescript-eslint/no-explicit-any */
import { CONFIG } from '@/config-global';
import { RouterLink } from '@/routes/components';
import Button from '@mui/material/Button';

// ----------------------------------------------------------------------

export function SignInButton({ sx, ...other }: any) {
  return (
    <Button
      component={RouterLink}
      href={CONFIG.auth.redirectPath}
      variant="outlined"
      sx={sx}
      {...other}
    >
      Sign in
    </Button>
  );
}
