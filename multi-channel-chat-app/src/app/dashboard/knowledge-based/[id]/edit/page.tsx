import { KnowledgeBasedEditView } from "@/sections/knowledge-based/view/knowledge-based-edit-view";

// ----------------------------------------------------------------------

type Props = {
  params: Promise<{ id: string }>;
};

export default async function KnowledgeBasedEditPage({ params }: Props) {
  const { id } = await params;

  return <KnowledgeBasedEditView itemId={id} />;
}
