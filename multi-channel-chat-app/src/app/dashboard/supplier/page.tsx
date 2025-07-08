import { CONFIG } from "@/config-global";
import { SupplierListView } from "@/sections/supplier/view/supplier-list-view";

// ----------------------------------------------------------------------

export const metadata = { title: `Supplier list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <SupplierListView />;
}