/* eslint-disable @typescript-eslint/no-explicit-any */
import { z as zod } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useEffect } from "react";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import CardHeader from "@mui/material/CardHeader";
import InputAdornment from "@mui/material/InputAdornment";

import { toast } from "@/components/snackbar";
import { Form, Field, schemaHelper } from "@/components/hook-form";
import { Product } from "@/models/product/product";
import { useGetCategories } from "@/actions/category";
import { useGetSuppliers } from "@/actions/supplier";
import { Button, MenuItem } from "@mui/material";
import { Category } from "@/models/category/category";
import { Supplier } from "@/models/supplier/supplier";
import { useRouter } from "next/navigation";
import { paths } from "@/routes/path";
import {
  createProductAsync,
  updateProductAsync,
  useGetProductTags,
} from "@/actions/product";
import { endpoints } from "@/utils/axios";
import { mutate } from "swr";
import { ProductUnitOfMeasure } from "@/models/product/product-unit-of-measure";

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  productName: zod.string().min(1, { message: "Product name is required!" }),
  description: schemaHelper.editor({
    message: { required_error: "Description is required!" },
  }),
  productCode: zod.string(),
  categoryID: zod.string(),
  supplierID: zod.string(),
  stockQuantity: zod.number(),
  minimumStock: zod.number(),
  purchasePrice: zod.number(),
  tags: zod.string().array(),
  salePrice: zod.number(),
  unit: zod.string(),
});

// ----------------------------------------------------------------------

export function ProductNewEditForm({
  currentProduct,
}: {
  currentProduct?: Product;
}) {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      productName: currentProduct?.productName || "",
      description: currentProduct?.description || "",
      productCode: currentProduct?.productCode || "",
      unit: currentProduct?.unit || "",
      categoryID: currentProduct?.categoryID || "",
      supplierID: currentProduct?.supplierID || "",
      stockQuantity: currentProduct?.stockQuantity || 0,
      tags: currentProduct?.tags || [],
      minimumStock: currentProduct?.minimumStock || 0,
      salePrice: currentProduct?.salePrice || 0,
      purchasePrice: currentProduct?.purchasePrice || 0,
    }),
    [currentProduct]
  );

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

  const productName = watch("productName");

  useEffect(() => {
    if (productName) {
      setValue("description", productName);
    }
  }, [productName, setValue]);

  const { categories } = useGetCategories();
  const { suppliers } = useGetSuppliers();
  const { productTags } = useGetProductTags();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await (currentProduct
        ? updateProductAsync(currentProduct.productID, data)
        : createProductAsync(data));

      reset();
      toast.success(currentProduct ? "Update success!" : "Create success!");

      mutate(endpoints.products.list);

      router.push(paths.dashboard.product.root);
    } catch (error) {
      console.error(error);
    }
  });

  // const handleRemoveFile = useCallback(
  //   (inputFile: File) => {
  //     const filtered =
  //       values.images &&
  //       values.images?.filter((file: File) => file !== inputFile);
  //     setValue("images", filtered);
  //   },
  //   [setValue, values.images]
  // );

  // const handleRemoveAllFiles = useCallback(() => {
  //   setValue("images", [], { shouldValidate: true });
  // }, [setValue]);

  const renderDetails = (
    <Card>
      <CardHeader
        title="Details"
        subheader="Title, short description, image..."
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="productName" label="Product name" />

        <Field.Text name="description" label="Description" multiline rows={4} />

        {/* <Stack spacing={1.5}>
          <Typography variant="subtitle2">Images</Typography>
          <Field.Upload
            multiple
            thumbnail
            name="images"
            maxSize={3145728}
            onRemove={handleRemoveFile}
            onRemoveAll={handleRemoveAllFiles}
            onUpload={() => console.info("ON UPLOAD")}
          />
        </Stack> */}
      </Stack>
    </Card>
  );

  const renderProperties = (
    <Card>
      <CardHeader
        title="Properties"
        subheader="Additional functions and attributes..."
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
        >
          <Field.Text name="productCode" label="Product code" />

          <Field.Select name="unit" label="Product SKU" placeholder="Select...">
            {(currentProduct?.productUnitOfMeasures || []).map(
              (productUOM: ProductUnitOfMeasure) => (
                <MenuItem
                  key={productUOM.productUnitOfMeasureID}
                  value={productUOM.unit}
                >
                  {productUOM.unit}
                </MenuItem>
              )
            )}
          </Field.Select>
          <Field.Text
            name="stockQuantity"
            label="Stock Quantity"
            placeholder="0"
            type="number"
            InputLabelProps={{ shrink: true }}
          />

          <Field.Text
            name="minimumStock"
            label="Minimum Stock"
            placeholder="0"
            type="number"
            InputLabelProps={{ shrink: true }}
          />

          <Field.Select
            name="categoryID"
            label="Category"
            placeholder="Select..."
          >
            {categories.map((category: Category) => (
              <MenuItem key={category.categoryID} value={category.categoryID}>
                {category.categoryName}
              </MenuItem>
            ))}
          </Field.Select>

          <Field.Select
            name="supplierID"
            label="Supllier"
            placeholder="Select..."
          >
            {suppliers.map((supplier: Supplier) => (
              <MenuItem key={supplier.supplierID} value={supplier.supplierID}>
                {supplier.supplierName}
              </MenuItem>
            ))}
          </Field.Select>
        </Box>

        <Field.Autocomplete
          name="tags"
          label="Tags"
          placeholder="+ Tags"
          multiple
          freeSolo
          disableCloseOnSelect
          options={productTags.map((option) => option)}
          getOptionLabel={(option: any) => option}
          renderOption={(props: any, option: any) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          renderTags={(selected: any, getTagProps: any) =>
            selected.map((option: any, index: number) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={option}
                size="small"
                color="info"
                variant="soft"
              />
            ))
          }
        />

        <Divider sx={{ borderStyle: "dashed" }} />
      </Stack>
    </Card>
  );

  const renderPricing = (
    <Card>
      <CardHeader
        title="Pricing"
        subheader="Price related inputs"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text
          name="purchasePrice"
          label="Purchase price"
          placeholder="0.00"
          type="number"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Box component="span" sx={{ color: "text.disabled" }}>
                  đ
                </Box>
              </InputAdornment>
            ),
          }}
        />

        <Field.Text
          name="salePrice"
          label="Sale price"
          placeholder="0.00"
          type="number"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Box component="span" sx={{ color: "text.disabled" }}>
                  đ
                </Box>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </Card>
  );

  const renderActions = (
    <Stack
      spacing={3}
      direction="row"
      alignItems="center"
      justifyContent="end"
      flexWrap="wrap"
    >
      <Button
        type="submit"
        variant="contained"
        size="large"
        loading={isSubmitting}
      >
        {!currentProduct ? "Create product" : "Save changes"}
      </Button>
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack
        spacing={{ xs: 3, md: 5 }}
        sx={{ mx: "auto", maxWidth: { xs: 720, xl: 880 } }}
      >
        {renderDetails}

        {renderProperties}

        {renderPricing}

        {renderActions}
      </Stack>
    </Form>
  );
}
