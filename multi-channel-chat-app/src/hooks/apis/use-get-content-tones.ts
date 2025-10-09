import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/components/snackbar';
import { getContentTones } from '@/actions/content-tone';
import { ContentTone } from '@/sections/content-tone/types';

export interface UseGetContentTonesParams {
  page?: number;
  limit?: number;
}

export interface UseGetContentTonesReturn {
  data: ContentTone[];
  total: number;
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  refetch: () => Promise<void>;
  options: { value: string; label: string }[];
}

export function useGetContentTones(
  params: UseGetContentTonesParams = {}
): UseGetContentTonesReturn {
  const [data, setData] = useState<ContentTone[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { page = 1, limit = 25 } = params;

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getContentTones(page, limit);
      setData(response.data || []);
      setTotal(response.total || 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải danh sách content tone';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching content tones:', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit]);

  // Auto-fetch when parameters change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    data,
    total,
    options: data.map((item) => ({
      value: item.id,
      label: item.tone_description,
    })),
    isLoading,
    error,
    fetchData,
    refetch,
  };
}