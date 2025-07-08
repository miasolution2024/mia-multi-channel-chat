import { CONFIG } from '@/config-global';
import { OrderListView } from '@/sections/sales-order/view/order-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Order list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <OrderListView />;
}
