/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useCallback } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import { inputBaseClasses } from "@mui/material/InputBase";
import { PurchaseOrderDetail } from "@/models/purchase-order/purchase-order";
import { fCurrency, fPercent } from "@/utils/format-number";
import { Field } from "@/components/hook-form";
import { Iconify } from "@/components/iconify";
import { useGetProducts } from "@/actions/product";
import { Product } from "@/models/product/product";

// ----------------------------------------------------------------------

export function QRScanEditDetails() {
  const { control, setValue, watch } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "orderDetails",
  });

  const values = watch();

  const { products } = useGetProducts();

  const totalOnRow = values.orderDetails.map(
    (item: PurchaseOrderDetail) => item.quantity * item.purchasePrice
  );

  const subtotal = totalOnRow.reduce(
    (acc: number, num: number) => acc + num,
    0
  );

  const totalAmount = (subtotal - values.discount) * (1 + values.taxes / 100);

  useEffect(() => {
    setValue("totalAmount", totalAmount);
  }, [setValue, totalAmount]);

  const handleAdd = () => {
    append({
      productID: "",
      unit: "",
      quantity: 1,
      purchasePrice: 0,
      subtotal: 0,
    });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  const handleClearService = useCallback(
    (index: number) => {
      setValue(`orderDetails[${index}].quantity`, 1);
      setValue(`orderDetails[${index}].purchasePrice`, 0);
      setValue(`orderDetails[${index}].subTotal`, 0);
    },
    [setValue]
  );

  const handleSelectProduct = useCallback(
    (index: number, product: Product) => {
      setValue(`orderDetails[${index}].productID`, product.productID);
    },
    [setValue]
  );

  const handleChangeQuantity = useCallback(
    (event: any, index: number) => {
      setValue(
        `orderDetails[${index}].quantity`,
        Number(event.target.value)
      );
      setValue(
        `orderDetails[${index}].subtotal`,
        values.orderDetails.map(
          (item: PurchaseOrderDetail) => item.quantity * item.purchasePrice
        )[index]
      );
    },
    [setValue, values.orderDetails]
  );

  const handleChangePrice = useCallback(
    (event: any, index: number) => {
      setValue(
        `orderDetails[${index}].purchasePrice`,
        Number(event.target.value)
      );
      setValue(
        `orderDetails[${index}].subtotal`,
        values.orderDetails.map(
          (item: PurchaseOrderDetail) => item.quantity * item.purchasePrice
        )[index]
      );
    },
    [setValue, values.orderDetails]
  );
  const handleTaxesChange = useCallback(
    (event: any) => {
      const taxes = Number(event.target.value);

      setValue(`taxes`, taxes);
      console.log(values.orderDetails);

      values.orderDetails.forEach(
        (detail: PurchaseOrderDetail, index: number) => {
          setValue(
            `orderDetails[${index}].subtotal`,
            detail.quantity * detail.purchasePrice * (1 + taxes / 100)
          );
        }
      );
    },
    [setValue, values.orderDetails]
  );
  const renderTotal = (
    <Stack
      spacing={2}
      alignItems="flex-end"
      sx={{ mt: 3, textAlign: "right", typography: "body2" }}
    >
      <Stack direction="row">
        <Box sx={{ color: "text.secondary" }}>Subtotal</Box>
        <Box sx={{ width: 160, typography: "subtitle2" }}>
          {fCurrency(subtotal) || "-"}
        </Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: "text.secondary" }}>Discount</Box>
        <Box
          sx={{ width: 160, ...(values.discount && { color: "error.main" }) }}
        >
          {values.discount ? `- ${fCurrency(values.discount)}` : "-"}
        </Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: "text.secondary" }}>Taxes</Box>
        <Box sx={{ width: 160 }}>
          {values.taxes ? fPercent(values.taxes) : "-"}
        </Box>
      </Stack>

      <Stack direction="row" sx={{ typography: "subtitle1" }}>
        <div>Total</div>
        <Box sx={{ width: 160 }}>{fCurrency(totalAmount) || "-"}</Box>
      </Stack>
    </Stack>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: "text.disabled", mb: 3 }}>
        Details:
      </Typography>

      <Stack
        divider={<Divider flexItem sx={{ borderStyle: "dashed" }} />}
        spacing={3}
      >
        {fields.map((item, index) => (
          <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              sx={{ width: 1 }}
            >
              <Field.Select
                name={`orderDetails[${index}].productID`}
                size="small"
                label="Products"
                InputLabelProps={{ shrink: true }}
                sx={{ maxWidth: { md: 200 } }}
              >
                <MenuItem
                  value=""
                  onClick={() => handleClearService(index)}
                  sx={{ fontStyle: "italic", color: "text.secondary" }}
                >
                  None
                </MenuItem>

                <Divider sx={{ borderStyle: "dashed" }} />

                {products.map((product: Product) => (
                  <MenuItem
                    key={product.productID}
                    value={product.productID}
                    onClick={() => handleSelectProduct(index, product)}
                  >
                    {product.productName}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Text
                size="small"
                name={`orderDetails[${index}].unit`}
                label="Unit"
                InputLabelProps={{ shrink: true }}
              />

              <Field.Text
                size="small"
                type="number"
                name={`orderDetails[${index}].quantity`}
                label="Quantity"
                placeholder="0"
                onChange={(event: any) => handleChangeQuantity(event, index)}
                InputLabelProps={{ shrink: true }}
              />

              <Field.Text
                size="small"
                type="number"
                name={`orderDetails[${index}].purchasePrice`}
                label="Price"
                placeholder="0.00"
                onChange={(event: any) => handleChangePrice(event, index)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box
                        sx={{ typography: "subtitle2", color: "text.disabled" }}
                      >
                        đ
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />

              <Field.Text
                disabled
                size="small"
                type="number"
                name={`orderDetails[${index}].subtotal`}
                label="Total"
                placeholder="0.00"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box
                        sx={{ typography: "subtitle2", color: "text.disabled" }}
                      >
                        đ
                      </Box>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  [`& .${inputBaseClasses.input}`]: {
                    textAlign: { md: "right" },
                  },
                }}
              />
            </Stack>

            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={() => handleRemove(index)}
            >
              Remove
            </Button>
          </Stack>
        ))}
      </Stack>

      <Divider sx={{ my: 3, borderStyle: "dashed" }} />

      <Stack
        spacing={3}
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "flex-end", md: "center" }}
      >
        <Button
          size="small"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleAdd}
          sx={{ flexShrink: 0 }}
        >
          Add Item
        </Button>

        <Stack
          spacing={2}
          justifyContent="flex-end"
          direction={{ xs: "column", md: "row" }}
          sx={{ width: 1 }}
        >
          <Field.Text
            size="small"
            label="Discount(đ)"
            name="discount"
            type="number"
            sx={{ maxWidth: { md: 120 } }}
          />
          <Field.Text
            size="small"
            label="Taxes(%)"
            name="taxes"
            type="number"
            onChange={handleTaxesChange}
            sx={{ maxWidth: { md: 120 } }}
          />
        </Stack>
      </Stack>

      {renderTotal}
    </Box>
  );
}
