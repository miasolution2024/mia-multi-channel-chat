import { ContentToneEditView } from "@/sections/content-tone/view/content-tone-edit-view";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ContentToneEditPage({ params }: Props) {
  const { id } = await params;

  return <ContentToneEditView toneId={id} />;
}
