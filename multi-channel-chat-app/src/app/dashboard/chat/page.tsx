import { CONFIG } from '@/config-global';

import { ChatView, MultiChannelChatView } from '@/sections/chat/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Chat | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <MultiChannelChatView />;
}
