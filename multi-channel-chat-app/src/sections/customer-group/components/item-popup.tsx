import { Box, Chip, Dialog, DialogContent, DialogTitle } from "@mui/material";

interface ItemsPopupProps {
  open: boolean;
  onClose: () => void;
  title: string;
  items: Array<{
    label: string;
    color?:
      | "primary"
      | "secondary"
      | "info"
      | "success"
      | "warning"
      | "error"
      | "default";
  }>;
}

export function ItemsPopup({ open, onClose, title, items }: ItemsPopupProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, pb: 2 }}>
          {items.map((item, index) => (
            <Chip
              key={index}
              label={item.label}
              size="small"
              variant="outlined"
              color={item.color}
              sx={{
                width: "100%",
                "&.MuiChip-root": {
                  display: "flex",
                  justifyContent: "flex-start",
                  overflowY: "auto",
                  height: "fit-content",
                  minHeight: "24px",
                },
                "& .MuiChip-label": {
                  whiteSpace: "wrap",
                },
              }}
            />
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}