"use client";

import { DashboardContent } from "@/layouts/dashboard";
import { ProductNewEditForm } from "../product-new-edit-form";
import { Product } from "@/models/product/product";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { paths } from "@/routes/path";
import { Button } from "@mui/material";
import { Iconify } from "@/components/iconify";
import { useBoolean } from "@/hooks/use-boolean";
import { ProductUnitOfMeasureDialog } from "../product-unit-of-measure/product-unit-of-measure-dialog";

// ----------------------------------------------------------------------

export function ProductEditView({ product }: { product: Product }) {
  const openUOMDialog = useBoolean(false);
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          { name: "Product", href: paths.dashboard.product.root },
          { name: product?.productName },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
        action={
          <Button
            onClick={openUOMDialog.onTrue}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Unit Of Measure
          </Button>
        }
      />
      <ProductNewEditForm currentProduct={product} />
      <ProductUnitOfMeasureDialog productId={product?.productID} open={openUOMDialog.value} onClose={openUOMDialog.onFalse} />
    </DashboardContent>
  );
}
