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
import { Supplier } from "@/models/supplier/supplier";
import { mutate } from "swr";
import { useCallback } from "react";
import { deleteSupplierAsync } from "@/actions/supplier";
import { endpoints } from "@/utils/axios";
import { toast } from "@/components/snackbar";
import { Box } from "@mui/material";
// ----------------------------------------------------------------------

export interface SupplierTableRowProps {
  row: Supplier;
  selected: boolean;
  onSelectRow: VoidFunction;
  onEditRow: (id: string) => void;
}

export function SupplierTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
}: SupplierTableRowProps) {
  const confirm = useBoolean();

  const popover = usePopover();

  const handleDeleteRow = useCallback(async () => {
    await deleteSupplierAsync(row.supplierID);

    mutate(endpoints.suppliers.list);

    toast.success("Delete success!");
  }, [row.supplierID]);

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox
            id={row.supplierID}
            checked={selected}
            onClick={onSelectRow}
          />
        </TableCell>
        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
            <Box component="span" >
                {row.supplierName}
              </Box>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.phone}
              </Box>
            </Stack>
          </Stack>
        </TableCell>
        <TableCell sx={{ whiteSpace: "nowrap" }}>{row.description}</TableCell>
        <TableCell sx={{ whiteSpace: "nowrap" }}>{row.address}</TableCell>

        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
            <Box component="span" >
                {row.contactPerson}
              </Box>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.salePersonPhone}
              </Box>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center">
            <Tooltip title="Edit" placement="top" arrow>
              <IconButton
                color="inherit"
                onClick={() => onEditRow(row.supplierID)}
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
