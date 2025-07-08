"use client";

import { PurchaseOrder } from "@/models/purchase-order/purchase-order";
import { PurchaseOrderDetails } from "../purchase-order-details";
import { DashboardContent } from "@/layouts/dashboard";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { paths } from "@/routes/path";

// ----------------------------------------------------------------------

export function PurchaseOrderDetailsView({
  purchaseOrder,
}: {
  purchaseOrder: PurchaseOrder;
}) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={purchaseOrder?.purchaseOrderID}
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          { name: "Purchase Order", href: paths.dashboard.purchaseOrder.root },
          { name: purchaseOrder?.purchaseOrderID },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PurchaseOrderDetails purchaseOrder={purchaseOrder} />
    </DashboardContent>
  );
}
