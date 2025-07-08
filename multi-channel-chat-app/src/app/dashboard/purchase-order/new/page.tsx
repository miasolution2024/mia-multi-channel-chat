
// ----------------------------------------------------------------------

import { CONFIG } from "@/config-global";
import { PurchaseOrderCreateView } from "@/sections/purchase-order/view/purchase-order-create-view";

export const metadata = { title: `Create a new purchase order | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <PurchaseOrderCreateView />;
}
