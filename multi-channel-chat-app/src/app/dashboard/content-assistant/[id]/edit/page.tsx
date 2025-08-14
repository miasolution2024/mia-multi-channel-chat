'use client';

import { ContentAssistantEditView } from "@/sections/content-assistant/view/content-assistant-edit-view";


type Props = {
  params: {
    id: string;
  };
};

export default function ContentAssistantEditPage({ params }: Props) {
  return <ContentAssistantEditView contentId={params.id} />;
}