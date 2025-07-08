import { CONFIG } from "@/config-global";
import { PurchaseOrderListView } from "@/sections/purchase-order/view/purchase-order-list-view";

// ----------------------------------------------------------------------

export const metadata = { title: `Purchase order list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <PurchaseOrderListView />;
}