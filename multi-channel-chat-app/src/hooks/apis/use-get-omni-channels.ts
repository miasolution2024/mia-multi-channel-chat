import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/components/snackbar';
import { getOmniChannels } from '@/actions/omni-channels';
import { OmniChannel } from '@/sections/omni-channel/types';

export interface UseGetOmniChannelsParams {
  page?: number;
  limit?: number;
  status?: string;
}

export interface UseGetOmniChannelsReturn {
  data: OmniChannel[];
  total: number;
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  refetch: () => Promise<void>;
  options: { value: string; label: string }[];
}

export function useGetOmniChannels(
  params: UseGetOmniChannelsParams = {}
): UseGetOmniChannelsReturn {
  const [data, setData] = useState<OmniChannel[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { page = 1, limit = 25, status } = params;

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getOmniChannels(page, limit, status);
      setData(response.data || []);
      setTotal(response.data?.length || 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải danh sách kênh omni';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching omni channels:', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, status]);

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
      value: item.id.toString(),
      label: item.page_name || item.source,
    })),
    isLoading,
    error,
    fetchData,
    refetch,
  };
}