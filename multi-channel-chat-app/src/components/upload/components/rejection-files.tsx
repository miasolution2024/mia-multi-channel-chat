/* eslint-disable @typescript-eslint/no-explicit-any */
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { uploadClasses } from "../classes";
import { varAlpha } from "@/theme/styles";
import { fileData } from "@/components/file-thumbnail/utils";
import { fData } from "@/utils/format-number";

// ----------------------------------------------------------------------

export function RejectionFiles({ files, sx, className, ...other }: any) {
  if (!files.length) {
    return null;
  }

  return (
    <Paper
      variant="outlined"
      className={uploadClasses.uploadRejectionFiles.concat(
        className ? ` ${className}` : ""
      )}
      sx={{
        py: 1,
        px: 2,
        mt: 3,
        textAlign: "left",
        borderStyle: "dashed",
        borderColor: "error.main",
        bgcolor: (theme: any) =>
          varAlpha(theme.vars.palette.error.mainChannel, 0.08),
        ...sx,
      }}
      {...other}
    >
      {files.map(({ file, errors }: any) => {
        const { path, size } = fileData(file);

        return (
          <Box key={path} sx={{ my: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {path} - {size ? fData(size) : ""}
            </Typography>

            {errors.map((error: any) => (
              <Box
                key={error.code}
                component="span"
                sx={{ typography: "caption" }}
              >
                - {error.message}
              </Box>
            ))}
          </Box>
        );
      })}
    </Paper>
  );
}
