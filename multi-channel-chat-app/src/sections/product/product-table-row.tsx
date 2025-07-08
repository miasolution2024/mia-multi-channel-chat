import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import { useBoolean } from "@/hooks/use-boolean";
import { usePopover } from "@/components/custom-popover";
import { Iconify } from "@/components/iconify";
import { ConfirmDialog } from "@/components/custom-dialog";
import { Product } from "@/models/product/product";
import { mutate } from "swr";
import { useCallback } from "react";
import { deleteProductAsync } from "@/actions/product";
import { endpoints } from "@/utils/axios";
import { toast } from "@/components/snackbar";
import { fCurrency } from "@/utils/format-number";
// ----------------------------------------------------------------------

export interface ProductTableRowProps {
  row: Product;
  selected: boolean;
  onSelectRow: VoidFunction;
  onEditRow: (id: string) => void;
}

export function ProductTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
}: ProductTableRowProps) {
  const confirm = useBoolean();

  const popover = usePopover();

  const handleDeleteRow = useCallback(async () => {
    await deleteProductAsync(row.productID);

    mutate(endpoints.products.list);

    toast.success("Delete success!");
  }, [row.productID]);

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox
            id={row.productID}
            checked={selected}
            onClick={onSelectRow}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: "nowrap" }}>{row.productName}</TableCell>
        <TableCell sx={{ whiteSpace: "nowrap" }}>{row.description}</TableCell>
        <TableCell sx={{ whiteSpace: "nowrap" }}>{row.stockQuantity}</TableCell>
        <TableCell sx={{ whiteSpace: "nowrap" }}>{fCurrency(row.purchasePrice)}</TableCell>
        <TableCell sx={{ whiteSpace: "nowrap" }}>{fCurrency(row.salePrice)}</TableCell>
        <TableCell sx={{ whiteSpace: "nowrap" }}>{row.unit}</TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center">
            <Tooltip title="Edit" placement="top" arrow>
              <IconButton
                color="inherit"
                onClick={() => onEditRow(row.productID)}
              >
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete" placement="top" arrow>
              <IconButton
                color="error"
                onClick={() => {
                  confirm.onTrue();
                  popover.onClose();
                }}
              >
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={handleDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
