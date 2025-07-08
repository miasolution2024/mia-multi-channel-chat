'use client';

import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { DashboardContent } from "@/layouts/dashboard";
import { paths } from "@/routes/path";
import { PurchaseOrderNewEditForm } from "../purchase-order-new-edit-form";




// ----------------------------------------------------------------------

export function PurchaseOrderCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new purchase order"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Purchase order', href: paths.dashboard.purchaseOrder.root },
          { name: 'New purchase order' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <PurchaseOrderNewEditForm />
    </DashboardContent>
  );
}
