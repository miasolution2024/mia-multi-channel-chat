import { CustomerJourneyEditView } from "@/sections/customer-journey/view/customer-journey-edit-view";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CustomerJourneyEditPage({ params }: Props) {
  const { id } = await params;

  return <CustomerJourneyEditView customerJourneyId={id} />;  
}
