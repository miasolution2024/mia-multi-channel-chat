import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";

import { useBoolean } from "@/hooks/use-boolean";

import { Label } from "@/components/label";
import { Iconify } from "@/components/iconify";
import { ConfirmDialog } from "@/components/custom-dialog";
import { usePopover, CustomPopover } from "@/components/custom-popover";
import { fDate, fTime } from "@/utils/format-time";
import { fCurrency } from "@/utils/format-number";
import { PurchaseOrder, PurchaseOrderStatus } from "@/models/purchase-order/purchase-order";
import { toast } from "@/components/snackbar";
import { useCallback } from "react";
import { endpoints } from "@/utils/axios";
import { mutate } from "swr";
import { Link } from "@mui/material";
import { deletePurchaseOrderAsync } from "@/actions/purchase-order";

// ----------------------------------------------------------------------

export interface PurchaseOrderTableRowProps {
  row: PurchaseOrder;
  selected: boolean;
  onSelectRow: VoidFunction;
  onViewRow: () => void;
  onEditRow: (id: string) => void;
}

// ----------------------------------------------------------------------

export function PurchaseOrderTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
}: PurchaseOrderTableRowProps) {
  const confirm = useBoolean();

  const popover = usePopover();

  const handleDeleteRow = useCallback(async () => {
    await deletePurchaseOrderAsync(row.purchaseOrderID);

    mutate(endpoints.purchaseOrders.list);

    toast.success("Delete success!");
  }, [row.purchaseOrderID]);

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={onSelectRow}
            inputProps={{
              id: `row-checkbox-${row.purchaseOrderID}`,
              "aria-label": `Row checkbox`,
            }}
          />
        </TableCell>

        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar alt={row.supplierName}>
              {row.supplierName?.charAt(0).toUpperCase()}
            </Avatar>

            <ListItemText
              disableTypography
              primary={
                <Typography variant="body2" noWrap>
                  {row.supplierName}
                </Typography>
              }
              secondary={
                <Link
                  noWrap
                  variant="body2"
                  onClick={onViewRow}
                  sx={{ color: "text.disabled", cursor: "pointer" }}
                >
                  {row.invoiceID}
                </Link>
              }
            />
          </Stack>
        </TableCell>

        <TableCell>{row.notes}</TableCell>

        <TableCell>
          <ListItemText
            primary={fDate(row.purchaseOrderDate)}
            secondary={fTime(row.purchaseOrderDate)}
            slotProps={
              {
                primary: {
                  typography: "body2",
                  noWrap: true,
                },
                secondary: {
                  mt: 0.5,
                  component: "span",
                  typography: "caption",
                },
              }
            }
          />
        </TableCell>

        <TableCell>{fCurrency(row.totalAmount)}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.orderStatus === PurchaseOrderStatus.PAID && "success") ||
              (row.orderStatus === PurchaseOrderStatus.PENDING && "warning") ||
              (row.orderStatus === PurchaseOrderStatus.OVERDUE && "error") ||
              "default"
            }
          >
            {row.orderStatus}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton
            color={popover.open ? "inherit" : "default"}
            onClick={popover.onOpen}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: "right-top" } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              onViewRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>

          <MenuItem
            onClick={() => {
              onEditRow(row.purchaseOrderID);
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <Divider sx={{ borderStyle: "dashed" }} />

          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: "error.main" }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover>

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
