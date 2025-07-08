
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import { useBoolean } from "@/hooks/use-boolean";
import { PurchaseOrder } from "@/models/purchase-order/purchase-order";

// ----------------------------------------------------------------------
type PurchaseOrderToolbarProps = {
  purchaseOrder: PurchaseOrder;
  currentStatus: string;
  statusOptions: Array<{ value: string; label: string }>;
  onChangeStatus: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

// ----------------------------------------------------------------------

export function PurchaseOrderToolbar({
  currentStatus,
  statusOptions,
  onChangeStatus,
}: PurchaseOrderToolbarProps) {

  const view = useBoolean();

  return (
    <>
      <Stack
        spacing={3}
        alignItems='flex-end'
        sx={{ mb: { xs: 3, md: 5 } }}
      >
        <TextField
          fullWidth
          select
          label="Status"
          value={currentStatus}
          onChange={onChangeStatus}
          inputProps={{ id: `status-select-label` }}
          InputLabelProps={{ htmlFor: `status-select-label` }}
          sx={{ maxWidth: 160 }}
        >
          {statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <Dialog fullScreen open={view.value}>
        <Box sx={{ height: 1, display: "flex", flexDirection: "column" }}>
          <DialogActions sx={{ p: 1.5 }}>
            <Button color="inherit" variant="contained" onClick={view.onFalse}>
              Close
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
