/* eslint-disable @typescript-eslint/no-explicit-any */
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// ----------------------------------------------------------------------

export function SearchNotFound({ query, sx, ...other }: any) {
  if (!query) {
    return (
      <Typography variant="body2" sx={sx}>
        Please enter keywords
      </Typography>
    );
  }

  return (
    <Box sx={{ textAlign: "center", borderRadius: 1.5, ...sx }} {...other}>
      <Box sx={{ mb: 1, typography: "h6" }}>Not found</Box>

      <Typography variant="body2">
        No results found for &nbsp;
        <strong>{`"${query}"`}</strong>
        .
        <br /> Try checking for typos or using complete words.
      </Typography>
    </Box>
  );
}
