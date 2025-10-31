import { CustomerJourneyProcessEditView } from "@/sections/customer-journey-process/view/customer-journey-process-edit-view";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CustomerJourneyProcessEditPage({ params }: Props) {
  const { id } = await params;

  return <CustomerJourneyProcessEditView customerJourneyProcessId={id} />;  
}
