/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useCallback, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import { inputBaseClasses } from "@mui/material/InputBase";
import { SalesOrderDetail } from "@/models/sales-order/sales-order";
import { fCurrency, fPercent } from "@/utils/format-number";
import { Field } from "@/components/hook-form";
import { Iconify } from "@/components/iconify";
import { useGetProducts } from "@/actions/product";
import { Product } from "@/models/product/product";
import { ProductUnitOfMeasure } from "@/models/product/product-unit-of-measure";

// ----------------------------------------------------------------------

export function SalesOrderEditDetails() {
  const { control, setValue, watch } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "salesOrderDetails",
  });

  const values = watch();

  const { products } = useGetProducts();

  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const totalOnRow = values.salesOrderDetails.map(
    (item: SalesOrderDetail) => item.quantity * item.unitPrice
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
      unitPrice: 0,
      subtotal: 0,
    });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  const handleClearService = useCallback(
    (index: number) => {
      setValue(`salesOrderDetails[${index}].quantity`, 1);
      setValue(`salesOrderDetails[${index}].salesPrice`, 0);
      setValue(`salesOrderDetails[${index}].subTotal`, 0);
    },
    [setValue]
  );

  const handleSelectProduct = useCallback(
    (index: number, product: Product) => {
      setValue(`salesOrderDetails[${index}].productID`, product.productID);
      setValue(`salesOrderDetails[${index}].unit`, "");
      setValue(`salesOrderDetails[${index}].unitPrice`, 0);
      setValue(`salesOrderDetails[${index}].subtotal`, 0);
      setCurrentProduct(product);
    },
    [setValue]
  );

  const handleSelectProductUOM = useCallback(
    (index: number, productUOM: ProductUnitOfMeasure) => {
      setValue(`salesOrderDetails[${index}].unit`, productUOM.unit);
      setValue(`salesOrderDetails[${index}].unitPrice`, productUOM.salePrice);
      setValue(
        `salesOrderDetails[${index}].subtotal`,
        values.salesOrderDetails.map(
          (item: SalesOrderDetail) => item.quantity * item.unitPrice
        )[index]
      );
    },
    [setValue, values.salesOrderDetails]
  );

  const handleChangeQuantity = useCallback(
    (event: any, index: number) => {
      setValue(
        `salesOrderDetails[${index}].quantity`,
        Number(event.target.value)
      );
      setValue(
        `salesOrderDetails[${index}].subtotal`,
        values.salesOrderDetails.map(
          (item: SalesOrderDetail) => item.quantity * item.unitPrice
        )[index]
      );
    },
    [setValue, values.salesOrderDetails]
  );

  const handleChangePrice = useCallback(
    (event: any, index: number) => {
      setValue(
        `salesOrderDetails[${index}].salesPrice`,
        Number(event.target.value)
      );
      setValue(
        `salesOrderDetails[${index}].subtotal`,
        values.salesOrderDetails.map(
          (item: SalesOrderDetail) => item.quantity * item.unitPrice
        )[index]
      );
    },
    [setValue, values.salesOrderDetails]
  );
  const handleTaxesChange = useCallback(
    (event: any) => {
      const taxes = Number(event.target.value);

      setValue(`taxes`, taxes);
      console.log(values.salesOrderDetails);

      values.salesOrderDetails.forEach(
        (detail: SalesOrderDetail, index: number) => {
          setValue(
            `salesOrderDetails[${index}].subtotal`,
            detail.quantity * detail.unitPrice * (1 + taxes / 100)
          );
        }
      );
    },
    [setValue, values.salesOrderDetails]
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
            <Stack direction={{ xs: "column" }} spacing={2} sx={{ width: 1 }}>
              <Field.Select
                name={`salesOrderDetails[${index}].productID`}
                size="small"
                label="Products"
                InputLabelProps={{ shrink: true }}
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

              <Field.Select
                name={`salesOrderDetails[${index}].unit`}
                label="Product SKU"
                size="small"
                placeholder="Select..."
              >
                {(currentProduct?.productUnitOfMeasures || []).map(
                  (productUOM: ProductUnitOfMeasure) => (
                    <MenuItem
                      key={productUOM.productUnitOfMeasureID}
                      value={productUOM.unit}
                      onClick={() => handleSelectProductUOM(index, productUOM)}
                    >
                      {productUOM.unit}
                    </MenuItem>
                  )
                )}
              </Field.Select>

              <Field.Text
                size="small"
                type="number"
                name={`salesOrderDetails[${index}].quantity`}
                label="Quantity"
                placeholder="0"
                onChange={(event: any) => handleChangeQuantity(event, index)}
                InputLabelProps={{ shrink: true }}
              />

              <Field.Text
                disabled
                size="small"
                type="number"
                name={`salesOrderDetails[${index}].unitPrice`}
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
                sx={{
                  [`& .${inputBaseClasses.input}`]: {
                    textAlign: { md: "right" },
                  },
                }}
              />

              <Field.Text
                disabled
                size="small"
                type="number"
                name={`salesOrderDetails[${index}].subtotal`}
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
