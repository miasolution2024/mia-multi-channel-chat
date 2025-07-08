import { CONFIG } from '@/config-global';
import { ProductCreateView } from '@/sections/product/view/product-create-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new product | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <ProductCreateView />;
}
