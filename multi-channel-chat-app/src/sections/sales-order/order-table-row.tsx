/* eslint-disable @typescript-eslint/no-explicit-any */
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import MenuList from "@mui/material/MenuList";
import Collapse from "@mui/material/Collapse";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";

import { useBoolean } from "@/hooks/use-boolean";

import { Label } from "@/components/label";
import { Iconify } from "@/components/iconify";
import { usePopover, CustomPopover } from "@/components/custom-popover";
import { fDate, fTime } from "@/utils/format-time";
import { fCurrency } from "@/utils/format-number";
import { SalesOrder, SalesOrderDetail, SalesOrderStatus } from "@/models/sales-order/sales-order";

// ----------------------------------------------------------------------

export interface SalesOrderTableRowProps {
  row: SalesOrder;
  selected: boolean;
  onSelectRow: VoidFunction;
  onViewRow: () => void;
}

// ----------------------------------------------------------------------

export function OrderTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
}: SalesOrderTableRowProps) {
  const collapse = useBoolean();

  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          onClick={onSelectRow}
          inputProps={{
            id: `row-checkbox-${row.orderID}`,
            "aria-label": `Row checkbox`,
          }}
        />
      </TableCell>

      <TableCell>
        <Stack spacing={2} direction="row" alignItems="center">
          <Stack
            sx={{
              typography: "body2",
              flex: "1 1 auto",
              alignItems: "flex-start",
            }}
          >
            <Box component="span">{row.customerName}</Box>
            <Box component="span" sx={{ color: "text.disabled" }}>
              {row.customerEmail}
            </Box>
          </Stack>
        </Stack>
      </TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(row.createdAt)}
          secondary={fTime(row.createdAt)}
          primaryTypographyProps={{ typography: "body2", noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: "span",
            typography: "caption",
          }}
        />
      </TableCell>

      <TableCell align="center"> {row.salesOrderDetails?.length} </TableCell>

      <TableCell> {fCurrency(row.totalAmount)} </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (row.orderStatus === SalesOrderStatus.PAID && "success") ||
            (row.orderStatus === SalesOrderStatus.PENDING && "warning") ||
            (row.orderStatus === SalesOrderStatus.CANCELLED && "error") ||
            "default"
          }
        >
          {row.orderStatus}
        </Label>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: "nowrap" }}>
        <IconButton
          color={collapse.value ? "inherit" : "default"}
          onClick={collapse.onToggle}
          sx={{ ...(collapse.value && { bgcolor: "action.hover" }) }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton>

        <IconButton
          color={popover.open ? "inherit" : "default"}
          onClick={popover.onOpen}
        >
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: "none" }} colSpan={8}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: "background.neutral" }}
        >
          <Paper sx={{ m: 1.5 }}>
            {row.salesOrderDetails.map((item: SalesOrderDetail) => (
              <Stack
                key={item.orderDetailID}
                direction="row"
                alignItems="center"
                sx={{
                  p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                  "&:not(:last-of-type)": {
                    borderBottom: (theme: any) =>
                      `solid 2px ${theme.vars.palette.background.neutral}`,
                  },
                }}
              >

                <ListItemText
                  primary={item.productName}
                  secondary={item.unit}
                  primaryTypographyProps={{ typography: "body2" }}
                  secondaryTypographyProps={{
                    component: "span",
                    color: "text.disabled",
                    mt: 0.5,
                  }}
                />

                <div>x{item.quantity} </div>

                <Box sx={{ width: 110, textAlign: "right" }}>
                  {fCurrency(item.unitPrice)}
                </Box>
              </Stack>
            ))}
          </Paper>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      {renderSecondary}

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
        </MenuList>
      </CustomPopover>

     
    </>
  );
}
