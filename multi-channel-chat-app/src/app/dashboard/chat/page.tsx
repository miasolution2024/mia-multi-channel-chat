import { CONFIG } from "@/config-global";

import { MultiChannelChatView } from "@/sections/chat/view";

// ----------------------------------------------------------------------

export const metadata = { title: `Chat | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <MultiChannelChatView />;
}
