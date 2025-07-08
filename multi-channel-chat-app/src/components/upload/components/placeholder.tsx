/* eslint-disable @typescript-eslint/no-explicit-any */
import UploadIllustration from "@/assets/illustrations/upload-illustration";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

// ----------------------------------------------------------------------

export function UploadPlaceholder({ sx, ...other }: any) {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      sx={sx}
      {...other}
    >
      <UploadIllustration hideBackground sx={{ width: 200 }} />

      <Stack spacing={1} sx={{ textAlign: "center" }}>
        <Box sx={{ typography: "h6" }}>Drop or select file</Box>
        <Box sx={{ typography: "body2", color: "text.secondary" }}>
          Drop files here or click to
          <Box
            component="span"
            sx={{ mx: 0.5, color: "primary.main", textDecoration: "underline" }}
          >
            browse
          </Box>
          through your machine.
        </Box>
      </Stack>
    </Box>
  );
}
