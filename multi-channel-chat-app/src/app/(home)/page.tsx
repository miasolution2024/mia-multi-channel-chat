// ----------------------------------------------------------------------
import { CONFIG } from "@/config-global";
import { OverviewEcommerceView } from "@/sections/dashboard/view";
// import { SalesOrderCreateView } from "@/sections/sales-order/view/sales-order-create-view";
export const metadata = { title: `Home | - ${CONFIG.appName}` };

export default function Page() {
  return <OverviewEcommerceView />;
}
