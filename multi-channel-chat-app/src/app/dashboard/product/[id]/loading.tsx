"use client";

import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { DashboardContent } from "@/layouts/dashboard";
import { ProductNewEditFormSkeleton } from "@/sections/product/product-new-edit-form-skeleton";
import { Skeleton } from "@mui/material";

// ----------------------------------------------------------------------

export default function Loading() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={<Skeleton variant="text" width={120} height={40} />}
        links={[
          { name: <Skeleton variant="text" width={50} />},
          { name: <Skeleton variant="text" width={50} /> },
          { name: <Skeleton variant="text" width={120} /> },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <ProductNewEditFormSkeleton />
    </DashboardContent>
  );
}
