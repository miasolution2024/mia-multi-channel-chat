import { z as zod } from "zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import { toast } from "@/components/snackbar";
import { Field, Form } from "@/components/hook-form";

import { mutate } from "swr";
import { endpoints } from "@/utils/axios";
import { ProductUnitOfMeasure } from "@/models/product/product-unit-of-measure";
import {
  createProductUnitOfMeasureAsync,
  updateProductUnitOfMeasureAsync,
} from "@/actions/product-unit-of-measure";

// ----------------------------------------------------------------------

export const ProductUnitOfMeasureSchema = zod.object({
  unit: zod.string().min(1, { message: "Unit is required!" }),
  conversionFactor: zod.number(),
  barcode: zod.string().optional(),
  purchasePrice: zod.number().optional(),
  salePrice: zod.number().optional(),
  isBaseUnit: zod.boolean().optional(),
});

type ProductUnitOfMeasureFormProps = {
  productId: string;
  currentProductUnitOfMeasure: ProductUnitOfMeasure | null;
  open: boolean;
  onClose: VoidFunction;
};

// ----------------------------------------------------------------------

export function ProductUnitOfMeasureForm({
  productId,
  currentProductUnitOfMeasure,
  open,
  onClose,
}: ProductUnitOfMeasureFormProps) {
  const defaultValues = useMemo(
    () => ({
      unit: currentProductUnitOfMeasure?.unit || "",
      barcode: currentProductUnitOfMeasure?.barcode || "",
      conversionFactor: currentProductUnitOfMeasure?.conversionFactor || 0,
      purchasePrice: currentProductUnitOfMeasure?.purchasePrice || 0,
      salePrice: currentProductUnitOfMeasure?.salePrice || 0,
      isBaseUnit: currentProductUnitOfMeasure?.isBaseUnit || false,
    }),
    [currentProductUnitOfMeasure]
  );

  const methods = useForm({
    mode: "all",
    resolver: zodResolver(ProductUnitOfMeasureSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentProductUnitOfMeasure) {
      reset(defaultValues);
    } else {
      reset({
        unit: "",
        barcode: "",
        conversionFactor: 0,
        purchasePrice: 0,
        salePrice: 0,
        isBaseUnit: false,
      });
    }
  }, [currentProductUnitOfMeasure, reset, defaultValues]);

  const onSubmit = handleSubmit(async (data) => {
    const request = {
      ...data,
      productID: productId,
    };

    const promise = currentProductUnitOfMeasure
      ? updateProductUnitOfMeasureAsync(
          currentProductUnitOfMeasure.productUnitOfMeasureID,
          request
        )
      : createProductUnitOfMeasureAsync(request);

    try {
      toast.promise(promise, {
        loading: "Loading...",
        success: currentProductUnitOfMeasure
          ? "Update success!"
          : "Create success!",
        error: currentProductUnitOfMeasure ? "Update error!" : "Create error!",
      });

      await promise;

      onClose();

      reset();
      
      mutate(
        (key) =>
          typeof key === "string" &&
          key.startsWith(endpoints.productUnitOfMeasure.list)
      );
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { maxWidth: 720 },
        },
      }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>
          {currentProductUnitOfMeasure ? "Update" : "Create"} Unit Of Measure
        </DialogTitle>

        <DialogContent>
          <Box
            paddingY={2}
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)" }}
          >
            <Field.Text name="unit" label="Unit" />
            <Field.Text
              name="conversionFactor"
              type="number"
              label="Conversion Factor"
            />
            <Field.Text
              name="purchasePrice"
              type="number"
              label="Purchase Price"
            />
            <Field.Text name="salePrice" type="number" label="Sale Price" />
            <Field.Text name="barcode" label="Bar Code" />
            <Field.Switch
              name="isBaseUnit"
              labelPlacement="start"
              label="Is Base Unit"
              sx={{ height: 1 }}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" variant="contained" loading={isSubmitting}>
            {currentProductUnitOfMeasure ? " Update" : "Create"}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
