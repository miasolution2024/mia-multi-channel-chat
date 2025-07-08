import { CONFIG } from "@/config-global";
import { InventoryTransactionListView } from "@/sections/inventory-transaction/view/inventory-transaction-list-view";

// ----------------------------------------------------------------------

export const metadata = { title: `Inventory Transaction list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <InventoryTransactionListView />;
}