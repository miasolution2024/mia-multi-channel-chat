import { CONFIG } from "@/config-global";
import { CategoryListView } from "@/sections/category/view/category-list-view";

// ----------------------------------------------------------------------

export const metadata = { title: `Category list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <CategoryListView />;
}