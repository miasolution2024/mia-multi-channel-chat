/* eslint-disable @typescript-eslint/no-explicit-any */
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";

import { Iconify } from "../../iconify";
import { uploadClasses } from "../classes";
import { fileData } from "@/components/file-thumbnail/utils";
import { FileThumbnail } from "@/components/file-thumbnail/file-thumbnail";
import { varAlpha } from "@/theme/styles";
import { fData } from "@/utils/format-number";

// ----------------------------------------------------------------------

export function MultiFilePreview({
  sx,
  onRemove,
  lastNode,
  thumbnail,
  slotProps,
  firstNode,
  files = [],
  className,
  ...other
}: any) {
  const renderFirstNode = firstNode && (
    <Box
      component="li"
      sx={{
        ...(thumbnail && {
          width: "auto",
          display: "inline-flex",
        }),
      }}
    >
      {firstNode}
    </Box>
  );

  const renderLastNode = lastNode && (
    <Box
      component="li"
      sx={{
        ...(thumbnail && { width: "auto", display: "inline-flex" }),
      }}
    >
      {lastNode}
    </Box>
  );

  return (
    <Box
      component="ul"
      className={uploadClasses.uploadMultiPreview.concat(
        className ? ` ${className}` : ""
      )}
      sx={{
        gap: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        ...(thumbnail && {
          flexWrap: "wrap",
          flexDirection: "row",
        }),
        ...sx,
      }}
      {...other}
    >
      {renderFirstNode}

      {files.map((file: any) => {
        const { name, size } = fileData(file);

        if (thumbnail) {
          return (
            <Box component="li" key={name} sx={{ display: "inline-flex" }}>
              <FileThumbnail
                tooltip
                imageView
                file={file}
                onRemove={() => onRemove?.(file)}
                sx={{
                  width: 78,
                  height: 85,
                  border: (theme: any) =>
                    `solid 1px ${varAlpha(
                      theme.vars.palette.grey["500Channel"],
                      0.16
                    )}`,
                }}
                slotProps={{ icon: { width: 36, height: 36 } }}
                {...slotProps?.thumbnail}
              />
            </Box>
          );
        }

        return (
          <Box
            component="li"
            key={name}
            sx={{
              py: 1,
              pr: 1,
              pl: 1.5,
              gap: 1.5,
              display: "flex",
              borderRadius: 1,
              alignItems: "center",
              border: (theme: any) =>
                `solid 1px ${varAlpha(
                  theme.vars.palette.grey["500Channel"],
                  0.16
                )}`,
            }}
          >
            <FileThumbnail file={file} {...slotProps?.thumbnail} />

            <ListItemText
              primary={name}
              secondary={fData(size)}
              slotProps={{
                secondary: {
                  component: "span",
                  typography: "caption",
                },
              }}
            />

            {onRemove && (
              <IconButton size="small" onClick={() => onRemove(file)}>
                <Iconify icon="mingcute:close-line" width={16} />
              </IconButton>
            )}
          </Box>
        );
      })}

      {renderLastNode}
    </Box>
  );
}
