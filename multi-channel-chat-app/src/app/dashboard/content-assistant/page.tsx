import { Metadata } from 'next';

import { ContentAssistantListView } from '@/sections/content-assistant/view';

export const metadata: Metadata = {
  title: 'Trợ lý nội dung',
};

export default function ContentAssistantPage() {
  return <ContentAssistantListView />;
}