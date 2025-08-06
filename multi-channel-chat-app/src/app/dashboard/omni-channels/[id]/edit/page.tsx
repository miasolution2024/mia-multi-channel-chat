import { CONFIG } from "@/config-global";
import { OmniChannel } from "@/models/omni-channel/omni-channel";
import { OmniChannelCreateEditView } from "@/sections/omni-channel/view/omni-channel-create-edit-view";
import axiosInstance, { endpoints } from "@/utils/axios";

// ----------------------------------------------------------------------

export const metadata = {
  title: `Omni Channel edit | Dashboard - ${CONFIG.appName}`,
};

type OmniChannelParams = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: OmniChannelParams) {
  const { id } = await params;

  const omnichannel = await getOmniChannel(id);

  return <OmniChannelCreateEditView currentOmniChannel={omnichannel}/>;
}

async function getOmniChannel(id: string) {
  try {
    const url = id ? `${endpoints.omniChannels.list}/${id}` : "";
    const res = await axiosInstance.get(url);
    
    return res?.data.data as OmniChannel;
  } catch (error) {
    console.error("Error during get omnichannel:", error);
    throw error;
  }
}
