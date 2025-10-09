import CampaignEditView from "@/sections/marketing-campaign/view/campaign-edit-view";

interface CampaignEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function CampaignEditPage({ params }: CampaignEditPageProps) {
  const { id } = await params;
  
  return <CampaignEditView campaignId={id} />;
}