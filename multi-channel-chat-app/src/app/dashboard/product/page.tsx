

import { CONFIG } from "@/config-global";
import { ProductListView } from "@/sections/product/view/product-list-view";

// ----------------------------------------------------------------------

export const metadata = { title: `Product list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <ProductListView />;
}
