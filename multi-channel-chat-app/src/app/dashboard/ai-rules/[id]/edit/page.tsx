import { AiRulesEditView } from "@/sections/ai-rules/view/ai-rules-edit-view";

// ----------------------------------------------------------------------

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AiRulesEditPage({ params }: Props) {
  const { id } = await params;

  return <AiRulesEditView ruleId={id} />;
}
