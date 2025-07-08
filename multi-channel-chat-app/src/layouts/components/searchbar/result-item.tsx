/* eslint-disable @typescript-eslint/no-explicit-any */
import Box from "@mui/material/Box";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import { varAlpha } from "@/theme/styles";
import { Label } from "@/components/label";

// ----------------------------------------------------------------------

export function ResultItem({ title, path, groupLabel, onClickItem }: any) {
  return (
    <ListItemButton
      onClick={onClickItem}
      sx={{
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "transparent",
        borderBottomColor: (theme: any) => theme.vars.palette.divider,
        "&:hover": {
          borderRadius: 1,
          borderColor: (theme: any) => theme.vars.palette.primary.main,
          backgroundColor: (theme: any) =>
            varAlpha(
              theme.vars.palette.primary.mainChannel,
              theme.vars.palette.action.hoverOpacity
            ),
        },
      }}
    >
      <ListItemText
        primaryTypographyProps={{
          typography: "subtitle2",
          sx: { textTransform: "capitalize" },
        }}
        secondaryTypographyProps={{ typography: "caption", noWrap: true }}
        primary={title.map((part: any, index: any) => (
          <Box
            key={index}
            component="span"
            sx={{ color: part.highlight ? "primary.main" : "text.primary" }}
          >
            {part.text}
          </Box>
        ))}
        secondary={path.map((part: any, index: any) => (
          <Box
            key={index}
            component="span"
            sx={{ color: part.highlight ? "primary.main" : "text.secondary" }}
          >
            {part.text}
          </Box>
        ))}
      />

      {groupLabel && <Label color="info">{groupLabel}</Label>}
    </ListItemButton>
  );
}
