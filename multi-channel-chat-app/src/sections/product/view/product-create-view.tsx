'use client';

import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { DashboardContent } from "@/layouts/dashboard";
import { paths } from "@/routes/path";
import { ProductNewEditForm } from "../product-new-edit-form";



// ----------------------------------------------------------------------

export function ProductCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new product"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Product', href: paths.dashboard.product.root },
          { name: 'New product' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <ProductNewEditForm />
    </DashboardContent>
  );
}
