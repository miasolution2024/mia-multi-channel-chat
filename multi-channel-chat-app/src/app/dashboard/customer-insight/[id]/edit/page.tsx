import { CustomerInsightEditView } from "@/sections/customer-insight/view/customer-insight-edit-view";

  type Props = {
    params: Promise<{ id: string }>;
  };

  export default async function CustomerInsightEditPage({ params }: Props) {
    const { id } = await params;

  return <CustomerInsightEditView customerInsightId={id} />;  
}
