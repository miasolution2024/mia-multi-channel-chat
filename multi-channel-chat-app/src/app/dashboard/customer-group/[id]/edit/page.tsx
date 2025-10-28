import { CustomerGroupEditView } from "@/sections/customer-group/view/customer-group-edit-view";

  type Props = {
    params: Promise<{ id: string }>;
  };

  export default async function CustomerGroupEditPage({ params }: Props) {
    const { id } = await params;

  return <CustomerGroupEditView customerGroupId={id} />;  
}
