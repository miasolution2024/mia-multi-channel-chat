// ----------------------------------------------------------------------

import { CONFIG } from "@/config-global";
import { ConversationChannel } from "@/models/conversation/conversations";
import { OmniChannel } from "@/models/omni-channel/omni-channel";
import axiosInstance, { endpoints, fetcher, swrConfig } from "@/utils/axios";
import { useMemo } from "react";
import useSWR from "swr";

export function getOmniChannelsURL() {
  const queryParams = new URLSearchParams({
    fields: [
      "id",
      "page_id",
      "page_name",
      "source",
      "is_enabled",
      "expired_date",
      "company_id.id",
      "company_id.name",
    ].join(","),
    sort: "sort",
  }).toString();
  return `${endpoints.omniChannels.list}?${queryParams}`;
}

export function useGetOmniChannels() {
  const url = getOmniChannelsURL();

  const { data, isLoading, error, isValidating } = useSWR(
    url,
    fetcher,
    swrConfig,
  );
  const memoizedValue = useMemo(() => {
    return {
      omniChannels: (data?.data as OmniChannel[]) || [],
      omniChannelsLoading: isLoading,
      omniChannelsError: error,
      omniChannelsValidating: isValidating,
      omniChannelsEmpty: !isLoading && !data?.data.length,
    };
  }, [data?.data, error, isLoading, isValidating]);

  return memoizedValue;
}

export function getOmniChannelsByChannelURL(
  channel: ConversationChannel,
  companyId?: string,
  isAdmin: boolean = false,
) {
  if (!channel) return "";
  if (isAdmin) {
    const queryParams = new URLSearchParams({
      "filter[source][_eq]": channel,
      fields: ["id", "page_id", "page_name"].join(","),
      sort: "sort",
    }).toString();
    return `${endpoints.omniChannels.list}?${queryParams}`;
  } else {
    const queryParams = new URLSearchParams({
      "filter[source][_eq]": channel,
      "filter[company_id][_eq]": companyId || "",
      fields: ["id", "page_id", "page_name"].join(","),
      sort: "sort",
    }).toString();
    return `${endpoints.omniChannels.list}?${queryParams}`;
  }
}

export function useGetOmniChannelsByChannel(
  channel: ConversationChannel,
  companyId?: string,
  isAdmin: boolean = false,
) {
  console.log(channel, companyId, isAdmin);
  
  const url = getOmniChannelsByChannelURL(channel, companyId, isAdmin);

  const { data, isLoading, error, isValidating } = useSWR(
    url,
    fetcher,
    swrConfig,
  );
  const memoizedValue = useMemo(() => {
    return {
      omniChannels: (data?.data as OmniChannel[]) || [],
      omniChannelsLoading: isLoading,
      omniChannelsError: error,
      omniChannelsValidating: isValidating,
      omniChannelsEmpty: !isLoading && !data?.data.length,
    };
  }, [data?.data, error, isLoading, isValidating]);

  return memoizedValue;
}

export async function getZaloQRLoginImage(
  requestId: string,
  companyId?: string,
) {
  try {
    const url = `${CONFIG.utilitiesAPIUr}/qr-login/${requestId}?companyId=${companyId || ""}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Error during create message:", error);
    throw error;
  }
}
