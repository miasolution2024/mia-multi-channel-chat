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
import { mutate } from "swr";
import { useCallback } from "react";
import { endpoints } from "@/utils/axios";
import { toast } from "@/components/snackbar";
import { ProductUnitOfMeasure } from "@/models/product/product-unit-of-measure";
import { deleteProductUnitOfMeasureAsync } from "@/actions/product-unit-of-measure";
import { Label } from "@/components/label";
import { fCurrency } from "@/utils/format-number";
// ----------------------------------------------------------------------

export interface ProductUnitOfMeasureTableRowProps {
  row: ProductUnitOfMeasure;
  selected: boolean;
  onSelectRow: VoidFunction;
  onEditRow: (id: string) => void;
}

export function ProductUnitOfMeasureTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
}: ProductUnitOfMeasureTableRowProps) {
  const confirm = useBoolean();

  const popover = usePopover();

  const handleDeleteRow = useCallback(async () => {
    await deleteProductUnitOfMeasureAsync(row.productUnitOfMeasureID);

    mutate(
      (key) =>
        typeof key === "string" &&
        key.startsWith(endpoints.productUnitOfMeasure.list)
    );

    toast.success("Delete success!");
  }, [row.productUnitOfMeasureID]);

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox
            id={row.productUnitOfMeasureID}
            checked={selected}
            onClick={onSelectRow}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: "nowrap" }}>{row.unit}</TableCell>
        <TableCell sx={{ whiteSpace: "nowrap" }}>
          {row.conversionFactor}
        </TableCell>
        <TableCell sx={{ whiteSpace: "nowrap" }}>{fCurrency(row.purchasePrice)}</TableCell>
        <TableCell sx={{ whiteSpace: "nowrap" }}>{fCurrency(row.salePrice)}</TableCell>
        <TableCell sx={{ whiteSpace: "nowrap" }}>{row.barcode}</TableCell>
        <TableCell>
          {row.isBaseUnit && <Label variant="soft" color="success">Based UOM</Label>}
        </TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center">
            <Tooltip title="Edit" placement="top" arrow>
              <IconButton
                color="inherit"
                onClick={() => onEditRow(row.productUnitOfMeasureID)}
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
