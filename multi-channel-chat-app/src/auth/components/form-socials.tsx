/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleIcon } from "@/assets/icons/social-icons";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { Typography } from "@mui/material";
// ----------------------------------------------------------------------

export function FormSocials({ sx, signInWithGoogle, requireAuthenticatedReview, ...other }: any) {
  return (
    <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={sx} {...other}>
      <IconButton
        color="inherit"
        onClick={signInWithGoogle}
        sx={{
          width: "220px",
          height: "50px",
          backgroundColor: "#fff",
          borderRadius: "4px",
          border: "1px solid #dadce0",
          boxShadow: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
        }}
      >
        <GoogleIcon width={30} />
        <Typography variant="subtitle1">Sign in with Google</Typography>
      </IconButton>
      {requireAuthenticatedReview && (
        <Typography
          variant="body2"
          align="center"
          color="text.primary"
          sx={{
            mt: 1,
            px: 2,
            fontSize: '14px',
            lineHeight: 1.4,
          }}
        >
          Please sign up or log in to earn points for your review!
        </Typography>
      )}
    </Box>
  );
}
