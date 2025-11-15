import {
  DashboardData,
  OmniChoices,
  PagePostsData,
} from "@/sections/dashboard/type";
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

export function useGetTotalDashboardData(
  pages: OmniChoices[],
  typeData: string,
  startDate: string,
  endDate: string
) {
  const pageIds =
    pages && pages.length > 0 ? pages.map((page) => page.id).join(",") : "";
  const shouldFetch = Boolean(pageIds && startDate && endDate);
  const expectedItemCount = pages?.length ?? 0;

  let url = `${endpoints.dashboardData.list}?limit=1000&filter[omni_channels][_in]=${pageIds}&filter[start_date][_eq]=${startDate}&filter[end_date][_eq]=${endDate}&fields=id,omni_channels`;

  if (typeData === "reactions") url += `,reactions_count,prev_reactions_count`;
  if (typeData === "shares") url += `,shares_count,prev_shares_count`;
  if (typeData === "comments") url += `,comments_count,prev_comments_count`;
  if (typeData === "views") url += `,views_count,prev_views_count`;

  try {
    const { data, isLoading, error, isValidating } = useSWR(
      shouldFetch ? url : null,
      fetcher,
      {
        refreshInterval: (latestData: unknown) => {
          if (!shouldFetch) return 0;
          const latestCount =
            typeof latestData === "object" &&
            latestData !== null &&
            Array.isArray((latestData as { data?: unknown })?.data)
              ? (latestData as { data: unknown[] }).data.length ?? 0
              : 0;
          return latestCount >= expectedItemCount ? 0 : 2000;
        },
        dedupingInterval: 500,
      }
    );

    const dataCount =
      typeof data === "object" &&
      data !== null &&
      Array.isArray((data as { data?: unknown })?.data)
        ? (data as { data: unknown[] }).data.length ?? 0
        : 0;
    const hasCompleteData =
      dataCount >= expectedItemCount && expectedItemCount > 0;

    const pending =
      isLoading ||
      isValidating ||
      (shouldFetch && expectedItemCount > 0 && !hasCompleteData);

    const memoizedValue = useMemo(
      () => ({
        dashboardData: data,
        isLoading: pending,
        error: error,
      }),
      [data, error, pending]
    );
    return memoizedValue;
  } catch (error) {
    console.error("Error fetching data", error);
    throw error;
  }
}

export function useGetMultipleFacebookPageData(
  pages: OmniChoices[],
  startDate: string,
  endDate: string,
  form: string,
  method?: string
) {
  const urls = pages.map((page) =>
    form === "views" || form === "reactions"
      ? `${page.page_id}/insights?metric=${method}&access_token=${page.token}&since=${startDate}&until=${endDate}&period=day`
      : form === "shares"
      ? `${page.page_id}/posts?fields=shares,created_time&access_token=${page.token}&since=${startDate}&until=${endDate}`
      : `${page.page_id}/posts?fields=comments.summary(true).limit(0),created_time&access_token=${page.token}&since=${startDate}&until=${endDate}`
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

export function useGetPagePostsData(
  dashboardData: DashboardData[],
  pages: OmniChoices[],
  selectedCategory: string
) {
  const dashboardDataIds =
    dashboardData && dashboardData.length > 0
      ? dashboardData.map((data) => data.id).join(",")
      : "";
  const shouldFetch = Boolean(dashboardDataIds);

  const url = shouldFetch
    ? `${endpoints.pagePostsData.list}?limit=1000&filter[dashboard_data][_in]=${dashboardDataIds}&filter[categories][_eq]=${selectedCategory}`
    : null;

  try {
    const { data, isLoading, error } = useSWR(url, fetcher);

    const memoizedValue = useMemo(() => {
      //from dashboard_data.id to omni_channels
      const dashboardDataToOmniChannel = new Map<number, number>();
      dashboardData.forEach((dashData) => {
        dashboardDataToOmniChannel.set(dashData.id, dashData.omni_channels);
      });

      //from omni_channels.id to page_name
      const omniChannelToPageName = new Map<number, string>();
      pages.forEach((page) => {
        omniChannelToPageName.set(page.id, page.page_name);
      });

      //fetched data to add page names
      const postsData = (data?.data as PagePostsData[]) || [];
      const postsDataWithPageNames = postsData.map((post) => {
        const omniChannelId = dashboardDataToOmniChannel.get(
          post.dashboard_data
        );
        const pageName = omniChannelId
          ? omniChannelToPageName.get(omniChannelId) || post.omni_name
          : post.omni_name;

        return {
          ...post,
          page_name: pageName,
        };
      });

      return {
        pagePostsData: postsDataWithPageNames,
        isLoading: isLoading,
        error: error,
      };
    }, [data, isLoading, error, dashboardData, pages]);

    return memoizedValue;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
