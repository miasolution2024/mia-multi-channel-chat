import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { ProductUnitOfMeasureListView } from "./product-unit-of-measure-list";

// ----------------------------------------------------------------------

type ProductUnitOfMeasureDialogProps = {
  productId: string;
  open: boolean;
  onClose: VoidFunction;
};

// ----------------------------------------------------------------------

export function ProductUnitOfMeasureDialog({
  productId,
  open,
  onClose,
}: ProductUnitOfMeasureDialogProps) {
  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { maxWidth: 1200 },
        },
      }}
    >
      <DialogTitle>Product Unit Of Measures</DialogTitle>

      <DialogContent>
        <Box paddingY={2} rowGap={3} columnGap={2}>
          <ProductUnitOfMeasureListView productId={productId} />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
