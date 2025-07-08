"use client";

import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { DashboardContent } from "@/layouts/dashboard";
import { paths } from "@/routes/path";
import { PurchaseOrderNewEditForm } from "../purchase-order-new-edit-form";
import { PurchaseOrder } from "@/models/purchase-order/purchase-order";

// ----------------------------------------------------------------------

export function PurchaseOrderEditView({
  purchaseOrder,
}: {
  purchaseOrder: PurchaseOrder;
}) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          { name: "Purchase order", href: paths.dashboard.purchaseOrder.root },
          { name: purchaseOrder?.invoiceID },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <PurchaseOrderNewEditForm currentPurchaseOrder={purchaseOrder} />
    </DashboardContent>
  );
}
