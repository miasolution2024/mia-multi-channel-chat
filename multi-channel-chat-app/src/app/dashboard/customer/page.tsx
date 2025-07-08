

import { CONFIG } from "@/config-global";
import { CustomerListView } from "@/sections/customer/view/customer-list-view";

// ----------------------------------------------------------------------

export const metadata = { title: `Customer list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <CustomerListView />;
}
