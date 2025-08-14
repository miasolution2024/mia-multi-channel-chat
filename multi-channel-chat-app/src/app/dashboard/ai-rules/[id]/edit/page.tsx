import { AiRulesEditView } from '@/sections/ai-rules/view/ai-rules-edit-view';

// ----------------------------------------------------------------------

type Props = {
  params: { id: string };
};

export default function AiRulesEditPage({ params }: Props) {
  const { id } = params;

  return <AiRulesEditView ruleId={id} />;
}