import { CONFIG } from '@/config-global';
import { OmniChannelsListView } from '@/sections/omni-channel/view/omni-channel-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Omni Channel list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <OmniChannelsListView />;
}
