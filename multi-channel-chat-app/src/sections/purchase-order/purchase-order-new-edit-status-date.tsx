import { useFormContext } from "react-hook-form";

import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import { Field } from "@/components/hook-form";
import { PurchaseOrderStatus } from "@/models/purchase-order/purchase-order";

// ----------------------------------------------------------------------

export function PurchaseOrderNewEditStatusDate() {
  const { watch } = useFormContext();

  const values = watch();

  return (
    <Stack
      spacing={2}
      direction={{ xs: "column", sm: "row" }}
      sx={{ p: 3, bgcolor: "background.neutral" }}
    >
      <Field.Text
        name="invoiceID"
        label="Invoice number"
        value={values.invoiceID}
      />

      <Field.Select
        fullWidth
        name="orderStatus"
        label="Status"
        InputLabelProps={{ shrink: true }}
      >
        {[
          PurchaseOrderStatus.DRAFT,
          PurchaseOrderStatus.PAID,
          PurchaseOrderStatus.PENDING,
          PurchaseOrderStatus.OVERDUE,
          PurchaseOrderStatus.CANCELLED,
        ].map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={{ textTransform: "capitalize" }}
          >
            {option}
          </MenuItem>
        ))}
      </Field.Select>

      <Field.DatePicker name="purchaseOrderDate" label="Purchase order date" />
    </Stack>
  );
}
