import { CONFIG } from '@/config-global';
import { OverviewEcommerceView } from '@/sections/dashboard/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <OverviewEcommerceView />;
}
