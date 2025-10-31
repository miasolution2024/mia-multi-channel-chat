import { endpoints, facebookFetcher, fetcher } from "@/utils/axios";
import { useMemo } from "react";
import useSWR from "swr";

export function useGetPostSocialChannel() {
  const postSocialUrl = `${endpoints.omniChannels.list}?fields=id,page_id,page_name,token,source&filter[source][_eq]=Facebook&limit=1000&filter[hasPostsocial][_eq]=true`;

  try {
    const { data, isLoading, error } = useSWR(postSocialUrl, fetcher);

    const memoizedValue = useMemo(
      () => ({
        postSocialData: data,
        isLoading: isLoading,
        error: error,
      }),
      [data, error, isLoading]
    );
    return memoizedValue;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export function useGetMultipleFacebookPageData(
  pages: Array<{ page_id: string; token: string }>,
  method: string,
  startDate: string,
  endDate: string,
  form: string
) {
  const urls = pages.map((page) =>
    form !== "chart"
      ? `${page.page_id}/insights?metric=${method}&access_token=${page.token}&since=${startDate}&until=${endDate}&period=total_over_range`
      : `${page.page_id}/insights?metric=${method}&access_token=${page.token}&since=${startDate}&until=${endDate}&period=day`
  );

  const { data, isLoading, error } = useSWR(
    urls.length > 0 ? urls : null,
    async (urls) => {
      const results = await Promise.all(
        urls.map((url) => facebookFetcher(url))
      );
      return results;
    }
  );

  console.log(data);

  const memoizedValue = useMemo(
    () => ({
      fbPageData: data,
      isLoading: isLoading,
      error: error,
    }),
    [data, isLoading, error]
  );
  return memoizedValue;
}
