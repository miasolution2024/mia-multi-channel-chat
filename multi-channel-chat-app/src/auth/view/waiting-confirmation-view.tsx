"use client";

import MaintenanceIllustration from "@/assets/illustrations/maintenance-illustration";
import { RouterLink } from "@/routes/components";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

// ----------------------------------------------------------------------

export function WaitingConfirmationView() {
  return (
    <Box display="flex" alignItems="center" flexDirection="column">
      <Typography variant="h3" sx={{ mb: 2 }}>
        Please check your email to continue!
      </Typography>

      <MaintenanceIllustration sx={{ my: { xs: 5, sm: 10 } }} />

      <Button component={RouterLink} href="/" size="large" variant="contained">
        Go to home
      </Button>
    </Box>
  );
}
