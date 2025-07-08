/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { fCurrency, fPercent } from "@/utils/format-number";
import { Scrollbar } from "@/components/scrollbar";
import {
  PurchaseOrder,
  PurchaseOrderDetail,
  PurchaseOrderStatus,
} from "@/models/purchase-order/purchase-order";
import { Label } from "@/components/label";
import { PurchaseOrderToolbar } from "./purchase-order-toolbar";
import { Logo } from "@/components/logo";
import { fDate } from "@/utils/format-time";
import { updatePurchaseOrderStatusAsync } from "@/actions/purchase-order";
import { toast } from "sonner";

// ----------------------------------------------------------------------

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  [`& .${tableCellClasses.root}`]: {
    textAlign: "right",
    borderBottom: "none",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

export function PurchaseOrderDetails({
  purchaseOrder,
}: {
  purchaseOrder: PurchaseOrder;
}) {
  const [currentStatus, setCurrentStatus] = useState(
    purchaseOrder?.orderStatus
  );

  const handleChangeStatus = useCallback(
    async (event: any) => {
      try {
        const status = event.target.value;

        if (status === currentStatus) return;
        await updatePurchaseOrderStatusAsync(
          purchaseOrder?.purchaseOrderID,
          status
        );
        toast.success("Update purchase order status successfully!");
        setCurrentStatus(event.target.value);
      } catch (error) {
        console.error("Error during update purchase order status:", error);
      }
    },
    [purchaseOrder?.purchaseOrderID, currentStatus]
  );

  const renderTotal = (
    <>
      <StyledTableRow>
        <TableCell colSpan={4} />
        <TableCell sx={{ color: "text.secondary" }}>
          <Box sx={{ mt: 2 }} />
          Subtotal
        </TableCell>
        <TableCell width={120} sx={{ typography: "subtitle2" }}>
          <Box sx={{ mt: 2 }} />
          {fCurrency(purchaseOrder?.subtotal)}
        </TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={4} />
        <TableCell sx={{ color: "text.secondary" }}>Discount</TableCell>
        <TableCell
          width={120}
          sx={{ color: "error.main", typography: "body2" }}
        >
          - {fCurrency(purchaseOrder?.discount)}
        </TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={4} />
        <TableCell sx={{ color: "text.secondary" }}>Taxes</TableCell>
        <TableCell width={120}>{fPercent(purchaseOrder?.taxes)}</TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={4} />
        <TableCell sx={{ typography: "subtitle1" }}>Total</TableCell>
        <TableCell width={140} sx={{ typography: "subtitle1" }}>
          {fCurrency(purchaseOrder?.totalAmount)}
        </TableCell>
      </StyledTableRow>
    </>
  );

  const renderList = (
    <Scrollbar sx={{ mt: 5 }}>
      <Table sx={{ minWidth: 960 }}>
        <TableHead>
          <TableRow>
            <TableCell width={40}>#</TableCell>

            <TableCell sx={{ typography: "subtitle2" }}>Description</TableCell>

            <TableCell>Unit</TableCell>

            <TableCell>Qty</TableCell>

            <TableCell align="right">Unit price</TableCell>

            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {purchaseOrder?.purchaseOrderDetails.map(
            (row: PurchaseOrderDetail, index: number) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>

                <TableCell>
                  <Box sx={{ maxWidth: 560 }}>
                    <Typography variant="subtitle2">
                      {row.productName}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>{row.unit}</TableCell>

                <TableCell>{row.quantity}</TableCell>

                <TableCell align="right">
                  {fCurrency(row.purchasePrice)}
                </TableCell>

                <TableCell align="right">
                  {fCurrency(row.purchasePrice * row.quantity)}
                </TableCell>
              </TableRow>
            )
          )}

          {renderTotal}
        </TableBody>
      </Table>
    </Scrollbar>
  );

  return (
    <>
      <PurchaseOrderToolbar
        purchaseOrder={purchaseOrder}
        currentStatus={currentStatus || ""}
        statusOptions={[
          { value: PurchaseOrderStatus.PAID, label: "Paid" },
          { value: PurchaseOrderStatus.PENDING, label: "Pending" },
          { value: PurchaseOrderStatus.OVERDUE, label: "Overdue" },
          { value: PurchaseOrderStatus.CANCELLED, label: "Cancelled" },
        ]}
        onChangeStatus={handleChangeStatus}
      />

      <Card sx={{ pt: 5, px: 5 }}>
        <Box
          rowGap={3}
          display="grid"
          alignItems="center"
          gridTemplateColumns={{ xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)" }}
        >
          <Logo />

          <Stack></Stack>

          <Stack sx={{ typography: "body2" }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Purchase Order from
            </Typography>
            {purchaseOrder?.supplierName}
            <br />
            {purchaseOrder?.supplierAddress}
            <br />
            Phone: {purchaseOrder?.supplierPhone}
            <br />
          </Stack>

          <Stack
            sx={{ typography: "body2" }}
            alignItems={{ xs: "flex-start", md: "flex-end" }}
          >
            <Label
              variant="soft"
              color={
                (currentStatus === PurchaseOrderStatus.PAID && "success") ||
                (currentStatus === PurchaseOrderStatus.PENDING && "warning") ||
                (currentStatus === PurchaseOrderStatus.OVERDUE && "error") ||
                "default"
              }
            >
              {currentStatus}
            </Label>

            <Typography variant="h6">{purchaseOrder?.invoiceID}</Typography>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {fDate(purchaseOrder?.createdAt)}
            </Typography>
          </Stack>
        </Box>

        {renderList}

        <Divider sx={{ mt: 5, borderStyle: "dashed" }} />
      </Card>
    </>
  );
}
