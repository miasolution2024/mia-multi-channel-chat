'use client';

import { ContentToneEditView } from '@/sections/content-tone/view/content-tone-edit-view';

type Props = {
  params: {
    id: string;
  };
};

export default function ContentToneEditPage({ params }: Props) {
  return <ContentToneEditView toneId={params.id} />;
}