import { getContentToneList } from "@/actions/content-tone";
import { ContentTone } from "@/sections/content-tone/types";
import { useCallback, useEffect, useState } from "react";

interface UseContentToneParams {
  tone_description?: string;
  page: number;
  pageSize: number;
}

interface UseContentTonesReturn {
  tones: ContentTone[];
  loading: boolean;
  totalCount: number;
  error: string | null;
  refetch: () => Promise<void>;
  //   refetchWithoutFilter: () => Promise<void>;
}

export function useFetchData({
  tone_description,
  page,
  pageSize,
}: UseContentToneParams): UseContentTonesReturn {
  const [tones, setTones] = useState<ContentTone[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const fetchTones = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getContentToneList({
        // searchTerm: debouncedToneSearch || undefined,
        tone_description: tone_description || undefined,
        page: page + 1,
        pageSize,
      });
      setTones(
        (data.data || []).map((item) => ({
          id: item.id,
          tone_description: item.tone_description,
        }))
      );
      setTotalCount(data.total || 0);
    } catch (error) {
      console.error("Error fetching content tones:", error);
      const errorMessage = "Không thể tải danh sách văn phong AI";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [tone_description, page, pageSize]);

  const refetch = useCallback(() => fetchTones(), [fetchTones]);

  useEffect(() => {
    fetchTones();
  }, [fetchTones]);

  return {
    tones,
    loading,
    totalCount,
    error,
    refetch,
  };
}
